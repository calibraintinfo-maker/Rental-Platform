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
        backgroundColor: '#f8fafc', 
        minHeight: '100vh', 
        paddingTop: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <h5 className="mt-3 text-muted">Loading Your Bookings...</h5>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh', 
      paddingTop: '100px' 
    }}>
      <Container className="py-4">
        {/* 🔥 COMPACT PROFESSIONAL HEADER */}
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <div 
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
              }}
            >
              <span style={{ fontSize: '24px', color: 'white' }}>📋</span>
            </div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700',
              color: '#1a202c',
              margin: 0
            }}>
              My Bookings
            </h1>
          </div>
          <p style={{ 
            fontSize: '1rem',
            color: '#64748b',
            maxWidth: '500px',
            margin: '0 auto',
            fontWeight: 500
          }}>
            {bookings.length === 0 
              ? "Your booking journey starts here" 
              : `Manage your ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" style={{ 
            borderRadius: '8px', 
            border: 'none',
            fontSize: '0.9rem'
          }}>
            <div className="d-flex align-items-center">
              <span style={{ fontSize: '18px', marginRight: '8px' }}>⚠️</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              {/* 🔥 COMPACT EMPTY STATE */}
              <Card 
                className="border-0 text-center"
                style={{ 
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                  overflow: 'hidden'
                }}
              >
                <Card.Body className="p-4">
                  <div 
                    className="mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}
                  >
                    <span style={{ color: 'white' }}>🏠</span>
                  </div>

                  <h3 className="mb-3" style={{ 
                    fontWeight: '600', 
                    fontSize: '1.5rem', 
                    color: '#1a202c'
                  }}>
                    Ready to Book Your First Property?
                  </h3>
                  
                  <p className="mb-4 text-muted">
                    Discover thousands of amazing properties around the world. From cozy apartments to luxury villas, 
                    find your perfect stay with verified hosts and instant booking.
                  </p>

                  {/* Compact Features */}
                  <Row className="mb-4 text-center">
                    {[
                      { icon: '✅', title: 'Verified Hosts' },
                      { icon: '⚡', title: 'Instant Booking' },
                      { icon: '🛡️', title: 'Secure Payment' },
                      { icon: '🌟', title: '24/7 Support' }
                    ].map((feature, index) => (
                      <Col xs={3} key={index}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                        <small style={{ color: '#64748b', fontWeight: '500' }}>{feature.title}</small>
                      </Col>
                    ))}
                  </Row>

                  {/* Compact Stats */}
                  <div 
                    className="mb-4 py-3 px-4"
                    style={{ 
                      background: '#f1f5f9',
                      borderRadius: '12px'
                    }}
                  >
                    <Row className="text-center">
                      {[
                        { number: '50K+', label: 'Properties' },
                        { number: '190+', label: 'Countries' },
                        { number: '2M+', label: 'Happy Guests' }
                      ].map((stat, index) => (
                        <Col xs={4} key={index}>
                          <h5 style={{ 
                            color: '#667eea', 
                            fontWeight: '700', 
                            fontSize: '1.25rem',
                            marginBottom: '0.25rem'
                          }}>
                            {stat.number}
                          </h5>
                          <small style={{ color: '#64748b', fontWeight: '500' }}>
                            {stat.label}
                          </small>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <Button 
                    as={Link} 
                    to="/find-property" 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}
                  >
                    🔍 Explore Properties
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* 🔥 COMPACT SEARCH & FILTER */}
            <Card className="mb-4 border-0" style={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              background: 'white'
            }}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ fontWeight: '600', color: '#1a202c', fontSize: '1.1rem' }}>
                    Filter & Search
                  </h5>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="sm"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      padding: '6px 16px',
                      fontSize: '0.85rem'
                    }}
                  >
                    + New Booking
                  </Button>
                </div>
                
                <Row className="align-items-center g-3">
                  <Col md={5}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        🔍
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search by property, location, or booking ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select 
                      size="sm"
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{ border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                    >
                      <option value="all">All Status</option>
                      {statusSections.map(status => (
                        <option key={status.key} value={status.key}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Select 
                      size="sm"
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
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

            {/* Compact Results Summary */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ color: '#374151', fontWeight: '600', margin: 0, fontSize: '0.95rem' }}>
                {filteredBookings.length} of {bookings.length} bookings
              </h6>
              <div className="d-flex gap-2 flex-wrap">
                {statusSections.map(status => {
                  const count = getBookingsByStatus(status.key).length;
                  return count > 0 ? (
                    <Badge 
                      key={status.key}
                      bg={status.color}
                      style={{ 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {getStatusIcon(status.key)} {count}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Compact Bookings List */}
            {filteredBookings.length === 0 ? (
              <Card className="text-center py-4 border-0" style={{ 
                background: 'white', 
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                  <h5 style={{ fontWeight: '600', color: '#1a202c', fontSize: '1.25rem' }}>
                    No bookings found
                  </h5>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                    Try adjusting your search criteria or filters
                  </p>
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
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                        background: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
                      }}
                    >
                      <Card.Body className="p-0">
                        <BookingCard booking={booking} />
                        <div className="px-3 pb-3 d-flex justify-content-between align-items-center">
                          <Badge 
                            bg={getStatusBadgeVariant(booking.status)}
                            style={{ 
                              padding: '6px 12px',
                              borderRadius: '16px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as={Link}
                            to={`/booking/${booking._id}`}
                            style={{
                              borderRadius: '6px',
                              fontWeight: '600',
                              padding: '6px 16px',
                              fontSize: '0.85rem'
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

            {/* Compact Analytics Dashboard */}
            <Card 
              className="mt-4 border-0"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)'
              }}
            >
              <Card.Body className="p-4">
                <h5 className="text-white mb-3 text-center" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  📊 Booking Overview
                </h5>
                
                <Row className="text-center">
                  {[
                    { count: bookings.length, label: 'Total', icon: '📋' },
                    { count: getBookingsByStatus('active').length, label: 'Active', icon: '🟢' },
                    { count: getBookingsByStatus('pending').length, label: 'Pending', icon: '🟡' },
                    { count: getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length, label: 'Completed', icon: '✅' }
                  ].map((stat, index) => (
                    <Col xs={6} md={3} key={index} className="mb-3 mb-md-0">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: '12px',
                          padding: '1rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                        <h4 className="text-white mb-1" style={{ fontWeight: '700', fontSize: '1.5rem' }}>
                          {stat.count}
                        </h4>
                        <small className="text-white" style={{ opacity: 0.9, fontSize: '0.85rem', fontWeight: '500' }}>
                          {stat.label}
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default MyBookings;
