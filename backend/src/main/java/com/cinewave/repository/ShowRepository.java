package com.cinewave.repository;

import com.cinewave.entity.Show;
import com.cinewave.entity.ShowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByMovieId(Long movieId);
    List<Show> findByMovieIdAndShowDateGreaterThanEqualOrderByShowDateAscStartTimeAsc(Long movieId, LocalDate showDate);
    List<Show> findByScreen_Theatre_IdAndShowDateGreaterThanEqualOrderByShowDateAscStartTimeAsc(Long theatreId, LocalDate showDate);
    List<Show> findByStatus(ShowStatus status);
    boolean existsByMovieIdAndScreenIdAndShowDateAndStartTime(Long movieId, Long screenId, LocalDate showDate, java.time.LocalTime startTime);

    @Query("SELECT s FROM Show s WHERE " +
           "(:movieId IS NULL OR s.movie.id = :movieId) AND " +
           "(:theatreId IS NULL OR s.screen.theatre.id = :theatreId) AND " +
           "(:showDate IS NULL OR s.showDate = :showDate) AND " +
           "(:status IS NULL OR s.status = :status)")
    List<Show> filterShows(@Param("movieId") Long movieId,
                           @Param("theatreId") Long theatreId,
                           @Param("showDate") LocalDate showDate,
                           @Param("status") ShowStatus status);
}
