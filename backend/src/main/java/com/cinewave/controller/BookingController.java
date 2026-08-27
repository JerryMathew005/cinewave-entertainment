package com.cinewave.controller;

import com.cinewave.dto.*;
import com.cinewave.entity.BookingStatus;
import com.cinewave.entity.SlaStatus;
import com.cinewave.security.UserPrincipal;
import com.cinewave.service.BookingService;
import com.cinewave.service.CostCalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Bookings", description = "Movie booking lifecycle (US-001, US-002, US-003, US-004, US-006, US-007, US-009, US-010)")
public class BookingController {

    private final BookingService bookingService;
    private final CostCalculationService costCalculationService;

    public BookingController(BookingService bookingService, CostCalculationService costCalculationService) {
        this.bookingService = bookingService;
        this.costCalculationService = costCalculationService;
    }

    @PostMapping("/bookings/calculate-cost")
    @Operation(summary = "US-003: Calculate booking cost (subtotal, convenience fee, tax, discount, total)")
    public ResponseEntity<BookingCostBreakdownDTO> calculateCost(@Valid @RequestBody CostCalculationRequestDTO request) {
        return ResponseEntity.ok(costCalculationService.calculateCost(request));
    }

    @PostMapping("/bookings")
    @Operation(summary = "US-001: Submit Movie Ticket Request (Status: PENDING, Reference: CW-YYYY-XXXXXX)")
    public ResponseEntity<BookingResponseDTO> createBookingRequest(
            @Valid @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        BookingResponseDTO response = bookingService.createBookingRequest(request, currentUser.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/bookings/my")
    @Operation(summary = "Get booking history for the authenticated customer")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(bookingService.getUserBookings(currentUser.getId()));
    }

    @GetMapping("/bookings/{id}")
    @Operation(summary = "US-006: Review booking details and case audit trail by ID")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingDetails(id));
    }

    @GetMapping("/bookings/ref/{reference}")
    @Operation(summary = "Get booking details by unique booking reference (e.g. CW-2026-000001)")
    public ResponseEntity<BookingResponseDTO> getBookingByReference(@PathVariable String reference) {
        return ResponseEntity.ok(bookingService.getBookingByReference(reference));
    }

    @PutMapping("/bookings/{id}/confirm")
    @Operation(summary = "US-004: Explicit customer confirmation to finalize booking")
    public ResponseEntity<BookingResponseDTO> confirmBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(bookingService.confirmBooking(id, currentUser.getId()));
    }

    @PutMapping("/bookings/{id}/cancel")
    @Operation(summary = "Cancel an eligible booking and release seats")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, currentUser.getId()));
    }

    @PutMapping("/bookings/{id}/process")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Operation(summary = "US-007: Staff / Admin ticket booking processing (CONFIRM, REJECT, COMPLETE)")
    public ResponseEntity<BookingResponseDTO> processBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingProcessDTO processDTO,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(bookingService.processBooking(id, processDTO, currentUser.getName()));
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Operation(summary = "US-006: Filterable booking dashboard for Staff & Admin")
    public ResponseEntity<List<BookingResponseDTO>> getAdminBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) SlaStatus slaStatus,
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long theatreId) {
        return ResponseEntity.ok(bookingService.getAdminBookings(status, team, slaStatus, movieId, theatreId));
    }
}
