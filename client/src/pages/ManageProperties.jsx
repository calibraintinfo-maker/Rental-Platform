// 🔥 COMPLETE FULL ManageProperties Component - 2000+ LINES! 🔥
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Modal, Form, Spinner, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Icon = ({ name, size = 16, className = '', style = {} }) => {
  const iconMap = {
    home: '🏠', buildings: '🏢', checkCircle: '✅', xCircle: '❌', 
    calendar: '📅', user: '👤', edit: '✏️', eye: '👁️', 
    disable: '🚫', upload: '📤', mapPin: '📍', phone: '📞',
    stack: '📊', layers: '📚', trash: '🗑️', plus: '➕'
  };
  
  return (
    <span style={{ fontSize: `${size}px`, ...style }} className={className}>
      {iconMap[name] || '•'}
    </span>
  );
};

// 🎯 Custom toast replacement function - PROFESSIONAL NOTIFICATIONS
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' 
      ? 'linear-gradient(135deg, #10b981, #059669)' 
      : 'linear-gradient(135deg, #ef4444, #dc2626)'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 15px;
    z-index: 9999;
    font-weight: 700;
    font-size: 0.95rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s;
    min-width: 280px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  notification.textContent = `${type === 'success' ? '✅' : '❌'} ${message}`;
  
  // Add animation keyframes if not exists
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    size: '',
    category: 'Apartment',
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    contact: '',
    availableRentalTypes: {
      monthly: true,
      yearly: false
    }
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/owner`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      showNotification('Failed to fetch properties', 'error');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (propertyId) => {
    try {
      setBookingsLoading(true);
      setShowBookingsModal(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/property/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showNotification('Failed to fetch bookings', 'error');
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setEditFormData({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      size: property.size || '',
      category: property.category || 'Apartment',
      address: {
        street: property.address?.street || '',
        city: property.address?.city || '',
        state: property.address?.state || '',
        pinCode: property.address?.pinCode || ''
      },
      contact: property.contact || '',
      availableRentalTypes: {
        monthly: property.availableRentalTypes?.monthly || true,
        yearly: property.availableRentalTypes?.yearly || false
      }
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/properties/${selectedProperty._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      showNotification('Property updated successfully!', 'success');
      setShowEditModal(false);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      showNotification(error.response?.data?.message || 'Failed to update property', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const togglePropertyStatus = async (propertyId, currentStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/properties/${propertyId}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      showNotification(`Property ${currentStatus ? 'disabled' : 'enabled'} successfully!`, 'success');
      fetchProperties();
    } catch (error) {
      console.error('Error toggling property status:', error);
      showNotification('Failed to toggle property status', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (field, value) => {
    if (field.includes('address.')) {
      const addressField = field.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (field.includes('availableRentalTypes.')) {
      const rentalType = field.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        availableRentalTypes: {
          ...prev.availableRentalTypes,
          [rentalType]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // 🎨 PROFESSIONAL LOADING STATE
  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' 
      }}>
        <div className="text-center">
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '25px',
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '320px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              padding: '2rem',
              display: 'inline-block',
              marginBottom: '2rem',
              animation: 'pulse 2s infinite'
            }}>
              <Spinner 
                animation="border" 
                style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  color: 'white',
                  borderWidth: '0.25rem'
                }} 
              />
            </div>
            <h3 style={{ 
              color: '#1e293b', 
              fontWeight: '700',
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              Loading Properties
            </h3>
            <p style={{ 
              color: '#64748b', 
              margin: 0,
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Please wait while we fetch your properties...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)' 
    }}>
      {/* 🏢 PROFESSIONAL PROPERTIES OVERVIEW SECTION - DETAILED CARDS */}
      <Card 
        className="mb-4 shadow-lg"
        style={{
          border: 'none',
          borderRadius: '25px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* BACKGROUND DECORATION */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(60px)'
        }} />
        
        <Card.Body className="p-5 position-relative">
          <div className="d-flex align-items-center mb-5">
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginRight: '1.5rem',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <Icon name="stack" size={32} />
            </div>
            <div>
              <h3 style={{ 
                fontWeight: '800', 
                margin: '0 0 0.5rem 0', 
                fontSize: '2rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
              }}>
                Properties Dashboard
              </h3>
              <p style={{ 
                margin: 0, 
                opacity: 0.9, 
                fontSize: '1.1rem',
                fontWeight: '500'
              }}>
                Comprehensive overview of your rental portfolio
              </p>
            </div>
          </div>

          <Row className="g-4">
            {/* TOTAL PROPERTIES CARD */}
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* BACKGROUND DECORATION */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.2)',
                  filter: 'blur(20px)'
                }} />
                
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                }}>
                  <Icon name="buildings" size={28} />
                </div>
                <h2 style={{ 
                  fontWeight: '900', 
                  margin: '0 0 0.8rem 0', 
                  fontSize: '2.8rem',
                  background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none'
                }}>
                  {properties.length}
                </h2>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.95, 
                  fontWeight: '600',
                  fontSize: '1rem',
                  letterSpacing: '0.5px'
                }}>
                  Total Properties
                </p>
              </div>
            </Col>

            {/* ACTIVE PROPERTIES CARD */}
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* BACKGROUND DECORATION */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  filter: 'blur(20px)'
                }} />
                
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}>
                  <Icon name="checkCircle" size={28} />
                </div>
                <h2 style={{ 
                  fontWeight: '900', 
                  margin: '0 0 0.8rem 0', 
                  fontSize: '2.8rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none'
                }}>
                  {properties.filter(p => p.active).length}
                </h2>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.95, 
                  fontWeight: '600',
                  fontSize: '1rem',
                  letterSpacing: '0.5px'
                }}>
                  Active Properties
                </p>
              </div>
            </Col>

            {/* DISABLED PROPERTIES CARD */}
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* BACKGROUND DECORATION */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.2)',
                  filter: 'blur(20px)'
                }} />
                
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
                }}>
                  <Icon name="xCircle" size={28} />
                </div>
                <h2 style={{ 
                  fontWeight: '900', 
                  margin: '0 0 0.8rem 0', 
                  fontSize: '2.8rem',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none'
                }}>
                  {properties.filter(p => !p.active).length}
                </h2>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.95, 
                  fontWeight: '600',
                  fontSize: '1rem',
                  letterSpacing: '0.5px'
                }}>
                  Disabled Properties
                </p>
              </div>
            </Col>

            {/* PROPERTY CATEGORIES CARD */}
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* BACKGROUND DECORATION */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.2)',
                  filter: 'blur(20px)'
                }} />
                
                <div style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)'
                }}>
                  <Icon name="layers" size={28} />
                </div>
                <h2 style={{ 
                  fontWeight: '900', 
                  margin: '0 0 0.8rem 0', 
                  fontSize: '2.8rem',
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none'
                }}>
                  {[...new Set(properties.map(p => p.category))].length}
                </h2>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.95, 
                  fontWeight: '600',
                  fontSize: '1rem',
                  letterSpacing: '0.5px'
                }}>
                  Property Categories
                </p>
              </div>
            </Col>
          </Row>

          {/* ADDITIONAL STATS ROW */}
          <Row className="g-4 mt-3">
            <Col md={6}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h5 style={{ 
                  color: 'white', 
                  fontWeight: '700',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.1rem'
                }}>
                  <Icon name="home" size={20} style={{ marginRight: '0.5rem' }} />
                  Average Property Value
                </h5>
                <p style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '800', 
                  margin: '0',
                  color: '#fbbf24'
                }}>
                  ₹{properties.length > 0 
                    ? Math.round(properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length).toLocaleString()
                    : '0'
                  }/month
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h5 style={{ 
                  color: 'white', 
                  fontWeight: '700',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.1rem'
                }}>
                  <Icon name="calendar" size={20} style={{ marginRight: '0.5rem' }} />
                  Portfolio Performance
                </h5>
                <p style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '800', 
                  margin: '0',
                  color: '#34d399'
                }}>
                  {properties.length > 0 
                    ? Math.round((properties.filter(p => p.active).length / properties.length) * 100)
                    : 0
                  }% Active
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🏠 PROFESSIONAL PROPERTY CARDS SECTION - ENHANCED GRID */}
      {properties.length === 0 ? (
        <Card className="text-center py-5" style={{ 
          border: 'none', 
          borderRadius: '25px', 
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Card.Body style={{ padding: '4rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              borderRadius: '50%',
              padding: '4rem',
              display: 'inline-block',
              marginBottom: '3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
              border: '3px solid rgba(148, 163, 184, 0.1)'
            }}>
              <Icon name="home" size={120} style={{ color: '#94a3b8' }} />
            </div>
            <h2 style={{ 
              color: '#1e293b', 
              marginBottom: '1.5rem', 
              fontWeight: '800',
              fontSize: '2.5rem'
            }}>
              No Properties Yet
            </h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.3rem', 
              marginBottom: '3rem',
              maxWidth: '500px',
              margin: '0 auto 3rem auto',
              lineHeight: '1.6'
            }}>
              Start building your rental empire by adding your first property. 
              Create detailed listings and manage everything from one place.
            </p>
            <Button 
              as={Link}
              to="/add-property"
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '15px',
                padding: '1.2rem 3rem',
                fontWeight: '700',
                fontSize: '1.1rem',
                textDecoration: 'none',
                color: 'white',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
            >
              <Icon name="plus" size={18} style={{ marginRight: '0.8rem' }} />
              Add Your First Property
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {properties.map((property) => (
            <Col key={property._id} lg={6} xl={4}>
              <Card 
                className="h-100 shadow-lg position-relative"
                style={{ 
                  border: 'none',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  background: 'rgba(255, 255, 255, 0.95)',
                  minHeight: '700px', // FIXED CONSISTENT HEIGHT
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                {/* ENHANCED IMAGE SECTION WITH OVERLAY EFFECTS */}
                <div style={{ 
                  position: 'relative', 
                  height: '280px', // FIXED HEIGHT FOR CONSISTENCY
                  background: property.images?.length 
                    ? `linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)), url(${property.images[0]}) center/cover`
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '25px 25px 0 0',
                  overflow: 'hidden'
                }}>
                  {/* GRADIENT OVERLAY */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  {/* ENHANCED PHOTO COUNT BADGE */}
                  {property.images?.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '30px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      📷 {property.images.length} Photos
                    </div>
                  )}
                  
                  {/* ENHANCED STATUS AND CATEGORY BADGES */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}>
                    <Badge style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '30px',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {property.category}
                    </Badge>
                    
                    <Badge style={{
                      background: property.active 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      padding: '0.7rem 1.5rem',
                      borderRadius: '30px',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      boxShadow: property.active 
                        ? '0 6px 20px rgba(16, 185, 129, 0.3)'
                        : '0 6px 20px rgba(239, 68, 68, 0.3)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {property.active ? '✅ Active' : '❌ Disabled'}
                    </Badge>
                  </div>

                  {/* PROPERTY TYPE INDICATOR */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#1e293b',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)'
                  }}>
                    🏠 For Rent
                  </div>
                </div>

                <Card.Body className="p-4 d-flex flex-column">
                  {/* ENHANCED PROPERTY TITLE WITH TRUNCATION */}
                  <h4 style={{ 
                    fontWeight: '800', 
                    marginBottom: '1.2rem',
                    color: '#1e293b',
                    fontSize: '1.4rem',
                    lineHeight: '1.3',
                    height: '4rem', // FIXED HEIGHT FOR TITLE
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    {property.title}
                  </h4>

                  {/* ENHANCED LOCATION WITH ICON */}
                  <div className="d-flex align-items-center mb-3" style={{
                    background: 'rgba(102, 126, 234, 0.05)',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <Icon name="mapPin" size={18} style={{ color: '#667eea', marginRight: '0.8rem' }} />
                    <span style={{ 
                      color: '#475569', 
                      fontSize: '0.95rem', 
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {property.address?.city}, {property.address?.state}
                    </span>
                  </div>

                  {/* ENHANCED DESCRIPTION */}
                  <p style={{ 
                    color: '#64748b', 
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    height: '3.5rem', // FIXED HEIGHT FOR DESCRIPTION
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {property.description || 'No description available'}
                  </p>

                  {/* ENHANCED PRICE AND SIZE ROW WITH GRADIENTS */}
                  <Row className="mb-3">
                    <Col xs={7}>
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '1.2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* PRICE CARD DECORATION */}
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          filter: 'blur(10px)'
                        }} />
                        
                        <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>
                          ₹{property.price?.toLocaleString()}/mo
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: '0.9' }}>
                          Monthly Rent
                        </div>
                      </div>
                    </Col>
                    <Col xs={5}>
                      <div style={{
                        background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                        color: '#475569',
                        padding: '1.2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        border: '2px solid rgba(148, 163, 184, 0.1)',
                        position: 'relative'
                      }}>
                        <div style={{ fontWeight: '800', fontSize: '1rem' }}>
                          📐 {property.size}
                        </div>
                        <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>
                          Area
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* ENHANCED RENTAL TYPES */}
                  <div className="mb-3">
                    <div className="d-flex gap-2 flex-wrap">
                      {property.availableRentalTypes?.monthly && (
                        <span style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          📅 Monthly
                        </span>
                      )}
                      {property.availableRentalTypes?.yearly && (
                        <span style={{
                          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                          color: 'white',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          📅 Yearly
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ENHANCED DATE ADDED */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <small style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.85rem', 
                      fontWeight: '500',
                      background: 'rgba(148, 163, 184, 0.1)',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px'
                    }}>
                      📅 Added on {formatDate(property.createdAt)}
                    </small>
                  </div>

                  {/* ENHANCED ACTION BUTTONS - FIXED AT BOTTOM */}
                  <div className="mt-auto">
                    <Row className="g-3">
                      {/* PRIMARY ACTION - VIEW BOOKINGS */}
                      <Col xs={12}>
                        <Button
                          onClick={() => {
                            setSelectedProperty(property);
                            fetchBookings(property._id);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            border: 'none',
                            borderRadius: '15px',
                            padding: '1rem 1.5rem',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.25)';
                          }}
                        >
                          {/* BUTTON DECORATION */}
                          <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                            transform: 'translateX(-100%)',
                            transition: 'transform 0.6s ease',
                            pointerEvents: 'none'
                          }} />
                          
                          <Icon name="calendar" size={18} style={{ marginRight: '0.8rem' }} />
                          📊 View Bookings & Analytics
                        </Button>
                      </Col>
                      
                      {/* SECONDARY ACTIONS ROW */}
                      <Col xs={6}>
                        <Button
                          as={Link}
                          to={`/property/${property._id}`}
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.25)',
                            textDecoration: 'none',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.25)';
                          }}
                        >
                          <Icon name="eye" size={16} style={{ marginRight: '0.5rem' }} />
                          👁️ View Details
                        </Button>
                      </Col>
                      
                      <Col xs={6}>
                        <Button
                          onClick={() => openEditModal(property)}
                          style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.25)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.25)';
                          }}
                        >
                          <Icon name="edit" size={16} style={{ marginRight: '0.5rem' }} />
                          ✏️ Edit
                        </Button>
                      </Col>
                      
                      {/* TOGGLE STATUS BUTTON */}
                      <Col xs={12}>
                        <Button
                          onClick={() => togglePropertyStatus(property._id, property.active)}
                          style={{
                            background: property.active 
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                              : 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: property.active 
                              ? '0 4px 15px rgba(239, 68, 68, 0.25)'
                              : '0 4px 15px rgba(16, 185, 129, 0.25)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = property.active 
                              ? '0 8px 25px rgba(239, 68, 68, 0.4)'
                              : '0 8px 25px rgba(16, 185, 129, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = property.active 
                              ? '0 4px 15px rgba(239, 68, 68, 0.25)'
                              : '0 4px 15px rgba(16, 185, 129, 0.25)';
                          }}
                        >
                          <Icon name={property.active ? "disable" : "checkCircle"} size={16} style={{ marginRight: '0.5rem' }} />
                          {property.active ? '🚫 Disable Property' : '✅ Enable Property'}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 📊 ENHANCED BOOKINGS MODAL - ULTRA PROFESSIONAL DESIGN */}
      <Modal 
        show={showBookingsModal} 
        onHide={() => setShowBookingsModal(false)}
        size="xl"
        style={{ zIndex: 1050 }}
        centered
        backdrop="static"
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '25px 25px 0 0',
            padding: '2rem 2.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* HEADER BACKGROUND DECORATION */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)'
          }} />
          
          <Modal.Title className="d-flex align-items-center position-relative" style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '0.8rem',
              marginRight: '1rem',
              backdropFilter: 'blur(20px)'
            }}>
              <Icon name="calendar" size={28} />
            </div>
            <div>
              <div>📊 Bookings Dashboard</div>
              <small style={{ fontSize: '0.9rem', opacity: '0.9', fontWeight: '500' }}>
                {selectedProperty?.title}
              </small>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ 
          padding: '2.5rem', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>
          {bookingsLoading ? (
            <div className="text-center py-5">
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                padding: '2rem',
                display: 'inline-block',
                marginBottom: '2rem',
                animation: 'pulse 2s infinite'
              }}>
                <Spinner 
                  animation="border" 
                  style={{ color: 'white', width: '3rem', height: '3rem' }}
                />
              </div>
              <h4 style={{ color: '#667eea', fontWeight: '700' }}>Loading bookings...</h4>
              <p style={{ color: '#64748b' }}>Please wait while we fetch the booking data</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5">
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '50%',
                padding: '3rem',
                display: 'inline-block',
                marginBottom: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
              }}>
                <Icon name="calendar" size={80} style={{ color: '#94a3b8' }} />
              </div>
              <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontWeight: '800' }}>No Bookings Yet</h3>
              <p style={{ 
                color: '#64748b', 
                margin: 0, 
                fontSize: '1.1rem',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                This property hasn't received any bookings yet. 
                Share your listing to attract potential tenants.
              </p>
            </div>
          ) : (
            <div>
              {/* ENHANCED BOOKING STATISTICS */}
              <Row className="mb-4">
                <Col md={3}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}>
                    <h3 style={{ fontWeight: '800', margin: 0, fontSize: '2rem' }}>
                      {bookings.length}
                    </h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Total Bookings</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                  }}>
                    <h3 style={{ fontWeight: '800', margin: 0, fontSize: '2rem' }}>
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Confirmed</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
                  }}>
                    <h3 style={{ fontWeight: '800', margin: 0, fontSize: '2rem' }}>
                      {bookings.filter(b => b.status === 'pending').length}
                    </h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Pending</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                  }}>
                    <h3 style={{ fontWeight: '800', margin: 0, fontSize: '2rem' }}>
                      ₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
                    </h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Total Revenue</p>
                  </div>
                </Col>
              </Row>

              {/* ENHANCED BOOKINGS LIST */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h5 style={{ 
                  color: '#1e293b', 
                  fontWeight: '800', 
                  marginBottom: '1.5rem',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Icon name="user" size={20} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                  Recent Bookings
                </h5>
                
                {bookings.map((booking, index) => (
                  <Card 
                    key={booking._id} 
                    className="mb-4" 
                    style={{ 
                      border: 'none',
                      borderRadius: '18px',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* BOOKING NUMBER INDICATOR */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0 0 15px 0',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      #{index + 1}
                    </div>
                    
                    <Card.Body className="p-4" style={{ paddingTop: '3rem' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 style={{ 
                            color: '#1e293b', 
                            fontWeight: '800', 
                            marginBottom: '0.8rem',
                            fontSize: '1.2rem'
                          }}>
                            <Icon name="user" size={18} style={{ marginRight: '0.8rem', color: '#667eea' }} />
                            {booking.user?.name || 'Unknown User'}
                          </h6>
                          <div style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            📧 {booking.user?.email || 'No email'}
                          </div>
                        </div>
                        <Badge style={{
                          background: booking.status === 'confirmed' 
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : booking.status === 'pending'
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                          border: 'none',
                          padding: '0.8rem 1.5rem',
                          borderRadius: '25px',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {booking.status?.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <Row className="g-4">
                        <Col md={6}>
                          <div style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '15px',
                            textAlign: 'center'
                          }}>
                            <small style={{ fontWeight: '600', opacity: '0.9' }}>📅 CHECK-IN</small>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                              {formatDate(booking.checkInDate)}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div style={{
                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '15px',
                            textAlign: 'center'
                          }}>
                            <small style={{ fontWeight: '600', opacity: '0.9' }}>📅 CHECK-OUT</small>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                              {formatDate(booking.checkOutDate)}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            padding: '1.2rem',
                            borderRadius: '15px',
                            textAlign: 'center'
                          }}>
                            <small style={{ fontWeight: '600', opacity: '0.9' }}>💰 TOTAL AMOUNT</small>
                            <div style={{ fontWeight: '800', fontSize: '1.3rem', marginTop: '0.5rem' }}>
                              ₹{booking.totalAmount?.toLocaleString()}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div style={{
                            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                            color: '#475569',
                            padding: '1.2rem',
                            borderRadius: '15px',
                            textAlign: 'center',
                            border: '2px solid rgba(148, 163, 184, 0.1)'
                          }}>
                            <small style={{ fontWeight: '600', opacity: '0.8' }}>📅 BOOKING DATE</small>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                              {formatDate(booking.createdAt)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer style={{ 
          border: 'none', 
          padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
          borderRadius: '0 0 25px 25px'
        }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowBookingsModal(false)}
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: 'none',
              color: 'white',
              borderRadius: '15px',
              padding: '1rem 2.5rem',
              fontWeight: '700',
              fontSize: '0.95rem'
            }}
          >
            Close Dashboard
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✏️ ULTRA ENHANCED EDIT PROPERTY MODAL - PROFESSIONAL FORM */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="xl"
        style={{ zIndex: 1050 }}
        centered
        backdrop="static"
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '25px 25px 0 0',
            padding: '2rem 2.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* HEADER DECORATION */}
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(30px)'
          }} />
          
          <Modal.Title className="d-flex align-items-center position-relative" style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '0.8rem',
              marginRight: '1rem',
              backdropFilter: 'blur(20px)'
            }}>
              <Icon name="edit" size={28} />
            </div>
            <div>
              <div>✏️ Edit Property Details</div>
              <small style={{ fontSize: '0.9rem', opacity: '0.9', fontWeight: '500' }}>
                Update your property information
              </small>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ 
          padding: '2.5rem', 
          maxHeight: '80vh', 
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          <Form id="editPropertyForm" onSubmit={handleEditSubmit}>
            {/* BASIC INFORMATION SECTION - ENHANCED */}
            <div className="mb-5" style={{
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* SECTION DECORATION */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                filter: 'blur(20px)'
              }} />
              
              <h5 style={{ 
                color: '#8b5cf6', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                <Icon name="home" size={24} style={{ marginRight: '0.8rem' }} />
                🏠 Basic Information
              </h5>
              
              <Row className="g-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      Property Title *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      placeholder="Enter a catchy property title"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e2e8f0',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #8b5cf6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e2e8f0';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      Property Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={editFormData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your property in detail..."
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e2e8f0',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        resize: 'vertical',
                        minHeight: '120px',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #8b5cf6';
                        e.target.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e2e8f0';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* PRICING & DETAILS SECTION - ENHANCED */}
            <div className="mb-5" style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid #bae6fd',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* SECTION DECORATION */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.1)',
                filter: 'blur(20px)'
              }} />
              
              <h5 style={{ 
                color: '#0891b2', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                <Icon name="stack" size={24} style={{ marginRight: '0.8rem' }} />
                💰 Pricing & Details
              </h5>
              
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      Monthly Rent (₹) *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      placeholder="e.g., 25000"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #bae6fd',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #0891b2';
                        e.target.style.boxShadow = '0 0 0 4px rgba(8, 145, 178, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #bae6fd';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      Property Size
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      placeholder="e.g., 1000 sq ft, 2 BHK"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #bae6fd',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #0891b2';
                        e.target.style.boxShadow = '0 0 0 4px rgba(8, 145, 178, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #bae6fd';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      Property Category
                    </Form.Label>
                    <Form.Select
                      value={editFormData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #bae6fd',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #0891b2';
                        e.target.style.boxShadow = '0 0 0 4px rgba(8, 145, 178, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #bae6fd';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    >
                      <option value="Apartment">🏢 Apartment</option>
                      <option value="House">🏠 Independent House</option>
                      <option value="Villa">🏡 Villa</option>
                      <option value="Studio">🏠 Studio Apartment</option>
                      <option value="Room">🚪 Single Room</option>
                      <option value="PG">🏠 PG Accommodation</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* RENTAL TYPES SECTION - ENHANCED */}
            <div className="mb-5" style={{
              background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid #bbf7d0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* SECTION DECORATION */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                filter: 'blur(20px)'
              }} />
              
              <h5 style={{ 
                color: '#059669', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                <Icon name="calendar" size={24} style={{ marginRight: '0.8rem' }} />
                📅 Available Rental Types
              </h5>
              
              <Row className="g-4">
                <Col md={6}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <Form.Check
                      type="checkbox"
                      id="monthly-rental"
                      label="📅 Monthly Rental"
                      checked={editFormData.availableRentalTypes.monthly}
                      onChange={(e) => handleInputChange('availableRentalTypes.monthly', e.target.checked)}
                      style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        color: '#059669'
                      }}
                    />
                    <small style={{ color: '#064e3b', marginTop: '0.5rem', display: 'block' }}>
                      Perfect for short-term tenants
                    </small>
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <Form.Check
                      type="checkbox"
                      id="yearly-rental"
                      label="📅 Yearly Rental"
                      checked={editFormData.availableRentalTypes.yearly}
                      onChange={(e) => handleInputChange('availableRentalTypes.yearly', e.target.checked)}
                      style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600',
                        color: '#059669'
                      }}
                    />
                    <small style={{ color: '#064e3b', marginTop: '0.5rem', display: 'block' }}>
                      Ideal for long-term stability
                    </small>
                  </div>
                </Col>
              </Row>
            </div>

            {/* ADDRESS SECTION - ENHANCED */}
            <div className="mb-5" style={{
              background: 'linear-gradient(135deg, #fef7ff, #faf5ff)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid #e9d5ff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* SECTION DECORATION */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(124, 58, 237, 0.1)',
                filter: 'blur(20px)'
              }} />
              
              <h5 style={{ 
                color: '#7c3aed', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                <Icon name="mapPin" size={24} style={{ marginRight: '0.8rem' }} />
                📍 Property Address
              </h5>
              
              <Row className="g-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      Street Address (Optional)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      placeholder="Enter full street address with landmarks"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e9d5ff',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      City *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      required
                      placeholder="e.g., Mumbai, Delhi"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e9d5ff',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      State *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      required
                      placeholder="e.g., Maharashtra, Delhi"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e9d5ff',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ 
                      color: '#1e293b', 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      marginBottom: '0.8rem'
                    }}>
                      PIN Code *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.pinCode}
                      onChange={(e) => handleInputChange('address.pinCode', e.target.value)}
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      placeholder="e.g., 400001"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #e9d5ff',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.8)'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.1)';
                        e.target.style.background = 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* CONTACT INFORMATION SECTION - ENHANCED */}
            <div className="mb-4" style={{
              background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid #fed7aa',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* SECTION DECORATION */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(234, 88, 12, 0.1)',
                filter: 'blur(20px)'
              }} />
              
              <h5 style={{ 
                color: '#ea580c', 
                fontWeight: '800', 
                marginBottom: '1.5rem',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                <Icon name="phone" size={24} style={{ marginRight: '0.8rem' }} />
                📞 Contact Information
              </h5>
              
              <Form.Group>
                <Form.Label style={{ 
                  color: '#1e293b', 
                  fontWeight: '700', 
                  fontSize: '1rem',
                  marginBottom: '0.8rem'
                }}>
                  Contact Number *
                </Form.Label>
                <Form.Control
                  type="text"
                  value={editFormData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  required
                  placeholder="Enter your contact number"
                  style={{
                    borderRadius: '15px',
                    border: '2px solid #fed7aa',
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #ea580c';
                    e.target.style.boxShadow = '0 0 0 4px rgba(234, 88, 12, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '2px solid #fed7aa';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  }}
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        
        <Modal.Footer style={{ 
          border: 'none', 
          padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
          borderRadius: '0 0 25px 25px',
          gap: '1rem'
        }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowEditModal(false)}
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: 'none',
              color: 'white',
              borderRadius: '15px',
              padding: '1rem 2.5rem',
              fontWeight: '700',
              fontSize: '0.95rem'
            }}
          >
            Cancel Changes
          </Button>
          <Button 
            type="submit" 
            form="editPropertyForm"
            disabled={editLoading}
            style={{
              background: editLoading 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              color: 'white',
              borderRadius: '15px',
              padding: '1rem 2.5rem',
              fontWeight: '700',
              fontSize: '0.95rem',
              minWidth: '180px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* BUTTON SHIMMER EFFECT */}
            {!editLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            )}
            
            {editLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating Property...
              </>
            ) : (
              <>
                <Icon name="checkCircle" size={18} style={{ marginRight: '0.8rem' }} />
                Update Property Details
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ADDITIONAL CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </Container>
  );
};

export default ManageProperties;
