package com.cinewave.repository;

import com.cinewave.entity.Movie;
import com.cinewave.entity.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatus(MovieStatus status);

    boolean existsByTitle(String title);

    @Query("SELECT m FROM Movie m WHERE " +
           "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:genre IS NULL OR LOWER(m.genre) LIKE LOWER(CONCAT('%', :genre, '%'))) AND " +
           "(:language IS NULL OR LOWER(m.language) LIKE LOWER(CONCAT('%', :language, '%'))) AND " +
           "(:status IS NULL OR m.status = :status)")
    List<Movie> searchMovies(@Param("title") String title,
                             @Param("genre") String genre,
                             @Param("language") String language,
                             @Param("status") MovieStatus status);
}
