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
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
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
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }} 
          />
          <p style={{ 
            marginTop: '1.5rem', 
            color: '#ffffff', 
            fontSize: '1.125rem', 
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
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
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
              padding: '2.5rem',
              color: '#dc2626',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <strong>⚠️ System Error</strong><br/>{error}
          </Alert>
          <Button 
            variant="light" 
            onClick={fetchPending}
            style={{
              marginTop: '1.5rem',
              borderRadius: '16px',
              padding: '0.875rem 2rem',
              fontWeight: '700',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              border: 'none'
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
      {/* Main Container - Professional Dark Theme */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        paddingTop: '120px',
        paddingBottom: '4rem',
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
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.02) 2px, transparent 0)`,
          backgroundSize: '50px 50px',
          zIndex: 1
        }} />

        <Container style={{ position: 'relative', zIndex: 10, maxWidth: '1600px' }}>
          {/* Header Section - Corporate Style */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            padding: '3rem 2rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 50%, #f472b6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-1px',
              lineHeight: '1.1',
              marginBottom: '1rem'
            }}>
              Property Verification Center
            </h1>
            <p style={{
              fontSize: '1.375rem',
              color: '#cbd5e1',
              fontWeight: '500',
              margin: 0,
              opacity: 0.9
            }}>
              Enterprise-grade property management and verification system
            </p>
            <div style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              display: 'inline-block'
            }}>
              <span style={{
                color: '#60a5fa',
                fontSize: '1rem',
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
              padding: '5rem 3rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
              borderRadius: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              maxWidth: '700px',
              margin: '0 auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2.5rem',
                fontSize: '3rem',
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
              }}>
                ✅
              </div>
              <h2 style={{
                color: '#f1f5f9',
                fontSize: '2.5rem',
                marginBottom: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.5px'
              }}>
                All Properties Verified
              </h2>
              <p style={{
                color: '#94a3b8',
                fontSize: '1.25rem',
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
                  <Card style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(20px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  }}
                  >
                    {/* Property Image with Overlay */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '240px', 
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
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
                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)'
                        }} />
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1.5rem',
                          right: '1.5rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          padding: '0.5rem 1rem',
                          borderRadius: '25px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 8px 16px rgba(245, 158, 11, 0.4)',
                          border: '2px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          ⏳ PENDING
                        </div>
                      </div>
                    )}

                    <Card.Body style={{
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}>
                      <h3 style={{
                        fontSize: '1.375rem',
                        fontWeight: '800',
                        color: '#f1f5f9',
                        marginBottom: '1.5rem',
                        lineHeight: '1.3',
                        letterSpacing: '-0.25px'
                      }}>
                        {property.title}
                      </h3>

                      <div style={{ 
                        flexGrow: 1,
                        marginBottom: '2rem'
                      }}>
                        <div style={{ 
                          display: 'grid', 
                          gap: '0.875rem',
                          marginBottom: '1.5rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ 
                              minWidth: '90px', 
                              fontWeight: '700', 
                              color: '#60a5fa',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              👤 Owner:
                            </span>
                            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
                              {property.ownerId?.name || 'N/A'}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ 
                              minWidth: '90px', 
                              fontWeight: '700', 
                              color: '#60a5fa',
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
                              color: '#cbd5e1',
                              fontWeight: '500'
                            }}>
                              {property.ownerId?.email || 'N/A'}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ 
                              minWidth: '90px', 
                              fontWeight: '700', 
                              color: '#60a5fa',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              🏠 Type:
                            </span>
                            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
                              {property.category}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ 
                              minWidth: '90px', 
                              fontWeight: '700', 
                              color: '#60a5fa',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              💰 Price:
                            </span>
                            <span style={{ 
                              color: '#10b981', 
                              fontWeight: '800',
                              fontSize: '1.125rem'
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            padding: '0.5rem 0',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <span style={{ 
                              minWidth: '90px', 
                              fontWeight: '700', 
                              color: '#60a5fa',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              📍 Location:
                            </span>
                            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
                              {property.address ? 
                                `${property.address.city}, ${property.address.state}` : 
                                'N/A'
                              }
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            padding: '0.5rem 0'
                          }}>
                            <span style={{ 
                              minWidth: '90px', 
                              fontWeight: '700', 
                              color: '#60a5fa',
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px'
                            }}>
                              📅 Submitted:
                            </span>
                            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>
                              {new Date(property.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: 'none',
                          borderRadius: '16px',
                          padding: '1rem 2rem',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                          transition: 'all 0.3s ease',
                          width: '100%',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
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

      {/* PROFESSIONAL VERIFICATION MODAL */}
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
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
            color: 'white',
            border: 'none',
            borderRadius: '0',
            padding: '1.5rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800',
            letterSpacing: '-0.25px'
          }}>
            🏠 Property Verification Portal - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '75vh', 
          overflowY: 'auto', 
          padding: '2rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* Property Information Card */}
              <div style={{ 
                marginBottom: '2rem',
                background: '#ffffff',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
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
                  📋 Property Information
                </h4>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>👤 Property Owner</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}>{selected.ownerId?.name || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📧 Contact Email</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}>{selected.ownerId?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>🏠 Property Category</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}>{selected.category}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>💰 Listed Price</div>
                      <div style={{ 
                        color: '#10b981',
                        fontWeight: '800',
                        fontSize: '1.5rem'
                      }}>₹{selected.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📍 Property Location</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '1rem',
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
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>📅 Submission Date</div>
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}>
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                </Row>
                {selected.description && (
                  <div style={{ 
                    marginTop: '2rem', 
                    paddingTop: '2rem', 
                    borderTop: '2px solid #e2e8f0' 
                  }}>
                    <div style={{ 
                      fontWeight: '700',
                      color: '#3b82f6',
                      marginBottom: '1rem',
                      fontSize: '0.875rem',
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

              {/* Property Images Gallery */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '2rem',
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '3px solid #e2e8f0',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          aspectRatio: '4/3'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '3px solid #3b82f6';
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '3px solid #e2e8f0';
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
                          background: 'rgba(0, 0, 0, 0.8)',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          🔍 View
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '2rem',
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
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
                    gap: '1rem' 
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          padding: '0.75rem 1.5rem',
                          border: '2px solid #3b82f6',
                          color: '#3b82f6',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
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
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          padding: '0.75rem 1.5rem',
                          border: '2px solid #3b82f6',
                          color: '#3b82f6',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
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
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: '700',
                          padding: '0.75rem 1.5rem',
                          border: '2px solid #3b82f6',
                          color: '#3b82f6',
                          background: 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-2px)';
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

              {/* VERIFICATION DECISION - PROFESSIONAL LAYOUT */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{ 
                  color: '#f1f5f9', 
                  marginBottom: '2rem',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '-0.25px'
                }}>
                  ⚖️ Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '700',
                        color: '#60a5fa',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Verification Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          padding: '0.875rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#f1f5f9',
                          backdropFilter: 'blur(10px)',
                          height: '50px' // SAME HEIGHT AS TEXTAREA
                        }}
                      >
                        <option value="verified" style={{ background: '#1e293b', color: '#f1f5f9' }}>
                          ✅ Approve Property
                        </option>
                        <option value="rejected" style={{ background: '#1e293b', color: '#f1f5f9' }}>
                          ❌ Reject Property
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '700',
                        color: '#60a5fa',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Administrative Notes (Optional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Enter verification notes or decision rationale..."
                        style={{
                          borderRadius: '12px',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          padding: '0.875rem',
                          fontSize: '1rem',
                          resize: 'vertical',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#f1f5f9',
                          backdropFilter: 'blur(10px)',
                          height: '50px', // SAME HEIGHT AS DROPDOWN
                          minHeight: '50px'
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
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          gap: '1rem'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '12px',
              padding: '0.875rem 2rem',
              fontWeight: '700',
              fontSize: '0.875rem',
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
              padding: '0.875rem 2rem',
              fontWeight: '700',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              minWidth: '200px',
              background: verifyStatus === 'verified' ? 
                'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
            }}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
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
          background: '#1e293b',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title style={{ fontSize: '1.25rem', fontWeight: '700' }}>
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

      {/* Toast Notifications - Enhanced */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={5000} 
          autohide
          bg={toastType}
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
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
            fontSize: '1rem',
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
