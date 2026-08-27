package com.cinewave.service;

import com.cinewave.dto.CouponDTO;
import com.cinewave.dto.CouponValidationDTO;
import com.cinewave.entity.Coupon;
import com.cinewave.entity.CouponStatus;
import com.cinewave.entity.DiscountType;
import com.cinewave.exception.BadRequestException;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> validateCoupon(CouponValidationDTO dto) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(dto.getCode().trim())
                .orElseThrow(() -> new BadRequestException("Coupon code '" + dto.getCode() + "' does not exist"));

        LocalDate today = LocalDate.now();
        if (coupon.getStatus() != CouponStatus.ACTIVE || today.isBefore(coupon.getStartDate()) || today.isAfter(coupon.getExpiryDate())) {
            throw new BadRequestException("Coupon is expired or inactive");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Coupon usage limit has been exceeded");
        }

        if (coupon.getMinimumAmount() != null && dto.getBookingAmount().compareTo(coupon.getMinimumAmount()) < 0) {
            throw new BadRequestException("Minimum booking amount of ₹" + coupon.getMinimumAmount() + " required");
        }

        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = dto.getBookingAmount().multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaximumDiscount() != null && discount.compareTo(coupon.getMaximumDiscount()) > 0) {
                discount = coupon.getMaximumDiscount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("code", coupon.getCode());
        result.put("discount", discount);
        result.put("message", "Coupon applied successfully!");
        return result;
    }

    @Transactional(readOnly = true)
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(EntityDtoMapper::toCouponDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CouponDTO createCoupon(CouponDTO dto) {
        if (couponRepository.findByCodeIgnoreCase(dto.getCode()).isPresent()) {
            throw new BadRequestException("Coupon code already exists: " + dto.getCode());
        }

        Coupon coupon = new Coupon();
        coupon.setCode(dto.getCode().toUpperCase().trim());
        coupon.setDiscountType(dto.getDiscountType() != null ? dto.getDiscountType() : DiscountType.PERCENTAGE);
        coupon.setDiscountValue(dto.getDiscountValue());
        coupon.setMinimumAmount(dto.getMinimumAmount() != null ? dto.getMinimumAmount() : BigDecimal.ZERO);
        coupon.setMaximumDiscount(dto.getMaximumDiscount() != null ? dto.getMaximumDiscount() : BigDecimal.valueOf(500));
        coupon.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDate.now());
        coupon.setExpiryDate(dto.getExpiryDate() != null ? dto.getExpiryDate() : LocalDate.now().plusMonths(3));
        coupon.setUsageLimit(dto.getUsageLimit() != null ? dto.getUsageLimit() : 100);
        coupon.setStatus(dto.getStatus() != null ? dto.getStatus() : CouponStatus.ACTIVE);

        Coupon saved = couponRepository.save(coupon);
        return EntityDtoMapper.toCouponDTO(saved);
    }

    @Transactional
    public CouponDTO updateCoupon(Long id, CouponDTO dto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        if (dto.getDiscountType() != null) coupon.setDiscountType(dto.getDiscountType());
        if (dto.getDiscountValue() != null) coupon.setDiscountValue(dto.getDiscountValue());
        if (dto.getMinimumAmount() != null) coupon.setMinimumAmount(dto.getMinimumAmount());
        if (dto.getMaximumDiscount() != null) coupon.setMaximumDiscount(dto.getMaximumDiscount());
        if (dto.getStartDate() != null) coupon.setStartDate(dto.getStartDate());
        if (dto.getExpiryDate() != null) coupon.setExpiryDate(dto.getExpiryDate());
        if (dto.getUsageLimit() != null) coupon.setUsageLimit(dto.getUsageLimit());
        if (dto.getStatus() != null) coupon.setStatus(dto.getStatus());

        Coupon updated = couponRepository.save(coupon);
        return EntityDtoMapper.toCouponDTO(updated);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        couponRepository.delete(coupon);
    }
}
