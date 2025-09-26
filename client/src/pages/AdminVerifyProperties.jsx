import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminVerifyProperties = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState('verified');
  const [verifyNote, setVerifyNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // For fullscreen preview
  const [fullscreenDoc, setFullscreenDoc] = useState({ 
    show: false, 
    src: '', 
    type: '', 
    title: '' 
  });
  
  // Auth context
  const auth = useAuth();

  // Load pending properties on component mount
  useEffect(() => {
    if (!auth.loading && auth.token) {
      fetchPending();
    }
  }, [auth.loading, auth.token]);

  // Fetch pending properties from API
  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getPendingProperties();
      setProperties(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch pending properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open verification modal
  const openModal = (property) => {
    console.log('Opening modal for property:', property);
    setSelected(property);
    setShowModal(true);
    setVerifyStatus('verified');
    setVerifyNote('');
  };

  // Close modal and reset state
  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
    setVerifyNote('');
    setVerifyStatus('verified');
  };

  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Handle property verification
  const handleVerify = async () => {
    if (!selected) return;
    
    setSubmitting(true);
    try {
      await api.admin.verifyProperty(selected._id, verifyStatus, verifyNote);
      closeModal();
      await fetchPending();
      showNotification(
        `Property ${verifyStatus === 'verified' ? 'approved' : 'rejected'} successfully!`,
        'success'
      );
    } catch (error) {
      console.error('Verification failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      showNotification(`Failed to update property status: ${errorMessage}`, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  // Open fullscreen document view
  const openFullscreen = (src, type, title) => {
    setFullscreenDoc({ show: true, src, type, title });
  };

  // Close fullscreen document view
  const closeFullscreen = () => {
    setFullscreenDoc({ show: false, src: '', type: '', title: '' });
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spinner 
            animation="border" 
            variant="primary" 
            style={{ 
              width: '3rem', 
              height: '3rem', 
              borderWidth: '3px',
              color: '#7c3aed'
            }} 
          />
          <p style={{ 
            marginTop: '1.5rem', 
            color: '#475569', 
            fontSize: '1rem', 
            fontWeight: '600'
          }}>
            Loading verification dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <Alert 
            variant="danger" 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '2rem',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <strong>⚠️ System Error</strong><br/>{error}
          </Alert>
          <Button 
            onClick={fetchPending}
            style={{
              marginTop: '1.5rem',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0.875rem 2rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 6px 15px rgba(124, 58, 237, 0.3)',
              color: '#ffffff'
            }}
          >
            🔄 Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🚀 PROFESSIONAL LIGHT THEME - MAIN CONTAINER */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)', // LOGIN.JS THEME
        paddingTop: '120px', // INCREASED TO PUSH BELOW NAVBAR
        paddingBottom: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Beautiful Light Theme Background Animation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.04) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 1
        }} />

        <Container style={{ position: 'relative', zIndex: 10, maxWidth: '1400px' }}>
          {/* 🎯 PROFESSIONAL LIGHT THEME HEADER - REDUCED SIZE */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            padding: '1.5rem 2rem', // REDUCED PADDING
            background: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '16px', // REDUCED BORDER RADIUS
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(124, 58, 237, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)', // REDUCED SHADOW
            maxWidth: '900px', // ADDED MAX WIDTH TO MAKE IT LESS WIDE
            margin: '0 auto 2rem auto' // CENTER THE HEADER
          }}>
            {/* Brand Logo Section - Reduced Size */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px', // REDUCED GAP
              marginBottom: '1rem' // REDUCED MARGIN
            }}>
              <span style={{
                fontSize: '1.5rem', // REDUCED SIZE
                filter: 'drop-shadow(0 2px 6px rgba(124, 58, 237, 0.3))'
              }}>🏠</span>
              <span style={{
                fontSize: '1.5rem', // REDUCED SIZE
                fontWeight: '800',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}>
                SpaceLink
              </span>
            </div>

            <h1 style={{
              fontSize: '1.5rem', // REDUCED SIZE
              fontWeight: '800',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.5px',
              lineHeight: '1.2',
              marginBottom: '0.5rem' // REDUCED MARGIN
            }}>
              Property Verification Center
            </h1>
            <p style={{
              fontSize: '0.9rem', // REDUCED SIZE
              color: '#6b7280',
              fontWeight: '500',
              margin: 0,
              marginBottom: '1rem', // REDUCED MARGIN
              opacity: 0.95
            }}>
              Professional property management and verification system
            </p>
            <div style={{
              padding: '0.625rem 1.25rem', // REDUCED PADDING
              background: 'rgba(124, 58, 237, 0.1)',
              borderRadius: '10px', // REDUCED BORDER RADIUS
              border: '1px solid rgba(124, 58, 237, 0.2)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                color: '#7c3aed',
                fontSize: '0.85rem', // REDUCED SIZE
                fontWeight: '700'
              }}>
                📊 {properties.length} Properties Pending Review
              </span>
            </div>
          </div>

          {/* Content Area */}
          {properties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2.5rem',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 25px rgba(124, 58, 237, 0.1)',
              maxWidth: '600px',
              margin: '0 auto',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2.5rem',
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)'
              }}>
                ✅
              </div>
              <h2 style={{
                color: '#111827',
                fontSize: '2rem',
                marginBottom: '1rem',
                fontWeight: '800',
                letterSpacing: '-0.25px'
              }}>
                All Properties Verified
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.125rem',
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Outstanding work! No properties require verification at this time.
                The system is running smoothly and all submissions are up to date.
              </p>
            </div>
          ) : (
            <Row style={{ margin: '0 -12px' }}>
              {properties.map(property => (
                <Col 
                  key={property._id} 
                  xl={3} // REDUCED FROM 4 TO 3 FOR NARROWER CARDS
                  lg={4} // REDUCED FROM 6 TO 4
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 12px', marginBottom: '1.5rem' }}
                >
                  {/* 🚀 NARROWER PROFESSIONAL PROPERTY CARD */}
                  <Card style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(124, 58, 237, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    maxWidth: '320px', // ADDED MAX WIDTH FOR NARROWER CARDS
                    margin: '0 auto' // CENTER THE CARD
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(124, 58, 237, 0.15)';
                    e.currentTarget.style.border = '1px solid rgba(124, 58, 237, 0.3)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(124, 58, 237, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                  }}
                  >
                    {/* Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '160px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                      }}>
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)'
                        }} />
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '0.875rem',
                          right: '0.875rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '16px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                          border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}>
                          ⏳ PENDING
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <Card.Body style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      background: 'transparent'
                    }}>
                      {/* Title */}
                      <h3 style={{
                        fontSize: '1.25rem', // INCREASED TEXT SIZE
                        fontWeight: '800',
                        color: '#111827',
                        marginBottom: '1rem',
                        lineHeight: '1.3',
                        letterSpacing: '-0.25px'
                      }}>
                        {property.title}
                      </h3>

                      {/* Property Details */}
                      <div style={{ 
                        flexGrow: 1,
                        marginBottom: '1.25rem'
                      }}>
                        <div style={{ 
                          display: 'grid', 
                          gap: '0.75rem', // INCREASED GAP
                          marginBottom: '1rem'
                        }}>
                          {/* Owner Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem', // INCREASED TEXT SIZE
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            minHeight: '36px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', // INCREASED WIDTH
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // INCREASED TEXT SIZE
                              letterSpacing: '0.5px'
                            }}>
                              👤 Owner:
                            </span>
                            <span style={{ 
                              color: '#374151',
                              fontWeight: '600',
                              fontSize: '1rem' // INCREASED TEXT SIZE
                            }}>
                              {property.ownerId?.name || 'N/A'}
                            </span>
                          </div>

                          {/* Email Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem', // INCREASED TEXT SIZE
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            minHeight: '36px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', // INCREASED WIDTH
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // INCREASED TEXT SIZE
                              letterSpacing: '0.5px'
                            }}>
                              📧 Email:
                            </span>
                            <span style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              color: '#374151',
                              fontWeight: '600',
                              fontSize: '1rem' // INCREASED TEXT SIZE
                            }}>
                              {property.ownerId?.email || 'N/A'}
                            </span>
                          </div>

                          {/* Category Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem', // INCREASED TEXT SIZE
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            minHeight: '36px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', // INCREASED WIDTH
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // INCREASED TEXT SIZE
                              letterSpacing: '0.5px'
                            }}>
                              🏠 Type:
                            </span>
                            <span style={{ 
                              color: '#374151', 
                              fontWeight: '600',
                              fontSize: '1rem' // INCREASED TEXT SIZE
                            }}>
                              {property.category}
                            </span>
                          </div>

                          {/* Price Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem', // INCREASED TEXT SIZE
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            minHeight: '36px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', // INCREASED WIDTH
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // INCREASED TEXT SIZE
                              letterSpacing: '0.5px'
                            }}>
                              💰 Price:
                            </span>
                            <span style={{ 
                              color: '#10b981',
                              fontWeight: '800',
                              fontSize: '1.1rem' // INCREASED TEXT SIZE
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </span>
                          </div>

                          {/* Location Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem', // INCREASED TEXT SIZE
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            minHeight: '36px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', // INCREASED WIDTH
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // INCREASED TEXT SIZE
                              letterSpacing: '0.5px'
                            }}>
                              📍 Location:
                            </span>
                            <span style={{ 
                              color: '#374151', 
                              fontWeight: '600',
                              fontSize: '1rem' // INCREASED TEXT SIZE
                            }}>
                              {property.address ? 
                                `${property.address.city}, ${property.address.state}` : 
                                'N/A'
                              }
                            </span>
                          </div>

                          {/* Date Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem', // INCREASED TEXT SIZE
                            padding: '0.5rem 0',
                            minHeight: '36px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', // INCREASED WIDTH
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // INCREASED TEXT SIZE
                              letterSpacing: '0.5px'
                            }}>
                              📅 Submitted:
                            </span>
                            <span style={{ 
                              color: '#374151', 
                              fontWeight: '600',
                              fontSize: '1rem' // INCREASED TEXT SIZE
                            }}>
                              {new Date(property.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.9rem', // INCREASED TEXT SIZE
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 6px 20px rgba(124, 58, 237, 0.25)',
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.35)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.25)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                        }}
                      >
                        📋 Begin Verification
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* 🚀 PROFESSIONAL LIGHT THEME VERIFICATION MODAL */}
      <Modal 
        show={showModal} 
        onHide={closeModal}
        size="xl"
        centered
        scrollable
        style={{
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <Modal.Header 
          closeButton 
          style={{ 
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          closeButtonProps={{
            style: {
              filter: 'invert(1)', // MAKES THE CLOSE BUTTON WHITE
              opacity: '1'
            }
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.125rem',
            fontWeight: '800',
            letterSpacing: '-0.25px'
          }}>
            🏠 Property Verification Portal - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '75vh', 
          overflowY: 'auto', 
          padding: '1.75rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* Property Information Card */}
              <div style={{ 
                marginBottom: '1.75rem',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{ 
                  color: '#111827', 
                  marginBottom: '1.5rem',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '-0.25px'
                }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1rem', color: 'white' }}>👤</span> {/* CHANGED ICON AND MADE WHITE */}
                  </span>
                  Property Information
                </h4>
                
                {/* Property Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {/* Owner Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', color: 'white' }}>👤</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.25rem'
                      }}>
                        Owner
                      </div>
                      <div style={{ 
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#111827'
                      }}>
                        {selected.ownerId?.name || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', color: 'white' }}>📧</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.25rem'
                      }}>
                        Email
                      </div>
                      <div style={{ 
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#3b82f6'
                      }}>
                        {selected.ownerId?.email || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Category Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', color: 'white' }}>🏠</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.25rem'
                      }}>
                        Category
                      </div>
                      <div style={{ 
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#111827',
                        background: '#a855f7',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '16px',
                        fontSize: '0.8rem'
                      }}>
                        {selected.category?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', color: 'white' }}>💰</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.25rem'
                      }}>
                        Price
                      </div>
                      <div style={{ 
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        color: '#10b981'
                      }}>
                        ₹{selected.price?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Location Card - CHANGED RED COLOR */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // CHANGED FROM RED TO PURPLE
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', color: 'white' }}>📍</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.25rem'
                      }}>
                        Location
                      </div>
                      <div style={{ 
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#111827'
                      }}>
                        {selected.address ? 
                          `${selected.address.city}, ${selected.address.state}` : 
                          'N/A'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Date Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', color: 'white' }}>📅</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.25rem'
                      }}>
                        Submission Date
                      </div>
                      <div style={{ 
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#111827'
                      }}>
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                {selected.description && (
                  <div style={{ 
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      📝 Property Description
                    </div>
                    <p style={{ 
                      fontSize: '1rem',
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.6',
                      fontWeight: '500',
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Property Images Gallery */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '1.75rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}>
                  <h4 style={{ 
                    color: '#111827', 
                    marginBottom: '1.25rem',
                    fontSize: '1.125rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    letterSpacing: '-0.25px'
                  }}>
                    🖼️ Property Images ({selected.images.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '2px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          aspectRatio: '4/3',
                          minHeight: '150px',
                          maxHeight: '200px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #7c3aed';
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '2px solid rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <img 
                          src={image} 
                          alt={`Property ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          🔍
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '1.75rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}>
                  <h4 style={{ 
                    color: '#111827', 
                    marginBottom: '1.25rem',
                    fontSize: '1.125rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    letterSpacing: '-0.25px'
                  }}>
                    📄 Supporting Documents
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '1rem'
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          padding: '0.875rem 1.5rem',
                          border: '2px solid #e5e7eb',
                          color: '#374151',
                          background: '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #7c3aed';
                          e.currentTarget.style.color = '#7c3aed';
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(124, 58, 237, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '2px solid #e5e7eb';
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        📄 Owner Verification
                      </Button>
                    )}
                    {selected.propertyProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof Document')}
                        style={{
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          padding: '0.875rem 1.5rem',
                          border: '2px solid #e5e7eb',
                          color: '#374151',
                          background: '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #7c3aed';
                          e.currentTarget.style.color = '#7c3aed';
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(124, 58, 237, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '2px solid #e5e7eb';
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        📄 Property Documents
                      </Button>
                    )}
                    {selected.documents && selected.documents.map((doc, index) => (
                      <Button
                        key={index}
                        variant="outline-primary"
                        onClick={() => openFullscreen(doc, 'document', `Additional Document ${index + 1}`)}
                        style={{
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          padding: '0.875rem 1.5rem',
                          border: '2px solid #e5e7eb',
                          color: '#374151',
                          background: '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #7c3aed';
                          e.currentTarget.style.color = '#7c3aed';
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(124, 58, 237, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '2px solid #e5e7eb';
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        📄 Document {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Administrative Decision */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '1.75rem',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <h4 style={{ 
                  color: '#111827',
                  marginBottom: '1.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  letterSpacing: '-0.25px'
                }}>
                  ⚖️ Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: '#374151',
                        marginBottom: '0.625rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block'
                      }}>
                        Verification Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          padding: '0.875rem 1rem',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          background: '#ffffff',
                          color: '#111827',
                          height: '50px',
                          lineHeight: '1.2',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <option value="verified" style={{ background: '#ffffff', color: '#111827', padding: '0.5rem' }}>
                          ✅ Approve Property
                        </option>
                        <option value="rejected" style={{ background: '#ffffff', color: '#111827', padding: '0.5rem' }}>
                          ❌ Reject Property
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: '#374151',
                        marginBottom: '0.625rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block'
                      }}>
                        Administrative Notes (Optional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Enter verification notes..."
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e5e7eb',
                          padding: '0.875rem 1rem',
                          fontSize: '0.95rem',
                          resize: 'none',
                          background: '#ffffff',
                          color: '#111827',
                          height: '50px',
                          minHeight: '50px',
                          lineHeight: '1.2',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer style={{ 
          borderTop: '1px solid #e2e8f0', 
          padding: '1.25rem 1.75rem',
          background: 'rgba(255, 255, 255, 0.95)',
          gap: '1rem'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: '700',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '2px solid #6b7280',
              color: '#6b7280',
              background: '#ffffff'
            }}
          >
            Cancel Review
          </Button>
          <Button 
            variant={verifyStatus === 'verified' ? 'success' : 'danger'} 
            onClick={handleVerify} 
            disabled={submitting}
            style={{
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: '700',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              minWidth: '160px',
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                {verifyStatus === 'verified' ? '✅ Approve Property' : '❌ Reject Property'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Fullscreen Document Modal */}
      <Modal
        show={fullscreenDoc.show}
        onHide={closeFullscreen}
        size="xl"
        centered
        style={{
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <Modal.Header closeButton style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: '700' }}>
            {fullscreenDoc.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: 0, 
          textAlign: 'center',
          background: '#000',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {fullscreenDoc.type === 'image' ? (
            <img
              src={fullscreenDoc.src}
              alt="Document"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '80vh',
              background: '#fff',
              padding: '1rem'
            }}>
              <iframe
                src={fullscreenDoc.src}
                title="Document Preview"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000}
          autohide
          bg={toastType}
          style={{
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toast.Header style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontWeight: '700'
          }}>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Operation Successful' : '❌ System Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white" style={{
            fontSize: '0.95rem',
            fontWeight: '600'
          }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AdminVerifyProperties;
