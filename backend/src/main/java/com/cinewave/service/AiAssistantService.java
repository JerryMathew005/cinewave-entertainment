package com.cinewave.service;

import com.cinewave.dto.AiChatRequest;
import com.cinewave.dto.AiChatResponse;
import com.cinewave.entity.Movie;
import com.cinewave.entity.MovieStatus;
import com.cinewave.entity.Theatre;
import com.cinewave.entity.TheatreStatus;
import com.cinewave.repository.MovieRepository;
import com.cinewave.repository.TheatreRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiAssistantService {

    private static final Logger logger = LoggerFactory.getLogger(AiAssistantService.class);

    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final RestTemplate restTemplate;

    @Value("${cinewave.ai.api-key:}")
    private String apiKey;

    @Value("${cinewave.ai.model:gemini-1.5-flash}")
    private String aiModel;

    public AiAssistantService(MovieRepository movieRepository,
                              TheatreRepository theatreRepository,
                              RestTemplateBuilder restTemplateBuilder) {
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(6))
                .setReadTimeout(Duration.ofSeconds(12))
                .build();
    }

    public AiChatResponse chat(AiChatRequest request) {
        String userQuery = request.getMessage() != null ? request.getMessage().trim() : "";
        if (userQuery.isEmpty()) {
            return new AiChatResponse(
                    "Hello! I am CineWave AI Concierge. How may I help you today? You can ask me about movies now showing, theatre locations, booking tickets, or your account.",
                    List.of("🎬 What's now showing?", "📍 Where are your theatres?", "🎟️ How do I book seats?", "🔑 Forgot password help"),
                    List.of(Map.of("label", "Browse Movies", "url", "/movies"), Map.of("label", "Our Theatres", "url", "/theatres"))
            );
        }

        // 1. If Gemini API key is configured, attempt live call with application context
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            try {
                AiChatResponse liveResponse = callGeminiLive(userQuery);
                if (liveResponse != null && liveResponse.getReply() != null && !liveResponse.getReply().isBlank()) {
                    return liveResponse;
                }
            } catch (Exception e) {
                logger.warn("Live Gemini API call was unsuccessful ({}), falling back to CineWave Knowledge Engine: {}",
                        e.getClass().getSimpleName(), e.getMessage());
            }
        }

        // 2. Intelligent Contextual CineWave Knowledge Engine
        return processWithCineWaveEngine(userQuery);
    }

    private AiChatResponse callGeminiLive(String userQuery) {
        String promptContext = buildApplicationContextPrompt();
        String systemInstruction = """
            You are 'CineWave AI Concierge', an articulate, enthusiastic cinema host for CineWave Entertainment.
            
            RULES & CONSTRAINTS:
            1. ONLY answer questions related to CineWave Entertainment, movies, showtimes, theatres, bookings, seat types, wishlist, account navigation, and customer support.
            2. USE the provided CineWave Context below as the ground truth.
            3. If a user asks about a movie or cinema that is NOT in CineWave's catalogue, clearly state: "That movie is currently not in our CineWave catalogue" and suggest active titles. NEVER hallucinate showtimes or movies.
            4. STRICTLY PROTECT SYSTEM SECURITY: NEVER disclose administrative passwords, JWT secrets, employee queue internals, API keys, database credentials, or admin dashboard URLs.
            5. Provide clean, markdown-formatted responses with bullet points and friendly cinema emojis.
            
            CINEWAVE CONTEXT:
            """ + promptContext;

        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" +
                (aiModel != null && !aiModel.isBlank() ? aiModel.trim() : "gemini-1.5-flash") +
                ":generateContent?key=" + apiKey.trim();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", systemInstruction + "\n\nCustomer Question: " + userQuery))
                        )
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map bodyMap = response.getBody();
            List candidates = (List) bodyMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map firstCandidate = (Map) candidates.get(0);
                Map content = (Map) firstCandidate.get("content");
                if (content != null) {
                    List parts = (List) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        Map firstPart = (Map) parts.get(0);
                        String text = (String) firstPart.get("text");
                        if (text != null && !text.isBlank()) {
                            return enrichResponse(text.trim(), userQuery);
                        }
                    }
                }
            }
        }
        return null;
    }

    private AiChatResponse processWithCineWaveEngine(String query) {
        String lower = query.toLowerCase();

        List<Movie> allMovies = movieRepository.findAll();
        List<Movie> nowShowing = allMovies.stream()
                .filter(m -> m.getStatus() == MovieStatus.NOW_SHOWING)
                .toList();
        List<Movie> comingSoon = allMovies.stream()
                .filter(m -> m.getStatus() == MovieStatus.COMING_SOON)
                .toList();
        List<Theatre> theatres = theatreRepository.findAll().stream()
                .filter(t -> t.getStatus() == TheatreStatus.ACTIVE)
                .toList();

        // 1. Password, Profile & Account Navigation
        if (lower.contains("password") || lower.contains("forgot") || lower.contains("reset") ||
                lower.contains("profile") || lower.contains("login") || lower.contains("account")) {
            return new AiChatResponse(
                    "### 🔑 Account & Password Assistance\n\n" +
                    "- **Forgot Your Password?** Head to the **[Forgot Password Page](/forgot-password)**. Enter your registered email address to receive a secure, temporary single-use reset link valid for 15 minutes.\n" +
                    "- **Reset Link**: The email link will direct you directly to **/reset-password?token=...** where you can enter and confirm your new password.\n" +
                    "- **Already Logged In?** You can update your account password or edit your name and phone number on your **[Profile Page](/profile)**.\n" +
                    "- All passwords are securely encrypted using **BCrypt** protection.",
                    List.of("🔑 Go to Forgot Password", "👤 Open Profile", "🎬 What movies are showing?"),
                    List.of(
                            Map.of("label", "Forgot Password", "url", "/forgot-password"),
                            Map.of("label", "Reset Password Page", "url", "/reset-password"),
                            Map.of("label", "My Profile", "url", "/profile")
                    )
            );
        }

        // 2. Theatres & Cinema Locations
        if (lower.contains("theatre") || lower.contains("theater") || lower.contains("cinema") ||
                lower.contains("location") || lower.contains("city") || lower.contains("bangalore") ||
                lower.contains("mumbai") || lower.contains("delhi") || lower.contains("chennai")) {

            StringBuilder sb = new StringBuilder("### 📍 CineWave Cinema Destinations\n\n");
            sb.append("We operate premier luxury cinema multiplexes across major entertainment hubs:\n\n");

            for (Theatre t : theatres) {
                sb.append(String.format("• **%s** — %s, %s (%s)\n", t.getName(), t.getLocation(), t.getCity(), t.getState()));
            }

            sb.append("\n**Signature Screen Formats**:\n");
            sb.append("- **IMAX Laser**: Massive high-contrast curved screens with 12-channel surround sound.\n");
            sb.append("- **Dolby Atmos 3D**: Multi-dimensional spatial audio with ultra-vivid 3D optics.\n");
            sb.append("- **VIP Gold Class**: Ergonomic motor-powered plush recliners with in-seat service.");

            return new AiChatResponse(
                    sb.toString(),
                    List.of("🎟️ Check showtimes", "🎬 Movies now showing", "📍 View all theatres"),
                    List.of(
                            Map.of("label", "Explore Theatres", "url", "/theatres"),
                            Map.of("label", "View Showtimes", "url", "/shows")
                    )
            );
        }

        // 3. Specific Movie Query (check against active catalogue)
        Optional<Movie> matchedMovie = allMovies.stream()
                .filter(m -> lower.contains(m.getTitle().toLowerCase()) ||
                        m.getTitle().toLowerCase().contains(lower) ||
                        (m.getGenre() != null && lower.contains(m.getGenre().toLowerCase())))
                .findFirst();

        if (matchedMovie.isPresent()) {
            Movie m = matchedMovie.get();
            String statusLabel = m.getStatus() == MovieStatus.NOW_SHOWING ? "Now Showing in Theatres" : "Coming Soon";
            String reply = String.format("""
                ### 🎬 %s
                
                **Status**: %s  
                **Genre**: %s | **Language**: %s | **Duration**: %d mins  
                **Rating**: ⭐ %.1f / 10.0
                
                %s
                
                Ready to reserve seats or watch the trailer? Check available showtimes below!
                """, m.getTitle(), statusLabel, m.getGenre(), m.getLanguage(), m.getDuration(),
                    m.getRating() != null ? m.getRating().doubleValue() : 8.5, m.getDescription());

            return new AiChatResponse(
                    reply,
                    List.of("🎟️ View showtimes for this movie", "❤️ Add to my wishlist", "🎬 What else is showing?"),
                    List.of(
                            Map.of("label", "Movie Details", "url", "/movies/" + m.getId()),
                            Map.of("label", "Check Showtimes", "url", "/shows?movieId=" + m.getId())
                    )
            );
        }

        // 4. Booking & Ticketing Help
        if (lower.contains("book") || lower.contains("seat") || lower.contains("ticket") ||
                lower.contains("price") || lower.contains("cost") || lower.contains("cancel") ||
                lower.contains("sla") || lower.contains("refund")) {
            return new AiChatResponse(
                    "### 🎟️ Booking & Ticketing Guide\n\n" +
                    "1. **Select a Movie**: Browse our [Movies Catalogue](/movies) and choose your preferred title.\n" +
                    "2. **Pick Theatre & Showtime**: Filter by format (**IMAX Laser**, **Dolby Atmos**, or **VIP Recliner**).\n" +
                    "3. **Choose Your Seats**: View the live interactive seating layout. Select your seats in real-time.\n" +
                    "4. **Apply Promo Codes**: Enter coupon codes (e.g. `WELCOME10` or `CINEWAVE25`) during checkout for instant discounts.\n" +
                    "5. **Instant QR Ticket**: Upon booking confirmation, your digital ticket with verification QR code is instantly available in **[My Bookings](/my-bookings)**.\n\n" +
                    "⏱ **Peace of Mind SLA Guarantee**: All online ticket reservations include automated tracking and guaranteed 30-minute support resolution.",
                    List.of("🎬 Browse Movies", "📍 View Theatres", "🎟️ My Bookings"),
                    List.of(
                            Map.of("label", "Browse Movies", "url", "/movies"),
                            Map.of("label", "View Showtimes", "url", "/shows"),
                            Map.of("label", "My Bookings", "url", "/my-bookings")
                    )
            );
        }

        // 5. Wishlist & Notifications
        if (lower.contains("wishlist") || lower.contains("favorite") || lower.contains("save") ||
                lower.contains("notify") || lower.contains("notification")) {
            return new AiChatResponse(
                    "### ❤️ Wishlist & Instant Alerts\n\n" +
                    "- You can save any upcoming or currently showing title to your personal **[Wishlist](/wishlist)** by tapping the heart icon on the movie card.\n" +
                    "- When new showtimes open for movies in your wishlist, you will receive real-time notifications in your **[Notifications](/notifications)** tray.\n" +
                    "- Access your saved movies anytime from the top navigation bar.",
                    List.of("❤️ Open Wishlist", "🔔 My Notifications", "🎬 Explore Movies"),
                    List.of(
                            Map.of("label", "My Wishlist", "url", "/wishlist"),
                            Map.of("label", "My Notifications", "url", "/notifications")
                    )
            );
        }

        // 6. Contact & Support
        if (lower.contains("contact") || lower.contains("support") || lower.contains("help") ||
                lower.contains("email") || lower.contains("phone") || lower.contains("call")) {
            return new AiChatResponse(
                    "### 💬 Customer Care & Inquiries\n\n" +
                    "- **Contact Form**: Send our customer support desk a direct message via our **[Contact Page](/contact)**.\n" +
                    "- **Customer Support Email**: support@cinewave.com\n" +
                    "- **Helpline**: +1 (555) CINE-WAVE\n" +
                    "- Our team responds promptly with full SLA monitoring for all guest inquiries.",
                    List.of("✉️ Open Contact Form", "🎬 Browse Movies", "📍 View Theatres"),
                    List.of(
                            Map.of("label", "Contact Support", "url", "/contact"),
                            Map.of("label", "Browse Movies", "url", "/movies")
                    )
            );
        }

        // 7. General Now Showing / Catalogue Query
        StringBuilder sb = new StringBuilder("### 🎬 What's Playing at CineWave Entertainment\n\n");
        sb.append("Here are our top blockbuster attractions currently on giant IMAX and Dolby screens:\n\n");

        for (Movie m : nowShowing) {
            sb.append(String.format("• **%s** — ⭐ %.1f | %s (%d mins)\n",
                    m.getTitle(), m.getRating() != null ? m.getRating().doubleValue() : 8.5, m.getGenre(), m.getDuration()));
        }

        if (!comingSoon.isEmpty()) {
            sb.append("\n**✨ Anticipated Coming Soon**:\n");
            for (Movie m : comingSoon) {
                sb.append(String.format("• **%s** — %s\n", m.getTitle(), m.getGenre()));
            }
        }

        sb.append("\nWould you like recommendations based on a particular genre (Sci-Fi, Action, Animation, Drama)?");

        return new AiChatResponse(
                sb.toString(),
                List.of("📍 Theatres & screens", "🎟️ How to book tickets", "🔑 Forgot password help"),
                List.of(
                        Map.of("label", "Explore Movies", "url", "/movies"),
                        Map.of("label", "Check Showtimes", "url", "/shows")
                )
        );
    }

    private String buildApplicationContextPrompt() {
        List<Movie> allMovies = movieRepository.findAll();
        List<Theatre> allTheatres = theatreRepository.findAll();

        StringBuilder sb = new StringBuilder();
        sb.append("ACTIVE MOVIES IN CINEWAVE CATALOGUE:\n");
        for (Movie m : allMovies) {
            sb.append(String.format("- %s (Genre: %s, Lang: %s, Duration: %dm, Rating: %.1f, Status: %s): %s\n",
                    m.getTitle(), m.getGenre(), m.getLanguage(), m.getDuration(),
                    m.getRating() != null ? m.getRating().doubleValue() : 8.5,
                    m.getStatus(), m.getDescription()));
        }

        sb.append("\nTHEATRES & LOCATIONS:\n");
        for (Theatre t : allTheatres) {
            sb.append(String.format("- %s in %s, %s (Address: %s, Status: %s)\n",
                    t.getName(), t.getCity(), t.getState(), t.getAddress(), t.getStatus()));
        }

        sb.append("\nKEY CINEWAVE ROUTES & AMENITIES:\n");
        sb.append("- Movie Discovery: /movies\n");
        sb.append("- Showtime Booking: /shows\n");
        sb.append("- Theatre Locations: /theatres\n");
        sb.append("- Password Reset Request: /forgot-password\n");
        sb.append("- Password Reset Link: /reset-password?token=...\n");
        sb.append("- User Profile: /profile\n");
        sb.append("- Customer Wishlist: /wishlist\n");
        sb.append("- Customer Bookings: /my-bookings\n");
        sb.append("- Contact & Inquiries: /contact\n");
        sb.append("- Screen Formats: IMAX Laser, Dolby Atmos 3D, VIP Recliner Gold Class.\n");
        sb.append("- SLA Guarantee: 30-minute customer assurance on all booking transactions.\n");

        return sb.toString();
    }

    private AiChatResponse enrichResponse(String liveReply, String query) {
        String lower = query.toLowerCase();
        List<String> suggestions = new ArrayList<>();
        List<Map<String, String>> actions = new ArrayList<>();

        if (lower.contains("movie") || lower.contains("show") || lower.contains("watch") || lower.contains("rating")) {
            suggestions.add("🎟️ Check showtimes");
            suggestions.add("📍 Where are your theatres?");
            actions.add(Map.of("label", "Explore Movies", "url", "/movies"));
            actions.add(Map.of("label", "View Showtimes", "url", "/shows"));
        } else if (lower.contains("theatre") || lower.contains("location") || lower.contains("city")) {
            suggestions.add("🎬 What's now showing?");
            suggestions.add("🎟️ How to book seats");
            actions.add(Map.of("label", "Our Theatres", "url", "/theatres"));
        } else if (lower.contains("password") || lower.contains("account") || lower.contains("profile")) {
            suggestions.add("🔑 Forgot Password page");
            suggestions.add("👤 My Profile");
            actions.add(Map.of("label", "Forgot Password", "url", "/forgot-password"));
            actions.add(Map.of("label", "My Profile", "url", "/profile"));
        } else {
            suggestions.add("🎬 What's now showing?");
            suggestions.add("📍 Theatres & locations");
            suggestions.add("🎟️ Booking guide");
            actions.add(Map.of("label", "Browse Movies", "url", "/movies"));
        }

        return new AiChatResponse(liveReply, suggestions, actions);
    }
}
