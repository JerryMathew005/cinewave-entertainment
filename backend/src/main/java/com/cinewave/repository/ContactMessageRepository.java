package com.cinewave.repository;

import com.cinewave.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    long countByIsReadFalse();

    long countByEmailAndCreatedAtAfter(String email, LocalDateTime cutoff);
}
