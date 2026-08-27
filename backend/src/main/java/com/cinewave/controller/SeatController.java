package com.cinewave.controller;

import com.cinewave.dto.SeatDTO;
import com.cinewave.service.SeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Seats", description = "Cinema seating arrangements and real-time show availability")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/screens/{screenId}/seats")
    @Operation(summary = "Get all seats configured for a specific screen")
    public ResponseEntity<List<SeatDTO>> getSeatsByScreen(@PathVariable Long screenId) {
        return ResponseEntity.ok(seatService.getSeatsByScreenId(screenId));
    }

    @GetMapping("/shows/{showId}/seats")
    @Operation(summary = "US-002: Check show availability with real-time seat booked/available status")
    public ResponseEntity<List<SeatDTO>> getSeatsForShow(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getSeatsForShow(showId));
    }

    @PostMapping("/seats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a seat (Admin only)")
    public ResponseEntity<SeatDTO> createSeat(@RequestBody SeatDTO dto) {
        SeatDTO created = seatService.createSeat(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/seats/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update seat details or status (Admin only)")
    public ResponseEntity<SeatDTO> updateSeat(@PathVariable Long id, @RequestBody SeatDTO dto) {
        return ResponseEntity.ok(seatService.updateSeat(id, dto));
    }
}
