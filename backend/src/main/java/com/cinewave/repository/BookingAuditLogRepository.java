package com.cinewave.repository;

import com.cinewave.entity.BookingAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingAuditLogRepository extends JpaRepository<BookingAuditLog, Long> {
    List<BookingAuditLog> findByBookingIdOrderByCreatedAtAsc(Long bookingId);
}
