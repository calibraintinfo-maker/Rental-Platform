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
      <Container style={{ marginTop: '120px', minHeight: '80vh' }}>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div 
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                animation: 'pulse 2s infinite'
              }}
            >
              <Spinner animation="border" variant="light" />
            </div>
            <h4 style={{ fontWeight: 600, color: '#2d3748' }}>Loading Your Bookings...</h4>
            <p className="text-muted">Please wait while we fetch your booking history</p>
          </Col>
        </Row>
        <style jsx>{`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4); }
            100% { transform: scale(1); box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }
          }
        `}</style>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '100px' }}>
      <Container className="py-5">
        <Row>
          <Col>
            {/* 🔥 PROFESSIONAL HEADER - Enterprise Level */}
            <div className="text-center mb-5">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.25)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <span style={{ fontSize: '28px', color: 'white' }}>📋</span>
                </div>
                <h1 style={{ 
                  fontSize: '2.75rem', 
                  fontWeight: 'bold',
                  color: '#1a202c',
                  margin: 0
                }}>
                  My Bookings
                </h1>
              </div>
              <p style={{ 
                fontSize: '1.1rem',
                color: '#718096',
                maxWidth: '600px',
                margin: '0 auto',
                fontWeight: 500
              }}>
                {bookings.length === 0 
                  ? "Your booking journey starts here. Discover amazing properties and create unforgettable experiences." 
                  : `Managing ${bookings.length} booking${bookings.length !== 1 ? 's' : ''} in your portfolio`
                }
              </p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4" style={{ 
                borderRadius: '12px', 
                border: 'none',
                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.15)',
                borderLeft: '4px solid #dc3545'
              }}>
                <div className="d-flex align-items-center">
                  <span style={{ fontSize: '20px', marginRight: '12px' }}>⚠️</span>
                  <div>
                    <Alert.Heading className="h6 mb-1">Something went wrong</Alert.Heading>
                    <small>{error}</small>
                  </div>
                </div>
              </Alert>
            )}

            {bookings.length === 0 ? (
              /* 🔥 PREMIUM EMPTY STATE - Professional Design */
              <Card 
                className="text-center border-0 mx-auto" 
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  maxWidth: '600px',
                  overflow: 'hidden'
                }}
              >
                <Card.Body className="px-5 py-5">
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      width: '120px',
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem',
                      fontSize: '3rem',
                      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <span style={{ color: 'white' }}>🏠</span>
                  </div>
                  <h2 className="mb-3" style={{ 
                    fontWeight: 700, 
                    fontSize: '1.75rem', 
                    color: '#1a202c',
                    lineHeight: 1.2
                  }}>
                    Ready to Book Your First Property?
                  </h2>
                  <p className="mb-4" style={{ 
                    fontSize: '1.125rem', 
                    lineHeight: 1.6,
                    color: '#4a5568',
                    maxWidth: '460px',
                    margin: '0 auto 2rem'
                  }}>
                    Discover thousands of amazing properties around the world. From cozy apartments to luxury villas, 
                    find your perfect stay with verified hosts and instant booking.
                  </p>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
                      transition: 'all 0.3s ease',
                      minWidth: '200px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.45)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.35)';
                    }}
                  >
                    🔍 Explore Properties
                  </Button>
                  <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <div className="row text-center">
                      <div className="col-4">
                        <h5 style={{ color: '#667eea', fontWeight: 700, fontSize: '1.5rem' }}>50K+</h5>
                        <small style={{ color: '#718096', fontWeight: 500 }}>Properties</small>
                      </div>
                      <div className="col-4">
                        <h5 style={{ color: '#667eea', fontWeight: 700, fontSize: '1.5rem' }}>190+</h5>
                        <small style={{ color: '#718096', fontWeight: 500 }}>Countries</small>
                      </div>
                      <div className="col-4">
                        <h5 style={{ color: '#667eea', fontWeight: 700, fontSize: '1.5rem' }}>2M+</h5>
                        <small style={{ color: '#718096', fontWeight: 500 }}>Happy Guests</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* 🔥 PROFESSIONAL SEARCH & FILTER */}
                <Card className="mb-4 border-0" style={{ 
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  background: 'white'
                }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0" style={{ fontWeight: 700, color: '#1a202c' }}>
                        📊 Filter & Search Your Bookings
                      </h5>
                      <Button 
                        as={Link} 
                        to="/find-property" 
                        variant="primary"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          padding: '8px 20px',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }}
                      >
                        + New Booking
                      </Button>
                    </div>
                    
                    <Row className="align-items-center">
                      <Col lg={4} className="mb-3 mb-lg-0">
                        <InputGroup>
                          <InputGroup.Text style={{ 
                            background: '#f7fafc', 
                            border: '2px solid #e2e8f0',
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
                              border: '2px solid #e2e8f0',
                              borderLeft: 'none',
                              padding: '12px 16px',
                              fontSize: '0.95rem'
                            }}
                          />
                        </InputGroup>
                      </Col>
                      <Col lg={4} className="mb-3 mb-lg-0">
                        <Form.Select 
                          value={selectedStatus} 
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          style={{ 
                            border: '2px solid #e2e8f0',
                            padding: '12px 16px',
                            fontSize: '0.95rem',
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
                      <Col lg={4}>
                        <Form.Select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          style={{ 
                            border: '2px solid #e2e8f0',
                            padding: '12px 16px',
                            fontSize: '0.95rem',
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

                {/* Professional Results Summary */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="mb-0" style={{ color: '#4a5568', fontWeight: 600 }}>
                    Showing {filteredBookings.length} of {bookings.length} bookings
                  </h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {statusSections.map(status => {
                      const count = getBookingsByStatus(status.key).length;
                      return count > 0 ? (
                        <Badge 
                          key={status.key}
                          bg={status.color}
                          style={{ 
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
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
                    background: '#f7fafc', 
                    borderRadius: '16px' 
                  }}>
                    <Card.Body>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                      <h5 style={{ fontWeight: 600, color: '#2d3748' }}>No bookings found</h5>
                      <p className="text-muted mb-0">Try adjusting your search criteria or filters</p>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="booking-list">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="mb-4">
                        <Card 
                          className="border-0"
                          style={{ 
                            borderRadius: '16px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                          }}
                        >
                          <Card.Body className="p-0">
                            <BookingCard booking={booking} />
                            <div className="px-4 pb-4 d-flex justify-content-between align-items-center">
                              <Badge 
                                bg={getStatusBadgeVariant(booking.status)}
                                style={{ 
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  fontSize: '0.85rem',
                                  fontWeight: 600
                                }}
                              >
                                {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <Button
                                variant="outline-primary"
                                as={Link}
                                to={`/booking/${booking._id}`}
                                style={{
                                  borderRadius: '8px',
                                  fontWeight: 600,
                                  padding: '8px 20px',
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

                {/* Premium Summary Dashboard */}
                <Card 
                  className="mt-5 border-0"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px',
                    color: 'white',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.25)'
                  }}
                >
                  <Card.Body className="p-4">
                    <h5 className="mb-4 text-white d-flex align-items-center">
                      <span style={{ marginRight: '12px' }}>📊</span>
                      Booking Analytics Overview
                    </h5>
                    <Row className="text-center">
                      {[
                        { count: bookings.length, label: 'Total Bookings', icon: '📋' },
                        { count: getBookingsByStatus('active').length, label: 'Active', icon: '🟢' },
                        { count: getBookingsByStatus('pending').length, label: 'Pending', icon: '🟡' },
                        { count: getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length, label: 'Completed', icon: '✅' }
                      ].map((stat, index) => (
                        <Col md={3} key={index} className="mb-3">
                          <div 
                            style={{
                              background: 'rgba(255, 255, 255, 0.15)',
                              borderRadius: '16px',
                              padding: '1.5rem',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                            <h3 className="mb-2 text-white" style={{ fontWeight: 700 }}>{stat.count}</h3>
                            <p className="mb-0 text-white opacity-75" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
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
          </Col>
        </Row>

        {/* Professional CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4); }
            100% { transform: scale(1); box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default MyBookings;
