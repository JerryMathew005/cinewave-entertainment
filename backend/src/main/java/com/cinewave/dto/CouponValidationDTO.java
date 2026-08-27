package com.cinewave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CouponValidationDTO {
    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Booking amount is required")
    private BigDecimal bookingAmount;

    public CouponValidationDTO() {}

    public CouponValidationDTO(String code, BigDecimal bookingAmount) {
        this.code = code;
        this.bookingAmount = bookingAmount;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getBookingAmount() { return bookingAmount; }
    public void setBookingAmount(BigDecimal bookingAmount) { this.bookingAmount = bookingAmount; }
}
