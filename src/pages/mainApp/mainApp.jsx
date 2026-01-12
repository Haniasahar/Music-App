import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar/sidebar";
import Player from "../../components/music/player/player";
import HomeView from "../../components/homeView";
import SearchBar from "../../components/layout/searchBar/searchBar";
import {
  FaMusic,
  FaChild,
  FaUserTie,
  FaCog,
  FaHome,
  FaSearch,
  FaHistory,
  FaHeart,
} from "react-icons/fa";
import "./mainApp.css";
import { useAuth } from "../../contexts/authContext";
import ProfileAvatar from "../../components/layout/profileAvatar/profileAvatar";
import PlaylistManager from "../../components/music/playlists/playlistManager";

const MainApp = ({ isKidMode = false }) => {
  const { user, logout, updateParentalControls } = useAuth();
  const location = useLocation();
  const [activeView, setActiveView] = React.useState("home");
  const [welcomeMessage, setWelcomeMessage] = React.useState("");
  const [showParentalControls, setShowParentalControls] = React.useState(false);

  // Set active view based on route
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes("playlists")) setActiveView("playlists");
    else if (path.includes("search")) setActiveView("search");
    else if (path.includes("history")) setActiveView("history");
    else if (path.includes("favorites")) setActiveView("favorites");
    else setActiveView("home");

    if (location.state?.welcomeMessage) {
      setWelcomeMessage(location.state.welcomeMessage);
      setTimeout(() => setWelcomeMessage(""), 5000);
    }
  }, [location]);

  const renderContent = () => {
    switch (activeView) {
      case "playlists":
        return <PlaylistManager />;
      case "search":
        return (
          <div className="search-view">
            <SearchBar isKidMode={isKidMode} />
            {/* Search results will be added by SearchBar */}
          </div>
        );
      case "history":
        return (
          <div className="history-view">
            <h2>Recently Played</h2>
            {/* History is shown in Player dropdown, full history page can be added later */}
            <p>
              Full history page coming soon. Check the player dropdown for
              recent plays.
            </p>
          </div>
        );
      case "favorites":
        return (
          <div className="favorites-view">
            <h2>Your Favorites</h2>
            <p>Favorites feature coming soon!</p>
          </div>
        );
      case "home":
      default:
        return <HomeView isKidMode={isKidMode} />;
    }
  };

  return (
    <div className={`main-app-container ${isKidMode ? "kid-mode" : ""}`}>
      <Sidebar isKidMode={isKidMode} onViewChange={setActiveView} />

      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="user-info">
            <ProfileAvatar initial={user?.profileInitial} />
            <div>
              <h3>Welcome, {user?.username}!</h3>
              <p className="user-age-badge">
                {isKidMode ? (
                  <>
                    <FaChild /> Kids Mode
                  </>
                ) : (
                  <>
                    <FaUserTie /> Full Access
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="header-actions">
            {!isKidMode && (
              <button
                className="parental-controls-btn"
                onClick={() => setShowParentalControls(!showParentalControls)}
              >
                <FaCog /> Parental Controls
              </button>
            )}
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        {welcomeMessage && (
          <div className={`welcome-banner ${isKidMode ? "kid" : "adult"}`}>
            <FaMusic />
            <p>{welcomeMessage}</p>
          </div>
        )}

        {/* Parental Controls Panel */}
        {showParentalControls && !isKidMode && (
          <div className="parental-controls-panel">
            <h3>
              <FaCog /> Parental Controls
            </h3>
            <div className="control-option">
              <input
                type="checkbox"
                id="strictFilter"
                checked={user?.parentalControls}
                onChange={(e) => updateParentalControls(e.target.checked)}
              />
              <label htmlFor="strictFilter">
                Enable strict content filtering
              </label>
              <p>Blocks explicit content and applies kid-friendly filters</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="content-area">{renderContent()}</div>
      </div>

      {/* Player at Bottom */}
      <Player />
    </div>
  );
};

// Export two versions
export const KidsApp = () => <MainApp isKidMode={true} />;
export const AdultApp = () => <MainApp isKidMode={false} />;

export default MainApp;