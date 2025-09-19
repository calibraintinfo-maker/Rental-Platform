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
      <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <div 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  animation: 'pulse 2s infinite'
                }}
              >
                <Spinner animation="border" variant="light" size="sm" />
              </div>
              <h5 className="text-muted">Loading Your Bookings...</h5>
              <p className="text-muted small">Please wait while we fetch your booking history</p>
            </Col>
          </Row>
          <style jsx>{`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}</style>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <Container className="py-4">
        <Row>
          <Col>
            {/* 🔧 FIX: Compact Professional Header */}
            <div className="text-center mb-4">
              <h1 className="mb-2" style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                📋 My Bookings
              </h1>
              {/* 🔧 FIX: More concise subtitle */}
              <p className="text-muted small mb-0">
                {bookings.length === 0 
                  ? "Your booking journey starts here" 
                  : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} in your account`
                }
              </p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3" style={{ borderRadius: '10px', borderLeft: '4px solid #dc3545' }}>
                <Alert.Heading className="h6">⚠️ Error</Alert.Heading>
                <small>{error}</small>
              </Alert>
            )}

            {bookings.length === 0 ? (
              /* 🔧 FIX: Much more compact empty state card */
              <Card 
                className="text-center border-0 mx-auto" 
                style={{ 
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  maxWidth: '500px'
                }}
              >
                <Card.Body className="py-4 px-4">
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '2rem',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    📅
                  </div>
                  <h4 className="mb-2" style={{ fontWeight: 600, fontSize: '1.25rem' }}>Ready to Book Your First Property?</h4>
                  <p className="text-muted mb-3" style={{ 
                    fontSize: '0.95rem', 
                    lineHeight: 1.5
                  }}>
                    Discover amazing properties and start your rental journey with verified listings.
                  </p>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 24px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    🔍 Explore Properties
                  </Button>
                  <div className="mt-2">
                    <small className="text-muted">
                      Browse verified properties across India
                    </small>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* Search & Filter Section - More Compact */}
                <Card className="mb-3 border-0" style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)' }}>
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0" style={{ fontWeight: 600 }}>
                        Filter & Search
                      </h6>
                      <Button 
                        as={Link} 
                        to="/find-property" 
                        size="sm"
                        variant="outline-primary"
                        style={{
                          borderRadius: '6px',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          padding: '6px 12px'
                        }}
                      >
                        + Add New
                      </Button>
                    </div>
                    
                    <Row className="align-items-center">
                      <Col md={4} className="mb-2 mb-md-0">
                        <InputGroup size="sm">
                          <InputGroup.Text style={{ background: 'transparent', border: 'none', fontSize: '0.85rem' }}>
                            🔍
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                              border: '1px solid #e9ecef',
                              borderRadius: '6px',
                              fontSize: '0.85rem'
                            }}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={4} className="mb-2 mb-md-0">
                        <Form.Select 
                          size="sm"
                          value={selectedStatus} 
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          style={{ 
                            border: '1px solid #e9ecef',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="all">All Status</option>
                          {statusSections.map(status => (
                            <option key={status.key} value={status.key}>
                              {getStatusIcon(status.key)} {status.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={4}>
                        <Form.Select 
                          size="sm"
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          style={{ 
                            border: '1px solid #e9ecef',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="checkIn">Check-in Date</option>
                          <option value="status">By Status</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Compact Results Summary */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted mb-0">
                    {filteredBookings.length} of {bookings.length} bookings
                  </small>
                  <div className="d-flex gap-1 flex-wrap">
                    {statusSections.map(status => {
                      const count = getBookingsByStatus(status.key).length;
                      return count > 0 ? (
                        <Badge 
                          key={status.key}
                          bg={status.color}
                          style={{ 
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 500
                          }}
                        >
                          {getStatusIcon(status.key)} {count}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Bookings List - More Compact */}
                {filteredBookings.length === 0 ? (
                  <Card className="text-center py-3 border-0" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
                    <Card.Body>
                      <h6>🔍 No bookings found</h6>
                      <small className="text-muted">Try adjusting your search or filter criteria</small>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="booking-list">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="mb-3">
                        <Card 
                          className="border-0"
                          style={{ 
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                          }}
                        >
                          <Card.Body className="p-0">
                            <BookingCard booking={booking} />
                            <div className="px-3 pb-2 d-flex justify-content-between align-items-center">
                              <Badge 
                                bg={getStatusBadgeVariant(booking.status)}
                                style={{ 
                                  padding: '6px 12px',
                                  borderRadius: '15px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}
                              >
                                {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                as={Link}
                                to={`/booking/${booking._id}`}
                                style={{
                                  borderRadius: '6px',
                                  fontWeight: 500,
                                  fontSize: '0.8rem',
                                  padding: '6px 12px',
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

                {/* Compact Summary Card */}
                <Card 
                  className="mt-4 border-0"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    color: 'white'
                  }}
                >
                  <Card.Header 
                    className="border-0 pb-0"
                    style={{ background: 'transparent' }}
                  >
                    <h6 className="mb-0 text-white">📊 Overview</h6>
                  </Card.Header>
                  <Card.Body className="pt-2 pb-3">
                    <Row className="text-center">
                      <Col xs={3} className="mb-2">
                        <div 
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '1rem 0.5rem',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <h5 className="mb-1 text-white">{bookings.length}</h5>
                          <small className="text-white opacity-75">Total</small>
                        </div>
                      </Col>
                      <Col xs={3} className="mb-2">
                        <div 
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '1rem 0.5rem',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <h5 className="mb-1 text-white">{getBookingsByStatus('active').length}</h5>
                          <small className="text-white opacity-75">Active</small>
                        </div>
                      </Col>
                      <Col xs={3} className="mb-2">
                        <div 
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '1rem 0.5rem',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <h5 className="mb-1 text-white">{getBookingsByStatus('pending').length}</h5>
                          <small className="text-white opacity-75">Pending</small>
                        </div>
                      </Col>
                      <Col xs={3} className="mb-2">
                        <div 
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '1rem 0.5rem',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <h5 className="mb-1 text-white">{getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length}</h5>
                          <small className="text-white opacity-75">Done</small>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>

        {/* 🔧 FIX: CSS animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default MyBookings;
