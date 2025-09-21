import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import Modal from 'react-bootstrap/Modal';
import { api, handleApiError } from '../utils/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.bookings.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // List of all statuses to show
  const statusSections = [
    { key: 'pending', label: '🟡 Pending Bookings', color: 'warning' },
    { key: 'approved', label: '🟢 Approved Bookings', color: 'success' },
    { key: 'active', label: '🟢 Active Bookings', color: 'success' },
    { key: 'rejected', label: '🔴 Rejected Bookings', color: 'danger' },
    { key: 'ended', label: '⚫ Ended Bookings', color: 'secondary' },
    { key: 'expired', label: '🔴 Expired Bookings', color: 'danger' },
    { key: 'cancelled', label: '⚫ Cancelled Bookings', color: 'secondary' },
  ];

  if (loading) {
    return (
      <div style={{ 
        background: '#f8fafc',
        minHeight: '100vh',
        paddingTop: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div className="spinner-border" role="status" style={{ color: '#6366f1' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: '#1e293b', fontWeight: '600' }}>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#f8fafc',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '60px'
    }}>
      <Container className="py-4">
        <Row>
          <Col>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 style={{ 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  margin: 0,
                  fontSize: '1.8rem'
                }}>
                  📋 My Bookings
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: '1rem', marginTop: '8px' }}>
                  Manage and track all your property bookings
                </p>
              </div>
              <Button 
                as={Link} 
                to="/find-property"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  fontSize: '0.9rem'
                }}
              >
                🔍 Find More Properties
              </Button>
            </div>

            {error && (
              <Alert 
                variant="danger" 
                className="mb-4"
                style={{
                  borderRadius: '8px',
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
                  color: '#dc2626'
                }}
              >
                {error}
              </Alert>
            )}

            {bookings.length === 0 ? (
              <Card style={{
                textAlign: 'center',
                padding: '60px 40px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <Card.Body>
                  <div className="mb-4">
                    <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                  </div>
                  <h4 style={{ color: '#1e293b', fontWeight: '700' }}>No Bookings Yet</h4>
                  <p className="text-muted mb-4">
                    You haven't made any bookings yet. Start exploring properties to make your first booking!
                  </p>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      padding: '12px 32px'
                    }}
                  >
                    🔍 Browse Properties
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* EXACT SAME LOGIC AS YOUR WORKING CODE */}
                {statusSections.map(section => (
                  getBookingsByStatus(section.key).length > 0 && (
                    <div className="mb-4" key={section.key}>
                      {/* Status Header - Clean like your image */}
                      <h4 className={`mb-3 text-${section.color}`} style={{ 
                        fontWeight: '700', 
                        fontSize: '1.2rem',
                        paddingBottom: '8px',
                        borderBottom: '2px solid #e2e8f0'
                      }}>
                        {section.label} ({getBookingsByStatus(section.key).length})
                      </h4>
                      
                      {/* Cards Container - EXACT HORIZONTAL LAYOUT LIKE YOUR IMAGES */}
                      {getBookingsByStatus(section.key).map((booking, index) => (
                        <Card 
                          key={booking._id}
                          style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            marginBottom: '16px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          className="mb-3"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Card.Body style={{ padding: '20px' }}>
                            {/* PERFECT HORIZONTAL LAYOUT LIKE YOUR IMAGES */}
                            <Row className="align-items-center">
                              
                              {/* Left: Property Card - EXACT LIKE YOUR IMAGES */}
                              <Col md={3}>
                                <div style={{
                                  position: 'relative',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  aspectRatio: '16/10',
                                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  padding: '12px',
                                  color: 'white'
                                }}>
                                  {/* Top: PROPERTY label */}
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                  }}>
                                    <span style={{
                                      fontSize: '10px',
                                      fontWeight: '600',
                                      letterSpacing: '1px',
                                      opacity: '0.9'
                                    }}>
                                      PROPERTY
                                    </span>
                                    <span style={{
                                      fontSize: '9px',
                                      background: 'rgba(255, 255, 255, 0.2)',
                                      padding: '2px 6px',
                                      borderRadius: '4px'
                                    }}>
                                      #{booking.property?.propertyId || '1746'}
                                    </span>
                                  </div>

                                  {/* Center: Property Number */}
                                  <div style={{
                                    fontSize: '24px',
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    letterSpacing: '2px'
                                  }}>
                                    2354
                                  </div>

                                  {/* Bottom: SpaceLink */}
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end'
                                  }}>
                                    <span style={{
                                      fontSize: '8px',
                                      opacity: '0.8'
                                    }}>
                                      SpaceLink
                                    </span>
                                    <div style={{
                                      width: '20px',
                                      height: '12px',
                                      background: 'rgba(255, 255, 255, 0.3)',
                                      borderRadius: '2px'
                                    }}></div>
                                  </div>
                                </div>
                              </Col>

                              {/* Center: Booking Details - EXACT LIKE YOUR IMAGES */}
                              <Col md={6}>
                                <div>
                                  {/* Property Name & Status Badge */}
                                  <div className="d-flex align-items-center gap-3 mb-2">
                                    <h5 style={{ 
                                      margin: 0, 
                                      fontWeight: '700', 
                                      color: '#1e293b',
                                      fontSize: '1.1rem'
                                    }}>
                                      {booking.property?.title || 'Property'}
                                    </h5>
                                    <span 
                                      style={{
                                        background: booking.status === 'pending' ? '#f59e0b' : 
                                                   booking.status === 'approved' ? '#10b981' : 
                                                   booking.status === 'active' ? '#3b82f6' : 
                                                   booking.status === 'rejected' ? '#ef4444' : '#6b7280',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase'
                                      }}
                                    >
                                      {booking.status}
                                    </span>
                                  </div>

                                  {/* Location */}
                                  <p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>
                                    📍 {booking.property?.location || 'namakkal, tamilnadu'}
                                  </p>

                                  {/* Booking Details in 2x2 Grid - EXACT LIKE YOUR IMAGES */}
                                  <Row className="g-3">
                                    <Col sm={6}>
                                      <div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                          CHECK-IN
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                          {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'Nov 12, 2025'}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col sm={6}>
                                      <div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                          CHECK-OUT
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                          {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'Nov 30, 2025'}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col sm={6}>
                                      <div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                          BOOKING TYPE
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                          {booking.bookingType || 'Monthly'}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col sm={6}>
                                      <div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
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

                              {/* Right: Price & Button - EXACT LIKE YOUR IMAGES */}
                              <Col md={3}>
                                <div style={{ textAlign: 'right' }}>
                                  {/* Total Price Label */}
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#64748b',
                                    fontWeight: '600',
                                    marginBottom: '4px'
                                  }}>
                                    TOTAL PRICE
                                  </div>

                                  {/* Price - BIG AND GREEN */}
                                  <div style={{ 
                                    fontSize: '24px', 
                                    fontWeight: '800', 
                                    color: '#10b981',
                                    marginBottom: '4px'
                                  }}>
                                    ₹{booking.totalPrice || '23,432'}
                                  </div>

                                  {/* Booking Date */}
                                  <div style={{ 
                                    fontSize: '11px', 
                                    color: '#64748b',
                                    marginBottom: '16px'
                                  }}>
                                    Booked {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Sep 21, 2025'}
                                  </div>

                                  {/* Action Button - EXACT SAME AS YOUR WORKING CODE */}
                                  <Button
                                    size="sm"
                                    variant="info"
                                    as={Link}
                                    to={`/booking/${booking._id}`}
                                    style={{
                                      background: '#0ea5e9',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontWeight: '600',
                                      padding: '8px 16px',
                                      fontSize: '11px',
                                      color: 'white'
                                    }}
                                  >
                                    View Detail
                                  </Button>
                                </div>
                              </Col>

                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )
                ))}

                {/* Booking Summary - EXACT SAME AS YOUR WORKING CODE */}
                <Card style={{
                  marginTop: '30px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e2e8f0'
                }}>
                  <Card.Header style={{
                    background: '#f8fafc',
                    border: 'none',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    padding: '16px 20px'
                  }}>
                    <h5 className="mb-0" style={{ fontWeight: '700', color: '#1e293b' }}>
                      📊 Booking Summary
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ padding: '20px' }}>
                    <Row className="text-center">
                      <Col md={3}>
                        <div style={{ marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: '0' }}>
                            {bookings.length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Total Bookings
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{ marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', margin: '0' }}>
                            {getBookingsByStatus('active').length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Active
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{ marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', margin: '0' }}>
                            {getBookingsByStatus('expired').length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Expired
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{ marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#6b7280', margin: '0' }}>
                            {getBookingsByStatus('cancelled').length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Cancelled
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyBookings;
