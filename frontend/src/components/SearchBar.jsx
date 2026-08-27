import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search movies, theatres...', onClear }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: '2.5rem', paddingRight: value ? '2.5rem' : '1rem', height: '46px', fontSize: '0.95rem' }}
      />
      <Search
        size={18}
        style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748B', pointerEvents: 'none' }}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '12px',
            top: '13px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94A3B8'
          }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
