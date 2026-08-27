package com.cinewave.controller;

import com.cinewave.dto.ScreenDTO;
import com.cinewave.dto.TheatreCreateDTO;
import com.cinewave.dto.TheatreDTO;
import com.cinewave.service.TheatreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Theatres & Screens", description = "Cinema locations, screens, and auditoriums")
public class TheatreController {

    private final TheatreService theatreService;

    public TheatreController(TheatreService theatreService) {
        this.theatreService = theatreService;
    }

    @GetMapping("/theatres")
    @Operation(summary = "Get all theatres with optional city filter")
    public ResponseEntity<List<TheatreDTO>> getAllTheatres(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(theatreService.getAllTheatres(city));
    }

    @GetMapping("/theatres/{id}")
    @Operation(summary = "Get theatre by ID")
    public ResponseEntity<TheatreDTO> getTheatreById(@PathVariable Long id) {
        return ResponseEntity.ok(theatreService.getTheatreById(id));
    }

    @GetMapping("/theatres/{theatreId}/screens")
    @Operation(summary = "Get all screens for a specific theatre")
    public ResponseEntity<List<ScreenDTO>> getScreensByTheatreId(@PathVariable Long theatreId) {
        return ResponseEntity.ok(theatreService.getScreensByTheatreId(theatreId));
    }

    @PostMapping("/theatres")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new theatre (Admin only)")
    public ResponseEntity<TheatreDTO> createTheatre(@Valid @RequestBody TheatreCreateDTO dto) {
        TheatreDTO created = theatreService.createTheatre(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/theatres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update theatre details (Admin only)")
    public ResponseEntity<TheatreDTO> updateTheatre(@PathVariable Long id, @Valid @RequestBody TheatreCreateDTO dto) {
        return ResponseEntity.ok(theatreService.updateTheatre(id, dto));
    }

    @DeleteMapping("/theatres/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete theatre (Admin only)")
    public ResponseEntity<Void> deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/screens")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new screen to a theatre (Admin only)")
    public ResponseEntity<ScreenDTO> createScreen(@Valid @RequestBody ScreenDTO dto) {
        ScreenDTO created = theatreService.createScreen(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/screens/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a screen (Admin only)")
    public ResponseEntity<Void> deleteScreen(@PathVariable Long id) {
        theatreService.deleteScreen(id);
        return ResponseEntity.noContent().build();
    }
}
