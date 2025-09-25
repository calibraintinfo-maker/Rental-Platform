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
      {/* 🚀 PROFESSIONAL VIOLET THEME - MAIN CONTAINER */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #8e54e9 50%, #4776e6 75%, #764ba2 100%)',
        paddingTop: '60px', // REDUCED FROM 80px - MORE COMPACT
        paddingBottom: '2.5rem', // REDUCED
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
          {/* 🎯 IMPROVED COMPACT HEADER - OLD COLOR SCHEME RESTORED */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', // REDUCED FROM 3rem - MORE COMPACT
            padding: '1.5rem 2rem', // REDUCED FROM 2.5rem - COMPACT
            background: 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)', // OLD BEAUTIFUL GRADIENT
            borderRadius: '20px', // SLIGHTLY REDUCED
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h1 style={{
              fontSize: '2.25rem', // REDUCED FROM 3rem - PERFECT SIZE
              fontWeight: '800',
              color: '#ffffff', // CLEAN WHITE TEXT
              margin: 0,
              letterSpacing: '-0.5px',
              lineHeight: '1.2',
              marginBottom: '0.75rem', // REDUCED MARGIN
              textShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}>
              Property Verification Center
            </h1>
            <p style={{
              fontSize: '1rem', // REDUCED FROM 1.25rem - PERFECT SIZE
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              margin: 0,
              marginBottom: '1rem', // REDUCED MARGIN
              opacity: 0.95
            }}>
              Professional property management and verification system
            </p>
            <div style={{
              padding: '0.75rem 1.5rem', // REDUCED PADDING
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px', // SLIGHTLY SMALLER
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                color: '#ffffff',
                fontSize: '0.9rem', // PERFECT READABLE SIZE
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
              padding: '3rem 2.5rem', // REDUCED PADDING
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '25px', // SLIGHTLY REDUCED
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '600px', // REDUCED FROM 700px - MORE COMPACT
              margin: '0 auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: '100px', // REDUCED FROM 120px - MORE COMPACT
                height: '100px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem', // REDUCED MARGIN
                fontSize: '2.5rem', // REDUCED SIZE
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)'
              }}>
                ✅
              </div>
              <h2 style={{
                color: '#ffffff',
                fontSize: '2rem', // REDUCED FROM 2.5rem - PERFECT SIZE
                marginBottom: '1rem',
                fontWeight: '800',
                letterSpacing: '-0.25px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                All Properties Verified
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '1.125rem', // REDUCED FROM 1.375rem - PERFECT SIZE
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Outstanding work! No properties require verification at this time.
                The system is running smoothly and all submissions are up to date.
              </p>
            </div>
          ) : (
            <Row style={{ margin: '0 -15px' }}> {/* REDUCED MARGIN FROM -20px */}
              {properties.map(property => (
                <Col 
                  key={property._id} 
                  xl={4} 
                  lg={6} 
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 15px', marginBottom: '2rem' }} // REDUCED PADDING & MARGIN
                >
                  {/* 🚀 IMPROVED PROFESSIONAL VIOLET-THEMED PROPERTY CARD - SMALLER SIZE */}
                  <Card style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px', // REDUCED FROM 25px - MORE COMPACT
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)', // REDUCED SHADOW
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(20px)',
                    maxWidth: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.015)'; // REDUCED TRANSFORM
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.25)';
                    e.currentTarget.style.border = '1px solid rgba(142, 84, 233, 0.4)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  >
                    {/* COMPACT Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '180px', // REDUCED FROM 220px - MORE COMPACT
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
                            e.currentTarget.style.transform = 'scale(1.05)'; // REDUCED SCALE
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
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)'
                        }} />
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem', // REDUCED FROM 1.25rem
                          right: '1rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          padding: '0.375rem 0.875rem', // REDUCED PADDING
                          borderRadius: '20px',
                          fontSize: '0.7rem', // SLIGHTLY REDUCED SIZE
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

                    {/* IMPROVED Card Body - BETTER TEXT SIZES */}
                    <Card.Body style={{
                      padding: '1.5rem', // REDUCED FROM 2rem - MORE COMPACT
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      background: 'rgba(255, 255, 255, 0.05)'
                    }}>
                      {/* IMPROVED Title - BETTER SIZE */}
                      <h3 style={{
                        fontSize: '1.25rem', // REDUCED FROM 1.5rem - PERFECT SIZE
                        fontWeight: '800',
                        color: '#ffffff',
                        marginBottom: '1.25rem', // REDUCED MARGIN
                        lineHeight: '1.3',
                        letterSpacing: '-0.25px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {property.title}
                      </h3>

                      {/* IMPROVED Property Details Grid - BETTER TEXT SIZES */}
                      <div style={{ 
                        flexGrow: 1,
                        marginBottom: '1.5rem' // REDUCED MARGIN
                      }}>
                        <div style={{ 
                          display: 'grid', 
                          gap: '0.75rem', // REDUCED GAP - MORE COMPACT
                          marginBottom: '1.25rem'
                        }}>
                          {/* IMPROVED Owner Info - PERFECT TEXT SIZE */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.9rem', // INCREASED FROM 0.95rem - MORE READABLE
                            padding: '0.625rem 0', // REDUCED PADDING
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '40px' // REDUCED HEIGHT - MORE COMPACT
                          }}>
                            <span style={{ 
                              minWidth: '80px', // REDUCED FROM 85px - MORE COMPACT
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem', // PERFECT LABEL SIZE
                              letterSpacing: '0.5px'
                            }}>
                              👤 Owner:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.85)', // IMPROVED CONTRAST
                              fontWeight: '600',
                              fontSize: '0.9rem' // PERFECT READABLE SIZE
                            }}>
                              {property.ownerId?.name || 'N/A'}
                            </span>
                          </div>

                          {/* Email Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            padding: '0.625rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '40px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              📧 Email:
                            </span>
                            <span style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              color: 'rgba(255, 255, 255, 0.85)',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              {property.ownerId?.email || 'N/A'}
                            </span>
                          </div>

                          {/* Category Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            padding: '0.625rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '40px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              🏠 Type:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.85)', 
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              {property.category}
                            </span>
                          </div>

                          {/* Price Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            padding: '0.625rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '40px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              💰 Price:
                            </span>
                            <span style={{ 
                              color: '#4ade80',
                              fontWeight: '800',
                              fontSize: '1rem' // PERFECT HIGHLIGHT SIZE
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </span>
                          </div>

                          {/* Location Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.9rem',
                            padding: '0.625rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            minHeight: '40px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              📍 Location:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.85)', 
                              fontWeight: '600',
                              fontSize: '0.9rem'
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
                            fontSize: '0.9rem',
                            padding: '0.625rem 0',
                            minHeight: '40px'
                          }}>
                            <span style={{ 
                              minWidth: '80px', 
                              fontWeight: '700',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              📅 Submitted:
                            </span>
                            <span style={{ 
                              color: 'rgba(255, 255, 255, 0.85)', 
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              {new Date(property.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* PERFECT VIOLET ACTION BUTTON */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
                          border: 'none',
                          borderRadius: '12px', // REDUCED FROM 15px - MORE COMPACT
                          padding: '0.875rem 1.75rem', // REDUCED PADDING
                          fontSize: '0.85rem', // PERFECT SIZE
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 6px 16px rgba(142, 84, 233, 0.4)', // REDUCED SHADOW
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'; // REDUCED TRANSFORM
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(142, 84, 233, 0.6)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(142, 84, 233, 0.4)';
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

      {/* 🚀 IMPROVED PROFESSIONAL VIOLET-THEMED VERIFICATION MODAL */}
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
            background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0',
            padding: '1.25rem 1.75rem', // REDUCED PADDING
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.125rem', // REDUCED FROM 1.375rem - PERFECT SIZE
            fontWeight: '800',
            letterSpacing: '-0.25px'
          }}>
            🏠 Property Verification Portal - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '75vh', 
          overflowY: 'auto', 
          padding: '1.75rem', // REDUCED FROM 2rem
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* 🌟 IMPROVED PROPERTY INFORMATION CARD - BETTER TEXT SIZES */}
              <div style={{ 
                marginBottom: '1.75rem', // REDUCED MARGIN
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '18px', // REDUCED FROM 20px
                padding: '1.75rem', // REDUCED FROM 2rem
                border: '1px solid rgba(142, 84, 233, 0.1)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' // REDUCED SHADOW
              }}>
                <h4 style={{ 
                  color: '#1e293b', 
                  marginBottom: '1.25rem', // REDUCED MARGIN
                  fontSize: '1.125rem', // REDUCED FROM 1.25rem - PERFECT SIZE
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem', // REDUCED GAP
                  letterSpacing: '-0.25px'
                }}>
                  📋 Property Information
                </h4>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}> {/* REDUCED MARGIN */}
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.4rem', // REDUCED MARGIN
                        fontSize: '0.75rem', // PERFECT LABEL SIZE
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>👤 Property Owner</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '0.95rem', // PERFECT READABLE SIZE
                        fontWeight: '600'
                      }}>{selected.ownerId?.name || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📧 Contact Email</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>{selected.ownerId?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>🏠 Property Category</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>{selected.category}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>💰 Listed Price</div>
                      <div style={{ 
                        color: '#10b981',
                        fontWeight: '800',
                        fontSize: '1.125rem' // PERFECT HIGHLIGHT SIZE
                      }}>₹{selected.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#8e54e9',
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📍 Property Location</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '0.95rem',
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
                        marginBottom: '0.4rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📅 Submission Date</div>
                      <div style={{ 
                        color: '#475569',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                </Row>
                {selected.description && (
                  <div style={{ 
                    marginTop: '1.25rem', // REDUCED MARGIN
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(142, 84, 233, 0.1)'
                  }}>
                    <div style={{ 
                      fontWeight: '700',
                      color: '#8e54e9',
                      marginBottom: '0.625rem', // REDUCED MARGIN
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>📝 Property Description</div>
                    <p style={{ 
                      fontSize: '0.95rem',
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

              {/* 🌟 IMPROVED PROPERTY IMAGES GALLERY - LARGER SIZE */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '1.75rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '18px',
                  padding: '1.75rem',
                  border: '1px solid rgba(142, 84, 233, 0.1)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
                }}>
                  <h4 style={{ 
                    color: '#1e293b', 
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', // LARGER FROM 150px
                    gap: '1.5rem' // INCREASED GAP FOR BETTER SPACING
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '15px',
                          overflow: 'hidden',
                          border: '2px solid rgba(142, 84, 233, 0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          aspectRatio: '4/3',
                          minHeight: '140px', // LARGER FROM 120px
                          maxHeight: '200px' // LARGER FROM 180px
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #8e54e9';
                          e.currentTarget.style.transform = 'scale(1.03)'; // REDUCED SCALE
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(142, 84, 233, 0.3)';
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

              {/* 🌟 IMPROVED SUPPORTING DOCUMENTS - DEFAULT DARK + HOVER WHITE */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '1.75rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '18px',
                  padding: '1.75rem',
                  border: '1px solid rgba(142, 84, 233, 0.1)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
                }}>
                  <h4 style={{ 
                    color: '#1e293b', 
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
                    gap: '1.25rem' // INCREASED GAP
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          padding: '0.875rem 1.75rem', // INCREASED PADDING
                          border: '2px solid #8e54e9',
                          color: '#ffffff', // DEFAULT WHITE TEXT
                          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)', // DEFAULT VIOLET
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'; // HOVER WHITE
                          e.currentTarget.style.color = '#8e54e9'; // HOVER VIOLET TEXT
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100())'; // BACK TO VIOLET
                          e.currentTarget.style.color = '#ffffff'; // BACK TO WHITE TEXT
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
                          padding: '0.875rem 1.75rem',
                          border: '2px solid #8e54e9',
                          color: '#ffffff',
                          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                          e.currentTarget.style.color = '#8e54e9';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)';
                          e.currentTarget.style.color = '#ffffff';
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
                          padding: '0.875rem 1.75rem',
                          border: '2px solid #8e54e9',
                          color: '#ffffff',
                          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                          e.currentTarget.style.color = '#8e54e9';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(142, 84, 233, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)';
                          e.currentTarget.style.color = '#ffffff';
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

              {/* 🌟 FIXED ADMINISTRATIVE DECISION SECTION - VISIBLE TEXT */}
              <div style={{
                background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
                padding: '1.75rem', // REDUCED FROM 2rem
                borderRadius: '18px', // REDUCED FROM 20px
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 25px rgba(142, 84, 233, 0.3)' // REDUCED SHADOW
              }}>
                <h4 style={{ 
                  color: '#ffffff', 
                  marginBottom: '1.5rem', // REDUCED MARGIN
                  fontSize: '1.125rem', // REDUCED FROM 1.25rem
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
                        fontSize: '0.8rem', // REDUCED SIZE
                        fontWeight: '700',
                        color: '#ffffff', // PURE WHITE FOR VISIBILITY
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
                          borderRadius: '12px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          padding: '0.875rem 1rem',
                          fontSize: '0.95rem', // PERFECT SIZE
                          fontWeight: '600',
                          background: 'rgba(255, 255, 255, 0.95)', // LIGHT BACKGROUND
                          color: '#1e293b', // DARK TEXT FOR CONTRAST
                          backdropFilter: 'blur(10px)',
                          height: '50px',
                          lineHeight: '1.2'
                        }}
                      >
                        <option value="verified" style={{ background: '#ffffff', color: '#1e293b', padding: '0.5rem' }}>
                          ✅ Approve Property
                        </option>
                        <option value="rejected" style={{ background: '#ffffff', color: '#1e293b', padding: '0.5rem' }}>
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
                        color: '#ffffff', // PURE WHITE FOR VISIBILITY
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
                          borderRadius: '12px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          padding: '0.875rem 1rem',
                          fontSize: '0.95rem', // PERFECT SIZE
                          resize: 'none',
                          background: 'rgba(255, 255, 255, 0.95)', // LIGHT BACKGROUND
                          color: '#1e293b', // DARK TEXT FOR CONTRAST
                          backdropFilter: 'blur(10px)',
                          height: '50px',
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
          padding: '1.25rem 1.75rem', // REDUCED PADDING
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          gap: '1rem'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '12px',
              padding: '0.75rem 1.5rem', // REDUCED PADDING
              fontWeight: '700',
              fontSize: '0.8rem', // REDUCED SIZE
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '2px solid #64748b',
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
              padding: '0.75rem 1.5rem',
              fontWeight: '700',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              minWidth: '160px', // REDUCED WIDTH
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100())',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)' // REDUCED SHADOW
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
          background: 'linear-gradient(135deg, #8e54e9 0%, #4776e6 100%)',
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
            borderRadius: '12px', // REDUCED FROM 15px
            boxShadow: '0 12px 25px rgba(0, 0, 0, 0.2)', // REDUCED SHADOW
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
