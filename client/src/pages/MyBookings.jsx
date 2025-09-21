import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
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

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // 🔥 PREMIUM ENHANCED STATUS SECTIONS WITH BETTER STYLING
  const statusSections = [
    { key: 'pending', label: '⏳ Pending Bookings', color: 'warning', icon: '🟡' },
    { key: 'approved', label: '✅ Approved Bookings', color: 'success', icon: '🟢' },
    { key: 'active', label: '🏠 Active Bookings', color: 'success', icon: '🟢' },
    { key: 'rejected', label: '❌ Rejected Bookings', color: 'danger', icon: '🔴' },
    { key: 'ended', label: '🏁 Ended Bookings', color: 'secondary', icon: '⚫' },
    { key: 'expired', label: '⏰ Expired Bookings', color: 'danger', icon: '🔴' },
    { key: 'cancelled', label: '🚫 Cancelled Bookings', color: 'secondary', icon: '⚫' },
  ];

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <Spinner animation="border" style={{ color: '#667eea', marginBottom: '20px' }} />
          <h4 style={{ color: '#1e293b', fontWeight: '700' }}>Loading Your Bookings...</h4>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '60px'
    }}>
      <Container className="py-4">
        <Row>
          <Col>
            {/* 🚀 PREMIUM HEADER SECTION */}
            <Card style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '20px',
              marginBottom: '30px',
              color: 'white',
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
            }}>
              <Card.Body style={{ padding: '30px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 style={{ 
                      fontWeight: '800', 
                      marginBottom: '10px',
                      fontSize: '2rem'
                    }}>
                      📋 My Bookings
                    </h2>
                    <p style={{ 
                      marginBottom: '0', 
                      fontSize: '1.1rem',
                      opacity: '0.9'
                    }}>
                      {bookings.length === 0 
                        ? "Manage and track all your property bookings" 
                        : `Track and manage your ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`
                      }
                    </p>
                  </div>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '15px',
                      padding: '12px 24px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🔍 Find More Properties
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {error && (
              <Alert variant="danger" style={{ 
                borderRadius: '15px',
                marginBottom: '30px',
                border: 'none',
                boxShadow: '0 10px 30px rgba(220, 38, 38, 0.2)'
              }}>
                <Alert.Heading>⚠️ Error</Alert.Heading>
                {error}
              </Alert>
            )}

            {bookings.length === 0 ? (
              <Card style={{
                textAlign: 'center',
                padding: '60px 20px',
                borderRadius: '20px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <Card.Body>
                  <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
                    🏠
                  </div>
                  <h4 style={{ fontWeight: '700', color: '#1e293b' }}>No Bookings Yet</h4>
                  <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1.1rem' }}>
                    You haven't made any bookings yet. Start exploring properties to make your first booking!
                  </p>
                  <Button 
                    as={Link} 
                    to="/find-property" 
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '15px',
                      padding: '15px 30px',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}
                  >
                    🔍 Browse Properties
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* 🔥 BOOKINGS BY STATUS - THIS IS THE KEY PART */}
                {statusSections.map(section => (
                  getBookingsByStatus(section.key).length > 0 && (
                    <div className="mb-5" key={section.key}>
                      <Card style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
                        borderRadius: '20px',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                      }}>
                        {/* Status Header */}
                        <div style={{
                          background: section.color === 'warning' ? 
                            'linear-gradient(135deg, #fbbf24, #f59e0b)' : 
                            section.color === 'success' ? 
                            'linear-gradient(135deg, #34d399, #10b981)' : 
                            section.color === 'danger' ? 
                            'linear-gradient(135deg, #f87171, #ef4444)' : 
                            'linear-gradient(135deg, #9ca3af, #6b7280)',
                          padding: '20px 30px',
                          color: 'white'
                        }}>
                          <h4 style={{ 
                            margin: '0',
                            fontWeight: '700',
                            fontSize: '1.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                            {section.label} 
                            <Badge 
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontSize: '0.9rem',
                                padding: '6px 12px',
                                borderRadius: '20px'
                              }}
                            >
                              {getBookingsByStatus(section.key).length}
                            </Badge>
                          </h4>
                        </div>

                        {/* Bookings List */}
                        <div style={{ padding: '20px' }}>
                          {getBookingsByStatus(section.key).map((booking, index) => (
                            <div 
                              key={booking._id}
                              style={{
                                marginBottom: index === getBookingsByStatus(section.key).length - 1 ? '0' : '20px'
                              }}
                            >
                              {/* 🔥 THIS IS THE KEY - Uses BookingCard component which handles all the data properly */}
                              <BookingCard booking={booking} />
                              
                              {/* Action Button */}
                              <div className="mt-3 text-end">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  as={Link}
                                  to={`/booking/${booking._id}`}
                                  style={{
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    padding: '8px 20px',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = '#3b82f6';
                                    e.target.style.color = 'white';
                                    e.target.style.transform = 'translateY(-1px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#3b82f6';
                                    e.target.style.transform = 'translateY(0)';
                                  }}
                                >
                                  👁️ View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )
                ))}

                {/* 📊 ENHANCED BOOKING SUMMARY */}
                <Card style={{
                  marginTop: '40px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}>
                  <Card.Header style={{
                    background: 'linear-gradient(135deg, #1e293b, #334155)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0',
                    padding: '20px 30px'
                  }}>
                    <h5 style={{ 
                      marginBottom: '0',
                      fontWeight: '700',
                      fontSize: '1.3rem'
                    }}>
                      📊 Booking Summary
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ padding: '30px' }}>
                    <Row className="text-center g-4">
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                          borderRadius: '15px',
                          padding: '20px',
                          border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                          <h3 style={{ 
                            color: '#3b82f6',
                            fontWeight: '800',
                            fontSize: '2.5rem',
                            marginBottom: '10px'
                          }}>
                            {bookings.length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            marginBottom: '0',
                            fontWeight: '600'
                          }}>
                            Total Bookings
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                          borderRadius: '15px',
                          padding: '20px',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <h3 style={{ 
                            color: '#10b981',
                            fontWeight: '800',
                            fontSize: '2.5rem',
                            marginBottom: '10px'
                          }}>
                            {getBookingsByStatus('active').length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            marginBottom: '0',
                            fontWeight: '600'
                          }}>
                            Active
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                          borderRadius: '15px',
                          padding: '20px',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                          <h3 style={{ 
                            color: '#ef4444',
                            fontWeight: '800',
                            fontSize: '2.5rem',
                            marginBottom: '10px'
                          }}>
                            {getBookingsByStatus('expired').length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            marginBottom: '0',
                            fontWeight: '600'
                          }}>
                            Expired
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.05))',
                          borderRadius: '15px',
                          padding: '20px',
                          border: '1px solid rgba(107, 114, 128, 0.2)'
                        }}>
                          <h3 style={{ 
                            color: '#6b7280',
                            fontWeight: '800',
                            fontSize: '2.5rem',
                            marginBottom: '10px'
                          }}>
                            {getBookingsByStatus('cancelled').length}
                          </h3>
                          <p style={{ 
                            color: '#64748b', 
                            marginBottom: '0',
                            fontWeight: '600'
                          }}>
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
