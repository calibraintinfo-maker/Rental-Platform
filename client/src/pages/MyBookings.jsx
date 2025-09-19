import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import { api, handleApiError } from '../utils/api';

const MyBookings = () => {
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

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      pending: 'warning',
      approved: 'success',
      active: 'primary',
      rejected: 'danger',
      ended: 'secondary',
      expired: 'danger',
      cancelled: 'dark'
    };
    return statusMap[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: '🟡',
      approved: '✅',
      active: '🟢',
      rejected: '❌',
      ended: '⚫',
      expired: '🔴',
      cancelled: '⚫'
    };
    return iconMap[status] || '📋';
  };

  const statusSections = [
    { key: 'pending', label: 'Pending Bookings', color: 'warning' },
    { key: 'approved', label: 'Approved Bookings', color: 'success' },
    { key: 'active', label: 'Active Bookings', color: 'success' },
    { key: 'rejected', label: 'Rejected Bookings', color: 'danger' },
    { key: 'ended', label: 'Ended Bookings', color: 'secondary' },
    { key: 'expired', label: 'Expired Bookings', color: 'danger' },
    { key: 'cancelled', label: 'Cancelled Bookings', color: 'secondary' },
  ];

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#f8fafc', 
        minHeight: '100vh', 
        paddingTop: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col xs={12} md={6} lg={4}>
              <div 
                className="mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                  animation: 'pulse 2s infinite'
                }}
              >
                <Spinner animation="border" variant="light" style={{ width: '40px', height: '40px' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1a202c', marginBottom: '12px' }}>
                Loading Your Bookings
              </h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
                Please wait while we fetch your booking history...
              </p>
            </Col>
          </Row>
        </Container>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      paddingTop: '80px' 
    }}>
      {/* 🔥 HERO SECTION - Professional Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '60px',
        paddingBottom: '80px',
        marginBottom: '0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="justify-content-center text-center">
            <Col xs={12} lg={10} xl={8}>
              {/* Icon + Title */}
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div 
                  className="me-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <span style={{ fontSize: '36px' }}>📋</span>
                </div>
                <h1 style={{ 
                  color: 'white',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 800,
                  margin: 0,
                  textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  letterSpacing: '-0.02em'
                }}>
                  My Bookings
                </h1>
              </div>

              {/* Subtitle */}
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                maxWidth: '600px',
                margin: '0 auto 2rem',
                fontWeight: 400,
                lineHeight: 1.6
              }}>
                {bookings.length === 0 
                  ? "Your booking journey starts here. Discover amazing properties and create unforgettable experiences." 
                  : `Manage your ${bookings.length} booking${bookings.length !== 1 ? 's' : ''} with ease. Track, modify, and explore new opportunities.`
                }
              </p>

              {/* CTA Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Button
                  as={Link}
                  to="/find-property"
                  size="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🔍 Explore Properties
                </Button>
                {bookings.length > 0 && (
                  <Button
                    variant="outline-light"
                    size="lg"
                    style={{
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontWeight: 700,
                      borderWidth: '2px',
                      minWidth: '200px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = '#667eea';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    📊 View Analytics
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {error && (
          <Alert variant="danger" className="mb-4" style={{ 
            borderRadius: '16px', 
            border: 'none',
            boxShadow: '0 8px 32px rgba(220, 53, 69, 0.15)',
            borderLeft: '5px solid #dc3545'
          }}>
            <div className="d-flex align-items-center">
              <span style={{ fontSize: '24px', marginRight: '16px' }}>⚠️</span>
              <div>
                <Alert.Heading className="h5 mb-2">Something went wrong</Alert.Heading>
                <p className="mb-0">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              {/* 🔥 PROFESSIONAL EMPTY STATE */}
              <Card 
                className="border-0 text-center"
                style={{ 
                  background: 'white',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  marginTop: '-40px',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <Card.Body className="px-4 px-md-5 py-5">
                  {/* Decorative Element */}
                  <div 
                    className="mx-auto mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      width: '140px',
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <span>🏠</span>
                  </div>

                  <h2 className="mb-4" style={{ 
                    fontWeight: 800, 
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
                    color: '#1a202c',
                    lineHeight: 1.2
                  }}>
                    Ready to Book Your First Property?
                  </h2>
                  
                  <p className="mb-5" style={{ 
                    fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', 
                    lineHeight: 1.7,
                    color: '#4a5568',
                    maxWidth: '500px',
                    margin: '0 auto 2rem'
                  }}>
                    Discover thousands of amazing properties around the world. From cozy apartments to luxury villas, 
                    find your perfect stay with verified hosts and instant booking.
                  </p>

                  {/* Features Grid */}
                  <Row className="mb-5">
                    {[
                      { icon: '✅', title: 'Verified Hosts', desc: 'All properties verified' },
                      { icon: '⚡', title: 'Instant Booking', desc: 'Book in seconds' },
                      { icon: '🛡️', title: 'Secure Payment', desc: '100% safe & secure' },
                      { icon: '🌟', title: 'Premium Support', desc: '24/7 customer care' }
                    ].map((feature, index) => (
                      <Col xs={6} md={3} key={index} className="mb-4 mb-md-0">
                        <div style={{ padding: '1rem' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                          <h6 style={{ fontWeight: 700, color: '#2d3748', marginBottom: '0.25rem' }}>
                            {feature.title}
                          </h6>
                          <small style={{ color: '#64748b' }}>{feature.desc}</small>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {/* Stats */}
                  <div 
                    className="mb-5 py-4"
                    style={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <Row className="text-center">
                      {[
                        { number: '50K+', label: 'Properties', color: '#667eea' },
                        { number: '190+', label: 'Countries', color: '#764ba2' },
                        { number: '2M+', label: 'Happy Guests', color: '#10b981' }
                      ].map((stat, index) => (
                        <Col xs={4} key={index}>
                          <h3 style={{ 
                            color: stat.color, 
                            fontWeight: 800, 
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                            marginBottom: '0.5rem'
                          }}>
                            {stat.number}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            fontWeight: 600,
                            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                            margin: 0
                          }}>
                            {stat.label}
                          </p>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Final CTA */}
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '20px 40px',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.35)',
                      transition: 'all 0.3s ease',
                      minWidth: '240px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.35)';
                    }}
                  >
                    🚀 Start Your Journey
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* SEARCH & FILTER SECTION */}
            <Card className="mb-5 border-0" style={{ 
              borderRadius: '20px', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              background: 'white',
              marginTop: '-40px',
              position: 'relative',
              zIndex: 2
            }}>
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                  <div>
                    <h4 style={{ fontWeight: 800, color: '#1a202c', marginBottom: '0.5rem' }}>
                      📊 Manage Your Bookings
                    </h4>
                    <p style={{ color: '#64748b', margin: 0 }}>
                      Search, filter, and organize your bookings
                    </p>
                  </div>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      padding: '12px 24px',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.25)',
                      marginTop: '1rem',
                      marginTop: '0'
                    }}
                    className="mt-3 mt-md-0"
                  >
                    + New Booking
                  </Button>
                </div>
                
                <Row className="align-items-end">
                  <Col lg={5} className="mb-3 mb-lg-0">
                    <Form.Label style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                      Search Bookings
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ 
                        background: '#f9fafb', 
                        border: '2px solid #e5e7eb',
                        borderRight: 'none'
                      }}>
                        🔍
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by property, location, or booking ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                          border: '2px solid #e5e7eb',
                          borderLeft: 'none',
                          padding: '14px 16px',
                          fontSize: '1rem'
                        }}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col lg={3} md={6} className="mb-3 mb-lg-0">
                    <Form.Label style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                      Filter by Status
                    </Form.Label>
                    <Form.Select 
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{ 
                        border: '2px solid #e5e7eb',
                        padding: '14px 16px',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      <option value="all">🔢 All Status</option>
                      {statusSections.map(status => (
                        <option key={status.key} value={status.key}>
                          {getStatusIcon(status.key)} {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col lg={3} md={6}>
                    <Form.Label style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                      Sort by
                    </Form.Label>
                    <Form.Select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ 
                        border: '2px solid #e5e7eb',
                        padding: '14px 16px',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      <option value="newest">📅 Newest First</option>
                      <option value="oldest">📅 Oldest First</option>
                      <option value="checkIn">🗓️ Check-in Date</option>
                      <option value="status">🏷️ By Status</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Results Summary */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <h5 style={{ color: '#374151', fontWeight: 700, marginBottom: '1rem', marginBottom: '0' }}>
                Showing {filteredBookings.length} of {bookings.length} bookings
              </h5>
              <div className="d-flex gap-2 flex-wrap">
                {statusSections.map(status => {
                  const count = getBookingsByStatus(status.key).length;
                  return count > 0 ? (
                    <Badge 
                      key={status.key}
                      bg={status.color}
                      style={{ 
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      {getStatusIcon(status.key)} {count}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <Card className="text-center py-5 border-0" style={{ 
                background: 'white', 
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
                  <h4 style={{ fontWeight: 700, color: '#1a202c', marginBottom: '1rem' }}>
                    No bookings found
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Try adjusting your search criteria or filters to find your bookings
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <div className="booking-list">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="mb-4">
                    <Card 
                      className="border-0"
                      style={{ 
                        borderRadius: '20px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                        background: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <Card.Body className="p-0">
                        <BookingCard booking={booking} />
                        <div className="px-4 pb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                          <Badge 
                            bg={getStatusBadgeVariant(booking.status)}
                            style={{ 
                              padding: '10px 20px',
                              borderRadius: '25px',
                              fontSize: '0.9rem',
                              fontWeight: 700
                            }}
                          >
                            {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <Button
                            variant="outline-primary"
                            as={Link}
                            to={`/booking/${booking._id}`}
                            style={{
                              borderRadius: '12px',
                              fontWeight: 700,
                              padding: '10px 24px',
                              borderWidth: '2px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            View Details →
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Analytics Dashboard */}
            <Card 
              className="mt-5 border-0"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '24px',
                color: 'white',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
                overflow: 'hidden'
              }}
            >
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-5">
                  <h3 className="text-white mb-3" style={{ fontWeight: 800 }}>
                    📊 Your Booking Analytics
                  </h3>
                  <p className="text-white opacity-75" style={{ fontSize: '1.1rem' }}>
                    Complete overview of your booking activity and statistics
                  </p>
                </div>
                
                <Row className="text-center">
                  {[
                    { count: bookings.length, label: 'Total Bookings', icon: '📋', color: 'rgba(255, 255, 255, 0.2)' },
                    { count: getBookingsByStatus('active').length, label: 'Currently Active', icon: '🟢', color: 'rgba(16, 185, 129, 0.2)' },
                    { count: getBookingsByStatus('pending').length, label: 'Awaiting Approval', icon: '🟡', color: 'rgba(245, 158, 11, 0.2)' },
                    { count: getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length, label: 'Completed', icon: '✅', color: 'rgba(34, 197, 94, 0.2)' }
                  ].map((stat, index) => (
                    <Col xs={6} md={3} key={index} className="mb-4 mb-md-0">
                      <div 
                        style={{
                          background: stat.color,
                          borderRadius: '20px',
                          padding: '2rem 1rem',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                        <h2 className="text-white mb-2" style={{ fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                          {stat.count}
                        </h2>
                        <p className="text-white mb-0" style={{ 
                          fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', 
                          fontWeight: 600,
                          opacity: 0.9
                        }}>
                          {stat.label}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .d-flex.align-items-center.justify-content-center {
            flex-direction: column !important;
            text-align: center;
          }
          .d-flex.align-items-center.justify-content-center .me-4 {
            margin-right: 0 !important;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
