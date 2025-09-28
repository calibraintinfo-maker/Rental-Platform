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
      {/* Main Container */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        paddingTop: '120px',
        paddingBottom: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Animation */}
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
          {/* 🔥 PERFECT SIZED PROFESSIONAL HERO SECTION */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '1.75rem', // Reduced from 2rem
            padding: '2rem 2.5rem', // Reduced from 3rem
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)', 
            borderRadius: '20px', // Reduced from 24px
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(124, 58, 237, 0.08)',
            maxWidth: '800px', // Reduced from 900px
            margin: '0 auto 1.75rem auto', // Reduced margin
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Smaller animated background elements */}
            <div style={{
              position: 'absolute',
              top: '-30px', // Reduced from -50px
              right: '-30px', // Reduced from -50px
              width: '100px', // Reduced from 150px
              height: '100px', // Reduced from 150px
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-20px', // Reduced from -30px
              left: '-20px', // Reduced from -30px
              width: '70px', // Reduced from 100px
              height: '70px', // Reduced from 100px
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, transparent 100%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Compact SpaceLink Brand */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px', // Reduced from 20px
              marginBottom: '1.5rem', // Reduced from 2rem
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                width: '56px', // Reduced from 70px
                height: '56px', // Reduced from 70px
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                borderRadius: '16px', // Reduced from 20px
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px', // Reduced from 28px
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '0',
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  borderRadius: '16px',
                  opacity: 0.6, // Reduced opacity
                  filter: 'blur(15px)', // Reduced blur
                  zIndex: -1
                }} />
                🏠
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem', // Reduced from 2.5rem
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: '1'
                }}>
                  SpaceLink
                </h1>
                <div style={{
                  fontSize: '0.75rem', // Reduced from 0.8rem
                  color: '#7c3aed',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px', // Reduced from 2px
                  marginTop: '3px' // Reduced from 4px
                }}>
                  Admin Portal
                </div>
              </div>
            </div>

            {/* Compact Main Title */}
            <h2 style={{
              fontSize: '1.875rem', // Reduced from 2.25rem
              fontWeight: '800',
              color: '#1a202c',
              margin: '0 0 0.75rem 0', // Reduced from 1rem
              letterSpacing: '-0.025em',
              lineHeight: '1.2'
            }}>
              Property Verification Center
            </h2>
            
            {/* Compact Subtitle */}
            <p style={{
              fontSize: '1rem', // Reduced from 1.125rem
              color: '#64748b',
              fontWeight: '500',
              margin: '0 0 1.5rem 0', // Reduced from 2rem
              lineHeight: '1.5', // Reduced from 1.6
              maxWidth: '500px', // Reduced from 600px
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Professional property management and verification system
            </p>
            
            {/* Compact Stats Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px', // Reduced from 12px
              padding: '0.75rem 1.5rem', // Reduced from 1rem 2rem
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)',
              borderRadius: '40px', // Reduced from 50px
              border: '1px solid rgba(124, 58, 237, 0.15)',
              backdropFilter: 'blur(8px)', // Reduced from 10px
              boxShadow: '0 6px 20px rgba(124, 58, 237, 0.12)' // Reduced shadow
            }}>
              <div style={{
                width: '28px', // Reduced from 32px
                height: '28px', // Reduced from 32px
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px' // Reduced from 14px
              }}>
                📊
              </div>
              <span style={{
                color: '#7c3aed',
                fontSize: '0.9rem', // Reduced from 1rem
                fontWeight: '700'
              }}>
                {properties.length} Properties Pending Review
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
                  xl={3}
                  lg={4}
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 12px', marginBottom: '1.5rem' }}
                >
                  {/* 🔥 PERFECT INDUSTRY-STANDARD PROPERTY CARD */}
                  <Card style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(224, 231, 255, 0.6)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(10px)',
                    maxWidth: '340px',
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(124, 58, 237, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(224, 231, 255, 0.6)';
                  }}
                  >
                    {/* Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '180px',
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
                            e.currentTarget.style.transform = 'scale(1.05)';
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
                          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
                        }} />
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          color: '#f59e0b',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                          PENDING
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div style={{
                      padding: '20px', // Perfect padding
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'transparent'
                    }}>
                      {/* Title */}
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '16px', // Perfect spacing
                        lineHeight: '1.3',
                        letterSpacing: '-0.02em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {property.title}
                      </h3>

                      {/* 🔥 PERFECT INDUSTRY-STANDARD LABELS WITH OPTIMAL SIZING */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px', // Perfect gap
                        marginBottom: '16px' // Perfect margin
                      }}>
                        {/* Owner */}
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '10px', // Perfect radius
                          padding: '12px', // Perfect padding
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px' // Perfect gap
                        }}>
                          <div style={{
                            width: '24px', // Perfect icon size
                            height: '24px',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px', // Perfect icon font size
                            flexShrink: 0
                          }}>
                            👤
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '0.6rem', // Perfect label size
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '2px', // Perfect spacing
                              lineHeight: '1'
                            }}>
                              OWNER
                            </div>
                            <div style={{
                              fontSize: '0.85rem', // Perfect value size
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: '1.2'
                            }}>
                              {property.ownerId?.name || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Type */}
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            flexShrink: 0
                          }}>
                            🏠
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '0.6rem',
                              fontWeight: '700',
                              color: '#d97706',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '2px',
                              lineHeight: '1'
                            }}>
                              TYPE
                            </div>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: '1.2'
                            }}>
                              {property.category}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            flexShrink: 0
                          }}>
                            💰
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '0.6rem',
                              fontWeight: '700',
                              color: '#059669',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '2px',
                              lineHeight: '1'
                            }}>
                              PRICE
                            </div>
                            <div style={{
                              fontSize: '0.9rem', // Slightly larger for price
                              fontWeight: '700',
                              color: '#10b981',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: '1.2'
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            flexShrink: 0
                          }}>
                            📍
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '0.6rem',
                              fontWeight: '700',
                              color: '#7c3aed',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              marginBottom: '2px',
                              lineHeight: '1'
                            }}>
                              LOCATION
                            </div>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              lineHeight: '1.2'
                            }}>
                              {property.address ? 
                                `${property.address.city}, ${property.address.state}` : 
                                'N/A'
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SUBMITTED DATE - Perfect Spacing */}
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '20px'
                      }}>
                        <div style={{
                          width: '26px', // Slightly larger for submitted
                          height: '26px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          borderRadius: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          flexShrink: 0
                        }}>
                          📅
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            color: '#4f46e5',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '2px'
                          }}>
                            SUBMITTED
                          </div>
                          <span style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#374151'
                          }}>
                            {new Date(property.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px 20px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          letterSpacing: '0.3px',
                          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)',
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.35)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.25)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                        }}
                      >
                        🔍 Review Property
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* 🔥 PROFESSIONAL MODAL WITH PERFECT SIZING */}
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
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0',
            padding: '1.75rem 2rem', // Reduced from 2rem 2.5rem
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}
        >
          {/* Simple Clean Cross Button */}
          <button
            type="button"
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '20px', // Reduced from 24px
              right: '26px', // Reduced from 30px
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '26px', // Reduced from 28px
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '300',
              lineHeight: '1',
              width: '30px', // Reduced from 32px
              height: '30px', // Reduced from 32px
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>

          {/* Compact Modal Title */}
          <div style={{ paddingRight: '50px' }}> {/* Reduced from 60px */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem', // Reduced from 1.5rem
              marginBottom: '0.5rem' // Reduced from 0.75rem
            }}>
              <div style={{
                width: '48px', // Reduced from 56px
                height: '48px', // Reduced from 56px
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '14px', // Reduced from 16px
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px', // Reduced from 24px
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                🏠
              </div>
              <div>
                <h2 style={{
                  color: 'white',
                  fontSize: '1.3rem', // Reduced from 1.5rem
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '-0.025em'
                }}>
                  Property Verification Portal
                </h2>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem', // Reduced from 1rem
                  fontWeight: '500',
                  marginTop: '0.25rem' // Reduced from 0.5rem
                }}>
                  Review & verify: <strong>{selected?.title}</strong>
                </div>
              </div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '75vh', 
          overflowY: 'auto', 
          padding: '1.75rem', // Reduced from 2rem
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* Property Information Card */}
              <div style={{ 
                marginBottom: '1.75rem', // Reduced from 2rem
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '18px', // Reduced from 20px
                padding: '1.75rem', // Reduced from 2rem
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)' // Reduced from 0 8px 25px
              }}>
                <h4 style={{ 
                  color: '#111827', 
                  marginBottom: '1.5rem', // Reduced from 1.75rem
                  fontSize: '1.25rem', // Reduced from 1.375rem
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem', // Reduced from 1rem
                  letterSpacing: '-0.025em'
                }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px', // Reduced from 12px
                    padding: '0.625rem', // Reduced from 0.75rem
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.125rem', color: 'white' }}>👤</span> {/* Reduced from 1.25rem */}
                  </span>
                  Property Information
                </h4>
                
                {/* Property Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Reduced from 300px
                  gap: '1.125rem', // Reduced from 1.25rem
                  marginBottom: '1.75rem' // Reduced from 2rem
                }}>
                  {/* Owner Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '14px', // Reduced from 16px
                    padding: '1.125rem', // Reduced from 1.25rem
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem' // Reduced from 1rem
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '10px', // Reduced from 12px
                      padding: '0.625rem', // Reduced from 0.75rem
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.125rem', color: 'white' }}>👤</span> {/* Reduced from 1.25rem */}
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem', // Reduced from 0.8rem
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.375rem' // Reduced from 0.5rem
                      }}>
                        Owner
                      </div>
                      <div style={{ 
                        fontSize: '1.0625rem', // Reduced from 1.125rem
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
                    borderRadius: '14px',
                    padding: '1.125rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '10px',
                      padding: '0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.125rem', color: 'white' }}>📧</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.375rem'
                      }}>
                        Email
                      </div>
                      <div style={{ 
                        fontSize: '1.0625rem',
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
                    borderRadius: '14px',
                    padding: '1.125rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '10px',
                      padding: '0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.125rem', color: 'white' }}>🏠</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.375rem'
                      }}>
                        Category
                      </div>
                      <div style={{ 
                        fontSize: '0.9375rem', // Reduced from 1rem
                        fontWeight: '700',
                        color: 'white',
                        background: '#a855f7',
                        padding: '0.3125rem 0.875rem', // Reduced from 0.375rem 1rem
                        borderRadius: '18px', // Reduced from 20px
                        display: 'inline-block'
                      }}>
                        {selected.category?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '14px',
                    padding: '1.125rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      padding: '0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.125rem', color: 'white' }}>💰</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.375rem'
                      }}>
                        Price
                      </div>
                      <div style={{ 
                        fontSize: '1.25rem', // Reduced from 1.375rem
                        fontWeight: '800',
                        color: '#10b981'
                      }}>
                        ₹{selected.price?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '14px',
                    padding: '1.125rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '10px',
                      padding: '0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.125rem', color: 'white' }}>📍</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.375rem'
                      }}>
                        Location
                      </div>
                      <div style={{ 
                        fontSize: '1.0625rem',
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
                    borderRadius: '14px',
                    padding: '1.125rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      borderRadius: '10px',
                      padding: '0.625rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '1.125rem', color: 'white' }}>📅</span>
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.375rem'
                      }}>
                        Submission Date
                      </div>
                      <div style={{ 
                        fontSize: '1.0625rem',
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
                    marginTop: '1.75rem', // Reduced from 2rem
                    paddingTop: '1.75rem', // Reduced from 2rem
                    borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{ 
                      fontSize: '0.75rem', // Reduced from 0.8rem
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.875rem', // Reduced from 1rem
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      📝 Property Description
                    </div>
                    <p style={{ 
                      fontSize: '1.0625rem', // Reduced from 1.125rem
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.6', // Reduced from 1.7
                      fontWeight: '500',
                      background: '#f8fafc',
                      padding: '1.3125rem', // Reduced from 1.5rem
                      borderRadius: '10px', // Reduced from 12px
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
                  borderRadius: '18px',
                  padding: '1.75rem',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)'
                }}>
                  <h4 style={{ 
                    color: '#111827', 
                    marginBottom: '1.375rem', // Reduced from 1.5rem
                    fontSize: '1.1875rem', // Reduced from 1.25rem
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6875rem', // Reduced from 0.75rem
                    letterSpacing: '-0.025em'
                  }}>
                    🖼️ Property Images ({selected.images.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Reduced from 220px
                    gap: '1.375rem' // Reduced from 1.5rem
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '10px', // Reduced from 12px
                          overflow: 'hidden',
                          border: '2px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          aspectRatio: '4/3',
                          minHeight: '140px', // Reduced from 160px
                          maxHeight: '200px' // Reduced from 220px
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #667eea';
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
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
                  borderRadius: '18px',
                  padding: '1.75rem',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)'
                }}>
                  <h4 style={{ 
                    color: '#111827', 
                    marginBottom: '1.375rem',
                    fontSize: '1.1875rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6875rem',
                    letterSpacing: '-0.025em'
                  }}>
                    📄 Supporting Documents
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.875rem' // Reduced from 1rem
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '10px', // Reduced from 12px
                          fontSize: '0.8125rem', // Reduced from 0.9rem
                          fontWeight: '700',
                          padding: '0.875rem 1.375rem', // Reduced from 1rem 1.5rem
                          border: '2px solid #e5e7eb',
                          color: '#374151',
                          background: '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #667eea';
                          e.currentTarget.style.color = '#667eea';
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(102, 126, 234, 0.2)';
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
                          fontSize: '0.8125rem',
                          fontWeight: '700',
                          padding: '0.875rem 1.375rem',
                          border: '2px solid #e5e7eb',
                          color: '#374151',
                          background: '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #667eea';
                          e.currentTarget.style.color = '#667eea';
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(102, 126, 234, 0.2)';
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
                          fontSize: '0.8125rem',
                          fontWeight: '700',
                          padding: '0.875rem 1.375rem',
                          border: '2px solid #e5e7eb',
                          color: '#374151',
                          background: '#ffffff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #667eea';
                          e.currentTarget.style.color = '#667eea';
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 15px rgba(102, 126, 234, 0.2)';
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
                borderRadius: '18px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)'
              }}>
                <h4 style={{ 
                  color: '#111827',
                  marginBottom: '1.5rem', // Reduced from 1.75rem
                  fontSize: '1.1875rem', // Reduced from 1.25rem
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6875rem', // Reduced from 0.75rem
                  letterSpacing: '-0.025em'
                }}>
                  ⚖️ Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label style={{ 
                        fontSize: '0.8125rem', // Reduced from 0.9rem
                        fontWeight: '700',
                        color: '#374151',
                        marginBottom: '0.6875rem', // Reduced from 0.75rem
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
                          borderRadius: '10px', // Reduced from 12px
                          border: '2px solid #e5e7eb',
                          padding: '0.875rem 1.125rem', // Reduced from 1rem 1.25rem
                          fontSize: '0.9375rem', // Reduced from 1rem
                          fontWeight: '600',
                          background: '#ffffff',
                          color: '#111827',
                          height: '50px', // Reduced from 56px
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
                        fontSize: '0.8125rem',
                        fontWeight: '700',
                        color: '#374151',
                        marginBottom: '0.6875rem',
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
                          padding: '0.875rem 1.125rem',
                          fontSize: '0.9375rem',
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
          padding: '1.375rem 1.75rem', // Reduced from 1.5rem 2rem
          background: 'rgba(255, 255, 255, 0.95)',
          gap: '0.875rem' // Reduced from 1rem
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '10px', // Reduced from 12px
              padding: '0.875rem 1.375rem', // Reduced from 1rem 1.5rem
              fontWeight: '700',
              fontSize: '0.8125rem', // Reduced from 0.9rem
              border: '2px solid #d1d5db',
              color: '#6b7280',
              background: '#ffffff',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel Review
          </Button>
          
          {/* Professional Approve Button */}
          <Button 
            variant={verifyStatus === 'verified' ? 'success' : 'danger'} 
            onClick={handleVerify} 
            disabled={submitting}
            style={{
              borderRadius: '10px',
              padding: '0.875rem 1.75rem', // Reduced from 1rem 2rem
              fontWeight: '700',
              fontSize: '0.8125rem',
              minWidth: '180px', // Reduced from 200px
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: '#ffffff',
              boxShadow: verifyStatus === 'verified' ? 
                '0 5px 18px rgba(16, 185, 129, 0.28)' : 
                '0 5px 18px rgba(239, 68, 68, 0.28)', // Reduced shadow
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.625rem', // Reduced from 0.75rem
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = verifyStatus === 'verified' ? 
                '0 8px 25px rgba(16, 185, 129, 0.35)' : 
                '0 8px 25px rgba(239, 68, 68, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = verifyStatus === 'verified' ? 
                '0 5px 18px rgba(16, 185, 129, 0.28)' : 
                '0 5px 18px rgba(239, 68, 68, 0.28)';
            }}
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1rem' }}>{verifyStatus === 'verified' ? '✅' : '❌'}</span> {/* Reduced from 1.125rem */}
                <span>{verifyStatus === 'verified' ? 'Approve Property' : 'Reject Property'}</span>
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
        <Modal.Header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          position: 'relative',
          padding: '0.875rem 1.375rem' // Reduced from 1rem 1.5rem
        }}>
          {/* Simple Cross Button */}
          <button
            type="button"
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '14px', // Reduced from 16px
              right: '18px', // Reduced from 20px
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '22px', // Reduced from 24px
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '300',
              lineHeight: '1',
              width: '26px', // Reduced from 28px
              height: '26px', // Reduced from 28px
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
          
          <Modal.Title style={{ 
            fontSize: '1.0625rem', // Reduced from 1.125rem
            fontWeight: '700',
            paddingRight: '45px' // Reduced from 50px
          }}>
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
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
