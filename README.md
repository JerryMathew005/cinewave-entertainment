# CineWave Entertainment
## Movie Ticket Booking Management System — Complete Full-Stack Application

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![MySQL 8](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-8.2-purple.svg)](https://vitejs.dev/)
[![Design Theme](https://img.shields.io/badge/Theme-Cinema%20Blue-0284C7.svg)](#design-theme)

**CineWave Entertainment** is a production-ready, full-stack Movie Ticket Booking Management web application inspired by the business and functional requirements of a Pega Movie Ticket Booking Management case lifecycle. It is built from scratch with custom architecture, implementing all required user stories (**US-001 through US-010**), concurrency protections, a background SLA engine, show-type automatic routing, interactive tiered seat selection, digital QR e-tickets, and role-based administration.

---

## 1. User Stories & Pega Requirement Traceability

| ID | User Story Title | Status | Implementation Details |
|---|---|---|---|
| **US-001** | **Submit Movie Ticket Request** | **COMPLETED** | Customer selects Movie, Theatre, Screen, Show Date, Time Slot, and Seats. Validates availability, calculates pricing, creates booking in `PENDING` state, generates unique reference (e.g. `CW-2026-000101`), initializes SLA, and records audit trail. |
| **US-002** | **Check Show Availability** | **COMPLETED** | Real-time seat inventory query dynamically joining screens and booked tickets. Prevents double-booking via serializable database transactions (`Isolation.SERIALIZABLE`). |
| **US-003** | **Calculate Booking Cost** | **COMPLETED** | Tiered pricing engine based on seat category (`REGULAR`, `PREMIUM`, `RECLINER`), plus convenience fees (10%), tax calculations (18% GST), and promotional coupon discounts with min-spend and discount caps. |
| **US-004** | **Confirm Booking Request** | **COMPLETED** | Explicit customer confirmation step (`PUT /api/bookings/{id}/confirm`). Transitions case status to `CONFIRMED`, permanently locks seats, triggers celebratory feedback, and generates digital QR pass. |
| **US-005** | **Capture Customer Feedback** | **COMPLETED** | Dedicated movie rating and review system (`POST /api/movies/{id}/reviews`) with 1-5 star ratings, feedback comments, and automated average score recalculation. |
| **US-006** | **Review Booking Details** | **COMPLETED** | Comprehensive case audit trail displaying chronological history, actor, role, previous status, new status, timestamps, and comments for customers, staff, and administrators. |
| **US-007** | **Process Ticket Booking** | **COMPLETED** | Staff/Admin operational queue enabling team triage, review comments, manual overrides, explicit approval (`CONFIRM`), or rejection (`REJECT`) with real-time seat release. |
| **US-008** | **Notify Booking Confirmation** | **COMPLETED** | In-app notification center alerting customers when tickets are submitted, confirmed, cancelled, or when SLA warnings/breaches are detected. |
| **US-009** | **Define Booking SLA** | **COMPLETED** | Automated SLA tracking engine with 30-minute default deadlines, 10-minute warning states, and a Spring `@Scheduled` background worker scanning active cases every 30 seconds. |
| **US-010** | **Route Booking by Show Type** | **COMPLETED** | Auto-routing dispatcher mapping show formats (`IMAX` → *IMAX Booking Team*, `PREMIUM` → *Premium Booking Team*, `THREE_D` → *3D Booking Team*, `REGULAR` → *General Booking Team*) with admin configurable rules. |

---

## 2. Visual Design & Theme: Cinema Blue

The application employs a **cinema-inspired Blue visual design**:
- **Primary Brand Colors**: Deep Navy (`#0A192F`), Midnight Slate (`#061325`), Royal Blue (`#0284C7`), Sky Glow (`#38BDF8`).
- **Seating Grid**:
  - **Regular Seats**: Clean light-blue accents (`#F8FAFC` / `#CBD5E1`)
  - **Premium Seats**: Cyan highlights (`#E0F2FE` / `#38BDF8`)
  - **Recliner Loungers**: Indigo accents (`#EEF2FF` / `#818CF8`)
  - **Selected Seats**: Vivid Royal Blue (`#0284C7`) with ambient neon glow
  - **Booked Seats**: Disabled slate (`#CBD5E1`)
- **Curved Cinema Screen**: Ambient overhead glow visual simulating a live theatre screen.
- **E-Ticket**: Contactless cinema pass with QR code, tear notches, and print capability.

---

## 3. Technology Stack

- **Backend**:
  - Java 21 / 25
  - Spring Boot 3.3.5
  - Spring Security 6 (Stateless JWT Authentication)
  - Spring Data JPA / Hibernate ORM
  - MySQL 8.0
  - Springdoc OpenAPI 3 / Swagger
- **Frontend**:
  - React 19 + Vite 8
  - React Router DOM v7
  - Axios (with Bearer token request/response interceptors)
  - Lucide React Icons
  - `qrcode.react` for digital ticket verification
  - `canvas-confetti` for celebratory animations
  - Pure Vanilla CSS Design System (`index.css`)

---

## 4. Default Demo Accounts

All accounts have pre-seeded data and quick-fill buttons on the Login page:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Customer** | `customer@cinewave.com` | `Customer@123` | Book tickets, view history, cancel bookings, leave reviews, save wishlist, in-app alerts |
| **Staff** | `staff@cinewave.com` | `Staff@123` | Ticket processing queue, confirm/reject requests, view audit history, monitor SLAs |
| **Admin** | `admin@cinewave.com` | `Admin@123` | Full dashboard, manage movies, theatres, screens, shows, coupons, users, SLA, routing rules |

---

## 5. Running the Application Locally

### Prerequisites
- Java 21 or later
- Node.js 18 or later & npm
- MySQL 8.0 running locally on port `3306`

### Step 1: Database Setup
Execute the schema and seed scripts in MySQL:
```bash
mysql -u root -p cinewave_db < database/schema.sql
mysql -u root -p cinewave_db < database/seed.sql
```

### Step 2: Run the Spring Boot Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/cinewave-backend-1.0.0.jar
```
*Backend runs on:* `http://localhost:8080`  
*Swagger UI available at:* `http://localhost:8080/swagger-ui/index.html`

### Step 3: Run the React Vite Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 6. Docker Deployment (One-Command Launch)

To run the entire full-stack system (MySQL + Backend + Frontend Nginx) in Docker:
```bash
docker-compose up --build
```
Access the application directly in your browser at `http://localhost`.

---

## 7. Concurrency Protection & Security

- **Race Condition Prevention**: `BookingService.createBookingRequest` operates under `Isolation.SERIALIZABLE` and queries `BookingSeatRepository.countBookedSeatsForShow(showId, seatIds)` inside the database transaction. If any seat is claimed simultaneously by another thread, an immediate `SeatAlreadyBookedException` (HTTP 409 Conflict) is thrown, and the second booking is rolled back.
- **Stateless JWT**: Tokens are signed with HMAC SHA-256 and sent in the `Authorization: Bearer <token>` header.
- **Passwords**: Encrypted using BCrypt with salt.
