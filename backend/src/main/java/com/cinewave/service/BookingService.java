package com.cinewave.service;

import com.cinewave.dto.*;
import com.cinewave.entity.*;
import com.cinewave.exception.BadRequestException;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.exception.SeatAlreadyBookedException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.*;
import com.cinewave.util.BookingReferenceGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingAuditLogRepository auditLogRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final CostCalculationService costCalculationService;
    private final RoutingService routingService;
    private final SlaService slaService;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          BookingSeatRepository bookingSeatRepository,
                          BookingAuditLogRepository auditLogRepository,
                          ShowRepository showRepository,
                          SeatRepository seatRepository,
                          UserRepository userRepository,
                          CouponRepository couponRepository,
                          CostCalculationService costCalculationService,
                          RoutingService routingService,
                          SlaService slaService,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.auditLogRepository = auditLogRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
        this.costCalculationService = costCalculationService;
        this.routingService = routingService;
        this.slaService = slaService;
        this.notificationService = notificationService;
    }

    /**
     * US-001 & US-002: Submit Movie Ticket Request with concurrency protection
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingResponseDTO createBookingRequest(BookingRequestDTO request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + request.getShowId()));

        if (show.getStatus() != ShowStatus.SCHEDULED) {
            throw new BadRequestException("This show is not available for booking (Status: " + show.getStatus() + ")");
        }

        List<Seat> seats = seatRepository.findByIdIn(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("One or more selected seats were not found");
        }

        // US-002: Check Show Availability & Concurrency Lock
        long alreadyBookedCount = bookingSeatRepository.countBookedSeatsForShow(request.getShowId(), request.getSeatIds());
        if (alreadyBookedCount > 0) {
            throw new SeatAlreadyBookedException("One or more selected seats have already been booked for this show! Please select other seats.");
        }

        // US-003: Backend Cost Calculation
        CostCalculationRequestDTO calcRequest = new CostCalculationRequestDTO(
                request.getShowId(),
                request.getSeatIds(),
                request.getCouponCode()
        );
        BookingCostBreakdownDTO breakdown = costCalculationService.calculateCost(calcRequest);

        // US-010: Route Booking Request by Show Type
        String assignedTeam = routingService.determineTeamForShowType(show.getShowType());

        // US-009: Calculate SLA Deadlines
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime slaDeadline = slaService.calculateDeadline(now);

        // Create Booking Entity
        Booking booking = new Booking();
        booking.setBookingReference(BookingReferenceGenerator.generateReference());
        booking.setUser(user);
        booking.setShow(show);
        booking.setSubtotal(breakdown.getSubtotal());
        booking.setServiceFee(breakdown.getServiceFee());
        booking.setTax(breakdown.getTax());
        booking.setDiscount(breakdown.getDiscount());
        booking.setTotalAmount(breakdown.getTotalAmount());
        booking.setStatus(BookingStatus.PENDING);
        booking.setSlaStartTime(now);
        booking.setSlaDeadline(slaDeadline);
        booking.setSlaStatus(SlaStatus.WITHIN_SLA);
        booking.setAssignedTeam(assignedTeam);
        booking.setPaymentStatus(PaymentStatus.NOT_REQUIRED);

        Booking savedBooking = bookingRepository.save(booking);

        // Associate seats
        for (Seat seat : seats) {
            BookingSeat bs = new BookingSeat(savedBooking, seat, seat.getPrice());
            bookingSeatRepository.save(bs);
        }

        // Increment coupon count if applied
        if (Boolean.TRUE.equals(breakdown.getCouponApplied()) && request.getCouponCode() != null) {
            couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim()).ifPresent(coupon -> {
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
            });
        }

        // Case lifecycle audit log
        BookingAuditLog auditLog = new BookingAuditLog(
                savedBooking.getId(),
                "SUBMIT_REQUEST",
                null,
                BookingStatus.PENDING.name(),
                user.getName(),
                user.getRole().name(),
                "Submitted booking request for " + seats.size() + " seats. Auto-routed to " + assignedTeam + "."
        );
        auditLogRepository.save(auditLog);

        // Notify customer
        notificationService.createNotification(
                user,
                savedBooking.getId(),
                "Booking Request Submitted: " + savedBooking.getBookingReference(),
                "Your booking request for " + show.getMovie().getTitle() + " has been received with status PENDING. Reference: " + savedBooking.getBookingReference(),
                NotificationType.BOOKING_PENDING
        );

        return getBookingDetails(savedBooking.getId());
    }

    /**
     * US-004: Explicit Customer Confirmation
     */
    @Transactional
    public BookingResponseDTO confirmBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to booking confirmation");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.COMPLETED) {
            return getBookingDetails(bookingId);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Cannot confirm a booking that is " + booking.getStatus());
        }

        BookingStatus previousStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(LocalDateTime.now());
        booking.setPaymentStatus(PaymentStatus.PAID);

        // Update SLA completion status
        if (booking.getSlaDeadline() != null && LocalDateTime.now().isAfter(booking.getSlaDeadline())) {
            booking.setSlaStatus(SlaStatus.COMPLETED_AFTER_SLA);
        } else {
            booking.setSlaStatus(SlaStatus.COMPLETED_WITHIN_SLA);
        }

        Booking saved = bookingRepository.save(booking);

        // Audit Trail
        BookingAuditLog audit = new BookingAuditLog(
                saved.getId(),
                "CUSTOMER_CONFIRMATION",
                previousStatus.name(),
                BookingStatus.CONFIRMED.name(),
                booking.getUser().getName(),
                "CUSTOMER",
                "Customer explicitly confirmed the booking."
        );
        auditLogRepository.save(audit);

        // Trigger Notification & Final Ticket Generation (US-008)
        List<BookingSeat> seats = bookingSeatRepository.findByBookingId(saved.getId());
        String seatLabels = seats.stream().map(s -> s.getSeat().getSeatNumber()).collect(Collectors.joining(", "));
        notificationService.notifyBookingConfirmation(saved, seatLabels);

        return getBookingDetails(saved.getId());
    }

    /**
     * US-007: Staff / Admin Ticket Processing
     */
    @Transactional
    public BookingResponseDTO processBooking(Long bookingId, BookingProcessDTO processDTO, String staffUsername) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        BookingStatus previousStatus = booking.getStatus();
        String action = processDTO.getAction().toUpperCase();

        if ("CONFIRM".equals(action)) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setConfirmedAt(LocalDateTime.now());
            booking.setPaymentStatus(PaymentStatus.PAID);
            if (booking.getSlaDeadline() != null && LocalDateTime.now().isAfter(booking.getSlaDeadline())) {
                booking.setSlaStatus(SlaStatus.COMPLETED_AFTER_SLA);
            } else {
                booking.setSlaStatus(SlaStatus.COMPLETED_WITHIN_SLA);
            }
        } else if ("REJECT".equals(action)) {
            booking.setStatus(BookingStatus.REJECTED);
        } else if ("COMPLETE".equals(action)) {
            booking.setStatus(BookingStatus.COMPLETED);
        } else {
            throw new BadRequestException("Unsupported staff processing action: " + processDTO.getAction());
        }

        if (processDTO.getStaffName() != null && !processDTO.getStaffName().isBlank()) {
            booking.setAssignedStaff(processDTO.getStaffName());
        } else {
            booking.setAssignedStaff(staffUsername);
        }

        Booking saved = bookingRepository.save(booking);

        // Audit Trail
        BookingAuditLog audit = new BookingAuditLog(
                saved.getId(),
                "STAFF_PROCESS_" + action,
                previousStatus.name(),
                saved.getStatus().name(),
                staffUsername,
                "STAFF",
                processDTO.getComment() != null ? processDTO.getComment() : "Staff processed booking with action: " + action
        );
        auditLogRepository.save(audit);

        if (saved.getStatus() == BookingStatus.CONFIRMED) {
            List<BookingSeat> seats = bookingSeatRepository.findByBookingId(saved.getId());
            String seatLabels = seats.stream().map(s -> s.getSeat().getSeatNumber()).collect(Collectors.joining(", "));
            notificationService.notifyBookingConfirmation(saved, seatLabels);
        }

        return getBookingDetails(saved.getId());
    }

    /**
     * Customer Booking Cancellation
     */
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed movie bookings cannot be cancelled");
        }

        BookingStatus previousStatus = booking.getStatus();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        Booking saved = bookingRepository.save(booking);

        // Audit Trail
        BookingAuditLog audit = new BookingAuditLog(
                saved.getId(),
                "CANCEL_BOOKING",
                previousStatus.name(),
                BookingStatus.CANCELLED.name(),
                booking.getUser().getName(),
                "CUSTOMER",
                "Customer initiated booking cancellation."
        );
        auditLogRepository.save(audit);

        // Notification
        notificationService.notifyBookingCancellation(saved);

        return getBookingDetails(saved.getId());
    }

    /**
     * US-006: Review Booking Details
     */
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingDetails(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        List<BookingAuditLog> auditLogs = auditLogRepository.findByBookingIdOrderByCreatedAtAsc(bookingId);
        return EntityDtoMapper.toBookingResponseDTO(booking, auditLogs);
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));
        List<BookingAuditLog> auditLogs = auditLogRepository.findByBookingIdOrderByCreatedAtAsc(booking.getId());
        return EntityDtoMapper.toBookingResponseDTO(booking, auditLogs);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return bookings.stream()
                .map(b -> EntityDtoMapper.toBookingResponseDTO(b, auditLogRepository.findByBookingIdOrderByCreatedAtAsc(b.getId())))
                .collect(Collectors.toList());
    }

    /**
     * US-006: Staff / Admin Filterable Booking Dashboard
     */
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAdminBookings(BookingStatus status,
                                                     String team,
                                                     SlaStatus slaStatus,
                                                     Long movieId,
                                                     Long theatreId) {
        List<Booking> bookings = bookingRepository.filterBookings(status, team, slaStatus, movieId, theatreId);
        return bookings.stream()
                .map(b -> EntityDtoMapper.toBookingResponseDTO(b, auditLogRepository.findByBookingIdOrderByCreatedAtAsc(b.getId())))
                .collect(Collectors.toList());
    }
}
