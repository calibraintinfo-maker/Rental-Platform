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
        background: `
          linear-gradient(135deg, #667eea 0%, #764ba2 100%),
          radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        backgroundBlendMode: 'overlay',
        minHeight: '100vh', 
        paddingTop: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
          <h5 className="mt-3 text-white">Loading Your Bookings...</h5>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: `
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%),
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.03) 0%, transparent 50%)
      `,
      backgroundAttachment: 'fixed',
      minHeight: '100vh', 
      paddingTop: '100px',
      position: 'relative'
    }}>
      {/* Professional Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0),
          linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 30.5%, rgba(255,255,255,0.1) 31%, transparent 31.5%)
        `,
        backgroundSize: '20px 20px, 40px 40px',
        zIndex: 0,
        opacity: 0.6
      }} />

      <Container style={{ position: 'relative', zIndex: 2 }}>
        {/* 🎯 SIMPLE HEADER - NO ICON */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1a202c',
            margin: '0 0 0.5rem 0'
          }}>
            My Bookings
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: 0
          }}>
            {bookings.length === 0 
              ? "Manage your property reservations and bookings" 
              : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} found`
            }
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" style={{ 
            borderRadius: '8px', 
            border: 'none',
            fontSize: '0.875rem',
            background: 'rgba(239, 68, 68, 0.1)',
            borderLeft: '3px solid #ef4444'
          }}>
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              {/* 🎯 SIMPLE EMPTY STATE - COMPACT */}
              <Card 
                className="border-0 text-center"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Card.Body style={{ padding: '2rem 1.5rem' }}>
                  {/* Simple Icon */}
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px' }}>📅</span>
                  </div>

                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1.125rem', 
                    color: '#1a202c',
                    marginBottom: '0.5rem'
                  }}>
                    No Bookings Yet
                  </h3>
                  
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem',
                    lineHeight: 1.5
                  }}>
                    You haven't made any bookings yet. Start exploring our amazing properties to make your first booking!
                  </p>

                  <Button 
                    as={Link} 
                    to="/find-property" 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    🔍 Browse Properties
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* 🎯 SIMPLE SEARCH & FILTER */}
            <Card className="mb-4 border-0" style={{ 
              borderRadius: '10px', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}>
              <Card.Body style={{ padding: '1rem' }}>
                <Row className="align-items-center g-2">
                  <Col md={4}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        🔍
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select 
                      size="sm"
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{ border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                    >
                      <option value="all">All Status</option>
                      {statusSections.map(status => (
                        <option key={status.key} value={status.key}>
                          {status.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select 
                      size="sm"
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="checkIn">By Check-in</option>
                      <option value="status">By Status</option>
                    </Form.Select>
                  </Col>
                  
                  <Col md={2}>
                    <Button 
                      as={Link} 
                      to="/find-property" 
                      size="sm"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '500',
                        width: '100%'
                      }}
                    >
                      + New
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Simple Results */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>
                {filteredBookings.length} of {bookings.length} bookings
              </span>
              <div className="d-flex gap-1">
                {statusSections.map(status => {
                  const count = getBookingsByStatus(status.key).length;
                  return count > 0 ? (
                    <Badge 
                      key={status.key}
                      bg={status.color}
                      style={{ 
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}
                    >
                      {count}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Simple Bookings List */}
            {filteredBookings.length === 0 ? (
              <Card className="text-center py-4 border-0" style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                  <h5 style={{ fontWeight: '600', color: '#1a202c' }}>No bookings found</h5>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                    Try adjusting your search or filters
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
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      <Card.Body className="p-0">
                        <BookingCard booking={booking} />
                        <div style={{ 
                          padding: '0.75rem 1rem', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderTop: '1px solid #f1f5f9'
                        }}>
                          <Badge 
                            bg={getStatusBadgeVariant(booking.status)}
                            style={{ 
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
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
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              padding: '0.25rem 0.75rem'
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Simple Stats */}
            <Card 
              className="mt-4 border-0"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                color: 'white'
              }}
            >
              <Card.Body style={{ padding: '1.5rem' }}>
                <h6 className="text-center mb-3" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  📊 Quick Overview
                </h6>
                
                <Row className="text-center">
                  {[
                    { count: bookings.length, label: 'Total' },
                    { count: getBookingsByStatus('active').length, label: 'Active' },
                    { count: getBookingsByStatus('pending').length, label: 'Pending' },
                    { count: getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length, label: 'Completed' }
                  ].map((stat, index) => (
                    <Col xs={3} key={index}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        padding: '0.75rem 0.5rem'
                      }}>
                        <h5 className="text-white mb-1" style={{ fontWeight: '700', fontSize: '1.125rem' }}>
                          {stat.count}
                        </h5>
                        <small className="text-white" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
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
