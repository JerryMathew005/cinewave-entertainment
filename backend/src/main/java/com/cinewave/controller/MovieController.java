package com.cinewave.controller;

import com.cinewave.dto.MovieCreateDTO;
import com.cinewave.dto.MovieDTO;
import com.cinewave.entity.MovieStatus;
import com.cinewave.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@Tag(name = "Movies", description = "Movie catalog, discovery, filtering, and admin CRUD")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    @Operation(summary = "Get all movies with optional filters (title, genre, language, status)")
    public ResponseEntity<List<MovieDTO>> getAllMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) MovieStatus status) {
        return ResponseEntity.ok(movieService.getAllMovies(title, genre, language, status));
    }

    @GetMapping("/now-showing")
    @Operation(summary = "Get movies currently showing in theatres")
    public ResponseEntity<List<MovieDTO>> getNowShowingMovies() {
        return ResponseEntity.ok(movieService.getNowShowingMovies());
    }

    @GetMapping("/coming-soon")
    @Operation(summary = "Get upcoming movies")
    public ResponseEntity<List<MovieDTO>> getComingSoonMovies() {
        return ResponseEntity.ok(movieService.getComingSoonMovies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single movie details by ID")
    public ResponseEntity<MovieDTO> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new movie (Admin only)")
    public ResponseEntity<MovieDTO> createMovie(@Valid @RequestBody MovieCreateDTO dto) {
        MovieDTO created = movieService.createMovie(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update movie details (Admin only)")
    public ResponseEntity<MovieDTO> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieCreateDTO dto) {
        return ResponseEntity.ok(movieService.updateMovie(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete movie by ID (Admin only)")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
