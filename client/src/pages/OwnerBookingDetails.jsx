import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { api, handleApiError, formatDate } from '../utils/api';

const OwnerBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      // Log error details for debugging
      console.error('Booking fetch error:', err);
      // Show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(handleApiError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerAction = async (action) => {
    setError('');
    setSuccess('');
    try {
      if (action === 'approve') {
        await api.bookings.approve(bookingId);
        setSuccess('Booking approved');
      } else if (action === 'reject') {
        await api.bookings.reject(bookingId);
        setSuccess('Booking rejected');
      } else if (action === 'end') {
        await api.bookings.end(bookingId);
        setSuccess('Booking ended');
      }
      fetchBooking();
    } catch (err) {
      setError(handleApiError(err));
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
            backdropFilter: 'blur(20px)'
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
      <Container className="py-4">
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '25px',
          border: 'none',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden'
        }}>
          <Card.Header style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 2rem 1.5rem',
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
                  Booking Management
                </h4>
                <p style={{ 
                  margin: 0, 
                  opacity: 0.9, 
                  fontSize: '0.95rem',
                  fontWeight: '400'
                }}>
                  Review and manage booking request
                </p>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body style={{ padding: '2.5rem' }}>
            {/* User Information Section */}
            <Row className="mb-4">
              <Col md={6}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '1.8rem',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  height: '100%'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.1rem'
                    }}>
                      👤
                    </div>
                    <h5 style={{ 
                      margin: 0, 
                      color: '#1e40af', 
                      fontWeight: '700',
                      fontSize: '1.2rem'
                    }}>
                      User Information
                    </h5>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        FULL NAME
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {booking.userId?.name || 'Not provided'}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        EMAIL ADDRESS
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#1f2937', 
                        fontWeight: '600',
                        wordBreak: 'break-all'
                      }}>
                        {booking.userId?.email || 'Not provided'}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        CONTACT NUMBER
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {booking.userId?.contact || 'Not provided'}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        AGE
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {booking.userId?.age || 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              
              {/* Booking Information Section */}
              <Col md={6}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.05) 100%)',
                  borderRadius: '20px',
                  padding: '1.8rem',
                  border: '1px solid rgba(16, 185, 129, 0.1)',
                  height: '100%'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.1rem'
                    }}>
                      📅
                    </div>
                    <h5 style={{ 
                      margin: 0, 
                      color: '#047857', 
                      fontWeight: '700',
                      fontSize: '1.2rem'
                    }}>
                      Booking Information
                    </h5>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        STATUS
                      </div>
                      <Badge 
                        bg={
                          booking.status === 'pending' ? 'warning'
                          : booking.status === 'approved' ? 'success'
                          : booking.status === 'rejected' ? 'danger'
                          : booking.status === 'ended' ? 'secondary'
                          : 'info'
                        }
                        style={{
                          padding: '0.5rem 0.8rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          borderRadius: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        CHECK-IN DATE
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {formatDate(booking.fromDate)}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        CHECK-OUT DATE
                      </div>
                      <div style={{ 
                        fontSize: '1rem', 
                        color: '#1f2937', 
                        fontWeight: '600'
                      }}>
                        {formatDate(booking.toDate)}
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280', 
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        TOTAL AMOUNT
                      </div>
                      <div style={{ 
                        fontSize: '1.2rem', 
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

            {/* Additional Notes Section */}
            {booking.notes && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.05) 100%)',
                borderRadius: '20px',
                padding: '1.8rem',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}>
                    📝
                  </div>
                  <h5 style={{ 
                    margin: 0, 
                    color: '#7c3aed', 
                    fontWeight: '700',
                    fontSize: '1.2rem'
                  }}>
                    Additional Notes
                  </h5>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                  fontSize: '1rem',
                  color: '#374151',
                  lineHeight: '1.6'
                }}>
                  {booking.notes}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              {booking.status === 'pending' && (
                <>
                  <Button 
                    variant="success" 
                    onClick={() => handleOwnerAction('approve')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    <span>✅</span> Approve Booking
                  </Button>
                  
                  <Button 
                    variant="danger" 
                    onClick={() => handleOwnerAction('reject')}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    <span>❌</span> Reject Booking
                  </Button>
                </>
              )}
              
              {['approved', 'active'].includes(booking.status) && (
                <Button 
                  variant="secondary" 
                  onClick={() => handleOwnerAction('end')}
                  style={{
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(107, 114, 128, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
                  }}
                >
                  <span>🏁</span> End Booking
                </Button>
              )}
              
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#6b7280';
                }}
              >
                <span>←</span> Back
              </Button>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <Alert 
                variant="success" 
                style={{
                  border: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                  color: '#047857',
                  padding: '1rem 1.5rem',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🎉</span>
                <strong>Success!</strong> {success}
              </Alert>
            )}
            
            {error && (
              <Alert 
                variant="danger" 
                style={{
                  border: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                  color: '#dc2626',
                  padding: '1rem 1.5rem',
                  marginBottom: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <strong>Error!</strong> {error}
              </Alert>
            )}
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
            padding: 1.5rem 1.5rem 1rem !important;
          }
          
          .d-flex {
            flex-direction: column;
            align-items: stretch;
          }
          
          .d-flex .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerBookingDetails;
