package com.cinewave.mapper;

import com.cinewave.dto.*;
import com.cinewave.entity.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EntityDtoMapper {

    public static UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public static MovieDTO toMovieDTO(Movie movie) {
        if (movie == null) return null;
        MovieDTO dto = new MovieDTO();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setDescription(movie.getDescription());
        dto.setGenre(movie.getGenre());
        dto.setLanguage(movie.getLanguage());
        dto.setDuration(movie.getDuration());
        dto.setReleaseDate(movie.getReleaseDate());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setTrailerUrl(movie.getTrailerUrl());
        dto.setRating(movie.getRating());
        dto.setStatus(movie.getStatus());
        dto.setCreatedAt(movie.getCreatedAt());
        return dto;
    }

    public static TheatreDTO toTheatreDTO(Theatre theatre) {
        if (theatre == null) return null;
        TheatreDTO dto = new TheatreDTO();
        dto.setId(theatre.getId());
        dto.setName(theatre.getName());
        dto.setLocation(theatre.getLocation());
        dto.setAddress(theatre.getAddress());
        dto.setCity(theatre.getCity());
        dto.setState(theatre.getState());
        dto.setStatus(theatre.getStatus());
        dto.setScreenCount(theatre.getScreens() != null ? theatre.getScreens().size() : 0);
        return dto;
    }

    public static ScreenDTO toScreenDTO(Screen screen) {
        if (screen == null) return null;
        ScreenDTO dto = new ScreenDTO();
        dto.setId(screen.getId());
        if (screen.getTheatre() != null) {
            dto.setTheatreId(screen.getTheatre().getId());
            dto.setTheatreName(screen.getTheatre().getName());
        }
        dto.setScreenName(screen.getScreenName());
        dto.setScreenType(screen.getScreenType());
        dto.setTotalSeats(screen.getTotalSeats());
        return dto;
    }

    public static SeatDTO toSeatDTO(Seat seat, boolean isBooked) {
        if (seat == null) return null;
        SeatDTO dto = new SeatDTO();
        dto.setId(seat.getId());
        if (seat.getScreen() != null) {
            dto.setScreenId(seat.getScreen().getId());
        }
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setRowName(seat.getRowName());
        dto.setSeatType(seat.getSeatType());
        dto.setPrice(seat.getPrice());
        dto.setStatus(seat.getStatus());
        dto.setIsBooked(isBooked);
        return dto;
    }

    public static ShowDTO toShowDTO(Show show, Integer availableSeats) {
        if (show == null) return null;
        ShowDTO dto = new ShowDTO();
        dto.setId(show.getId());
        if (show.getMovie() != null) {
            dto.setMovieId(show.getMovie().getId());
            dto.setMovieTitle(show.getMovie().getTitle());
            dto.setMoviePoster(show.getMovie().getPosterUrl());
            dto.setMovieDuration(show.getMovie().getDuration());
        }
        if (show.getScreen() != null) {
            dto.setScreenId(show.getScreen().getId());
            dto.setScreenName(show.getScreen().getScreenName());
            dto.setTotalSeats(show.getScreen().getTotalSeats());
            if (show.getScreen().getTheatre() != null) {
                dto.setTheatreId(show.getScreen().getTheatre().getId());
                dto.setTheatreName(show.getScreen().getTheatre().getName());
                dto.setTheatreCity(show.getScreen().getTheatre().getCity());
            }
        }
        dto.setShowType(show.getShowType());
        dto.setShowDate(show.getShowDate());
        dto.setStartTime(show.getStartTime());
        dto.setEndTime(show.getEndTime());
        dto.setBasePrice(show.getBasePrice());
        dto.setStatus(show.getStatus());
        dto.setAvailableSeats(availableSeats);
        return dto;
    }

    public static AuditLogDTO toAuditLogDTO(BookingAuditLog log) {
        if (log == null) return null;
        AuditLogDTO dto = new AuditLogDTO();
        dto.setId(log.getId());
        dto.setBookingId(log.getBookingId());
        dto.setAction(log.getAction());
        dto.setPreviousStatus(log.getPreviousStatus());
        dto.setNewStatus(log.getNewStatus());
        dto.setActorName(log.getActorName());
        dto.setActorRole(log.getActorRole());
        dto.setComment(log.getComment());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }

    public static BookingResponseDTO toBookingResponseDTO(Booking booking, List<BookingAuditLog> auditLogs) {
        if (booking == null) return null;
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setUser(toUserDTO(booking.getUser()));
        dto.setShow(toShowDTO(booking.getShow(), null));
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setSubtotal(booking.getSubtotal());
        dto.setServiceFee(booking.getServiceFee());
        dto.setTax(booking.getTax());
        dto.setDiscount(booking.getDiscount());
        dto.setStatus(booking.getStatus());
        dto.setSlaStartTime(booking.getSlaStartTime());
        dto.setSlaDeadline(booking.getSlaDeadline());
        dto.setSlaStatus(booking.getSlaStatus());

        if (booking.getSlaDeadline() != null) {
            long remaining = Duration.between(LocalDateTime.now(), booking.getSlaDeadline()).getSeconds();
            dto.setRemainingSlaSeconds(Math.max(0, remaining));
        }

        dto.setAssignedTeam(booking.getAssignedTeam());
        dto.setAssignedStaff(booking.getAssignedStaff());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setConfirmedAt(booking.getConfirmedAt());
        dto.setCancelledAt(booking.getCancelledAt());

        if (booking.getBookingSeats() != null) {
            List<SeatDTO> seatDTOs = booking.getBookingSeats().stream()
                    .map(bs -> toSeatDTO(bs.getSeat(), true))
                    .collect(Collectors.toList());
            dto.setSeats(seatDTOs);
        }

        if (auditLogs != null) {
            dto.setAuditLogs(auditLogs.stream().map(EntityDtoMapper::toAuditLogDTO).collect(Collectors.toList()));
        }

        return dto;
    }

    public static NotificationDTO toNotificationDTO(Notification notification) {
        if (notification == null) return null;
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
        }
        dto.setBookingId(notification.getBookingId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setNotificationType(notification.getNotificationType());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }

    public static CouponDTO toCouponDTO(Coupon coupon) {
        if (coupon == null) return null;
        CouponDTO dto = new CouponDTO();
        dto.setId(coupon.getId());
        dto.setCode(coupon.getCode());
        dto.setDiscountType(coupon.getDiscountType());
        dto.setDiscountValue(coupon.getDiscountValue());
        dto.setMinimumAmount(coupon.getMinimumAmount());
        dto.setMaximumDiscount(coupon.getMaximumDiscount());
        dto.setStartDate(coupon.getStartDate());
        dto.setExpiryDate(coupon.getExpiryDate());
        dto.setUsageLimit(coupon.getUsageLimit());
        dto.setUsedCount(coupon.getUsedCount());
        dto.setStatus(coupon.getStatus());
        return dto;
    }

    public static WishlistDTO toWishlistDTO(Wishlist wishlist) {
        if (wishlist == null) return null;
        return new WishlistDTO(
                wishlist.getId(),
                wishlist.getUser() != null ? wishlist.getUser().getId() : null,
                toMovieDTO(wishlist.getMovie()),
                wishlist.getCreatedAt()
        );
    }

    public static ReviewDTO toReviewDTO(Review review) {
        if (review == null) return null;
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        if (review.getUser() != null) {
            dto.setUserId(review.getUser().getId());
            dto.setUserName(review.getUser().getName());
        }
        if (review.getMovie() != null) {
            dto.setMovieId(review.getMovie().getId());
            dto.setMovieTitle(review.getMovie().getTitle());
        }
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public static RoutingRuleDTO toRoutingRuleDTO(RoutingRule rule) {
        if (rule == null) return null;
        return new RoutingRuleDTO(rule.getId(), rule.getShowType(), rule.getTeamName(), rule.getActive());
    }
}
