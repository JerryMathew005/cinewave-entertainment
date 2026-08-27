package com.cinewave.dto;

import java.math.BigDecimal;
import java.util.List;

public class BookingCostBreakdownDTO {
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal serviceFee = BigDecimal.ZERO;
    private BigDecimal tax = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private Integer seatCount = 0;
    private List<SeatDTO> selectedSeats;
    private String couponCode;
    private Boolean couponApplied = false;
    private String couponMessage;

    public BookingCostBreakdownDTO() {}

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Integer getSeatCount() { return seatCount; }
    public void setSeatCount(Integer seatCount) { this.seatCount = seatCount; }

    public List<SeatDTO> getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(List<SeatDTO> selectedSeats) { this.selectedSeats = selectedSeats; }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }

    public Boolean getCouponApplied() { return couponApplied; }
    public void setCouponApplied(Boolean couponApplied) { this.couponApplied = couponApplied; }

    public String getCouponMessage() { return couponMessage; }
    public void setCouponMessage(String couponMessage) { this.couponMessage = couponMessage; }
}
