// src/components/HomeView.jsx
import React, { useState, useEffect } from 'react';
import { FaPlay, FaHeart, FaPlus } from 'react-icons/fa';
// import './HomeView.css';
import { useAuth } from '../contexts/authContext';

const HomeView = ({ isKidMode }) => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch age-appropriate tracks
  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        // Different API calls based on mode
        const keyword = isKidMode ? 'kids songs nursery rhymes' : 'popular music';
        const apiUrl = `https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${keyword}&type=track&limit=12`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        let fetchedTracks = data.tracks?.items || [];
        
        // Filter for kids if needed
        if (isKidMode) {
          fetchedTracks = fetchedTracks.filter(track => 
            isKidFriendly(track.name, track.artists?.[0]?.name)
          );
        }
        
        setTracks(fetchedTracks.slice(0, 12));
      } catch (error) {
        console.error('Error fetching tracks:', error);
        // Fallback sample data
        setTracks(getSampleTracks(isKidMode));
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [isKidMode]);

  const isKidFriendly = (trackName, artistName) => {
    const kidKeywords = ['kids', 'children', 'nursery', 'baby', 'toddler', 'cartoon', 'educational'];
    const lowerTrack = trackName.toLowerCase();
    const lowerArtist = (artistName || '').toLowerCase();
    
    return kidKeywords.some(keyword => 
      lowerTrack.includes(keyword) || lowerArtist.includes(keyword)
    );
  };

  const getSampleTracks = (isKid) => {
    if (isKid) {
      return [
        {
          id: '1',
          name: 'Twinkle Twinkle Little Star',
          album: { images: [{ url: 'https://picsum.photos/300' }] },
          artists: [{ name: 'Kids Songs' }],
          preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        // ... more kid tracks
      ];
    }
    return [
      {
        id: 'adult1',
        name: 'Popular Song',
        album: { images: [{ url: 'https://picsum.photos/300' }] },
        artists: [{ name: 'Popular Artist' }],
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      // ... more adult tracks
    ];
  };

  const playTrack = (track) => {
    // Player handles this via context/event
    console.log('Play:', track.name);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {isKidMode ? 'kid-friendly' : ''} songs...</p>
      </div>
    );
  }

  return (
    <div className="home-view">
      <div className="welcome-section">
        <h1>Welcome to {isKidMode ? 'Kids' : ''}Music!</h1>
        <p>{isKidMode ? 'Fun and safe songs for children' : 'Your personal music experience'}</p>
      </div>

      <div className="featured-section">
        <h2>{isKidMode ? 'Kid-Friendly Songs' : 'Featured Tracks'}</h2>
        <div className="tracks-grid">
          {tracks.map(track => (
            <div key={track.id} className="track-card">
              <div className="track-image">
                <img 
                  src={track.album?.images?.[0]?.url || 'https://picsum.photos/200'} 
                  alt={track.name}
                />
                <button 
                  className="play-overlay"
                  onClick={() => playTrack(track)}
                >
                  <FaPlay />
                </button>
              </div>
              <div className="track-info">
                <h4>{track.name}</h4>
                <p>{track.artists?.[0]?.name || 'Unknown Artist'}</p>
                <div className="track-actions">
                  <button className="like-btn">
                    <FaHeart />
                  </button>
                  <button className="add-btn">
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isKidMode && (
        <div className="kid-warning">
          <p>🎵 All content is filtered for child safety</p>
        </div>
      )}
    </div>
  );
};

export default HomeView;