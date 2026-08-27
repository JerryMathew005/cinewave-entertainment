import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({
  genres = [],
  selectedGenre,
  onGenreChange,
  languages = [],
  selectedLanguage,
  onLanguageChange,
  onReset
}) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: '#FFFFFF',
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284C7', fontWeight: '600', fontSize: '0.85rem' }}>
        <Filter size={15} /> Filters:
      </div>

      {/* Genre Filter */}
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="form-select"
        style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
      >
        <option value="">All Genres</option>
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Language Filter */}
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="form-select"
        style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
      >
        <option value="">All Languages</option>
        {languages.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {(selectedGenre || selectedLanguage) && (
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
