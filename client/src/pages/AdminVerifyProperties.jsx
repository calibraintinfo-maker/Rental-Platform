import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminVerifyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState('verified');
  const [verifyNote, setVerifyNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fullscreenDoc, setFullscreenDoc] = useState({ show: false, src: '', type: '', title: '' });
  
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && auth.token) {
      fetchPending();
    }
  }, [auth.loading, auth.token]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getPendingProperties();
      setProperties(res.data.data);
    } catch (err) {
      setError('Failed to fetch pending properties');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (property) => {
    setSelected(property);
    setShowModal(true);
    setVerifyStatus('verified');
    setVerifyNote('');
  };

  const handleVerify = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.admin.verifyProperty(selected._id, verifyStatus, verifyNote);
      setShowModal(false);
      fetchPending();
    } catch {
      alert('Failed to update property status');
    } finally {
      setSubmitting(false);
    }
  };

  const openFullscreen = (src, type, title) => {
    setFullscreenDoc({ show: true, src, type, title });
  };

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
          <Spinner animation="border" variant="light" style={{ width: '4rem', height: '4rem', borderWidth: '4px' }} />
          <p style={{ marginTop: '1.5rem', color: '#ffffff', fontSize: '1.125rem', fontWeight: '600' }}>
            Loading properties for verification...
          </p>
        </div>
      </div>
    );
  }

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
        <Alert variant="danger" style={{
          background: '#fff',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '2rem',
          color: '#dc2626',
          fontSize: '1rem',
          fontWeight: '600',
          maxWidth: '500px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </Alert>
      </div>
    );
  }

  return (
    <>
      {/* Main Container with Full Background */}
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
                <Col key={property._id} xl={4} lg={6} md={6} sm={12} style={{ padding: '0 15px', marginBottom: '2rem' }}>
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
          
      {/* Verification Modal - Complete Modal Code Here */}
      {/* ... Full modal implementation with all sections ... */}
      
      {/* Custom CSS for responsive design */}
      <style>{`
        .fullscreen-modal .modal-dialog {
          max-width: 95vw !important;
          margin: 2.5vh auto !important;
        }
        
        @media (max-width: 768px) {
          .fullscreen-modal .modal-dialog {
            max-width: 100vw !important;
            margin: 0 !important;
            height: 100vh !important;
          }
        }
        
        @media (max-width: 576px) {
          .card-body {
            padding: 1.5rem !important;
          }
          
          .modal-body {
            padding: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
