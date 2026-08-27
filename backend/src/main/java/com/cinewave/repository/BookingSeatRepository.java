package com.cinewave.repository;

import com.cinewave.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByBookingId(Long bookingId);

    @Query("SELECT COUNT(bs) FROM BookingSeat bs WHERE bs.booking.show.id = :showId " +
           "AND bs.seat.id IN :seatIds AND bs.booking.status NOT IN ('CANCELLED', 'REJECTED')")
    long countBookedSeatsForShow(@Param("showId") Long showId, @Param("seatIds") List<Long> seatIds);
}
