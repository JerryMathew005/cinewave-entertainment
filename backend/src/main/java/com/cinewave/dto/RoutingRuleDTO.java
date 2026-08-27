package com.cinewave.dto;

public class RoutingRuleDTO {
    private Long id;
    private String showType;
    private String teamName;
    private Boolean active;

    public RoutingRuleDTO() {}

    public RoutingRuleDTO(Long id, String showType, String teamName, Boolean active) {
        this.id = id;
        this.showType = showType;
        this.teamName = teamName;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShowType() { return showType; }
    public void setShowType(String showType) { this.showType = showType; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
