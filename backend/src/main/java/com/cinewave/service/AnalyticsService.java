package com.cinewave.service;

import com.cinewave.dto.AnalyticsDTO;
import com.cinewave.entity.Booking;
import com.cinewave.entity.BookingStatus;
import com.cinewave.entity.Movie;
import com.cinewave.entity.SlaStatus;
import com.cinewave.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheatreRepository theatreRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public AnalyticsService(UserRepository userRepository,
                            MovieRepository movieRepository,
                            TheatreRepository theatreRepository,
                            ShowRepository showRepository,
                            BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.theatreRepository = theatreRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsDTO getDashboardAnalytics() {
        AnalyticsDTO dto = new AnalyticsDTO();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalMovies(movieRepository.count());
        dto.setTotalTheatres(theatreRepository.count());
        dto.setTotalShows(showRepository.count());
        dto.setTotalBookings(bookingRepository.count());

        dto.setPendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING));
        dto.setConfirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        dto.setCancelledBookings(bookingRepository.countByStatus(BookingStatus.CANCELLED));
        dto.setSlaBreaches(bookingRepository.countBySlaStatus(SlaStatus.SLA_BREACHED));

        Double revenue = bookingRepository.calculateTotalRevenue();
        dto.setTotalRevenue(revenue != null ? revenue : 0.0);

        // Status Distribution
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            distribution.put(status.name(), bookingRepository.countByStatus(status));
        }
        dto.setStatusDistribution(distribution);

        // Popular Movies calculation
        List<Booking> allBookings = bookingRepository.findAll();
        Map<Long, Long> bookingsPerMovie = allBookings.stream()
                .filter(b -> b.getShow() != null && b.getShow().getMovie() != null)
                .collect(Collectors.groupingBy(b -> b.getShow().getMovie().getId(), Collectors.counting()));

        List<Map<String, Object>> popularMoviesList = new ArrayList<>();
        List<Movie> allMovies = movieRepository.findAll();
        for (Movie m : allMovies) {
            Map<String, Object> map = new HashMap<>();
            map.put("movieId", m.getId());
            map.put("title", m.getTitle());
            map.put("genre", m.getGenre());
            map.put("rating", m.getRating());
            map.put("bookingsCount", bookingsPerMovie.getOrDefault(m.getId(), 0L));
            popularMoviesList.add(map);
        }
        popularMoviesList.sort((a, b) -> Long.compare((Long) b.get("bookingsCount"), (Long) a.get("bookingsCount")));
        dto.setPopularMovies(popularMoviesList);

        // Monthly Bookings Trend
        Map<String, Long> monthlyTrend = new LinkedHashMap<>();
        for (Booking b : allBookings) {
            String month = b.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            monthlyTrend.put(month, monthlyTrend.getOrDefault(month, 0L) + 1);
        }
        List<Map<String, Object>> monthlyList = new ArrayList<>();
        monthlyTrend.forEach((month, count) -> {
            Map<String, Object> m = new HashMap<>();
            m.put("month", month);
            m.put("count", count);
            monthlyList.add(m);
        });
        dto.setMonthlyBookings(monthlyList);

        // Theatre Occupancy
        List<Map<String, Object>> theatreOccupancyList = new ArrayList<>();
        theatreRepository.findAll().forEach(theatre -> {
            long theatreBookings = allBookings.stream()
                    .filter(b -> b.getShow() != null && b.getShow().getScreen() != null &&
                            b.getShow().getScreen().getTheatre() != null &&
                            b.getShow().getScreen().getTheatre().getId().equals(theatre.getId()))
                    .count();
            Map<String, Object> toMap = new HashMap<>();
            toMap.put("theatreName", theatre.getName());
            toMap.put("city", theatre.getCity());
            toMap.put("bookingCount", theatreBookings);
            theatreOccupancyList.add(toMap);
        });
        dto.setTheatreOccupancy(theatreOccupancyList);

        return dto;
    }
}
