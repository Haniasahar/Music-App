// // src/components/music/PlaylistManager.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   FaTrash, FaEdit, FaMusic, FaPlus, 
//   FaList, FaPlay, FaTimes, FaCheck,
//   FaExternalLinkAlt
// } from 'react-icons/fa';
// import { useAuth } from '../../../contexts/authContext';
// import './PlaylistManager.css';

// const PlaylistManager = () => {
//   const { user } = useAuth();
//   const [playlists, setPlaylists] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState('');
//   const [editingPlaylist, setEditingPlaylist] = useState(null);
//   const [editName, setEditName] = useState('');
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

//   // Load playlists from localStorage
//   useEffect(() => {
//     const loadPlaylists = () => {
//       const storedPlaylists = localStorage.getItem(`playlists_${user?.username}`);
//       if (storedPlaylists) {
//         setPlaylists(JSON.parse(storedPlaylists));
//       } else {
//         // Default playlists for new users
//         const defaultPlaylists = [
//           {
//             id: 1,
//             name: 'Favorite Kids Songs',
//             description: 'My favorite children songs',
//             tracks: [],
//             created: new Date().toISOString(),
//             isDefault: true
//           },
//           {
//             id: 2,
//             name: 'Bedtime Collection',
//             description: 'Calm songs for bedtime',
//             tracks: [],
//             created: new Date().toISOString(),
//             isDefault: true
//           }
//         ];
//         setPlaylists(defaultPlaylists);
//         localStorage.setItem(`playlists_${user?.username}`, JSON.stringify(defaultPlaylists));
//       }
//     };

//     loadPlaylists();
//   }, [user]);

//   // Save playlists to localStorage whenever they change
//   useEffect(() => {
//     if (user?.username) {
//       localStorage.setItem(`playlists_${user.username}`, JSON.stringify(playlists));
//     }
//   }, [playlists, user]);

//   const createPlaylist = () => {
//     if (!newPlaylistName.trim()) return;

//     const newPlaylist = {
//       id: Date.now(),
//       name: newPlaylistName,
//       description: '',
//       tracks: [],
//       created: new Date().toISOString(),
//       isDefault: false
//     };

//     setPlaylists([...playlists, newPlaylist]);
//     setNewPlaylistName('');
//     setShowCreateModal(false);
//   };

//   const deletePlaylist = (id) => {
//     const playlist = playlists.find(p => p.id === id);
//     if (playlist?.isDefault) {
//       alert('Default playlists cannot be deleted. You can remove all songs instead.');
//       return;
//     }

//     setPlaylists(playlists.filter(p => p.id !== id));
//     setShowDeleteConfirm(null);
    
//     // If deleting the selected playlist, clear selection
//     if (selectedPlaylist?.id === id) {
//       setSelectedPlaylist(null);
//     }
//   };

//   const updatePlaylist = (id, updates) => {
//     setPlaylists(playlists.map(playlist => 
//       playlist.id === id ? { ...playlist, ...updates } : playlist
//     ));
//   };

//   const addTrackToPlaylist = (playlistId, track) => {
//     updatePlaylist(playlistId, {
//       tracks: [...playlists.find(p => p.id === playlistId).tracks, track]
//     });
//   };

//   const removeTrackFromPlaylist = (playlistId, trackId) => {
//     const playlist = playlists.find(p => p.id === playlistId);
//     if (playlist) {
//       updatePlaylist(playlistId, {
//         tracks: playlist.tracks.filter(t => t.id !== trackId)
//       });
//     }
//   };

//   const startEditing = (playlist) => {
//     setEditingPlaylist(playlist.id);
//     setEditName(playlist.name);
//   };

//   const saveEdit = (id) => {
//     if (editName.trim()) {
//       updatePlaylist(id, { name: editName });
//       setEditingPlaylist(null);
//       setEditName('');
//     }
//   };

//   const PlaylistCard = ({ playlist }) => (
//     <div className={`playlist-card ${selectedPlaylist?.id === playlist.id ? 'selected' : ''}`}>
//       <div 
//         className="playlist-card-content"
//         onClick={() => setSelectedPlaylist(playlist)}
//       >
//         <div className="playlist-cover">
//           {playlist.tracks.length > 0 ? (
//             <img 
//               src={playlist.tracks[0].album?.images?.[0]?.url || 'https://picsum.photos/150'} 
//               alt={playlist.name}
//             />
//           ) : (
//             <div className="empty-cover">
//               <FaMusic />
//             </div>
//           )}
//           <div className="track-count">
//             <FaMusic /> {playlist.tracks.length}
//           </div>
//         </div>
        
//         <div className="playlist-info">
//           {editingPlaylist === playlist.id ? (
//             <input
//               type="text"
//               value={editName}
//               onChange={(e) => setEditName(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && saveEdit(playlist.id)}
//               className="edit-input"
//               autoFocus
//             />
//           ) : (
//             <h3>{playlist.name}</h3>
//           )}
//           <p className="playlist-desc">{playlist.description || 'No description'}</p>
//           <div className="playlist-meta">
//             <span className="created-date">
//               Created: {new Date(playlist.created).toLocaleDateString()}
//             </span>
//             {playlist.isDefault && (
//               <span className="default-badge">Default</span>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="playlist-actions">
//         {editingPlaylist === playlist.id ? (
//           <>
//             <button 
//               className="action-btn save-btn"
//               onClick={() => saveEdit(playlist.id)}
//             >
//               <FaCheck />
//             </button>
//             <button 
//               className="action-btn cancel-btn"
//               onClick={() => setEditingPlaylist(null)}
//             >
//               <FaTimes />
//             </button>
//           </>
//         ) : (
//           <>
//             <button 
//               className="action-btn edit-btn"
//               onClick={() => startEditing(playlist)}
//               title="Edit name"
//             >
//               <FaEdit />
//             </button>
//             <button 
//               className="action-btn delete-btn"
//               onClick={() => setShowDeleteConfirm(playlist.id)}
//               title={playlist.isDefault ? "Default playlist" : "Delete playlist"}
//               disabled={playlist.isDefault}
//             >
//               <FaTrash />
//             </button>
//           </>
//         )}
//       </div>

//       {showDeleteConfirm === playlist.id && (
//         <div className="delete-confirm-overlay">
//           <div className="delete-confirm-modal">
//             <p>Delete "{playlist.name}"?</p>
//             <div className="confirm-actions">
//               <button 
//                 className="confirm-btn delete-confirm"
//                 onClick={() => deletePlaylist(playlist.id)}
//               >
//                 Delete
//               </button>
//               <button 
//                 className="confirm-btn delete-cancel"
//                 onClick={() => setShowDeleteConfirm(null)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const PlaylistDetail = () => {
//     if (!selectedPlaylist) return null;

//     return (
//       <div className="playlist-detail">
//         <div className="detail-header">
//           <button 
//             className="back-btn"
//             onClick={() => setSelectedPlaylist(null)}
//           >
//             ← Back to Playlists
//           </button>
//           <h2>{selectedPlaylist.name}</h2>
//           <p>{selectedPlaylist.description || 'No description'}</p>
//         </div>

//         <div className="tracks-section">
//           <div className="section-header">
//             <h3>
//               <FaMusic /> Tracks ({selectedPlaylist.tracks.length})
//             </h3>
//             <button 
//               className="add-track-btn"
//               onClick={() => alert('Feature: Add tracks from search')}
//             >
//               <FaPlus /> Add Tracks
//             </button>
//           </div>

//           {selectedPlaylist.tracks.length === 0 ? (
//             <div className="empty-tracks">
//               <FaMusic className="empty-icon" />
//               <p>No tracks in this playlist yet</p>
//               <button 
//                 className="browse-btn"
//                 onClick={() => {
//                   // Navigate to search or library
//                   alert('Redirect to search page to add tracks');
//                 }}
//               >
//                 <FaExternalLinkAlt /> Browse Songs
//               </button>
//             </div>
//           ) : (
//             <div className="tracks-list">
//               {selectedPlaylist.tracks.map((track, index) => (
//                 <div key={track.id} className="track-item">
//                   <div className="track-index">{index + 1}</div>
//                   <div className="track-image">
//                     <img 
//                       src={track.album?.images?.[0]?.url || 'https://picsum.photos/40'} 
//                       alt={track.name}
//                     />
//                   </div>
//                   <div className="track-info">
//                     <h4>{track.name}</h4>
//                     <p>{track.artists?.[0]?.name || 'Unknown Artist'}</p>
//                   </div>
//                   <div className="track-duration">
//                     {Math.floor((track.duration_ms || 0) / 60000)}:
//                     {String(Math.floor((track.duration_ms || 0) % 60000 / 1000)).padStart(2, '0')}
//                   </div>
//                   <div className="track-actions">
//                     <button 
//                       className="play-track-btn"
//                       onClick={() => alert(`Play: ${track.name}`)}
//                     >
//                       <FaPlay />
//                     </button>
//                     <button 
//                       className="remove-track-btn"
//                       onClick={() => removeTrackFromPlaylist(selectedPlaylist.id, track.id)}
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="playlist-actions-footer">
//           <button 
//             className="export-btn"
//             onClick={() => {
//               const dataStr = JSON.stringify(selectedPlaylist, null, 2);
//               const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//               const linkElement = document.createElement('a');
//               linkElement.setAttribute('href', dataUri);
//               linkElement.setAttribute('download', `${selectedPlaylist.name}.json`);
//               linkElement.click();
//             }}
//           >
//             Export Playlist (JSON)
//           </button>
//           <button 
//             className="share-btn"
//             onClick={() => {
//               const shareText = `Check out my playlist "${selectedPlaylist.name}" on KidsMusic!`;
//               if (navigator.share) {
//                 navigator.share({
//                   title: selectedPlaylist.name,
//                   text: shareText,
//                 });
//               } else {
//                 navigator.clipboard.writeText(shareText);
//                 alert('Playlist link copied to clipboard!');
//               }
//             }}
//           >
//             Share Playlist
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="playlist-manager">
//       {selectedPlaylist ? (
//         <PlaylistDetail />
//       ) : (
//         <>
//           <div className="manager-header">
//             <div className="header-title">
//               <FaList className="header-icon" />
//               <h2>Your Playlists</h2>
//               <span className="playlist-count">({playlists.length})</span>
//             </div>
//             <button 
//               className="create-playlist-btn"
//               onClick={() => setShowCreateModal(true)}
//             >
//               <FaPlus /> New Playlist
//             </button>
//           </div>

//           <div className="playlists-grid">
//             {playlists.map(playlist => (
//               <PlaylistCard key={playlist.id} playlist={playlist} />
//             ))}
//           </div>

//           {playlists.length === 0 && (
//             <div className="empty-playlists">
//               <FaList className="empty-icon" />
//               <h3>No playlists yet</h3>
//               <p>Create your first playlist to organize your favorite songs</p>
//               <button 
//                 className="create-first-btn"
//                 onClick={() => setShowCreateModal(true)}
//               >
//                 <FaPlus /> Create First Playlist
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {showCreateModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Create New Playlist</h3>
//               <button 
//                 className="close-modal"
//                 onClick={() => setShowCreateModal(false)}
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="modal-body">
//               <input
//                 type="text"
//                 placeholder="Playlist name"
//                 value={newPlaylistName}
//                 onChange={(e) => setNewPlaylistName(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
//                 className="playlist-name-input"
//                 autoFocus
//               />
//               <textarea
//                 placeholder="Description (optional)"
//                 className="playlist-desc-input"
//                 rows="3"
//               />
//             </div>
//             <div className="modal-actions">
//               <button 
//                 className="modal-btn primary"
//                 onClick={createPlaylist}
//                 disabled={!newPlaylistName.trim()}
//               >
//                 Create Playlist
//               </button>
//               <button 
//                 className="modal-btn secondary"
//                 onClick={() => setShowCreateModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlaylistManager;













// src/components/Playlists/PlaylistManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaTrash, FaEdit, FaMusic, FaPlus, FaList, FaPlay, 
  FaTimes, FaCheck, FaExternalLinkAlt, FaHeart, FaClock,
  FaSearch, FaFilter, FaSort
} from 'react-icons/fa';
import './playlistManager.css';
import { useAuth } from '../../../contexts/authContext';

const PlaylistManager = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [editName, setEditName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Load playlists from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`playlists_${user?.username}`);
    if (stored) {
      setPlaylists(JSON.parse(stored));
    } else {
      const defaults = [
        {
          id: 1,
          name: 'My Favorites',
          description: 'Songs I love the most',
          tracks: [],
          created: new Date().toISOString(),
          color: '#FF6B6B',
          icon: 'heart'
        },
        {
          id: 2,
          name: 'Kids Collection',
          description: 'Child-friendly songs',
          tracks: [],
          created: new Date().toISOString(),
          color: '#4ECDC4',
          icon: 'music'
        }
      ];
      setPlaylists(defaults);
      localStorage.setItem(`playlists_${user?.username}`, JSON.stringify(defaults));
    }
  }, [user]);

  // Save playlists
  useEffect(() => {
    if (user?.username) {
      localStorage.setItem(`playlists_${user.username}`, JSON.stringify(playlists));
    }
  }, [playlists, user]);

  // CRUD Operations
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const colors = ['#667eea', '#764ba2', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];
    const newPlaylist = {
      id: Date.now(),
      name: newPlaylistName,
      description: '',
      tracks: [],
      created: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: 'list'
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setShowCreateModal(false);
  };

  const deletePlaylist = (id) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist?.id <= 2) { // Default playlists
      alert('Default playlists cannot be deleted.');
      return;
    }

    setPlaylists(playlists.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
    if (selectedPlaylist?.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const updatePlaylist = (id, updates) => {
    setPlaylists(playlists.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const addTrackToPlaylist = (playlistId, track) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.tracks.some(t => t.id === track.id)) {
      updatePlaylist(playlistId, {
        tracks: [...playlist.tracks, track]
      });
    }
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      updatePlaylist(playlistId, {
        tracks: playlist.tracks.filter(t => t.id !== trackId)
      });
    }
  };

  const startEditing = (playlist) => {
    setEditingPlaylist(playlist.id);
    setEditName(playlist.name);
  };

  const saveEdit = (id) => {
    if (editName.trim()) {
      updatePlaylist(id, { name: editName });
      setEditingPlaylist(null);
      setEditName('');
    }
  };

  // Filter and sort playlists
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'tracks':
        return b.tracks.length - a.tracks.length;
      case 'date':
      default:
        return new Date(b.created) - new Date(a.created);
    }
  });

  // Render Playlist Card
  const PlaylistCard = ({ playlist }) => (
    <div className={`playlist-card ${selectedPlaylist?.id === playlist.id ? 'selected' : ''}`}>
      <div className="card-header" style={{ background: playlist.color }}>
        <div className="card-icon">
          {playlist.icon === 'heart' ? <FaHeart /> : <FaMusic />}
        </div>
        <div className="card-tracks">{playlist.tracks.length} tracks</div>
      </div>
      
      <div className="card-body" onClick={() => setSelectedPlaylist(playlist)}>
        {editingPlaylist === playlist.id ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveEdit(playlist.id)}
            className="edit-input"
            autoFocus
          />
        ) : (
          <h3>{playlist.name}</h3>
        )}
        <p className="card-description">{playlist.description || 'No description'}</p>
        <div className="card-meta">
          <span className="card-date">
            <FaClock /> {new Date(playlist.created).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="card-actions">
        {editingPlaylist === playlist.id ? (
          <>
            <button className="action-btn save" onClick={() => saveEdit(playlist.id)}>
              <FaCheck />
            </button>
            <button className="action-btn cancel" onClick={() => setEditingPlaylist(null)}>
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button className="action-btn edit" onClick={() => startEditing(playlist)}>
              <FaEdit />
            </button>
            <button 
              className="action-btn delete" 
              onClick={() => playlist.id > 2 ? setShowDeleteConfirm(playlist.id) : null}
              title={playlist.id <= 2 ? "Default playlist" : "Delete"}
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Render Playlist Detail View
  const PlaylistDetailView = () => {
    if (!selectedPlaylist) return null;

    return (
      <div className="playlist-detail">
        <div className="detail-header" style={{ background: selectedPlaylist.color }}>
          <button className="back-btn" onClick={() => setSelectedPlaylist(null)}>
            ← All Playlists
          </button>
          <div className="detail-title">
            <h1>{selectedPlaylist.name}</h1>
            <p>{selectedPlaylist.description || 'No description'}</p>
          </div>
          <div className="detail-stats">
            <div className="stat">
              <span className="stat-number">{selectedPlaylist.tracks.length}</span>
              <span className="stat-label">Tracks</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {new Set(selectedPlaylist.tracks.map(t => t.artists?.[0]?.name)).size}
              </span>
              <span className="stat-label">Artists</span>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <div className="content-actions">
            <button className="action-btn play-all">
              <FaPlay /> Play All
            </button>
            <button className="action-btn add-tracks">
              <FaPlus /> Add Tracks
            </button>
            <button className="action-btn export">
              Export
            </button>
          </div>

          {selectedPlaylist.tracks.length === 0 ? (
            <div className="empty-tracks">
              <FaMusic className="empty-icon" />
              <h3>No tracks yet</h3>
              <p>Add songs to this playlist to get started</p>
              <button className="browse-btn">
                <FaSearch /> Browse Songs
              </button>
            </div>
          ) : (
            <div className="tracks-table">
              <div className="table-header">
                <div className="header-col">#</div>
                <div className="header-col">Title</div>
                <div className="header-col">Artist</div>
                <div className="header-col">Duration</div>
                <div className="header-col">Actions</div>
              </div>
              
              {selectedPlaylist.tracks.map((track, index) => (
                <div key={track.id} className="table-row">
                  <div className="row-col index">{index + 1}</div>
                  <div className="row-col title">
                    <img src={track.album?.images?.[0]?.url || 'https://picsum.photos/40'} alt="" />
                    <span>{track.name}</span>
                  </div>
                  <div className="row-col artist">{track.artists?.[0]?.name}</div>
                  <div className="row-col duration">
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </div>
                  <div className="row-col actions">
                    <button className="row-btn play" onClick={() => {/* Play track */}}>
                      <FaPlay />
                    </button>
                    <button 
                      className="row-btn remove"
                      onClick={() => removeTrackFromPlaylist(selectedPlaylist.id, track.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="playlist-manager">
      {selectedPlaylist ? (
        <PlaylistDetailView />
      ) : (
        <>
          {/* Header with Search & Sort */}
          <div className="manager-header">
            <div className="header-left">
              <FaList className="header-icon" />
              <h2>My Playlists</h2>
              <span className="count-badge">{playlists.length}</span>
            </div>
            
            <div className="header-right">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search playlists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="sort-dropdown">
                <FaSort />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="date">Recently Added</option>
                  <option value="name">Name A-Z</option>
                  <option value="tracks">Most Tracks</option>
                </select>
              </div>
              
              <button 
                className="create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> New Playlist
              </button>
            </div>
          </div>

          {/* Playlists Grid */}
          <div className="playlists-grid">
            {filteredPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>

          {filteredPlaylists.length === 0 && (
            <div className="empty-state">
              <FaMusic className="empty-icon" />
              <h3>No playlists found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Create your first playlist!'}</p>
              <button 
                className="create-first-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> Create Playlist
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Playlist</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g., Summer Vibes"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  placeholder="What's this playlist about?"
                  rows="3"
                />
              </div>
              
              <div className="color-picker">
                <label>Choose a color:</label>
                <div className="color-options">
                  {['#667eea', '#764ba2', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'].map(color => (
                    <button
                      key={color}
                      className="color-option"
                      style={{ background: color }}
                      onClick={() => {/* Set color */}}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-primary"
                onClick={createPlaylist}
                disabled={!newPlaylistName.trim()}
              >
                Create Playlist
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <FaTrash className="confirm-icon" />
            <h3>Delete Playlist?</h3>
            <p>This action cannot be undone. All tracks will be removed.</p>
            <div className="confirm-actions">
              <button 
                className="confirm-btn delete"
                onClick={() => deletePlaylist(showDeleteConfirm)}
              >
                Delete
              </button>
              <button 
                className="confirm-btn cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistManager;