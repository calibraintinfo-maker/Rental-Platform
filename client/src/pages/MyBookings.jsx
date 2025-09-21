import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api, handleApiError } from '../utils/api';

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
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      ),
      trending: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
        </svg>
      ),
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
    };
    return icons[name] || null;
  };

  const StatusIcon = ({ status, size = 16 }) => {
    const iconProps = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
    };

    switch (status) {
      case 'pending':
        return (
          <svg {...iconProps} style={{ color: '#f59e0b' }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        );
      case 'approved':
        return (
          <svg {...iconProps} style={{ color: '#10b981' }}>
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        );
      case 'active':
        return (
          <svg {...iconProps} style={{ color: '#3b82f6' }}>
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'rejected':
        return (
          <svg {...iconProps} style={{ color: '#ef4444' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default:
        return (
          <svg {...iconProps} style={{ color: '#6b7280' }}>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        );
    }
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

        {/* ✅ COMPLETELY CUSTOM COMPACT BOOKING CARDS - NO DUPLICATES */}
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
                  <Card 
                    key={booking._id}
                    style={{
                      marginBottom: index === filteredBookings.length - 1 ? '0' : '12px',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                      background: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid rgba(226, 232, 240, 0.6)',
                    }}
                    onClick={() => navigate(`/booking/${booking._id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    {/* ✅ SINGLE COMPACT CARD CONTENT - NO DUPLICATES */}
                    <Card.Body style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        
                        {/* Left: Property Image */}
                        <div style={{
                          width: '80px',
                          height: '60px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}>
                          #{booking._id?.slice(-4) || '****'}
                        </div>

                        {/* Center: Booking Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h6 style={{ 
                              margin: 0, 
                              fontWeight: '700', 
                              fontSize: '1rem',
                              color: '#1e293b'
                            }}>
                              {booking.property?.title || 'Property #' + (booking._id?.slice(-4) || '****')}
                            </h6>
                            {/* ✅ SINGLE STATUS BADGE */}
                            <Badge 
                              bg={getStatusBadgeVariant(booking.status)}
                              style={{ 
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                            <div className="d-flex align-items-center gap-1">
                              <Icon name="mapPin" size={14} />
                              <span>{booking.property?.location || 'namakkal, tamilnadu'}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <Icon name="clock" size={14} />
                              <span>
                                {new Date(booking.checkIn || '2025-09-19').toLocaleDateString()} - {new Date(booking.checkOut || '2025-09-20').toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                            <strong>Booking Type:</strong> {booking.bookingType || 'Monthly'} • 
                            <strong> Payment:</strong> {booking.paymentType || 'On Spot'} • 
                            <strong> Booked:</strong> {new Date(booking.createdAt || '2025-09-19').toLocaleDateString()}
                          </div>
                        </div>

                        {/* Right: Price & Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                          
                          {/* ✅ SINGLE TOTAL PRICE SECTION - COMPACT */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
                              TOTAL PRICE
                            </div>
                            <div style={{ 
                              fontSize: '1.25rem', 
                              fontWeight: '800', 
                              color: '#059669',
                              marginBottom: '2px'
                            }}>
                              ₹{booking.totalAmount || '356'}
                            </div>
                          </div>

                          {/* ✅ SINGLE VIEW DETAILS BUTTON */}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/booking/${booking._id}`);
                            }}
                            style={{
                              borderRadius: '8px',
                              fontWeight: '600',
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              borderColor: '#667eea',
                              color: '#667eea'
                            }}
                          >
                            <div className="d-flex align-items-center gap-1">
                              <Icon name="eye" size={14} />
                              <span>VIEW</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyBookings;
