// src/components/music/SearchBar.jsx
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './searchBar.css';

const SearchBar = ({ isKidMode, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchType, setSearchType] = useState('track');
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    explicit: !isKidMode
  });

  const kidGenres = ['children', 'nursery', 'kids', 'educational', 'cartoon'];
  const adultGenres = ['pop', 'rock', 'hip-hop', 'jazz', 'classical'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    let searchQuery = keyword;
    
    // Add filters to query if active
    if (filters.year) {
      searchQuery += ` year:${filters.year}`;
    }
    if (filters.genre && filters.genre !== 'all') {
      searchQuery += ` genre:${filters.genre}`;
    }
    
    // Execute search
    if (onSearch) {
      onSearch(searchQuery, { type: searchType, ...filters });
    }
    
    console.log('Searching:', { query: searchQuery, type: searchType, filters });
  };

  const clearSearch = () => {
    setKeyword('');
    if (onSearch) {
      onSearch('', { type: 'track', year: '', genre: '', explicit: !isKidMode });
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={isKidMode ? "Search for kid-friendly songs..." : "Search songs, artists, albums..."}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          {keyword && (
            <button 
              type="button" 
              className="clear-btn"
              onClick={clearSearch}
            >
              <FaTimes />
            </button>
          )}
          
          <div className="search-type">
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="track">Songs</option>
              <option value="artist">Artists</option>
              <option value="album">Albums</option>
              <option value="playlist">Playlists</option>
            </select>
          </div>
          
          <button 
            type="button"
            className="filter-toggle"
            onClick={toggleFilters}
          >
            <FaFilter />
            Filters
          </button>
          
          <button type="submit" className="search-submit">
            Search
          </button>
        </div>

        {showFilters && (
          <div className="search-filters">
            <div className="filter-group">
              <label>Year</label>
              <input
                type="number"
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear()}
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
              />
            </div>
            
            <div className="filter-group">
              <label>Genre</label>
              <select 
                value={filters.genre} 
                onChange={(e) => setFilters({...filters, genre: e.target.value})}
              >
                <option value="all">All Genres</option>
                {(isKidMode ? kidGenres : adultGenres).map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {!isKidMode && (
              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.explicit}
                    onChange={(e) => setFilters({...filters, explicit: e.target.checked})}
                  />
                  Include explicit content
                </label>
              </div>
            )}
            
            <div className="filter-actions">
              <button 
                type="button"
                className="apply-filters"
                onClick={handleSubmit}
              >
                Apply Filters
              </button>
              <button 
                type="button"
                className="reset-filters"
                onClick={() => {
                  setFilters({
                    year: '',
                    genre: '',
                    explicit: !isKidMode
                  });
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Quick Suggestions */}
      <div className="search-suggestions">
        <span className="suggestions-label">Try:</span>
        {isKidMode ? (
          <>
            <button onClick={() => setKeyword('nursery rhymes')}>Nursery Rhymes</button>
            <button onClick={() => setKeyword('cartoon songs')}>Cartoon Songs</button>
            <button onClick={() => setKeyword('educational songs')}>Educational</button>
            <button onClick={() => setKeyword('bedtime songs')}>Bedtime</button>
          </>
        ) : (
          <>
            <button onClick={() => setKeyword('pop hits')}>Pop Hits</button>
            <button onClick={() => setKeyword('rock classics')}>Rock</button>
            <button onClick={() => setKeyword('chill vibes')}>Chill</button>
            <button onClick={() => setKeyword('workout music')}>Workout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;