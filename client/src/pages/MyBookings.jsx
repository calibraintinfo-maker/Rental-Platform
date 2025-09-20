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
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      activity: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      ),
      barChart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="20" x2="12" y2="10"/>
          <line x1="18" y1="20" x2="18" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="16"/>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,4 23,10 17,10"/>
          <polyline points="1,20 1,14 7,14"/>
          <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10"/>
          <path d="M3.51,15a9,9,0,0,0,14.85,3.36L23,14"/>
        </svg>
      ),
      eye: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  const StatusIcon = ({ status, size = 20 }) => {
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
      case 'ended':
        return (
          <svg {...iconProps} style={{ color: '#6b7280' }}>
            <polyline points="20,6 9,17 4,12"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
      case 'expired':
        return (
          <svg {...iconProps} style={{ color: '#ef4444' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        );
      case 'cancelled':
        return (
          <svg {...iconProps} style={{ color: '#374151' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      default:
        return (
          <svg {...iconProps} style={{ color: '#6b7280' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
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
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Grid Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 1,
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'fixed',
          top: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }} />

        <style>
          {`
            @keyframes gridMove {
              0% { transform: translateX(0) translateY(0); }
              25% { transform: translateX(25px) translateY(0); }
              50% { transform: translateX(25px) translateY(25px); }
              75% { transform: translateX(0) translateY(25px); }
              100% { transform: translateX(0) translateY(0); }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.02); }
            }
          `}
        </style>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white'
            }}>
              <Icon name="sparkles" size={24} />
            </div>
            <Spinner 
              animation="border" 
              style={{ 
                color: '#667eea',
                width: '50px',
                height: '50px',
                borderWidth: '4px',
                marginBottom: '20px'
              }} 
            />
            <h4 style={{ 
              color: '#1e293b',
              fontWeight: '700',
              fontSize: '1.5rem'
            }}>
              Loading Your Bookings...
            </h4>
            <p style={{ color: '#64748b', margin: 0 }}>
              Please wait while we fetch your reservations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Animated Grid Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 1,
      }} />

      {/* Floating Orbs */}
      <div style={{
        position: 'fixed',
        top: '15%',
        right: '8%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '10%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 1,
      }} />

      <style>
        {`
          @keyframes gridMove {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(25px) translateY(0); }
            50% { transform: translateX(25px) translateY(25px); }
            75% { transform: translateX(0) translateY(25px); }
            100% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.02); }
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Premium Header */}
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '16px',
                      padding: '12px',
                      color: 'white'
                    }}>
                      <Icon name="calendar" size={24} />
                    </div>
                    <div>
                      <h2 style={{ 
                        fontWeight: '800', 
                        color: '#1e293b', 
                        margin: 0,
                        fontSize: '1.8rem',
                        background: 'linear-gradient(135deg, #1e293b, #475569)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        My Bookings
                      </h2>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                        {bookings.length === 0 
                          ? "Manage and track all your property bookings" 
                          : `Track and manage your ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={fetchBookings}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '10px 20px',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="refresh" size={16} />
                      <span>Refresh</span>
                    </div>
                  </Button>
                </div>
                
                {/* Stats Row */}
                {bookings.length > 0 && (
                  <Row className="g-3">
                    <Col md={3}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>
                          {bookings.length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Total Bookings
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(245, 158, 11, 0.1)'
                      }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b' }}>
                          {getBookingsByStatus('pending').length + getBookingsByStatus('approved').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Upcoming
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(16, 185, 129, 0.1)'
                      }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>
                          {getBookingsByStatus('active').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Active
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.05))',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(107, 114, 128, 0.1)'
                      }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#6b7280' }}>
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

        {error && (
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              <Alert variant="danger" style={{ 
                borderRadius: '16px', 
                border: 'none',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                color: '#991b1b',
                padding: '16px',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    background: '#ef4444',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="x" size={12} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {bookings.length === 0 ? (
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px'
              }}>
                <Card.Body className="p-5 text-center">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}>
                    <Icon name="calendar" size={32} />
                  </div>
                  <h3 style={{ 
                    fontWeight: '700', 
                    color: '#1e293b',
                    marginBottom: '16px',
                    fontSize: '1.8rem'
                  }}>
                    No Bookings Yet
                  </h3>
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '1.1rem',
                    marginBottom: '32px',
                    lineHeight: 1.6
                  }}>
                    You haven't made any bookings yet. Start exploring our amazing properties to make your first booking!
                  </p>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '16px 32px',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="search" size={20} />
                      <span>Browse Properties</span>
                    </div>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            {/* Search & Filter Section */}
            <Row className="justify-content-center mb-4">
              <Col lg={10}>
                <Card style={{ 
                  borderRadius: '16px', 
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Card.Body style={{ padding: '24px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 style={{ 
                        fontWeight: '700', 
                        color: '#1e293b', 
                        fontSize: '1.25rem',
                        margin: 0
                      }}>
                        Search & Filter
                      </h5>
                      <Button 
                        as={Link} 
                        to="/find-property" 
                        size="sm"
                        style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          border: 'none',
                          borderRadius: '50px',
                          fontWeight: '600',
                          padding: '8px 16px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <Icon name="plus" size={16} />
                          <span>New Booking</span>
                        </div>
                      </Button>
                    </div>
                    
                    <Row className="align-items-center g-3">
                      <Col md={5}>
                        <InputGroup>
                          <InputGroup.Text style={{ 
                            background: 'rgba(248, 250, 252, 0.9)', 
                            border: '2px solid rgba(226, 232, 240, 0.8)',
                            fontSize: '1rem',
                            padding: '12px 16px',
                            borderRadius: '12px 0 0 12px'
                          }}>
                            <Icon name="search" size={16} />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Search properties, locations, or booking IDs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                              border: '2px solid rgba(226, 232, 240, 0.8)', 
                              fontSize: '1rem',
                              background: 'rgba(255, 255, 255, 0.95)',
                              padding: '12px 16px',
                              borderRadius: '0 12px 12px 0',
                              borderLeft: 'none'
                            }}
                          />
                        </InputGroup>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Select 
                          value={selectedStatus} 
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          style={{ 
                            border: '2px solid rgba(226, 232, 240, 0.8)', 
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '12px 16px',
                            borderRadius: '12px'
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
                            border: '2px solid rgba(226, 232, 240, 0.8)', 
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '12px 16px',
                            borderRadius: '12px'
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
              </Col>
            </Row>

            {/* Results Summary */}
            <Row className="justify-content-center mb-4">
              <Col lg={10}>
                <div className="d-flex justify-content-between align-items-center">
                  <h6 style={{ 
                    color: '#374151', 
                    fontWeight: '600', 
                    margin: 0, 
                    fontSize: '1.1rem'
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
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <StatusIcon status={status.key} size={14} />
                          {count}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Bookings List */}
            <Row className="justify-content-center">
              <Col lg={10}>
                {filteredBookings.length === 0 ? (
                  <Card style={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '40px 20px'
                  }}>
                    <Card.Body className="text-center">
                      <div style={{ marginBottom: '16px' }}>
                        <Icon name="search" size={48} style={{ color: '#6b7280' }} />
                      </div>
                      <h5 style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.5rem', marginBottom: '8px' }}>
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
                          style={{ 
                            borderRadius: '16px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                            background: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(20px)',
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
                              padding: '16px 24px', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              borderTop: '1px solid rgba(226, 232, 240, 0.6)',
                              background: 'rgba(248, 250, 252, 0.5)'
                            }}>
                              <Badge 
                                bg={getStatusBadgeVariant(booking.status)}
                                style={{ 
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <StatusIcon status={booking.status} size={16} />
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                as={Link}
                                to={`/booking/${booking._id}`}
                                style={{
                                  borderRadius: '20px',
                                  fontWeight: '600',
                                  padding: '8px 20px',
                                  fontSize: '0.9rem',
                                  borderColor: '#667eea',
                                  color: '#667eea',
                                  background: 'rgba(102, 126, 234, 0.05)'
                                }}
                              >
                                <div className="d-flex align-items-center gap-1">
                                  <Icon name="eye" size={16} />
                                  <span>View Details</span>
                                </div>
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default MyBookings;
