package com.cinewave.dto;

import com.cinewave.entity.ShowStatus;
import com.cinewave.entity.ShowType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class ShowDTO {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private String moviePoster;
    private Integer movieDuration;
    private Long theatreId;
    private String theatreName;
    private String theatreCity;
    private Long screenId;
    private String screenName;
    private ShowType showType;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal basePrice;
    private ShowStatus status;
    private Integer availableSeats;
    private Integer totalSeats;

    public ShowDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getMoviePoster() { return moviePoster; }
    public void setMoviePoster(String moviePoster) { this.moviePoster = moviePoster; }

    public Integer getMovieDuration() { return movieDuration; }
    public void setMovieDuration(Integer movieDuration) { this.movieDuration = movieDuration; }

    public Long getTheatreId() { return theatreId; }
    public void setTheatreId(Long theatreId) { this.theatreId = theatreId; }

    public String getTheatreName() { return theatreName; }
    public void setTheatreName(String theatreName) { this.theatreName = theatreName; }

    public String getTheatreCity() { return theatreCity; }
    public void setTheatreCity(String theatreCity) { this.theatreCity = theatreCity; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }

    public ShowType getShowType() { return showType; }
    public void setShowType(ShowType showType) { this.showType = showType; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public ShowStatus getStatus() { return status; }
    public void setStatus(ShowStatus status) { this.status = status; }

    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
}
