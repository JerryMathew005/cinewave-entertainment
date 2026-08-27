package com.cinewave.dto;

import com.cinewave.entity.TheatreStatus;
import jakarta.validation.constraints.NotBlank;

public class TheatreCreateDTO {
    @NotBlank(message = "Theatre name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private TheatreStatus status = TheatreStatus.ACTIVE;

    public TheatreCreateDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public TheatreStatus getStatus() { return status; }
    public void setStatus(TheatreStatus status) { this.status = status; }
}
