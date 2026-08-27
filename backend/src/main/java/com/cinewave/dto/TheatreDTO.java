package com.cinewave.dto;

import com.cinewave.entity.TheatreStatus;

public class TheatreDTO {
    private Long id;
    private String name;
    private String location;
    private String address;
    private String city;
    private String state;
    private TheatreStatus status;
    private Integer screenCount = 0;

    public TheatreDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getScreenCount() { return screenCount; }
    public void setScreenCount(Integer screenCount) { this.screenCount = screenCount; }
}
