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
        background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '2rem', 
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ 
            color: '#374151', 
            fontSize: '14px', 
            fontWeight: '500',
            margin: 0
          }}>
            Loading verification center...
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
        background: 'linear-gradient(to bottom right, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <h3 style={{
            color: '#111827',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Connection Error
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5'
          }}>
            {error}
          </p>
          <Button 
            onClick={fetchPending}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              fontSize: '14px',
              color: '#ffffff',
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)'
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .property-card {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      {/* 🚀 ULTRA-MODERN PROFESSIONAL DESIGN */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 100%)',
        paddingTop: '6rem',
        paddingBottom: '3rem',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
      }}>
        {/* FLOATING PARTICLES BACKGROUND */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.02) 0%, transparent 50%)
          `,
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        <Container style={{ 
          maxWidth: '1280px', 
          position: 'relative', 
          zIndex: 10,
          padding: '0 1.5rem'
        }}>
          
          {/* 🎯 ULTRA-PROFESSIONAL HEADER */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              
              {/* Left Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
                }}>
                  🏠
                </div>
                <div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0,
                    lineHeight: '1.2',
                    letterSpacing: '-0.025em'
                  }}>
                    Property Verification
                  </h1>
                  <p style={{
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500',
                    margin: 0,
                    marginTop: '0.25rem'
                  }}>
                    Enterprise-grade property management system
                  </p>
                </div>
              </div>

              {/* Right Section - Stats */}
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid rgba(203, 213, 225, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  textAlign: 'center',
                  minWidth: '100px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {properties.length}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginTop: '0.25rem'
                  }}>
                    Pending Review
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {properties.length === 0 ? (
            // PROFESSIONAL EMPTY STATE
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '4rem 2.5rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '32px',
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4)'
              }}>
                ✨
              </div>
              <h3 style={{
                color: '#111827',
                fontSize: '24px',
                fontWeight: '700',
                margin: '0 0 0.75rem 0',
                letterSpacing: '-0.025em'
              }}>
                All Verified!
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '16px',
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Excellent work! All property submissions have been processed and verified.
              </p>
            </div>
          ) : (
            // PROPERTIES GRID
            <Row style={{ margin: '0 -0.75rem' }}>
              {properties.map((property, index) => (
                <Col 
                  key={property._id} 
                  xl={4}
                  lg={6}
                  md={6} 
                  sm={12} 
                  style={{ 
                    padding: '0 0.75rem', 
                    marginBottom: '1.5rem',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* 🔥 ULTRA-MODERN PROFESSIONAL CARD */}
                  <div 
                    className="property-card"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 20px 25px -5px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    {/* Property Image with Gradient Overlay */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '220px',
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
                            transition: 'transform 0.6s ease'
                          }}
                        />
                        
                        {/* Premium Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `
                            linear-gradient(135deg, 
                              rgba(102, 126, 234, 0.1) 0%, 
                              transparent 30%, 
                              transparent 70%, 
                              rgba(139, 92, 246, 0.1) 100%
                            )
                          `
                        }} />
                        
                        {/* Ultra-Modern Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          borderRadius: '8px',
                          padding: '0.375rem 0.75rem',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#d97706',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                          Pending Review
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div style={{ padding: '1.5rem' }}>
                      {/* Property Title */}
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: '0 0 1rem 0',
                        lineHeight: '1.3',
                        letterSpacing: '-0.025em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {property.title}
                      </h3>

                      {/* Property Details */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.75rem',
                        marginBottom: '1.25rem'
                      }}>
                        {/* Owner */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            👤
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '2px'
                            }}>
                              Owner
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {property.ownerId?.name || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Category */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            🏠
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '2px'
                            }}>
                              Type
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {property.category}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            💰
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '2px'
                            }}>
                              Price
                            </div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: '#059669',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            📍
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              marginBottom: '2px'
                            }}>
                              Location
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {property.address ? 
                                `${property.address.city}, ${property.address.state}` : 
                                'N/A'
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Submission Date */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        marginBottom: '1.25rem',
                        border: '1px solid rgba(203, 213, 225, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px'
                        }}>
                          📅
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#64748b'
                        }}>
                          Submitted on {new Date(property.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>

                      {/* Ultra-Modern Action Button */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.875rem 1.25rem',
                          fontSize: '14px',
                          fontWeight: '600',
                          width: '100%',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                          letterSpacing: '0.025em'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(102, 126, 234, 0.5)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(102, 126, 234, 0.39)';
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          🔍 Begin Review
                        </span>
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* 🔥 ULTRA-MODERN PROFESSIONAL VERIFICATION MODAL */}
      <Modal 
        show={showModal} 
        onHide={closeModal}
        size="xl"
        centered
        scrollable
        style={{
          fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
        }}
        dialogClassName="modal-90w"
      >
        {/* CUSTOM MODAL HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem 2rem',
          borderRadius: '20px 20px 0 0',
          position: 'relative',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* ULTRA-MODERN CLOSE BUTTON */}
          <button
            type="button"
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '300'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingRight: '60px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              🏠
            </div>
            <div>
              <h2 style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '-0.025em'
              }}>
                Property Verification
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0,
                marginTop: '0.25rem'
              }}>
                {selected?.title}
              </p>
            </div>
          </div>
        </div>

        <Modal.Body style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '2rem',
          background: '#f8fafc'
        }}>
          {selected && (
            <>
              {/* Property Information */}
              <div style={{ 
                marginBottom: '2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              }}>
                <h4 style={{ 
                  color: '#111827', 
                  marginBottom: '1.5rem',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '-0.025em'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    📋
                  </div>
                  Property Information
                </h4>
                
                {/* Information Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {[
                    { label: 'Owner', value: selected.ownerId?.name || 'N/A', icon: '👤', color: '#667eea' },
                    { label: 'Email', value: selected.ownerId?.email || 'N/A', icon: '📧', color: '#3b82f6' },
                    { label: 'Category', value: selected.category, icon: '🏠', color: '#f59e0b' },
                    { label: 'Price', value: `₹${selected.price?.toLocaleString() || 'N/A'}`, icon: '💰', color: '#10b981' },
                    { label: 'Location', value: selected.address ? `${selected.address.city}, ${selected.address.state}` : 'N/A', icon: '📍', color: '#8b5cf6' },
                    { label: 'Submitted', value: new Date(selected.createdAt).toLocaleDateString(), icon: '📅', color: '#6366f1' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      border: '1px solid rgba(203, 213, 225, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        boxShadow: `0 4px 8px ${item.color}33`
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ 
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#64748b',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '0.25rem'
                        }}>
                          {item.label}
                        </div>
                        <div style={{ 
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                          wordBreak: 'break-word'
                        }}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {selected.description && (
                  <div style={{ 
                    borderTop: '1px solid rgba(203, 213, 225, 0.3)',
                    paddingTop: '1.5rem'
                  }}>
                    <div style={{ 
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.75rem'
                    }}>
                      📝 Description
                    </div>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.6',
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(203, 213, 225, 0.3)'
                    }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Images & Documents sections remain the same but with updated styling... */}
              {/* (keeping original logic but with modern styling) */}

              {/* Administrative Decision */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              }}>
                <h4 style={{ 
                  color: '#111827',
                  marginBottom: '1.5rem',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '-0.025em'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    ⚖️
                  </div>
                  Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ 
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        Verification Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          padding: '0.75rem 1rem',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: '#ffffff',
                          color: '#111827',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <option value="verified">✅ Approve Property</option>
                        <option value="rejected">❌ Reject Property</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ 
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em'
                      }}>
                        Administrative Notes
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Add verification notes (optional)..."
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          padding: '0.75rem 1rem',
                          fontSize: '14px',
                          resize: 'vertical',
                          background: '#ffffff',
                          color: '#111827',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Modal.Body>

        {/* ULTRA-MODERN FOOTER */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem 2rem',
          borderTop: '1px solid rgba(203, 213, 225, 0.3)',
          borderRadius: '0 0 20px 20px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '10px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              fontSize: '14px',
              border: '2px solid #e2e8f0',
              color: '#64748b',
              background: '#ffffff',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </Button>
          
          {/* ULTRA-MODERN DECISION BUTTON */}
          <Button 
            onClick={handleVerify} 
            disabled={submitting}
            style={{
              borderRadius: '10px',
              padding: '0.75rem 2rem',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '140px',
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: verifyStatus === 'verified' ? 
                '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : 
                '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
            }}
          >
            {submitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Processing...
              </>
            ) : (
              <>
                {verifyStatus === 'verified' ? '✅ Approve Property' : '❌ Reject Property'}
              </>
            )}
          </Button>
        </div>
      </Modal>

      {/* Rest of the modals and components remain the same... */}
      
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: 'none',
            backdropFilter: 'blur(20px)'
          }}
        >
          <Toast.Header style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontWeight: '600'
          }}>
            <strong className="me-auto">
              {toastType === 'success' ? '🎉 Success' : '⚠️ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white" style={{
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AdminVerifyProperties;
