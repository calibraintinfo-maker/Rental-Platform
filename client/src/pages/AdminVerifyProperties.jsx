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
        background: '#f8fafc',
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
        background: '#f8fafc',
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
              background: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '2rem',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <strong>⚠️ System Error</strong><br/>{error}
          </Alert>
          <Button 
            onClick={fetchPending}
            style={{
              marginTop: '1.5rem',
              background: '#7c3aed',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              fontSize: '0.875rem',
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
      {/* 🏢 INDUSTRY-STANDARD PROFESSIONAL LAYOUT */}
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        paddingTop: '90px', // Professional spacing from navbar
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <Container fluid style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* 🎯 PROFESSIONAL INDUSTRY-STANDARD HEADER */}
          <div style={{ 
            marginBottom: '32px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px 32px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            {/* Header Content */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              
              {/* Left Section - Title & Description */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    🏠
                  </div>
                  <div>
                    <h1 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#111827',
                      margin: 0,
                      lineHeight: '1.25'
                    }}>
                      Property Verification
                    </h1>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Review and verify property submissions
                </p>
              </div>

              {/* Right Section - Stats */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  textAlign: 'center',
                  minWidth: '100px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#7c3aed'
                  }}>
                    {properties.length}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pending
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {properties.length === 0 ? (
            // Empty State
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '48px 32px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#f0fdf4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px'
              }}>
                ✅
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 8px 0'
              }}>
                All caught up!
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                No properties require verification at this time.
              </p>
            </div>
          ) : (
            // Properties Grid
            <Row style={{ margin: '0 -12px' }}>
              {properties.map(property => (
                <Col 
                  key={property._id} 
                  xl={4}
                  lg={6}
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 12px', marginBottom: '24px' }}
                >
                  {/* 🏢 INDUSTRY-STANDARD PROFESSIONAL PROPERTY CARD */}
                  <Card style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease-in-out',
                    overflow: 'hidden',
                    height: 'auto',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  >
                    {/* Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '200px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#f8fafc'
                      }}>
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                        />
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#ffffff',
                          border: '1px solid #fbbf24',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#d97706',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Pending Review
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div style={{ padding: '20px' }}>
                      {/* Property Title */}
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0 0 16px 0',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {property.title}
                      </h3>

                      {/* Property Details Grid */}
                      <div style={{ marginBottom: '20px' }}>
                        {/* Owner */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            background: '#f3f4f6',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                          }}>
                            👤
                          </div>
                          <span style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '500'
                          }}>
                            {property.ownerId?.name || 'N/A'}
                          </span>
                        </div>

                        {/* Type & Price */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '20px',
                              height: '20px',
                              background: '#f3f4f6',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px'
                            }}>
                              🏠
                            </div>
                            <span style={{
                              fontSize: '13px',
                              color: '#6b7280',
                              fontWeight: '500'
                            }}>
                              {property.category}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#059669'
                          }}>
                            ₹{property.price?.toLocaleString() || 'N/A'}
                          </div>
                        </div>

                        {/* Location */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            background: '#f3f4f6',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                          }}>
                            📍
                          </div>
                          <span style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            fontWeight: '500',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {property.address ? 
                              `${property.address.city}, ${property.address.state}` : 
                              'N/A'
                            }
                          </span>
                        </div>

                        {/* Date */}
                        <div style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          Submitted {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: '#7c3aed',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          width: '100%',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#6d28d9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#7c3aed';
                        }}
                      >
                        Review Property
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* 🔥 PROFESSIONAL VERIFICATION MODAL */}
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
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            padding: '20px 24px',
            position: 'relative'
          }}
        >
          {/* PROFESSIONAL WHITE CLOSE BUTTON */}
          <button
            type="button"
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ×
          </button>

          <Modal.Title style={{ 
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
            paddingRight: '50px'
          }}>
            🏠 Property Verification - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '24px',
          background: '#f8fafc'
        }}>
          {selected && (
            <>
              {/* Property Information */}
              <div style={{ 
                marginBottom: '24px',
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#111827', 
                  marginBottom: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📋 Property Information
                </h4>
                
                {/* Information Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  {/* Owner */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Owner
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {selected.ownerId?.name || 'N/A'}
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Email
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#3b82f6'
                    }}>
                      {selected.ownerId?.email || 'N/A'}
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Category
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {selected.category}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Price
                    </div>
                    <div style={{ 
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#059669'
                    }}>
                      ₹{selected.price?.toLocaleString() || 'N/A'}
                    </div>
                  </div>

                  {/* Location */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Location
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {selected.address ? 
                        `${selected.address.city}, ${selected.address.state}` : 
                        'N/A'
                      }
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}>
                      Submission Date
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {new Date(selected.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                {selected.description && (
                  <div style={{ 
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '16px'
                  }}>
                    <div style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px'
                    }}>
                      Description
                    </div>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#374151',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Property Images */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '24px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ 
                    color: '#111827', 
                    marginBottom: '16px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    🖼️ Property Images ({selected.images.length})
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          aspectRatio: '4/3'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '24px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ 
                    color: '#111827', 
                    marginBottom: '16px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    📄 Supporting Documents
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '12px'
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '8px 16px',
                          border: '1px solid #d1d5db',
                          color: '#374151',
                          background: '#ffffff'
                        }}
                      >
                        📄 Owner Verification
                      </Button>
                    )}
                    {selected.propertyProof && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof Document')}
                        style={{
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '8px 16px',
                          border: '1px solid #d1d5db',
                          color: '#374151',
                          background: '#ffffff'
                        }}
                      >
                        📄 Property Documents
                      </Button>
                    )}
                    {selected.documents && selected.documents.map((doc, index) => (
                      <Button
                        key={index}
                        variant="outline-secondary"
                        onClick={() => openFullscreen(doc, 'document', `Additional Document ${index + 1}`)}
                        style={{
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '8px 16px',
                          border: '1px solid #d1d5db',
                          color: '#374151',
                          background: '#ffffff'
                        }}
                      >
                        📄 Document {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔥 PROFESSIONAL ADMINISTRATIVE DECISION */}
              <div style={{
                background: '#ffffff',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#111827',
                  marginBottom: '20px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  ⚖️ Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ 
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Verification Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          padding: '10px 12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: '#ffffff',
                          color: '#111827'
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
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Administrative Notes (Optional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Enter verification notes..."
                        style={{
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          padding: '10px 12px',
                          fontSize: '14px',
                          resize: 'vertical',
                          background: '#ffffff',
                          color: '#111827'
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
          padding: '20px 24px',
          background: '#ffffff',
          gap: '12px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              color: '#374151',
              background: '#ffffff'
            }}
          >
            Cancel
          </Button>
          
          {/* 🚀 PROFESSIONAL APPROVAL BUTTON */}
          <Button 
            onClick={handleVerify} 
            disabled={submitting}
            style={{
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: '600',
              fontSize: '14px',
              minWidth: '140px',
              background: verifyStatus === 'verified' ? '#059669' : '#dc2626',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" />
                Processing...
              </>
            ) : (
              <>
                {verifyStatus === 'verified' ? '✅ Approve' : '❌ Reject'}
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
          background: '#7c3aed',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title style={{ fontSize: '16px', fontWeight: '600' }}>
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
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Toast.Header style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontWeight: '600'
          }}>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Success' : '❌ Error'}
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
