package com.cinewave.service;

import com.cinewave.dto.ContactMessageDTO;
import com.cinewave.dto.ContactSubmitRequest;
import com.cinewave.entity.ContactMessage;
import com.cinewave.exception.BadRequestException;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactMessageRepository, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ContactMessageDTO submitContactMessage(ContactSubmitRequest request) {
        // Rate-limit: Maximum 5 messages from the same email in the last 15 minutes
        long recentCount = contactMessageRepository.countByEmailAndCreatedAtAfter(
                request.getEmail(),
                LocalDateTime.now().minusMinutes(15)
        );
        if (recentCount >= 5) {
            throw new BadRequestException("Rate limit reached. Please wait a few minutes before sending another inquiry.");
        }

        ContactMessage message = new ContactMessage(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getSubject().trim(),
                request.getMessage().trim()
        );

        ContactMessage saved = contactMessageRepository.save(message);

        // Async notify administrator via transactional email
        emailService.sendContactNotification(saved);

        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageDTO> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContactMessageDTO toggleReadStatus(Long id, boolean isRead) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with ID: " + id));
        message.setRead(isRead);
        ContactMessage updated = contactMessageRepository.save(message);
        return toDTO(updated);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return contactMessageRepository.countByIsReadFalse();
    }

    private ContactMessageDTO toDTO(ContactMessage m) {
        return new ContactMessageDTO(
                m.getId(),
                m.getName(),
                m.getEmail(),
                m.getSubject(),
                m.getMessage(),
                m.isRead(),
                m.getCreatedAt()
        );
    }
}
