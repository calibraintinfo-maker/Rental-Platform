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

  // SVG Icons Component
  const Icon = ({ name, size = 20, className = '' }) => {
    const icons = {
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
          bg="danger" 
          style={{ 
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            border: 'none',
            borderRadius: '20px',
            padding: '0.4rem 0.8rem',
            fontWeight: '500'
          }}
        >
          <Icon name="disable" size={12} className="me-1" />
          Disabled
        </Badge>
      );
    }
    return (
      <Badge 
        bg="success" 
        style={{ 
          background: 'linear-gradient(135deg, #51cf66, #40c057)',
          border: 'none',
          borderRadius: '20px',
          padding: '0.4rem 0.8rem',
          fontWeight: '500'
        }}
      >
        <Icon name="check" size={12} className="me-1" />
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
            transition: all 0.3s ease;
            border: none !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
          }
          
          .property-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
          }
          
          .property-image {
            height: 200px;
            object-fit: cover;
            border-radius: 12px 12px 0 0;
          }
          
          .action-button {
            border: none;
            border-radius: 10px;
            padding: 0.6rem 1.2rem;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .stats-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 16px;
            transition: all 0.3s ease;
          }
          
          .stats-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .modal-content {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            border: none !important;
            border-radius: 16px !important;
          }
          
          .form-control, .form-select {
            border-radius: 8px !important;
            border: 1px solid #e5e7eb !important;
            transition: all 0.2s ease !important;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25) !important;
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
                        borderRadius: '16px',
                        padding: '12px',
                        color: 'white',
                        marginRight: '20px'
                      }}>
                        <Icon name="home" size={28} />
                      </div>
                      <div>
                        <h2 className="mb-1" style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.8rem' }}>
                          Property Dashboard
                        </h2>
                        <p className="mb-0" style={{ color: '#64748b', fontSize: '1rem' }}>
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
                        padding: '0.8rem 1.5rem'
                      }}
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
                  borderRadius: '12px', 
                  border: 'none',
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#16a34a',
                  marginBottom: '1.5rem'
                }}
              >
                <Icon name="check" size={16} className="me-2" />
                {success}
              </Alert>
            )}
            
            {error && (
              <Alert 
                variant="danger" 
                dismissible 
                onClose={() => setError('')}
                style={{ 
                  borderRadius: '12px', 
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  marginBottom: '1.5rem'
                }}
              >
                <Icon name="x" size={16} className="me-2" />
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
                      padding: '2rem',
                      display: 'inline-block',
                      marginBottom: '2rem'
                    }}>
                      <Icon name="home" size={64} style={{ color: '#9ca3af' }} />
                    </div>
                  </div>
                  <h4 style={{ fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
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
                      fontSize: '1.1rem',
                      padding: '1rem 2rem'
                    }}
                  >
                    <Icon name="plus" size={20} />
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
                      <Card className="h-100 property-card" style={{ borderRadius: '16px' }}>
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
                                top: '12px',
                                right: '12px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '0.4rem 0.8rem'
                              }}
                            >
                              <Icon name="camera" size={12} className="me-1" />
                              {property.images.length}
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
                                padding: '0.4rem 0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              {property.category}
                            </Badge>
                            {property.subtype && (
                              <Badge 
                                bg="secondary"
                                style={{ 
                                  borderRadius: '20px',
                                  padding: '0.4rem 0.8rem',
                                  fontWeight: '500'
                                }}
                              >
                                {property.subtype}
                              </Badge>
                            )}
                            {getStatusBadge(property)}
                          </div>
                          
                          <Card.Title className="h5 mb-2" style={{ fontWeight: '600', color: '#374151' }}>
                            {property.title}
                          </Card.Title>
                          
                          <div className="d-flex align-items-center mb-2" style={{ color: '#6b7280' }}>
                            <Icon name="mapPin" size={16} className="me-2" />
                            <span style={{ fontSize: '0.9rem' }}>
                              {property.address.city}, {property.address.state}
                            </span>
                          </div>
                          
                          <Card.Text className="text-truncate mb-3" style={{ 
                            maxHeight: '3rem', 
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            {property.description}
                          </Card.Text>
                          
                          <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '0.5rem 1rem',
                                fontWeight: '600'
                              }}>
                                {formatPrice(property.price, property.rentType[0])}
                              </div>
                              <small style={{ color: '#6b7280' }}>
                                📐 {property.size}
                              </small>
                            </div>
                            
                            <small className="text-muted d-block mb-3" style={{ fontSize: '0.8rem' }}>
                              <Icon name="calendar" size={12} className="me-1" />
                              Added on {formatDate(property.createdAt)}
                            </small>
                            
                            <div className="d-grid gap-2">
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="flex-fill action-button"
                                  onClick={() => viewPropertyBookings(property)}
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  <Icon name="calendar" size={14} />
                                  View Bookings
                                </Button>
                                <Button 
                                  as={Link} 
                                  to={`/property/${property._id}`}
                                  variant="outline-secondary" 
                                  size="sm"
                                  className="flex-fill action-button"
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  <Icon name="eye" size={14} />
                                  View Details
                                </Button>
                              </div>
                              
                              <div className="d-flex gap-2">
                                {property.isDisabled ? (
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    className="flex-fill action-button"
                                    onClick={() => handleEnableProperty(property._id)}
                                    style={{ fontSize: '0.85rem' }}
                                  >
                                    <Icon name="enable" size={14} />
                                    Enable
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="warning" 
                                    size="sm"
                                    className="flex-fill action-button"
                                    onClick={() => handleDisableProperty(property._id)}
                                    style={{ fontSize: '0.85rem' }}
                                  >
                                    <Icon name="disable" size={14} />
                                    Disable
                                  </Button>
                                )}
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="flex-fill action-button"
                                  onClick={() => openEditModal(property)}
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  <Icon name="edit" size={14} />
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

                {/* Properties Summary */}
                <Card className="stats-card">
                  <Card.Header style={{ 
                    background: 'transparent', 
                    border: 'none',
                    padding: '1.5rem 1.5rem 0'
                  }}>
                    <h5 className="mb-0 d-flex align-items-center" style={{ fontWeight: '600', color: '#374151' }}>
                      <Icon name="trending" size={20} className="me-2" />
                      Properties Summary
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="text-center">
                      <Col md={3}>
                        <div className="mb-2">
                          <div style={{
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            borderRadius: '50%',
                            padding: '1rem',
                            display: 'inline-block',
                            marginBottom: '1rem'
                          }}>
                            <Icon name="home" size={24} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ color: '#3b82f6', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {properties.length}
                          </h3>
                          <p style={{ color: '#6b7280', margin: 0, fontWeight: '500' }}>Total Properties</p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="mb-2">
                          <div style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '50%',
                            padding: '1rem',
                            display: 'inline-block',
                            marginBottom: '1rem'
                          }}>
                            <Icon name="check" size={24} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ color: '#10b981', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {properties.filter(p => !p.isDisabled).length}
                          </h3>
                          <p style={{ color: '#6b7280', margin: 0, fontWeight: '500' }}>Active</p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="mb-2">
                          <div style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            borderRadius: '50%',
                            padding: '1rem',
                            display: 'inline-block',
                            marginBottom: '1rem'
                          }}>
                            <Icon name="disable" size={24} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ color: '#ef4444', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {properties.filter(p => p.isDisabled).length}
                          </h3>
                          <p style={{ color: '#6b7280', margin: 0, fontWeight: '500' }}>Disabled</p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="mb-2">
                          <div style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            borderRadius: '50%',
                            padding: '1rem',
                            display: 'inline-block',
                            marginBottom: '1rem'
                          }}>
                            <Icon name="activity" size={24} style={{ color: 'white' }} />
                          </div>
                          <h3 style={{ color: '#8b5cf6', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {new Set(properties.map(p => p.category)).size}
                          </h3>
                          <p style={{ color: '#6b7280', margin: 0, fontWeight: '500' }}>Categories</p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>

        {/* BOOKINGS MODAL - FULL STYLED */}
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
              borderRadius: '16px 16px 0 0'
            }}
          >
            <Modal.Title className="d-flex align-items-center">
              <Icon name="calendar" size={20} className="me-2" />
              Bookings for {selectedProperty?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '1.5rem' }}>
            {bookings.length === 0 ? (
              <div className="text-center py-4">
                <div style={{
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  padding: '2rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  <Icon name="calendar" size={48} style={{ color: '#9ca3af' }} />
                </div>
                <h5 style={{ color: '#374151', marginBottom: '0.5rem' }}>No Bookings Yet</h5>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  This property hasn't received any bookings yet.
                </p>
              </div>
            ) : (
              <div>
                {bookings.map((booking) => (
                  <Card 
                    key={booking._id} 
                    className="mb-3" 
                    style={{ 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="mb-0 d-flex align-items-center">
                          <Icon name="user" size={16} className="me-2" />
                          {booking.userId?.name}
                        </h6>
                        <Badge bg={
                          booking.status === 'pending' ? 'warning'
                          : booking.status === 'approved' ? 'success'
                          : booking.status === 'rejected' ? 'danger'
                          : booking.status === 'ended' ? 'secondary'
                          : 'info'
                        } style={{ borderRadius: '20px', padding: '0.4rem 0.8rem' }}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <Row>
                        <Col sm={6}>
                          <div className="mb-2">
                            <small style={{ color: '#6b7280', fontWeight: '500' }}>
                              <Icon name="calendar" size={12} className="me-1" />
                              From: {formatDate(booking.fromDate)}
                            </small>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-2">
                            <small style={{ color: '#6b7280', fontWeight: '500' }}>
                              <Icon name="calendar" size={12} className="me-1" />
                              To: {formatDate(booking.toDate)}
                            </small>
                          </div>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col sm={6}>
                          <div className="mb-2">
                            <small style={{ color: '#6b7280' }}>
                              Contact: {booking.userId?.contact || booking.userId?.email}
                            </small>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-2">
                            <small style={{ color: '#6b7280', fontWeight: '500' }}>
                              Total: ₹{booking.totalPrice?.toLocaleString()}
                            </small>
                          </div>
                        </Col>
                      </Row>
                      
                      {booking.notes && (
                        <div className="mb-3" style={{
                          background: '#f9fafb',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          borderLeft: '4px solid #3b82f6'
                        }}>
                          <small style={{ color: '#374151' }}>
                            <strong>Notes:</strong> {booking.notes}
                          </small>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          as={Link}
                          to={`/owner-booking/${booking._id}`}
                          className="action-button"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <Icon name="eye" size={12} />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-info"
                          className="action-button"
                          onClick={() => openBookingDetailModal(booking)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          <Icon name="user" size={12} />
                          Quick Actions
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', padding: '1rem 1.5rem' }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowBookingsModal(false)}
              className="action-button"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* BOOKING DETAIL MODAL - FULL STYLED */}
        <Modal 
          show={showBookingDetailModal} 
          onHide={() => setShowBookingDetailModal(false)}
          style={{ zIndex: 1060 }}
        >
          <Modal.Header 
            closeButton
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <Modal.Title className="d-flex align-items-center">
              <Icon name="user" size={20} className="me-2" />
              Booking & User Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '1.5rem' }}>
            {selectedBooking ? (
              <>
                <div className="mb-4">
                  <h5 className="mb-3" style={{ 
                    color: '#374151', 
                    fontWeight: '600',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '0.5rem'
                  }}>
                    <Icon name="user" size={18} className="me-2" />
                    User Information
                  </h5>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Name</small>
                        <p style={{ margin: 0, color: '#374151', fontWeight: '600' }}>
                          {selectedBooking.userId?.name}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Email</small>
                        <p style={{ margin: 0, color: '#374151', fontWeight: '600' }}>
                          {selectedBooking.userId?.email}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Contact</small>
                        <p style={{ margin: 0, color: '#374151', fontWeight: '600' }}>
                          {selectedBooking.userId?.contact || 'N/A'}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Age</small>
                        <p style={{ margin: 0, color: '#374151', fontWeight: '600' }}>
                          {selectedBooking.userId?.age || 'N/A'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="mb-4">
                  <h5 className="mb-3" style={{ 
                    color: '#374151', 
                    fontWeight: '600',
                    borderBottom: '2px solid #e5e7eb',
                    paddingBottom: '0.5rem'
                  }}>
                    <Icon name="calendar" size={18} className="me-2" />
                    Booking Information
                  </h5>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Status</small>
                        <p style={{ margin: 0 }}>
                          <Badge bg={
                            selectedBooking.status === 'pending' ? 'warning'
                            : selectedBooking.status === 'approved' ? 'success'
                            : selectedBooking.status === 'rejected' ? 'danger'
                            : selectedBooking.status === 'ended' ? 'secondary'
                            : 'info'
                          } style={{ borderRadius: '20px', padding: '0.4rem 0.8rem' }}>
                            {selectedBooking.status.toUpperCase()}
                          </Badge>
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Total Price</small>
                        <p style={{ margin: 0, color: '#10b981', fontWeight: '700', fontSize: '1.1rem' }}>
                          ₹{selectedBooking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>From Date</small>
                        <p style={{ margin: 0, color: '#374151', fontWeight: '600' }}>
                          {formatDate(selectedBooking.fromDate)}
                        </p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>To Date</small>
                        <p style={{ margin: 0, color: '#374151', fontWeight: '600' }}>
                          {formatDate(selectedBooking.toDate)}
                        </p>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div style={{ 
                        background: '#f9fafb', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <small style={{ color: '#6b7280', fontWeight: '500' }}>Notes</small>
                        <p style={{ margin: 0, color: '#374151' }}>
                          {selectedBooking.notes || 'No notes provided'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 justify-content-center">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <Button 
                        variant="success" 
                        className="action-button"
                        onClick={() => handleOwnerBookingAction('approve', selectedBooking._id)}
                      >
                        <Icon name="check" size={16} />
                        Approve Booking
                      </Button>
                      <Button 
                        variant="danger" 
                        className="action-button"
                        onClick={() => handleOwnerBookingAction('reject', selectedBooking._id)}
                      >
                        <Icon name="x" size={16} />
                        Reject Booking
                      </Button>
                    </>
                  )}
                  {(selectedBooking.status === 'active' || selectedBooking.status === 'approved') && (
                    <Button 
                      variant="secondary" 
                      className="action-button"
                      onClick={() => handleOwnerBookingAction('end', selectedBooking._id)}
                    >
                      <Icon name="disable" size={16} />
                      End Booking
                    </Button>
                  )}
                </div>

                {error && (
                  <Alert 
                    variant="danger" 
                    className="mt-3"
                    style={{ borderRadius: '8px', border: 'none' }}
                  >
                    <Icon name="x" size={16} className="me-2" />
                    {error}
                  </Alert>
                )}
              </>
            ) : (
              <p>No booking selected.</p>
            )}
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', padding: '1rem 1.5rem' }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowBookingDetailModal(false)}
              className="action-button"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* EDIT PROPERTY MODAL - FULL STYLED */}
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
              borderRadius: '16px 16px 0 0'
            }}
          >
            <Modal.Title className="d-flex align-items-center">
              <Icon name="edit" size={20} className="me-2" />
              Edit Property
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
            <Form onSubmit={handleEditSubmit}>
              {/* Category and Subtype */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      Category *
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={editFormData.category || ''}
                      onChange={handleEditInputChange}
                      required
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
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      Subtype {editFormData.category !== 'Event' && '*'}
                    </Form.Label>
                    <Form.Select
                      name="subtype"
                      value={editFormData.subtype || ''}
                      onChange={handleEditInputChange}
                      disabled={!editFormData.category}
                      required={editFormData.category !== 'Event'}
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
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                  Property Title *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editFormData.title || ''}
                  onChange={handleEditInputChange}
                  placeholder="Enter property title"
                  required
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                  Description *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleEditInputChange}
                  placeholder="Describe your property"
                  required
                />
              </Form.Group>

              {/* Price and Size */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      Price (₹) *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={editFormData.price || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter price"
                      min="0"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      Size/Capacity *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="size"
                      value={editFormData.size || ''}
                      onChange={handleEditInputChange}
                      placeholder="e.g., 1000 sq ft, 2 BHK"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Rent Type */}
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                  Rent Type *
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
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
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Address */}
              <h6 className="mb-3" style={{ 
                fontWeight: '600', 
                color: '#374151',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                <Icon name="mapPin" size={16} className="me-2" />
                Address Information
              </h6>
              
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                  Street Address
                </Form.Label>
                <Form.Control
                  type="text"
                  name="address.street"
                  value={editFormData.address?.street || ''}
                  onChange={handleEditInputChange}
                  placeholder="Enter street address"
                />
              </Form.Group>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      City *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address.city"
                      value={editFormData.address?.city || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter city"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      State *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address.state"
                      value={editFormData.address?.state || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter state"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                      Pincode *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address.pincode"
                      value={editFormData.address?.pincode || ''}
                      onChange={handleEditInputChange}
                      placeholder="Enter pincode"
                      maxLength="6"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Contact */}
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                  Contact Information *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={editFormData.contact || ''}
                  onChange={handleEditInputChange}
                  placeholder="Enter contact number or email"
                  required
                />
              </Form.Group>

              {/* Images */}
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                  Property Images * (Maximum 5 images)
                </Form.Label>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                  background: '#f9fafb'
                }}>
                  <Icon name="upload" size={24} />
                  <p className="mt-2 mb-2" style={{ color: '#6b7280', margin: 0 }}>
                    Add more images or replace existing ones
                  </p>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditImageChange}
                    style={{ marginTop: '0.5rem' }}
                  />
                  <Form.Text className="text-muted">
                    Maximum file size: 5MB per image.
                  </Form.Text>
                </div>
                
                {editImagePreviews.length > 0 && (
                  <div className="mt-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 style={{ fontWeight: '600', color: '#374151' }}>
                        Current Images:
                      </h6>
                      <Badge bg="primary" style={{ borderRadius: '20px' }}>
                        {editImagePreviews.length}/5 images
                      </Badge>
                    </div>
                    
                    <Row className="g-2">
                      {editImagePreviews.map((preview, index) => (
                        <Col key={preview.id} md={4} sm={6}>
                          <div style={{ position: 'relative' }}>
                            <img 
                              src={getImageUrl(preview.src)} 
                              alt={`Property Preview ${index + 1}`} 
                              style={{ 
                                width: '100%',
                                height: '120px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb'
                              }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              onClick={() => removeEditImage(index)}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                zIndex: 10
                              }}
                            >
                              <Icon name="x" size={12} />
                            </Button>
                            <div className="mt-1 text-center">
                              <small style={{ 
                                color: preview.isExisting ? '#10b981' : '#3b82f6',
                                fontWeight: '500'
                              }}>
                                {preview.isExisting ? 'Current' : 'New'} • {index + 1}
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
          <Modal.Footer style={{ border: 'none', padding: '1rem 1.5rem' }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
              className="action-button"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleEditSubmit}
              disabled={editLoading}
              className="action-button"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none'
              }}
            >
              {editLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Icon name="check" size={16} />
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
