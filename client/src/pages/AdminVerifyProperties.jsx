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
      await fetchPending(); // Refresh the list
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spinner 
            animation="border" 
            variant="light" 
            style={{ 
              width: '4rem', 
              height: '4rem', 
              borderWidth: '4px' 
            }} 
          />
          <p style={{ 
            marginTop: '1.5rem', 
            color: '#ffffff', 
            fontSize: '1.125rem', 
            fontWeight: '600' 
          }}>
            Loading properties for verification...
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <Alert 
            variant="danger" 
            style={{
              background: '#fff',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '2rem',
              color: '#dc2626',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <strong>⚠️ Error:</strong> {error}
          </Alert>
          <Button 
            variant="light" 
            onClick={fetchPending}
            style={{
              marginTop: '1rem',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600'
            }}
          >
            🔄 Retry
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '120px',
        paddingBottom: '4rem',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          zIndex: 1
        }} />

        <Container style={{ position: 'relative', zIndex: 10, maxWidth: '1400px' }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.5px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              marginBottom: '0.5rem'
            }}>
              🏛️ Property Verification Center
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
              margin: 0
            }}>
              Review and verify property submissions with complete documentation
            </p>
          </div>

          {/* Content Area */}
          {properties.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '600px',
              margin: '0 auto',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '2rem'
              }}>
                🎉
              </div>
              <h4 style={{
                color: '#1e293b',
                fontSize: '2rem',
                marginBottom: '1rem',
                fontWeight: '800'
              }}>
                All Caught Up!
              </h4>
              <p style={{
                color: '#64748b',
                fontSize: '1.125rem',
                fontWeight: '500',
                margin: 0,
                lineHeight: '1.6'
              }}>
                No properties are currently pending verification. Great job keeping everything up to date!
              </p>
            </div>
          ) : (
            <Row style={{ margin: '0 -15px' }}>
              {properties.map(property => (
                <Col 
                  key={property._id} 
                  xl={4} 
                  lg={6} 
                  md={6} 
                  sm={12} 
                  style={{ padding: '0 15px', marginBottom: '2rem' }}
                >
                  <Card style={{
                    background: '#ffffff',
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                  }}
                  >
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#ffffff',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      zIndex: 5,
                      boxShadow: '0 4px 6px -1px rgba(251, 191, 36, 0.4)'
                    }}>
                      ⏳ PENDING
                    </div>
                    
                    <Card.Body style={{
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      gap: '1rem'
                    }}>
                      {/* Property Title */}
                      <div style={{ marginBottom: '0.5rem' }}>
                        <h5 style={{
                          fontSize: '1.375rem',
                          fontWeight: '700',
                          color: '#1e293b',
                          marginBottom: '0',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '3.5rem'
                        }}>
                          {property.title}
                        </h5>
                      </div>
                      
                      {/* Property Details Grid */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* Owner Info */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ 
                            color: '#64748b', 
                            fontSize: '0.875rem', 
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            👤 Owner
                          </span>
                          <span style={{ 
                            color: '#1e293b', 
                            fontSize: '0.875rem', 
                            fontWeight: '600',
                            textAlign: 'right'
                          }}>
                            {property.ownerId?.name || 'N/A'}
                          </span>
                        </div>

                        {/* Email */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ 
                            color: '#64748b', 
                            fontSize: '0.875rem', 
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            ✉️ Email
                          </span>
                          <span style={{ 
                            color: '#667eea', 
                            fontSize: '0.875rem', 
                            fontWeight: '600',
                            textAlign: 'right',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {property.ownerId?.email || 'N/A'}
                          </span>
                        </div>

                        {/* Category */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ 
                            color: '#64748b', 
                            fontSize: '0.875rem', 
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            🏷️ Category
                          </span>
                          <span style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#ffffff',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            {property.category}
                          </span>
                        </div>

                        {/* Price */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ 
                            color: '#64748b', 
                            fontSize: '0.875rem', 
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            💰 Price
                          </span>
                          <span style={{ 
                            color: '#059669', 
                            fontSize: '1rem', 
                            fontWeight: '800'
                          }}>
                            ₹{property.price?.toLocaleString() || 'N/A'}
                          </span>
                        </div>

                        {/* Location */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ 
                            color: '#64748b', 
                            fontSize: '0.875rem', 
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            📍 Location
                          </span>
                          <span style={{ 
                            color: '#1e293b', 
                            fontSize: '0.875rem', 
                            fontWeight: '600',
                            textAlign: 'right',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {property.address?.city}, {property.address?.state}
                          </span>
                        </div>

                        {/* Submitted Date */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ 
                            color: '#64748b', 
                            fontSize: '0.875rem', 
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            📅 Submitted
                          </span>
                          <span style={{ 
                            color: '#1e293b', 
                            fontSize: '0.875rem', 
                            fontWeight: '600'
                          }}>
                            {new Date(property.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div style={{ marginTop: '1rem' }}>
                        <Button 
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '1rem 1.5rem',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            textTransform: 'none',
                            letterSpacing: '0.025em',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            color: '#ffffff',
                            boxShadow: '0 8px 16px -4px rgba(102, 126, 234, 0.4)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 12px 20px -4px rgba(102, 126, 234, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 16px -4px rgba(102, 126, 234, 0.4)';
                          }}
                          onClick={() => openModal(property)}
                        >
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}>
                            🔍 Review & Verify Property
                          </span>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* Verification Modal */}
      <Modal 
        show={showModal} 
        onHide={closeModal}
        size="xl"
        centered
        className="property-verification-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '24px 24px 0 0',
          padding: '1.5rem 2rem'
        }}>
          <Modal.Title style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            🏠 Property Verification - {selected?.title}
          </Modal.Title>
          <Button
            variant="link"
            onClick={closeModal}
            style={{
              color: 'white',
              fontSize: '1.5rem',
              textDecoration: 'none',
              padding: '0',
              background: 'none',
              border: 'none'
            }}
          >
            ✕
          </Button>
        </Modal.Header>

        <Modal.Body style={{
          padding: '2rem',
          background: '#f8fafc'
        }}>
          {selected && (
            <div>
              {/* Property Information Section */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h5 style={{
                  color: '#1e293b',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📋 Property Information
                </h5>
                
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#374151' }}>Title:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{selected.title}</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#374151' }}>Category:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{selected.category}</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#374151' }}>Price:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#059669', fontWeight: '600' }}>
                        ₹{selected.price?.toLocaleString()}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#374151' }}>Owner:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{selected.ownerId?.name}</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#374151' }}>Email:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{selected.ownerId?.email}</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#374151' }}>Location:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>
                        {selected.address?.city}, {selected.address?.state}
                      </p>
                    </div>
                  </Col>
                </Row>
                
                {selected.description && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#374151' }}>Description:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', lineHeight: '1.6' }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Images Section */}
              {selected.images && selected.images.length > 0 && (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 style={{
                    color: '#1e293b',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🖼️ Property Images
                  </h5>
                  <Row>
                    {selected.images.map((image, index) => (
                      <Col md={4} sm={6} key={index} style={{ marginBottom: '1rem' }}>
                        <div 
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                          }}
                          onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Documents Section */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <h5 style={{
                    color: '#1e293b',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📄 Documents
                  </h5>
                  <Row>
                    {/* Owner Proof */}
                    {selected.ownerProof && (
                      <Col md={6} style={{ marginBottom: '1rem' }}>
                        <div 
                          style={{
                            padding: '1rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: '#f9fafb'
                          }}
                          onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof')}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.background = '#f0f4ff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.background = '#f9fafb';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.2rem'
                            }}>
                              📄
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>
                                Owner Proof
                              </p>
                              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                Click to view
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}

                    {/* Property Proof */}
                    {selected.propertyProof && (
                      <Col md={6} style={{ marginBottom: '1rem' }}>
                        <div 
                          style={{
                            padding: '1rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: '#f9fafb'
                          }}
                          onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof')}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.background = '#f0f4ff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.background = '#f9fafb';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.2rem'
                            }}>
                              📄
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>
                                Property Proof
                              </p>
                              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                Click to view
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )}

                    {/* Additional Documents */}
                    {selected.documents && selected.documents.map((doc, index) => (
                      <Col md={6} key={index} style={{ marginBottom: '1rem' }}>
                        <div 
                          style={{
                            padding: '1rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: '#f9fafb'
                          }}
                          onClick={() => openFullscreen(doc, 'document', `Document ${index + 1}`)}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = '#667eea';
                            e.target.style.background = '#f0f4ff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.background = '#f9fafb';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.2rem'
                            }}>
                              📄
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>
                                Document {index + 1}
                              </p>
                              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                Click to view
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Verification Decision Section */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <h5 style={{
                  color: '#1e293b',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  ⚖️ Verification Decision
                </h5>
                
                <Row>
                  <Col md={6}>
                    <Form.Group style={{ marginBottom: '1rem' }}>
                      <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                        Verification Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '0.75rem',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="verified">✅ Approve Property</option>
                        <option value="rejected">❌ Reject Property</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151' }}>
                        Admin Notes (Optional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Add any notes about this verification decision..."
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          padding: '0.75rem',
                          fontSize: '1rem',
                          resize: 'none'
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer style={{
          background: '#f8fafc',
          border: 'none',
          borderRadius: '0 0 24px 24px',
          padding: '1.5rem 2rem'
        }}>
          <Button
            variant="outline-secondary"
            onClick={closeModal}
            disabled={submitting}
            style={{
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              border: '2px solid #e5e7eb'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant={verifyStatus === 'verified' ? 'success' : 'danger'} 
            onClick={handleVerify} 
            disabled={submitting}
            style={{
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" />
                {verifyStatus === 'verified' ? 'Approving...' : 'Rejecting...'}
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
        size={fullscreenDoc.type === 'image' ? undefined : 'xl'}
        centered
        contentClassName={fullscreenDoc.type === 'image' ? 'bg-dark p-0 border-0' : ''}
        dialogClassName={fullscreenDoc.type === 'image' ? 'modal-fullscreen' : ''}
        backdropClassName={fullscreenDoc.type === 'image' ? 'bg-dark' : ''}
      >
        {fullscreenDoc.type === 'image' ? (
          <>
            <Button
              variant="light"
              onClick={closeFullscreen}
              style={{
                position: 'absolute',
                top: 24,
                right: 36,
                zIndex: 1051,
                fontSize: 32,
                fontWeight: 700,
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: '0 16px',
                lineHeight: '40px',
                background: '#fff',
                border: 'none',
                opacity: 0.95
              }}
              aria-label="Close"
            >
              &times;
            </Button>
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'rgba(0,0,0,0.98)' 
            }}>
              <img
                src={fullscreenDoc.src}
                alt="Document Preview"
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '90vh', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 32px rgba(0,0,0,0.4)' 
                }}
              />
            </div>
          </>
        ) : (
          <>
            <Modal.Header closeButton style={{ borderBottom: '1px solid #e5e7eb' }}>
              <Modal.Title>{fullscreenDoc.title} - Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ 
              minHeight: '80vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#f8f9fa' 
            }}>
              {fullscreenDoc.type === 'document' ? (
                fullscreenDoc.src.startsWith('data:application/pdf') ? (
                  <iframe
                    src={fullscreenDoc.src}
                    title="PDF Preview"
                    style={{ 
                      width: '100%', 
                      height: '75vh', 
                      border: '1px solid #ccc', 
                      borderRadius: '8px', 
                      background: '#fff' 
                    }}
                  />
                ) : (
                  <img
                    src={fullscreenDoc.src}
                    alt="Document Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '75vh', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                    }}
                  />
                )
              ) : null}
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default AdminVerifyProperties;
