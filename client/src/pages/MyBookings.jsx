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
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
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
                animation: 'pulse 2s infinite'
              }}
            >
              <Spinner animation="border" variant="light" />
            </div>
            <h4 className="text-muted">Loading Your Bookings...</h4>
            <p className="text-muted">Please wait while we fetch your booking history</p>
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
    );
  }

  return (
    <Container className="py-4" style={{ paddingTop: '100px' }}>
      <Row>
        <Col>
          {/* 🔧 FIX: Professional Header Section - No duplicate button */}
          <div className="mb-4">
            <div className="text-center mb-4">
              <h1 className="mb-3" style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                📋 My Bookings
              </h1>
              {/* 🔧 FIX: Professional subtitle */}
              <p className="text-muted" style={{ 
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                {bookings.length === 0 
                  ? "Your booking journey starts here" 
                  : `You have ${bookings.length} booking${bookings.length !== 1 ? 's' : ''} in total`
                }
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4" style={{ borderRadius: '12px', borderLeft: '4px solid #dc3545' }}>
              <Alert.Heading>⚠️ Error</Alert.Heading>
              {error}
            </Alert>
          )}

          {bookings.length === 0 ? (
            /* 🔧 FIX: Single Browse Properties button in empty state */
            <Card 
              className="text-center py-5 border-0" 
              style={{ 
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Card.Body className="py-5">
                <div className="mb-4">
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
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    📅
                  </div>
                </div>
                <h3 className="mb-3" style={{ fontWeight: 700 }}>Ready to Book Your First Property?</h3>
                <p className="text-muted mb-4" style={{ 
                  fontSize: '1.1rem', 
                  maxWidth: '500px', 
                  margin: '0 auto 2rem',
                  lineHeight: 1.6
                }}>
                  Discover amazing properties and start your rental journey with verified listings from trusted hosts.
                </p>
                <Button 
                  as={Link} 
                  to="/find-property" 
                  size="lg"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '18px 40px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  🔍 Explore Properties
                </Button>
                <div className="mt-4">
                  <small className="text-muted">
                    Browse from thousands of verified properties across India
                  </small>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <>
              {/* Search & Filter Section */}
              <Card className="mb-4 border-0" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0" style={{ fontWeight: 600 }}>
                      Filter & Search Your Bookings
                    </h5>
                    <Button 
                      as={Link} 
                      to="/find-property" 
                      size="sm"
                      variant="outline-primary"
                      style={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        padding: '8px 16px'
                      }}
                    >
                      + Add New Booking
                    </Button>
                  </div>
                  
                  <Row className="align-items-center">
                    <Col md={4} className="mb-3 mb-md-0">
                      <InputGroup>
                        <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
                          🔍
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search bookings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ 
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                      <Form.Select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ 
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '12px'
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
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ 
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '12px'
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

              {/* Results Summary */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 text-muted">
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
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 500
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
                <Card className="text-center py-4 border-0" style={{ background: '#f8f9fa', borderRadius: '12px' }}>
                  <Card.Body>
                    <h5>🔍 No bookings found</h5>
                    <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
                  </Card.Body>
                </Card>
              ) : (
                <div className="booking-list">
                  {filteredBookings.map((booking) => (
                    <div key={booking._id} className="mb-4">
                      <Card 
                        className="border-0 shadow-sm"
                        style={{ 
                          borderRadius: '16px',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease'
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
                          <div className="px-4 pb-3 d-flex justify-content-between align-items-center">
                            <Badge 
                              bg={getStatusBadgeVariant(booking.status)}
                              style={{ 
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
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
                                borderRadius: '8px',
                                fontWeight: 600,
                                padding: '8px 16px',
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

              {/* Enhanced Summary Card */}
              <Card 
                className="mt-5 border-0"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '20px',
                  color: 'white'
                }}
              >
                <Card.Header 
                  className="border-0 pb-0"
                  style={{ background: 'transparent' }}
                >
                  <h5 className="mb-0 text-white">📊 Booking Overview</h5>
                </Card.Header>
                <Card.Body className="pt-3">
                  <Row className="text-center">
                    <Col md={3} className="mb-3">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <h2 className="mb-2 text-white">{bookings.length}</h2>
                        <p className="mb-0 text-white opacity-75">Total</p>
                      </div>
                    </Col>
                    <Col md={3} className="mb-3">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <h2 className="mb-2 text-white">{getBookingsByStatus('active').length}</h2>
                        <p className="mb-0 text-white opacity-75">Active</p>
                      </div>
                    </Col>
                    <Col md={3} className="mb-3">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <h2 className="mb-2 text-white">{getBookingsByStatus('pending').length}</h2>
                        <p className="mb-0 text-white opacity-75">Pending</p>
                      </div>
                    </Col>
                    <Col md={3} className="mb-3">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <h2 className="mb-2 text-white">{getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length}</h2>
                        <p className="mb-0 text-white opacity-75">Completed</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>

      {/* 🔧 FIX: Added CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Container>
  );
};

export default MyBookings;
