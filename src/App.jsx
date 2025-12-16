// import './App.css'
// import { useState } from 'react'
// import { FaMusic } from "react-icons/fa";
// import music1 from './assets/music1.jpg';
// import music2 from './assets/music2.jpg';

// function App() {

//   const [keyword, setKeyword] = useState("");
//   const [tracks, setTracks] = useState([]);

//   const getTracks = async () => {
//     let data = await fetch(`https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${keyword}&type=track`);
//     let c_data = await data.json();
//     console.log(c_data.tracks.items);
//     setTracks(c_data.tracks.items);
//     document.getElementById("img").style.display="none";
//   }

//   return (

//     <>

//       <nav className="navbar navbar-light bg-light flex justify-content-around">


//         <div className='flex text-xl'>
//           <FaMusic />
//           <h1 className="navbar-brand">KIDS MUSiC</h1>
//         </div>

//         <div className="nav_content">

//           <input
//             value={keyword}
//             onChange={(event) => setKeyword(event.target.value)}
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//           />

//           <button id='btn' onClick={getTracks} className="btn btn-outline-success" >
//             Search
//           </button>

//         </div>

//       </nav>

//       <div className='text-center mt-20' id='info'>

//         <h1 className='fs-1 fw-bold'>SEARCH YOUR FAVOURITE SONG
//           <br />
//           (Espacially For Children !!!)
//         </h1>

//         <div id='img'>
//           <img src={music1} width="30%" height="100px"/>
//           <img src={music2} width="30%" height="100px"/>
//         </div>

//       </div>

//       <div className="container">

//         <div className="row">

//           {tracks.map((element) => {

//             return <div key={element.id} className="col-lg-3 col-md-6 col-sm-8 py-2">

//               <div className="card">

//                 <img src={element.album.images[1].url} className="card-img-top" alt="baby_songs" />

//                 <div className="card-body">

//                   <h5 className="card-title">{element.name}</h5>

//                   <p className="card-text">
//                     Artist:{element.album.artists[0].name}
//                   </p>

//                   <p className="card-text">
//                     Release Date:{element.album.release_date}
//                   </p>

//                   <p className="card-text">
//                     Popularity:{element.popularity}
//                   </p>

//                   <audio src={element.preview_url} controls className='w-100'></audio>

//                 </div>

//               </div>

//             </div>

//           })
//           }

//         </div>

//       </div>

//     </>

//   )

// }

// export default App









import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaMusic, FaSearch, FaPlay, FaPause, FaHeart, FaPlus, FaList, FaSun, FaMoon, FaTimes, FaTrash } from "react-icons/fa";
import { MdLibraryMusic, MdHome, MdHistory, MdEqualizer } from "react-icons/md";
import { RiPlayListFill } from "react-icons/ri";

// Sample data for demonstration
const defaultTracks = [
  {
    id: '1',
    name: 'Twinkle Twinkle Little Star',
    album: { 
      images: [{ url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' }],
      artists: [{ name: 'Kids Songs' }],
      release_date: '2020-01-01'
    },
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    popularity: 85,
    duration_ms: 120000
  },
  {
    id: '2',
    name: 'Baby Shark',
    album: { 
      images: [{ url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400' }],
      artists: [{ name: 'Pinkfong' }],
      release_date: '2019-06-15'
    },
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    popularity: 95,
    duration_ms: 150000
  },
  {
    id: '3',
    name: 'The Wheels on the Bus',
    album: { 
      images: [{ url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w-400' }],
      artists: [{ name: 'Super Simple Songs' }],
      release_date: '2018-03-22'
    },
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    popularity: 80,
    duration_ms: 140000
  },
  {
    id: '4',
    name: 'Old MacDonald',
    album: { 
      images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' }],
      artists: [{ name: 'Kids Learning Tube' }],
      release_date: '2021-05-10'
    },
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    popularity: 75,
    duration_ms: 135000
  }
];

function App() {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState(defaultTracks);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeView, setActiveView] = useState('home');
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  const audioRef = useRef(null);

  // Get tracks from API
  const getTracks = async () => {
    if (!keyword.trim()) return;
    
    try {
      let data = await fetch(`https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${keyword}&type=track`);
      let c_data = await data.json();
      
      if (c_data.tracks && c_data.tracks.items) {
        setTracks(c_data.tracks.items);
        setActiveView('search');
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      // Fallback to sample data if API fails
      setTracks(defaultTracks.filter(track => 
        track.name.toLowerCase().includes(keyword.toLowerCase()) ||
        track.album.artists[0].name.toLowerCase().includes(keyword.toLowerCase())
      ));
    }
  };

  // Play a track
  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Add to recently played
      if (!recentlyPlayed.some(t => t.id === track.id)) {
        setRecentlyPlayed(prev => [track, ...prev.slice(0, 9)]);
      }
    }
  };

  // Add track to playlist
  const addToPlaylist = (playlistId, track) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId && !playlist.tracks.some(t => t.id === track.id)) {
        return { ...playlist, tracks: [...playlist.tracks, track] };
      }
      return playlist;
    }));
  };

  // Create new playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
      created: new Date().toISOString()
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName("");
    setShowPlaylistModal(false);
  };

  // Toggle favorite
  const toggleFavorite = (track) => {
    if (favorites.some(t => t.id === track.id)) {
      setFavorites(prev => prev.filter(t => t.id !== track.id));
    } else {
      setFavorites(prev => [...prev, track]);
    }
  };

  // Format time
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle audio events
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  // Load sample playlists on first render
  useEffect(() => {
    setPlaylists([
      {
        id: '1',
        name: 'Kids Party Mix',
        tracks: [defaultTracks[0], defaultTracks[1]],
        created: '2023-10-01'
      },
      {
        id: '2',
        name: 'Bedtime Stories',
        tracks: [defaultTracks[2]],
        created: '2023-10-05'
      }
    ]);
  }, []);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Audio Player */}
      <audio 
        ref={audioRef} 
        src={currentTrack?.preview_url} 
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Playlist Creation Modal */}
      {showPlaylistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Playlist</h3>
              <button onClick={() => setShowPlaylistModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="playlist-input"
              />
              <div className="modal-actions">
                <button onClick={createPlaylist} className="btn-primary">
                  Create Playlist
                </button>
                <button onClick={() => setShowPlaylistModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <FaMusic />
          <span>KidsMusic</span>
        </div>

        <ul className="nav-links">
          <li 
            className={activeView === 'home' ? 'active' : ''}
            onClick={() => setActiveView('home')}
          >
            <MdHome />
            <span>Home</span>
          </li>
          <li 
            className={activeView === 'search' ? 'active' : ''}
            onClick={() => setActiveView('search')}
          >
            <FaSearch />
            <span>Search</span>
          </li>
          <li 
            className={activeView === 'library' ? 'active' : ''}
            onClick={() => setActiveView('library')}
          >
            <MdLibraryMusic />
            <span>Your Library</span>
          </li>
          <li 
            className={activeView === 'playlists' ? 'active' : ''}
            onClick={() => setActiveView('playlists')}
          >
            <RiPlayListFill />
            <span>Playlists</span>
          </li>
          <li 
            className={activeView === 'history' ? 'active' : ''}
            onClick={() => setActiveView('history')}
          >
            <MdHistory />
            <span>Recently Played</span>
          </li>
          <li 
            className={activeView === 'favorites' ? 'active' : ''}
            onClick={() => setActiveView('favorites')}
          >
            <FaHeart />
            <span>Favorites</span>
          </li>
        </ul>

        <div className="playlists-section">
          <h3>Your Playlists</h3>
          {playlists.map(playlist => (
            <div 
              key={playlist.id} 
              className={`playlist-item ${selectedPlaylist?.id === playlist.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedPlaylist(playlist);
                setActiveView('playlist-detail');
              }}
            >
              <FaList />
              <span>{playlist.name}</span>
            </div>
          ))}
        </div>

        <button 
          className="create-playlist-btn"
          onClick={() => setShowPlaylistModal(true)}
        >
          <FaPlus /> Create Playlist
        </button>

        <div className="theme-toggle-sidebar">
          <button 
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search for songs, artists, or albums"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && getTracks()}
            />
            <button onClick={getTracks} className="search-btn">
              Search
            </button>
          </div>
          
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="user-profile">
              <span>K</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeView === 'home' && (
            <div className="home-view">
              <h1 className="welcome-title">Welcome to KidsMusic!</h1>
              <p className="welcome-subtitle">Discover fun songs for children</p>
              
              <div className="featured-grid">
                <div className="featured-card" onClick={() => setActiveView('search')}>
                  <div className="card-icon">
                    <FaSearch />
                  </div>
                  <h3>Search Songs</h3>
                  <p>Find your favorite children's songs</p>
                </div>
                
                <div className="featured-card" onClick={() => setActiveView('playlists')}>
                  <div className="card-icon">
                    <RiPlayListFill />
                  </div>
                  <h3>Playlists</h3>
                  <p>Create and manage playlists</p>
                </div>
                
                <div className="featured-card" onClick={() => setActiveView('favorites')}>
                  <div className="card-icon">
                    <FaHeart />
                  </div>
                  <h3>Favorites</h3>
                  <p>Your favorite songs collection</p>
                </div>
                
                <div className="featured-card" onClick={() => setActiveView('history')}>
                  <div className="card-icon">
                    <MdHistory />
                  </div>
                  <h3>History</h3>
                  <p>Recently played tracks</p>
                </div>
              </div>
              
              <div className="trending-section">
                <h2>Popular Kids Songs</h2>
                <div className="tracks-grid">
                  {defaultTracks.map(track => (
                    <div key={track.id} className="track-card">
                      <div className="track-image">
                        <img src={track.album.images[0]?.url} alt={track.name} />
                        <button 
                          className="play-overlay"
                          onClick={() => playTrack(track)}
                        >
                          {currentTrack?.id === track.id && isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                      </div>
                      <div className="track-info">
                        <h4>{track.name}</h4>
                        <p>{track.album.artists[0].name}</p>
                        <div className="track-actions">
                          <button 
                            className={`favorite-btn ${favorites.some(t => t.id === track.id) ? 'active' : ''}`}
                            onClick={() => toggleFavorite(track)}
                          >
                            <FaHeart />
                          </button>
                          <button 
                            className="add-to-playlist"
                            onClick={() => {
                              if (playlists.length > 0) {
                                addToPlaylist(playlists[0].id, track);
                              }
                            }}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'search' && (
            <div className="search-view">
              <h2>Search Results</h2>
              <p className="result-count">{tracks.length} tracks found</p>
              
              <div className="tracks-list">
                {tracks.map((track, index) => (
                  <div key={track.id} className="track-row">
                    <div className="track-index">{index + 1}</div>
                    <div className="track-main">
                      <img src={track.album.images[0]?.url} alt={track.name} />
                      <div className="track-details">
                        <h4>{track.name}</h4>
                        <p>{track.album.artists[0].name}</p>
                      </div>
                    </div>
                    <div className="track-album">{track.album.name || 'Single'}</div>
                    <div className="track-duration">{formatTime(track.duration_ms)}</div>
                    <div className="track-actions-row">
                      <button 
                        className={`play-btn ${currentTrack?.id === track.id && isPlaying ? 'playing' : ''}`}
                        onClick={() => playTrack(track)}
                      >
                        {currentTrack?.id === track.id && isPlaying ? <FaPause /> : <FaPlay />}
                      </button>
                      <button 
                        className={`favorite-btn ${favorites.some(t => t.id === track.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(track)}
                      >
                        <FaHeart />
                      </button>
                      <button 
                        className="add-btn"
                        onClick={() => {
                          if (playlists.length > 0) {
                            addToPlaylist(playlists[0].id, track);
                            alert(`Added to ${playlists[0].name}`);
                          }
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'playlists' && (
            <div className="playlists-view">
              <div className="view-header">
                <h2>Your Playlists</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowPlaylistModal(true)}
                >
                  <FaPlus /> New Playlist
                </button>
              </div>
              
              {playlists.length === 0 ? (
                <div className="empty-state">
                  <RiPlayListFill />
                  <h3>No playlists yet</h3>
                  <p>Create your first playlist to organize your favorite songs</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowPlaylistModal(true)}
                  >
                    Create Playlist
                  </button>
                </div>
              ) : (
                <div className="playlists-grid">
                  {playlists.map(playlist => (
                    <div 
                      key={playlist.id} 
                      className="playlist-card"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setActiveView('playlist-detail');
                      }}
                    >
                      <div className="playlist-image">
                        <div className="playlist-icon">
                          <RiPlayListFill />
                        </div>
                        {playlist.tracks.length > 0 && (
                          <img src={playlist.tracks[0].album.images[0]?.url} alt={playlist.name} />
                        )}
                      </div>
                      <h3>{playlist.name}</h3>
                      <p>{playlist.tracks.length} songs</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === 'history' && (
            <div className="history-view">
              <h2>Recently Played</h2>
              
              {recentlyPlayed.length === 0 ? (
                <div className="empty-state">
                  <MdHistory />
                  <h3>No recent plays</h3>
                  <p>Start playing songs to see them here</p>
                </div>
              ) : (
                <div className="tracks-list">
                  {recentlyPlayed.map((track, index) => (
                    <div key={track.id} className="track-row">
                      <div className="track-index">{index + 1}</div>
                      <div className="track-main">
                        <img src={track.album.images[0]?.url} alt={track.name} />
                        <div className="track-details">
                          <h4>{track.name}</h4>
                          <p>{track.album.artists[0].name}</p>
                        </div>
                      </div>
                      <div className="track-actions-row">
                        <button 
                          className="play-btn"
                          onClick={() => playTrack(track)}
                        >
                          <FaPlay />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === 'favorites' && (
            <div className="favorites-view">
              <h2>Your Favorites</h2>
              
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <FaHeart />
                  <h3>No favorites yet</h3>
                  <p>Click the heart icon on any song to add it here</p>
                </div>
              ) : (
                <div className="tracks-grid">
                  {favorites.map(track => (
                    <div key={track.id} className="track-card">
                      <div className="track-image">
                        <img src={track.album.images[0]?.url} alt={track.name} />
                        <button 
                          className="play-overlay"
                          onClick={() => playTrack(track)}
                        >
                          {currentTrack?.id === track.id && isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                      </div>
                      <div className="track-info">
                        <h4>{track.name}</h4>
                        <p>{track.album.artists[0].name}</p>
                        <div className="track-actions">
                          <button 
                            className="favorite-btn active"
                            onClick={() => toggleFavorite(track)}
                          >
                            <FaHeart />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === 'playlist-detail' && selectedPlaylist && (
            <div className="playlist-detail-view">
              <div className="playlist-header">
                <div className="playlist-header-image">
                  {selectedPlaylist.tracks.length > 0 ? (
                    <img src={selectedPlaylist.tracks[0].album.images[0]?.url} alt={selectedPlaylist.name} />
                  ) : (
                    <div className="empty-playlist-image">
                      <RiPlayListFill />
                    </div>
                  )}
                </div>
                <div className="playlist-header-info">
                  <p>PLAYLIST</p>
                  <h1>{selectedPlaylist.name}</h1>
                  <p>Created on {new Date(selectedPlaylist.created).toLocaleDateString()} • {selectedPlaylist.tracks.length} songs</p>
                </div>
              </div>
              
              <div className="playlist-tracks">
                {selectedPlaylist.tracks.length === 0 ? (
                  <div className="empty-state">
                    <p>No songs in this playlist yet</p>
                    <button 
                      className="btn-primary"
                      onClick={() => setActiveView('search')}
                    >
                      Browse Songs
                    </button>
                  </div>
                ) : (
                  <div className="tracks-list">
                    {selectedPlaylist.tracks.map((track, index) => (
                      <div key={track.id} className="track-row">
                        <div className="track-index">{index + 1}</div>
                        <div className="track-main">
                          <img src={track.album.images[0]?.url} alt={track.name} />
                          <div className="track-details">
                            <h4>{track.name}</h4>
                            <p>{track.album.artists[0].name}</p>
                          </div>
                        </div>
                        <div className="track-actions-row">
                          <button 
                            className="play-btn"
                            onClick={() => playTrack(track)}
                          >
                            <FaPlay />
                          </button>
                          <button 
                            className="remove-btn"
                            onClick={() => {
                              setPlaylists(prev => prev.map(playlist => {
                                if (playlist.id === selectedPlaylist.id) {
                                  return {
                                    ...playlist,
                                    tracks: playlist.tracks.filter(t => t.id !== track.id)
                                  };
                                }
                                return playlist;
                              }));
                              setSelectedPlaylist(prev => ({
                                ...prev,
                                tracks: prev.tracks.filter(t => t.id !== track.id)
                              }));
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Now Playing Bar */}
        {currentTrack && (
          <div className="now-playing-bar">
            <div className="now-playing-track">
              <img src={currentTrack.album.images[0]?.url} alt={currentTrack.name} />
              <div className="now-playing-info">
                <h4>{currentTrack.name}</h4>
                <p>{currentTrack.album.artists[0].name}</p>
              </div>
              <button 
                className="favorite-btn-now-playing"
                onClick={() => toggleFavorite(currentTrack)}
              >
                <FaHeart className={favorites.some(t => t.id === currentTrack.id) ? 'active' : ''} />
              </button>
            </div>
            
            <div className="now-playing-controls">
              <button 
                className="play-control"
                onClick={() => playTrack(currentTrack)}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
            
            <div className="now-playing-progress">
              <div className="progress-bar">
                <div className="progress" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;