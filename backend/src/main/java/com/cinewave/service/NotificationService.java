package com.cinewave.service;

import com.cinewave.dto.NotificationDTO;
import com.cinewave.entity.Booking;
import com.cinewave.entity.Notification;
import com.cinewave.entity.NotificationType;
import com.cinewave.entity.User;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void createNotification(User user, Long bookingId, String title, String message, NotificationType type) {
        Notification notification = new Notification(user, bookingId, title, message, type);
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyBookingConfirmation(Booking booking, String seatList) {
        String title = "Booking Confirmed: " + booking.getBookingReference();
        String message = String.format(
                "Your booking for %s at %s (%s) on %s at %s has been CONFIRMED! Seats: %s. Total Amount: ₹%.2f.",
                booking.getShow().getMovie().getTitle(),
                booking.getShow().getScreen().getTheatre().getName(),
                booking.getShow().getScreen().getScreenName(),
                booking.getShow().getShowDate(),
                booking.getShow().getStartTime(),
                seatList,
                booking.getTotalAmount()
        );
        createNotification(booking.getUser(), booking.getId(), title, message, NotificationType.BOOKING_CONFIRMED);
    }

    @Transactional
    public void notifyBookingCancellation(Booking booking) {
        String title = "Booking Cancelled: " + booking.getBookingReference();
        String message = String.format(
                "Your booking for %s on %s has been cancelled.",
                booking.getShow().getMovie().getTitle(),
                booking.getShow().getShowDate()
        );
        createNotification(booking.getUser(), booking.getId(), title, message, NotificationType.BOOKING_CANCELLED);
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(EntityDtoMapper::toNotificationDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDTO markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification does not belong to current user");
        }

        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return EntityDtoMapper.toNotificationDTO(saved);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}
