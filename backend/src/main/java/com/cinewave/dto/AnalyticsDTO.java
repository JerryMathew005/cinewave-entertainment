package com.cinewave.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsDTO {
    private Long totalUsers;
    private Long totalMovies;
    private Long totalTheatres;
    private Long totalShows;
    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long cancelledBookings;
    private Long slaBreaches;
    private Double totalRevenue;
    private List<Map<String, Object>> popularMovies;
    private List<Map<String, Object>> monthlyBookings;
    private Map<String, Long> statusDistribution;
    private List<Map<String, Object>> theatreOccupancy;

    public AnalyticsDTO() {}

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalMovies() { return totalMovies; }
    public void setTotalMovies(Long totalMovies) { this.totalMovies = totalMovies; }

    public Long getTotalTheatres() { return totalTheatres; }
    public void setTotalTheatres(Long totalTheatres) { this.totalTheatres = totalTheatres; }

    public Long getTotalShows() { return totalShows; }
    public void setTotalShows(Long totalShows) { this.totalShows = totalShows; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(Long pendingBookings) { this.pendingBookings = pendingBookings; }

    public Long getConfirmedBookings() { return confirmedBookings; }
    public void setConfirmedBookings(Long confirmedBookings) { this.confirmedBookings = confirmedBookings; }

    public Long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(Long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public Long getSlaBreaches() { return slaBreaches; }
    public void setSlaBreaches(Long slaBreaches) { this.slaBreaches = slaBreaches; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<Map<String, Object>> getPopularMovies() { return popularMovies; }
    public void setPopularMovies(List<Map<String, Object>> popularMovies) { this.popularMovies = popularMovies; }

    public List<Map<String, Object>> getMonthlyBookings() { return monthlyBookings; }
    public void setMonthlyBookings(List<Map<String, Object>> monthlyBookings) { this.monthlyBookings = monthlyBookings; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }

    public List<Map<String, Object>> getTheatreOccupancy() { return theatreOccupancy; }
    public void setTheatreOccupancy(List<Map<String, Object>> theatreOccupancy) { this.theatreOccupancy = theatreOccupancy; }
}
