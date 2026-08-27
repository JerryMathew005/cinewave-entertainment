package com.cinewave.controller;

import com.cinewave.dto.ShowCreateDTO;
import com.cinewave.dto.ShowDTO;
import com.cinewave.entity.ShowStatus;
import com.cinewave.service.ShowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
@Tag(name = "Shows", description = "Show schedules, timings, and prices across screens")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @GetMapping
    @Operation(summary = "Get all shows with optional filters (movieId, theatreId, showDate, status)")
    public ResponseEntity<List<ShowDTO>> getAllShows(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long theatreId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate showDate,
            @RequestParam(required = false) ShowStatus status) {
        return ResponseEntity.ok(showService.getAllShows(movieId, theatreId, showDate, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single show details by ID")
    public ResponseEntity<ShowDTO> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getShowById(id));
    }

    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get available shows for a given movie")
    public ResponseEntity<List<ShowDTO>> getShowsByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showService.getShowsByMovie(movieId));
    }

    @GetMapping("/theatre/{theatreId}")
    @Operation(summary = "Get available shows for a given theatre")
    public ResponseEntity<List<ShowDTO>> getShowsByTheatre(@PathVariable Long theatreId) {
        return ResponseEntity.ok(showService.getShowsByTheatre(theatreId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Schedule a new show (Admin only)")
    public ResponseEntity<ShowDTO> createShow(@Valid @RequestBody ShowCreateDTO dto) {
        ShowDTO created = showService.createShow(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update show details (Admin only)")
    public ResponseEntity<ShowDTO> updateShow(@PathVariable Long id, @Valid @RequestBody ShowCreateDTO dto) {
        return ResponseEntity.ok(showService.updateShow(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete show by ID (Admin only)")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }
}
