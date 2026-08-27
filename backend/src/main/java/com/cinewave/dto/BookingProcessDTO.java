package com.cinewave.dto;

import jakarta.validation.constraints.NotBlank;

public class BookingProcessDTO {
    @NotBlank(message = "Action is required (CONFIRM or REJECT)")
    private String action;

    private String comment;
    private String staffName;

    public BookingProcessDTO() {}

    public BookingProcessDTO(String action, String comment, String staffName) {
        this.action = action;
        this.comment = comment;
        this.staffName = staffName;
    }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
}
