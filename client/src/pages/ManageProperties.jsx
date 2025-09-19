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
      // MODERN ICONS FOR SUMMARY SECTION
      buildings: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="2" width="6" height="20" rx="1"/>
          <rect x="11" y="5" width="6" height="17" rx="1"/>
          <rect x="19" y="8" width="2" height="14"/>
          <path d="M5 4v2M15 7v2M5 10v2M15 13v2M5 16v2M15 19v2"/>
        </svg>
      ),
      checkCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      xCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <path d="m15 9-6 6M9 9l6 6"/>
        </svg>
      ),
      layers: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m12.83 2.18 8.02 4.64a1 1 0 0 1 0 1.36L12 13.82 3.15 8.18a1 1 0 0 1 0-1.36l8.02-4.64c.5-.29 1.11-.29 1.66 0z"/>
          <path d="m22 17.65-9.17 5.35a2 2 0 0 1-1.66 0L2 17.65"/>
          <path d="m22 12.65-9.17 5.35a2 2 0 0 1-1.66 0L2 12.65"/>
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
      activity: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
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
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
          }
          
          .property-image {
            height: 220px;
            object-fit: cover;
            border-radius: 16px 16px 0 0;
          }
          
          .action-button {
            border: none;
            border-radius: 12px;
            padding: 0.7rem 1.4rem;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            text-transform: none;
            letter-spacing: 0.025em;
          }
          
          .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
            transform: translateY(-6px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
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
            width: 60px;
            height: 60px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
                {/* Properties Grid */}
                <Row className="g-4 mb-4">
                  {properties.map((property) => (
                    <Col key={property._id} lg={6} xl={4}>
                      <Card className="h-100 property-card">
                        <div style={{ position: 'relative' }}>
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
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '0.5rem 1rem',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <Icon name="camera" size={14} className="me-1" />
                              {property.images.length} Photos
                            </Badge>
                          )}
                        </div>
                        
                        <Card.Body className="d-flex flex-column p-4">
                          <div className="mb-3 d-flex flex-wrap gap-2">
                            <Badge 
                              style={{ 
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '0.5rem 1rem',
                                fontWeight: '600',
                                fontSize: '0.75rem',
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
                                  borderRadius: '20px',
                                  padding: '0.5rem 1rem',
                                  fontWeight: '600',
                                  fontSize: '0.75rem',
                                  color: 'white',
                                  boxShadow: '0 2px 4px rgba(107, 114, 128, 0.3)'
                                }}
                              >
                                {property.subtype}
                              </Badge>
                            )}
                            {getStatusBadge(property)}
                          </div>
                          
                          <Card.Title className="h5 mb-3" style={{ 
                            fontWeight: '700', 
                            color: '#1e293b',
                            fontSize: '1.2rem',
                            lineHeight: '1.3'
                          }}>
                            {property.title}
                          </Card.Title>
                          
                          <div className="d-flex align-items-center mb-3" style={{ color: '#64748b' }}>
                            <Icon name="mapPin" size={18} className="me-2" />
                            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                              {property.address.city}, {property.address.state}
                            </span>
                          </div>
                          
                          <Card.Text className="text-truncate mb-4" style={{ 
                            maxHeight: '3rem', 
                            color: '#64748b',
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                          }}>
                            {property.description}
                          </Card.Text>
                          
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '0.6rem 1.2rem',
                                fontWeight: '700',
                                fontSize: '1rem',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                              }}>
                                {formatPrice(property.price, property.rentType[0])}
                              </div>
                              <span style={{ 
                                color: '#64748b',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                background: '#f1f5f9',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '12px'
                              }}>
                                📐 {property.size}
                              </span>
                            </div>
                            
                            <div className="mb-3 d-flex align-items-center" style={{ 
                              fontSize: '0.85rem',
                              color: '#9ca3af',
                              background: '#f8fafc',
                              padding: '0.5rem',
                              borderRadius: '8px'
                            }}>
                              <Icon name="calendar" size={14} className="me-2" />
                              Added on {formatDate(property.createdAt)}
                            </div>
                            
                            <div className="d-grid gap-2">
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="primary"
                                  size="sm" 
                                  className="flex-fill action-button"
                                  onClick={() => viewPropertyBookings(property)}
                                  style={{ 
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    border: 'none'
                                  }}
                                >
                                  <Icon name="calendar" size={16} />
                                  Bookings
                                </Button>
                                <Button 
                                  as={Link} 
                                  to={`/property/${property._id}`}
                                  variant="outline-secondary" 
                                  size="sm"
                                  className="flex-fill action-button"
                                  style={{ 
                                    borderColor: '#e2e8f0',
                                    color: '#64748b',
                                    background: 'rgba(255, 255, 255, 0.8)'
                                  }}
                                >
                                  <Icon name="eye" size={16} />
                                  View
                                </Button>
                              </div>
                              
                              <div className="d-flex gap-2">
                                {property.isDisabled ? (
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    className="flex-fill action-button"
                                    onClick={() => handleEnableProperty(property._id)}
                                    style={{ 
                                      background: 'linear-gradient(135deg, #10b981, #059669)',
                                      border: 'none'
                                    }}
                                  >
                                    <Icon name="checkCircle" size={16} />
                                    Enable
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="warning" 
                                    size="sm"
                                    className="flex-fill action-button"
                                    onClick={() => handleDisableProperty(property._id)}
                                    style={{ 
                                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                      border: 'none',
                                      color: 'white'
                                    }}
                                  >
                                    <Icon name="xCircle" size={16} />
                                    Disable
                                  </Button>
                                )}
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="flex-fill action-button"
                                  onClick={() => openEditModal(property)}
                                  style={{ 
                                    borderColor: '#3b82f6',
                                    color: '#3b82f6',
                                    background: 'rgba(59, 130, 246, 0.05)'
                                  }}
                                >
                                  <Icon name="edit" size={16} />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* IMPROVED Properties Summary */}
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
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                          }}>
                            <Icon name="buildings" size={28} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ 
                            color: '#3b82f6', 
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2.2rem'
                          }}>
                            {properties.length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0, 
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}>
                            Total Properties
                          </p>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)'
                          }}>
                            <Icon name="checkCircle" size={28} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ 
                            color: '#10b981', 
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2.2rem'
                          }}>
                            {properties.filter(p => !p.isDisabled).length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0, 
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}>
                            Active Properties
                          </p>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)'
                          }}>
                            <Icon name="xCircle" size={28} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ 
                            color: '#ef4444', 
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2.2rem'
                          }}>
                            {properties.filter(p => p.isDisabled).length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0, 
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}>
                            Disabled Properties
                          </p>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <div className="text-center">
                          <div className="stat-icon" style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                          }}>
                            <Icon name="layers" size={28} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ 
                            color: '#8b5cf6', 
                            fontWeight: '800', 
                            marginBottom: '0.5rem',
                            fontSize: '2.2rem'
                          }}>
                            {new Set(properties.map(p => p.category)).size}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            margin: 0, 
                            fontWeight: '600',
                            fontSize: '0.95rem'
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

        {/* ALL MODALS WITH IMPROVED STYLING - (keeping same functionality as before but with better design) */}
                {/* BOOKINGS MODAL - IMPROVED STYLING */}
        <Modal 
          show={showBookingsModal} 
          onHide={() => setShowBookingsModal(false)}
          size="lg"
          style={{ zIndex: 1050 }}
        >
          <Modal.Header 
            closeButton
            style={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem 2rem'
            }}
          >
            <Modal.Title className="d-flex align-items-center" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              <Icon name="calendar" size={24} className="me-3" />
              Bookings for {selectedProperty?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.98)' }}>
            {bookings.length === 0 ? (
              <div className="text-center py-5">
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  borderRadius: '50%',
                  padding: '2.5rem',
                  display: 'inline-block',
                  marginBottom: '2rem',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
                }}>
                  <Icon name="calendar" size={64} style={{ color: '#94a3b8' }} />
                </div>
                <h5 style={{ color: '#1e293b', marginBottom: '0.8rem', fontWeight: '700' }}>No Bookings Yet</h5>
                <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>
                  This property hasn't received any bookings yet.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h6 style={{ color: '#1e293b', fontWeight: '600', fontSize: '1.1rem' }}>
                    Total Bookings: <span style={{ color: '#3b82f6', fontWeight: '700' }}>{bookings.length}</span>
                  </h6>
                </div>
                {bookings.map((booking) => (
                  <Card 
                    key={booking._id} 
                    className="mb-3" 
                    style={{ 
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div style={{
                            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                            borderRadius: '12px',
                            padding: '0.8rem',
                            marginRight: '1rem'
                          }}>
                            <Icon name="user" size={20} style={{ color: '#475569' }} />
                          </div>
                          <div>
                            <h6 className="mb-1" style={{ fontWeight: '600', color: '#1e293b' }}>
                              {booking.userId?.name}
                            </h6>
                            <small style={{ color: '#64748b' }}>
                              {booking.userId?.email}
                            </small>
                          </div>
                        </div>
                        <Badge bg={
                          booking.status === 'pending' ? 'warning'
                          : booking.status === 'approved' ? 'success'
                          : booking.status === 'rejected' ? 'danger'
                          : booking.status === 'ended' ? 'secondary'
                          : 'info'
                        } style={{ 
                          borderRadius: '20px', 
                          padding: '0.5rem 1rem',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <Row className="g-3 mb-3">
                        <Col sm={6}>
                          <div style={{
                            background: '#f8fafc',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <small style={{ color: '#64748b', fontWeight: '500' }}>Check-in</small>
                            <div style={{ color: '#1e293b', fontWeight: '600' }}>
                              <Icon name="calendar" size={14} className="me-2" />
                              {formatDate(booking.fromDate)}
                            </div>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div style={{
                            background: '#f8fafc',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <small style={{ color: '#64748b', fontWeight: '500' }}>Check-out</small>
                            <div style={{ color: '#1e293b', fontWeight: '600' }}>
                              <Icon name="calendar" size={14} className="me-2" />
                              {formatDate(booking.toDate)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      
                      <Row className="g-3 mb-3">
                        <Col sm={6}>
                          <div style={{
                            background: '#f0fdf4',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #bbf7d0'
                          }}>
                            <small style={{ color: '#166534', fontWeight: '500' }}>Total Amount</small>
                            <div style={{ color: '#15803d', fontWeight: '700', fontSize: '1.1rem' }}>
                              ₹{booking.totalPrice?.toLocaleString()}
                            </div>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div style={{
                            background: '#f8fafc',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <small style={{ color: '#64748b', fontWeight: '500' }}>Contact</small>
                            <div style={{ color: '#1e293b', fontWeight: '600' }}>
                              {booking.userId?.contact || booking.userId?.email}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      
                      {booking.notes && (
                        <div className="mb-3" style={{
                          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                          padding: '1rem',
                          borderRadius: '12px',
                          borderLeft: '4px solid #3b82f6'
                        }}>
                          <small style={{ color: '#1e40af', fontWeight: '500' }}>
                            <strong>Customer Notes:</strong>
                          </small>
                          <p style={{ margin: '0.5rem 0 0', color: '#1e3a8a' }}>
                            {booking.notes}
                          </p>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          size="sm"
                          className="action-button"
                          as={Link}
                          to={`/owner-booking/${booking._id}`}
                          style={{ 
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            color: 'white'
                          }}
                        >
                          <Icon name="eye" size={14} />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="action-button"
                          onClick={() => openBookingDetailModal(booking)}
                          style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            color: 'white'
                          }}
                        >
                          <Icon name="user" size={14} />
                          Quick Actions
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ 
            border: 'none', 
            padding: '1.5rem 2rem',
            background: '#f8fafc',
            borderRadius: '0 0 20px 20px'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowBookingsModal(false)}
              className="action-button"
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                border: 'none',
                color: 'white'
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* BOOKING DETAIL MODAL - IMPROVED STYLING */}
        <Modal 
          show={showBookingDetailModal} 
          onHide={() => setShowBookingDetailModal(false)}
          style={{ zIndex: 1060 }}
          size="lg"
        >
          <Modal.Header 
            closeButton
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem 2rem'
            }}
          >
            <Modal.Title className="d-flex align-items-center" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              <Icon name="user" size={24} className="me-3" />
              Booking & Customer Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.98)' }}>
            {selectedBooking ? (
              <>
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      marginRight: '1rem'
                    }}>
                      <Icon name="user" size={20} style={{ color: 'white' }} />
                    </div>
                    <h5 style={{ 
                      color: '#1e293b', 
                      fontWeight: '700',
                      margin: 0,
                      fontSize: '1.2rem'
                    }}>
                      Customer Information
                    </h5>
                  </div>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <small style={{ color: '#64748b', fontWeight: '500' }}>Full Name</small>
                        <p style={{ margin: 0, color: '#1e293b', fontWeight: '700', fontSize: '1.1rem' }}>
                          {selectedBooking.userId?.name}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <small style={{ color: '#64748b', fontWeight: '500' }}>Email Address</small>
                        <p style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                          {selectedBooking.userId?.email}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <small style={{ color: '#64748b', fontWeight: '500' }}>Phone Number</small>
                        <p style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                          {selectedBooking.userId?.contact || 'Not provided'}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <small style={{ color: '#64748b', fontWeight: '500' }}>Age</small>
                        <p style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                          {selectedBooking.userId?.age || 'Not provided'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      marginRight: '1rem'
                    }}>
                      <Icon name="calendar" size={20} style={{ color: 'white' }} />
                    </div>
                    <h5 style={{ 
                      color: '#1e293b', 
                      fontWeight: '700',
                      margin: 0,
                      fontSize: '1.2rem'
                    }}>
                      Booking Details
                    </h5>
                  </div>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <small style={{ color: '#166534', fontWeight: '500' }}>Booking Status</small>
                        <div style={{ margin: 0 }}>
                          <Badge bg={
                            selectedBooking.status === 'pending' ? 'warning'
                            : selectedBooking.status === 'approved' ? 'success'
                            : selectedBooking.status === 'rejected' ? 'danger'
                            : selectedBooking.status === 'ended' ? 'secondary'
                            : 'info'
                          } style={{ 
                            borderRadius: '20px', 
                            padding: '0.5rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                          }}>
                            {selectedBooking.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #86efac'
                      }}>
                        <small style={{ color: '#166534', fontWeight: '500' }}>Total Payment</small>
                        <p style={{ margin: 0, color: '#15803d', fontWeight: '800', fontSize: '1.3rem' }}>
                          ₹{selectedBooking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #fcd34d'
                      }}>
                        <small style={{ color: '#92400e', fontWeight: '500' }}>Check-in Date</small>
                        <p style={{ margin: 0, color: '#a16207', fontWeight: '700' }}>
                          <Icon name="calendar" size={16} className="me-2" />
                          {formatDate(selectedBooking.fromDate)}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #fee2e2, #fecaca)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #f87171'
                      }}>
                        <small style={{ color: '#991b1b', fontWeight: '500' }}>Check-out Date</small>
                        <p style={{ margin: 0, color: '#b91c1c', fontWeight: '700' }}>
                          <Icon name="calendar" size={16} className="me-2" />
                          {formatDate(selectedBooking.toDate)}
                        </p>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', 
                        padding: '1rem', 
                        borderRadius: '12px',
                        border: '1px solid #93c5fd'
                      }}>
                        <small style={{ color: '#1e40af', fontWeight: '500' }}>Customer Notes</small>
                        <p style={{ margin: '0.5rem 0 0', color: '#1e3a8a', fontStyle: selectedBooking.notes ? 'normal' : 'italic' }}>
                          {selectedBooking.notes || 'No special notes provided by the customer'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center pt-3" style={{ borderTop: '2px solid #f1f5f9' }}>
                  {selectedBooking.status === 'pending' && (
                    <>
                      <Button 
                        className="action-button"
                        onClick={() => handleOwnerBookingAction('approve', selectedBooking._id)}
                        style={{ 
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          color: 'white',
                          padding: '0.8rem 1.5rem'
                        }}
                      >
                        <Icon name="checkCircle" size={18} />
                        Approve Booking
                      </Button>
                      <Button 
                        className="action-button"
                        onClick={() => handleOwnerBookingAction('reject', selectedBooking._id)}
                        style={{ 
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          border: 'none',
                          color: 'white',
                          padding: '0.8rem 1.5rem'
                        }}
                      >
                        <Icon name="xCircle" size={18} />
                        Reject Booking
                      </Button>
                    </>
                  )}
                  {(selectedBooking.status === 'active' || selectedBooking.status === 'approved') && (
                    <Button 
                      className="action-button"
                      onClick={() => handleOwnerBookingAction('end', selectedBooking._id)}
                      style={{ 
                        background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                        border: 'none',
                        color: 'white',
                        padding: '0.8rem 1.5rem'
                      }}
                    >
                      <Icon name="disable" size={18} />
                      End Booking
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <div style={{
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  padding: '2rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  <Icon name="user" size={48} style={{ color: '#9ca3af' }} />
                </div>
                <p style={{ color: '#6b7280' }}>No booking selected.</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ 
            border: 'none', 
            padding: '1.5rem 2rem',
            background: '#f8fafc',
            borderRadius: '0 0 20px 20px'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowBookingDetailModal(false)}
              className="action-button"
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                border: 'none',
                color: 'white'
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* EDIT PROPERTY MODAL - IMPROVED STYLING */}
        <Modal 
          show={showEditModal} 
          onHide={() => setShowEditModal(false)} 
          size="lg"
          style={{ zIndex: 1050 }}
        >
          <Modal.Header 
            closeButton
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              borderRadius: '20px 20px 0 0',
              padding: '1.5rem 2rem'
            }}
          >
            <Modal.Title className="d-flex align-items-center" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
              <Icon name="edit" size={24} className="me-3" />
              Edit Property Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ 
            padding: '2rem', 
            maxHeight: '75vh', 
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.98)'
          }}>
            <Form onSubmit={handleEditSubmit}>
              {/* Category and Subtype */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                      Property Category *
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={editFormData.category || ''}
                      onChange={handleEditInputChange}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '0.8rem',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    >
                      <option value="">Select Category</option>
                      {Object.keys(categories).map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                      Property Subtype {editFormData.category !== 'Event' && '*'}
                    </Form.Label>
                    <Form.Select
                      name="subtype"
                      value={editFormData.subtype || ''}
                      onChange={handleEditInputChange}
                      disabled={!editFormData.category}
                      required={editFormData.category !== 'Event'}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '0.8rem',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    >
                      <option value="">Select Subtype</option>
                      {editFormData.category && categories[editFormData.category]?.subtypes.map(subtype => (
                        <option key={subtype} value={subtype}>
                          {subtype}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Title */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                  Property Title *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editFormData.title || ''}
                  onChange={handleEditInputChange}
                  placeholder="Enter an attractive property title"
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    padding: '0.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                  Property Description *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleEditInputChange}
                  placeholder="Describe your property in detail..."
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    padding: '0.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    resize: 'vertical'
                  }}
                />
              </Form.Group>

              {/* Price and Size */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                      Rental Price (₹) *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={editFormData.price || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter rental price"
                      min="0"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '0.8rem',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                      Size/Capacity *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="size"
                      value={editFormData.size || ''}
                      onChange={handleEditInputChange}
                      placeholder="e.g., 1000 sq ft, 2 BHK, 50 people"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '0.8rem',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Rent Type */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                  Available Rental Types *
                </Form.Label>
                <div className="d-flex flex-wrap gap-3" style={{ 
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  {editFormData.category && categories[editFormData.category]?.rentTypes.map(type => (
                    <Form.Check
                      key={type}
                      type="checkbox"
                      id={`edit-rentType-${type}`}
                      label={type.charAt(0).toUpperCase() + type.slice(1)}
                      value={type}
                      checked={editFormData.rentType?.includes(type) || false}
                      onChange={(e) => {
                        const value = e.target.value;
                        const newRentTypes = e.target.checked
                          ? [...(editFormData.rentType || []), value]
                          : (editFormData.rentType || []).filter(t => t !== value);
                        setEditFormData({
                          ...editFormData,
                          rentType: newRentTypes
                        });
                      }}
                      style={{ 
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Address Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '10px',
                    padding: '0.6rem',
                    marginRight: '0.8rem'
                  }}>
                    <Icon name="mapPin" size={18} style={{ color: 'white' }} />
                  </div>
                  <h6 style={{ 
                    fontWeight: '700', 
                    color: '#1e293b',
                    margin: 0,
                    fontSize: '1.1rem'
                  }}>
                    Property Address
                  </h6>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>
                    Street Address (Optional)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={editFormData.address?.street || ''}
                    onChange={handleEditInputChange}
                    placeholder="Enter complete street address"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      padding: '0.8rem',
                      fontSize: '0.95rem'
                    }}
                  />
                </Form.Group>

                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>
                        City *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={editFormData.address?.city || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter city"
                        required
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          padding: '0.8rem',
                          fontSize: '0.95rem'
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>
                        State *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={editFormData.address?.state || ''}
                        onChange={handleEditInputChange}
                        placeholder="Enter state"
                        required
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          padding: '0.8rem',
                          fontSize: '0.95rem'
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>
                        PIN Code *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.pincode"
                        value={editFormData.address?.pincode || ''}
                        onChange={handleEditInputChange}
                        placeholder="6-digit PIN"
                        maxLength="6"
                        required
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          padding: '0.8rem',
                          fontSize: '0.95rem'
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Contact */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                  Contact Information *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={editFormData.contact || ''}
                  onChange={handleEditInputChange}
                  placeholder="Phone number or email for inquiries"
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    padding: '0.8rem',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}
                />
              </Form.Group>

              {/* Images Section */}
              <Form.Group className="mb-4">
                <Form.Label style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                  Property Images * (Maximum 5 images)
                </Form.Label>
                <div style={{
                  border: '3px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '50%',
                    padding: '1rem',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    <Icon name="upload" size={32} style={{ color: 'white' }} />
                  </div>
                  <h6 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Upload Property Photos
                  </h6>
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                    Add high-quality images to attract more customers
                  </p>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditImageChange}
                    style={{ 
                      border: 'none',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '10px',
                      padding: '0.8rem'
                    }}
                  />
                  <Form.Text style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                    Maximum file size: 5MB per image. Supported formats: JPG, PNG, WEBP
                  </Form.Text>
                </div>
                
                {editImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                        Property Photos ({editImagePreviews.length}/5)
                      </h6>
                      <Badge 
                        style={{ 
                          background: editImagePreviews.length === 5 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          borderRadius: '20px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {editImagePreviews.length}/5 Images
                      </Badge>
                    </div>
                    
                    <Row className="g-3">
                      {editImagePreviews.map((preview, index) => (
                        <Col key={preview.id} md={4} sm={6}>
                          <div style={{ 
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease'
                          }}>
                            <img 
                              src={getImageUrl(preview.src)} 
                              alt={`Property Preview ${index + 1}`} 
                              style={{ 
                                width: '100%',
                                height: '140px', 
                                objectFit: 'cover',
                                border: '3px solid #e2e8f0'
                              }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute"
                              onClick={() => removeEditImage(index)}
                              style={{
                                top: '8px',
                                right: '8px',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                border: 'none',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                zIndex: 10
                              }}
                            >
                              <Icon name="x" size={14} />
                            </Button>
                            <div className="position-absolute bottom-0 start-0 end-0" style={{
                              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                              padding: '0.5rem',
                              color: 'white'
                            }}>
                              <small style={{ 
                                fontWeight: '600',
                                fontSize: '0.75rem'
                              }}>
                                {preview.isExisting ? '📷 Current' : '🆕 New'} • Photo {index + 1}
                              </small>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ 
            border: 'none', 
            padding: '1.5rem 2rem',
            background: '#f8fafc',
            borderRadius: '0 0 20px 20px'
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              className="action-button"
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                border: 'none',
                color: 'white',
                padding: '0.8rem 1.5rem'
              }}
            >
              Cancel Changes
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={editLoading}
              className="action-button"
              style={{
                background: editLoading ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: 'white',
                padding: '0.8rem 1.5rem'
              }}
            >
              {editLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Icon name="checkCircle" size={18} />
                  Update Property
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        
      </Container>
    </div>
  );
};

export default ManageProperties;
