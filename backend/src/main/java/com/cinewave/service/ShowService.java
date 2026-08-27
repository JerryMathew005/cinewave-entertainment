package com.cinewave.service;

import com.cinewave.dto.ShowCreateDTO;
import com.cinewave.dto.ShowDTO;
import com.cinewave.entity.*;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.BookingRepository;
import com.cinewave.repository.MovieRepository;
import com.cinewave.repository.ScreenRepository;
import com.cinewave.repository.ShowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final BookingRepository bookingRepository;

    public ShowService(ShowRepository showRepository,
                       MovieRepository movieRepository,
                       ScreenRepository screenRepository,
                       BookingRepository bookingRepository) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<ShowDTO> getAllShows(Long movieId, Long theatreId, LocalDate showDate, ShowStatus status) {
        List<Show> shows = showRepository.filterShows(movieId, theatreId, showDate, status);
        return shows.stream().map(this::mapWithAvailableSeats).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShowDTO> getShowsByMovie(Long movieId) {
        LocalDate today = LocalDate.now();
        List<Show> shows = showRepository.findByMovieIdAndShowDateGreaterThanEqualOrderByShowDateAscStartTimeAsc(movieId, today);
        return shows.stream().map(this::mapWithAvailableSeats).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ShowDTO> getShowsByTheatre(Long theatreId) {
        LocalDate today = LocalDate.now();
        List<Show> shows = showRepository.findByScreen_Theatre_IdAndShowDateGreaterThanEqualOrderByShowDateAscStartTimeAsc(theatreId, today);
        return shows.stream().map(this::mapWithAvailableSeats).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ShowDTO getShowById(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + id));
        return mapWithAvailableSeats(show);
    }

    private ShowDTO mapWithAvailableSeats(Show show) {
        List<Long> bookedSeatIds = bookingRepository.findBookedSeatIdsByShowId(show.getId());
        int totalSeats = show.getScreen() != null ? show.getScreen().getTotalSeats() : 60;
        int availableSeats = Math.max(0, totalSeats - bookedSeatIds.size());
        return EntityDtoMapper.toShowDTO(show, availableSeats);
    }

    @Transactional
    public ShowDTO createShow(ShowCreateDTO dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + dto.getMovieId()));
        Screen screen = screenRepository.findById(dto.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + dto.getScreenId()));

        Show show = new Show();
        show.setMovie(movie);
        show.setScreen(screen);
        show.setShowType(dto.getShowType() != null ? dto.getShowType() : ShowType.REGULAR);
        show.setShowDate(dto.getShowDate());
        show.setStartTime(dto.getStartTime());
        show.setEndTime(dto.getEndTime());
        show.setBasePrice(dto.getBasePrice());
        show.setStatus(dto.getStatus() != null ? dto.getStatus() : ShowStatus.SCHEDULED);

        Show saved = showRepository.save(show);
        return mapWithAvailableSeats(saved);
    }

    @Transactional
    public ShowDTO updateShow(Long id, ShowCreateDTO dto) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + id));

        if (dto.getMovieId() != null) {
            Movie movie = movieRepository.findById(dto.getMovieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + dto.getMovieId()));
            show.setMovie(movie);
        }

        if (dto.getScreenId() != null) {
            Screen screen = screenRepository.findById(dto.getScreenId())
                    .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + dto.getScreenId()));
            show.setScreen(screen);
        }

        if (dto.getShowType() != null) show.setShowType(dto.getShowType());
        if (dto.getShowDate() != null) show.setShowDate(dto.getShowDate());
        if (dto.getStartTime() != null) show.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) show.setEndTime(dto.getEndTime());
        if (dto.getBasePrice() != null) show.setBasePrice(dto.getBasePrice());
        if (dto.getStatus() != null) show.setStatus(dto.getStatus());

        Show updated = showRepository.save(show);
        return mapWithAvailableSeats(updated);
    }

    @Transactional
    public void deleteShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + id));
        showRepository.delete(show);
    }
}
