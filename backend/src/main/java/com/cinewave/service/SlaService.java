package com.cinewave.service;

import com.cinewave.entity.*;
import com.cinewave.repository.BookingAuditLogRepository;
import com.cinewave.repository.BookingRepository;
import com.cinewave.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlaService {

    private static final Logger logger = LoggerFactory.getLogger(SlaService.class);

    private final BookingRepository bookingRepository;
    private final BookingAuditLogRepository auditLogRepository;
    private final NotificationRepository notificationRepository;

    @Value("${cinewave.sla.default-minutes:30}")
    private int defaultSlaMinutes;

    @Value("${cinewave.sla.warning-minutes:10}")
    private int warningMinutes;

    public SlaService(BookingRepository bookingRepository,
                      BookingAuditLogRepository auditLogRepository,
                      NotificationRepository notificationRepository) {
        this.bookingRepository = bookingRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationRepository = notificationRepository;
    }

    public int getDefaultSlaMinutes() {
        return defaultSlaMinutes;
    }

    public LocalDateTime calculateDeadline(LocalDateTime startTime) {
        return startTime.plusMinutes(defaultSlaMinutes);
    }

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void monitorSlaBreaches() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Process SLA Breaches
        List<Booking> breached = bookingRepository.findBreachedBookings(now);
        for (Booking booking : breached) {
            SlaStatus oldSla = booking.getSlaStatus();
            booking.setSlaStatus(SlaStatus.SLA_BREACHED);
            bookingRepository.save(booking);

            // Audit log
            BookingAuditLog log = new BookingAuditLog(
                    booking.getId(),
                    "SLA_BREACH_DETECTED",
                    oldSla.name(),
                    SlaStatus.SLA_BREACHED.name(),
                    "CineWave SLA Engine",
                    "SYSTEM",
                    "Processing SLA deadline (" + booking.getSlaDeadline() + ") expired without completion."
            );
            auditLogRepository.save(log);

            // Alert Notification for Staff/Customer
            Notification notification = new Notification(
                    booking.getUser(),
                    booking.getId(),
                    "SLA Alert: Booking " + booking.getBookingReference(),
                    "Your booking request has exceeded our standard SLA processing time. Staff team (" +
                            booking.getAssignedTeam() + ") has been alerted to prioritize this immediately.",
                    NotificationType.SLA_ALERT
            );
            notificationRepository.save(notification);

            logger.warn("SLA BREACH triggered for booking: {} (Team: {})", booking.getBookingReference(), booking.getAssignedTeam());
        }

        // 2. Process SLA Warnings (within warningThreshold e.g. 10 minutes to deadline)
        LocalDateTime warningThreshold = now.plusMinutes(warningMinutes);
        List<Booking> warningBookings = bookingRepository.findWarningBookings(now, warningThreshold);
        for (Booking booking : warningBookings) {
            booking.setSlaStatus(SlaStatus.SLA_WARNING);
            bookingRepository.save(booking);
            logger.info("SLA WARNING triggered for booking: {}", booking.getBookingReference());
        }
    }
}
