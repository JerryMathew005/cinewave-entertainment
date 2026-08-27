package com.cinewave.repository;

import com.cinewave.entity.Booking;
import com.cinewave.entity.BookingStatus;
import com.cinewave.entity.SlaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByAssignedTeam(String assignedTeam);

    List<Booking> findBySlaStatus(SlaStatus slaStatus);

    @Query("SELECT bs.seat.id FROM BookingSeat bs WHERE bs.booking.show.id = :showId " +
           "AND bs.booking.status NOT IN ('CANCELLED', 'REJECTED')")
    List<Long> findBookedSeatIdsByShowId(@Param("showId") Long showId);

    @Query("SELECT b FROM Booking b WHERE b.status IN ('PENDING', 'UNDER_REVIEW', 'CUSTOMER_CONFIRMATION') " +
           "AND b.slaDeadline < :now AND b.slaStatus <> com.cinewave.entity.SlaStatus.SLA_BREACHED")
    List<Booking> findBreachedBookings(@Param("now") LocalDateTime now);

    @Query("SELECT b FROM Booking b WHERE b.status IN ('PENDING', 'UNDER_REVIEW', 'CUSTOMER_CONFIRMATION') " +
           "AND b.slaDeadline >= :now AND b.slaDeadline <= :warningThreshold " +
           "AND b.slaStatus = com.cinewave.entity.SlaStatus.WITHIN_SLA")
    List<Booking> findWarningBookings(@Param("now") LocalDateTime now, @Param("warningThreshold") LocalDateTime warningThreshold);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:assignedTeam IS NULL OR b.assignedTeam = :assignedTeam) AND " +
           "(:slaStatus IS NULL OR b.slaStatus = :slaStatus) AND " +
           "(:movieId IS NULL OR b.show.movie.id = :movieId) AND " +
           "(:theatreId IS NULL OR b.show.screen.theatre.id = :theatreId) " +
           "ORDER BY b.createdAt DESC")
    List<Booking> filterBookings(@Param("status") BookingStatus status,
                                 @Param("assignedTeam") String assignedTeam,
                                 @Param("slaStatus") SlaStatus slaStatus,
                                 @Param("movieId") Long movieId,
                                 @Param("theatreId") Long theatreId);

    long countByStatus(BookingStatus status);

    long countBySlaStatus(SlaStatus slaStatus);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED')")
    Double calculateTotalRevenue();
}
