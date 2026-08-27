package com.cinewave.controller;

import com.cinewave.dto.ReviewCreateDTO;
import com.cinewave.dto.ReviewDTO;
import com.cinewave.security.UserPrincipal;
import com.cinewave.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/{movieId}/reviews")
@Tag(name = "Reviews", description = "Customer movie ratings and written feedback")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get all customer reviews and ratings for a movie")
    public ResponseEntity<List<ReviewDTO>> getMovieReviews(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.getReviewsByMovie(movieId));
    }

    @PostMapping
    @Operation(summary = "Add a rating and review for a movie")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long movieId,
            @Valid @RequestBody ReviewCreateDTO dto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ReviewDTO created = reviewService.addReview(currentUser.getId(), movieId, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
