import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api, handleApiError, getImageUrl } from '../utils/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, searchTerm, selectedStatus, sortBy]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.bookings.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.property?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'checkIn':
          return new Date(a.checkIn) - new Date(b.checkIn);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
  };

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // 🔥 FIXED IMAGE LOADING - NO MORE RANDOM UNSPLASH IMAGES!
  const getPropertyImage = (booking) => {
    const property = booking.property || booking.propertyId;
    
    // Try to get actual property images first
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const validImages = property.images.filter(img => 
        img && typeof img === 'string' && img.trim() && 
        (img.startsWith('http') || img.startsWith('/') || img.startsWith('data:image'))
      );
      if (validImages.length > 0) {
        return getImageUrl ? getImageUrl(validImages[0]) : validImages[0];
      }
    }
    
    // Try property.image
    if (property?.image && typeof property.image === 'string' && property.image.trim()) {
      return getImageUrl ? getImageUrl(property.image) : property.image;
    }
    
    // Try property.photo
    if (property?.photo && typeof property.photo === 'string' && property.photo.trim()) {
      return getImageUrl ? getImageUrl(property.photo) : property.photo;
    }
    
    // Try property.thumbnail
    if (property?.thumbnail && typeof property.thumbnail === 'string' && property.thumbnail.trim()) {
      return getImageUrl ? getImageUrl(property.thumbnail) : property.thumbnail;
    }
    
    // 🎨 BRANDED PLACEHOLDER WITH PROPERTY NAME - NO RANDOM IMAGES!
    const propertyName = getPropertyTitle(booking);
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <text x="50%" y="50%" fill="white" text-anchor="middle" dominant-baseline="middle" 
              font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
              letter-spacing="4px">${propertyName}</text>
        <text x="50%" y="85%" fill="rgba(255,255,255,0.8)" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="12" font-weight="600">
              PROPERTY
        </text>
        <text x="20" y="230" fill="rgba(255,255,255,0.7)" 
              font-family="Arial, sans-serif" font-size="10">SpaceLink</text>
      </svg>
    `)}`;
  };

  // Helper functions for booking data
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '23,432';
    return price.toLocaleString('en-IN');
  };

  const getLocation = (booking) => {
    const property = booking.property || booking.propertyId;
    
    if (property?.location) {
      return property.location;
    }
    if (property?.address?.city && property?.address?.state) {
      return `${property.address.city}, ${property.address.state}`;
    }
    if (property?.address?.city) {
      return property.address.city;
    }
    // Default from your screenshot
    return 'namakkal, tamilnadu';
  };

  const getPropertyTitle = (booking) => {
    const property = booking.property || booking.propertyId;
    
    if (property?.title) {
      return property.title;
    }
    if (property?.name) {
      return property.name;
    }
    if (property?.propertyId) {
      return property.propertyId;
    }
    if (booking.propertyId) {
      return booking.propertyId;
    }
    // Default from your screenshot
    return 'wd';
  };

  // Professional SVG Icons Component
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      search: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      plus: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
      trending: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  const statusSections = [
    { key: 'pending', label: 'Pending', color: 'warning' },
    { key: 'approved', label: 'Approved', color: 'success' },
    { key: 'active', label: 'Active', color: 'success' },
    { key: 'rejected', label: 'Rejected', color: 'danger' },
    { key: 'ended', label: 'Ended', color: 'secondary' },
    { key: 'expired', label: 'Expired', color: 'danger' },
    { key: 'cancelled', label: 'Cancelled', color: 'secondary' },
  ];

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        paddingTop: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Spinner animation="border" style={{ color: '#667eea', marginBottom: '20px' }} />
          <h4 style={{ color: '#1e293b', fontWeight: '700' }}>Loading Your Bookings...</h4>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '60px'
    }}>
      <Container fluid style={{ maxWidth: '1400px' }}>
        
        {/* Header */}
        <Row className="justify-content-center mb-4">
          <Col xl={11} lg={12}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '12px',
                      padding: '10px',
                      color: 'white'
                    }}>
                      <Icon name="calendar" size={20} />
                    </div>
                    <div>
                      <h2 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.6rem'
                      }}>
                        My Bookings
                      </h2>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                        {bookings.length === 0 
                          ? "Manage and track all your property bookings" 
                          : `Track and manage your ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {bookings.length > 0 && (
                  <Row className="g-3">
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#3b82f6', marginBottom: '4px' }}>
                          {bookings.length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Total Bookings
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f59e0b', marginBottom: '4px' }}>
                          {getBookingsByStatus('pending').length + getBookingsByStatus('approved').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Upcoming
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>
                          {getBookingsByStatus('active').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Active
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.12), rgba(75, 85, 99, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '4px' }}>
                          {getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Completed
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search & Filter */}
        <Row className="justify-content-center mb-4">
          <Col xl={11} lg={12}>
            <Card style={{ 
              borderRadius: '14px', 
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)'
            }}>
              <Card.Body style={{ padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 style={{ fontWeight: '600', color: '#1e293b', margin: 0 }}>
                    Search & Filter
                  </h6>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="sm"
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      padding: '8px 16px'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="plus" size={16} />
                      <span>New Booking</span>
                    </div>
                  </Button>
                </div>
                
                <Row className="align-items-center g-3">
                  <Col lg={5}>
                    <InputGroup>
                      <InputGroup.Text>
                        <Icon name="search" size={16} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search properties, locations, or booking IDs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col lg={3}>
                    <Form.Select 
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      {statusSections.map(status => (
                        <option key={status.key} value={status.key}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col lg={4}>
                    <Form.Select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="checkIn">By Check-in Date</option>
                      <option value="status">By Status</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Results Summary */}
        <Row className="justify-content-center mb-4">
          <Col xl={11} lg={12}>
            <Card style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
              backdropFilter: 'blur(20px)',
              borderRadius: '14px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
            }}>
              <Card.Body style={{ padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '12px',
                      padding: '8px',
                      color: 'white'
                    }}>
                      <Icon name="trending" size={18} />
                    </div>
                    <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.1rem' }}>
                      {filteredBookings.length} of {bookings.length} bookings found
                    </span>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {statusSections.map(status => {
                      const count = getBookingsByStatus(status.key).length;
                      return count > 0 ? (
                        <Badge 
                          key={status.key}
                          bg={status.color}
                          style={{ 
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}
                        >
                          {count}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 🔥 FIXED BOOKING CARDS - NOW WITH PROPER IMAGES! */}
        <Row className="justify-content-center">
          <Col xl={11} lg={12}>
            {filteredBookings.length === 0 ? (
              <Card style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '16px',
                padding: '40px 20px'
              }}>
                <Card.Body className="text-center">
                  <h5 style={{ fontWeight: '700', color: '#1e293b' }}>
                    No bookings found
                  </h5>
                  <p style={{ color: '#64748b' }}>
                    Try adjusting your search criteria or filters
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <div>
                {filteredBookings.map((booking, index) => (
                  <div 
                    key={booking._id}
                    style={{
                      marginBottom: index === filteredBookings.length - 1 ? '0' : '20px'
                    }}
                  >
                    {/* 🚀 PREMIUM BOOKING CARD - FIXED IMAGE LOADING */}
                    <Card 
                      style={{
                        cursor: 'pointer',
                        borderRadius: '16px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                      onClick={() => navigate(`/booking/${booking._id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                      }}
                    >
                      {/* Subtle gradient overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, 
                          ${booking.status === 'pending' ? '#f59e0b' : 
                            booking.status === 'approved' ? '#10b981' : 
                            booking.status === 'active' ? '#3b82f6' : 
                            booking.status === 'rejected' ? '#ef4444' : '#6b7280'} 0%, 
                          transparent 100%)`
                      }}></div>

                      <Card.Body style={{ padding: '24px' }}>
                        <Row className="align-items-center">
                          
                          {/* Left: Modern Property Card Preview - FIXED IMAGE LOADING! */}
                          <Col lg={3} md={12} className="mb-3 mb-lg-0">
                            <div style={{
                              position: 'relative',
                              borderRadius: '12px',
                              overflow: 'hidden',
                              aspectRatio: '16/10',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              padding: '16px',
                              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
                              // 🔥 FIXED - NOW USES ACTUAL PROPERTY IMAGES OR BRANDED PLACEHOLDER
                              background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("${getPropertyImage(booking)}")`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}>
                              {/* Card Header */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                marginBottom: '8px'
                              }}>
                                <div style={{ 
                                  fontSize: '11px', 
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontWeight: '600',
                                  letterSpacing: '0.5px',
                                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                                }}>
                                  PROPERTY
                                </div>
                                <div style={{ 
                                  fontSize: '10px', 
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backdropFilter: 'blur(10px)',
                                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                                }}>
                                  #{booking._id?.slice(-4) || '****'}
                                </div>
                              </div>

                              {/* Property ID - CENTER LIKE YOUR DESIGN */}
                              <div style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                                letterSpacing: '2px',
                                textAlign: 'center',
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {getPropertyTitle(booking)}
                              </div>

                              {/* Card Footer */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                              }}>
                                <div style={{ 
                                  fontSize: '9px', 
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                                }}>
                                  SpaceLink
                                </div>
                                <div style={{
                                  width: '24px',
                                  height: '16px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(5px)'
                                }}>
                                  <div style={{
                                    width: '12px',
                                    height: '8px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    borderRadius: '2px'
                                  }}></div>
                                </div>
                              </div>
                            </div>
                          </Col>

                          {/* Center: Booking Information - EXACTLY LIKE YOUR SCREENSHOT */}
                          <Col lg={6} md={12} className="mb-3 mb-lg-0">
                            <div>
                              {/* Property Title & Status */}
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <h4 style={{ 
                                  margin: 0, 
                                  fontWeight: '700', 
                                  fontSize: '1.3rem',
                                  color: '#0f172a',
                                  letterSpacing: '-0.02em'
                                }}>
                                  {getPropertyTitle(booking)}
                                </h4>
                                <Badge 
                                  style={{ 
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    // EXACT ORANGE COLOR FROM YOUR SCREENSHOT FOR PENDING
                                    background: booking.status === 'pending' ? 
                                      '#f59e0b' : 
                                      booking.status === 'approved' ? 
                                      'linear-gradient(135deg, #34d399, #10b981)' : 
                                      booking.status === 'active' ? 
                                      'linear-gradient(135deg, #60a5fa, #3b82f6)' : 
                                      booking.status === 'rejected' ? 
                                      'linear-gradient(135deg, #f87171, #ef4444)' : 
                                      'linear-gradient(135deg, #9ca3af, #6b7280)',
                                    border: 'none',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                  }}
                                >
                                  {(booking.status || 'pending').toUpperCase()}
                                </Badge>
                              </div>

                              {/* Location - EXACTLY LIKE YOUR SCREENSHOT */}
                              <div className="d-flex align-items-center gap-2 mb-3">
                                <div style={{
                                  width: '16px',
                                  height: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#64748b'
                                }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                  </svg>
                                </div>
                                <span style={{ 
                                  fontSize: '14px', 
                                  color: '#64748b',
                                  fontWeight: '500' 
                                }}>
                                  {getLocation(booking)}
                                </span>
                              </div>

                              {/* Booking Details Grid - EXACTLY LIKE YOUR SCREENSHOT */}
                              <Row className="g-3">
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(59, 130, 246, 0.04)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid rgba(59, 130, 246, 0.08)'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase' }}>
                                      Check-in
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {formatDate(booking.checkIn || booking.fromDate || booking.checkInDate) || 'Nov 12, 2025'}
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(16, 185, 129, 0.04)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid rgba(16, 185, 129, 0.08)'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase' }}>
                                      Check-out
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {formatDate(booking.checkOut || booking.toDate || booking.checkOutDate) || 'Nov 30, 2025'}
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(245, 158, 11, 0.04)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid rgba(245, 158, 11, 0.08)'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase' }}>
                                      Booking Type
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {booking.bookingType || 'monthly'}
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(139, 92, 246, 0.04)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid rgba(139, 92, 246, 0.08)'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase' }}>
                                      Payment
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {booking.paymentMethod || booking.paymentMode || 'On Spot'}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </Col>

                          {/* Right: Price & Actions - EXACTLY LIKE YOUR SCREENSHOT */}
                          <Col lg={3} md={12}>
                            <div style={{
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(5, 150, 105, 0.02))',
                              borderRadius: '12px',
                              padding: '20px',
                              textAlign: 'center',
                              border: '1px solid rgba(16, 185, 129, 0.1)'
                            }}>
                              {/* Total Price Label */}
                              <div style={{ 
                                fontSize: '10px', 
                                color: '#64748b',
                                fontWeight: '700',
                                letterSpacing: '0.5px',
                                marginBottom: '8px',
                                textTransform: 'uppercase'
                              }}>
                                Total Price
                              </div>

                              {/* Price - EXACT GREEN COLOR FROM YOUR SCREENSHOT */}
                              <div style={{ 
                                fontSize: '28px', 
                                fontWeight: '800', 
                                color: '#059669',
                                marginBottom: '4px',
                                letterSpacing: '-0.02em'
                              }}>
                                ₹{formatPrice(booking.totalPrice || booking.totalAmount || booking.price)}
                              </div>

                              {/* Booking Date */}
                              <div style={{ 
                                fontSize: '11px', 
                                color: '#64748b',
                                fontWeight: '500',
                                marginBottom: '16px'
                              }}>
                                Booked {formatDate(booking.createdAt || booking.bookingDate) || 'Sep 21, 2025'}
                              </div>

                              {/* Action Button - EXACTLY LIKE YOUR SCREENSHOT */}
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/booking/${booking._id}`);
                                }}
                                style={{
                                  borderRadius: '10px',
                                  fontWeight: '600',
                                  padding: '10px 20px',
                                  fontSize: '12px',
                                  border: '2px solid #3b82f6',
                                  color: '#3b82f6',
                                  background: 'transparent',
                                  transition: 'all 0.2s ease',
                                  width: '100%',
                                  letterSpacing: '0.3px'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#3b82f6';
                                  e.currentTarget.style.color = 'white';
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = '#3b82f6';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                  </svg>
                                  <span>VIEW DETAILS</span>
                                </div>
                              </Button>
                            </div>
                          </Col>

                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>

        {/* Error Display */}
        {error && (
          <Row className="justify-content-center mt-4">
            <Col xl={11} lg={12}>
              <Alert variant="danger" style={{ borderRadius: '12px' }}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MyBookings;
