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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e54e9 50%, #4776e6 75%, #764ba2 100%)',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spinner 
            animation="border" 
            variant="light" 
            style={{ 
              width: '3.5rem', 
              height: '3.5rem', 
              borderWidth: '4px',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
            }} 
          />
          <p style={{ 
            marginTop: '1.5rem', 
            color: '#ffffff', 
            fontSize: '1.1rem', 
            fontWeight: '600',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e54e9 50%, #4776e6 75%, #764ba2 100%)',
        padding: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <Alert 
            variant="danger" 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #ef4444',
              borderRadius: '20px',
              padding: '2rem',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <strong>⚠️ System Error</strong><br/>{error}
          </Alert>
          <Button 
            onClick={fetchPending}
            style={{
              marginTop: '1.5rem',
              background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
              border: 'none',
              borderRadius: '15px',
              padding: '0.875rem 2rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 8px 16px rgba(142, 84, 233, 0.4)',
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
      {/* PROFESSIONAL VIOLET THEME - MAIN CONTAINER */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e54e9 50%, #4776e6 75%, #764ba2 100%)',
        paddingTop: '80px', // COMPACT HEADER
        paddingBottom: '3rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elegant Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 1
        }} />

        <Container style={{ position: 'relative', zIndex: 10, maxWidth: '1400px' }}>
          {/* PROFESSIONAL COMPACT HEADER */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '3rem', // COMPACT
            padding: '2.5rem 2rem', // PROFESSIONAL SPACING
            background: 'rgba(255, 255, 255, 0.15)', // ELEGANT TRANSPARENCY
            borderRadius: '25px', // MODERN ROUNDED
            backdropFilter: 'blur(20px)', // GLASS EFFECT
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' // PROFESSIONAL SHADOW
          }}>
            <h1 style={{
              fontSize: '3rem', // PROFESSIONAL SIZE
              fontWeight: '900', // BOLD IMPACT
              background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 50%, #e5e7eb 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-1px',
              lineHeight: '1.1',
              marginBottom: '1rem',
              textShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              Property Verification Center
            </h1>
            <p style={{
              fontSize: '1.25rem', // PROFESSIONAL SIZE
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              margin: 0,
              marginBottom: '1.5rem',
              opacity: 0.95
            }}>
              Professional property management and verification system
            </p>
            <div style={{
              padding: '1rem 2rem', // PROFESSIONAL PADDING
              background: 'rgba(255, 255, 255, 0.1)', // SUBTLE BACKGROUND
              borderRadius: '15px', // SMOOTH CORNERS
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '1rem', // READABLE SIZE
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                📊 {properties.length} Properties Pending Review
              </span>
            </div>
          </div>

          {/* Content Area */}
          {properties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 3rem', // PROFESSIONAL SPACING
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '30px', // ELEGANT ROUNDED
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '700px', // PROFESSIONAL WIDTH
              margin: '0 auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: '120px', // PROFESSIONAL SIZE
                height: '120px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2.5rem',
                fontSize: '3rem', // ELEGANT SIZE
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
              }}>
                ✅
              </div>
              <h2 style={{
                color: '#ffffff',
                fontSize: '2.5rem', // IMPACTFUL SIZE
                marginBottom: '1.25rem',
                fontWeight: '800', // PROFESSIONAL WEIGHT
                letterSpacing: '-0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                All Properties Verified
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '1.375rem', // PROFESSIONAL SIZE
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Outstanding work! No properties require verification at this time.
                The system is running smoothly and all submissions are up to date.
              </p>
            </div>
          ) : (
            <Row style={{ margin: '0 -20px' }}>
              {properties.map(property => (
                <Col 
                  key={property._id} 
                  xl={4} 
                  lg={6} 
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 20px', marginBottom: '2.5rem' }}
                >
                  {/* 🚀 PROFESSIONAL VIOLET-THEMED PROPERTY CARD */}
                  <Card style={{
                    background: 'rgba(255, 255, 255, 0.15)', // ELEGANT GLASS EFFECT
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px', // PROFESSIONAL ROUNDED
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)', // ELEGANT SHADOW
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(20px)', // PROFESSIONAL BLUR
                    maxWidth: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.25)';
                    e.currentTarget.style.border = '1px solid rgba(142, 84, 233, 0.4)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  >
                    {/* PROFESSIONAL Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '220px', // PERFECT SIZE
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
                            transition: 'transform 0.4s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                        {/* PROFESSIONAL Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)'
                        }} />
                        {/* PROFESSIONAL Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1.25rem',
                          right: '1.25rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          padding: '0.5rem 1rem', // PROFESSIONAL PADDING
                          borderRadius: '25px', // PILL SHAPE
                          fontSize: '0.75rem', // ELEGANT SIZE
                          fontWeight: '800', // BOLD
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
                          border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}>
                          ⏳ PENDING
                        </div>
                      </div>
                    )}

                    {/* PROFESSIONAL Card Body */}
                    <Card.Body style={{
                      padding: '2rem', // PROFESSIONAL SPACING
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      background: 'rgba(255, 255, 255, 0.05)' // SUBTLE BACKGROUND
                    }}>
                      {/* PROFESSIONAL Title */}
                      <h3 style={{
                        fontSize: '1.5rem', // PROFESSIONAL SIZE
                        fontWeight: '800', // STRONG WEIGHT
                        color: '#ffffff',
                        marginBottom: '1.5rem',
                        lineHeight: '1.3',
                        letterSpacing: '-0.25px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {property.title}
                      </h3>

                      {/* PROFESSIONAL Property Details Grid */}
                      <div style={{ 
                        flexGrow: 1,
                        marginBottom: '2rem'
                      }}>
                        <div style={{ 
                          display: 'grid', 
                          gap: '1rem', // PROFESSIONAL SPACING
                          marginBottom: '1.5rem'
                        }}>
                          {/* PROFESSIONAL Owner Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.95rem', // READABLE SIZE
                            padding: '0.75rem 0', // COMFORTABLE SPACING
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // ELEGANT BORDER
                            minHeight: '45px' // CONSISTENT HEIGHT
                          }}>
                            <span style={{ 
                              minWidth: '85px', // PROFESSIONAL WIDTH
                              fontWeight: '700', // STRONG WEIGHT
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem', // LABEL SIZE
                              letterSpacing: '0.5px'
                            }}>
                              👤 Owner:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.8)', 
                              fontWeight: '600', // PROFESSIONAL WEIGHT
                              fontSize: '0.95rem'
                            }}>
                              {property.ownerId?.name || 'N/A'}
                            </span>
                          </div>

                          {/* PROFESSIONAL Email Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.95rem',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '45px'
                          }}>
                            <span style={{ 
                              minWidth: '85px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}>
                              📧 Email:
                            </span>
                            <span style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {property.ownerId?.email || 'N/A'}
                            </span>
                          </div>

                          {/* PROFESSIONAL Category Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.95rem',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '45px'
                          }}>
                            <span style={{ 
                              minWidth: '85px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}>
                              🏠 Type:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.8)', 
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {property.category}
                            </span>
                          </div>

                          {/* PROFESSIONAL Price Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.95rem',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '45px'
                          }}>
                            <span style={{ 
                              minWidth: '85px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}>
                              💰 Price:
                            </span>
                            <span style={{ 
                              color: '#4ade80', // PROFESSIONAL GREEN
                              fontWeight: '800', // STRONG EMPHASIS
                              fontSize: '1.1rem' // HIGHLIGHT SIZE
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </span>
                          </div>

                          {/* PROFESSIONAL Location Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.95rem',
                            padding: '0.75rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '45px'
                          }}>
                            <span style={{ 
                              minWidth: '85px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}>
                              📍 Location:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.8)', 
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {property.address ? 
                                `${property.address.city}, ${property.address.state}` : 
                                'N/A'
                              }
                            </span>
                          </div>

                          {/* PROFESSIONAL Date Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.95rem',
                            padding: '0.75rem 0',
                            minHeight: '45px'
                          }}>
                            <span style={{ 
                              minWidth: '85px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}>
                              📅 Submitted:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.8)', 
                              fontWeight: '600',
                              fontSize: '0.95rem'
                            }}>
                              {new Date(property.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PROFESSIONAL VIOLET ACTION BUTTON */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)', // VIOLET GRADIENT
                          border: 'none',
                          borderRadius: '15px', // PROFESSIONAL ROUNDED
                          padding: '1rem 2rem', // GENEROUS PADDING
                          fontSize: '0.9rem', // READABLE SIZE
                          fontWeight: '800', // STRONG WEIGHT
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px', // PROFESSIONAL SPACING
                          boxShadow: '0 8px 20px rgba(142, 84, 233, 0.4)', // VIOLET SHADOW
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 12px 28px rgba(142, 84, 233, 0.6)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(142, 84, 233, 0.4)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)';
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

      {/* 🚀 PROFESSIONAL VIOLET-THEMED VERIFICATION MODAL */}
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
            background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)', // VIOLET GRADIENT
            color: 'white',
            border: 'none',
            borderRadius: '0',
            padding: '1.5rem 2rem', // PROFESSIONAL PADDING
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.375rem', // PROFESSIONAL SIZE
            fontWeight: '800', // STRONG WEIGHT
            letterSpacing: '-0.25px'
          }}>
            🏠 Property Verification Portal - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '75vh', 
          overflowY: 'auto', 
          padding: '2rem', // PROFESSIONAL SPACING
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* 🌟 PROFESSIONAL PROPERTY INFORMATION CARD */}
              <div style={{ 
                marginBottom: '2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '20px', // PROFESSIONAL ROUNDED
                padding: '2rem', // GENEROUS PADDING
                border: '1px solid rgba(142, 84, 233, 0.1)', // VIOLET ACCENT
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)' // ELEGANT SHADOW
              }}>
                <h4 style={{ 
                  color: '#1e293b', 
                  marginBottom: '1.5rem',
                  fontSize: '1.25rem', // PROFESSIONAL SIZE
                  fontWeight: '800', // STRONG WEIGHT
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '-0.25px'
                }}>
                  📋 Property Information
                </h4>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700', // STRONG LABELS
                        color: '#8e54e9', // VIOLET COLOR
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem', // PROFESSIONAL SIZE
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>👤 Property Owner</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '1rem', // READABLE SIZE
                        fontWeight: '600' // PROFESSIONAL WEIGHT
                      }}>{selected.ownerId?.name || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📧 Contact Email</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>{selected.ownerId?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>🏠 Property Category</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>{selected.category}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>💰 Listed Price</div>
                      <div style={{ 
                        color: '#10b981',
                        fontWeight: '800', // STRONG EMPHASIS
                        fontSize: '1.25rem' // HIGHLIGHT SIZE
                      }}>₹{selected.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📍 Property Location</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {selected.address ? 
                          `${selected.address.city}, ${selected.address.state}` : 
                          'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.5rem',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📅 Submission Date</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                </Row>
                {selected.description && (
                  <div style={{ 
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(142, 84, 233, 0.1)'
                  }}>
                    <div style={{ 
                      fontWeight: '700',
                      color: '#8e54e9',
                      marginBottom: '0.75rem',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>📝 Property Description</div>
                    <p style={{ 
                      fontSize: '1rem',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.6',
                      fontWeight: '500'
                    }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* 🌟 LARGER PROFESSIONAL PROPERTY IMAGES GALLERY */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '2rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(142, 84, 233, 0.1)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)'
                }}>
                  <h4 style={{ 
                    color: '#1e293b', 
                    marginBottom: '1.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    letterSpacing: '-0.25px'
                  }}>
                    🖼️ Property Images ({selected.images.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // LARGER SIZE
                    gap: '1.25rem' // PROFESSIONAL SPACING
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '15px', // PROFESSIONAL ROUNDED
                          overflow: 'hidden',
                          border: '2px solid rgba(142, 84, 233, 0.1)', // VIOLET ACCENT
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          aspectRatio: '4/3',
                          minHeight: '120px', // LARGER SIZE
                          maxHeight: '180px' // PERFECT SIZE
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #8e54e9';
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '2px solid rgba(142, 84, 233, 0.1)';
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

              {/* 🌟 LARGER PROFESSIONAL SUPPORTING DOCUMENTS */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '2rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(142, 84, 233, 0.1)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)'
                }}>
                  <h4 style={{ 
                    color: '#1e293b', 
                    marginBottom: '1.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    letterSpacing: '-0.25px'
                  }}>
                    📄 Supporting Documents
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '1.25rem' // PROFESSIONAL SPACING
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '12px', // PROFESSIONAL ROUNDED
                          fontSize: '0.85rem', // READABLE SIZE
                          fontWeight: '700', // STRONG WEIGHT
                          padding: '0.75rem 1.5rem', // GENEROUS PADDING
                          border: '2px solid #8e54e9', // VIOLET BORDER
                          color: '#8e54e9',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#8e54e9';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#8e54e9';
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
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          padding: '0.75rem 1.5rem',
                          border: '2px solid #8e54e9',
                          color: '#8e54e9',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#8e54e9';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#8e54e9';
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
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          padding: '0.75rem 1.5rem',
                          border: '2px solid #8e54e9',
                          color: '#8e54e9',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#8e54e9';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#8e54e9';
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

              {/* 🌟 LARGER PROFESSIONAL VIOLET ADMINISTRATIVE DECISION SECTION */}
              <div style={{
                background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)', // VIOLET GRADIENT
                padding: '2rem', // GENEROUS PADDING
                borderRadius: '20px', // PROFESSIONAL ROUNDED
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 15px 30px rgba(142, 84, 233, 0.3)' // PROFESSIONAL SHADOW
              }}>
                <h4 style={{ 
                  color: '#ffffff', 
                  marginBottom: '1.75rem', // GENEROUS MARGIN
                  fontSize: '1.25rem', // PROFESSIONAL SIZE
                  fontWeight: '800', // STRONG WEIGHT
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '-0.25px'
                }}>
                  ⚖️ Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.85rem', // PROFESSIONAL SIZE
                        fontWeight: '700', // STRONG WEIGHT
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '0.75rem', // GENEROUS MARGIN
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
                          borderRadius: '12px', // PROFESSIONAL ROUNDED
                          border: '2px solid rgba(255, 255, 255, 0.2)', // PROFESSIONAL BORDER
                          padding: '0.875rem 1rem', // GENEROUS PADDING
                          fontSize: '1rem', // READABLE SIZE
                          fontWeight: '600',
                          background: 'rgba(255, 255, 255, 0.2)', // ELEGANT TRANSPARENCY
                          color: '#ffffff',
                          backdropFilter: 'blur(10px)',
                          height: '50px', // PERFECT HEIGHT FOR ALIGNMENT
                          lineHeight: '1.2'
                        }}
                      >
                        <option value="verified" style={{ background: '#4776e6', color: '#ffffff' }}>
                          ✅ Approve Property
                        </option>
                        <option value="rejected" style={{ background: '#4776e6', color: '#ffffff' }}>
                          ❌ Reject Property
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '0.75rem',
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
                          borderRadius: '12px',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          resize: 'none',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          backdropFilter: 'blur(10px)',
                          height: '50px', // PERFECT ALIGNMENT
                          minHeight: '50px',
                          lineHeight: '1.2'
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
          padding: '1.5rem 2rem', // PROFESSIONAL PADDING
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          gap: '1rem' // PROFESSIONAL SPACING
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '12px', // PROFESSIONAL ROUNDED
              padding: '0.875rem 1.75rem', // GENEROUS PADDING
              fontWeight: '700', // STRONG WEIGHT
              fontSize: '0.85rem', // READABLE SIZE
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '2px solid #64748b', // PROFESSIONAL BORDER
              color: '#64748b'
            }}
          >
            Cancel Review
          </Button>
          <Button 
            variant={verifyStatus === 'verified' ? 'success' : 'danger'} 
            onClick={handleVerify} 
            disabled={submitting}
            style={{
              borderRadius: '12px',
              padding: '0.875rem 1.75rem',
              fontWeight: '700',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              minWidth: '180px', // PROFESSIONAL WIDTH
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)' // PROFESSIONAL SHADOW
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

      {/* Fullscreen Document Modal - Professional Violet Theme */}
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
          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title style={{ fontSize: '1.125rem', fontWeight: '700' }}>
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

      {/* PROFESSIONAL VIOLET Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} // PROFESSIONAL TIMING
          autohide
          bg={toastType}
          style={{
            borderRadius: '15px', // PROFESSIONAL ROUNDED
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)', // ELEGANT SHADOW
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toast.Header style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontWeight: '700' // PROFESSIONAL WEIGHT
          }}>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Operation Successful' : '❌ System Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white" style={{
            fontSize: '1rem', // READABLE SIZE
            fontWeight: '600' // PROFESSIONAL WEIGHT
          }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AdminVerifyProperties;
