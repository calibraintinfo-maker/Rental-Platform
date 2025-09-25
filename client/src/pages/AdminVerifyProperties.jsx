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
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
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
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
            }} 
          />
          <p style={{ 
            marginTop: '1rem', 
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        padding: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <Alert 
            variant="danger" 
            style={{
              background: '#fff',
              border: '2px solid #ef4444',
              borderRadius: '20px',
              padding: '2rem',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <strong>⚠️ System Error</strong><br/>{error}
          </Alert>
          <Button 
            variant="outline-primary" 
            onClick={fetchPending}
            style={{
              marginTop: '1.25rem',
              borderRadius: '14px',
              padding: '0.75rem 1.75rem',
              fontWeight: '700',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
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
      {/* Main Container - PERFECT COMPACT LIGHT THEME */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        paddingTop: '90px', // REDUCED from 120px
        paddingBottom: '3rem', // REDUCED from 4rem
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.03) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
          zIndex: 1
        }} />

        <Container style={{ position: 'relative', zIndex: 10, maxWidth: '1400px' }}>
          {/* COMPACT Header Section - SIGNIFICANTLY REDUCED */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2.5rem', // REDUCED from 4rem
            padding: '2rem 1.5rem', // REDUCED from 3rem 2rem
            background: 'rgba(255, 255, 255, 0.85)', // Slightly less opacity
            borderRadius: '20px', // REDUCED from 24px
            backdropFilter: 'blur(15px)', // REDUCED blur
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 15px 35px -8px rgba(0, 0, 0, 0.1)' // REDUCED shadow
          }}>
            <h1 style={{
              fontSize: '2.5rem', // REDUCED from 3.5rem
              fontWeight: '800', // REDUCED from 900
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.5px', // REDUCED spacing
              lineHeight: '1.1',
              marginBottom: '0.75rem' // REDUCED margin
            }}>
              Property Verification Center
            </h1>
            <p style={{
              fontSize: '1rem', // REDUCED from 1.375rem
              color: '#64748b',
              fontWeight: '500',
              margin: 0,
              marginBottom: '1.25rem', // REDUCED margin
              opacity: 0.9
            }}>
              Professional property management and verification system
            </p>
            <div style={{
              padding: '0.75rem 1.5rem', // REDUCED padding
              background: 'rgba(59, 130, 246, 0.08)', // REDUCED opacity
              borderRadius: '12px', // REDUCED radius
              border: '1px solid rgba(59, 130, 246, 0.15)', // REDUCED opacity
              display: 'inline-block'
            }}>
              <span style={{
                color: '#3b82f6',
                fontSize: '0.875rem', // REDUCED font size
                fontWeight: '600'
              }}>
                📊 {properties.length} Properties Pending Review
              </span>
            </div>
          </div>

          {/* Content Area */}
          {properties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 2.5rem', // REDUCED padding
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '24px', // REDUCED radius
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)', // REDUCED shadow
              maxWidth: '600px', // REDUCED width
              margin: '0 auto',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(15px)' // REDUCED blur
            }}>
              <div style={{
                width: '100px', // REDUCED size
                height: '100px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem', // REDUCED margin
                fontSize: '2.5rem', // REDUCED font size
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)' // REDUCED shadow
              }}>
                ✅
              </div>
              <h2 style={{
                color: '#1f2937',
                fontSize: '2rem', // REDUCED from 2.5rem
                marginBottom: '1rem', // REDUCED margin
                fontWeight: '700', // REDUCED weight
                letterSpacing: '-0.25px'
              }}>
                All Properties Verified
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.125rem', // REDUCED from 1.25rem
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                Outstanding work! No properties require verification at this time.
                The system is running smoothly and all submissions are up to date.
              </p>
            </div>
          ) : (
            <Row style={{ margin: '0 -15px' }}> {/* REDUCED margin */}
              {properties.map(property => (
                <Col 
                  key={property._id} 
                  xl={4} 
                  lg={6} 
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 15px', marginBottom: '2rem' }} // REDUCED padding and margin
                >
                  {/* PERFECT COMPACT PROPERTY CARD - INSPIRED BY YOUR IMAGES */}
                  <Card style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px', // REDUCED from 24px
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)', // REDUCED shadow
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(15px)', // REDUCED blur
                    maxWidth: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.015)'; // REDUCED transform
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)'; // REDUCED shadow
                    e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  }}
                  >
                    {/* COMPACT Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '180px', // REDUCED from 240px
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
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
                            e.currentTarget.style.transform = 'scale(1.05)'; // REDUCED scale
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
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%)'
                        }} />
                        {/* COMPACT Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem', // REDUCED from 1.5rem
                          right: '1rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          padding: '0.375rem 0.75rem', // REDUCED padding
                          borderRadius: '20px', // REDUCED radius
                          fontSize: '0.7rem', // REDUCED font size
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.25px',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)', // REDUCED shadow
                          border: '1.5px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          ⏳ PENDING
                        </div>
                      </div>
                    )}

                    {/* COMPACT Card Body */}
                    <Card.Body style={{
                      padding: '1.25rem', // REDUCED from 2rem
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}>
                      {/* COMPACT Title */}
                      <h3 style={{
                        fontSize: '1.125rem', // REDUCED from 1.375rem
                        fontWeight: '700', // REDUCED from 800
                        color: '#1f2937',
                        marginBottom: '1rem', // REDUCED margin
                        lineHeight: '1.3',
                        letterSpacing: '-0.15px'
                      }}>
                        {property.title}
                      </h3>

                      {/* COMPACT Property Details Grid */}
                      <div style={{ 
                        flexGrow: 1,
                        marginBottom: '1.5rem' // REDUCED margin
                      }}>
                        <div style={{ 
                          display: 'grid', 
                          gap: '0.625rem', // REDUCED gap
                          marginBottom: '1rem' // REDUCED margin
                        }}>
                          {/* COMPACT Owner Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem', // REDUCED font size
                            padding: '0.375rem 0', // REDUCED padding
                            borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                          }}>
                            <span style={{ 
                              minWidth: '70px', // REDUCED width
                              fontWeight: '600', // REDUCED weight
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem', // REDUCED font size
                              letterSpacing: '0.25px'
                            }}>
                              👤 Owner:
                            </span>
                            <span style={{ 
                              color: '#64748b', 
                              fontWeight: '500',
                              fontSize: '0.8rem' // REDUCED font size
                            }}>
                              {property.ownerId?.name || 'N/A'}
                            </span>
                          </div>

                          {/* COMPACT Email Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '0.375rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                          }}>
                            <span style={{ 
                              minWidth: '70px', 
                              fontWeight: '600',
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              letterSpacing: '0.25px'
                            }}>
                              📧 Email:
                            </span>
                            <span style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              color: '#64748b',
                              fontWeight: '500',
                              fontSize: '0.8rem'
                            }}>
                              {property.ownerId?.email || 'N/A'}
                            </span>
                          </div>

                          {/* COMPACT Category Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '0.375rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                          }}>
                            <span style={{ 
                              minWidth: '70px', 
                              fontWeight: '600',
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              letterSpacing: '0.25px'
                            }}>
                              🏠 Type:
                            </span>
                            <span style={{ 
                              color: '#64748b', 
                              fontWeight: '500',
                              fontSize: '0.8rem'
                            }}>
                              {property.category}
                            </span>
                          </div>

                          {/* COMPACT Price Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '0.375rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                          }}>
                            <span style={{ 
                              minWidth: '70px', 
                              fontWeight: '600',
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              letterSpacing: '0.25px'
                            }}>
                              💰 Price:
                            </span>
                            <span style={{ 
                              color: '#10b981', 
                              fontWeight: '700', // REDUCED weight
                              fontSize: '1rem' // REDUCED font size
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </span>
                          </div>

                          {/* COMPACT Location Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '0.375rem 0',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                          }}>
                            <span style={{ 
                              minWidth: '70px', 
                              fontWeight: '600',
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              letterSpacing: '0.25px'
                            }}>
                              📍 Location:
                            </span>
                            <span style={{ 
                              color: '#64748b', 
                              fontWeight: '500',
                              fontSize: '0.8rem'
                            }}>
                              {property.address ? 
                                `${property.address.city}, ${property.address.state}` : 
                                'N/A'
                              }
                            </span>
                          </div>

                          {/* COMPACT Date Info */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '0.375rem 0'
                          }}>
                            <span style={{ 
                              minWidth: '70px', 
                              fontWeight: '600',
                              color: '#3b82f6',
                              textTransform: 'uppercase',
                              fontSize: '0.7rem',
                              letterSpacing: '0.25px'
                            }}>
                              📅 Submitted:
                            </span>
                            <span style={{ 
                              color: '#64748b', 
                              fontWeight: '500',
                              fontSize: '0.8rem'
                            }}>
                              {new Date(property.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* COMPACT Action Button */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: 'none',
                          borderRadius: '12px', // REDUCED radius
                          padding: '0.75rem 1.5rem', // REDUCED padding
                          fontSize: '0.8rem', // REDUCED font size
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.25px', // REDUCED spacing
                          boxShadow: '0 6px 16px rgba(59, 130, 246, 0.25)', // REDUCED shadow
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'; // REDUCED transform
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)'; // REDUCED shadow
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.25)';
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

      {/* PROFESSIONAL VERIFICATION MODAL - SAME AS BEFORE BUT OPTIMIZED */}
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
            color: 'white',
            border: 'none',
            borderRadius: '0',
            padding: '1.25rem 1.75rem', // REDUCED padding
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.25rem', // REDUCED font size
            fontWeight: '700', // REDUCED weight
            letterSpacing: '-0.15px'
          }}>
            🏠 Property Verification Portal - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '75vh', 
          overflowY: 'auto', 
          padding: '1.75rem', // REDUCED padding
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* ULTRA COMPACT Property Information Card */}
              <div style={{ 
                marginBottom: '1.75rem', // REDUCED margin
                background: '#ffffff',
                borderRadius: '12px', // REDUCED radius
                padding: '1.25rem', // REDUCED padding
                border: '1px solid #e2e8f0',
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.04)' // REDUCED shadow
              }}>
                <h4 style={{ 
                  color: '#1e293b', 
                  marginBottom: '1rem', // REDUCED margin
                  fontSize: '1rem', // REDUCED font size
                  fontWeight: '700', // REDUCED weight
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem', // REDUCED gap
                  letterSpacing: '-0.15px'
                }}>
                  📋 Property Information
                </h4>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '0.875rem' }}> {/* REDUCED margin */}
                      <div style={{ 
                        fontWeight: '600', // REDUCED weight
                        color: '#3b82f6',
                        marginBottom: '0.25rem', // REDUCED margin
                        fontSize: '0.75rem', // REDUCED font size
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px'
                      }}>👤 Property Owner</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '0.875rem', // REDUCED font size
                        fontWeight: '500'
                      }}>{selected.ownerId?.name || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '0.875rem' }}>
                      <div style={{ 
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '0.25rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px'
                      }}>📧 Contact Email</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>{selected.ownerId?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '0.25rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px'
                      }}>🏠 Property Category</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>{selected.category}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: '0.875rem' }}>
                      <div style={{ 
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '0.25rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px'
                      }}>💰 Listed Price</div>
                      <div style={{ 
                        color: '#10b981',
                        fontWeight: '700', // REDUCED weight
                        fontSize: '1.125rem' // REDUCED font size
                      }}>₹{selected.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '0.875rem' }}>
                      <div style={{ 
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '0.25rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px'
                      }}>📍 Property Location</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {selected.address ? 
                          `${selected.address.city}, ${selected.address.state}` : 
                          'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '0.25rem',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px'
                      }}>📅 Submission Date</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                </Row>
                {selected.description && (
                  <div style={{ 
                    marginTop: '1.25rem', // REDUCED margin
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #e2e8f0' // REDUCED border
                  }}>
                    <div style={{ 
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '0.625rem', // REDUCED margin
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.25px'
                    }}>📝 Property Description</div>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: '#475569',
                      margin: 0,
                      lineHeight: '1.5', // REDUCED line height
                      fontWeight: '500'
                    }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* COMPACT Property Images Gallery */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '1.75rem',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.04)'
                }}>
                  <h4 style={{ 
                    color: '#1e293b', 
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    letterSpacing: '-0.15px'
                  }}>
                    🖼️ Property Images ({selected.images.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', // REDUCED min size
                    gap: '0.75rem' // REDUCED gap
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '10px', // REDUCED radius
                          overflow: 'hidden',
                          border: '1.5px solid #e2e8f0', // REDUCED border
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          aspectRatio: '4/3',
                          minHeight: '75px', // REDUCED height
                          maxHeight: '120px' // REDUCED height
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '1.5px solid #3b82f6';
                          e.currentTarget.style.transform = 'scale(1.02)'; // REDUCED scale
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.2)'; // REDUCED shadow
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '1.5px solid #e2e8f0';
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
                          bottom: '4px', // REDUCED spacing
                          right: '4px',
                          background: 'rgba(0, 0, 0, 0.65)', // REDUCED opacity
                          color: 'white',
                          borderRadius: '4px', // REDUCED radius
                          padding: '2px 4px', // REDUCED padding
                          fontSize: '0.7rem', // REDUCED font size
                          fontWeight: '600'
                        }}>
                          🔍
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPACT Supporting Documents */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '1.75rem',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.04)'
                }}>
                  <h4 style={{ 
                    color: '#1e293b', 
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    letterSpacing: '-0.15px'
                  }}>
                    📄 Supporting Documents
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem' // REDUCED gap
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '8px', // REDUCED radius
                          fontSize: '0.75rem', // REDUCED font size
                          fontWeight: '600', // REDUCED weight
                          padding: '0.5rem 1rem', // REDUCED padding
                          border: '1.5px solid #3b82f6', // REDUCED border
                          color: '#3b82f6',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)'; // REDUCED transform
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.transform = 'translateY(0)';
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
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.5rem 1rem',
                          border: '1.5px solid #3b82f6',
                          color: '#3b82f6',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.transform = 'translateY(0)';
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
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.5rem 1rem',
                          border: '1.5px solid #3b82f6',
                          color: '#3b82f6',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        📄 Document {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* PERFECT VERIFICATION DECISION SECTION - FIXED ALIGNMENT */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                padding: '1.5rem', // REDUCED padding
                borderRadius: '12px', // REDUCED radius
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)' // REDUCED shadow
              }}>
                <h4 style={{ 
                  color: '#ffffff', 
                  marginBottom: '1.25rem', // REDUCED margin
                  fontSize: '1rem', // REDUCED font size
                  fontWeight: '700', // REDUCED weight
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem', // REDUCED gap
                  letterSpacing: '-0.15px'
                }}>
                  ⚖️ Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.75rem', // REDUCED font size
                        fontWeight: '600', // REDUCED weight
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '0.375rem', // REDUCED margin
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px',
                        display: 'block'
                      }}>
                        Verification Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '8px', // REDUCED radius
                          border: '1.5px solid rgba(255, 255, 255, 0.2)', // REDUCED border
                          padding: '0.625rem 0.75rem', // REDUCED padding
                          fontSize: '0.875rem', // REDUCED font size
                          fontWeight: '600',
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          backdropFilter: 'blur(8px)', // REDUCED blur
                          height: '42px', // EXACT HEIGHT FOR PERFECT ALIGNMENT
                          lineHeight: '1.2'
                        }}
                      >
                        <option value="verified" style={{ background: '#1d4ed8', color: '#ffffff' }}>
                          ✅ Approve Property
                        </option>
                        <option value="rejected" style={{ background: '#1d4ed8', color: '#ffffff' }}>
                          ❌ Reject Property
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '0.375rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.25px',
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
                          borderRadius: '8px',
                          border: '1.5px solid rgba(255, 255, 255, 0.2)',
                          padding: '0.625rem 0.75rem',
                          fontSize: '0.875rem',
                          resize: 'none',
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          backdropFilter: 'blur(8px)',
                          height: '42px', // EXACT HEIGHT FOR PERFECT ALIGNMENT
                          minHeight: '42px',
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
          padding: '1.25rem 1.75rem', // REDUCED padding
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          gap: '0.875rem' // REDUCED gap
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '8px', // REDUCED radius
              padding: '0.625rem 1.5rem', // REDUCED padding
              fontWeight: '600', // REDUCED weight
              fontSize: '0.75rem', // REDUCED font size
              textTransform: 'uppercase',
              letterSpacing: '0.25px',
              border: '1.5px solid #64748b', // REDUCED border
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
              borderRadius: '8px',
              padding: '0.625rem 1.5rem',
              fontWeight: '600',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.25px',
              minWidth: '160px', // REDUCED width
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)' // REDUCED shadow
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

      {/* Fullscreen Document Modal - Same as before */}
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
          background: '#3b82f6',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title style={{ fontSize: '1rem', fontWeight: '600' }}>
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
                borderRadius: '6px'
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
                  borderRadius: '6px'
                }}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* COMPACT Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} // REDUCED delay
          autohide
          bg={toastType}
          style={{
            borderRadius: '10px', // REDUCED radius
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)', // REDUCED shadow
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toast.Header style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontWeight: '600' // REDUCED weight
          }}>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Operation Successful' : '❌ System Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white" style={{
            fontSize: '0.875rem', // REDUCED font size
            fontWeight: '500' // REDUCED weight
          }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AdminVerifyProperties;
