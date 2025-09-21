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
      console.log('Full booking data:', response.data);
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
        booking.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.propertyId?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.propertyId?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                <div className="text-center mb-3">
                  <h2 style={{ 
                    fontWeight: '700', 
                    color: '#1e293b', 
                    margin: 0,
                    fontSize: '1.8rem'
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
                    + New Booking
                  </Button>
                </div>
                
                <Row className="align-items-center g-3">
                  <Col lg={5}>
                    <InputGroup>
                      <InputGroup.Text>🔍</InputGroup.Text>
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
                  <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.1rem' }}>
                    📊 {filteredBookings.length} of {bookings.length} bookings found
                  </span>
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

        {/* SIMPLIFIED BOOKING CARDS */}
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
                  <div 
                    key={booking._id}
                    style={{
                      marginBottom: index === filteredBookings.length - 1 ? '0' : '20px'
                    }}
                  >
                    <Card 
                      style={{
                        cursor: 'pointer',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        background: 'rgba(255, 255, 255, 0.98)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        overflow: 'hidden'
                      }}
                      onClick={() => navigate(`/booking/${booking._id}`)}
                    >
                      <Card.Body style={{ padding: '24px' }}>
                        <Row className="align-items-center">
                          
                          {/* Left: Simple Property Card */}
                          <Col lg={3} md={12} className="mb-3 mb-lg-0">
                            <div style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '12px',
                              padding: '20px',
                              color: 'white',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.9 }}>
                                PROPERTY
                              </div>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                marginBottom: '8px'
                              }}>
                                {booking.propertyId?._id?.slice(-4) || '2354'}
                              </div>
                              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                SpaceLink
                              </div>
                            </div>
                          </Col>

                          {/* Center: Booking Information */}
                          <Col lg={6} md={12} className="mb-3 mb-lg-0">
                            <div>
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <h4 style={{ 
                                  margin: 0, 
                                  fontWeight: '700', 
                                  fontSize: '1.3rem',
                                  color: '#0f172a'
                                }}>
                                  {booking.propertyId?.title || booking.propertyId?._id?.slice(-4) || 'Property 2354'}
                                </h4>
                                <Badge 
                                  bg={booking.status === 'pending' ? 'warning' : 
                                     booking.status === 'approved' ? 'success' : 
                                     booking.status === 'active' ? 'primary' : 
                                     booking.status === 'rejected' ? 'danger' : 'secondary'}
                                  style={{ 
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <p style={{ 
                                fontSize: '14px', 
                                color: '#64748b',
                                marginBottom: '16px'
                              }}>
                                📍 {booking.propertyId?.address || 'namakkal, tamilnadu'}
                              </p>

                              <Row className="g-3">
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(59, 130, 246, 0.08)',
                                    borderRadius: '8px',
                                    padding: '12px'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                                      CHECK-IN
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Sep 19, 2025'}
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(16, 185, 129, 0.08)',
                                    borderRadius: '8px',
                                    padding: '12px'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                                      CHECK-OUT
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Sep 20, 2025'}
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(245, 158, 11, 0.08)',
                                    borderRadius: '8px',
                                    padding: '12px'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                                      BOOKING TYPE
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {booking.bookingType || 'Monthly'}
                                    </div>
                                  </div>
                                </Col>
                                <Col sm={6}>
                                  <div style={{
                                    background: 'rgba(139, 92, 246, 0.08)',
                                    borderRadius: '8px',
                                    padding: '12px'
                                  }}>
                                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                                      PAYMENT
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                      {booking.paymentMethod || 'On Spot'}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </Col>

                          {/* Right: Price & Actions */}
                          <Col lg={3} md={12}>
                            <div style={{
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(5, 150, 105, 0.02))',
                              borderRadius: '12px',
                              padding: '20px',
                              textAlign: 'center',
                              border: '1px solid rgba(16, 185, 129, 0.1)'
                            }}>
                              <div style={{ 
                                fontSize: '10px', 
                                color: '#64748b',
                                fontWeight: '700',
                                marginBottom: '8px'
                              }}>
                                TOTAL PRICE
                              </div>

                              <div style={{ 
                                fontSize: '28px', 
                                fontWeight: '800', 
                                color: '#059669',
                                marginBottom: '8px'
                              }}>
                                ₹{booking.totalPrice || '356'}
                              </div>

                              <div style={{ 
                                fontSize: '11px', 
                                color: '#64748b',
                                marginBottom: '16px'
                              }}>
                                Booked {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Sep 19, 2025'}
                              </div>

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/booking/${booking._id}`);
                                }}
                                style={{
                                  borderRadius: '10px',
                                  fontWeight: '600',
                                  padding: '10px 20px',
                                  fontSize: '12px',
                                  width: '100%'
                                }}
                              >
                                👁️ VIEW DETAILS
                              </Button>
                            </div>
                          </Col>

                        </Row>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>

        {error && (
          <Row className="justify-content-center mt-4">
            <Col xl={11} lg={12}>
              <Alert variant="danger" style={{ borderRadius: '12px' }}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MyBookings;
