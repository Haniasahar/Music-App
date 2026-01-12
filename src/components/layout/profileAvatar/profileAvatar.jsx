// src/components/ui/profileAvatar.jsx
import React from 'react';
import './profileAvatar.css';

const ProfileAvatar = ({ initial, size = 'medium' }) => {
  const sizeClass = `avatar-${size}`;
  const colors = ['#1DB954', '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572'];
  
  // Generate consistent color based on initial
  const colorIndex = initial ? initial.charCodeAt(0) % colors.length : 0;
  const backgroundColor = colors[colorIndex];

  return (
    <div 
      className={`profile-avatar ${sizeClass}`}
      style={{ backgroundColor }}
      title={initial ? `User ${initial}` : 'User'}
    >
      {initial || '?'}
    </div>
  );
};

export default ProfileAvatar;