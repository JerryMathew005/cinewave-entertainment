package com.cinewave.dto;

import com.cinewave.entity.SeatStatus;
import com.cinewave.entity.SeatType;
import java.math.BigDecimal;

public class SeatDTO {
    private Long id;
    private Long screenId;
    private String seatNumber;
    private String rowName;
    private SeatType seatType;
    private BigDecimal price;
    private SeatStatus status;
    private Boolean isBooked = false;

    public SeatDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getRowName() { return rowName; }
    public void setRowName(String rowName) { this.rowName = rowName; }

    public SeatType getSeatType() { return seatType; }
    public void setSeatType(SeatType seatType) { this.seatType = seatType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public SeatStatus getStatus() { return status; }
    public void setStatus(SeatStatus status) { this.status = status; }

    public Boolean getIsBooked() { return isBooked; }
    public void setIsBooked(Boolean isBooked) { this.isBooked = isBooked; }
}
