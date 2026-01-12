// src/components/MusicPlayer/Player.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaHeart, FaHistory } from 'react-icons/fa';
import './player.css';
import { useAuth } from '../../../contexts/authContext';

const Player = () => {
  const { user } = useAuth();
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // Load recently played from localStorage
  useEffect(() => {
    if (user?.username) {
      const stored = localStorage.getItem(`musicHistory_${user.username}`);
      if (stored) {
        setRecentlyPlayed(JSON.parse(stored).slice(0, 5));
      }
    }
  }, [user]);

  // Add track to history
  const addToHistory = (track) => {
    if (!user?.username) return;
    
    const historyItem = {
      ...track,
      playedAt: new Date().toISOString(),
      formattedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const stored = localStorage.getItem(`musicHistory_${user.username}`);
    let history = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    history = history.filter(item => item.id !== track.id);
    // Add to beginning and keep only last 50
    history = [historyItem, ...history.slice(0, 49)];
    
    localStorage.setItem(`musicHistory_${user.username}`, JSON.stringify(history));
    setRecentlyPlayed(history.slice(0, 5));
  };

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      addToHistory(track);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 0;
    
    setProgress(total ? (current / total) * 100 : 0);
    setCurrentTime(formatTime(current));
    setDuration(formatTime(total));
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume / 100;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const skipForward = () => {
    // Implement skip logic based on your track list
  };

  const skipBackward = () => {
    // Implement skip logic
  };

  return (
    <div className="player-container">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.preview_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      {/* Track Info */}
      <div className="player-track-info">
        {currentTrack && (
          <>
            <img 
              src={currentTrack.album?.images?.[0]?.url || 'https://picsum.photos/50'} 
              alt={currentTrack.name}
              className="track-thumbnail"
            />
            <div className="track-details">
              <h4 className="track-title">{currentTrack.name}</h4>
              <p className="track-artist">{currentTrack.artists?.[0]?.name || 'Unknown Artist'}</p>
            </div>
            <button className="track-like-btn">
              <FaHeart />
            </button>
          </>
        )}
      </div>

      {/* Player Controls */}
      <div className="player-controls">
        <div className="control-buttons">
          <button className="control-btn" onClick={skipBackward}>
            <FaStepBackward />
          </button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="control-btn" onClick={skipForward}>
            <FaStepForward />
          </button>
        </div>
        
        <div className="progress-container">
          <span className="time-current">{currentTime}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="time-total">{duration}</span>
        </div>
      </div>

      {/* Volume & History */}
      <div className="player-extra">
        <div className="volume-control">
          <button className="volume-btn" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>

        {/* Recently Played Dropdown */}
        <div className="recently-played-dropdown">
          <button className="history-toggle">
            <FaHistory />
            {recentlyPlayed.length > 0 && (
              <span className="history-badge">{recentlyPlayed.length}</span>
            )}
          </button>
          
          <div className="history-dropdown">
            <div className="dropdown-header">
              <FaHistory />
              <h4>Recently Played</h4>
            </div>
            {recentlyPlayed.length === 0 ? (
              <div className="dropdown-empty">
                <p>No recent plays</p>
              </div>
            ) : (
              <div className="dropdown-tracks">
                {recentlyPlayed.map((track) => (
                  <div 
                    key={track.id} 
                    className="dropdown-track"
                    onClick={() => playTrack(track)}
                  >
                    <img 
                      src={track.album?.images?.[0]?.url || 'https://picsum.photos/30'} 
                      alt={track.name}
                    />
                    <div className="dropdown-track-info">
                      <p className="dropdown-track-title">{track.name}</p>
                      <p className="dropdown-track-artist">{track.artists?.[0]?.name}</p>
                    </div>
                    <span className="dropdown-track-time">{track.formattedTime}</span>
                  </div>
                ))}
              </div>
            )}
            {recentlyPlayed.length > 0 && (
              <div className="dropdown-footer">
                <a href="/history">View Full History</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export a helper function to play tracks from other components
export const playTrackGlobal = (track, username) => {
  // This function can be called from anywhere to play a track
  console.log('Playing track from global:', track.name);
  // You might want to use a global event emitter or context for this
};

export default Player;