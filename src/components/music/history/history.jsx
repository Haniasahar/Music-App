// src/components/music/History.jsx
import React, { useState, useEffect } from 'react';
import { FaPlay, FaTrash, FaHistory as FaHistoryIcon, FaClock } from 'react-icons/fa';
import { useAuth } from '../../../contexts/authContext';
import './History.css';

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      const storedHistory = localStorage.getItem(`musicHistory_${user?.username}`);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      setIsLoading(false);
    };

    loadHistory();
  }, [user]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (user?.username && history.length > 0) {
      localStorage.setItem(`musicHistory_${user.username}`, JSON.stringify(history));
    }
  }, [history, user]);

  // Function to add a track to history (call this when playing a track)
  const addToHistory = (track) => {
    const now = new Date();
    const historyItem = {
      ...track,
      playedAt: now.toISOString(),
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory(prev => {
      // Remove if already exists (to avoid duplicates)
      const filtered = prev.filter(item => item.id !== track.id);
      // Add to beginning and keep only last 50 items
      return [historyItem, ...filtered.slice(0, 49)];
    });
  };

  const clearHistory = () => {
    if (window.confirm('Clear all history?')) {
      setHistory([]);
      if (user?.username) {
        localStorage.removeItem(`musicHistory_${user.username}`);
      }
    }
  };

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const playTrack = (track) => {
    // Add to history when playing
    addToHistory(track);
    // Your play logic here
    console.log('Playing:', track.name);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return <div className="history-loading">Loading history...</div>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="header-title">
          <FaHistoryIcon className="history-icon" />
          <h2>Recently Played</h2>
        </div>
        {history.length > 0 && (
          <button className="clear-history-btn" onClick={clearHistory}>
            <FaTrash /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <FaClock className="empty-icon" />
          <h3>No history yet</h3>
          <p>Play some songs and they'll appear here</p>
        </div>
      ) : (
        <>
          <div className="history-stats">
            <div className="stat-item">
              <span className="stat-number">{history.length}</span>
              <span className="stat-label">Total Plays</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {new Set(history.map(item => item.artists?.[0]?.name)).size}
              </span>
              <span className="stat-label">Artists</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {new Set(history.map(item => item.album?.name)).size}
              </span>
              <span className="stat-label">Albums</span>
            </div>
          </div>

          <div className="history-list">
            {history.map((item, index) => (
              <div key={`${item.id}-${index}`} className="history-item">
                <div className="item-index">
                  {index + 1}
                </div>
                <div className="item-image">
                  <img 
                    src={item.album?.images?.[0]?.url || 'https://picsum.photos/50'} 
                    alt={item.name}
                  />
                  <button 
                    className="play-overlay"
                    onClick={() => playTrack(item)}
                  >
                    <FaPlay />
                  </button>
                </div>
                <div className="item-info">
                  <h4 className="item-title">{item.name}</h4>
                  <p className="item-artist">{item.artists?.[0]?.name || 'Unknown Artist'}</p>
                  <div className="item-meta">
                    <span className="item-time">
                      <FaClock /> {item.formattedTime || formatDate(item.playedAt)}
                    </span>
                    <span className="item-album">{item.album?.name || 'Single'}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button 
                    className="play-btn"
                    onClick={() => playTrack(item)}
                  >
                    <FaPlay />
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromHistory(item.id)}
                    title="Remove from history"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="history-footer">
            <p>History is saved locally in your browser</p>
            <button 
              className="export-history-btn"
              onClick={() => {
                const dataStr = JSON.stringify(history, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = 'music-history.json';
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
            >
              Export History (JSON)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Export this function to use in player component
export const addToHistoryGlobal = (track, username) => {
  if (!username) return;
  
  const storedHistory = localStorage.getItem(`musicHistory_${username}`);
  let history = storedHistory ? JSON.parse(storedHistory) : [];
  
  const now = new Date();
  const historyItem = {
    ...track,
    playedAt: now.toISOString(),
    formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // Remove if already exists
  history = history.filter(item => item.id !== track.id);
  // Add to beginning and keep only last 50 items
  history = [historyItem, ...history.slice(0, 49)];
  
  localStorage.setItem(`musicHistory_${username}`, JSON.stringify(history));
};

export default History;