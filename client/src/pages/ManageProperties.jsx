// ✨ COMPLETE PROFESSIONAL ManageProperties Component ✨
import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Modal, Form, Spinner, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      toast.error('Failed to fetch properties');
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
      toast.error('Failed to fetch bookings');
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
      toast.success('Property updated successfully!');
      setShowEditModal(false);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(error.response?.data?.message || 'Failed to update property');
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
      toast.success(`Property ${currentStatus ? 'disabled' : 'enabled'} successfully!`);
      fetchProperties();
    } catch (error) {
      console.error('Error toggling property status:', error);
      toast.error('Failed to toggle property status');
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
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner 
            animation="border" 
            style={{ 
              width: '4rem', 
              height: '4rem', 
              color: '#667eea',
              borderWidth: '0.3rem'
            }} 
          />
          <h4 className="mt-3" style={{ color: '#667eea', fontWeight: '600' }}>
            Loading Properties...
          </h4>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 🏢 PROFESSIONAL PROPERTIES OVERVIEW SECTION */}
      <Card 
        className="mb-4 shadow-sm"
        style={{
          border: 'none',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4">
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '15px',
              padding: '1rem',
              marginRight: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <Icon name="stack" size={28} />
            </div>
            <h4 style={{ fontWeight: '700', margin: 0, fontSize: '1.5rem' }}>
              Properties Overview
            </h4>
          </div>

          <Row className="g-4">
            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  <Icon name="buildings" size={24} />
                </div>
                <h2 style={{ fontWeight: '800', margin: '0 0 0.5rem 0', fontSize: '2.2rem' }}>
                  {properties.length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9, fontWeight: '500' }}>Total Properties</p>
              </div>
            </Col>

            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  <Icon name="checkCircle" size={24} />
                </div>
                <h2 style={{ fontWeight: '800', margin: '0 0 0.5rem 0', fontSize: '2.2rem', color: '#10b981' }}>
                  {properties.filter(p => p.active).length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9, fontWeight: '500' }}>Active Properties</p>
              </div>
            </Col>

            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  <Icon name="xCircle" size={24} />
                </div>
                <h2 style={{ fontWeight: '800', margin: '0 0 0.5rem 0', fontSize: '2.2rem', color: '#ef4444' }}>
                  {properties.filter(p => !p.active).length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9, fontWeight: '500' }}>Disabled Properties</p>
              </div>
            </Col>

            <Col md={3}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  <Icon name="layers" size={24} />
                </div>
                <h2 style={{ fontWeight: '800', margin: '0 0 0.5rem 0', fontSize: '2.2rem', color: '#a855f7' }}>
                  {[...new Set(properties.map(p => p.category))].length}
                </h2>
                <p style={{ margin: 0, opacity: 0.9, fontWeight: '500' }}>Property Categories</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🏠 PROFESSIONAL PROPERTY CARDS SECTION */}
      {properties.length === 0 ? (
        <Card className="text-center py-5" style={{ border: 'none', borderRadius: '20px', background: 'white' }}>
          <Card.Body>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              borderRadius: '50%',
              padding: '3rem',
              display: 'inline-block',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <Icon name="home" size={80} style={{ color: '#94a3b8' }} />
            </div>
            <h3 style={{ color: '#1e293b', marginBottom: '1rem', fontWeight: '700' }}>No Properties Yet</h3>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Start building your rental portfolio by adding your first property.
            </p>
            <Button 
              as={Link}
              to="/add-property"
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              <Icon name="plus" size={16} style={{ marginRight: '0.5rem' }} />
              Add Your First Property
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {properties.map((property) => (
            <Col key={property._id} lg={6} xl={4}>
              <Card 
                className="h-100 shadow-sm position-relative"
                style={{ 
                  border: 'none',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  background: 'white',
                  minHeight: '600px' // Fixed card height
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* IMAGE SECTION WITH FIXED HEIGHT */}
                <div style={{ 
                  position: 'relative', 
                  height: '240px',
                  background: property.images?.length 
                    ? `url(${property.images[0]}) center/cover`
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '20px 20px 0 0'
                }}>
                  {/* PHOTO COUNT BADGE */}
                  {property.images?.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '25px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      backdropFilter: 'blur(10px)'
                    }}>
                      📷 {property.images.length} Photos
                    </div>
                  )}
                  
                  {/* STATUS AND CATEGORY BADGES */}
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
                      padding: '0.6rem 1.2rem',
                      borderRadius: '25px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}>
                      {property.category}
                    </Badge>
                    
                    <Badge style={{
                      background: property.active 
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '25px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      boxShadow: property.active 
                        ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                        : '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                      {property.active ? '✅ Active' : '❌ Disabled'}
                    </Badge>
                  </div>
                </div>

                <Card.Body className="p-4 d-flex flex-column">
                  {/* PROPERTY TITLE */}
                  <h5 style={{ 
                    fontWeight: '700', 
                    marginBottom: '1rem',
                    color: '#1e293b',
                    fontSize: '1.3rem',
                    lineHeight: '1.3',
                    height: '3.5rem', // Fixed height for title
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {property.title}
                  </h5>

                  {/* LOCATION */}
                  <div className="d-flex align-items-center mb-3">
                    <Icon name="mapPin" size={16} style={{ color: '#64748b', marginRight: '0.5rem' }} />
                    <span style={{ 
                      color: '#64748b', 
                      fontSize: '0.95rem', 
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {property.address?.city}, {property.address?.state}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p style={{ 
                    color: '#64748b', 
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    height: '3rem', // Fixed height for description
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {property.description || 'No description available'}
                  </p>

                  {/* PRICE AND SIZE ROW */}
                  <Row className="mb-3">
                    <Col xs={7}>
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                      }}>
                        <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                          ₹{property.price?.toLocaleString()}/month
                        </div>
                      </div>
                    </Col>
                    <Col xs={5}>
                      <div style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '1rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                          📐 {property.size}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* DATE ADDED */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <small style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500' }}>
                      📅 Added on {formatDate(property.createdAt)}
                    </small>
                  </div>

                  {/* ACTION BUTTONS - FIXED AT BOTTOM */}
                  <div className="mt-auto">
                    <Row className="g-2">
                      {/* BOOKINGS BUTTON - FULL WIDTH */}
                      <Col xs={12}>
                        <Button
                          onClick={() => {
                            setSelectedProperty(property);
                            fetchBookings(property._id);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.8rem 1.2rem',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                          }}
                        >
                          <Icon name="calendar" size={16} style={{ marginRight: '0.5rem' }} />
                          📊 View Bookings
                        </Button>
                      </Col>
                      
                      {/* VIEW AND EDIT BUTTONS */}
                      <Col xs={6}>
                        <Button
                          as={Link}
                          to={`/property/${property._id}`}
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.2)';
                          }}
                        >
                          <Icon name="eye" size={14} style={{ marginRight: '0.4rem' }} />
                          👁️ View
                        </Button>
                      </Col>
                      
                      <Col xs={6}>
                        <Button
                          onClick={() => openEditModal(property)}
                          style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
                          }}
                        >
                          <Icon name="edit" size={14} style={{ marginRight: '0.4rem' }} />
                          ✏️ Edit
                        </Button>
                      </Col>
                      
                      {/* ENABLE/DISABLE BUTTON */}
                      <Col xs={12}>
                        <Button
                          onClick={() => togglePropertyStatus(property._id, property.active)}
                          style={{
                            background: property.active 
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                              : 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            width: '100%',
                            transition: 'all 0.3s ease',
                            boxShadow: property.active 
                              ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                              : '0 4px 12px rgba(16, 185, 129, 0.2)'
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
                              ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                              : '0 4px 12px rgba(16, 185, 129, 0.2)';
                          }}
                        >
                          <Icon name={property.active ? "disable" : "checkCircle"} size={14} style={{ marginRight: '0.4rem' }} />
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

      {/* 📊 BOOKINGS MODAL - PROFESSIONAL DESIGN */}
      <Modal 
        show={showBookingsModal} 
        onHide={() => setShowBookingsModal(false)}
        size="lg"
        style={{ zIndex: 1050 }}
        centered
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
            <Icon name="calendar" size={24} style={{ marginRight: '1rem' }} />
            📊 Bookings for {selectedProperty?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: '2rem', 
          background: 'rgba(255, 255, 255, 0.98)',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {bookingsLoading ? (
            <div className="text-center py-4">
              <Spinner 
                animation="border" 
                style={{ color: '#667eea', width: '3rem', height: '3rem' }}
              />
              <p className="mt-3" style={{ color: '#667eea', fontWeight: '600' }}>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
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
              <div className="mb-4 p-3" style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '15px'
              }}>
                <h6 style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>
                  📈 Total Bookings: <span style={{ color: '#667eea' }}>{bookings.length}</span>
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '0.5rem' }}>
                          <Icon name="user" size={16} style={{ marginRight: '0.5rem', color: '#667eea' }} />
                          {booking.user?.name || 'Unknown User'}
                        </h6>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                          📧 {booking.user?.email || 'No email'}
                        </p>
                      </div>
                      <Badge style={{
                        background: booking.status === 'confirmed' 
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : booking.status === 'pending'
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '600'
                      }}>
                        {booking.status?.toUpperCase()}
                      </Badge>
                    </div>
                    <Row className="g-3">
                      <Col md={6}>
                        <small style={{ color: '#8b5cf6', fontWeight: '600' }}>📅 CHECK-IN</small>
                        <div style={{ color: '#1e293b', fontWeight: '600' }}>
                          {formatDate(booking.checkInDate)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <small style={{ color: '#8b5cf6', fontWeight: '600' }}>📅 CHECK-OUT</small>
                        <div style={{ color: '#1e293b', fontWeight: '600' }}>
                          {formatDate(booking.checkOutDate)}
                        </div>
                      </Col>
                      <Col md={6}>
                        <small style={{ color: '#10b981', fontWeight: '600' }}>💰 TOTAL AMOUNT</small>
                        <div style={{ color: '#10b981', fontWeight: '700', fontSize: '1.1rem' }}>
                          ₹{booking.totalAmount?.toLocaleString()}
                        </div>
                      </Col>
                      <Col md={6}>
                        <small style={{ color: '#667eea', fontWeight: '600' }}>📅 BOOKING DATE</small>
                        <div style={{ color: '#1e293b', fontWeight: '600' }}>
                          {formatDate(booking.createdAt)}
                        </div>
                      </Col>
                    </Row>
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
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              padding: '0.8rem 2rem',
              fontWeight: '600'
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✏️ EDIT PROPERTY MODAL - PROFESSIONAL DESIGN */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        style={{ zIndex: 1050 }}
        centered
      >
        <Modal.Header 
          closeButton
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '20px 20px 0 0',
            padding: '1.5rem 2rem'
          }}
        >
          <Modal.Title className="d-flex align-items-center" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
            <Icon name="edit" size={24} style={{ marginRight: '1rem' }} />
            ✏️ Edit Property Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: '2rem', 
          maxHeight: '75vh', 
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.98)'
        }}>
          <Form id="editPropertyForm" onSubmit={handleEditSubmit}>
            {/* BASIC INFORMATION SECTION */}
            <div className="mb-4 p-3" style={{
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              borderRadius: '15px',
              border: '1px solid #e2e8f0'
            }}>
              <h6 style={{ color: '#8b5cf6', fontWeight: '700', marginBottom: '1rem' }}>
                🏠 Basic Information
              </h6>
              
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      Property Title *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #8b5cf6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      Property Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editFormData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        minHeight: '100px'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #8b5cf6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* PRICING & DETAILS SECTION */}
            <div className="mb-4 p-3" style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '15px',
              border: '1px solid #bae6fd'
            }}>
              <h6 style={{ color: '#0891b2', fontWeight: '700', marginBottom: '1rem' }}>
                💰 Pricing & Details
              </h6>
              
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      Monthly Rent (₹) *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #bae6fd',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #0891b2';
                        e.target.style.boxShadow = '0 0 0 3px rgba(8, 145, 178, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #bae6fd';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      Property Size
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      placeholder="e.g., 1000 sq ft"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #bae6fd',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #0891b2';
                        e.target.style.boxShadow = '0 0 0 3px rgba(8, 145, 178, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #bae6fd';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      Property Category
                    </Form.Label>
                    <Form.Select
                      value={editFormData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #bae6fd',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #0891b2';
                        e.target.style.boxShadow = '0 0 0 3px rgba(8, 145, 178, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #bae6fd';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Apartment">🏢 Apartment</option>
                      <option value="House">🏠 House</option>
                      <option value="Villa">🏡 Villa</option>
                      <option value="Studio">🏠 Studio</option>
                      <option value="Room">🚪 Room</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* RENTAL TYPES SECTION */}
            <div className="mb-4 p-3" style={{
              background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
              borderRadius: '15px',
              border: '1px solid #bbf7d0'
            }}>
              <h6 style={{ color: '#059669', fontWeight: '700', marginBottom: '1rem' }}>
                📅 Available Rental Types
              </h6>
              
              <Row className="g-3">
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    id="monthly-rental"
                    label="Monthly Rental"
                    checked={editFormData.availableRentalTypes.monthly}
                    onChange={(e) => handleInputChange('availableRentalTypes.monthly', e.target.checked)}
                    style={{ fontSize: '0.95rem', fontWeight: '500' }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    id="yearly-rental"
                    label="Yearly Rental"
                    checked={editFormData.availableRentalTypes.yearly}
                    onChange={(e) => handleInputChange('availableRentalTypes.yearly', e.target.checked)}
                    style={{ fontSize: '0.95rem', fontWeight: '500' }}
                  />
                </Col>
              </Row>
            </div>

            {/* ADDRESS SECTION */}
            <div className="mb-4 p-3" style={{
              background: 'linear-gradient(135deg, #fef7ff, #faf5ff)',
              borderRadius: '15px',
              border: '1px solid #e9d5ff'
            }}>
              <h6 style={{ color: '#7c3aed', fontWeight: '700', marginBottom: '1rem' }}>
                📍 Property Address
              </h6>
              
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      Street Address (Optional)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      placeholder="Enter full street address"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9d5ff',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      City *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9d5ff',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      State *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9d5ff',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                      PIN Code *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={editFormData.address.pinCode}
                      onChange={(e) => handleInputChange('address.pinCode', e.target.value)}
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9d5ff',
                        padding: '0.8rem 1rem',
                        fontSize: '0.95rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #7c3aed';
                        e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9d5ff';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* CONTACT INFORMATION SECTION */}
            <div className="mb-4 p-3" style={{
              background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
              borderRadius: '15px',
              border: '1px solid #fed7aa'
            }}>
              <h6 style={{ color: '#ea580c', fontWeight: '700', marginBottom: '1rem' }}>
                📞 Contact Information
              </h6>
              
              <Form.Group>
                <Form.Label style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                  Contact Number *
                </Form.Label>
                <Form.Control
                  type="text"
                  value={editFormData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  required
                  placeholder="Enter your contact number"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #fed7aa',
                    padding: '0.8rem 1rem',
                    fontSize: '0.95rem'
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '2px solid #ea580c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '2px solid #fed7aa';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Group>
            </div>
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
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              border: 'none',
              color: 'white',
              borderRadius: '12px',
              padding: '0.8rem 2rem',
              fontWeight: '600',
              marginRight: '1rem'
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
              borderRadius: '12px',
              padding: '0.8rem 2rem',
              fontWeight: '600',
              minWidth: '150px'
            }}
          >
            {editLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              <>
                <Icon name="checkCircle" size={18} style={{ marginRight: '0.5rem' }} />
                Update Property
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProperties;
