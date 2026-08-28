package com.cinewave.controller;

import com.cinewave.dto.*;
import com.cinewave.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, profile, and secure password recovery")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and receive JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a 6-digit password reset verification code and link via email")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Map<String, Object> result = authService.forgotPassword(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/verify-reset-token")
    @Operation(summary = "Verify password reset token or code validity without consuming it")
    public ResponseEntity<Map<String, Object>> verifyResetToken(
            @RequestParam(required = false) String email,
            @RequestParam String token) {
        Map<String, Object> result = authService.verifyResetToken(email, token);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Validate the 6-digit verification code before proceeding to password change")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        Map<String, Object> result = authService.verifyOtp(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Submit new password using the validated verification code")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Map<String, Object> result = authService.resetPassword(request);
        return ResponseEntity.ok(result);
    }
}
