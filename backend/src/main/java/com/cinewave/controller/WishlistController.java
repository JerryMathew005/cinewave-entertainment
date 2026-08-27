package com.cinewave.controller;

import com.cinewave.dto.WishlistDTO;
import com.cinewave.security.UserPrincipal;
import com.cinewave.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Customer favorite and bookmarked movies")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get movie wishlist for current user")
    public ResponseEntity<List<WishlistDTO>> getMyWishlist(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(currentUser.getId()));
    }

    @GetMapping("/check/{movieId}")
    @Operation(summary = "Check if a movie is in current user's wishlist")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @PathVariable Long movieId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Map<String, Boolean> result = new HashMap<>();
        result.put("inWishlist", wishlistService.isInWishlist(currentUser.getId(), movieId));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{movieId}")
    @Operation(summary = "Add a movie to wishlist")
    public ResponseEntity<WishlistDTO> addToWishlist(
            @PathVariable Long movieId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        WishlistDTO dto = wishlistService.addToWishlist(currentUser.getId(), movieId);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{movieId}")
    @Operation(summary = "Remove a movie from wishlist")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long movieId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        wishlistService.removeFromWishlist(currentUser.getId(), movieId);
        return ResponseEntity.noContent().build();
    }
}
