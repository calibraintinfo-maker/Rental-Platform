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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.5)'
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
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '60px'
    }}>
      <Container className="py-4">
        <Row>
          <Col>
            {/* Header - Same as your working code but with premium styling */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '30px'
            }}>
              <Card.Body style={{ padding: '24px' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      margin: 0,
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
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
                      borderRadius: '12px',
                      fontWeight: '600',
                      padding: '12px 24px',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                      fontSize: '0.95rem'
                    }}
                  >
                    🔍 Find More Properties
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {error && (
              <Alert 
                variant="danger" 
                className="mb-4"
                style={{
                  borderRadius: '12px',
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
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                      borderRadius: '12px',
                      fontWeight: '600',
                      padding: '12px 32px',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                    }}
                  >
                    🔍 Browse Properties
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {/* EXACT SAME LOGIC AND STRUCTURE AS YOUR WORKING CODE */}
                {statusSections.map(section => (
                  getBookingsByStatus(section.key).length > 0 && (
                    <div className="mb-5" key={section.key}>
                      {/* Premium Status Header */}
                      <Card style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden',
                        marginBottom: '0'
                      }}>
                        <Card.Header style={{
                          background: (() => {
                            switch(section.color) {
                              case 'warning': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))';
                              case 'success': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))';
                              case 'danger': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))';
                              case 'secondary': return 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.05))';
                              default: return 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))';
                            }
                          })(),
                          border: 'none',
                          padding: '20px 24px',
                          borderTopLeftRadius: '16px',
                          borderTopRightRadius: '16px'
                        }}>
                          <h4 className={`mb-0 text-${section.color}`} style={{ 
                            fontWeight: '700', 
                            fontSize: '1.3rem' 
                          }}>
                            {section.label} ({getBookingsByStatus(section.key).length})
                          </h4>
                        </Card.Header>
                        
                        <Card.Body style={{ padding: '0' }}>
                          {/* EXACT SAME MAPPING AS YOUR WORKING CODE */}
                          {getBookingsByStatus(section.key).map((booking, index) => (
                            <div key={booking._id}>
                              <div style={{ 
                                padding: '24px', 
                                borderBottom: index < getBookingsByStatus(section.key).length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' 
                              }}>
                                {/* EXACT SAME BookingCard COMPONENT AS YOUR WORKING CODE */}
                                <BookingCard booking={booking} />
                                
                                {/* EXACT SAME BUTTON WITH PREMIUM STYLING */}
                                <div className="mb-3 text-end" style={{ marginTop: '20px' }}>
                                  <Button
                                    size="sm"
                                    variant="info"
                                    as={Link}
                                    to={`/booking/${booking._id}`}
                                    style={{
                                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontWeight: '600',
                                      padding: '8px 20px',
                                      color: 'white',
                                      textDecoration: 'none',
                                      boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.3)';
                                    }}
                                  >
                                    View Detail
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </div>
                  )
                ))}

                {/* EXACT SAME BOOKING SUMMARY AS YOUR WORKING CODE */}
                <Card style={{
                  marginTop: '30px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Card.Header style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                    border: 'none',
                    padding: '20px 24px',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                  }}>
                    <h5 className="mb-0" style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.2rem' }}>
                      📊 Booking Summary
                    </h5>
                  </Card.Header>
                  <Card.Body style={{ padding: '24px' }}>
                    <Row className="text-center">
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.06))',
                          borderRadius: '14px',
                          padding: '20px',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: '0' }}>
                            {bookings.length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Total Bookings
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.06))',
                          borderRadius: '14px',
                          padding: '20px',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', margin: '0' }}>
                            {getBookingsByStatus('active').length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Active
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.06))',
                          borderRadius: '14px',
                          padding: '20px',
                          marginBottom: '8px'
                        }}>
                          <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', margin: '0' }}>
                            {getBookingsByStatus('expired').length}
                          </h3>
                          <p className="text-muted mb-0" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            Expired
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.12), rgba(75, 85, 99, 0.06))',
                          borderRadius: '14px',
                          padding: '20px',
                          marginBottom: '8px'
                        }}>
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
