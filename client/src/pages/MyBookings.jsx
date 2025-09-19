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
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
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
      position: 'relative',
      overflow: 'hidden'
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

      {/* Floating Elements */}
      <div style={{
        position: 'fixed',
        top: '15%',
        left: '5%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        animation: 'morph 15s ease-in-out infinite',
        zIndex: 1
      }} />
      <div style={{
        position: 'fixed',
        top: '70%',
        right: '8%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%)',
        borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
        animation: 'morph 12s ease-in-out infinite reverse',
        zIndex: 1
      }} />

      <Container style={{ position: 'relative', zIndex: 2 }}>
        {/* 🎯 PROFESSIONAL HEADER - PERFECTLY ALIGNED */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          paddingTop: '1rem'
        }}>
          {/* Clean Title Section */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
            }}>
              <span style={{ fontSize: '16px', color: 'white' }}>📊</span>
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1a202c',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              My Bookings
            </h1>
          </div>
          
          {/* Professional Subtitle */}
          <p style={{
            fontSize: '0.95rem',
            color: '#64748b',
            fontWeight: '500',
            margin: 0,
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5
          }}>
            {bookings.length === 0 
              ? "Manage your property reservations and bookings" 
              : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} • Manage your reservations`
            }
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" style={{ 
            borderRadius: '10px', 
            border: 'none',
            fontSize: '0.9rem',
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            borderLeft: '3px solid #ef4444',
            padding: '1rem 1.25rem'
          }}>
            <div className="d-flex align-items-center">
              <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8} xl={6}>
              {/* 🎯 PROFESSIONAL EMPTY STATE CARD */}
              <Card 
                className="border-0"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}
              >
                <Card.Body style={{ padding: '2.5rem 2rem' }}>
                  {/* Clean Icon */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}>
                      <span style={{ color: 'white', fontSize: '24px' }}>🏠</span>
                    </div>
                  </div>

                  {/* Professional Title */}
                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1.375rem', 
                    color: '#1a202c',
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.025em'
                  }}>
                    Ready to Book Your First Property?
                  </h3>
                  
                  {/* Clean Description */}
                  <p style={{ 
                    color: '#64748b', 
                    lineHeight: 1.6,
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '0.95rem'
                  }}>
                    Discover thousands of amazing properties worldwide. From cozy apartments to luxury villas, 
                    find your perfect stay with verified hosts and instant booking.
                  </p>

                  {/* Professional Feature Grid */}
                  <div style={{ marginBottom: '2rem' }}>
                    <Row className="g-3">
                      {[
                        { icon: '✅', title: 'Verified Hosts', desc: 'All properties verified' },
                        { icon: '⚡', title: 'Instant Booking', desc: 'Book in seconds' },
                        { icon: '🛡️', title: 'Secure Payment', desc: '100% safe & secure' },
                        { icon: '🌟', title: '24/7 Support', desc: 'Always here to help' }
                      ].map((feature, index) => (
                        <Col xs={6} key={index}>
                          <div style={{
                            textAlign: 'center',
                            padding: '1rem 0.5rem',
                            background: 'rgba(248, 250, 252, 0.8)',
                            borderRadius: '8px',
                            border: '1px solid rgba(226, 232, 240, 0.5)'
                          }}>
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.icon}</div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '600', 
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>
                              {feature.title}
                            </div>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#6b7280'
                            }}>
                              {feature.desc}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Professional Stats */}
                  <div style={{
                    background: 'rgba(241, 245, 249, 0.7)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '10px',
                    padding: '1.5rem',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    marginBottom: '2rem'
                  }}>
                    <Row className="text-center g-0">
                      {[
                        { number: '50K+', label: 'Properties', color: '#667eea' },
                        { number: '190+', label: 'Countries', color: '#10b981' },
                        { number: '2M+', label: 'Happy Guests', color: '#f59e0b' }
                      ].map((stat, index) => (
                        <Col xs={4} key={index}>
                          <div style={{ 
                            color: stat.color, 
                            fontWeight: '700', 
                            fontSize: '1.125rem',
                            marginBottom: '0.25rem',
                            letterSpacing: '-0.025em'
                          }}>
                            {stat.number}
                          </div>
                          <div style={{ 
                            color: '#6b7280', 
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {stat.label}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Professional CTA Button */}
                  <div style={{ textAlign: 'center' }}>
                    <Button 
                      as={Link} 
                      to="/find-property" 
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1.75rem',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      Explore Properties
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* 🎯 PROFESSIONAL SEARCH & FILTER CARD */}
            <Card className="mb-4 border-0" style={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ 
                    fontWeight: '600', 
                    color: '#1a202c', 
                    fontSize: '1rem',
                    letterSpacing: '-0.025em'
                  }}>
                    Search & Filter
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
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)'
                    }}
                  >
                    + New Booking
                  </Button>
                </div>
                
                <Row className="align-items-center g-3">
                  <Col md={5}>
                    <InputGroup size="sm">
                      <InputGroup.Text style={{ 
                        background: 'rgba(248, 250, 252, 0.8)', 
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        fontSize: '0.875rem'
                      }}>
                        🔍
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search properties, locations, or booking IDs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                          border: '1px solid rgba(226, 232, 240, 0.8)', 
                          fontSize: '0.875rem',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select 
                      size="sm"
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{ 
                        border: '1px solid rgba(226, 232, 240, 0.8)', 
                        fontSize: '0.875rem',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
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
                      style={{ 
                        border: '1px solid rgba(226, 232, 240, 0.8)', 
                        fontSize: '0.875rem',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
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

            {/* Professional Results Summary */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ 
                color: '#374151', 
                fontWeight: '600', 
                margin: 0, 
                fontSize: '0.9rem',
                letterSpacing: '-0.025em'
              }}>
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
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}
                    >
                      {getStatusIcon(status.key)} {count}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {/* Professional Bookings List */}
            {filteredBookings.length === 0 ? (
              <Card className="text-center border-0" style={{ 
                background: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '2rem'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                  <h5 style={{ fontWeight: '600', color: '#1a202c', fontSize: '1.125rem' }}>
                    No bookings found
                  </h5>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
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
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                      }}
                    >
                      <Card.Body className="p-0">
                        <BookingCard booking={booking} />
                        <div style={{ 
                          padding: '1rem 1.25rem', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderTop: '1px solid rgba(226, 232, 240, 0.5)'
                        }}>
                          <Badge 
                            bg={getStatusBadgeVariant(booking.status)}
                            style={{ 
                              padding: '0.375rem 0.75rem',
                              borderRadius: '6px',
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
                              borderRadius: '6px',
                              fontWeight: '500',
                              padding: '0.375rem 0.875rem',
                              fontSize: '0.8rem',
                              borderColor: '#667eea',
                              color: '#667eea'
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

            {/* Professional Analytics Dashboard */}
            <Card 
              className="mt-4 border-0"
              style={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Card.Body style={{ padding: '2rem' }}>
                <h5 className="text-white mb-3 text-center" style={{ 
                  fontWeight: '600', 
                  fontSize: '1rem',
                  letterSpacing: '-0.025em'
                }}>
                  📊 Booking Overview
                </h5>
                
                <Row className="text-center g-3">
                  {[
                    { count: bookings.length, label: 'Total', icon: '📋' },
                    { count: getBookingsByStatus('active').length, label: 'Active', icon: '🟢' },
                    { count: getBookingsByStatus('pending').length, label: 'Pending', icon: '🟡' },
                    { count: getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length, label: 'Completed', icon: '✅' }
                  ].map((stat, index) => (
                    <Col xs={6} md={3} key={index}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '1.25rem 1rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                        <h4 className="text-white mb-1" style={{ 
                          fontWeight: '700', 
                          fontSize: '1.375rem',
                          letterSpacing: '-0.025em'
                        }}>
                          {stat.count}
                        </h4>
                        <small className="text-white" style={{ 
                          opacity: 0.9, 
                          fontSize: '0.8rem', 
                          fontWeight: '500' 
                        }}>
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes morph {
          0%, 100% { 
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: rotate(0deg);
          }
          25% { 
            border-radius: 58% 42% 75% 25% / 76% 24% 76% 24%;
            transform: rotate(90deg);
          }
          50% { 
            border-radius: 50% 50% 33% 67% / 55% 45% 55% 45%;
            transform: rotate(180deg);
          }
          75% { 
            border-radius: 33% 67% 58% 42% / 63% 37% 63% 37%;
            transform: rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
