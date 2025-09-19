import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Alert, Form, ProgressBar, Spinner } from 'react-bootstrap';
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
      // 🔥 PROFESSIONAL MINIMAL ICONS FOR OVERVIEW
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
      // OTHER ICONS
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
      camera: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      disable: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <path d="m4.9 4.9 14.2 14.2"/>
        </svg>
      ),
      enable: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M9 12l2 2 4-4"/>
          <circle cx="12" cy="12" r="10"/>
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
      upload: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,5 17,10"/>
          <line x1="12" y1="5" x2="12" y2="15"/>
        </svg>
      ),
      trash: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="3,6 5,6 21,6"/>
          <path d="m19,6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
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
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none',
            borderRadius: '20px',
            padding: '0.4rem 0.8rem',
            fontWeight: '600',
            fontSize: '0.75rem',
            color: 'white',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
          }}
        >
          <Icon name="xCircle" size={12} className="me-1" />
          Disabled
        </Badge>
      );
    }
    return (
      <Badge 
        style={{ 
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: 'none',
          borderRadius: '20px',
          padding: '0.4rem 0.8rem',
          fontWeight: '600',
          fontSize: '0.75rem',
          color: 'white',
          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
        }}
      >
        <Icon name="checkCircle" size={12} className="me-1" />
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

      {/* FLOATING PARTICLES */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '10%',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: 'rgba(120, 119, 198, 0.6)',
        animation: 'particleFloat 8s ease-in-out infinite',
        zIndex: 1
      }} />
      
      <div style={{
        position: 'fixed',
        top: '60%',
        right: '15%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(255, 154, 158, 0.5)',
        animation: 'particleFloat 12s ease-in-out infinite reverse',
        zIndex: 1
      }} />

      <div style={{
        position: 'fixed',
        top: '80%',
        left: '80%',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        background: 'rgba(120, 119, 198, 0.4)',
        animation: 'particleFloat 10s ease-in-out infinite',
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
          
          @keyframes particleFloat {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) scale(1);
              opacity: 0.6;
            }
            25% { 
              transform: translateY(-20px) translateX(10px) scale(1.2);
              opacity: 0.8;
            }
            50% { 
              transform: translateY(-35px) translateX(-5px) scale(0.8);
              opacity: 0.4;
            }
            75% { 
              transform: translateY(-15px) translateX(-10px) scale(1.1);
              opacity: 0.9;
            }
          }
          
          .property-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none !important;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
            border-radius: 20px !important;
          }
          
          .property-card:hover {
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
          }
          
          .property-image {
            height: 200px;
            object-fit: cover;
            border-radius: 16px 16px 0 0;
          }
          
          .action-button {
            border: none;
            border-radius: 12px;
            padding: 0.6rem 1.2rem;
            font-weight: 600;
            font-size: 0.8rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-transform: none;
            letter-spacing: 0.025em;
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
          }
          
          .stats-card {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 20px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          }
          
          .stats-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          }
          
          .modal-content {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            border: none !important;
            border-radius: 20px !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
          }
          
          .form-control, .form-select {
            border-radius: 12px !important;
            border: 2px solid #e5e7eb !important;
            padding: 0.75rem 1rem !important;
            font-size: 0.9rem !important;
            transition: all 0.3s ease !important;
            background: rgba(255, 255, 255, 0.9) !important;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
            background: rgba(255, 255, 255, 1) !important;
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.75rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          
          /* 🔥 FIX MODAL SCROLL BUG */
          .modal {
            z-index: 9999 !important;
          }
          
          .modal-backdrop {
            z-index: 9998 !important;
          }
          
          body.modal-open {
            overflow: hidden !important;
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row>
          <Col>
            {/* Header Section */}
            <div className="mb-4">
              <Card className="stats-card">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '20px',
                        padding: '16px',
                        color: 'white',
                        marginRight: '24px',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                      }}>
                        <Icon name="home" size={32} />
                      </div>
                      <div>
                        <h2 className="mb-1" style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.9rem' }}>
                          Property Dashboard
                        </h2>
                        <p className="mb-0" style={{ color: '#64748b', fontSize: '1.1rem' }}>
                          Manage all your listed properties and track bookings
                        </p>
                      </div>
                    </div>
                    <Button 
                      as={Link} 
                      to="/add-property" 
                      className="action-button"
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        fontSize: '1rem',
                        padding: '0.9rem 1.8rem'
                      }}
                    >
                      <Icon name="plus" size={20} />
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
                  borderRadius: '16px', 
                  border: 'none',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                  color: '#16a34a',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
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
                  borderRadius: '16px', 
                  border: 'none',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                  color: '#dc2626',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
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
                      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                      borderRadius: '50%',
                      padding: '3rem',
                      display: 'inline-block',
                      marginBottom: '2rem'
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
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
                {/* 🔥 PERFECT FIXED PROPERTIES GRID - COMPACT & PROFESSIONAL */}
                <Row className="g-3 mb-4">
                  {properties.map((property) => (
                    <Col key={property._id} lg={6} xl={4}>
                      <Card 
                        className="h-100 property-card"
                        style={{ 
                          minHeight: '520px', // 🔥 REDUCED FROM 680px TO 520px
                          maxHeight: '520px'
                        }}
                      >
                        <div style={{ position: 'relative' }}>
                          <Card.Img 
                            variant="top" 
                            src={getImageUrl(property.images && property.images.length > 0 ? property.images[0] : property.image)} 
                            className="property-image"
                            alt={property.title}
                            style={{ 
                              height: '200px', // 🔥 REDUCED FROM 240px
                              objectFit: 'cover'
                            }}
                          />
                          {property.images && property.images.length > 1 && (
                            <Badge 
                              style={{ 
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                borderRadius: '15px',
                                padding: '0.4rem 0.8rem',
                                fontWeight: '600',
                                fontSize: '0.75rem',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <Icon name="camera" size={12} className="me-1" />
                              {property.images.length}
                            </Badge>
                          )}
                        </div>
                        
                        <Card.Body className="d-flex flex-column p-3" style={{ height: '320px' }}>
                          {/* 🏷️ BADGES SECTION - REDUCED SPACING */}
                          <div className="mb-2 d-flex flex-wrap gap-1" style={{ minHeight: '45px' }}>
                            <Badge 
                              style={{ 
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                border: 'none',
                                borderRadius: '15px',
                                padding: '0.3rem 0.8rem',
                                fontWeight: '600',
                                fontSize: '0.7rem',
                                color: 'white',
                                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                              }}
                            >
                              {property.category}
                            </Badge>
                            {property.subtype && (
                              <Badge 
                                style={{ 
                                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                                  border: 'none',
                                  borderRadius: '15px',
                                  padding: '0.3rem 0.8rem',
                                  fontWeight: '600',
                                  fontSize: '0.7rem',
                                  color: 'white',
                                  boxShadow: '0 2px 4px rgba(107, 114, 128, 0.3)'
                                }}
                              >
                                {property.subtype}
                              </Badge>
                            )}
                            {getStatusBadge(property)}
                          </div>
                          
                          {/* 📝 TITLE SECTION - REDUCED SPACING */}
                          <Card.Title 
                            className="h6 mb-2" 
                            style={{ 
                              fontWeight: '700', 
                              color: '#1e293b',
                              fontSize: '1.1rem',
                              lineHeight: '1.3',
                              height: '32px', // 🔥 REDUCED HEIGHT
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {property.title}
                          </Card.Title>
                          
                          {/* 📍 LOCATION SECTION - REDUCED SPACING */}
                          <div className="d-flex align-items-center mb-2" style={{ color: '#64748b' }}>
                            <Icon name="mapPin" size={16} className="me-2" />
                            <span style={{ 
                              fontSize: '0.85rem', 
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {property.address.city}, {property.address.state}
                            </span>
                          </div>
                          
                          {/* 📄 DESCRIPTION SECTION - REDUCED SPACING */}
                          <Card.Text 
                            className="mb-2" 
                            style={{ 
                              height: '36px', // 🔥 REDUCED HEIGHT
                              color: '#64748b',
                              fontSize: '0.8rem',
                              lineHeight: '1.4',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {property.description}
                          </Card.Text>
                          
                          {/* 💰 PRICE AND SIZE ROW - REDUCED SPACING */}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              borderRadius: '15px',
                              padding: '0.4rem 1rem',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              boxShadow: '0 3px 8px rgba(16, 185, 129, 0.3)'
                            }}>
                              {formatPrice(property.price, property.rentType[0])}
                            </div>
                            <span style={{ 
                              color: '#64748b',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              background: '#f1f5f9',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '10px'
                            }}>
                              📐 {property.size}
                            </span>
                          </div>
                          
                          {/* 📅 DATE SECTION - REDUCED SPACING */}
                          <div className="mb-2 d-flex align-items-center" style={{ 
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            background: '#f8fafc',
                            padding: '0.4rem',
                            borderRadius: '6px'
                          }}>
                            <Icon name="calendar" size={12} className="me-1" />
                            Added {formatDate(property.createdAt)}
                          </div>
                          
                          {/* 🎯 COMPACT BUTTONS SECTION */}
                          <div className="mt-auto">
                            <div className="d-grid gap-2">
                              {/* Primary action button - REDUCED SIZE */}
                              <Button 
                                variant="primary"
                                size="sm" 
                                className="action-button"
                                onClick={() => viewPropertyBookings(property)}
                                style={{ 
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.75rem'
                                }}
                              >
                                <Icon name="calendar" size={14} />
                                Bookings
                              </Button>
                              
                              {/* Secondary actions row - REDUCED SIZE */}
                              <div className="d-flex gap-1">
                                <Button 
                                  as={Link} 
                                  to={`/property/${property._id}`}
                                  variant="outline-secondary" 
                                  size="sm"
                                  className="flex-fill action-button"
                                  style={{ 
                                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  <Icon name="eye" size={12} />
                                  View
                                </Button>
                                
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="flex-fill action-button"
                                  onClick={() => openEditModal(property)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  <Icon name="edit" size={12} />
                                  Edit
                                </Button>
                              </div>
                              
                              {/* Status toggle button - REDUCED SIZE */}
                              {property.isDisabled ? (
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  className="action-button"
                                  onClick={() => handleEnableProperty(property._id)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    border: 'none',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  <Icon name="checkCircle" size={12} />
                                  Enable
                                </Button>
                              ) : (
                                <Button 
                                  variant="warning" 
                                  size="sm"
                                  className="action-button"
                                  onClick={() => handleDisableProperty(property._id)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  <Icon name="xCircle" size={12} />
                                  Disable
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* 🔥 FIXED PROFESSIONAL PROPERTIES OVERVIEW */}
                <Card className="stats-card">
                  <Card.Header style={{ 
                    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                    border: 'none',
                    padding: '1.5rem 2rem',
                    borderRadius: '20px 20px 0 0'
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
                            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', // 🔥 PROFESSIONAL GRAY
                            color: '#64748b'
                          }}>
                            <Icon name="buildings" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#1e293b', // 🔥 PROFESSIONAL DARK GRAY
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
                            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', // 🔥 SUBTLE GREEN
                            color: '#16a34a'
                          }}>
                            <Icon name="checkCircle" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#16a34a', // 🔥 PROFESSIONAL GREEN
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
                            background: 'linear-gradient(135deg, #fef2f2, #fecaca)', // 🔥 SUBTLE RED
                            color: '#dc2626'
                          }}>
                            <Icon name="xCircle" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#dc2626', // 🔥 PROFESSIONAL RED
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
                            background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', // 🔥 SUBTLE PURPLE
                            color: '#7c3aed'
                          }}>
                            <Icon name="layers" size={24} />
                          </div>
                          <h3 style={{ 
                            color: '#7c3aed', // 🔥 PROFESSIONAL PURPLE
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

      {/* 📊 BOOKINGS MODAL */}
      <Modal 
        show={showBookingsModal} 
        onHide={() => setShowBookingsModal(false)}
        size="xl"
        centered
        className="modal-content"
        backdrop="static" // 🔥 FIX SCROLL BUG
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Modal.Title className="d-flex align-items-center">
            <Icon name="calendar" size={24} className="me-2" />
            Bookings Dashboard - {selectedProperty?.title}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '2rem' }}>
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
              <h3>No Bookings Yet</h3>
              <p>This property hasn't received any bookings yet.</p>
            </div>
          ) : (
            <div>
              <Row className="mb-4">
                <Col md={4}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <h3>{bookings.length}</h3>
                    <p>Total Bookings</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <h3>{bookings.filter(b => b.status === 'confirmed').length}</h3>
                    <p>Confirmed</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    textAlign: 'center'
                  }}>
                    <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
                    <p>Pending</p>
                  </div>
                </Col>
              </Row>

              {bookings.map((booking) => (
                <Card key={booking._id} className="mb-3" style={{ borderRadius: '15px' }}>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6>{booking.user?.name || 'Unknown User'}</h6>
                        <p>{booking.user?.email || 'No email'}</p>
                        <Badge bg={booking.status === 'confirmed' ? 'success' : 'warning'}>
                          {booking.status}
                        </Badge>
                      </Col>
                      <Col md={6}>
                        <p><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</p>
                        <p><strong>Check-out:</strong> {formatDate(booking.checkOutDate)}</p>
                        <p><strong>Amount:</strong> ₹{booking.totalAmount?.toLocaleString()}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer style={{ border: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowBookingsModal(false)}
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: 'none',
              borderRadius: '10px'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✏️ EDIT MODAL - FIXED SCROLL BUG */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        centered
        className="modal-content"
        backdrop="static" // 🔥 FIX SCROLL BUG
        scrollable // 🔥 ENABLE MODAL INTERNAL SCROLL
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '20px 20px 0 0'
          }}
        >
          <Modal.Title className="d-flex align-items-center">
            <Icon name="edit" size={24} className="me-2" />
            Edit Property
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editFormData.title || ''}
                    onChange={handleEditInputChange}
                    required
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
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹/month) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editFormData.price || ''}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={editFormData.size || ''}
                    onChange={handleEditInputChange}
                  />
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
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={editFormData.contact || ''}
                    onChange={handleEditInputChange}
                    required
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
                              borderRadius: '8px' 
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
                              borderRadius: '50%'
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
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: 'none',
              borderRadius: '10px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            disabled={editLoading}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              color: 'white',
              borderRadius: '10px'
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
