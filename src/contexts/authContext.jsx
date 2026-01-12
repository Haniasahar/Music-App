// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('kidsMusicUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithInitial = {
      ...userData,
      profileInitial: userData.username.charAt(0).toUpperCase(),
      isKid: calculateIsKid(userData.birthdate)
    };
    setUser(userWithInitial);
    localStorage.setItem('kidsMusicUser', JSON.stringify(userWithInitial));
  };

  const register = (userData) => {
    const userWithInitial = {
      ...userData,
      profileInitial: userData.username.charAt(0).toUpperCase(),
      isKid: calculateIsKid(userData.birthdate),
      parentalControls: false
    };
    setUser(userWithInitial);
    localStorage.setItem('kidsMusicUser', JSON.stringify(userWithInitial));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kidsMusicUser');
  };

  const updateParentalControls = (enabled) => {
    if (user) {
      const updatedUser = { ...user, parentalControls: enabled };
      setUser(updatedUser);
      localStorage.setItem('kidsMusicUser', JSON.stringify(updatedUser));
    }
  };

  const calculateIsKid = (birthdate) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age < 13;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateParentalControls,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};