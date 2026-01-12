// import React, { useState, useEffect, useRef } from "react";
// import "./App.css";
// import {
//   FaMusic,
//   FaSearch,
//   FaPlay,
//   FaPause,
//   FaHeart,
//   FaPlus,
//   FaList,
//   FaSun,
//   FaMoon,
//   FaTimes,
//   FaTrash,
// } from "react-icons/fa";
// import { MdLibraryMusic, MdHome, MdHistory, MdEqualizer } from "react-icons/md";
// import { RiPlayListFill } from "react-icons/ri";

// // Sample data for demonstration
// const defaultTracks = [
//   {
//     id: "1",
//     name: "Twinkle Twinkle Little Star",
//     album: {
//       images: [
//         {
//           url: "https://images.unsplash.com/photo-1515705576963-95cad62945b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         },
//       ],
//       artists: [{ name: "Kids Songs" }],
//       release_date: "2020-01-01",
//     },
//     preview_url: null,
//     popularity: 85,
//     duration_ms: 120000,
//   },
//   {
//     id: "2",
//     name: "The Wheels on the Bus",
//     album: {
//       images: [
//         {
//           url: "https://media.istockphoto.com/id/157427231/photo/london-bus-isolated-with-clipping-path.webp?a=1&b=1&s=612x612&w=0&k=20&c=BT43hnz5By4n1xnn8wkvFwijbZmrrilj4ZEmn8rz6pQ=",
//         },
//       ],
//       artists: [{ name: "Super Simple Songs" }],
//       release_date: "2018-03-22",
//     },
//     preview_url: null,
//     popularity: 80,
//     duration_ms: 140000,
//   },
//   {
//     id: "3",
//     name: "Baby Shark",
//     album: {
//       images: [
//         {
//           url: "https://plus.unsplash.com/premium_photo-1724311823993-39bd35528065?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFieSUyMHNoYXJrfGVufDB8fDB8fHww",
//         },
//       ],
//       artists: [{ name: "Pinkfong" }],
//       release_date: "2019-06-15",
//     },
//     preview_url: null,
//     popularity: 95,
//     duration_ms: 150000,
//   },
//   {
//     id: "4",
//     name: "Old MacDonald",
//     album: {
//       images: [
//         {
//           url: "https://plus.unsplash.com/premium_photo-1663088800901-c57258d8707a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2xkJTIwbWFjZG9uYWxkJTIwaGFkJTIwYSUyMGZhcm18ZW58MHx8MHx8fDA%3D",
//         },
//       ],
//       artists: [{ name: "Kids Learning Tube" }],
//       release_date: "2021-05-10",
//     },
//     preview_url:null,
//     popularity: 75,
//     duration_ms: 135000,
//   },
// ];

// function App() {
//   const [keyword, setKeyword] = useState("");
//   const [tracks, setTracks] = useState(defaultTracks);
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [darkMode, setDarkMode] = useState(true);
//   const [activeView, setActiveView] = useState("home");
//   const [playlists, setPlaylists] = useState([]);
//   const [newPlaylistName, setNewPlaylistName] = useState("");
//   const [showPlaylistModal, setShowPlaylistModal] = useState(false);
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [recentlyPlayed, setRecentlyPlayed] = useState([]);
//   const [favorites, setFavorites] = useState([]);

//   const audioRef = useRef(null);

//   // Get tracks from API
//   const getTracks = async () => {
//     if (!keyword.trim()) return;

//     try {
//       let data = await fetch(
//         `https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${keyword}&type=track`
//       );
//       let c_data = await data.json();
//       console.log(c_data.tracks);

//       if (c_data.tracks && c_data.tracks.items) {
//         setTracks(c_data.tracks.items);
//         setActiveView("search");
//       }
//     } catch (error) {
//       console.error("Error fetching tracks:", error);
//       // Fallback to sample data if API fails
//       setTracks(
//         defaultTracks.filter(
//           (track) =>
//             track.name.toLowerCase().includes(keyword.toLowerCase()) ||
//             track.album.artists[0].name
//               .toLowerCase()
//               .includes(keyword.toLowerCase())
//         )
//       );
//     }
//   };

//   // Play a track
//   const playTrack = (track) => {
//     if (currentTrack?.id === track.id) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     } else {
//       setCurrentTrack(track);
//       setIsPlaying(true);

//       // Add to recently played
//       if (!recentlyPlayed.some((t) => t.id === track.id)) {
//         setRecentlyPlayed((prev) => [track, ...prev.slice(0, 9)]);
//       }
//     }
//   };

//   // Add track to playlist
//   const addToPlaylist = (playlistId, track) => {
//     setPlaylists((prev) =>
//       prev.map((playlist) => {
//         if (
//           playlist.id === playlistId &&
//           !playlist.tracks.some((t) => t.id === track.id)
//         ) {
//           return { ...playlist, tracks: [...playlist.tracks, track] };
//         }
//         return playlist;
//       })
//     );
//   };

//   // Create new playlist
//   const createPlaylist = () => {
//     if (!newPlaylistName.trim()) return;

//     const newPlaylist = {
//       id: Date.now().toString(),
//       name: newPlaylistName,
//       tracks: [],
//       created: new Date().toISOString(),
//     };

//     setPlaylists((prev) => [...prev, newPlaylist]);
//     setNewPlaylistName("");
//     setShowPlaylistModal(false);
//   };

//   // Toggle favorite
//   const toggleFavorite = (track) => {
//     if (favorites.some((t) => t.id === track.id)) {
//       setFavorites((prev) => prev.filter((t) => t.id !== track.id));
//     } else {
//       setFavorites((prev) => [...prev, track]);
//     }
//   };

//   // Format time
//   const formatTime = (ms) => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = ((ms % 60000) / 1000).toFixed(0);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   // Handle audio events
//   useEffect(() => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.play();
//       } else {
//         audioRef.current.pause();
//       }
//     }
//   }, [currentTrack, isPlaying]);

//   // Load sample playlists on first render
//   useEffect(() => {
//     setPlaylists([
//       {
//         id: "1",
//         name: "Kids Party Mix",
//         tracks: [defaultTracks[0], defaultTracks[1]],
//         created: "2023-10-01",
//       },
//       {
//         id: "2",
//         name: "Bedtime Stories",
//         tracks: [defaultTracks[2]],
//         created: "2023-10-05",
//       },
//     ]);
//   }, []);

//   // Function to load the hardcoded default songs from Spotify
//   const loadDefaultTracks = async () => {
//     // Define the exact songs you want to search for
//     const defaultTrackQueries = [
//       "Twinkle Twinkle Little Star",
//       "The Wheels on the Bus",
//       "Baby Shark",
//       "Old MacDonald Had A Farm",
//     ];

//     let fetchedTracks = [];

//     // Loop through each song name and search for it
//     for (const query of defaultTrackQueries) {
//       try {
//         // Use the same API endpoint as your search function
//         let data = await fetch(
//           `https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${query}&type=track`
//         );
//         let c_data = await data.json();

//         // Check if the search returned results
//         if (c_data.tracks && c_data.tracks.items.length > 0) {
//           // Take the first (most relevant) result and add it to the list
//           fetchedTracks.push(c_data.tracks.items[0]);
//         }
//       } catch (error) {
//         console.error(`Error fetching track for query "${query}":`, error);
//       }
//     }

//     // If we successfully fetched tracks, update the state
//     if (fetchedTracks.length > 0) {
//       setTracks(fetchedTracks);
//     } else {
//       // Fallback to the original hardcoded data if the API fails
//       console.warn(
//         "Could not fetch default tracks from Spotify. Using fallback data."
//       );
//       setTracks(defaultTracks);
//     }
//   };

//   useEffect(() => {
//     // Load the real default tracks when the app starts
//     loadDefaultTracks();
//   }, []); // The empty array [] means this runs only once

//   return (
//     <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
//       {/* Audio Player */}
//       <audio
//         ref={audioRef}
//         src={currentTrack?.preview_url}
//         onEnded={() => setIsPlaying(false)}
//       />

//       {/* Playlist Creation Modal */}
//       {showPlaylistModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h3>Create New Playlist</h3>
//               <button onClick={() => setShowPlaylistModal(false)}>
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="modal-body">
//               <input
//                 type="text"
//                 placeholder="Playlist name"
//                 value={newPlaylistName}
//                 onChange={(e) => setNewPlaylistName(e.target.value)}
//                 className="playlist-input"
//               />
//               <div className="modal-actions">
//                 <button onClick={createPlaylist} className="btn-primary">
//                   Create Playlist
//                 </button>
//                 <button
//                   onClick={() => setShowPlaylistModal(false)}
//                   className="btn-secondary"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="logo">
//           <FaMusic />
//           <span>KidsMusic</span>
//         </div>

//         <ul className="nav-links">
//           <li
//             className={activeView === "home" ? "active" : ""}
//             onClick={() => setActiveView("home")}
//           >
//             <MdHome />
//             <span>Home</span>
//           </li>
//           <li
//             className={activeView === "search" ? "active" : ""}
//             onClick={() => setActiveView("search")}
//           >
//             <FaSearch />
//             <span>Search</span>
//           </li>
//           <li
//             className={activeView === "library" ? "active" : ""}
//             onClick={() => setActiveView("library")}
//           >
//             <MdLibraryMusic />
//             <span>Your Library</span>
//           </li>
//           <li
//             className={activeView === "playlists" ? "active" : ""}
//             onClick={() => setActiveView("playlists")}
//           >
//             <RiPlayListFill />
//             <span>Playlists</span>
//           </li>
//           <li
//             className={activeView === "history" ? "active" : ""}
//             onClick={() => setActiveView("history")}
//           >
//             <MdHistory />
//             <span>Recently Played</span>
//           </li>
//           <li
//             className={activeView === "favorites" ? "active" : ""}
//             onClick={() => setActiveView("favorites")}
//           >
//             <FaHeart />
//             <span>Favorites</span>
//           </li>
//         </ul>

//         <div className="playlists-section">
//           <h3>Your Playlists</h3>
//           {playlists.map((playlist) => (
//             <div
//               key={playlist.id}
//               className={`playlist-item ${
//                 selectedPlaylist?.id === playlist.id ? "active" : ""
//               }`}
//               onClick={() => {
//                 setSelectedPlaylist(playlist);
//                 setActiveView("playlist-detail");
//               }}
//             >
//               <FaList />
//               <span>{playlist.name}</span>
//             </div>
//           ))}
//         </div>

//         <button
//           className="create-playlist-btn"
//           onClick={() => setShowPlaylistModal(true)}
//         >
//           <FaPlus /> Create Playlist
//         </button>

//         <div className="theme-toggle-sidebar">
//           <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
//             {darkMode ? <FaSun /> : <FaMoon />}
//             <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Header */}
//         <header className="main-header">
//           <div className="search-bar">
//             <FaSearch />
//             <input
//               type="text"
//               placeholder="Search for songs, artists, or albums"
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && getTracks()}
//             />
//             <button onClick={getTracks} className="search-btn">
//               Search
//             </button>
//           </div>

//           {/* <div className="header-actions"> */}
//           <div className="user-profile">
//             <span>U</span>
//           </div>
//           {/* </div> */}
//         </header>

//         {/* Content Area */}
//         <div className="content-area">
//           {activeView === "home" && (
//             <div className="home-view">
//               <h1 className="welcome-title">Welcome to KidsMusic!</h1>
//               <p className="welcome-subtitle">
//                 Discover fun songs for children
//               </p>

//               <div className="featured-grid">
//                 <div
//                   className="featured-card"
//                   onClick={() => setActiveView("search")}
//                 >
//                   <div className="card-icon">
//                     <FaSearch />
//                   </div>
//                   <h3>Search Songs</h3>
//                   <p>Find your favorite children's songs</p>
//                 </div>

//                 <div
//                   className="featured-card"
//                   onClick={() => setActiveView("playlists")}
//                 >
//                   <div className="card-icon">
//                     <RiPlayListFill />
//                   </div>
//                   <h3>Playlists</h3>
//                   <p>Create and manage playlists</p>
//                 </div>

//                 <div
//                   className="featured-card"
//                   onClick={() => setActiveView("favorites")}
//                 >
//                   <div className="card-icon">
//                     <FaHeart />
//                   </div>
//                   <h3>Favorites</h3>
//                   <p>Your favorite songs collection</p>
//                 </div>

//                 <div
//                   className="featured-card"
//                   onClick={() => setActiveView("history")}
//                 >
//                   <div className="card-icon">
//                     <MdHistory />
//                   </div>
//                   <h3>History</h3>
//                   <p>Recently played tracks</p>
//                 </div>
//               </div>

//               <div className="trending-section">
//                 <h2>Popular Kids Songs</h2>
//                 <div className="tracks-grid">
//                   {defaultTracks.map((track) => (
//                     <div key={track.id} className="track-card">
//                       <div className="track-image">
//                         <img
//                           src={track.album.images[0]?.url}
//                           alt={track.name}
//                         />
//                         <button
//                           className="play-overlay"
//                           onClick={() => playTrack(track)}
//                         >
//                           {currentTrack?.id === track.id && isPlaying ? (
//                             <FaPause />
//                           ) : (
//                             <FaPlay />
//                           )}
//                         </button>
//                       </div>
//                       <div className="track-info">
//                         <h4>{track.name}</h4>
//                         <p>{track.album.artists[0].name}</p>
//                         <div className="track-actions">
//                           <button
//                             className={`favorite-btn ${
//                               favorites.some((t) => t.id === track.id)
//                                 ? "active"
//                                 : ""
//                             }`}
//                             onClick={() => toggleFavorite(track)}
//                           >
//                             <FaHeart />
//                           </button>
//                           <button
//                             className="add-to-playlist"
//                             onClick={() => {
//                               if (playlists.length > 0) {
//                                 addToPlaylist(playlists[0].id, track);
//                               }
//                             }}
//                           >
//                             <FaPlus />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeView === "search" && (
//             <div className="search-view">
//               <h2>Search Results</h2>
//               <p className="result-count">{tracks.length} tracks found</p>

//               <div className="tracks-list">
//                 {tracks.map((track, index) => (
//                   <div key={track.id} className="track-row">
//                     <div className="track-index">{index + 1}</div>
//                     <div className="track-main">
//                       <img src={track.album.images[0]?.url} alt={track.name} />
//                       <div className="track-details">
//                         <h4>{track.name}</h4>
//                         <p>{track.album.artists[0].name}</p>
//                       </div>
//                     </div>
//                     <div className="track-album">
//                       {track.album.name || "Single"}
//                     </div>
//                     <div className="track-duration">
//                       {formatTime(track.duration_ms)}
//                     </div>
//                     <div className="track-actions-row">
//                       <button
//                         className={`play-btn ${
//                           currentTrack?.id === track.id && isPlaying
//                             ? "playing"
//                             : ""
//                         }`}
//                         onClick={() => playTrack(track)}
//                       >
//                         {currentTrack?.id === track.id && isPlaying ? (
//                           <FaPause />
//                         ) : (
//                           <FaPlay />
//                         )}
//                       </button>
//                       <button
//                         className={`favorite-btn ${
//                           favorites.some((t) => t.id === track.id)
//                             ? "active"
//                             : ""
//                         }`}
//                         onClick={() => toggleFavorite(track)}
//                       >
//                         <FaHeart />
//                       </button>
//                       <button
//                         className="add-btn"
//                         onClick={() => {
//                           if (playlists.length > 0) {
//                             addToPlaylist(playlists[0].id, track);
//                             alert(`Added to ${playlists[0].name}`);
//                           }
//                         }}
//                       >
//                         <FaPlus />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeView === "playlists" && (
//             <div className="playlists-view">
//               <div className="view-header">
//                 <h2>Your Playlists</h2>
//                 <button
//                   className="btn-primary"
//                   onClick={() => setShowPlaylistModal(true)}
//                 >
//                   <FaPlus /> New Playlist
//                 </button>
//               </div>

//               {playlists.length === 0 ? (
//                 <div className="empty-state">
//                   <RiPlayListFill />
//                   <h3>No playlists yet</h3>
//                   <p>
//                     Create your first playlist to organize your favorite songs
//                   </p>
//                   <button
//                     className="btn-primary"
//                     onClick={() => setShowPlaylistModal(true)}
//                   >
//                     Create Playlist
//                   </button>
//                 </div>
//               ) : (
//                 <div className="playlists-grid">
//                   {playlists.map((playlist) => (
//                     <div
//                       key={playlist.id}
//                       className="playlist-card"
//                       onClick={() => {
//                         setSelectedPlaylist(playlist);
//                         setActiveView("playlist-detail");
//                       }}
//                     >
//                       <div className="playlist-image">
//                         <div className="playlist-icon">
//                           <RiPlayListFill />
//                         </div>
//                         {playlist.tracks.length > 0 && (
//                           <img
//                             src={playlist.tracks[0].album.images[0]?.url}
//                             alt={playlist.name}
//                           />
//                         )}
//                       </div>
//                       <h3>{playlist.name}</h3>
//                       <p>{playlist.tracks.length} songs</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeView === "history" && (
//             <div className="history-view">
//               <h2>Recently Played</h2>

//               {recentlyPlayed.length === 0 ? (
//                 <div className="empty-state">
//                   <MdHistory />
//                   <h3>No recent plays</h3>
//                   <p>Start playing songs to see them here</p>
//                 </div>
//               ) : (
//                 <div className="tracks-list">
//                   {recentlyPlayed.map((track, index) => (
//                     <div key={track.id} className="track-row">
//                       <div className="track-index">{index + 1}</div>
//                       <div className="track-main">
//                         <img
//                           src={track.album.images[0]?.url}
//                           alt={track.name}
//                         />
//                         <div className="track-details">
//                           <h4>{track.name}</h4>
//                           <p>{track.album.artists[0].name}</p>
//                         </div>
//                       </div>
//                       <div className="track-actions-row">
//                         <button
//                           className="play-btn"
//                           onClick={() => playTrack(track)}
//                         >
//                           <FaPlay />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeView === "favorites" && (
//             <div className="favorites-view">
//               <h2>Your Favorites</h2>

//               {favorites.length === 0 ? (
//                 <div className="empty-state">
//                   <FaHeart />
//                   <h3>No favorites yet</h3>
//                   <p>Click the heart icon on any song to add it here</p>
//                 </div>
//               ) : (
//                 <div className="tracks-grid">
//                   {favorites.map((track) => (
//                     <div key={track.id} className="track-card">
//                       <div className="track-image">
//                         <img
//                           src={track.album.images[0]?.url}
//                           alt={track.name}
//                         />
//                         <button
//                           className="play-overlay"
//                           onClick={() => playTrack(track)}
//                         >
//                           {currentTrack?.id === track.id && isPlaying ? (
//                             <FaPause />
//                           ) : (
//                             <FaPlay />
//                           )}
//                         </button>
//                       </div>
//                       <div className="track-info">
//                         <h4>{track.name}</h4>
//                         <p>{track.album.artists[0].name}</p>
//                         <div className="track-actions">
//                           <button
//                             className="favorite-btn active"
//                             onClick={() => toggleFavorite(track)}
//                           >
//                             <FaHeart />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeView === "playlist-detail" && selectedPlaylist && (
//             <div className="playlist-detail-view">
//               <div className="playlist-header">
//                 <div className="playlist-header-image">
//                   {selectedPlaylist.tracks.length > 0 ? (
//                     <img
//                       src={selectedPlaylist.tracks[0].album.images[0]?.url}
//                       alt={selectedPlaylist.name}
//                     />
//                   ) : (
//                     <div className="empty-playlist-image">
//                       <RiPlayListFill />
//                     </div>
//                   )}
//                 </div>
//                 <div className="playlist-header-info">
//                   <p>PLAYLIST</p>
//                   <h1>{selectedPlaylist.name}</h1>
//                   <p>
//                     Created on{" "}
//                     {new Date(selectedPlaylist.created).toLocaleDateString()} •{" "}
//                     {selectedPlaylist.tracks.length} songs
//                   </p>
//                 </div>
//               </div>

//               <div className="playlist-tracks">
//                 {selectedPlaylist.tracks.length === 0 ? (
//                   <div className="empty-state">
//                     <p>No songs in this playlist yet</p>
//                     <button
//                       className="btn-primary"
//                       onClick={() => setActiveView("search")}
//                     >
//                       Browse Songs
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="tracks-list">
//                     {selectedPlaylist.tracks.map((track, index) => (
//                       <div key={track.id} className="track-row">
//                         <div className="track-index">{index + 1}</div>
//                         <div className="track-main">
//                           <img
//                             src={track.album.images[0]?.url}
//                             alt={track.name}
//                           />
//                           <div className="track-details">
//                             <h4>{track.name}</h4>
//                             <p>{track.album.artists[0].name}</p>
//                           </div>
//                         </div>
//                         <div className="track-actions-row">
//                           <button
//                             className="play-btn"
//                             onClick={() => playTrack(track)}
//                           >
//                             <FaPlay />
//                           </button>
//                           <button
//                             className="remove-btn"
//                             onClick={() => {
//                               setPlaylists((prev) =>
//                                 prev.map((playlist) => {
//                                   if (playlist.id === selectedPlaylist.id) {
//                                     return {
//                                       ...playlist,
//                                       tracks: playlist.tracks.filter(
//                                         (t) => t.id !== track.id
//                                       ),
//                                     };
//                                   }
//                                   return playlist;
//                                 })
//                               );
//                               setSelectedPlaylist((prev) => ({
//                                 ...prev,
//                                 tracks: prev.tracks.filter(
//                                   (t) => t.id !== track.id
//                                 ),
//                               }));
//                             }}
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Now Playing Bar */}
//         {currentTrack && (
//           <div className="now-playing-bar">
//             <div className="now-playing-track">
//               <img
//                 src={currentTrack.album.images[0]?.url}
//                 alt={currentTrack.name}
//               />
//               <div className="now-playing-info">
//                 <h4>{currentTrack.name}</h4>
//                 <p>{currentTrack.album.artists[0].name}</p>
//               </div>
//               <button
//                 className="favorite-btn-now-playing"
//                 onClick={() => toggleFavorite(currentTrack)}
//               >
//                 <FaHeart
//                   className={
//                     favorites.some((t) => t.id === currentTrack.id)
//                       ? "active"
//                       : ""
//                   }
//                 />
//               </button>
//             </div>

//             <div className="now-playing-controls">
//               <button
//                 className="play-control"
//                 onClick={() => playTrack(currentTrack)}
//               >
//                 {isPlaying ? <FaPause /> : <FaPlay />}
//               </button>
//             </div>

//             <div className="now-playing-progress">
//               <div className="progress-bar">
//                 <div className="progress" style={{ width: "30%" }}></div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;




















import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  FaMusic,
  FaSearch,
  FaPlay,
  FaPause,
  FaHeart,
  FaPlus,
  FaList,
  FaSun,
  FaMoon,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { MdLibraryMusic, MdHome, MdHistory, MdEqualizer } from "react-icons/md";
import { RiPlayListFill } from "react-icons/ri";

// Sample data for demonstration
let defaultTracks = [
  {
    id: "1",
    name: "Twinkle Twinkle Little Star",
    album: {
      images: [
        {
          url: "https://images.unsplash.com/photo-1515705576963-95cad62945b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      artists: [{ name: "Kids Songs" }],
      release_date: "2020-01-01",
    },
    preview_url: null,
    popularity: 85,
    duration_ms: 120000,
    needsFetch: true
  },
  {
    id: "2",
    name: "The Wheels on the Bus",
    album: {
      images: [
        {
          url: "https://media.istockphoto.com/id/157427231/photo/london-bus-isolated-with-clipping-path.webp?a=1&b=1&s=612x612&w=0&k=20&c=BT43hnz5By4n1xnn8wkvFwijbZmrrilj4ZEmn8rz6pQ=",
        },
      ],
      artists: [{ name: "Super Simple Songs" }],
      release_date: "2018-03-22",
    },
    preview_url: null,
    popularity: 80,
    duration_ms: 140000,
    needsFetch: true
  },
  {
    id: "3",
    name: "Baby Shark",
    album: {
      images: [
        {
          url: "https://plus.unsplash.com/premium_photo-1724311823993-39bd35528065?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFieSUyMHNoYXJrfGVufDB8fDB8fHww",
        },
      ],
      artists: [{ name: "Pinkfong" }],
      release_date: "2019-06-15",
    },
    preview_url: null,
    popularity: 95,
    duration_ms: 150000,
    needsFetch: true
  },
  {
    id: "4",
    name: "Old MacDonald",
    album: {
      images: [
        {
          url: "https://plus.unsplash.com/premium_photo-1663088800901-c57258d8707a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2xkJTIwbWFjZG9uYWxkJTIwaGFkJTIwYSUyMGZhcm18ZW58MHx8MHx8fDA%3D",
        },
      ],
      artists: [{ name: "Kids Learning Tube" }],
      release_date: "2021-05-10",
    },
    preview_url: null,
    popularity: 75,
    duration_ms: 135000,
    needsFetch: true
  },
];

function App() {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState(defaultTracks);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeView, setActiveView] = useState("home");
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [fetchingTrackId, setFetchingTrackId] = useState(null);

  const audioRef = useRef(null);

  // Function to fetch a single track from Spotify
  const fetchSingleTrack = async (trackName, trackId) => {
    try {
      let data = await fetch(
        `https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${encodeURIComponent(trackName)}&type=track`
      );
      let c_data = await data.json();
      
      if (c_data.tracks && c_data.tracks.items.length > 0) {
        const spotifyTrack = c_data.tracks.items[0];
        
        // Update the track in state
        setTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { 
                ...track, 
                preview_url: spotifyTrack.preview_url,
                album: spotifyTrack.album,
                artists: spotifyTrack.artists,
                duration_ms: spotifyTrack.duration_ms,
                needsFetch: false
              }
            : track
        ));
        
        // Update the global defaultTracks array
        defaultTracks = defaultTracks.map(track =>
          track.id === trackId
            ? { 
                ...track, 
                preview_url: spotifyTrack.preview_url,
                album: spotifyTrack.album,
                artists: spotifyTrack.artists,
                duration_ms: spotifyTrack.duration_ms,
                needsFetch: false 
              }
            : track
        );
        
        return spotifyTrack;
      }
    } catch (error) {
      console.error(`Error fetching track "${trackName}":`, error);
      return null;
    }
  };

  // Get tracks from API for search
  const getTracks = async () => {
    if (!keyword.trim()) return;

    try {
      let data = await fetch(
        `https://v1.nocodeapi.com/haniya_sahar/spotify/lIfGqNvbrztTnYba/search?q=${keyword}&type=track`
      );
      let c_data = await data.json();
      console.log(c_data.tracks);

      if (c_data.tracks && c_data.tracks.items) {
        setTracks(c_data.tracks.items);
        setActiveView("search");
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      // Fallback to sample data if API fails
      setTracks(
        defaultTracks.filter(
          (track) =>
            track.name.toLowerCase().includes(keyword.toLowerCase()) ||
            track.album.artists[0].name
              .toLowerCase()
              .includes(keyword.toLowerCase())
        )
      );
    }
  };

  // Play a track - with lazy fetching for default tracks
  const playTrack = async (track) => {
    // If this is a default track that needs fetching
    if (track.needsFetch && track.id <= "4") {
      console.log(`Fetching ${track.name} from Spotify...`);
      setFetchingTrackId(track.id);
      
      const fetchedTrack = await fetchSingleTrack(track.name, track.id);
      setFetchingTrackId(null);
      
      if (fetchedTrack && fetchedTrack.preview_url) {
        // Update track with fetched data
        track = {
          ...track,
          preview_url: fetchedTrack.preview_url,
          album: fetchedTrack.album,
          artists: fetchedTrack.artists,
          needsFetch: false
        };
      } else {
        // If API fails, use fallback sound
        track.preview_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        track.needsFetch = false;
      }
    }
    
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
      if (!recentlyPlayed.some((t) => t.id === track.id)) {
        setRecentlyPlayed((prev) => [track, ...prev.slice(0, 9)]);
      }
    }
  };

  // Add track to playlist
  const addToPlaylist = (playlistId, track) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (
          playlist.id === playlistId &&
          !playlist.tracks.some((t) => t.id === track.id)
        ) {
          return { ...playlist, tracks: [...playlist.tracks, track] };
        }
        return playlist;
      })
    );
  };

  // Create new playlist
  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
      created: new Date().toISOString(),
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
    setNewPlaylistName("");
    setShowPlaylistModal(false);
  };

  // Toggle favorite
  const toggleFavorite = (track) => {
    if (favorites.some((t) => t.id === track.id)) {
      setFavorites((prev) => prev.filter((t) => t.id !== track.id));
    } else {
      setFavorites((prev) => [...prev, track]);
    }
  };

  // Format time
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
        id: "1",
        name: "Kids Party Mix",
        tracks: [defaultTracks[0], defaultTracks[1]],
        created: "2023-10-01",
      },
      {
        id: "2",
        name: "Bedtime Stories",
        tracks: [defaultTracks[2]],
        created: "2023-10-05",
      },
    ]);
  }, []);

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
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
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="btn-secondary"
                >
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
            className={activeView === "home" ? "active" : ""}
            onClick={() => setActiveView("home")}
          >
            <MdHome />
            <span>Home</span>
          </li>
          <li
            className={activeView === "search" ? "active" : ""}
            onClick={() => setActiveView("search")}
          >
            <FaSearch />
            <span>Search</span>
          </li>
          <li
            className={activeView === "library" ? "active" : ""}
            onClick={() => setActiveView("library")}
          >
            <MdLibraryMusic />
            <span>Your Library</span>
          </li>
          <li
            className={activeView === "playlists" ? "active" : ""}
            onClick={() => setActiveView("playlists")}
          >
            <RiPlayListFill />
            <span>Playlists</span>
          </li>
          <li
            className={activeView === "history" ? "active" : ""}
            onClick={() => setActiveView("history")}
          >
            <MdHistory />
            <span>Recently Played</span>
          </li>
          <li
            className={activeView === "favorites" ? "active" : ""}
            onClick={() => setActiveView("favorites")}
          >
            <FaHeart />
            <span>Favorites</span>
          </li>
        </ul>

        <div className="playlists-section">
          <h3>Your Playlists</h3>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`playlist-item ${
                selectedPlaylist?.id === playlist.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedPlaylist(playlist);
                setActiveView("playlist-detail");
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
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
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
              onKeyPress={(e) => e.key === "Enter" && getTracks()}
            />
            <button onClick={getTracks} className="search-btn">
              Search
            </button>
          </div>

          <div className="user-profile">
            <span>U</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeView === "home" && (
            <div className="home-view">
              <h1 className="welcome-title">Welcome to KidsMusic!</h1>
              <p className="welcome-subtitle">
                Discover fun songs for children
              </p>

              <div className="featured-grid">
                <div
                  className="featured-card"
                  onClick={() => setActiveView("search")}
                >
                  <div className="card-icon">
                    <FaSearch />
                  </div>
                  <h3>Search Songs</h3>
                  <p>Find your favorite children's songs</p>
                </div>

                <div
                  className="featured-card"
                  onClick={() => setActiveView("playlists")}
                >
                  <div className="card-icon">
                    <RiPlayListFill />
                  </div>
                  <h3>Playlists</h3>
                  <p>Create and manage playlists</p>
                </div>

                <div
                  className="featured-card"
                  onClick={() => setActiveView("favorites")}
                >
                  <div className="card-icon">
                    <FaHeart />
                  </div>
                  <h3>Favorites</h3>
                  <p>Your favorite songs collection</p>
                </div>

                <div
                  className="featured-card"
                  onClick={() => setActiveView("history")}
                >
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
                  {tracks.map((track) => (
                    <div key={track.id} className="track-card">
                      <div className="track-image">
                        <img
                          src={track.album.images[0]?.url}
                          alt={track.name}
                        />
                        <button
                          className="play-overlay"
                          onClick={() => playTrack(track)}
                          disabled={fetchingTrackId === track.id}
                        >
                          {fetchingTrackId === track.id ? (
                            "Loading..."
                          ) : currentTrack?.id === track.id && isPlaying ? (
                            <FaPause />
                          ) : (
                            <FaPlay />
                          )}
                        </button>
                      </div>
                      <div className="track-info">
                        <h4>{track.name}</h4>
                        <p>{track.album.artists[0].name}</p>
                        <div className="track-actions">
                          <button
                            className={`favorite-btn ${
                              favorites.some((t) => t.id === track.id)
                                ? "active"
                                : ""
                            }`}
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

          {activeView === "search" && (
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
                    <div className="track-album">
                      {track.album.name || "Single"}
                    </div>
                    <div className="track-duration">
                      {formatTime(track.duration_ms)}
                    </div>
                    <div className="track-actions-row">
                      <button
                        className={`play-btn ${
                          currentTrack?.id === track.id && isPlaying
                            ? "playing"
                            : ""
                        }`}
                        onClick={() => playTrack(track)}
                        disabled={fetchingTrackId === track.id}
                      >
                        {fetchingTrackId === track.id ? (
                          "..." 
                        ) : currentTrack?.id === track.id && isPlaying ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </button>
                      <button
                        className={`favorite-btn ${
                          favorites.some((t) => t.id === track.id)
                            ? "active"
                            : ""
                        }`}
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

          {activeView === "playlists" && (
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
                  <p>
                    Create your first playlist to organize your favorite songs
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setShowPlaylistModal(true)}
                  >
                    Create Playlist
                  </button>
                </div>
              ) : (
                <div className="playlists-grid">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="playlist-card"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setActiveView("playlist-detail");
                      }}
                    >
                      <div className="playlist-image">
                        <div className="playlist-icon">
                          <RiPlayListFill />
                        </div>
                        {playlist.tracks.length > 0 && (
                          <img
                            src={playlist.tracks[0].album.images[0]?.url}
                            alt={playlist.name}
                          />
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

          {activeView === "history" && (
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
                        <img
                          src={track.album.images[0]?.url}
                          alt={track.name}
                        />
                        <div className="track-details">
                          <h4>{track.name}</h4>
                          <p>{track.album.artists[0].name}</p>
                        </div>
                      </div>
                      <div className="track-actions-row">
                        <button
                          className="play-btn"
                          onClick={() => playTrack(track)}
                          disabled={fetchingTrackId === track.id}
                        >
                          {fetchingTrackId === track.id ? "..." : <FaPlay />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === "favorites" && (
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
                  {favorites.map((track) => (
                    <div key={track.id} className="track-card">
                      <div className="track-image">
                        <img
                          src={track.album.images[0]?.url}
                          alt={track.name}
                        />
                        <button
                          className="play-overlay"
                          onClick={() => playTrack(track)}
                          disabled={fetchingTrackId === track.id}
                        >
                          {fetchingTrackId === track.id ? (
                            "..." 
                          ) : currentTrack?.id === track.id && isPlaying ? (
                            <FaPause />
                          ) : (
                            <FaPlay />
                          )}
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

          {activeView === "playlist-detail" && selectedPlaylist && (
            <div className="playlist-detail-view">
              <div className="playlist-header">
                <div className="playlist-header-image">
                  {selectedPlaylist.tracks.length > 0 ? (
                    <img
                      src={selectedPlaylist.tracks[0].album.images[0]?.url}
                      alt={selectedPlaylist.name}
                    />
                  ) : (
                    <div className="empty-playlist-image">
                      <RiPlayListFill />
                    </div>
                  )}
                </div>
                <div className="playlist-header-info">
                  <p>PLAYLIST</p>
                  <h1>{selectedPlaylist.name}</h1>
                  <p>
                    Created on{" "}
                    {new Date(selectedPlaylist.created).toLocaleDateString()} •{" "}
                    {selectedPlaylist.tracks.length} songs
                  </p>
                </div>
              </div>

              <div className="playlist-tracks">
                {selectedPlaylist.tracks.length === 0 ? (
                  <div className="empty-state">
                    <p>No songs in this playlist yet</p>
                    <button
                      className="btn-primary"
                      onClick={() => setActiveView("search")}
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
                          <img
                            src={track.album.images[0]?.url}
                            alt={track.name}
                          />
                          <div className="track-details">
                            <h4>{track.name}</h4>
                            <p>{track.album.artists[0].name}</p>
                          </div>
                        </div>
                        <div className="track-actions-row">
                          <button
                            className="play-btn"
                            onClick={() => playTrack(track)}
                            disabled={fetchingTrackId === track.id}
                          >
                            {fetchingTrackId === track.id ? "..." : <FaPlay />}
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => {
                              setPlaylists((prev) =>
                                prev.map((playlist) => {
                                  if (playlist.id === selectedPlaylist.id) {
                                    return {
                                      ...playlist,
                                      tracks: playlist.tracks.filter(
                                        (t) => t.id !== track.id
                                      ),
                                    };
                                  }
                                  return playlist;
                                })
                              );
                              setSelectedPlaylist((prev) => ({
                                ...prev,
                                tracks: prev.tracks.filter(
                                  (t) => t.id !== track.id
                                ),
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
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.name}
              />
              <div className="now-playing-info">
                <h4>{currentTrack.name}</h4>
                <p>{currentTrack.album.artists[0].name}</p>
              </div>
              <button
                className="favorite-btn-now-playing"
                onClick={() => toggleFavorite(currentTrack)}
              >
                <FaHeart
                  className={
                    favorites.some((t) => t.id === currentTrack.id)
                      ? "active"
                      : ""
                  }
                />
              </button>
            </div>

            <div className="now-playing-controls">
              <button
                className="play-control"
                onClick={() => playTrack(currentTrack)}
                disabled={fetchingTrackId === currentTrack.id}
              >
                {fetchingTrackId === currentTrack.id ? "..." : 
                 isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>

            <div className="now-playing-progress">
              <div className="progress-bar">
                <div className="progress" style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;