package com.cinewave.repository;

import com.cinewave.entity.Theatre;
import com.cinewave.entity.TheatreStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheatreRepository extends JpaRepository<Theatre, Long> {
    List<Theatre> findByStatus(TheatreStatus status);
    List<Theatre> findByCityIgnoreCase(String city);
}
