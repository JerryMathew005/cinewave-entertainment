package com.cinewave.config;

import com.cinewave.entity.*;
import com.cinewave.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    // Precomputed secure BCrypt hash for initial admin credentials
    private static final String DEFAULT_ADMIN_HASH = "$2a$10$PrixOTKRANhPRTwwc63gTutl6cZ1iKxk2gRS/C6swBIJukQt5bti2";

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final RoutingRuleRepository routingRuleRepository;
    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowRepository showRepository;
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    @Value("${cinewave.admin.email:jerrymathew987@gmail.com}")
    private String adminEmail;

    @Value("${cinewave.admin.password:}")
    private String adminPasswordOverride;

    public DataInitializer(UserRepository userRepository,
                           MovieRepository movieRepository,
                           RoutingRuleRepository routingRuleRepository,
                           TheatreRepository theatreRepository,
                           ScreenRepository screenRepository,
                           SeatRepository seatRepository,
                           ShowRepository showRepository,
                           JdbcTemplate jdbcTemplate,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.routingRuleRepository = routingRuleRepository;
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showRepository = showRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Safe migration: fix any legacy '3D' values to 'THREE_D' in database
        try {
            jdbcTemplate.execute("UPDATE shows SET show_type = 'THREE_D' WHERE show_type = '3D'");
        } catch (Exception ignored) {}

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

        // 2. Demote any legacy demo admin if present so only jerrymathew987@gmail.com has ADMIN
        userRepository.findByEmail("admin@cinewave.com").ifPresent(user -> {
            user.setRole(Role.STAFF);
            userRepository.save(user);
        });

        // 3. Ensure Support User
        userRepository.findByEmail("staff@cinewave.com").ifPresentOrElse(
                user -> {
                    user.setName("Sarah Jenkins");
                    user.setPassword(passwordEncoder.encode("Staff@123"));
                    userRepository.save(user);
                },
                () -> {
                    User staff = new User(
                            "Sarah Jenkins",
                            "staff@cinewave.com",
                            passwordEncoder.encode("Staff@123"),
                            "+1 (555) 019-2832",
                            Role.CUSTOMER
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

        // 5. Seed Requested Movie / Content Catalogue Entries with Official Artwork
        seedOrUpdateMovie(
                "The Passion of the Christ",
                "A powerful, gripping depiction of the final twelve hours in the earthly life of Jesus of Nazareth on the day of His crucifixion in Jerusalem. Directed by Mel Gibson.",
                "Biblical / Drama",
                "Aramaic / Latin",
                127,
                LocalDate.of(2004, 2, 25),
                "https://image.tmdb.org/t/p/w780/4840rkbpsiuow5ew155oVKcqJwj.jpg",
                "https://image.tmdb.org/t/p/w1280/rBM5o2HpmCfDejuIPybI09tkY3V.jpg",
                "https://www.youtube.com/watch?v=4Aif1qEB_JU",
                BigDecimal.valueOf(9.2),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Son of God",
                "The inspiring life story of Jesus from His humble birth in Bethlehem, through His profound ministry and miracles, to His crucifixion and ultimate resurrection. Produced by Roma Downey and Mark Burnett.",
                "Biblical / Biography",
                "English",
                138,
                LocalDate.of(2014, 2, 28),
                "https://image.tmdb.org/t/p/w780/hONTXxtQVSYySKW5f3nRndKUfhc.jpg",
                "https://image.tmdb.org/t/p/w1280/ayqHV0rHuAdMv8PS497W2OByGWk.jpg",
                "https://www.youtube.com/watch?v=WcIXCok9HPg",
                BigDecimal.valueOf(8.8),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "The Prince of Egypt",
                "An Egyptian prince discovers his true Hebrew heritage and accepts his divine calling to lead his people out of slavery into the Promised Land. Award-winning musical masterpiece from DreamWorks Animation.",
                "Animation / Epic / Drama",
                "English",
                99,
                LocalDate.of(1998, 12, 18),
                "https://image.tmdb.org/t/p/w780/565DYYXgdRYMiETLi2EDx4p7s92.jpg",
                "https://image.tmdb.org/t/p/w1280/2xUjYwL6Ol7TLJPPKs7sYW5PWLX.jpg",
                "https://www.youtube.com/watch?v=N04ZfL_Puh8",
                BigDecimal.valueOf(9.1),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "The Chosen",
                "[TV / Web Series] The revolutionary, award-winning multi-season television and web series depicting the life and public ministry of Jesus Christ through the perspectives of the people who knew and followed Him. Created and directed by Dallas Jenkins.",
                "TV / Web Series",
                "English",
                60,
                LocalDate.of(2019, 4, 21),
                "https://image.tmdb.org/t/p/w780/3siv3RaQrdr2tQiv9jHq71sLlzo.jpg",
                "https://image.tmdb.org/t/p/w1280/dqVUFuNrMFWt7uGNWlpo91VKYOI.jpg",
                "https://www.youtube.com/watch?v=K1-FoFj8Jbo",
                BigDecimal.valueOf(9.6),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Oppenheimer: Quantum Dawn",
                "The gripping biographical journey of J. Robert Oppenheimer and the creation of the atomic age, featuring intense psychological stakes and groundbreaking IMAX visuals.",
                "Sci-Fi / Drama",
                "English",
                180,
                LocalDate.of(2026, 7, 21),
                "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
                "https://www.youtube.com/watch?v=uYPbbksJxIg",
                BigDecimal.valueOf(9.3),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Avatar: Fire and Ash",
                "Return to the mesmerizing world of Pandora as Jake Sully and Neytiri face a fierce new Ash clan among the volcanic reaches of the oceanic moon.",
                "Action / Sci-Fi",
                "English",
                190,
                LocalDate.of(2026, 8, 15),
                "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
                "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
                "https://www.youtube.com/watch?v=d9MyW72ELq0",
                BigDecimal.valueOf(8.9),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Inception: Lucid Horizon",
                "A master thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "Sci-Fi / Thriller",
                "English",
                148,
                LocalDate.of(2026, 6, 10),
                "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
                "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
                "https://www.youtube.com/watch?v=YoHD9XEInc0",
                BigDecimal.valueOf(9.1),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Interstellar: Beyond Time",
                "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
                "Sci-Fi / Adventure",
                "English",
                169,
                LocalDate.of(2026, 5, 18),
                "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
                "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                BigDecimal.valueOf(9.4),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "The Dark Knight: Legacy",
                "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                "Action / Crime",
                "English",
                152,
                LocalDate.of(2026, 8, 1),
                "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                "https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
                "https://www.youtube.com/watch?v=EXeTwQWrcwY",
                BigDecimal.valueOf(9.2),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Dune: Prophecy of Arrakis",
                "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and destiny, he endeavors to prevent a terrible future.",
                "Sci-Fi / Epic",
                "English",
                166,
                LocalDate.of(2026, 8, 20),
                "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
                "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
                "https://www.youtube.com/watch?v=Way9Dexny3w",
                BigDecimal.valueOf(8.8),
                MovieStatus.NOW_SHOWING
        );

        seedOrUpdateMovie(
                "Spider-Man: Across Realities",
                "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
                "Animation / Action",
                "English",
                140,
                LocalDate.of(2026, 9, 12),
                "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
                "https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
                "https://www.youtube.com/watch?v=cqGjhVJWtEg",
                BigDecimal.valueOf(8.7),
                MovieStatus.COMING_SOON
        );

        seedOrUpdateMovie(
                "Gladiator: Eternal Arena",
                "Decades after Maximus heroic sacrifice, a new champion rises to challenge the corrupt emperors who rule Rome from atop the Colosseum.",
                "Action / Historical",
                "English",
                155,
                LocalDate.of(2026, 10, 5),
                "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
                "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
                "https://www.youtube.com/watch?v=4rgYUipGJNo",
                BigDecimal.valueOf(8.5),
                MovieStatus.COMING_SOON
        );

        // 6. Ensure Default Routing Rules
        ensureRoutingRule("REGULAR", "General Booking Team");
        ensureRoutingRule("PREMIUM", "Premium Booking Team");
        ensureRoutingRule("IMAX", "IMAX Booking Team");
        ensureRoutingRule("3D", "3D Booking Team");
        ensureRoutingRule("SPECIAL_EVENT", "Special Events Team");

        // 7. Ensure Theatres, Screens, and Auditorium Seats
        ensureTheatresAndScreensAndSeats();

        // 8. Ensure Working Showtimes for Every Movie in the Catalog
        ensureComprehensiveShowtimes();
    }

    private void seedOrUpdateMovie(String title, String description, String genre, String language,
                                   int duration, LocalDate releaseDate, String posterUrl, String bannerUrl,
                                   String trailerUrl, BigDecimal rating, MovieStatus status) {
        movieRepository.findByTitle(title).ifPresentOrElse(
                existing -> {
                    boolean modified = false;
                    if (existing.getPosterUrl() == null || !existing.getPosterUrl().equals(posterUrl)) {
                        existing.setPosterUrl(posterUrl);
                        modified = true;
                    }
                    if (existing.getBannerUrl() == null || !existing.getBannerUrl().equals(bannerUrl)) {
                        existing.setBannerUrl(bannerUrl);
                        modified = true;
                    }
                    if (modified) {
                        movieRepository.save(existing);
                    }
                },
                () -> {
                    Movie movie = new Movie();
                    movie.setTitle(title);
                    movie.setDescription(description);
                    movie.setGenre(genre);
                    movie.setLanguage(language);
                    movie.setDuration(duration);
                    movie.setReleaseDate(releaseDate);
                    movie.setPosterUrl(posterUrl);
                    movie.setBannerUrl(bannerUrl);
                    movie.setTrailerUrl(trailerUrl);
                    movie.setRating(rating);
                    movie.setStatus(status);
                    movieRepository.save(movie);
                }
        );
    }

    private void ensureRoutingRule(String showType, String teamName) {
        if (routingRuleRepository.findByShowType(showType).isEmpty()) {
            RoutingRule rule = new RoutingRule(showType, teamName, true);
            routingRuleRepository.save(rule);
        }
    }

    private void ensureTheatresAndScreensAndSeats() {
        if (theatreRepository.count() == 0) {
            Theatre t1 = createTheatre("CineWave IMAX Cyberplex", "Cyber City Hub", "Plot 42, Tech Park Boulevard", "Bangalore", "Karnataka", TheatreStatus.ACTIVE);
            Theatre t2 = createTheatre("CineWave Dolby Atmos Grand", "Phoenix Palladium", "Level 4, High Street Retail Zone", "Mumbai", "Maharashtra", TheatreStatus.ACTIVE);
            Theatre t3 = createTheatre("CineWave Royal Premiere", "Connaught Central", "Block B, Radial Road 3", "New Delhi", "Delhi", TheatreStatus.ACTIVE);
            Theatre t4 = createTheatre("CineWave Heritage Marina", "Express Avenue", "Whites Road, Royapettah", "Chennai", "Tamil Nadu", TheatreStatus.ACTIVE);

            createScreen(t1, "Screen 1 - IMAX Laser", ScreenType.IMAX, 60);
            createScreen(t1, "Screen 2 - Dolby Atmos 3D", ScreenType.DOLBY_3D, 60);
            createScreen(t2, "Screen 1 - VIP Gold Class", ScreenType.VIP, 60);
            createScreen(t2, "Screen 2 - Atmos Panoramic", ScreenType.STANDARD, 60);
            createScreen(t3, "Screen 1 - Royal Premiere", ScreenType.VIP, 60);
            createScreen(t4, "Screen 1 - Oceanfront IMAX", ScreenType.IMAX, 60);
        }

        // Ensure seats are generated for every configured screen
        List<Screen> allScreens = screenRepository.findAll();
        for (Screen screen : allScreens) {
            ensureSeatsForScreen(screen);
        }
    }

    private Theatre createTheatre(String name, String location, String address, String city, String state, TheatreStatus status) {
        Theatre t = new Theatre();
        t.setName(name);
        t.setLocation(location);
        t.setAddress(address);
        t.setCity(city);
        t.setState(state);
        t.setStatus(status);
        return theatreRepository.save(t);
    }

    private Screen createScreen(Theatre theatre, String name, ScreenType type, int totalSeats) {
        Screen s = new Screen();
        s.setTheatre(theatre);
        s.setScreenName(name);
        s.setScreenType(type);
        s.setTotalSeats(totalSeats);
        return screenRepository.save(s);
    }

    private void ensureSeatsForScreen(Screen screen) {
        if (seatRepository.findByScreenIdOrderByRowNameAscSeatNumberAsc(screen.getId()).isEmpty()) {
            String[] rows = {"A", "B", "C", "D", "E", "F"};
            for (String row : rows) {
                SeatType type = row.equals("A") ? SeatType.RECLINER : (row.equals("B") ? SeatType.PREMIUM : SeatType.REGULAR);
                BigDecimal price = row.equals("A") ? BigDecimal.valueOf(350.00) : (row.equals("B") ? BigDecimal.valueOf(250.00) : BigDecimal.valueOf(180.00));
                for (int i = 1; i <= 10; i++) {
                    Seat seat = new Seat();
                    seat.setScreen(screen);
                    seat.setRowName(row);
                    seat.setSeatNumber(row + i);
                    seat.setSeatType(type);
                    seat.setPrice(price);
                    seat.setStatus(SeatStatus.ACTIVE);
                    seatRepository.save(seat);
                }
            }
        }
    }

    private void ensureComprehensiveShowtimes() {
        List<Movie> movies = movieRepository.findAll();
        List<Screen> screens = screenRepository.findAll();
        if (movies.isEmpty() || screens.isEmpty()) return;

        LocalDate today = LocalDate.now();

        for (Movie movie : movies) {
            // Schedule showtimes for today and upcoming 4 days
            for (int d = 0; d <= 4; d++) {
                LocalDate date = today.plusDays(d);
                int baseIndex = (int) ((movie.getId() != null ? movie.getId() : 1) % screens.size());
                Screen s1 = screens.get(baseIndex);
                Screen s2 = screens.get((baseIndex + 1) % screens.size());
                Screen s3 = screens.get((baseIndex + 2) % screens.size());

                ShowType t1 = s1.getScreenType() == ScreenType.IMAX ? ShowType.IMAX : (s1.getScreenType() == ScreenType.DOLBY_3D ? ShowType.THREE_D : ShowType.REGULAR);
                ShowType t2 = s2.getScreenType() == ScreenType.VIP ? ShowType.PREMIUM : (s2.getScreenType() == ScreenType.DOLBY_3D ? ShowType.THREE_D : ShowType.REGULAR);
                ShowType t3 = s3.getScreenType() == ScreenType.IMAX ? ShowType.IMAX : ShowType.REGULAR;

                seedShowIfAbsent(movie, s1, t1, date, LocalTime.of(10, 30), LocalTime.of(13, 15), BigDecimal.valueOf(250.00));
                seedShowIfAbsent(movie, s2, t2, date, LocalTime.of(15, 0), LocalTime.of(17, 45), BigDecimal.valueOf(280.00));
                seedShowIfAbsent(movie, s3, t3, date, LocalTime.of(19, 30), LocalTime.of(22, 15), BigDecimal.valueOf(320.00));
            }
        }
    }

    private void seedShowIfAbsent(Movie movie, Screen screen, ShowType showType, LocalDate date, LocalTime startTime, LocalTime endTime, BigDecimal price) {
        if (!showRepository.existsByMovieIdAndScreenIdAndShowDateAndStartTime(movie.getId(), screen.getId(), date, startTime)) {
            Show show = new Show();
            show.setMovie(movie);
            show.setScreen(screen);
            show.setShowType(showType);
            show.setShowDate(date);
            show.setStartTime(startTime);
            show.setEndTime(endTime);
            show.setBasePrice(price);
            show.setStatus(ShowStatus.SCHEDULED);
            showRepository.save(show);
        }
    }
}
