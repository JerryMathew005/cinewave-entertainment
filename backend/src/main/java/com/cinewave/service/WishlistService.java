package com.cinewave.service;

import com.cinewave.dto.WishlistDTO;
import com.cinewave.entity.Movie;
import com.cinewave.entity.User;
import com.cinewave.entity.Wishlist;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.MovieRepository;
import com.cinewave.repository.UserRepository;
import com.cinewave.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           MovieRepository movieRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<WishlistDTO> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(EntityDtoMapper::toWishlistDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistDTO addToWishlist(Long userId, Long movieId) {
        if (wishlistRepository.existsByUserIdAndMovieId(userId, movieId)) {
            Wishlist existing = wishlistRepository.findByUserIdAndMovieId(userId, movieId).get();
            return EntityDtoMapper.toWishlistDTO(existing);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + movieId));

        Wishlist wishlist = new Wishlist(user, movie);
        Wishlist saved = wishlistRepository.save(wishlist);
        return EntityDtoMapper.toWishlistDTO(saved);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long movieId) {
        wishlistRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(Long userId, Long movieId) {
        return wishlistRepository.existsByUserIdAndMovieId(userId, movieId);
    }
}
