import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Alert, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api, handleApiError, formatPrice, getImageUrl, categories, convertImageToBase64 } from '../utils/api';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // PROFESSIONAL SVG Icons Component
  const Icon = ({ name, size = 20, className = '' }) => {
    const icons = {
      buildings: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      checkCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
        </svg>
      ),
      xCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
        </svg>
      ),
      layers: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.38,12.81"/>
        </svg>
      ),
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      plus: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      edit: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      user: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      trending: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.properties.getUserProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDisableProperty = async (propertyId) => {
    try {
      await api.properties.disable(propertyId);
      setSuccess('Property disabled successfully');
      fetchProperties();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEnableProperty = async (propertyId) => {
    try {
      await api.properties.enable(propertyId);
      setSuccess('Property enabled successfully');
      fetchProperties();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const viewPropertyBookings = async (property) => {
    try {
      setSelectedProperty(property);
      const response = await api.properties.getPropertyBookings(property._id);
      setBookings(response.data);
      setShowBookingsModal(true);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const openBookingDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailModal(true);
  };

  const handleOwnerBookingAction = async (action, bookingId) => {
    try {
      if (action === 'approve') {
        await api.bookings.approve(bookingId);
        setSuccess('Booking approved');
      } else if (action === 'reject') {
        await api.bookings.reject(bookingId);
        setSuccess('Booking rejected');
      } else if (action === 'end') {
        await api.bookings.end(bookingId);
        setSuccess('Booking ended');
      }
      // Refresh bookings and details
      if (selectedProperty) viewPropertyBookings(selectedProperty);
      if (selectedBooking) setSelectedBooking(null);
      setShowBookingDetailModal(false);
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setEditFormData({
      category: property.category,
      subtype: property.subtype || '',
      title: property.title,
      description: property.description,
      price: property.price,
      size: property.size,
      rentType: property.rentType,
      address: {
        street: property.address.street || '',
        city: property.address.city,
        state: property.address.state,
        pincode: property.address.pincode
      },
      contact: property.contact,
      images: property.images || (property.image ? [property.image] : [])
    });
    
    // Set existing images as previews
    const existingPreviews = (property.images || (property.image ? [property.image] : [])).map((img, index) => ({
      id: `existing-${index}`,
      src: img,
      name: `Image ${index + 1}`,
      isExisting: true
    }));
    setEditImagePreviews(existingPreviews);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setEditFormData({
        ...editFormData,
        address: {
          ...editFormData.address,
          [addressField]: value
        }
      });
    } else if (name === 'rentType') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setEditFormData({
        ...editFormData,
        rentType: selectedOptions
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
    // Reset subtype when category changes
    if (name === 'category') {
      setEditFormData(prev => ({
        ...prev,
        category: value,
        subtype: '',
        rentType: categories[value]?.rentTypes || []
      }));
    }
  };

  const handleEditImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    // Limit to maximum 5 images total
    if (editFormData.images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }
    try {
      const newImages = [];
      const newPreviews = [];
      for (const file of files) {
        // Check file size (max 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          return;
        }
        // Check file type
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image.`);
          return;
        }
        const base64 = await convertImageToBase64(file);
        newImages.push(base64);
        newPreviews.push({
          id: Date.now() + Math.random(),
          src: base64,
          name: file.name,
          isExisting: false
        });
      }
      setEditFormData({
        ...editFormData,
        images: [...editFormData.images, ...newImages]
      });
      setEditImagePreviews([...editImagePreviews, ...newPreviews]);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Error processing images. Please try again.');
    }
  };

  const removeEditImage = (index) => {
    const newImages = editFormData.images.filter((_, i) => i !== index);
    const newPreviews = editImagePreviews.filter((_, i) => i !== index);
    
    setEditFormData({
      ...editFormData,
      images: newImages
    });
    setEditImagePreviews(newPreviews);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError('');
    // Validation
    if (!editFormData.category || !editFormData.title || !editFormData.description || 
        !editFormData.price || !editFormData.size || editFormData.rentType.length === 0 ||
        !editFormData.address.city || !editFormData.address.state || !editFormData.address.pincode ||
        !editFormData.contact || editFormData.images.length === 0) {
      setError('All fields are required');
      setEditLoading(false);
      return;
    }
    try {
      await api.properties.update(selectedProperty._id, editFormData);
      setSuccess('Property updated successfully!');
      setShowEditModal(false);
      fetchProperties();
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusBadge = (property) => {
    if (property.isDisabled) {
      return (
        <Badge 
          style={{ 
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '0.3rem 0.7rem',
            fontWeight: '600',
            fontSize: '0.7rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Icon name="xCircle" size={10} className="me-1" />
          Disabled
        </Badge>
      );
    }
    return (
      <Badge 
        style={{ 
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          color: 'white',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '0.3rem 0.7rem',
          fontWeight: '600',
          fontSize: '0.7rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Icon name="checkCircle" size={10} className="me-1" />
        Active
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        background: `
          radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 154, 158, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
        `,
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        paddingTop: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          border: 'none',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div className="mb-3">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          </div>
          <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Loading Properties</h4>
          <p style={{ color: '#6b7280', margin: 0 }}>Please wait while we fetch your properties...</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      background: `
        radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 154, 158, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
      `,
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ANIMATED DOT GRID BACKGROUND */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(120, 119, 198, 0.15) 1px, transparent 0)
        `,
        backgroundSize: '20px 20px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 1
      }} />

      <style>
        {`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            25% { transform: translate(5px, 5px); }
            50% { transform: translate(0, 10px); }
            75% { transform: translate(-5px, 5px); }
            100% { transform: translate(0, 0); }
          }
          
          .property-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(25px) !important;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15) !important;
            border-radius: 24px !important;
            overflow: hidden;
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            min-height: 650px !important;
            max-height: 650px !important;
          }
          
          .property-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 60px rgba(31, 38, 135, 0.25) !important;
            border: 1px solid rgba(120, 119, 198, 0.3) !important;
          }
          
          /* 🎯 FIXED: Much larger image with proper constraints */
          .property-image {
            height: 380px !important;
            width: 100% !important;
            object-fit: cover !important;
            border-radius: 0 !important;
            transition: all 0.4s ease !important;
            flex-shrink: 0 !important;
          }
          
          .property-card:hover .property-image {
            transform: scale(1.05);
          }
          
          .action-button {
            border: none !important;
            border-radius: 16px !important;
            padding: 0.7rem 1.3rem !important;
            font-weight: 600 !important;
            font-size: 0.8rem !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.5rem !important;
            text-transform: none !important;
            letter-spacing: 0.025em !important;
            backdrop-filter: blur(10px) !important;
          }
          
          .action-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          }
          
          .stats-card {
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 24px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15) !important;
          }
          
          .stats-card:hover {
            transform: translateY(-6px) !important;
            box-shadow: 0 15px 45px rgba(31, 38, 135, 0.2) !important;
            border: 1px solid rgba(120, 119, 198, 0.3) !important;
          }
          
          .modal-backdrop {
            z-index: 9998 !important;
            background-color: rgba(0, 0, 0, 0.75) !important;
          }
          
          .modal {
            z-index: 9999 !important;
          }
          
          .modal-content {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(124, 58, 237, 0.9)) !important;
            backdrop-filter: blur(30px) !important;
            border: none !important;
            border-radius: 24px !important;
            box-shadow: 0 25px 80px rgba(31, 38, 135, 0.35) !important;
            overflow: hidden !important;
          }
          
          .modal-header {
            background: transparent !important;
            border: none !important;
            border-radius: 24px 24px 0 0 !important;
            padding: 1.5rem 2rem !important;
            color: white !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            position: relative !important;
          }
          
          .modal-header .btn-close {
            position: absolute !important;
            right: 1.5rem !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border: none !important;
            border-radius: 50% !important;
            color: white !important;
            opacity: 1 !important;
            font-size: 0.9rem !important;
            padding: 0.35rem !important;
            margin: 0 !important;
            width: 30px !important;
            height: 30px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            z-index: 10 !important;
          }
          
          .modal-header .btn-close::before {
            content: "✕" !important;
            color: white !important;
            font-size: 12px !important;
            font-weight: bold !important;
            line-height: 1 !important;
          }
          
          .modal-header .btn-close:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-50%) scale(1.1) !important;
          }
          
          .modal-title {
            margin: 0 !important;
            padding-right: 70px !important;
            flex: 1 !important;
          }
          
          .modal-body {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(30px) !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          
          .modal-footer {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(30px) !important;
            border: none !important;
            border-radius: 0 0 24px 24px !important;
            padding: 1.5rem 2rem !important;
          }
          
          .booking-detail-modal .modal-dialog {
            max-width: 800px !important;
            margin: 2rem auto !important;
          }
          
          .booking-detail-modal .modal-content {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(124, 58, 237, 0.9)) !important;
          }
          
          .booking-detail-modal .modal-header {
            padding: 1.2rem 1.8rem !important;
          }
          
          .booking-detail-modal .modal-body {
            padding: 1.5rem 1.8rem !important;
            max-height: 60vh !important;
            overflow-y: auto !important;
          }
          
          .bookings-modal .modal-dialog {
            max-width: 95% !important;
            margin: 1rem auto !important;
          }
          
          .bookings-modal .modal-content {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(124, 58, 237, 0.9)) !important;
          }
          
          .bookings-modal .modal-header {
            background: transparent !important;
            color: white !important;
            border: none !important;
            padding: 1.5rem 2rem !important;
            border-radius: 24px 24px 0 0 !important;
          }
          
          .bookings-modal .modal-body {
            background: rgba(255, 255, 255, 0.98) !important;
            max-height: 70vh !important;
            overflow-y: auto !important;
            padding: 2rem !important;
          }
          
          .booking-card {
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 20px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15) !important;
            margin-bottom: 1rem !important;
          }
          
          .booking-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 15px 45px rgba(31, 38, 135, 0.2) !important;
            border: 1px solid rgba(120, 119, 198, 0.3) !important;
          }
          
          .card-body-content {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding: 1.25rem !important;
          }
          
          .card-content-section {
            flex-shrink: 0 !important;
          }
          
          .card-actions-section {
            margin-top: auto !important;
            padding-top: 1rem !important;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.75rem;
            box-shadow: 0 4px 20px rgba(31, 38, 135, 0.15);
            backdrop-filter: blur(10px);
          }
          
          .dashboard-header-card {
            padding: 1.5rem !important;
          }
          
          .dashboard-header-content {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          
          .dashboard-icon {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.85)) !important;
            border-radius: 20px !important;
            padding: 15px !important;
            color: white !important;
            margin-right: 20px !important;
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.35) !important;
            backdrop-filter: blur(20px) !important;
          }
          
          .dashboard-title {
            font-weight: 700 !important;
            color: #1e293b !important;
            font-size: 1.75rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .dashboard-subtitle {
            color: #64748b !important;
            font-size: 1rem !important;
            margin-bottom: 0 !important;
          }
          
          .add-property-btn {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.85)) !important;
            color: white !important;
            font-size: 0.95rem !important;
            padding: 0.8rem 1.8rem !important;
            border-radius: 18px !important;
            border: none !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .add-property-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4) !important;
          }

          .badge-purple-gradient {
            background: linear-gradient(135deg, #8b5cf6, #a855f7) !important;
            color: white !important;
            border: 1px solid rgba(139, 92, 246, 0.3) !important;
            border-radius: 20px !important;
            padding: 0.35rem 0.9rem !important;
            font-weight: 600 !important;
            font-size: 0.65rem !important;
            backdrop-filter: blur(20px) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2) !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 28px !important;
          }

          .status-badge-purple {
            background: linear-gradient(135deg, #8b5cf6, #a855f7) !important;
            color: white !important;
            border: 1px solid rgba(139, 92, 246, 0.3) !important;
            border-radius: 12px !important;
            padding: 0.3rem 0.7rem !important;
            font-weight: 600 !important;
            font-size: 0.75rem !important;
            text-transform: capitalize !important;
            backdrop-filter: blur(10px) !important;
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row>
          <Col>
            {/* PROPERTY DASHBOARD HEADER */}
            <div className="mb-4">
              <Card className="stats-card dashboard-header-card">
                <Card.Body>
                  <div className="dashboard-header-content">
                    <div className="d-flex align-items-center">
                      <div className="dashboard-icon">
                        <Icon name="home" size={28} />
                      </div>
                      <div>
                        <h2 className="dashboard-title">Property Dashboard</h2>
                        <p className="dashboard-subtitle">Manage all your listed properties and track bookings</p>
                      </div>
                    </div>
                    <Button 
                      as={Link} 
                      to="/add-property" 
                      className="add-property-btn"
                    >
                      <Icon name="plus" size={18} />
                      Add New Property
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Alerts */}
            {success && (
              <Alert 
                variant="success" 
                dismissible 
                onClose={() => setSuccess('')}
                style={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#16a34a',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
                }}
              >
                <Icon name="checkCircle" size={16} className="me-2" />
                {success}
              </Alert>
            )}
            
            {error && (
              <Alert 
                variant="danger" 
                dismissible 
                onClose={() => setError('')}
                style={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)'
                }}
              >
                <Icon name="xCircle" size={16} className="me-2" />
                {error}
              </Alert>
            )}

            {/* Empty State */}
            {properties.length === 0 ? (
              <Card className="text-center py-5 stats-card">
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
                      borderRadius: '50%',
                      padding: '3rem',
                      display: 'inline-block',
                      marginBottom: '2rem',
                      backdropFilter: 'blur(20px)'
                    }}>
                      <Icon name="home" size={80} style={{ color: '#9ca3af' }} />
                    </div>
                  </div>
                  <h4 style={{ fontWeight: '700', color: '#374151', marginBottom: '1rem', fontSize: '1.5rem' }}>
                    No Properties Listed Yet
                  </h4>
                  <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Start your property rental business by adding your first property!
                  </p>
                  <Button 
                    as={Link} 
                    to="/add-property" 
                    className="action-button"
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.8))',
                      color: 'white',
                      fontSize: '1.2rem',
                      padding: '1.2rem 2.5rem'
                    }}
                  >
                    <Icon name="plus" size={24} />
                    Add Your First Property
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* PROPERTY CARDS - WITH LARGE IMAGES */}
                <Row className="g-4 mb-4">
                  {properties.map((property) => (
                    <Col key={property._id} lg={6} xl={4}>
                      <Card className="property-card">
                        <div style={{ 
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '24px 24px 0 0'
                        }}>
                          <Card.Img 
                            variant="top" 
                            src={getImageUrl(property.images && property.images.length > 0 ? property.images[0] : property.image)} 
                            className="property-image"
                            alt={property.title}
                          />
                          {property.images && property.images.length > 1 && (
                            <Badge 
                              style={{ 
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '0.4rem 0.8rem',
                                fontWeight: '600',
                                fontSize: '0.7rem',
                                backdropFilter: 'blur(20px)'
                              }}
                            >
                              📸 {property.images.length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="card-body-content">
                          <div className="card-content-section">
                            <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between" style={{ minHeight: '32px', gap: '0.5rem' }}>
                              <div className="d-flex flex-wrap align-items-center" style={{ gap: '0.5rem' }}>
                                <span className="badge-purple-gradient">
                                  {property.category}
                                </span>
                                {property.subtype && (
                                  <span className="badge-purple-gradient">
                                    {property.subtype}
                                  </span>
                                )}
                              </div>
                              <div>
                                {getStatusBadge(property)}
                              </div>
                            </div>
                            
                            {/* Title Section */}
                            <Card.Title 
                              className="mb-2" 
                              style={{ 
                                fontWeight: '700', 
                                color: '#1e293b',
                                fontSize: '1rem',
                                lineHeight: '1.3',
                                height: '28px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                textAlign: 'left'
                              }}
                            >
                              {property.title}
                            </Card.Title>
                            
                            {/* Location Section */}
                            <div className="mb-2 d-flex align-items-center justify-content-start" style={{ color: '#64748b' }}>
                              <Icon name="mapPin" size={14} className="me-1" />
                              <span style={{ 
                                fontSize: '0.8rem', 
                                fontWeight: '500',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {property.address.city}, {property.address.state}
                              </span>
                            </div>
                            
                            {/* Description Section */}
                            <Card.Text 
                              className="mb-2" 
                              style={{ 
                                height: '32px',
                                color: '#64748b',
                                fontSize: '0.75rem',
                                lineHeight: '1.4',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                textAlign: 'left'
                              }}
                            >
                              {property.description}
                            </Card.Text>
                            
                            {/* Price and Size Row */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div style={{
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '16px',
                                padding: '0.4rem 0.8rem',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                backdropFilter: 'blur(10px)'
                              }}>
                                {formatPrice(property.price, property.rentType[0])}
                              </div>
                              <span style={{ 
                                color: '#64748b',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.08))',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '12px',
                                backdropFilter: 'blur(10px)'
                              }}>
                                📐 {property.size}
                              </span>
                            </div>
                            
                            {/* Date Section */}
                            <div className="mb-2 d-flex align-items-center" style={{ 
                              fontSize: '0.7rem',
                              color: '#9ca3af',
                              background: 'rgba(248, 250, 252, 0.5)',
                              border: '1px solid rgba(248, 250, 252, 0.8)',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '10px',
                              backdropFilter: 'blur(10px)'
                            }}>
                              <Icon name="calendar" size={10} className="me-1" />
                              Added {formatDate(property.createdAt)}
                            </div>
                          </div>
                          
                          {/* BUTTONS SECTION */}
                          <div className="card-actions-section">
                            <div className="d-grid gap-2">
                              {/* Primary Booking Button */}
                              <Button 
                                variant="primary"
                                size="sm" 
                                className="action-button"
                                onClick={() => viewPropertyBookings(property)}
                                style={{ 
                                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.8))',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.6rem 1rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '16px',
                                  fontWeight: '600'
                                }}
                              >
                                <Icon name="calendar" size={14} />
                                View Bookings
                              </Button>
                              
                              {/* Secondary Actions */}
                              <div className="row g-2">
                                <div className="col-6">
                                  <Button 
                                    as={Link} 
                                    to={`/property/${property._id}`}
                                    variant="outline-primary" 
                                    size="sm"
                                    className="action-button w-100"
                                    style={{ 
                                      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(14, 165, 233, 0.10))',
                                      color: '#0ea5e9',
                                      border: '1px solid rgba(56, 189, 248, 0.25)',
                                      padding: '0.5rem 0.6rem',
                                      fontSize: '0.7rem',
                                      borderRadius: '16px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    <Icon name="eye" size={12} />
                                    View
                                  </Button>
                                </div>
                                
                                <div className="col-6">
                                  <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    className="action-button w-100"
                                    onClick={() => openEditModal(property)}
                                    style={{ 
                                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(147, 51, 234, 0.10))',
                                      color: '#a855f7',
                                      border: '1px solid rgba(168, 85, 247, 0.25)',
                                      padding: '0.5rem 0.6rem',
                                      fontSize: '0.7rem',
                                      borderRadius: '16px',
                                      fontWeight: '600'
                                    }}
                                  >
                                    <Icon name="edit" size={12} />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Status Toggle Button */}
                              {property.isDisabled ? (
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  className="action-button"
                                  onClick={() => handleEnableProperty(property._id)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(22, 163, 74, 0.10))',
                                    color: '#22c55e',
                                    border: '1px solid rgba(34, 197, 94, 0.25)',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.7rem',
                                    borderRadius: '16px',
                                    fontWeight: '600'
                                  }}
                                >
                                  <Icon name="checkCircle" size={12} />
                                  Enable Property
                                </Button>
                              ) : (
                                <Button 
                                  variant="warning" 
                                  size="sm"
                                  className="action-button"
                                  onClick={() => handleDisableProperty(property._id)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.10))',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.7rem',
                                    borderRadius: '16px',
                                    fontWeight: '600'
                                  }}
                                >
                                  <Icon name="xCircle" size={12} />
                                  Disable Property
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Properties Overview */}
                <Card className="stats-card">
                  <Card.Header style={{ 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05))',
                    border: 'none',
                    padding: '1.5rem 2rem',
                    borderRadius: '24px 24px 0 0'
                  }}>
                    <h5 className="mb-0 d-flex align-items-center" style={{ 
                      fontWeight: '700', 
                      color: '#1e293b',
                      fontSize: '1.3rem'
                    }}>
                      <Icon name="trending" size={24} className="me-3" />
                      Properties Overview
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-4">
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                            color: '#64748b'
                          }}>
                            <Icon name="buildings" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#1e293b',
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2rem'
                          }}>
                            {properties.length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0,
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            Total Properties
                          </p>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                            color: '#8b5cf6'
                          }}>
                            <Icon name="checkCircle" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#8b5cf6',
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2rem'
                          }}>
                            {properties.filter(p => !p.isDisabled).length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0,
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            Active Properties
                          </p>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                            color: '#dc2626'
                          }}>
                            <Icon name="xCircle" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#dc2626',
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2rem'
                          }}>
                            {properties.filter(p => p.isDisabled).length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0,
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            Disabled Properties
                          </p>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                            color: '#7c3aed'
                          }}>
                            <Icon name="layers" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#7c3aed',
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2rem'
                          }}>
                            {[...new Set(properties.map(p => p.category))].length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0,
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}>
                            Property Categories
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* BOOKINGS MODAL */}
      <Modal 
        show={showBookingsModal} 
        onHide={() => setShowBookingsModal(false)}
        size="xl"
        centered
        className="bookings-modal"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title className="d-flex align-items-center">
            <Icon name="calendar" size={24} className="me-2" />
            Bookings Dashboard - {selectedProperty?.title}
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowBookingsModal(false)}
            aria-label="Close"
          />
        </Modal.Header>
        
        <Modal.Body>
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
                borderRadius: '50%',
                padding: '2rem',
                display: 'inline-block'
              }}>📅</div>
              <h3 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '1rem' }}>No Bookings Yet</h3>
              <p style={{ color: '#64748b' }}>This property hasn't received any bookings yet.</p>
            </div>
          ) : (
            <div>
              <Row className="mb-4">
                <Col md={4}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.12))',
                    color: '#8b5cf6',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{bookings.length}</h3>
                    <p style={{ margin: 0, fontWeight: '600' }}>Total Bookings</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.12))',
                    color: '#10b981',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{bookings.filter(b => b.status === 'confirmed').length}</h3>
                    <p style={{ margin: 0, fontWeight: '600' }}>Confirmed</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.12))',
                    color: '#8b5cf6',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{bookings.filter(b => b.status === 'pending').length}</h3>
                    <p style={{ margin: 0, fontWeight: '600' }}>Pending</p>
                  </div>
                </Col>
              </Row>

              {/* BOOKING CARDS */}
              {bookings.map((booking) => (
                <Card key={booking._id} className="booking-card">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <div className="d-flex align-items-center mb-2">
                          <Icon name="user" size={16} className="me-2" style={{ color: '#8b5cf6' }} />
                          <h6 style={{ fontWeight: '700', color: '#1e293b', margin: 0 }}>
                            {booking.user?.name || booking.userId?.name || 'Unknown User'}
                          </h6>
                        </div>
                        <p style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          📧 {booking.user?.email || booking.userId?.email || 'No email'}
                        </p>
                        <p style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                          📞 {booking.user?.contact || booking.userId?.contact || 'No contact'}
                        </p>
                        <span className={booking.status === 'pending' ? 'status-badge-purple' : 
                                        booking.status === 'confirmed' || booking.status === 'approved' ? 
                                        'badge' : 'badge'} 
                              style={{ 
                                background: booking.status === 'confirmed' || booking.status === 'approved' ? 
                                           'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.15))' : 
                                           booking.status === 'pending' ? 
                                           'linear-gradient(135deg, #8b5cf6, #a855f7)' : 
                                           'rgba(239, 68, 68, 0.15)',
                                color: booking.status === 'confirmed' || booking.status === 'approved' ? '#10b981' : 
                                       booking.status === 'pending' ? 'white' : '#ef4444',
                                border: `1px solid ${booking.status === 'confirmed' || booking.status === 'approved' ? 'rgba(16, 185, 129, 0.3)' : 
                                                    booking.status === 'pending' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                borderRadius: '12px',
                                padding: '0.3rem 0.7rem',
                                fontWeight: '600',
                                fontSize: '0.7rem',
                                backdropFilter: 'blur(10px)',
                                textTransform: 'capitalize'
                              }}>
                          {booking.status}
                        </span>
                      </Col>
                      <Col md={6}>
                        <div className="text-end">
                          <p style={{ marginBottom: '0.3rem', fontSize: '0.85rem', color: '#64748b' }}>
                            <strong>Check-in:</strong> {formatDate(booking.checkInDate || booking.fromDate)}
                          </p>
                          <p style={{ marginBottom: '0.3rem', fontSize: '0.85rem', color: '#64748b' }}>
                            <strong>Check-out:</strong> {formatDate(booking.checkOutDate || booking.toDate)}
                          </p>
                          <p style={{ marginBottom: '0.8rem', fontSize: '1rem', color: '#1e293b', fontWeight: '700' }}>
                            <strong>₹{(booking.totalAmount || booking.totalPrice)?.toLocaleString()}</strong>
                          </p>
                          
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => openBookingDetailModal(booking)}
                              style={{
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(168, 85, 247, 0.10))',
                                color: '#8b5cf6',
                                border: '1px solid rgba(139, 92, 246, 0.25)',
                                borderRadius: '12px',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* BOOKING DETAIL MODAL */}
      <Modal 
        show={showBookingDetailModal} 
        onHide={() => setShowBookingDetailModal(false)}
        size="lg"
        centered
        className="booking-detail-modal"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title className="d-flex align-items-center" style={{ color: 'white' }}>
            <Icon name="user" size={24} className="me-2" />
            Booking Details
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowBookingDetailModal(false)}
            aria-label="Close"
          />
        </Modal.Header>
        
        <Modal.Body style={{ background: 'rgba(255, 255, 255, 0.98)' }}>
          {selectedBooking ? (
            <Row>
              <Col md={6}>
                <h5 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '1rem' }}>User Information</h5>
                <p><strong>Name:</strong> {selectedBooking.user?.name || selectedBooking.userId?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedBooking.user?.email || selectedBooking.userId?.email || 'N/A'}</p>
                <p><strong>Contact:</strong> {selectedBooking.user?.contact || selectedBooking.userId?.contact || 'N/A'}</p>
                <p><strong>Age:</strong> {selectedBooking.user?.age || selectedBooking.userId?.age || 'N/A'}</p>
              </Col>
              
              <Col md={6}>
                <h5 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '1rem' }}>Booking Information</h5>
                <p><strong>Status:</strong> 
                  <span className="ms-2" style={{ 
                    background: selectedBooking.status === 'confirmed' || selectedBooking.status === 'approved' ? 
                               'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.15))' : 
                               selectedBooking.status === 'pending' ? 
                               'linear-gradient(135deg, #8b5cf6, #a855f7)' : 
                               'rgba(239, 68, 68, 0.15)',
                    color: selectedBooking.status === 'confirmed' || selectedBooking.status === 'approved' ? '#10b981' : 
                           selectedBooking.status === 'pending' ? 'white' : '#ef4444',
                    border: `1px solid ${selectedBooking.status === 'confirmed' || selectedBooking.status === 'approved' ? 'rgba(16, 185, 129, 0.3)' : 
                                        selectedBooking.status === 'pending' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '0.3rem 0.7rem',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                    backdropFilter: 'blur(10px)',
                    display: 'inline-block'
                  }}>
                    {selectedBooking.status}
                  </span>
                </p>
                <p><strong>From:</strong> {formatDate(selectedBooking.checkInDate || selectedBooking.fromDate)}</p>
                <p><strong>To:</strong> {formatDate(selectedBooking.checkOutDate || selectedBooking.toDate)}</p>
                <p><strong>Total Price:</strong> ₹{(selectedBooking.totalAmount || selectedBooking.totalPrice)?.toLocaleString()}</p>
                <p><strong>Notes:</strong> {selectedBooking.notes || 'None'}</p>
              </Col>
              
              <Col md={12}>
                <div className="mt-4 d-flex gap-2">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <Button 
                        variant="success" 
                        onClick={() => handleOwnerBookingAction('approve', selectedBooking._id)}
                        style={{
                          borderRadius: '16px',
                          padding: '0.6rem 1.2rem',
                          fontWeight: '600'
                        }}
                      >
                        <Icon name="checkCircle" size={16} className="me-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleOwnerBookingAction('reject', selectedBooking._id)}
                        style={{
                          borderRadius: '16px',
                          padding: '0.6rem 1.2rem',
                          fontWeight: '600'
                        }}
                      >
                        <Icon name="xCircle" size={16} className="me-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {(selectedBooking.status === 'active' || selectedBooking.status === 'approved' || selectedBooking.status === 'confirmed') && (
                    <Button 
                      variant="secondary" 
                      onClick={() => handleOwnerBookingAction('end', selectedBooking._id)}
                      style={{
                        borderRadius: '16px',
                        padding: '0.6rem 1.2rem',
                        fontWeight: '600'
                      }}
                    >
                      End Booking
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          ) : (
            <p>No booking selected.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* EDIT MODAL */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        centered
        scrollable
        backdrop="static"
        style={{ position: 'fixed' }}
      >
        <Modal.Header>
          <Modal.Title className="d-flex align-items-center" style={{ color: 'white' }}>
            <Icon name="edit" size={24} className="me-2" />
            Edit Property
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowEditModal(false)}
            aria-label="Close"
          />
        </Modal.Header>
        
        <Modal.Body style={{ padding: '2rem' }}>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={editFormData.category || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subtype</Form.Label>
                  <Form.Select
                    name="subtype"
                    value={editFormData.subtype || ''}
                    onChange={handleEditInputChange}
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <option value="">Select Subtype</option>
                    {editFormData.category && categories[editFormData.category]?.subtypes?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editFormData.title || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editFormData.description || ''}
                    onChange={handleEditInputChange}
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editFormData.price || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={editFormData.size || ''}
                    onChange={handleEditInputChange}
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Rent Type * <small style={{ color: '#6b7280' }}>(Monthly/Yearly)</small></Form.Label>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(120, 119, 198, 0.2)',
                    borderRadius: '16px',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div className="mb-2">
                      <Form.Check
                        type="checkbox"
                        id="monthly"
                        label="Monthly"
                        checked={editFormData.rentType?.includes('monthly')}
                        onChange={(e) => {
                          const currentRentTypes = editFormData.rentType || [];
                          if (e.target.checked) {
                            setEditFormData({
                              ...editFormData,
                              rentType: [...currentRentTypes, 'monthly']
                            });
                          } else {
                            setEditFormData({
                              ...editFormData,
                              rentType: currentRentTypes.filter(type => type !== 'monthly')
                            });
                          }
                        }}
                        style={{
                          accentColor: '#8b5cf6'
                        }}
                      />
                    </div>
                    <div>
                      <Form.Check
                        type="checkbox"
                        id="yearly"
                        label="Yearly"
                        checked={editFormData.rentType?.includes('yearly')}
                        onChange={(e) => {
                          const currentRentTypes = editFormData.rentType || [];
                          if (e.target.checked) {
                            setEditFormData({
                              ...editFormData,
                              rentType: [...currentRentTypes, 'yearly']
                            });
                          } else {
                            setEditFormData({
                              ...editFormData,
                              rentType: currentRentTypes.filter(type => type !== 'yearly')
                            });
                          }
                        }}
                        style={{
                          accentColor: '#8b5cf6'
                        }}
                      />
                    </div>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={editFormData.address?.city || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={editFormData.address?.state || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.pincode"
                    value={editFormData.address?.pincode || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={editFormData.contact || ''}
                    onChange={handleEditInputChange}
                    required
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
              
              {editImagePreviews.length > 0 && (
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Images</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {editImagePreviews.map((preview, index) => (
                        <div key={preview.id} style={{ position: 'relative' }}>
                          <img 
                            src={preview.src} 
                            alt={preview.name}
                            style={{ 
                              width: '100px', 
                              height: '100px', 
                              objectFit: 'cover', 
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeEditImage(index)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              width: '25px',
                              height: '25px',
                              padding: 0,
                              borderRadius: '50%',
                              background: 'rgba(239, 68, 68, 0.9)',
                              border: 'none'
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              )}
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Add More Images</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditImageChange}
                    style={{
                      borderRadius: '16px',
                      border: '2px solid rgba(120, 119, 198, 0.2)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        
        <Modal.Footer style={{ border: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowEditModal(false)}
            style={{
              background: 'rgba(107, 114, 128, 0.15)',
              color: '#6b7280',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              borderRadius: '16px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            disabled={editLoading}
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.8))',
              border: 'none',
              color: 'white',
              borderRadius: '16px'
            }}
          >
            {editLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Property'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageProperties;
