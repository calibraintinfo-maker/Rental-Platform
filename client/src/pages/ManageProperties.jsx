// 🔥 ManageProperties.jsx - FULL COMPLETE CODE WITH ONLY THE CARD FIXES! 🔥
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Modal, Form, Spinner, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

// 🎯 Custom toast replacement function
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
  setTimeout(() => notification.remove(), 3000);
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

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' 
      }}>
        <div className="text-center">
          <Spinner 
            animation="border" 
            style={{ 
              width: '3rem', 
              height: '3rem', 
              color: '#667eea',
              borderWidth: '0.25rem'
            }} 
          />
          <h3 style={{ 
            color: '#1e293b', 
            fontWeight: '700',
            marginTop: '1rem'
          }}>
            Loading Properties...
          </h3>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)' 
    }}>
      {/* 🏢 PROPERTIES OVERVIEW SECTION */}
      <Card 
        className="mb-4 shadow-lg"
        style={{
          border: 'none',
          borderRadius: '25px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <Card.Body className="p-5">
          <div className="d-flex align-items-center mb-4">
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '1.5rem',
              marginRight: '1.5rem'
            }}>
              📊
            </div>
            <div>
              <h3 style={{ fontWeight: '800', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                Properties Dashboard
              </h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
                Comprehensive overview of your rental portfolio
              </p>
            </div>
          </div>

          <Row className="g-4">
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏢</div>
                <h2 style={{ fontWeight: '900', margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>
                  {properties.length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Properties</p>
              </div>
            </Col>
            
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ fontWeight: '900', margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: '#10b981' }}>
                  {properties.filter(p => p.active).length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Active Properties</p>
              </div>
            </Col>
            
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
                <h2 style={{ fontWeight: '900', margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: '#ef4444' }}>
                  {properties.filter(p => !p.active).length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Disabled Properties</p>
              </div>
            </Col>
            
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
                <h2 style={{ fontWeight: '900', margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: '#a855f7' }}>
                  {[...new Set(properties.map(p => p.category))].length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>Categories</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🏠 FIXED PROPERTY CARDS SECTION */}
      {properties.length === 0 ? (
        <Card className="text-center py-5" style={{ 
          border: 'none', 
          borderRadius: '25px', 
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Card.Body style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🏠</div>
            <h2 style={{ color: '#1e293b', marginBottom: '1rem', fontWeight: '700' }}>
              No Properties Yet
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Start building your rental empire by adding your first property.
            </p>
            <Button 
              as={Link}
              to="/add-property"
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '15px',
                padding: '1rem 2rem',
                fontWeight: '700',
                color: 'white'
              }}
            >
              ➕ Add Your First Property
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {properties.map((property) => (
            <Col key={property._id} lg={6} xl={4}>
              <Card 
                className="h-100"
                style={{ 
                  border: 'none',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  background: 'white',
                  minHeight: '600px', // 🔥 FIXED CONSISTENT HEIGHT
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* 🎨 FIXED IMAGE SECTION */}
                <div style={{ 
                  position: 'relative', 
                  height: '220px', // 🔥 FIXED IMAGE HEIGHT
                  background: property.images?.length 
                    ? `url(${property.images[0]}) center/cover`
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '20px 20px 0 0'
                }}>
                  {/* Photo count badge */}
                  {property.images?.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      📷 {property.images.length}
                    </div>
                  )}
                  
                  {/* Status badges */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <Badge style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: '0.8rem'
                    }}>
                      {property.category}
                    </Badge>
                    
                    <Badge style={{
                      background: property.active 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: '700',
                      fontSize: '0.8rem'
                    }}>
                      {property.active ? '✅ Active' : '❌ Disabled'}
                    </Badge>
                  </div>
                </div>

                <Card.Body className="p-4 d-flex flex-column" style={{ height: 'calc(600px - 220px)' }}>
                  {/* 🏷️ FIXED TITLE */}
                  <h4 style={{ 
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    color: '#1e293b',
                    fontSize: '1.2rem',
                    lineHeight: '1.3',
                    height: '3rem', // 🔥 FIXED TITLE HEIGHT
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {property.title}
                  </h4>

                  {/* 📍 FIXED LOCATION */}
                  <div className="d-flex align-items-center mb-3" style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    padding: '0.7rem 1rem',
                    borderRadius: '12px'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>📍</span>
                    <span style={{ 
                      color: '#667eea', 
                      fontSize: '0.9rem', 
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {property.address?.city}, {property.address?.state}
                    </span>
                  </div>

                  {/* 📝 FIXED DESCRIPTION */}
                  <p style={{ 
                    color: '#64748b', 
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    height: '3rem', // 🔥 FIXED DESCRIPTION HEIGHT
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {property.description || 'No description available'}
                  </p>

                  {/* 💰 FIXED PRICE AND SIZE */}
                  <Row className="mb-3">
                    <Col xs={7}>
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                          ₹{property.price?.toLocaleString()}/mo
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: '0.9' }}>
                          Monthly Rent
                        </div>
                      </div>
                    </Col>
                    <Col xs={5}>
                      <div style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                      }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                          📐 {property.size}
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                          Area
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* 📅 RENTAL TYPES */}
                  <div className="mb-3">
                    <div className="d-flex gap-2 flex-wrap">
                      {property.availableRentalTypes?.monthly && (
                        <span style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '15px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          📅 Monthly
                        </span>
                      )}
                      {property.availableRentalTypes?.yearly && (
                        <span style={{
                          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                          color: 'white',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '15px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          📅 Yearly
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 📅 DATE ADDED */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <small style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.8rem',
                      background: 'rgba(148, 163, 184, 0.1)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '15px'
                    }}>
                      📅 Added {formatDate(property.createdAt)}
                    </small>
                  </div>

                  {/* 🚀 FIXED BUTTON COLORS - NO MORE ORANGE! */}
                  <div className="mt-auto">
                    <Row className="g-2">
                      {/* Primary bookings button */}
                      <Col xs={12}>
                        <Button
                          onClick={() => {
                            setSelectedProperty(property);
                            fetchBookings(property._id);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)', // 🔥 BLUE GRADIENT
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.8rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          📊 View Bookings
                        </Button>
                      </Col>
                      
                      {/* Secondary actions */}
                      <Col xs={6}>
                        <Button
                          as={Link}
                          to={`/property/${property._id}`}
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)', // 🔥 CYAN GRADIENT
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.7rem 0.8rem',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            width: '100%',
                            textDecoration: 'none',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          👁️ View
                        </Button>
                      </Col>
                      
                      <Col xs={6}>
                        <Button
                          onClick={() => openEditModal(property)}
                          style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // 🔥 PURPLE GRADIENT (NO ORANGE!)
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.7rem 0.8rem',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            width: '100%',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          ✏️ Edit
                        </Button>
                      </Col>
                      
                      {/* Toggle status button */}
                      <Col xs={12}>
                        <Button
                          onClick={() => togglePropertyStatus(property._id, property.active)}
                          style={{
                            background: property.active 
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)' // 🔥 RED FOR DISABLE
                              : 'linear-gradient(135deg, #10b981, #059669)', // 🔥 GREEN FOR ENABLE
                            border: 'none',
                            borderRadius: '10px',
                            padding: '0.7rem 0.8rem',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            width: '100%',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {property.active ? '🚫 Disable' : '✅ Enable'}
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

      {/* 📊 BOOKINGS MODAL - UNCHANGED */}
      <Modal 
        show={showBookingsModal} 
        onHide={() => setShowBookingsModal(false)}
        size="xl"
        centered
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '25px 25px 0 0'
          }}
        >
          <Modal.Title>
            📊 Bookings Dashboard - {selectedProperty?.title}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '2rem' }}>
          {bookingsLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: '#667eea' }} />
              <h4 style={{ color: '#667eea', marginTop: '1rem' }}>Loading bookings...</h4>
            </div>
          ) : bookings.length === 0 ? (
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
          <Button variant="secondary" onClick={() => setShowBookingsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✏️ EDIT MODAL - UNCHANGED */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // 🔥 PURPLE GRADIENT (NO ORANGE!)
            color: 'white',
            border: 'none',
            borderRadius: '25px 25px 0 0'
          }}
        >
          <Modal.Title>✏️ Edit Property</Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '2rem' }}>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
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
                    value={editFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹/month) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        
        <Modal.Footer style={{ border: 'none' }}>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            disabled={editLoading}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // 🔥 PURPLE GRADIENT (NO ORANGE!)
              border: 'none',
              color: 'white'
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
    </Container>
  );
};

export default ManageProperties;
