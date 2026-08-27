package com.cinewave.dto;

import java.time.LocalDateTime;

public class WishlistDTO {
    private Long id;
    private Long userId;
    private MovieDTO movie;
    private LocalDateTime createdAt;

    public WishlistDTO() {}

    public WishlistDTO(Long id, Long userId, MovieDTO movie, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.movie = movie;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public MovieDTO getMovie() { return movie; }
    public void setMovie(MovieDTO movie) { this.movie = movie; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
