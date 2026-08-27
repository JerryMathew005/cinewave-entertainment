package com.cinewave.service;

import com.cinewave.dto.MovieCreateDTO;
import com.cinewave.dto.MovieDTO;
import com.cinewave.entity.Movie;
import com.cinewave.entity.MovieStatus;
import com.cinewave.exception.ResourceNotFoundException;
import com.cinewave.mapper.EntityDtoMapper;
import com.cinewave.repository.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Transactional(readOnly = true)
    public List<MovieDTO> getAllMovies(String title, String genre, String language, MovieStatus status) {
        List<Movie> movies;
        if (title != null || genre != null || language != null || status != null) {
            movies = movieRepository.searchMovies(title, genre, language, status);
        } else {
            movies = movieRepository.findAll();
        }
        return movies.stream().map(EntityDtoMapper::toMovieDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MovieDTO> getNowShowingMovies() {
        return movieRepository.findByStatus(MovieStatus.NOW_SHOWING).stream()
                .map(EntityDtoMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MovieDTO> getComingSoonMovies() {
        return movieRepository.findByStatus(MovieStatus.COMING_SOON).stream()
                .map(EntityDtoMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MovieDTO getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return EntityDtoMapper.toMovieDTO(movie);
    }

    @Transactional
    public MovieDTO createMovie(MovieCreateDTO dto) {
        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setGenre(dto.getGenre());
        movie.setLanguage(dto.getLanguage());
        movie.setDuration(dto.getDuration());
        movie.setReleaseDate(dto.getReleaseDate());
        movie.setPosterUrl(dto.getPosterUrl());
        movie.setTrailerUrl(dto.getTrailerUrl());
        movie.setRating(dto.getRating());
        movie.setStatus(dto.getStatus() != null ? dto.getStatus() : MovieStatus.NOW_SHOWING);

        Movie saved = movieRepository.save(movie);
        return EntityDtoMapper.toMovieDTO(saved);
    }

    @Transactional
    public MovieDTO updateMovie(Long id, MovieCreateDTO dto) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setGenre(dto.getGenre());
        movie.setLanguage(dto.getLanguage());
        movie.setDuration(dto.getDuration());
        movie.setReleaseDate(dto.getReleaseDate());
        movie.setPosterUrl(dto.getPosterUrl());
        movie.setTrailerUrl(dto.getTrailerUrl());
        if (dto.getRating() != null) movie.setRating(dto.getRating());
        if (dto.getStatus() != null) movie.setStatus(dto.getStatus());

        Movie updated = movieRepository.save(movie);
        return EntityDtoMapper.toMovieDTO(updated);
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        movieRepository.delete(movie);
    }
}
