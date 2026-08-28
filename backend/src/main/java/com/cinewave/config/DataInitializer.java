package com.cinewave.config;

import com.cinewave.entity.*;
import com.cinewave.repository.MovieRepository;
import com.cinewave.repository.RoutingRuleRepository;
import com.cinewave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    // Precomputed secure BCrypt hash for initial admin credentials
    private static final String DEFAULT_ADMIN_HASH = "$2a$10$PrixOTKRANhPRTwwc63gTutl6cZ1iKxk2gRS/C6swBIJukQt5bti2";

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final RoutingRuleRepository routingRuleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${cinewave.admin.email:jerrymathew987@gmail.com}")
    private String adminEmail;

    @Value("${cinewave.admin.password:}")
    private String adminPasswordOverride;

    public DataInitializer(UserRepository userRepository,
                           MovieRepository movieRepository,
                           RoutingRuleRepository routingRuleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.routingRuleRepository = routingRuleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Ensure Primary System Administrator (Jerry Mathew J - jerrymathew987@gmail.com)
        String adminPasswordHash = (adminPasswordOverride != null && !adminPasswordOverride.trim().isEmpty())
                ? passwordEncoder.encode(adminPasswordOverride.trim())
                : DEFAULT_ADMIN_HASH;

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    user.setName("Jerry Mathew J");
                    user.setRole(Role.ADMIN);
                    user.setPassword(adminPasswordHash);
                    userRepository.save(user);
                },
                () -> {
                    User admin = new User(
                            "Jerry Mathew J",
                            adminEmail,
                            adminPasswordHash,
                            "+1 (555) 777-0101",
                            Role.ADMIN
                    );
                    userRepository.save(admin);
                }
        );

        // 2. Ensure Secondary Demo Admin User
        userRepository.findByEmail("admin@cinewave.com").ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode("Admin@123"));
                    user.setRole(Role.ADMIN);
                    userRepository.save(user);
                },
                () -> {
                    User admin = new User(
                            "System Administrator",
                            "admin@cinewave.com",
                            passwordEncoder.encode("Admin@123"),
                            "+1 (555) 019-2831",
                            Role.ADMIN
                    );
                    userRepository.save(admin);
                }
        );

        // 3. Ensure Staff User
        userRepository.findByEmail("staff@cinewave.com").ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode("Staff@123"));
                    user.setRole(Role.STAFF);
                    userRepository.save(user);
                },
                () -> {
                    User staff = new User(
                            "Operations Staff",
                            "staff@cinewave.com",
                            passwordEncoder.encode("Staff@123"),
                            "+1 (555) 019-2832",
                            Role.STAFF
                    );
                    userRepository.save(staff);
                }
        );

        // 4. Ensure Customer User
        userRepository.findByEmail("customer@cinewave.com").ifPresentOrElse(
                user -> {
                    user.setPassword(passwordEncoder.encode("Customer@123"));
                    user.setRole(Role.CUSTOMER);
                    userRepository.save(user);
                },
                () -> {
                    User customer = new User(
                            "Jerry Customer",
                            "customer@cinewave.com",
                            passwordEncoder.encode("Customer@123"),
                            "+1 (555) 019-2833",
                            Role.CUSTOMER
                    );
                    userRepository.save(customer);
                }
        );

        // 5. Seed Requested Movie / Content Catalogue Entries
        seedMovieIfMissing(
                "The Passion of the Christ",
                "A powerful, gripping depiction of the final twelve hours in the earthly life of Jesus of Nazareth on the day of His crucifixion in Jerusalem. Directed by Mel Gibson.",
                "Biblical / Drama",
                "Aramaic / Latin",
                127,
                LocalDate.of(2004, 2, 25),
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=4Aif1qEB_JU",
                BigDecimal.valueOf(9.2),
                MovieStatus.NOW_SHOWING
        );

        seedMovieIfMissing(
                "Son of God",
                "The inspiring life story of Jesus from His humble birth in Bethlehem, through His profound ministry and miracles, to His crucifixion and ultimate resurrection. Produced by Roma Downey and Mark Burnett.",
                "Biblical / Biography",
                "English",
                138,
                LocalDate.of(2014, 2, 28),
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=WcIXCok9HPg",
                BigDecimal.valueOf(8.8),
                MovieStatus.NOW_SHOWING
        );

        seedMovieIfMissing(
                "The Prince of Egypt",
                "An Egyptian prince discovers his true Hebrew heritage and accepts his divine calling to lead his people out of slavery into the Promised Land. Award-winning musical masterpiece from DreamWorks Animation.",
                "Animation / Epic / Drama",
                "English",
                99,
                LocalDate.of(1998, 12, 18),
                "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=N04ZfL_Puh8",
                BigDecimal.valueOf(9.1),
                MovieStatus.NOW_SHOWING
        );

        seedMovieIfMissing(
                "The Chosen",
                "[TV / Web Series] The revolutionary, award-winning multi-season television and web series depicting the life and public ministry of Jesus Christ through the perspectives of the people who knew and followed Him. Created and directed by Dallas Jenkins.",
                "TV / Web Series",
                "English",
                60,
                LocalDate.of(2019, 4, 21),
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                "https://www.youtube.com/watch?v=K1-FoFj8Jbo",
                BigDecimal.valueOf(9.6),
                MovieStatus.NOW_SHOWING
        );

        // 6. Ensure Default Routing Rules
        ensureRoutingRule("REGULAR", "General Booking Team");
        ensureRoutingRule("PREMIUM", "Premium Booking Team");
        ensureRoutingRule("IMAX", "IMAX Booking Team");
        ensureRoutingRule("3D", "3D Booking Team");
        ensureRoutingRule("SPECIAL_EVENT", "Special Events Team");
    }

    private void seedMovieIfMissing(String title, String description, String genre, String language,
                                    int duration, LocalDate releaseDate, String posterUrl, String trailerUrl,
                                    BigDecimal rating, MovieStatus status) {
        if (!movieRepository.existsByTitle(title)) {
            Movie movie = new Movie();
            movie.setTitle(title);
            movie.setDescription(description);
            movie.setGenre(genre);
            movie.setLanguage(language);
            movie.setDuration(duration);
            movie.setReleaseDate(releaseDate);
            movie.setPosterUrl(posterUrl);
            movie.setTrailerUrl(trailerUrl);
            movie.setRating(rating);
            movie.setStatus(status);
            movieRepository.save(movie);
        }
    }

    private void ensureRoutingRule(String showType, String teamName) {
        if (routingRuleRepository.findByShowType(showType).isEmpty()) {
            RoutingRule rule = new RoutingRule(showType, teamName, true);
            routingRuleRepository.save(rule);
        }
    }
}
