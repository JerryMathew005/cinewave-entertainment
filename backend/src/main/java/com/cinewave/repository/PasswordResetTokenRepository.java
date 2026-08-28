package com.cinewave.repository;

import com.cinewave.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);

    Optional<PasswordResetToken> findTopByTokenAndUsedFalseOrderByCreatedAtDesc(String token);

    Optional<PasswordResetToken> findTopByEmailAndTokenAndUsedFalseOrderByCreatedAtDesc(String email, String token);

    long countByEmailAndCreatedAtAfter(String email, LocalDateTime cutoff);
}
