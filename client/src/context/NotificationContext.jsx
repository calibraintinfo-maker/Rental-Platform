import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.notifications.getAll();
      setNotifications(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const deleteNotification = async (id) => {
    try {
      await api.notifications.delete(id);
      setNotifications((prev) => prev.filter(n => n._id !== id));
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      loading,
      error,
      sidebarOpen,
      setSidebarOpen,
      fetchNotifications,
      markAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
