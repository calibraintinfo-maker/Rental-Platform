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
        {/* 🎯 PROFESSIONAL HEADER */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          paddingTop: '1rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em'
          }}>
            My Bookings
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#64748b',
            fontWeight: '500',
            margin: 0,
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5
          }}>
            {bookings.length === 0 
              ? "Manage and track all your property bookings" 
              : `Manage and track all your property reservations and bookings`
            }
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" style={{ 
            borderRadius: '12px', 
            border: 'none',
            fontSize: '0.95rem',
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            borderLeft: '4px solid #ef4444',
            padding: '1.25rem'
          }}>
            <div className="d-flex align-items-center">
              <span style={{ fontSize: '18px', marginRight: '10px' }}>⚠️</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8} xl={7}>
              {/* 🎯 PROFESSIONAL EMPTY STATE CARD - PERFECT SIZE */}
              <Card 
                className="border-0 text-center"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}
              >
                <Card.Body style={{ padding: '3rem 2.5rem' }}>
                  {/* Professional Icon */}
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}>
                    <span style={{ color: 'white', fontSize: '32px' }}>📅</span>
                  </div>

                  {/* Professional Title */}
                  <h3 style={{ 
                    fontWeight: '700', 
                    fontSize: '1.75rem', 
                    color: '#1a202c',
                    marginBottom: '1rem',
                    letterSpacing: '-0.025em'
                  }}>
                    No Bookings Yet
                  </h3>
                  
                  {/* Professional Description */}
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                    fontWeight: '400'
                  }}>
                    You haven't made any bookings yet. Start exploring our amazing properties to make your first booking!
                  </p>

                  {/* Professional CTA Button */}
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem 2.5rem',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      textTransform: 'none',
                      letterSpacing: '0.025em'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
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
            {/* 🎯 PROFESSIONAL SEARCH & FILTER CARD */}
            <Card className="mb-4 border-0" style={{ 
              borderRadius: '16px', 
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body style={{ padding: '1.75rem' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ 
                    fontWeight: '700', 
                    color: '#1a202c', 
                    fontSize: '1.25rem',
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
                      borderRadius: '8px',
                      fontWeight: '600',
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.25)',
                      letterSpacing: '0.025em'
                    }}
                  >
                    + New Booking
                  </Button>
                </div>
                
                <Row className="align-items-center g-3">
                  <Col md={5}>
                    <InputGroup>
                      <InputGroup.Text style={{ 
                        background: 'rgba(248, 250, 252, 0.9)', 
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        fontSize: '1rem',
                        padding: '0.75rem 1rem'
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
                          fontSize: '1rem',
                          background: 'rgba(255, 255, 255, 0.95)',
                          padding: '0.75rem 1rem'
                        }}
                      />
                    </InputGroup>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Select 
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{ 
                        border: '1px solid rgba(226, 232, 240, 0.8)', 
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '0.75rem 1rem'
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
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ 
                        border: '1px solid rgba(226, 232, 240, 0.8)', 
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '0.75rem 1rem'
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 style={{ 
                color: '#374151', 
                fontWeight: '600', 
                margin: 0, 
                fontSize: '1.1rem',
                letterSpacing: '-0.025em'
              }}>
                {filteredBookings.length} of {bookings.length} bookings found
              </h6>
              <div className="d-flex gap-2 flex-wrap">
                {statusSections.map(status => {
                  const count = getBookingsByStatus(status.key).length;
                  return count > 0 ? (
                    <Badge 
                      key={status.key}
                      bg={status.color}
                      style={{ 
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        letterSpacing: '0.025em'
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
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '3rem 2rem'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h5 style={{ fontWeight: '700', color: '#1a202c', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    No bookings found
                  </h5>
                  <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
                    Try adjusting your search criteria or filters
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
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 15px 45px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <Card.Body className="p-0">
                        <BookingCard booking={booking} />
                        <div style={{ 
                          padding: '1.25rem 1.5rem', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
                          background: 'rgba(248, 250, 252, 0.5)'
                        }}>
                          <Badge 
                            bg={getStatusBadgeVariant(booking.status)}
                            style={{ 
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              letterSpacing: '0.025em'
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
                              borderRadius: '8px',
                              fontWeight: '600',
                              padding: '0.5rem 1.25rem',
                              fontSize: '0.9rem',
                              borderColor: '#667eea',
                              color: '#667eea',
                              letterSpacing: '0.025em'
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
              className="mt-5 border-0"
              style={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                borderRadius: '20px',
                color: 'white',
                boxShadow: '0 15px 45px rgba(102, 126, 234, 0.3)',
                overflow: 'hidden'
              }}
            >
              <Card.Body style={{ padding: '2.5rem' }}>
                <h5 className="text-white mb-4 text-center" style={{ 
                  fontWeight: '700', 
                  fontSize: '1.5rem',
                  letterSpacing: '-0.025em'
                }}>
                  📊 Booking Overview
                </h5>
                
                <Row className="text-center g-4">
                  {[
                    { count: bookings.length, label: 'Total Bookings', icon: '📋', color: 'rgba(255, 255, 255, 0.2)' },
                    { count: getBookingsByStatus('active').length, label: 'Active', icon: '🟢', color: 'rgba(34, 197, 94, 0.3)' },
                    { count: getBookingsByStatus('pending').length, label: 'Pending', icon: '🟡', color: 'rgba(251, 191, 36, 0.3)' },
                    { count: getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length, label: 'Completed', icon: '✅', color: 'rgba(16, 185, 129, 0.3)' }
                  ].map((stat, index) => (
                    <Col xs={6} md={3} key={index}>
                      <div style={{
                        background: stat.color,
                        borderRadius: '16px',
                        padding: '1.75rem 1.25rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
                        <h4 className="text-white mb-2" style={{ 
                          fontWeight: '800', 
                          fontSize: '2rem',
                          letterSpacing: '-0.025em'
                        }}>
                          {stat.count}
                        </h4>
                        <p className="text-white mb-0" style={{ 
                          opacity: 0.9, 
                          fontSize: '1rem', 
                          fontWeight: '600',
                          letterSpacing: '0.025em'
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
    </div>
  );
};

export default MyBookings;
