package com.cinewave.service;

import com.cinewave.dto.BookingCostBreakdownDTO;
import com.cinewave.dto.CostCalculationRequestDTO;
import com.cinewave.dto.SeatDTO;
import com.cinewave.entity.Coupon;
import com.cinewave.entity.CouponStatus;
import com.cinewave.entity.DiscountType;
import com.cinewave.entity.Seat;
import com.cinewave.entity.Show;
import com.cinewave.exception.BadRequestException;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.CouponRepository;
import com.cinewave.repository.SeatRepository;
import com.cinewave.repository.ShowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CostCalculationService {

    private static final BigDecimal CONVENIENCE_FEE_RATE = new BigDecimal("0.10"); // 10%
    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");            // 18% GST

    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final CouponRepository couponRepository;

    public CostCalculationService(ShowRepository showRepository,
                                  SeatRepository seatRepository,
                                  CouponRepository couponRepository) {
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.couponRepository = couponRepository;
    }

    @Transactional(readOnly = true)
    public BookingCostBreakdownDTO calculateCost(CostCalculationRequestDTO request) {
        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + request.getShowId()));

        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            throw new BadRequestException("At least one seat must be selected for cost calculation");
        }

        List<Seat> selectedSeats = seatRepository.findByIdIn(request.getSeatIds());
        if (selectedSeats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("One or more selected seats could not be found");
        }

        // Validate that all seats belong to the show's screen
        for (Seat seat : selectedSeats) {
            if (!seat.getScreen().getId().equals(show.getScreen().getId())) {
                throw new BadRequestException("Seat " + seat.getSeatNumber() + " does not belong to the selected show screen");
            }
        }

        // Subtotal = Sum of seat prices (using Seat.price or show basePrice)
        BigDecimal subtotal = BigDecimal.ZERO;
        for (Seat seat : selectedSeats) {
            BigDecimal seatPrice = seat.getPrice() != null && seat.getPrice().compareTo(BigDecimal.ZERO) > 0
                    ? seat.getPrice()
                    : show.getBasePrice();
            subtotal = subtotal.add(seatPrice);
        }

        // Service fee = 10% of subtotal
        BigDecimal serviceFee = subtotal.multiply(CONVENIENCE_FEE_RATE).setScale(2, RoundingMode.HALF_UP);

        // Tax = 18% of (subtotal + service fee)
        BigDecimal taxableAmount = subtotal.add(serviceFee);
        BigDecimal tax = taxableAmount.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);

        // Discount calculation if coupon provided
        BigDecimal discount = BigDecimal.ZERO;
        boolean couponApplied = false;
        String couponMessage = null;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                LocalDate today = LocalDate.now();
                if (coupon.getStatus() == CouponStatus.ACTIVE &&
                        !today.isBefore(coupon.getStartDate()) &&
                        !today.isAfter(coupon.getExpiryDate())) {

                    if (coupon.getUsageLimit() == null || coupon.getUsedCount() < coupon.getUsageLimit()) {
                        if (coupon.getMinimumAmount() == null || subtotal.compareTo(coupon.getMinimumAmount()) >= 0) {
                            if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
                                BigDecimal calculatedDiscount = subtotal.multiply(coupon.getDiscountValue())
                                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                                if (coupon.getMaximumDiscount() != null && calculatedDiscount.compareTo(coupon.getMaximumDiscount()) > 0) {
                                    discount = coupon.getMaximumDiscount();
                                } else {
                                    discount = calculatedDiscount;
                                }
                            } else {
                                discount = coupon.getDiscountValue();
                            }
                            couponApplied = true;
                            couponMessage = "Coupon " + coupon.getCode() + " applied successfully!";
                        } else {
                            couponMessage = "Minimum booking subtotal of ₹" + coupon.getMinimumAmount() + " required for this coupon.";
                        }
                    } else {
                        couponMessage = "Coupon usage limit has been reached.";
                    }
                } else {
                    couponMessage = "Coupon is expired or inactive.";
                }
            } else {
                couponMessage = "Invalid coupon code.";
            }
        }

        // Final total: Subtotal + Service Fee + Tax - Discount
        BigDecimal totalAmount = subtotal.add(serviceFee).add(tax).subtract(discount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }
        totalAmount = totalAmount.setScale(2, RoundingMode.HALF_UP);

        BookingCostBreakdownDTO breakdown = new BookingCostBreakdownDTO();
        breakdown.setSubtotal(subtotal);
        breakdown.setServiceFee(serviceFee);
        breakdown.setTax(tax);
        breakdown.setDiscount(discount);
        breakdown.setTotalAmount(totalAmount);
        breakdown.setSeatCount(selectedSeats.size());
        breakdown.setSelectedSeats(selectedSeats.stream().map(s -> EntityDtoMapper.toSeatDTO(s, false)).collect(Collectors.toList()));
        breakdown.setCouponCode(request.getCouponCode());
        breakdown.setCouponApplied(couponApplied);
        breakdown.setCouponMessage(couponMessage);

        return breakdown;
    }
}
