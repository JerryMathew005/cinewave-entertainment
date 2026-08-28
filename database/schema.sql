-- CineWave Entertainment - Database Schema
-- Movie Ticket Booking Management System

CREATE DATABASE IF NOT EXISTS cinewave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinewave_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- 2. Movies Table
CREATE TABLE IF NOT EXISTS movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    genre VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    release_date DATE NOT NULL,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0.0,
    status ENUM('NOW_SHOWING', 'COMING_SOON', 'INACTIVE') NOT NULL DEFAULT 'NOW_SHOWING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_movies_status (status),
    INDEX idx_movies_genre (genre),
    INDEX idx_movies_language (language)
) ENGINE=InnoDB;

-- 3. Theatres Table
CREATE TABLE IF NOT EXISTS theatres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_theatres_city (city),
    INDEX idx_theatres_status (status)
) ENGINE=InnoDB;

-- 4. Screens Table
CREATE TABLE IF NOT EXISTS screens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    theatre_id BIGINT NOT NULL,
    screen_name VARCHAR(50) NOT NULL,
    screen_type ENUM('STANDARD', 'IMAX', 'DOLBY_3D', 'VIP') NOT NULL DEFAULT 'STANDARD',
    total_seats INT NOT NULL DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (theatre_id) REFERENCES theatres(id) ON DELETE CASCADE,
    INDEX idx_screens_theatre (theatre_id)
) ENGINE=InnoDB;

-- 5. Seats Table
CREATE TABLE IF NOT EXISTS seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    screen_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    row_name VARCHAR(5) NOT NULL,
    seat_type ENUM('REGULAR', 'PREMIUM', 'RECLINER') NOT NULL DEFAULT 'REGULAR',
    price DECIMAL(10,2) NOT NULL DEFAULT 150.00,
    status ENUM('ACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    UNIQUE KEY uk_screen_seat (screen_id, seat_number),
    INDEX idx_seats_screen (screen_id)
) ENGINE=InnoDB;

-- 6. Shows Table
CREATE TABLE IF NOT EXISTS shows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    screen_id BIGINT NOT NULL,
    show_type ENUM('REGULAR', 'PREMIUM', 'IMAX', '3D', 'SPECIAL_EVENT') NOT NULL DEFAULT 'REGULAR',
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 200.00,
    status ENUM('SCHEDULED', 'RUNNING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
    INDEX idx_shows_movie_date (movie_id, show_date),
    INDEX idx_shows_screen_date (screen_id, show_date)
) ENGINE=InnoDB;

-- 7. Routing Rules Table
CREATE TABLE IF NOT EXISTS routing_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    show_type VARCHAR(50) NOT NULL UNIQUE,
    team_name VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    show_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    service_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('PENDING', 'UNDER_REVIEW', 'CUSTOMER_CONFIRMATION', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED', 'SLA_BREACHED') NOT NULL DEFAULT 'PENDING',
    sla_start_time DATETIME,
    sla_deadline DATETIME,
    sla_status ENUM('WITHIN_SLA', 'SLA_WARNING', 'SLA_BREACHED', 'COMPLETED_WITHIN_SLA', 'COMPLETED_AFTER_SLA') NOT NULL DEFAULT 'WITHIN_SLA',
    assigned_team VARCHAR(100),
    assigned_staff VARCHAR(100),
    payment_status ENUM('NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'NOT_REQUIRED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE,
    INDEX idx_bookings_user (user_id),
    INDEX idx_bookings_show (show_id),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_sla (sla_status),
    INDEX idx_bookings_team (assigned_team)
) ENGINE=InnoDB;

-- 9. Booking Seats Table
CREATE TABLE IF NOT EXISTS booking_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE,
    UNIQUE KEY uk_booking_seat (booking_id, seat_id),
    INDEX idx_booking_seats_seat (seat_id)
) ENGINE=InnoDB;

-- 10. Booking Audit Logs (Pega Case Management Trail)
CREATE TABLE IF NOT EXISTS booking_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_audit_booking (booking_id)
) ENGINE=InnoDB;

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('BOOKING_PENDING', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'SLA_ALERT', 'GENERAL') NOT NULL DEFAULT 'GENERAL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_notifications_user (user_id, is_read)
) ENGINE=InnoDB;

-- 12. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('PERCENTAGE', 'FIXED') NOT NULL DEFAULT 'PERCENTAGE',
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount DECIMAL(10,2) DEFAULT 500.00,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    status ENUM('ACTIVE', 'EXPIRED', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code)
) ENGINE=InnoDB;

-- 13. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_movie_wishlist (user_id, movie_id)
) ENGINE=InnoDB;

-- 14. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    INDEX idx_reviews_movie (movie_id)
) ENGINE=InnoDB;

-- 15. Password Reset Tokens Table (Secure Hashed OTP)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pwd_reset_email (email, used)
) ENGINE=InnoDB;

-- 16. Contact Messages Table (Public User Inquiries)
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_email (email),
    INDEX idx_contact_read (is_read)
) ENGINE=InnoDB;

