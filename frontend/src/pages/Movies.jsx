import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import movieService from '../services/movieService';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('title') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [statusTab, setStatusTab] = useState(searchParams.get('status') || 'ALL');

  const genres = ['Sci-Fi', 'Action', 'Drama', 'Adventure', 'Thriller', 'Animation'];
  const languages = ['English', 'Hindi', 'Spanish', 'Japanese'];

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery.trim()) params.title = searchQuery.trim();
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedLanguage) params.language = selectedLanguage;
      if (statusTab !== 'ALL') params.status = statusTab;

      const data = await movieService.getAllMovies(params);
      setMovies(data || []);
    } catch (err) {
      console.error('Failed to load movies', err);
      setError(err.response?.data?.message || 'No internet connection. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, selectedGenre, selectedLanguage, statusTab]);

  const handleResetFilters = () => {
    setSelectedGenre('');
    setSelectedLanguage('');
    setSearchQuery('');
    setStatusTab('ALL');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Movie Catalog</h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Explore blockbuster movies currently playing and upcoming releases at CineWave.
        </p>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {['ALL', 'NOW_SHOWING', 'COMING_SOON'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusTab(tab)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: statusTab === tab ? '#0284C7' : '#CBD5E1',
              backgroundColor: statusTab === tab ? '#0284C7' : '#FFFFFF',
              color: statusTab === tab ? '#FFFFFF' : '#475569',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'ALL' ? 'All Movies' : tab === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search movies by title..."
        />
      </div>

      <FilterBar
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onReset={handleResetFilters}
      />

      {/* Movie Results */}
      {loading ? (
        <LoadingSpinner text="Searching movies..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchMovies} />
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '1.1rem', color: '#64748B', marginBottom: '1rem' }}>No movies found matching your filters.</p>
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">Reset All Filters</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
