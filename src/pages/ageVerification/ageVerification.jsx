// src/pages/AgeVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBirthdayCake, FaChild, FaUserTie, FaShieldAlt } from 'react-icons/fa';
import './ageVerification.css';
import { useAuth } from '../../contexts/authContext';

const AgeVerification = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [error, setError] = useState('');

  // If user already has birthdate, redirect
  useEffect(() => {
    if (user?.birthdate) {
      navigate(user.isKid ? '/kids' : '/main');
    }
  }, [user, navigate]);

  const calculateAge = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!birthdate) {
      return setError('Please enter your birthdate');
    }

    const age = calculateAge(birthdate);
    
    if (age < 0 || age > 120) {
      return setError('Please enter a valid birthdate');
    }

    // Update user with birthdate
    const updatedUser = {
      ...user,
      birthdate,
      isKid: age < 13,
      age: age
    };

    login(updatedUser);
    
    // Redirect based on age
    if (age < 13) {
      navigate('/kids', { 
        state: { 
          welcomeMessage: `Welcome to Kids Mode! We've selected age-appropriate content for you.` 
        } 
      });
    } else {
      navigate('/main', { 
        state: { 
          welcomeMessage: `Welcome! You have access to all content.` 
        } 
      });
    }
  };

  return (
    <div className="age-verification-container">
      <div className="age-card">
        <div className="age-header">
          <FaShieldAlt className="age-icon" />
          <h1>Age Verification</h1>
          <p>For a safe and personalized experience</p>
        </div>

        <form onSubmit={handleSubmit} className="age-form">
          <div className="age-input-group">
            <FaBirthdayCake className="input-icon" />
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="age-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {error && <div className="age-error">{error}</div>}

          <button type="submit" className="age-button">
            Verify Age
          </button>
        </form>

        <div className="age-info">
          <div className="age-category">
            <FaChild className="kid-icon" />
            <div>
              <h3>Under 13</h3>
              <p>Kids get a curated, child-friendly experience with filtered content</p>
            </div>
          </div>

          <div className="age-category">
            <FaUserTie className="adult-icon" />
            <div>
              <h3>13 and above</h3>
              <p>Full access to all music with optional parental controls</p>
            </div>
          </div>
        </div>

        <div className="privacy-notice">
          <FaShieldAlt />
          <p>Your birthdate helps us provide age-appropriate content. We don't share this information.</p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;