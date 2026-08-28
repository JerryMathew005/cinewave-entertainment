package com.cinewave.controller;

import com.cinewave.dto.ChangePasswordRequest;
import com.cinewave.dto.UpdateProfileRequest;
import com.cinewave.dto.UserDTO;
import com.cinewave.security.UserPrincipal;
import com.cinewave.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User profile management and account settings")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user profile dynamically from database")
    public ResponseEntity<UserDTO> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getId()));
    }

    @PutMapping("/me")
    @Operation(summary = "Update currently authenticated user profile fields (name, phone)")
    public ResponseEntity<UserDTO> updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.getId(), request));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Change password for currently authenticated user")
    public ResponseEntity<Map<String, Object>> changeMyPassword(@AuthenticationPrincipal UserPrincipal principal,
                                                                @Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(principal.getId(), request));
    }
}
