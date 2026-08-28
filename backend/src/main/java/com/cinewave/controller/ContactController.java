package com.cinewave.controller;

import com.cinewave.dto.ContactMessageDTO;
import com.cinewave.dto.ContactSubmitRequest;
import com.cinewave.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Contact", description = "User contact messaging and administrator message management")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/api/contact")
    @Operation(summary = "Submit a contact message to CineWave administration")
    public ResponseEntity<Map<String, Object>> submitContactMessage(@Valid @RequestBody ContactSubmitRequest request) {
        ContactMessageDTO message = contactService.submitContactMessage(request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Your inquiry has been received. Our administration team will review it shortly.");
        response.put("inquiryId", message.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/admin/messages")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all submitted contact inquiries (Admin only)")
    public ResponseEntity<List<ContactMessageDTO>> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }

    @PutMapping("/api/admin/messages/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark contact message as read/unread (Admin only)")
    public ResponseEntity<ContactMessageDTO> toggleReadStatus(@PathVariable Long id, @RequestParam(defaultValue = "true") boolean isRead) {
        return ResponseEntity.ok(contactService.toggleReadStatus(id, isRead));
    }

    @GetMapping("/api/admin/messages/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get unread message count for dashboard badge (Admin only)")
    public ResponseEntity<Map<String, Object>> getUnreadCount() {
        Map<String, Object> res = new HashMap<>();
        res.put("unreadCount", contactService.getUnreadCount());
        return ResponseEntity.ok(res);
    }
}
