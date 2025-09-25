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
              width: '3rem', 
              height: '3rem', 
              borderWidth: '3px' 
            }} 
          />
          <p style={{ 
            marginTop: '1rem', 
            color: '#ffffff', 
            fontSize: '1rem', 
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
        paddingTop: '100px',
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
              fontSize: '2.5rem',
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
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  >
                    {/* Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div style={{ 
                        height: '200px', 
                        overflow: 'hidden',
                        position: 'relative'
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
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(255, 193, 7, 0.95)',
                          color: '#856404',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          backdropFilter: 'blur(10px)'
                        }}>
                          ⏳ Pending
                        </div>
                      </div>
                    )}

                    <Card.Body style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1
                    }}>
                      <h5 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '1rem',
                        lineHeight: '1.4'
                      }}>
                        {property.title}
                      </h5>

                      <div style={{ 
                        flexGrow: 1,
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{ 
                          display: 'grid', 
                          gap: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            color: '#64748b'
                          }}>
                            <span style={{ minWidth: '80px', fontWeight: '600', color: '#374151' }}>👤 Owner:</span>
                            <span>{property.ownerId?.name || 'N/A'}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            color: '#64748b'
                          }}>
                            <span style={{ minWidth: '80px', fontWeight: '600', color: '#374151' }}>📧 Email:</span>
                            <span style={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {property.ownerId?.email || 'N/A'}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            color: '#64748b'
                          }}>
                            <span style={{ minWidth: '80px', fontWeight: '600', color: '#374151' }}>🏠 Type:</span>
                            <span>{property.category}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            color: '#64748b'
                          }}>
                            <span style={{ minWidth: '80px', fontWeight: '600', color: '#374151' }}>💰 Price:</span>
                            <span style={{ 
                              color: '#059669', 
                              fontWeight: '700',
                              fontSize: '1rem'
                            }}>
                              ₹{property.price?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                            color: '#64748b'
                          }}>
                            <span style={{ minWidth: '80px', fontWeight: '600', color: '#374151' }}>📍 Location:</span>
                            <span>
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
                            color: '#64748b'
                          }}>
                            <span style={{ minWidth: '80px', fontWeight: '600', color: '#374151' }}>📅 Submitted:</span>
                            <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="primary"
                        onClick={() => openModal(property)}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        📋 Review Property
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>

      {/* Compact Verification Modal */}
      <Modal 
        show={showModal} 
        onHide={closeModal}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header 
          closeButton 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            border: 'none',
            borderRadius: '0'
          }}
        >
          <Modal.Title style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            🏠 Property Verification - {selected?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto', 
          padding: '1.5rem',
          background: '#f8fafc'
        }}>
          {selected && (
            <>
              {/* Compact Property Info */}
              <div style={{ 
                marginBottom: '1.5rem',
                background: '#ffffff',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #e5e7eb'
              }}>
                <h6 style={{ 
                  color: '#374151', 
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📋 Property Information
                </h6>
                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <small style={{ 
                        display: 'block',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>👤 Owner:</small>
                      <small style={{ color: '#6b7280' }}>{selected.ownerId?.name || 'N/A'}</small>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <small style={{ 
                        display: 'block',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>📧 Email:</small>
                      <small style={{ color: '#6b7280' }}>{selected.ownerId?.email || 'N/A'}</small>
                    </div>
                    <div>
                      <small style={{ 
                        display: 'block',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>🏠 Category:</small>
                      <small style={{ color: '#6b7280' }}>{selected.category}</small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <small style={{ 
                        display: 'block',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>💰 Price:</small>
                      <small style={{ 
                        color: '#059669',
                        fontWeight: '700'
                      }}>₹{selected.price?.toLocaleString() || 'N/A'}</small>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <small style={{ 
                        display: 'block',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>📍 Location:</small>
                      <small style={{ color: '#6b7280' }}>
                        {selected.address ? 
                          `${selected.address.city}, ${selected.address.state}` : 
                          'N/A'
                        }
                      </small>
                    </div>
                    <div>
                      <small style={{ 
                        display: 'block',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}>📅 Submitted:</small>
                      <small style={{ color: '#6b7280' }}>
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </Col>
                </Row>
                {selected.description && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <small style={{ 
                      display: 'block',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>📝 Description:</small>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Images - Compact Grid */}
              {selected.images && selected.images.length > 0 && (
                <div style={{ 
                  marginBottom: '1.5rem',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <h6 style={{ 
                    color: '#374151', 
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🖼️ Property Images ({selected.images.length})
                  </h6>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '0.75rem' 
                  }}>
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid #e5e7eb',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.border = '2px solid #667eea';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.border = '2px solid #e5e7eb';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <img 
                          src={image} 
                          alt={`Property ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100px', 
                            objectFit: 'cover' 
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.75rem'
                        }}>
                          🔍
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents - Compact List */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div style={{ 
                  marginBottom: '1.5rem',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <h6 style={{ 
                    color: '#374151', 
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📄 Supporting Documents
                  </h6>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem' 
                  }}>
                    {selected.ownerProof && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        style={{
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        📄 Owner Proof
                      </Button>
                    )}
                    {selected.propertyProof && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof Document')}
                        style={{
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        📄 Property Proof
                      </Button>
                    )}
                    {selected.documents && selected.documents.map((doc, index) => (
                      <Button
                        key={index}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openFullscreen(doc, 'document', `Additional Document ${index + 1}`)}
                        style={{
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        📄 Document {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Decision */}
              <div style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb'
              }}>
                <h6 style={{ 
                  color: '#374151', 
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  ⚖️ Verification Decision
                </h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Decision Status
                      </Form.Label>
                      <Form.Control
                        as="select"
                        size="sm"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '1.5px solid #d1d5db',
                          padding: '0.5rem'
                        }}
                      >
                        <option value="verified">✅ Approve Property</option>
                        <option value="rejected">❌ Reject Property</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Admin Notes (Optional)
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        size="sm"
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Add verification notes or reasons for decision..."
                        style={{
                          borderRadius: '8px',
                          border: '1.5px solid #d1d5db',
                          padding: '0.5rem',
                          resize: 'vertical'
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
          borderTop: '1px solid #e5e7eb', 
          padding: '1rem 1.5rem',
          background: '#f8fafc'
        }}>
          <Button 
            variant="secondary" 
            onClick={closeModal} 
            disabled={submitting} 
            size="sm"
            style={{
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: '600'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant={verifyStatus === 'verified' ? 'success' : 'danger'} 
            onClick={handleVerify} 
            disabled={submitting}
            size="sm"
            style={{
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: '600',
              minWidth: '120px'
            }}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
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
        size="xl"
        centered
      >
        <Modal.Header closeButton style={{
          background: '#1e293b',
          color: 'white',
          border: 'none'
        }}>
          <Modal.Title style={{ fontSize: '1.125rem' }}>
            {fullscreenDoc.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          padding: 0, 
          textAlign: 'center',
          background: '#000',
          minHeight: '60vh',
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
          delay={4000} 
          autohide
          bg={toastType}
          style={{
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Toast.Header style={{
            background: 'transparent',
            border: 'none',
            color: 'white'
          }}>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white" style={{
            fontSize: '0.925rem',
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
