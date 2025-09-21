import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
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
      ),
      trending: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
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
      paddingBottom: '60px',
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

      <Container fluid style={{ position: 'relative', zIndex: 2, maxWidth: '1400px' }}>
        
        {/* Optimized Header */}
        <Row className="justify-content-center mb-4">
          <Col xl={11} lg={12}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'visible'
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
                        fontSize: '1.6rem',
                        background: 'linear-gradient(135deg, #1e293b, #475569)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
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
                
                {/* Enhanced Stats Row */}
                {bookings.length > 0 && (
                  <Row className="g-3">
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '2px solid rgba(59, 130, 246, 0.15)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                        }} />
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#3b82f6', marginBottom: '4px' }}>
                          {bookings.length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Total Bookings
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '2px solid rgba(245, 158, 11, 0.15)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                        }} />
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#f59e0b', marginBottom: '4px' }}>
                          {getBookingsByStatus('pending').length + getBookingsByStatus('approved').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Upcoming
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '2px solid rgba(16, 185, 129, 0.15)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #10b981, #059669)'
                        }} />
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>
                          {getBookingsByStatus('active').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Active
                        </div>
                      </div>
                    </Col>
                    <Col md={3} sm={6}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.12), rgba(75, 85, 99, 0.06))',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '2px solid rgba(107, 114, 128, 0.15)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #6b7280, #4b5563)'
                        }} />
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#6b7280', marginBottom: '4px' }}>
                          {getBookingsByStatus('ended').length + getBookingsByStatus('cancelled').length}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
            <Col xl={11} lg={12}>
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
            {/* Improved Search & Filter Section */}
            <Row className="justify-content-center mb-4">
              <Col xl={11} lg={12}>
                <Card style={{ 
                  borderRadius: '14px', 
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Card.Body style={{ padding: '20px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 style={{ 
                        fontWeight: '600', 
                        color: '#1e293b', 
                        fontSize: '1.1rem',
                        margin: 0
                      }}>
                        Search & Filter
                      </h6>
                      <Button 
                        as={Link} 
                        to="/find-property" 
                        style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: '600',
                          padding: '8px 16px',
                          fontSize: '0.9rem'
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <Icon name="plus" size={16} />
                          <span>New Booking</span>
                        </div>
                      </Button>
                    </div>
                    
                    <Row className="align-items-center g-3">
                      <Col lg={5} md={12}>
                        <InputGroup>
                          <InputGroup.Text style={{ 
                            background: 'rgba(248, 250, 252, 0.9)', 
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            fontSize: '1rem',
                            borderRadius: '10px 0 0 10px',
                            padding: '12px 16px'
                          }}>
                            <Icon name="search" size={16} />
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
                              borderRadius: '0 10px 10px 0',
                              borderLeft: 'none',
                              padding: '12px 16px'
                            }}
                          />
                        </InputGroup>
                      </Col>
                      
                      <Col lg={3} md={6}>
                        <Form.Select 
                          value={selectedStatus} 
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          style={{ 
                            border: '1px solid rgba(226, 232, 240, 0.8)', 
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '10px',
                            padding: '12px 16px'
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
                      
                      <Col lg={4} md={6}>
                        <Form.Select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          style={{ 
                            border: '1px solid rgba(226, 232, 240, 0.8)', 
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '10px',
                            padding: '12px 16px'
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

            {/* Enhanced Results Summary Card */}
            <Row className="justify-content-center mb-4">
              <Col xl={11} lg={12}>
                <Card style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '14px',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  overflow: 'hidden'
                }}>
                  <Card.Body style={{ padding: '20px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          borderRadius: '12px',
                          padding: '8px',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}>
                          <Icon name="trending" size={18} />
                        </div>
                        <span style={{ 
                          color: '#1e293b', 
                          fontWeight: '700', 
                          fontSize: '1.1rem'
                        }}>
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
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <StatusIcon status={status.key} size={14} />
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

            {/* FIXED BOOKINGS LIST - COMPLETE REPLACEMENT */}
            <Row className="justify-content-center">
              <Col xl={11} lg={12}>
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
                  <div className="booking-list" style={{ paddingBottom: '40px' }}>
                    {filteredBookings.map((booking, index) => (
                      <div key={booking._id} className="mb-4" style={{ marginBottom: index === filteredBookings.length - 1 ? '0' : '24px' }}>
                        
                        {/* CLICKABLE CARD WRAPPER */}
                        <div
                          style={{
                            cursor: 'pointer',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
                            background: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            position: 'relative',
                          }}
                          onClick={() => navigate(`/booking/${booking._id}`)} // Make entire card clickable
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          
                          {/* Premium Status Strip */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: booking.status === 'active' 
                              ? 'linear-gradient(90deg, #10b981, #059669)'
                              : booking.status === 'pending'
                              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                              : booking.status === 'rejected' || booking.status === 'expired'
                              ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                              : 'linear-gradient(90deg, #6b7280, #4b5563)',
                            borderRadius: '20px 20px 0 0'
                          }} />

                          {/* SINGLE BookingCard - No Wrapper */}
                          <div style={{ padding: '24px' }}>
                            <BookingCard booking={booking} />
                          </div>

                          {/* SINGLE Bottom Action Bar */}
                          <div style={{ 
                            padding: '20px 28px', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            borderTop: '1px solid rgba(226, 232, 240, 0.5)',
                            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
                          }}>
                            
                            {/* SINGLE Status Badge */}
                            <Badge 
                              bg={getStatusBadgeVariant(booking.status)}
                              style={{ 
                                padding: '12px 24px',
                                borderRadius: '25px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: booking.status === 'active' 
                                  ? '0 4px 15px rgba(16, 185, 129, 0.3)'
                                  : booking.status === 'pending'
                                  ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                                  : '0 4px 15px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <StatusIcon status={booking.status} size={16} />
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>

                            {/* SINGLE View Details Button */}
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click when button is clicked
                                navigate(`/booking/${booking._id}`);
                              }}
                              style={{
                                borderRadius: '25px',
                                fontWeight: '700',
                                padding: '12px 28px',
                                fontSize: '0.9rem',
                                borderColor: '#667eea',
                                color: '#667eea',
                                background: 'rgba(102, 126, 234, 0.08)',
                                borderWidth: '2px',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#667eea';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                                e.target.style.color = '#667eea';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <Icon name="eye" size={14} />
                                <span>View Details</span>
                              </div>
                            </Button>
                          </div>
                        </div>
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
