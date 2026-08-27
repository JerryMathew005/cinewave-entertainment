package com.cinewave.service;

import com.cinewave.dto.ScreenDTO;
import com.cinewave.dto.TheatreCreateDTO;
import com.cinewave.dto.TheatreDTO;
import com.cinewave.entity.Screen;
import com.cinewave.entity.Theatre;
import com.cinewave.entity.TheatreStatus;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.ScreenRepository;
import com.cinewave.repository.TheatreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheatreService {

    private final TheatreRepository theatreRepository;
    private final ScreenRepository screenRepository;

    public TheatreService(TheatreRepository theatreRepository, ScreenRepository screenRepository) {
        this.theatreRepository = theatreRepository;
        this.screenRepository = screenRepository;
    }

    @Transactional(readOnly = true)
    public List<TheatreDTO> getAllTheatres(String city) {
        List<Theatre> theatres;
        if (city != null && !city.isBlank()) {
            theatres = theatreRepository.findByCityIgnoreCase(city);
        } else {
            theatres = theatreRepository.findAll();
        }
        return theatres.stream().map(EntityDtoMapper::toTheatreDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TheatreDTO getTheatreById(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + id));
        return EntityDtoMapper.toTheatreDTO(theatre);
    }

    @Transactional(readOnly = true)
    public List<ScreenDTO> getScreensByTheatreId(Long theatreId) {
        if (!theatreRepository.existsById(theatreId)) {
            throw new ResourceNotFoundException("Theatre not found with id: " + theatreId);
        }
        return screenRepository.findByTheatreId(theatreId).stream()
                .map(EntityDtoMapper::toScreenDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TheatreDTO createTheatre(TheatreCreateDTO dto) {
        Theatre theatre = new Theatre();
        theatre.setName(dto.getName());
        theatre.setLocation(dto.getLocation());
        theatre.setAddress(dto.getAddress());
        theatre.setCity(dto.getCity());
        theatre.setState(dto.getState());
        theatre.setStatus(dto.getStatus() != null ? dto.getStatus() : TheatreStatus.ACTIVE);

        Theatre saved = theatreRepository.save(theatre);
        return EntityDtoMapper.toTheatreDTO(saved);
    }

    @Transactional
    public TheatreDTO updateTheatre(Long id, TheatreCreateDTO dto) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + id));

        theatre.setName(dto.getName());
        theatre.setLocation(dto.getLocation());
        theatre.setAddress(dto.getAddress());
        theatre.setCity(dto.getCity());
        theatre.setState(dto.getState());
        if (dto.getStatus() != null) theatre.setStatus(dto.getStatus());

        Theatre updated = theatreRepository.save(theatre);
        return EntityDtoMapper.toTheatreDTO(updated);
    }

    @Transactional
    public void deleteTheatre(Long id) {
        Theatre theatre = theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + id));
        theatreRepository.delete(theatre);
    }

    @Transactional
    public ScreenDTO createScreen(ScreenDTO dto) {
        Theatre theatre = theatreRepository.findById(dto.getTheatreId())
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id: " + dto.getTheatreId()));

        Screen screen = new Screen();
        screen.setTheatre(theatre);
        screen.setScreenName(dto.getScreenName());
        screen.setScreenType(dto.getScreenType());
        screen.setTotalSeats(dto.getTotalSeats() != null ? dto.getTotalSeats() : 60);

        Screen saved = screenRepository.save(screen);
        return EntityDtoMapper.toScreenDTO(saved);
    }

    @Transactional
    public void deleteScreen(Long screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));
        screenRepository.delete(screen);
    }
}
