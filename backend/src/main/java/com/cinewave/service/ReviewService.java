package com.cinewave.service;

import com.cinewave.dto.ReviewCreateDTO;
import com.cinewave.dto.ReviewDTO;
import com.cinewave.entity.Movie;
import com.cinewave.entity.Review;
import com.cinewave.entity.User;
import com.cinewave.exception.BadRequestException;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.MovieRepository;
import com.cinewave.repository.ReviewRepository;
import com.cinewave.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         MovieRepository movieRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByMovie(Long movieId) {
        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId).stream()
                .map(EntityDtoMapper::toReviewDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDTO addReview(Long userId, Long movieId, ReviewCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + movieId));

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5 stars");
        }

        Review review = new Review(user, movie, dto.getRating(), dto.getComment());
        Review saved = reviewRepository.save(review);

        // Update movie average rating
        List<Review> allMovieReviews = reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
        double avg = allMovieReviews.stream().mapToInt(Review::getRating).average().orElse(dto.getRating());
        movie.setRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP));
        movieRepository.save(movie);

        return EntityDtoMapper.toReviewDTO(saved);
    }
}
