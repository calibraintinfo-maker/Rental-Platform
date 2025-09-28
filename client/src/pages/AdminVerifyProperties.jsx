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
      <div className="premium-loading-container">
        <div className="loading-animation">
          <div className="loading-ring"></div>
          <div className="loading-ring"></div>
          <div className="loading-ring"></div>
        </div>
        <div className="loading-content">
          <h3>Loading Dashboard</h3>
          <p>Preparing your verification workspace...</p>
        </div>
        <style jsx>{`
          .premium-loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: white;
            gap: 2rem;
          }
          
          .loading-animation {
            position: relative;
            width: 80px;
            height: 80px;
          }
          
          .loading-ring {
            position: absolute;
            border: 3px solid transparent;
            border-top: 3px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .loading-ring:nth-child(1) {
            width: 80px;
            height: 80px;
          }
          
          .loading-ring:nth-child(2) {
            width: 60px;
            height: 60px;
            top: 10px;
            left: 10px;
            animation-delay: -0.2s;
            border-top-color: rgba(255, 255, 255, 0.6);
          }
          
          .loading-ring:nth-child(3) {
            width: 40px;
            height: 40px;
            top: 20px;
            left: 20px;
            animation-delay: -0.4s;
            border-top-color: rgba(255, 255, 255, 0.4);
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .loading-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            text-align: center;
          }
          
          .loading-content p {
            font-size: 1rem;
            margin: 0;
            opacity: 0.9;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="premium-error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <Button 
            onClick={fetchPending}
            className="retry-btn"
          >
            <span>🔄</span>
            Try Again
          </Button>
        </div>
        <style jsx>{`
          .premium-error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            padding: 2rem;
          }
          
          .error-content {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 3rem 2rem;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
          }
          
          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          
          .error-content h3 {
            color: #ef4444;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
          }
          
          .error-content p {
            color: #64748b;
            margin: 0 0 2rem 0;
            font-size: 1rem;
            line-height: 1.6;
          }
          
          .retry-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            padding: 0.75rem 2rem;
            color: white;
            font-weight: 600;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0 auto;
            transition: all 0.3s ease;
          }
          
          .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* 🔥 WORLD-CLASS HERO SECTION */}
      <div className="admin-verify-container">
        <section className="hero-section">
          {/* Background Effects */}
          <div className="hero-background">
            <div className="gradient-mesh"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
            <div className="grid-pattern"></div>
          </div>
          
          {/* Hero Content */}
          <Container className="hero-container">
            <div className="hero-content">
              {/* Main Branding */}
              <div className="brand-section">
                <div className="brand-logo-wrapper">
                  <div className="brand-logo">
                    <div className="logo-glow"></div>
                    <div className="logo-icon">🏠</div>
                  </div>
                </div>
                <div className="brand-identity">
                  <h1 className="brand-name">SpaceLink</h1>
                  <div className="brand-tagline">Admin Portal</div>
                </div>
              </div>

              {/* Title Section */}
              <div className="title-section">
                <h2 className="main-title">Property Verification Center</h2>
                <p className="main-subtitle">Advanced property management platform with streamlined verification workflows</p>
              </div>

              {/* Analytics Dashboard */}
              <div className="analytics-section">
                <div className="analytics-card">
                  <div className="analytics-visual">
                    <div className="chart-container">
                      <div className="chart-ring">
                        <div className="chart-fill" style={{transform: `rotate(${Math.min(properties.length * 36, 360)}deg)`}}></div>
                      </div>
                      <div className="chart-center">
                        <div className="chart-icon">📊</div>
                      </div>
                    </div>
                  </div>
                  <div className="analytics-info">
                    <div className="analytics-number">{properties.length}</div>
                    <div className="analytics-label">Properties Awaiting Review</div>
                    <div className="analytics-status">
                      <div className="status-dot"></div>
                      <span>System Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Indicators */}
              <div className="indicators-section">
                <div className="indicator">
                  <div className="indicator-icon">⚡</div>
                  <span>Real-time Processing</span>
                </div>
                <div className="indicator">
                  <div className="indicator-icon">🔒</div>
                  <span>Secure Verification</span>
                </div>
                <div className="indicator">
                  <div className="indicator-icon">📈</div>
                  <span>Analytics Ready</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 🔥 CONTENT SECTION */}
        <section className="content-section">
          <Container>
            {properties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-visual">
                  <div className="success-animation">
                    <div className="success-ring"></div>
                    <div className="success-icon">✅</div>
                  </div>
                </div>
                <div className="empty-content">
                  <h2>All Properties Verified</h2>
                  <p>Excellent work! Your verification queue is completely up to date. All property submissions have been processed and approved.</p>
                </div>
              </div>
            ) : (
              <div className="properties-wrapper">
                <div className="properties-header">
                  <h3>Property Verification Queue</h3>
                  <p>Review and approve pending property submissions</p>
                </div>
                
                <Row className="properties-grid">
                  {properties.map((property, index) => (
                    <Col 
                      key={property._id} 
                      xl={4}
                      lg={6}
                      md={6} 
                      sm={12} 
                      className="property-col"
                    >
                      <div className="property-card" style={{animationDelay: `${index * 0.1}s`}}>
                        {/* Property Image */}
                        {property.images && property.images.length > 0 && (
                          <div className="property-image">
                            <img 
                              src={property.images[0]} 
                              alt={property.title}
                              className="main-image"
                            />
                            <div className="image-overlay"></div>
                            <div className="status-badge">PENDING</div>
                            {property.images.length > 1 && (
                              <div className="image-count">+{property.images.length - 1}</div>
                            )}
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="card-content">
                          <h3 className="property-title">{property.title}</h3>

                          <div className="property-details">
                            <div className="detail-item">
                              <div className="detail-icon owner-icon">👤</div>
                              <div className="detail-content">
                                <div className="detail-label">OWNER</div>
                                <div className="detail-value">{property.ownerId?.name || 'N/A'}</div>
                              </div>
                            </div>

                            <div className="detail-item">
                              <div className="detail-icon category-icon">🏠</div>
                              <div className="detail-content">
                                <div className="detail-label">CATEGORY</div>
                                <div className="detail-value">{property.category}</div>
                              </div>
                            </div>

                            <div className="detail-item">
                              <div className="detail-icon price-icon">💰</div>
                              <div className="detail-content">
                                <div className="detail-label">PRICE</div>
                                <div className="detail-value price">₹{property.price?.toLocaleString() || 'N/A'}</div>
                              </div>
                            </div>

                            <div className="detail-item">
                              <div className="detail-icon location-icon">📍</div>
                              <div className="detail-content">
                                <div className="detail-label">LOCATION</div>
                                <div className="detail-value">
                                  {property.address ? 
                                    `${property.address.city}, ${property.address.state}` : 
                                    'N/A'
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="detail-item detail-item-full">
                              <div className="detail-icon date-icon">📅</div>
                              <div className="detail-content">
                                <div className="detail-label">SUBMITTED</div>
                                <div className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>

                          <Button 
                            onClick={() => openModal(property)}
                            className="review-button"
                          >
                            <span className="button-icon">🔍</span>
                            <span>Review Property</span>
                            <div className="button-glow"></div>
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Container>
        </section>
      </div>

      {/* 🔥 PROFESSIONAL MODAL */}
      <Modal 
        show={showModal} 
        onHide={closeModal}
        size="lg"
        centered
        scrollable
        className="verification-modal"
      >
        <Modal.Header className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">🏠</div>
            <div className="modal-title-section">
              <h2 className="modal-title">Property Verification</h2>
              <div className="modal-subtitle">
                Review: <strong>{selected?.title}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="modal-close-btn"
          >
            ✕
          </button>
        </Modal.Header>

        <Modal.Body className="modal-body">
          {selected && (
            <>
              {/* Property Information */}
              <div className="info-section">
                <h4 className="section-title">
                  <span className="section-icon">🏢</span>
                  Property Information
                </h4>
                
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-icon owner-info-icon">👤</div>
                    <div className="info-content">
                      <div className="info-label">OWNER</div>
                      <div className="info-value">{selected.ownerId?.name || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon email-info-icon">📧</div>
                    <div className="info-content">
                      <div className="info-label">EMAIL</div>
                      <div className="info-value">{selected.ownerId?.email || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon category-info-icon">🏠</div>
                    <div className="info-content">
                      <div className="info-label">CATEGORY</div>
                      <div className="category-badge">{selected.category?.toUpperCase()}</div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon price-info-icon">💰</div>
                    <div className="info-content">
                      <div className="info-label">PRICE</div>
                      <div className="info-value price">₹{selected.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon location-info-icon">📍</div>
                    <div className="info-content">
                      <div className="info-label">LOCATION</div>
                      <div className="info-value">
                        {selected.address ? 
                          `${selected.address.city}, ${selected.address.state}` : 
                          'N/A'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon date-info-icon">📅</div>
                    <div className="info-content">
                      <div className="info-label">DATE</div>
                      <div className="info-value">{new Date(selected.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {selected.description && (
                  <div className="description-section">
                    <div className="description-header">
                      <span className="description-icon">📝</span>
                      Description
                    </div>
                    <p className="description-content">{selected.description}</p>
                  </div>
                )}
              </div>

              {/* Images */}
              {selected.images && selected.images.length > 0 && (
                <div className="images-section">
                  <h4 className="section-title">
                    <span className="section-icon">🖼️</span>
                    Images ({selected.images.length})
                  </h4>
                  <div className="images-grid">
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Image ${index + 1}`)}
                        className="image-item"
                      >
                        <img src={image} alt={`Property ${index + 1}`} />
                        <div className="image-overlay">
                          <div className="view-button">🔍</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div className="documents-section">
                  <h4 className="section-title">
                    <span className="section-icon">📄</span>
                    Documents
                  </h4>
                  <div className="documents-grid">
                    {selected.ownerProof && (
                      <Button
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof')}
                        className="document-button"
                      >
                        🆔 Owner Proof
                      </Button>
                    )}
                    {selected.propertyProof && (
                      <Button
                        onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof')}
                        className="document-button"
                      >
                        📋 Property Docs
                      </Button>
                    )}
                    {selected.documents && selected.documents.map((doc, index) => (
                      <Button
                        key={index}
                        onClick={() => openFullscreen(doc, 'document', `Document ${index + 1}`)}
                        className="document-button"
                      >
                        📄 Doc {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision */}
              <div className="decision-section">
                <h4 className="section-title">
                  <span className="section-icon">⚖️</span>
                  Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="form-label">Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        className="status-select"
                      >
                        <option value="verified">✅ Approve Property</option>
                        <option value="rejected">❌ Reject Property</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="form-label">Notes (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Enter notes..."
                        className="notes-textarea"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <Button 
            variant="outline-secondary" 
            onClick={closeModal} 
            disabled={submitting}
            className="cancel-button"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleVerify} 
            disabled={submitting}
            className={`action-button ${verifyStatus === 'verified' ? 'approve' : 'reject'}`}
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" />
                Processing...
              </>
            ) : (
              <>
                <span className="action-icon">{verifyStatus === 'verified' ? '✅' : '❌'}</span>
                {verifyStatus === 'verified' ? 'Approve' : 'Reject'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Fullscreen Modal */}
      <Modal
        show={fullscreenDoc.show}
        onHide={closeFullscreen}
        size="xl"
        centered
        className="fullscreen-modal"
      >
        <Modal.Header className="fullscreen-header">
          <Modal.Title className="fullscreen-title">
            {fullscreenDoc.title}
          </Modal.Title>
          <button
            type="button"
            onClick={closeFullscreen}
            className="fullscreen-close"
          >
            ✕
          </button>
        </Modal.Header>
        <Modal.Body className="fullscreen-body">
          {fullscreenDoc.type === 'image' ? (
            <img
              src={fullscreenDoc.src}
              alt="Document"
              className="fullscreen-image"
            />
          ) : (
            <div className="fullscreen-document">
              <iframe
                src={fullscreenDoc.src}
                title="Document Preview"
                className="document-iframe"
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
          className="premium-toast"
        >
          <Toast.Header className="toast-header">
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="toast-body">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      
      {/* 🔥 WORLD-CLASS STYLES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        /* MAIN CONTAINER */
        .admin-verify-container {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* 🔥 WORLD-CLASS HERO SECTION */
        .hero-section {
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .gradient-mesh {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255,255,255,0.08) 0%, transparent 50%);
        }

        .floating-shapes {
          position: absolute;
          inset: 0;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 120px;
          height: 120px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 15%;
          animation-delay: -2s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          top: 30%;
          right: 30%;
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: slideGrid 20s linear infinite;
        }

        @keyframes slideGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        .hero-container {
          position: relative;
          z-index: 10;
          padding: 4rem 0;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .brand-logo-wrapper {
          position: relative;
        }

        .brand-logo {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .logo-glow {
          position: absolute;
          inset: -15px;
          background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          border-radius: 50%;
          filter: blur(20px);
          animation: rotate 4s linear infinite;
          z-index: -1;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .logo-icon {
          font-size: 36px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .brand-identity {
          text-align: left;
        }

        .brand-name {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin: 0;
          letter-spacing: -0.04em;
          line-height: 1;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tagline {
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 25px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 1rem;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: inline-block;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .title-section {
          max-width: 800px;
        }

        .main-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.98);
          margin: 0 0 1rem 0;
          letter-spacing: -0.03em;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
        }

        .main-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
        }

        .analytics-section {
          margin-top: 2rem;
        }

        .analytics-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 28px;
          padding: 2.5rem;
          display: flex;
          align-items: center;
          gap: 2.5rem;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          min-width: 400px;
        }

        .analytics-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
        }

        .analytics-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .analytics-visual {
          position: relative;
        }

        .chart-container {
          position: relative;
          width: 100px;
          height: 100px;
        }

        .chart-ring {
          position: absolute;
          inset: 0;
          border: 6px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .chart-fill {
          position: absolute;
          top: -6px;
          left: -6px;
          width: 100px;
          height: 100px;
          border: 6px solid transparent;
          border-top: 6px solid rgba(255, 255, 255, 0.9);
          border-right: 6px solid rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .chart-center {
          position: absolute;
          inset: 20px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(20px);
        }

        .chart-icon {
          font-size: 24px;
        }

        .analytics-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .analytics-number {
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          line-height: 1;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .analytics-label {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .analytics-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        .analytics-status span {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .indicators-section {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.25rem;
          border-radius: 20px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
        }

        .indicator:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .indicator-icon {
          font-size: 1rem;
        }

        .indicator span {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        /* CONTENT SECTION */
        .content-section {
          background: #ffffff;
          padding: 4rem 0;
          position: relative;
        }

        .content-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 6rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-visual {
          margin-bottom: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .success-animation {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-ring {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 3px solid #10b981;
          border-radius: 50%;
          opacity: 0.3;
          animation: expandRing 3s ease-in-out infinite;
        }

        @keyframes expandRing {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.1;
          }
        }

        .success-icon {
          font-size: 5rem;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 8px 24px rgba(16, 185, 129, 0.3));
        }

        .empty-content h2 {
          color: #0f172a;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .empty-content p {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
          margin: 0;
          line-height: 1.7;
        }

        /* PROPERTIES WRAPPER */
        .properties-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .properties-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .properties-header h3 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .properties-header p {
          font-size: 1.125rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        /* PROPERTIES GRID */
        .properties-grid {
          gap: 2rem;
        }

        .property-col {
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .property-card {
          background: #ffffff;
          border-radius: 20px;
          border: 2px solid #f1f5f9;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .property-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .property-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 28px 64px rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .property-card:hover::before {
          opacity: 1;
        }

        .property-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .property-card:hover .main-image {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
        }

        .status-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.95);
          color: #f59e0b;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.2);
          animation: statusBlink 2s ease-in-out infinite;
        }

        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .image-count {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        .card-content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .property-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2rem 0;
          letter-spacing: -0.02em;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .property-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
          flex: 1;
        }

        .detail-item {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px;
          padding: 1.25rem;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .detail-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .detail-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }

        .detail-item:hover::before {
          opacity: 1;
        }

        .detail-item-full {
          grid-column: 1 / -1;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .owner-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .category-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .price-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .location-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .date-icon {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        .detail-content {
          flex: 1;
          min-width: 0;
        }

        .detail-label {
          font-size: 0.6875rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .detail-value.price {
          font-size: 1.125rem;
          font-weight: 800;
          color: #10b981;
        }

        .review-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 16px;
          padding: 1.25rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          transition: all 0.5s ease;
          width: 100%;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .review-button:hover .button-glow {
          left: 100%;
        }

        .review-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(102, 126, 234, 0.4);
        }

        .button-icon {
          font-size: 1.125rem;
          position: relative;
          z-index: 2;
        }

        .review-button span {
          position: relative;
          z-index: 2;
        }

        /* MODAL STYLES */
        .verification-modal .modal-content {
          border: none;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 2rem 2.5rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-title-section {
          flex: 1;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .modal-subtitle {
          font-size: 1rem;
          font-weight: 500;
          margin-top: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .modal-body {
          background: #f8fafc;
          padding: 2.5rem;
          max-height: 70vh;
          overflow-y: auto;
        }

        /* INFO SECTIONS */
        .info-section {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          letter-spacing: -0.01em;
        }

        .section-icon {
          font-size: 1.125rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          padding: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px;
          padding: 1.25rem;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }

        .info-card:hover::before {
          opacity: 1;
        }

        .info-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .owner-info-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .email-info-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .category-info-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .price-info-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .location-info-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .date-info-icon {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        }

        .info-content {
          flex: 1;
          min-width: 0;
        }

        .info-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .info-value {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-value.price {
          font-size: 1.25rem;
          font-weight: 800;
          color: #10b981;
        }

        .category-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        /* DESCRIPTION SECTION */
        .description-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #e2e8f0;
        }

        .description-header {
          font-size: 0.875rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .description-icon {
          font-size: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          padding: 0.375rem;
        }

        .description-content {
          font-size: 1rem;
          color: #374151;
          line-height: 1.7;
          font-weight: 500;
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          margin: 0;
        }

        /* IMAGES SECTION */
        .images-section {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.25rem;
        }

        .image-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .image-item:hover {
          border-color: #667eea;
          transform: scale(1.05);
          box-shadow: 0 8px 28px rgba(102, 126, 234, 0.25);
        }

        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .image-item:hover img {
          transform: scale(1.1);
        }

        .image-item .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-item:hover .image-overlay {
          opacity: 1;
        }

        .view-button {
          background: rgba(255, 255, 255, 0.95);
          color: #0f172a;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        /* DOCUMENTS SECTION */
        .documents-section {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .documents-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .document-button {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          color: #374151;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .document-button:hover {
          border-color: #667eea;
          color: #667eea;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }

        /* DECISION SECTION */
        .decision-section {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          position: relative;
        }

        .decision-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px 20px 0 0;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 800;
          color: #374151;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-select,
        .notes-textarea {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          background: #ffffff;
          color: #0f172a;
          transition: all 0.3s ease;
          width: 100%;
        }

        .status-select:focus,
        .notes-textarea:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .status-select {
          height: 54px;
        }

        .notes-textarea {
          height: 54px;
          resize: none;
        }

        /* MODAL FOOTER */
        .modal-footer {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
          border-top: 2px solid #e2e8f0;
          padding: 2rem 2.5rem;
          gap: 1.25rem;
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .cancel-button {
          border-radius: 12px;
          padding: 1rem 2rem;
          font-weight: 700;
          font-size: 1rem;
          border: 2px solid #d1d5db;
          color: #6b7280;
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          border-color: #9ca3af;
          color: #374151;
          transform: translateY(-2px);
        }

        .action-button {
          border-radius: 12px;
          padding: 1rem 2.5rem;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 200px;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .action-button.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        }

        .action-button.approve:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(16, 185, 129, 0.4);
        }

        .action-button.reject {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
        }

        .action-button.reject:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(239, 68, 68, 0.4);
        }

        .action-icon {
          font-size: 1.125rem;
        }

        /* FULLSCREEN MODAL */
        .fullscreen-modal .modal-content {
          border-radius: 0;
        }

        .fullscreen-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1.25rem 2rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fullscreen-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-weight: 300;
        }

        .fullscreen-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .fullscreen-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .fullscreen-body {
          background: #000;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
        }

        .fullscreen-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .fullscreen-document {
          width: 100%;
          height: 80vh;
          background: #fff;
          padding: 1rem;
          margin: 1rem;
          border-radius: 8px;
        }

        .document-iframe {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 8px;
        }

        /* TOAST STYLES */
        .premium-toast {
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          min-width: 350px;
        }

        .toast-header {
          background: transparent;
          border: none;
          color: white;
          font-weight: 700;
          font-size: 1rem;
        }

        .toast-body {
          color: white !important;
          font-size: 1rem;
          font-weight: 600;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1200px) {
          .brand-section {
            flex-direction: column;
            text-align: center;
          }

          .brand-identity {
            text-align: center;
          }

          .brand-name {
            font-size: 2.5rem;
          }

          .analytics-card {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
            min-width: auto;
          }
        }

        @media (max-width: 992px) {
          .hero-container {
            padding: 3rem 0;
          }

          .hero-content {
            gap: 2.5rem;
          }

          .brand-name {
            font-size: 2rem;
          }

          .main-title {
            font-size: 1.875rem;
          }

          .main-subtitle {
            font-size: 1rem;
          }

          .analytics-number {
            font-size: 3rem;
          }

          .indicators-section {
            gap: 1rem;
          }

          .property-details {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 50vh;
          }

          .hero-container {
            padding: 2rem 0;
          }

          .hero-content {
            gap: 2rem;
          }

          .brand-section {
            gap: 1rem;
          }

          .brand-logo {
            width: 60px;
            height: 60px;
          }

          .logo-icon {
            font-size: 28px;
          }

          .brand-name {
            font-size: 1.75rem;
          }

          .main-title {
            font-size: 1.5rem;
          }

          .main-subtitle {
            font-size: 0.9375rem;
          }

          .analytics-card {
            padding: 2rem;
          }

          .analytics-number {
            font-size: 2.5rem;
          }

          .chart-container {
            width: 80px;
            height: 80px;
          }

          .modal-header {
            padding: 1.5rem;
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .modal-header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .modal-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1.125rem;
          }

          .documents-grid {
            flex-direction: column;
          }

          .document-button {
            width: 100%;
          }

          .images-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .hero-content {
            gap: 1.5rem;
          }

          .property-col {
            padding: 0 0.5rem;
          }

          .card-content {
            padding: 1.5rem;
          }

          .empty-state {
            padding: 4rem 1rem;
          }

          .success-icon {
            font-size: 4rem;
          }

          .empty-content h2 {
            font-size: 1.75rem;
          }

          .empty-content p {
            font-size: 1rem;
          }

          .indicators-section {
            flex-direction: column;
            align-items: center;
          }
        }

        /* SCROLLBAR STYLING */
        .modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
