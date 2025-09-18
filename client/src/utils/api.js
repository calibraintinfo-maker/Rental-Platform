import axios from 'axios';

// Base URL for API - Updated to your friend's new URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://spacelink-a-real-time-unified-rental-at83.onrender.com';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// 🔑 REQUEST INTERCEPTOR - Automatically add auth token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 RESPONSE INTERCEPTOR - Handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove tokens and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🌐 API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (data) => axios.post('/api/auth/login', data),
    register: (data) => axios.post('/api/auth/register', data),
    verify: () => axios.get('/api/auth/verify'),
  },

  // User endpoints
  user: {
    getProfile: () => axios.get('/api/users/profile'),
    updateProfile: (data) => axios.put('/api/users/profile', data),
    checkProfileComplete: () => axios.get('/api/users/profile/check-complete'),
  },

  // Property endpoints - Enhanced from your friend's version
  properties: {
    getAll: (params) => axios.get('/api/properties', { params }),
    getFeatured: () => axios.get('/api/properties/featured'),
    getById: (id) => axios.get(`/api/properties/${id}`),
    create: (data) => axios.post('/api/properties', data),
    update: (id, data) => axios.put(`/api/properties/${id}`, data),
    disable: (id) => axios.patch(`/api/properties/${id}/disable`),
    enable: (id) => axios.patch(`/api/properties/${id}/enable`),
    getUserProperties: (params) => axios.get('/api/properties/user/my-properties', { params }),
    getPropertyBookings: (id) => axios.get(`/api/properties/${id}/bookings`),
    getBookedDates: (id) => axios.get(`/api/properties/${id}/booked-dates`), // New from friend
  },

  // Booking endpoints - Enhanced with approve/reject/end
  bookings: {
    create: (data) => axios.post('/api/bookings', data),
    getUserBookings: () => axios.get('/api/bookings/my-bookings'),
    getById: (id) => axios.get(`/api/bookings/${id}`),
    cancel: (id) => axios.patch(`/api/bookings/${id}/cancel`),
    checkAvailability: (data) => axios.post('/api/bookings/check-availability', data),
    approve: (id) => axios.patch(`/api/bookings/${id}/approve`), // New from friend
    reject: (id) => axios.patch(`/api/bookings/${id}/reject`), // New from friend  
    end: (id) => axios.patch(`/api/bookings/${id}/end`), // New from friend
  },

  // Notification endpoints - New from friend
  notifications: {
    getAll: () => axios.get('/api/notifications'),
    markAsRead: (id) => axios.patch(`/api/notifications/${id}/read`),
    delete: (id) => axios.delete(`/api/notifications/${id}`),
  },

  // Admin endpoints - New from friend
  admin: {
    getDashboard: () => axios.get('/api/admin/dashboard'),
    getPendingProperties: () => axios.get('/api/admin/properties/pending'),
    verifyProperty: (id, status, note) => axios.patch(`/api/admin/properties/${id}/verify`, { status, note }),
  },
};

// 🛠️ Utility functions (preserved from your original)
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatPrice = (price, type = 'monthly') => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
  return `${formatted}/${type}`;
};

export const getImageUrl = (imageData) => {
  if (!imageData) return '/placeholder-image.jpg';
  // If it's already a URL, return as is
  if (imageData.startsWith('http')) return imageData;
  // If it's base64 data, return as data URL
  if (imageData.startsWith('data:')) return imageData;
  // Otherwise, assume it's base64 without prefix
  return `data:image/jpeg;base64,${imageData}`;
};

export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const categories = {
  'Property Rentals': {
    subtypes: ['Apartments', 'Flats', 'Houses', 'Villas'],
    rentTypes: ['monthly', 'yearly']
  },
  'Commercial': {
    subtypes: ['Offices', 'Shops', 'Warehouses', 'Showrooms'],
    rentTypes: ['monthly', 'yearly']
  },
  'Land': {
    subtypes: ['Agricultural Land', 'Commercial Plot', 'Residential Plot'],
    rentTypes: ['yearly']
  },
  'Parking': {
    subtypes: ['Car Parking', 'Bike Parking', 'Garage'],
    rentTypes: ['monthly']
  },
  'Event': {
    subtypes: ['Banquet Halls', 'Gardens', 'Meeting Rooms', 'Conference Halls'],
    rentTypes: ['hourly']
  }
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return 'An unexpected error occurred';
  }
};
