package com.cinewave.service;

import com.cinewave.dto.*;
import com.cinewave.entity.PasswordResetToken;
import com.cinewave.entity.Role;
import com.cinewave.entity.User;
import com.cinewave.exception.BadRequestException;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.PasswordResetTokenRepository;
import com.cinewave.repository.UserRepository;
import com.cinewave.security.JwtTokenProvider;
import com.cinewave.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Confirm password check
        if (request.getConfirmPassword() != null && !request.getConfirmPassword().isEmpty()) {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new BadRequestException("Password and Confirm Password must match.");
            }
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }

        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("Email address is already registered: " + cleanEmail);
        }

        Role role = request.getRole() != null ? request.getRole() : Role.CUSTOMER;
        User user = new User(
                request.getName().trim(),
                cleanEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getPhone() != null ? request.getPhone().trim() : null,
                role
        );
        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new BadRequestException("No authenticated user in session");
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));
        return EntityDtoMapper.toUserDTO(user);
    }

    @Transactional
    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        // Rate limit: max 3 requests per email in 15 minutes
        long recentCount = passwordResetTokenRepository.countByEmailAndCreatedAtAfter(
                cleanEmail,
                LocalDateTime.now().minusMinutes(15)
        );
        if (recentCount >= 3) {
            throw new BadRequestException("Too many reset requests for this email. Please wait 15 minutes before requesting again.");
        }

        // Generate cryptographically secure 6-digit numeric OTP (100000 - 999999)
        int randomCode = 100000 + secureRandom.nextInt(900000);
        String otp = String.valueOf(randomCode);

        // Store hashed OTP with 10-minute expiry
        String otpHash = passwordEncoder.encode(otp);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        PasswordResetToken token = new PasswordResetToken(cleanEmail, otpHash, expiry);
        passwordResetTokenRepository.save(token);

        // Dispatch transactional email if registered user
        if (userRepository.existsByEmail(cleanEmail)) {
            emailService.sendPasswordResetOtp(cleanEmail, otp);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "If that email is registered with CineWave, a 6-digit password reset code has been sent. It expires in 10 minutes.");
        response.put("expiresInMinutes", 10);
        return response;
    }

    @Transactional
    public Map<String, Object> verifyOtp(VerifyOtpRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        PasswordResetToken token = passwordResetTokenRepository
                .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(cleanEmail)
                .orElseThrow(() -> new BadRequestException("No active password reset request found for this email."));

        if (token.isExpired()) {
            token.setUsed(true);
            passwordResetTokenRepository.save(token);
            throw new BadRequestException("Password reset code has expired. Please request a new code.");
        }

        if (token.getAttempts() >= 5) {
            token.setUsed(true);
            passwordResetTokenRepository.save(token);
            throw new BadRequestException("Too many invalid attempts. This code has been invalidated. Please request a new code.");
        }

        if (!passwordEncoder.matches(request.getOtp().trim(), token.getOtpHash())) {
            token.setAttempts(token.getAttempts() + 1);
            passwordResetTokenRepository.save(token);
            throw new BadRequestException("Invalid verification code. Please check and try again.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Verification code confirmed successfully.");
        return response;
    }

    @Transactional
    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match.");
        }

        if (request.getNewPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }

        String cleanEmail = request.getEmail().trim().toLowerCase();
        PasswordResetToken token = passwordResetTokenRepository
                .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(cleanEmail)
                .orElseThrow(() -> new BadRequestException("No active password reset code found."));

        if (token.isExpired()) {
            token.setUsed(true);
            passwordResetTokenRepository.save(token);
            throw new BadRequestException("Password reset code has expired. Please request a new one.");
        }

        if (token.getAttempts() >= 5) {
            token.setUsed(true);
            passwordResetTokenRepository.save(token);
            throw new BadRequestException("Too many invalid attempts. Please request a new code.");
        }

        if (!passwordEncoder.matches(request.getOtp().trim(), token.getOtpHash())) {
            token.setAttempts(token.getAttempts() + 1);
            passwordResetTokenRepository.save(token);
            throw new BadRequestException("Invalid verification code.");
        }

        // Update user's password securely
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No user found associated with email: " + cleanEmail));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidate OTP immediately to prevent reuse
        token.setUsed(true);
        passwordResetTokenRepository.save(token);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password has been successfully updated. You may now sign in with your new credentials.");
        return response;
    }
}
