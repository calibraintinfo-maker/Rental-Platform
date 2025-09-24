import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { api, handleApiError } from '../utils/api';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.bookings.getById(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container className="py-4 text-center">
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <div 
              className="spinner-border" 
              role="status"
              style={{ 
                width: '3rem', 
                height: '3rem', 
                color: '#667eea',
                borderWidth: '3px'
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ 
              fontSize: '1.1rem', 
              color: '#4a5568',
              fontWeight: '500',
              margin: '1rem 0 0 0'
            }}>
              Loading booking details...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '2rem'
      }}>
        <Container className="py-4">
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            <Alert 
              variant="danger" 
              style={{
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                color: '#dc2626',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <strong>❌ Error:</strong> {error}
            </Alert>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
              }}
            >
              ← Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '2rem'
      }}>
        <Container className="py-4">
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            <Alert 
              variant="warning"
              style={{
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                color: '#d97706',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <strong>⚠️ Warning:</strong> Booking not found.
            </Alert>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
              }}
            >
              ← Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container>
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '25px',
          border: 'none',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Card.Header style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            border: 'none',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                📋
              </div>
              <div>
                <h4 style={{ 
                  margin: 0, 
                  fontWeight: '700', 
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  My Booking Details
                </h4>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.9, 
                  fontSize: '0.95rem',
                  fontWeight: '400'
                }}>
                  Complete information about your reservation
                </p>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body style={{ padding: '2rem' }}>
            {/* Property and Booking Information Row */}
            <Row className="mb-4">
              {/* Property Information Card */}
              <Col md={6} className="mb-4 mb-md-0">
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  height: '100%',
                  minHeight: '320px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem'
                    }}>
                      🏠
                    </div>
                    <h5 style={{ 
                      margin: 0, 
                      color: '#1e40af', 
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      Property Information
                    </h5>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        PROPERTY TITLE
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {booking.propertyId?.title || 'Property Name Not Available'}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        CATEGORY
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {booking.propertyId?.category || 'Not specified'}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        LOCATION
                      </div>
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#1f2937', 
                        fontWeight: '600',
                        lineHeight: '1.4'
                      }}>
                        {booking.propertyId?.address?.city || 'City'}, {booking.propertyId?.address?.state || 'State'}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              
              {/* Booking Information Card */}
              <Col md={6}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  height: '100%',
                  minHeight: '320px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem'
                    }}>
                      📅
                    </div>
                    <h5 style={{ 
                      margin: 0, 
                      color: '#047857', 
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      Booking Information
                    </h5>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        STATUS
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: booking.status === 'pending' ? '#fbbf24' : 
                                   booking.status === 'approved' ? '#10b981' :
                                   booking.status === 'rejected' ? '#ef4444' :
                                   booking.status === 'ended' ? '#6b7280' : '#3b82f6',
                        color: 'white'
                      }}>
                        {booking.status}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        BOOKING TYPE
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {booking.bookingType || 'Not specified'}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        border: '1px solid rgba(16, 185, 129, 0.1)'
                      }}>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#6b7280', 
                          fontWeight: '600',
                          marginBottom: '0.25rem'
                        }}>
                          FROM
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#059669', 
                          fontWeight: '600'
                        }}>
                          {new Date(booking.fromDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        border: '1px solid rgba(16, 185, 129, 0.1)'
                      }}>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#6b7280', 
                          fontWeight: '600',
                          marginBottom: '0.25rem'
                        }}>
                          TO
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#dc2626', 
                          fontWeight: '600'
                        }}>
                          {new Date(booking.toDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        TOTAL PRICE
                      </div>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        color: '#059669', 
                        fontWeight: '700'
                      }}>
                        ₹{booking.totalPrice?.toLocaleString() || '0'}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Additional Notes Section (if exists) */}
            {booking.notes && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
                borderRadius: '18px',
                padding: '1.5rem',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem'
                  }}>
                    📝
                  </div>
                  <h5 style={{ 
                    margin: 0, 
                    color: '#7c3aed', 
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    Additional Notes
                  </h5>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                  fontSize: '0.9rem',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  {booking.notes}
                </div>
              </div>
            )}

            {/* HR line */}
            <hr style={{
              border: 'none',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
              margin: '1.5rem 0'
            }} />

            {/* Owner Information Section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.05) 100%)',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1px solid rgba(245, 158, 11, 0.1)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem'
                }}>
                  👑
                </div>
                <h5 style={{ 
                  margin: 0, 
                  color: '#d97706', 
                  fontWeight: '700',
                  fontSize: '1.1rem'
                }}>
                  Owner Information
                </h5>
              </div>
              
              <Row>
                <Col md={4} className="mb-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(245, 158, 11, 0.1)',
                    height: '100%'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      OWNER NAME
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#1f2937', 
                      fontWeight: '600'
                    }}>
                      {booking.propertyId?.ownerId?.name || booking.propertyId?.ownerId || 'N/A'}
                    </div>
                  </div>
                </Col>
                
                <Col md={4} className="mb-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(245, 158, 11, 0.1)',
                    height: '100%'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      EMAIL
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#1f2937', 
                      fontWeight: '600',
                      wordBreak: 'break-all'
                    }}>
                      {booking.propertyId?.ownerId?.email || 'N/A'}
                    </div>
                  </div>
                </Col>
                
                <Col md={4} className="mb-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(245, 158, 11, 0.1)',
                    height: '100%'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      CONTACT
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#1f2937', 
                      fontWeight: '600'
                    }}>
                      {booking.propertyId?.ownerId?.contact || 'N/A'}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Back Button */}
            <div style={{ textAlign: 'center' }}>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(107, 114, 128, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#6b7280';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span>←</span> Back to Previous Page
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .btn:hover {
          transform: translateY(-2px) !important;
        }
        
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .card-body {
            padding: 1.5rem !important;
          }
          
          .card-header {
            padding: 1.5rem !important;
          }
          
          .grid-responsive {
            display: block !important;
          }
          
          .grid-responsive > div {
            margin-bottom: 1rem;
          }
          
          .grid-responsive > div:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingDetails;
