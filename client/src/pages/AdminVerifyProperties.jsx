import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AdminVerifyProperties = ({ show, onHide, selected, onUpdate }) => {
  const [verifyStatus, setVerifyStatus] = useState('verified');
  const [verifyNote, setVerifyNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Fullscreen document state
  const [fullscreenDoc, setFullscreenDoc] = useState({ 
    show: false, 
    src: '', 
    title: '',
    type: 'image' 
  });

  useEffect(() => {
    if (selected) {
      setVerifyStatus(selected.status || 'verified');
      setVerifyNote(selected.verifyNote || '');
    }
  }, [selected]);

  const closeModal = () => {
    setVerifyStatus('verified');
    setVerifyNote('');
    setSubmitting(false);
    onHide();
  };

  const closeFullscreen = () => {
    setFullscreenDoc({ show: false, src: '', title: '', type: 'image' });
  };

  const openFullscreen = (src, type, title) => {
    setFullscreenDoc({ show: true, src, type, title });
  };

  const handleVerify = async () => {
    if (!selected) return;

    setSubmitting(true);
    try {
      const payload = {
        status: verifyStatus,
        verifyNote: verifyNote
      };

      const response = await axios.put(
        `http://localhost:5001/api/properties/verify/${selected._id}`, 
        payload
      );

      if (response.status === 200) {
        setToastMessage(
          `Property has been ${verifyStatus === 'verified' ? 'approved' : 'rejected'} successfully!`
        );
        setToastType('success');
        setShowToast(true);

        // Update the parent component
        onUpdate && onUpdate(selected._id, verifyStatus, verifyNote);
        
        // Close modal after a short delay
        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating property:', error);
      setToastMessage(
        'An error occurred while updating the property. Please try again.'
      );
      setToastType('danger');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!selected) return null;

  return (
    <>
      {/* Main Modal */}
      <Modal
        show={show}
        onHide={closeModal}
        size="xl"
        centered
        backdrop={submitting ? 'static' : true}
        keyboard={!submitting}
        style={{
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <Modal.Header 
          closeButton={!submitting}
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: 'white',
            border: 'none',
            padding: '1.5rem'
          }}
        >
          <Modal.Title style={{ 
            fontSize: '1.25rem', 
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            🏠 Property Verification Review
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ 
          padding: '2rem', 
          maxHeight: '70vh', 
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          {selected && (
            <>
              {/* Property Details Grid */}
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
                  📋 Property Information
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}>
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

                  {/* Location Card */}
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
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
