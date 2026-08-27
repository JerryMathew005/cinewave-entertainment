package com.cinewave.dto;

import com.cinewave.entity.BookingStatus;
import com.cinewave.entity.PaymentStatus;
import com.cinewave.entity.SlaStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BookingResponseDTO {
    private Long id;
    private String bookingReference;
    private UserDTO user;
    private ShowDTO show;
    private BigDecimal totalAmount;
    private BigDecimal subtotal;
    private BigDecimal serviceFee;
    private BigDecimal tax;
    private BigDecimal discount;
    private BookingStatus status;
    private LocalDateTime slaStartTime;
    private LocalDateTime slaDeadline;
    private SlaStatus slaStatus;
    private Long remainingSlaSeconds;
    private String assignedTeam;
    private String assignedStaff;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
    private List<SeatDTO> seats = new ArrayList<>();
    private List<AuditLogDTO> auditLogs = new ArrayList<>();

    public BookingResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }

    public ShowDTO getShow() { return show; }
    public void setShow(ShowDTO show) { this.show = show; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getServiceFee() { return serviceFee; }
    public void setServiceFee(BigDecimal serviceFee) { this.serviceFee = serviceFee; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getSlaStartTime() { return slaStartTime; }
    public void setSlaStartTime(LocalDateTime slaStartTime) { this.slaStartTime = slaStartTime; }

    public LocalDateTime getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; }

    public SlaStatus getSlaStatus() { return slaStatus; }
    public void setSlaStatus(SlaStatus slaStatus) { this.slaStatus = slaStatus; }

    public Long getRemainingSlaSeconds() { return remainingSlaSeconds; }
    public void setRemainingSlaSeconds(Long remainingSlaSeconds) { this.remainingSlaSeconds = remainingSlaSeconds; }

    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }

    public String getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public List<SeatDTO> getSeats() { return seats; }
    public void setSeats(List<SeatDTO> seats) { this.seats = seats; }

    public List<AuditLogDTO> getAuditLogs() { return auditLogs; }
    public void setAuditLogs(List<AuditLogDTO> auditLogs) { this.auditLogs = auditLogs; }
}
