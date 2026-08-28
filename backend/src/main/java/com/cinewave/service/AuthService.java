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

        // Generate secure unique token for direct reset link
        String secureToken = java.util.UUID.randomUUID().toString().replace("-", "") +
                Long.toHexString(System.currentTimeMillis());

        // Store hashed OTP and secure token with 15-minute expiry
        String otpHash = passwordEncoder.encode(otp);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken tokenEntity = new PasswordResetToken(cleanEmail, secureToken, otpHash, expiry);
        passwordResetTokenRepository.save(tokenEntity);

        // Dispatch real transactional reset email if registered user
        if (userRepository.existsByEmail(cleanEmail)) {
            emailService.sendPasswordResetEmail(cleanEmail, secureToken);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "If that email address is registered with CineWave Entertainment, a password reset link has been sent to your inbox. The link is valid for 15 minutes.");
        response.put("expiresInMinutes", 15);
        response.put("emailDeliveryActive", emailService.isConfigured());

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> verifyResetToken(String email, String token) {
        if ((email == null || email.trim().isEmpty()) && (token == null || token.trim().isEmpty())) {
            throw new BadRequestException("Reset token or verification code is required.");
        }

        String cleanToken = (token != null) ? token.trim() : "";
        String cleanEmail = (email != null) ? email.trim().toLowerCase() : "";

        PasswordResetToken resetToken = null;

        // 1. Try finding by secure token directly
        if (!cleanToken.isEmpty()) {
            resetToken = passwordResetTokenRepository
                    .findTopByTokenAndUsedFalseOrderByCreatedAtDesc(cleanToken)
                    .orElse(null);
        }

        // 2. If not found by direct token and email is present, check by email & OTP hash
        if (resetToken == null && !cleanEmail.isEmpty()) {
            PasswordResetToken candidate = passwordResetTokenRepository
                    .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(cleanEmail)
                    .orElseThrow(() -> new BadRequestException("No active password reset request found for this email."));

            if (passwordEncoder.matches(cleanToken, candidate.getOtpHash()) ||
                    (candidate.getToken() != null && candidate.getToken().equals(cleanToken))) {
                resetToken = candidate;
            } else {
                throw new BadRequestException("Invalid reset token or verification code.");
            }
        }

        if (resetToken == null) {
            throw new BadRequestException("Invalid or expired reset token.");
        }

        if (resetToken.isExpired()) {
            throw new BadRequestException("Password reset link has expired. Please request a new link.");
        }

        if (resetToken.getAttempts() >= 5) {
            throw new BadRequestException("Too many invalid attempts. This reset link has been invalidated.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("valid", true);
        result.put("email", resetToken.getEmail());
        result.put("message", "Reset token is valid.");
        return result;
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

        String rawToken = request.getTokenOrOtp();
        String cleanEmail = (request.getEmail() != null) ? request.getEmail().trim().toLowerCase() : "";

        if (rawToken.isEmpty() && cleanEmail.isEmpty()) {
            throw new BadRequestException("Reset token or verification code is required.");
        }

        PasswordResetToken tokenEntity = null;

        // 1. Try finding by secure token directly
        if (!rawToken.isEmpty()) {
            tokenEntity = passwordResetTokenRepository
                    .findTopByTokenAndUsedFalseOrderByCreatedAtDesc(rawToken)
                    .orElse(null);
        }

        // 2. If not found by direct token and email is supplied, check by email and OTP hash
        if (tokenEntity == null && !cleanEmail.isEmpty()) {
            PasswordResetToken candidate = passwordResetTokenRepository
                    .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(cleanEmail)
                    .orElseThrow(() -> new BadRequestException("No active password reset request found for this email."));

            if (passwordEncoder.matches(rawToken, candidate.getOtpHash()) ||
                    (candidate.getToken() != null && candidate.getToken().equals(rawToken))) {
                tokenEntity = candidate;
            } else {
                candidate.setAttempts(candidate.getAttempts() + 1);
                passwordResetTokenRepository.save(candidate);
                throw new BadRequestException("Invalid verification code or token.");
            }
        }

        if (tokenEntity == null) {
            throw new BadRequestException("No active password reset request found.");
        }

        if (tokenEntity.isExpired()) {
            tokenEntity.setUsed(true);
            passwordResetTokenRepository.save(tokenEntity);
            throw new BadRequestException("Password reset link has expired. Please request a new one.");
        }

        if (tokenEntity.getAttempts() >= 5) {
            tokenEntity.setUsed(true);
            passwordResetTokenRepository.save(tokenEntity);
            throw new BadRequestException("Too many invalid attempts. Please request a new reset link.");
        }

        String userEmail = tokenEntity.getEmail();

        // Update user's password securely
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("No user found associated with email: " + userEmail));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidate token immediately to prevent reuse
        tokenEntity.setUsed(true);
        passwordResetTokenRepository.save(tokenEntity);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password has been successfully updated. You may now sign in with your new credentials.");
        return response;
    }
}
