import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token and fetch latest profile on app load
  useEffect(() => {
    const verifyAndFetchProfile = async () => {
      if (token) {
        try {
          // Verify token
          await axios.get('/api/auth/verify');
          // Fetch latest profile
          const profileRes = await axios.get('/api/users/profile');
          setUser(profileRes.data);
        } catch (error) {
          console.error('Token verification or profile fetch failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyAndFetchProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      // Fetch latest profile after login
      const profileRes = await axios.get('/api/users/profile');
      setUser(profileRes.data);
      return { success: true, user: profileRes.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      // Fetch latest profile after registration
      const profileRes = await axios.get('/api/users/profile');
      setUser(profileRes.data);
      return { success: true, user: profileRes.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
