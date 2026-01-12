// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { 
  FaHome, FaSearch, FaMusic, FaHistory, 
  FaHeart, FaList, FaPlus, FaUser,
  FaCog, FaChild, FaUserTie
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isKidMode }) => {
  const { user } = useAuth();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'Kids Party Mix', count: 12 },
    { id: 2, name: 'Bedtime Stories', count: 8 },
    { id: 3, name: 'Learning Songs', count: 15 },
  ]);

  const navItems = [
    { icon: <FaHome />, label: 'Home', path: isKidMode ? '/kids' : '/main' },
    { icon: <FaSearch />, label: 'Search', path: '/search' },
    { icon: <FaMusic />, label: 'Library', path: '/library' },
    { icon: <FaHistory />, label: 'History', path: '/history' },
    { icon: <FaHeart />, label: 'Favorites', path: '/favorites' },
    { icon: <FaList />, label: 'Playlists', path: '/playlists' },
  ];

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now(),
        name: newPlaylistName,
        count: 0
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  const handleDeletePlaylist = (id) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(playlists.filter(playlist => playlist.id !== id));
    }
  };

  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="user-profile-section">
        <div className="user-avatar">
          {user?.profileInitial || 'U'}
        </div>
        <div className="user-info">
          <h3>{user?.username || 'User'}</h3>
          <p className="user-badge">
            {isKidMode ? (
              <><FaChild /> Kids Mode</>
            ) : (
              <><FaUserTie /> Full Access</>
            )}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Playlists Section */}
      <div className="playlists-section">
        <div className="section-header">
          <h3>Your Playlists</h3>
          <button 
            className="add-playlist-btn"
            onClick={() => setShowCreatePlaylist(true)}
          >
            <FaPlus />
          </button>
        </div>

        {showCreatePlaylist && (
          <div className="create-playlist-input">
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            />
            <div className="playlist-actions">
              <button onClick={handleCreatePlaylist}>Create</button>
              <button onClick={() => setShowCreatePlaylist(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="playlists-list">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-item">
              <NavLink 
                to={`/playlist/${playlist.id}`}
                className={({ isActive }) => 
                  `playlist-link ${isActive ? 'active' : ''}`
                }
              >
                <FaList />
                <span className="playlist-name">{playlist.name}</span>
                <span className="playlist-count">{playlist.count}</span>
              </NavLink>
              <button 
                className="delete-playlist-btn"
                onClick={() => handleDeletePlaylist(playlist.id)}
                title="Delete playlist"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="sidebar-footer">
        <NavLink to="/settings" className="settings-link">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;