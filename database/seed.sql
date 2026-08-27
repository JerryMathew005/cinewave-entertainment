-- CineWave Entertainment - Seed Data
-- Movie Ticket Booking Management System

USE cinewave_db;

-- 1. Insert Initial Users
-- BCrypt password hashes:
-- 'Admin@123'    -> '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a'
-- 'Staff@123'    -> '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a'
-- 'Customer@123' -> '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a'
-- (Note: Spring DataInitializer will also verify/ensure these exact accounts on startup)
INSERT INTO users (id, name, email, password, phone, role) VALUES
(1, 'System Administrator', 'admin@cinewave.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+1 (555) 019-2831', 'ADMIN'),
(2, 'Operations Staff', 'staff@cinewave.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+1 (555) 019-2832', 'STAFF'),
(3, 'Jerry Customer', 'customer@cinewave.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', '+1 (555) 019-2833', 'CUSTOMER')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Movies (At least 8 movies)
INSERT INTO movies (id, title, description, genre, language, duration, release_date, poster_url, trailer_url, rating, status) VALUES
(1, 'Oppenheimer: Quantum Dawn', 'The gripping biographical journey of J. Robert Oppenheimer and the creation of the atomic age, featuring intense psychological stakes and groundbreaking IMAX visuals.', 'Sci-Fi / Drama', 'English', 180, '2026-07-21', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=uYPbbksJxIg', 9.3, 'NOW_SHOWING'),
(2, 'Avatar: Fire and Ash', 'Return to the mesmerizing world of Pandora as Jake Sully and Neytiri face a fierce new Ash clan among the volcanic reaches of the oceanic moon.', 'Action / Sci-Fi', 'English', 190, '2026-08-15', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=d9MyW72ELq0', 8.9, 'NOW_SHOWING'),
(3, 'Inception: Lucid Horizon', 'A master thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'Sci-Fi / Thriller', 'English', 148, '2026-06-10', 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 9.1, 'NOW_SHOWING'),
(4, 'Interstellar: Beyond Time', 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.', 'Sci-Fi / Adventure', 'English', 169, '2026-05-18', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 9.4, 'NOW_SHOWING'),
(5, 'The Dark Knight: Legacy', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'Action / Crime', 'English', 152, '2026-08-01', 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 9.2, 'NOW_SHOWING'),
(6, 'Dune: Prophecy of Arrakis', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and destiny, he endeavors to prevent a terrible future.', 'Sci-Fi / Epic', 'English', 166, '2026-08-20', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=Way9Dexny3w', 8.8, 'NOW_SHOWING'),
(7, 'Spider-Man: Across Realities', 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.', 'Animation / Action', 'English', 140, '2026-09-12', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=cqGjhVJWtEg', 8.7, 'COMING_SOON'),
(8, 'Gladiator: Eternal Arena', 'Decades after Maximus heroic sacrifice, a new champion rises to challenge the corrupt emperors who rule Rome from atop the Colosseum.', 'Action / Historical', 'English', 155, '2026-10-05', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', 'https://www.youtube.com/watch?v=4rgYUipGJNo', 8.5, 'COMING_SOON')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 3. Insert Theatres (At least 4 theatres)
INSERT INTO theatres (id, name, location, address, city, state, status) VALUES
(1, 'CineWave IMAX Cyberplex', 'Cyber City Hub', 'Plot 42, Tech Park Boulevard', 'Bangalore', 'Karnataka', 'ACTIVE'),
(2, 'CineWave Dolby Atmos Grand', 'Phoenix Palladium', 'Level 4, High Street Retail Zone', 'Mumbai', 'Maharashtra', 'ACTIVE'),
(3, 'CineWave Royal Premiere', 'Connaught Central', 'Block B, Radial Road 3', 'New Delhi', 'Delhi', 'ACTIVE'),
(4, 'CineWave Heritage Marina', 'Express Avenue', 'Whites Road, Royapettah', 'Chennai', 'Tamil Nadu', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Screens (Multiple screens per theatre)
INSERT INTO screens (id, theatre_id, screen_name, screen_type, total_seats) VALUES
(1, 1, 'Screen 1 - IMAX Laser', 'IMAX', 60),
(2, 1, 'Screen 2 - Dolby Atmos 3D', 'DOLBY_3D', 60),
(3, 2, 'Screen 1 - VIP Gold Class', 'VIP', 60),
(4, 2, 'Screen 2 - Atmos Panoramic', 'STANDARD', 60),
(5, 3, 'Screen 1 - Royal Premiere', 'VIP', 60),
(6, 4, 'Screen 1 - Oceanfront IMAX', 'IMAX', 60)
ON DUPLICATE KEY UPDATE screen_name=VALUES(screen_name);

-- 5. Insert Seats for Screens 1 to 6
-- 6 rows (A to F), 10 seats per row = 60 seats
-- Row A & B: RECLINER (₹350.00)
-- Row C & D: PREMIUM  (₹250.00)
-- Row E & F: REGULAR  (₹180.00)

DELIMITER $$
DROP PROCEDURE IF EXISTS GenerateCinemaSeats$$
CREATE PROCEDURE GenerateCinemaSeats()
BEGIN
    DECLARE scrId INT DEFAULT 1;
    DECLARE rIdx INT;
    DECLARE sIdx INT;
    DECLARE rName VARCHAR(2);
    DECLARE sType VARCHAR(20);
    DECLARE sPrice DECIMAL(10,2);

    WHILE scrId <= 6 DO
        SET rIdx = 1;
        WHILE rIdx <= 6 DO
            IF rIdx = 1 THEN SET rName = 'A'; SET sType = 'RECLINER'; SET sPrice = 350.00;
            ELSEIF rIdx = 2 THEN SET rName = 'B'; SET sType = 'RECLINER'; SET sPrice = 350.00;
            ELSEIF rIdx = 3 THEN SET rName = 'C'; SET sType = 'PREMIUM';  SET sPrice = 250.00;
            ELSEIF rIdx = 4 THEN SET rName = 'D'; SET sType = 'PREMIUM';  SET sPrice = 250.00;
            ELSEIF rIdx = 5 THEN SET rName = 'E'; SET sType = 'REGULAR';  SET sPrice = 180.00;
            ELSE SET rName = 'F'; SET sType = 'REGULAR'; SET sPrice = 180.00;
            END IF;

            SET sIdx = 1;
            WHILE sIdx <= 10 DO
                INSERT IGNORE INTO seats (screen_id, seat_number, row_name, seat_type, price, status)
                VALUES (scrId, CONCAT(rName, sIdx), rName, sType, sPrice, 'ACTIVE');
                SET sIdx = sIdx + 1;
            END WHILE;
            SET rIdx = rIdx + 1;
        END WHILE;
        SET scrId = scrId + 1;
    END WHILE;
END$$
DELIMITER ;

CALL GenerateCinemaSeats();
DROP PROCEDURE IF EXISTS GenerateCinemaSeats;

-- 6. Insert Routing Rules (US-010)
INSERT INTO routing_rules (id, show_type, team_name, active) VALUES
(1, 'REGULAR', 'General Booking Team', TRUE),
(2, 'PREMIUM', 'Premium Booking Team', TRUE),
(3, 'IMAX', 'IMAX Booking Team', TRUE),
(4, '3D', '3D Booking Team', TRUE),
(5, 'SPECIAL_EVENT', 'Special Events Team', TRUE)
ON DUPLICATE KEY UPDATE team_name=VALUES(team_name);

-- 7. Insert Shows (Across current and upcoming dates)
INSERT INTO shows (id, movie_id, screen_id, show_type, show_date, start_time, end_time, base_price, status) VALUES
-- Today & Next 3 Days shows for Movie 1 (Oppenheimer)
(1, 1, 1, 'IMAX', CURDATE(), '10:30:00', '13:30:00', 300.00, 'SCHEDULED'),
(2, 1, 1, 'IMAX', CURDATE(), '14:30:00', '17:30:00', 350.00, 'SCHEDULED'),
(3, 1, 1, 'IMAX', CURDATE(), '18:45:00', '21:45:00', 400.00, 'SCHEDULED'),
(4, 1, 2, '3D', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '14:00:00', 250.00, 'SCHEDULED'),
-- Movie 2 (Avatar)
(5, 2, 2, '3D', CURDATE(), '11:15:00', '14:25:00', 280.00, 'SCHEDULED'),
(6, 2, 1, 'IMAX', CURDATE(), '22:15:00', '01:25:00', 350.00, 'SCHEDULED'),
(7, 2, 6, 'IMAX', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '18:10:00', 320.00, 'SCHEDULED'),
-- Movie 3 (Inception)
(8, 3, 3, 'PREMIUM', CURDATE(), '13:00:00', '15:30:00', 260.00, 'SCHEDULED'),
(9, 3, 4, 'REGULAR', CURDATE(), '16:30:00', '19:00:00', 200.00, 'SCHEDULED'),
-- Movie 4 (Interstellar)
(10, 4, 1, 'IMAX', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '12:50:00', 320.00, 'SCHEDULED'),
(11, 4, 3, 'PREMIUM', CURDATE(), '19:30:00', '22:20:00', 290.00, 'SCHEDULED'),
-- Movie 5 (The Dark Knight)
(12, 5, 4, 'REGULAR', CURDATE(), '20:00:00', '22:35:00', 220.00, 'SCHEDULED'),
(13, 5, 5, 'PREMIUM', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00:00', '19:35:00', 270.00, 'SCHEDULED'),
-- Movie 6 (Dune)
(14, 6, 2, '3D', CURDATE(), '15:30:00', '18:15:00', 260.00, 'SCHEDULED'),
(15, 6, 6, 'IMAX', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', '22:45:00', 340.00, 'SCHEDULED')
ON DUPLICATE KEY UPDATE base_price=VALUES(base_price);

-- 8. Insert Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, minimum_amount, maximum_discount, start_date, expiry_date, usage_limit, used_count, status) VALUES
(1, 'WAVE20', 'PERCENTAGE', 20.00, 300.00, 150.00, '2026-01-01', '2026-12-31', 500, 12, 'ACTIVE'),
(2, 'CINE10', 'PERCENTAGE', 10.00, 200.00, 100.00, '2026-01-01', '2026-12-31', 1000, 45, 'ACTIVE'),
(3, 'BLOCKBUSTER', 'FIXED', 75.00, 350.00, 75.00, '2026-01-01', '2026-12-31', 200, 8, 'ACTIVE'),
(4, 'EXPIRED50', 'PERCENTAGE', 50.00, 100.00, 200.00, '2025-01-01', '2025-12-31', 50, 50, 'EXPIRED')
ON DUPLICATE KEY UPDATE discount_value=VALUES(discount_value);

-- 9. Insert Sample Completed Booking with Seats and Audit Log for Customer
INSERT INTO bookings (id, booking_reference, user_id, show_id, total_amount, subtotal, service_fee, tax, discount, status, sla_start_time, sla_deadline, sla_status, assigned_team, assigned_staff, payment_status, created_at, confirmed_at)
VALUES (1, 'CW-2026-000001', 3, 1, 790.60, 700.00, 70.00, 120.60, 100.00, 'CONFIRMED', DATE_SUB(NOW(), INTERVAL 20 MINUTE), DATE_ADD(NOW(), INTERVAL 10 MINUTE), 'COMPLETED_WITHIN_SLA', 'IMAX Booking Team', 'Operations Staff', 'PAID', DATE_SUB(NOW(), INTERVAL 20 MINUTE), DATE_SUB(NOW(), INTERVAL 15 MINUTE))
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- Book seats A1 and A2 for Show 1 (Screen 1)
-- Find seat IDs for Screen 1, A1 and A2
INSERT IGNORE INTO booking_seats (booking_id, seat_id, price)
SELECT 1, id, price FROM seats WHERE screen_id = 1 AND seat_number IN ('A1', 'A2');

-- Audit trail for the sample booking
INSERT INTO booking_audit_logs (booking_id, action, previous_status, new_status, actor_name, actor_role, comment, created_at) VALUES
(1, 'SUBMIT_REQUEST', NULL, 'PENDING', 'Jerry Customer', 'CUSTOMER', 'Customer submitted booking request for 2 seats.', DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
(1, 'AUTO_ROUTED', 'PENDING', 'UNDER_REVIEW', 'CineWave Routing Engine', 'SYSTEM', 'Routed to IMAX Booking Team based on IMAX show type.', DATE_SUB(NOW(), INTERVAL 19 MINUTE)),
(1, 'STAFF_CONFIRM', 'UNDER_REVIEW', 'CONFIRMED', 'Operations Staff', 'STAFF', 'Seats verified and booking confirmed.', DATE_SUB(NOW(), INTERVAL 15 MINUTE));

-- Notification for the sample booking
INSERT INTO notifications (user_id, booking_id, title, message, notification_type, is_read, created_at) VALUES
(3, 1, 'Booking Confirmed: CW-2026-000001', 'Your tickets for Oppenheimer: Quantum Dawn at CineWave IMAX Cyberplex (Screen 1 - IMAX Laser) have been successfully confirmed! Seats: A1, A2.', 'BOOKING_CONFIRMED', FALSE, DATE_SUB(NOW(), INTERVAL 15 MINUTE));

-- 10. Insert Sample Reviews
INSERT INTO reviews (user_id, movie_id, rating, comment, created_at) VALUES
(3, 1, 5, 'An absolute masterpiece of cinema. The sound design in IMAX shook the entire theatre!', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 3, 5, 'Mind-bending from start to finish. Hans Zimmers score elevates every single scene.', DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE comment=VALUES(comment);
