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
        <div className="premium-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Loading verification dashboard...</p>
        <style jsx>{`
          .premium-loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #ffffff;
            gap: 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .premium-spinner {
            position: relative;
            width: 48px;
            height: 48px;
          }
          .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid transparent;
            border-top: 2px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          .spinner-ring:nth-child(2) {
            width: 36px;
            height: 36px;
            top: 6px;
            left: 6px;
            border-top-color: #8b5cf6;
            animation-delay: -0.2s;
          }
          .spinner-ring:nth-child(3) {
            width: 24px;
            height: 24px;
            top: 12px;
            left: 12px;
            border-top-color: #10b981;
            animation-delay: -0.4s;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            color: #64748b;
            font-weight: 500;
            font-size: 14px;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="premium-error-container">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <Button 
          onClick={fetchPending}
          className="retry-button"
        >
          🔄 Retry
        </Button>
        <style jsx>{`
          .premium-error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #ffffff;
            text-align: center;
            gap: 16px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            padding: 2rem;
          }
          .error-icon {
            font-size: 40px;
            margin-bottom: 8px;
          }
          h3 {
            color: #ef4444;
            margin: 0;
            font-weight: 600;
            font-size: 1.125rem;
          }
          p {
            color: #64748b;
            margin: 0;
            font-size: 0.875rem;
            max-width: 400px;
          }
          .retry-button {
            margin-top: 1rem;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            border-radius: 8px;
            padding: 0.625rem 1.25rem;
            font-weight: 600;
            font-size: 0.8125rem;
            color: #ffffff;
            transition: all 0.3s ease;
          }
          .retry-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* 🔥 MAIN CONTAINER - PROFESSIONAL & COMPACT */}
      <div className="admin-verify-container">
        {/* 🔥 COMPACT PROFESSIONAL HEADER */}
        <section className="hero-section">
          <Container>
            <div className="hero-content">
              <div className="hero-branding">
                <div className="brand-icon">
                  <span className="brand-emoji">🏠</span>
                </div>
                <div className="brand-info">
                  <h1 className="brand-title">SpaceLink</h1>
                  <div className="brand-badge">Admin Portal</div>
                </div>
              </div>

              <div className="hero-info">
                <h2 className="hero-title">Property Verification Center</h2>
                <p className="hero-description">Professional property management and verification system</p>
              </div>

              <div className="stats-display">
                <div className="stats-item">
                  <div className="stats-icon">📊</div>
                  <div className="stats-content">
                    <span className="stats-number">{properties.length}</span>
                    <span className="stats-label">Pending Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 🔥 MAIN CONTENT */}
        <section className="main-content">
          <Container>
            {properties.length === 0 ? (
              <div className="no-properties-section">
                <div className="success-icon">✅</div>
                <h2>All Properties Verified</h2>
                <p>No properties require verification at this time. All submissions are up to date.</p>
              </div>
            ) : (
              <div className="properties-section">
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
                            Review Property
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
      
      {/* 🔥 PERFECT SIZING - TOP 1% AGENCY STYLES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* MAIN CONTAINER */
        .admin-verify-container {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* 🔥 COMPACT HERO SECTION */
        .hero-section {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          padding: 2rem 0;
          position: relative;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" fill-opacity="0.1"/><circle cx="80" cy="80" r="1" fill="white" fill-opacity="0.1"/></svg>');
          background-size: 50px 50px;
          opacity: 0.5;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-branding {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .brand-emoji {
          font-size: 24px;
        }

        .brand-info {
          text-align: left;
        }

        .brand-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .brand-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.25rem;
          backdrop-filter: blur(10px);
          display: inline-block;
        }

        .hero-info {
          max-width: 600px;
        }

        .hero-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 0.5rem 0;
          text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        }

        .hero-description {
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        .stats-display {
          margin-top: 1rem;
        }

        .stats-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .stats-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .stats-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .stats-content {
          display: flex;
          flex-direction: column;
        }

        .stats-number {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .stats-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* MAIN CONTENT */
        .main-content {
          padding: 2rem 0;
          background: #ffffff;
        }

        /* NO PROPERTIES SECTION */
        .no-properties-section {
          text-align: center;
          padding: 3rem 2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 1rem;
        }

        .no-properties-section h2 {
          color: #0f172a;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .no-properties-section p {
          color: #64748b;
          font-size: 0.9375rem;
          margin: 0;
          line-height: 1.5;
        }

        /* PROPERTIES GRID */
        .properties-grid {
          gap: 1.5rem;
        }

        .property-col {
          margin-bottom: 1.5rem;
          padding: 0 0.75rem;
        }

        .property-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
          border-color: #6366f1;
        }

        .property-image {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .property-card:hover .main-image {
          transform: scale(1.05);
        }

        .status-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.95);
          color: #f59e0b;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
        }

        .image-count {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .property-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .property-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex: 1;
        }

        .detail-item {
          background: #f8fafc;
          border-radius: 6px;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          border-color: #6366f1;
          transform: translateY(-1px);
        }

        .detail-item-full {
          grid-column: 1 / -1;
        }

        .detail-icon {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
        }

        .owner-icon {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
          font-size: 0.5rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.125rem;
        }

        .detail-value {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .detail-value.price {
          font-size: 0.75rem;
          font-weight: 700;
          color: #10b981;
        }

        .review-button {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 6px;
          padding: 0.625rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
        }

        .button-icon {
          font-size: 0.875rem;
        }

        .review-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        /* 🔥 MODAL STYLES - PERFECT SIZING */
        .verification-modal .modal-content {
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .modal-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .modal-title-section {
          flex: 1;
        }

        .modal-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .modal-subtitle {
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.25rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
          background: #f8fafc;
          padding: 1.25rem;
          max-height: 60vh;
          overflow-y: auto;
        }

        /* INFO SECTIONS */
        .info-section {
          background: #ffffff;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          font-size: 0.75rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 4px;
          padding: 0.25rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .info-card {
          background: #f8fafc;
          border-radius: 6px;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          border-color: #6366f1;
          transform: translateY(-1px);
        }

        .info-icon {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .owner-info-icon {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
          font-size: 0.5625rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-value.price {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #10b981;
        }

        .category-badge {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        /* DESCRIPTION */
        .description-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .description-header {
          font-size: 0.625rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .description-icon {
          font-size: 0.6875rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 3px;
          padding: 0.125rem;
        }

        .description-content {
          font-size: 0.75rem;
          color: #374151;
          line-height: 1.4;
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          margin: 0;
        }

        /* IMAGES & DOCUMENTS */
        .images-section,
        .documents-section {
          background: #ffffff;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #e2e8f0;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 0.5rem;
        }

        .image-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .image-item:hover {
          border-color: #6366f1;
          transform: scale(1.05);
        }

        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-item .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
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
          background: white;
          color: #0f172a;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .documents-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .document-button {
          background: white;
          border: 1px solid #e2e8f0;
          color: #374151;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          font-size: 0.6875rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .document-button:hover {
          border-color: #6366f1;
          color: #6366f1;
          transform: translateY(-1px);
        }

        /* DECISION SECTION */
        .decision-section {
          background: #ffffff;
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          position: relative;
        }

        .decision-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 8px 8px 0 0;
        }

        .form-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-select,
        .notes-textarea {
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          background: #ffffff;
          color: #0f172a;
          transition: all 0.3s ease;
        }

        .status-select:focus,
        .notes-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .status-select {
          height: 36px;
        }

        .notes-textarea {
          height: 36px;
          resize: none;
        }

        /* MODAL FOOTER */
        .modal-footer {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 1rem 1.25rem;
          gap: 0.75rem;
          display: flex;
          justify-content: flex-end;
        }

        .cancel-button {
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-weight: 600;
          font-size: 0.75rem;
          border: 1px solid #d1d5db;
          color: #6b7280;
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          border-color: #9ca3af;
          color: #374151;
          transform: translateY(-1px);
        }

        .action-button {
          border-radius: 6px;
          padding: 0.5rem 1.25rem;
          font-weight: 600;
          font-size: 0.75rem;
          border: none;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          min-width: 120px;
          justify-content: center;
        }

        .action-button.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .action-button.approve:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .action-button.reject {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .action-button.reject:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .action-icon {
          font-size: 0.875rem;
        }

        /* FULLSCREEN MODAL */
        .fullscreen-modal .modal-content {
          border-radius: 0;
        }

        .fullscreen-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fullscreen-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .fullscreen-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .fullscreen-title {
          font-size: 1.125rem;
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
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          min-width: 300px;
        }

        .toast-header {
          background: transparent;
          border: none;
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .toast-body {
          color: white !important;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1200px) {
          .hero-branding {
            flex-direction: column;
            text-align: center;
          }

          .brand-info {
            text-align: center;
          }
        }

        @media (max-width: 992px) {
          .hero-content {
            gap: 1.25rem;
          }

          .brand-title {
            font-size: 1.5rem;
          }

          .hero-title {
            font-size: 1.25rem;
          }

          .property-details {
            grid-template-columns: 1fr;
            gap: 0.375rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 1.5rem 0;
          }

          .hero-branding {
            gap: 0.75rem;
          }

          .brand-icon {
            width: 40px;
            height: 40px;
          }

          .brand-emoji {
            font-size: 20px;
          }

          .brand-title {
            font-size: 1.25rem;
          }

          .hero-title {
            font-size: 1.125rem;
          }

          .stats-item {
            padding: 0.75rem 1rem;
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .modal-header {
            padding: 0.75rem 1rem;
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }

          .modal-header-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .modal-close-btn {
            position: absolute;
            top: 0.75rem;
            right: 1rem;
          }

          .modal-body {
            padding: 1rem;
          }

          .section-title {
            font-size: 0.8125rem;
          }

          .documents-grid {
            flex-direction: column;
          }

          .images-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .hero-content {
            gap: 1rem;
          }

          .property-col {
            padding: 0 0.5rem;
          }

          .card-content {
            padding: 0.75rem;
          }

          .no-properties-section {
            padding: 2rem 1rem;
          }

          .success-icon {
            font-size: 48px;
          }

          .no-properties-section h2 {
            font-size: 1.25rem;
          }

          .no-properties-section p {
            font-size: 0.875rem;
          }
        }

        /* SCROLLBAR STYLING */
        .modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
