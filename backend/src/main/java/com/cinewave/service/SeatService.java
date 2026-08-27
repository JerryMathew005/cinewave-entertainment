package com.cinewave.service;

import com.cinewave.dto.SeatDTO;
import com.cinewave.entity.Screen;
import com.cinewave.entity.Seat;
import com.cinewave.entity.SeatStatus;
import com.cinewave.entity.Show;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.BookingRepository;
import com.cinewave.repository.ScreenRepository;
import com.cinewave.repository.SeatRepository;
import com.cinewave.repository.ShowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ScreenRepository screenRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public SeatService(SeatRepository seatRepository,
                       ScreenRepository screenRepository,
                       ShowRepository showRepository,
                       BookingRepository bookingRepository) {
        this.seatRepository = seatRepository;
        this.screenRepository = screenRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<SeatDTO> getSeatsByScreenId(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenIdOrderByRowNameAscSeatNumberAsc(screenId);
        return seats.stream().map(s -> EntityDtoMapper.toSeatDTO(s, false)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SeatDTO> getSeatsForShow(Long showId) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + showId));

        Long screenId = show.getScreen().getId();
        List<Seat> screenSeats = seatRepository.findByScreenIdOrderByRowNameAscSeatNumberAsc(screenId);
        List<Long> bookedSeatIds = bookingRepository.findBookedSeatIdsByShowId(showId);
        Set<Long> bookedSet = new HashSet<>(bookedSeatIds);

        return screenSeats.stream()
                .map(seat -> EntityDtoMapper.toSeatDTO(seat, bookedSet.contains(seat.getId())))
                .collect(Collectors.toList());
    }

    @Transactional
    public SeatDTO createSeat(SeatDTO dto) {
        Screen screen = screenRepository.findById(dto.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + dto.getScreenId()));

        Seat seat = new Seat();
        seat.setScreen(screen);
        seat.setSeatNumber(dto.getSeatNumber());
        seat.setRowName(dto.getRowName());
        seat.setSeatType(dto.getSeatType());
        seat.setPrice(dto.getPrice());
        seat.setStatus(dto.getStatus() != null ? dto.getStatus() : SeatStatus.ACTIVE);

        Seat saved = seatRepository.save(seat);
        return EntityDtoMapper.toSeatDTO(saved, false);
    }

    @Transactional
    public SeatDTO updateSeat(Long id, SeatDTO dto) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + id));

        if (dto.getSeatNumber() != null) seat.setSeatNumber(dto.getSeatNumber());
        if (dto.getRowName() != null) seat.setRowName(dto.getRowName());
        if (dto.getSeatType() != null) seat.setSeatType(dto.getSeatType());
        if (dto.getPrice() != null) seat.setPrice(dto.getPrice());
        if (dto.getStatus() != null) seat.setStatus(dto.getStatus());

        Seat updated = seatRepository.save(seat);
        return EntityDtoMapper.toSeatDTO(updated, false);
    }
}
