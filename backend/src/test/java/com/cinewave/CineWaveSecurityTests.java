package com.cinewave;

import com.cinewave.entity.Role;
import com.cinewave.entity.User;
import com.cinewave.security.JwtTokenProvider;
import com.cinewave.security.UserPrincipal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class CineWaveSecurityTests {

    @Test
    @DisplayName("BCrypt Password Encoder should hash and verify passwords securely")
    void testBCryptPasswordHashing() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "TestPassword@2026";
        String encoded = encoder.encode(rawPassword);

        assertNotNull(encoded);
        assertNotEquals(rawPassword, encoded);
        assertTrue(encoded.startsWith("$2a$10$"));
        assertTrue(encoder.matches(rawPassword, encoded));
        assertFalse(encoder.matches("WrongPassword", encoded));
    }

    @Test
    @DisplayName("JWT Token Provider should generate and validate tokens")
    void testJwtTokenGenerationAndValidation() {
        String secret = "CineWaveEntertainmentSuperSecureSecretKey2026WithMinimum256BitsLengthForHmacSHA256";
        long expirationMs = 3600000L;
        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider(secret, expirationMs);

        User user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@cinewave.com");
        user.setPassword("hashedpassword");
        user.setRole(Role.CUSTOMER);

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String token = jwtTokenProvider.generateToken(auth);

        assertNotNull(token);
        assertEquals(3, token.split("\\.").length);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("test@cinewave.com", jwtTokenProvider.getEmailFromToken(token));
    }
}
