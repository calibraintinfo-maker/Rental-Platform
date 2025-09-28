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
            gap: 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .premium-spinner {
            position: relative;
            width: 64px;
            height: 64px;
          }
          .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top: 3px solid #8b5cf6;
            border-radius: 50%;
            animation: spin 1.2s linear infinite;
          }
          .spinner-ring:nth-child(2) {
            width: 48px;
            height: 48px;
            top: 8px;
            left: 8px;
            border-top-color: #06b6d4;
            animation-delay: -0.2s;
          }
          .spinner-ring:nth-child(3) {
            width: 32px;
            height: 32px;
            top: 16px;
            left: 16px;
            border-top-color: #10b981;
            animation-delay: -0.4s;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            color: #64748b;
            font-weight: 600;
            font-size: 16px;
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
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <Button 
          onClick={fetchPending}
          className="retry-button"
        >
          🔄 Retry Connection
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
            font-size: 48px;
            margin-bottom: 16px;
          }
          h3 {
            color: #ef4444;
            margin: 0;
            font-weight: 700;
            font-size: 1.25rem;
          }
          p {
            color: #64748b;
            margin: 0;
            font-size: 0.9rem;
            max-width: 400px;
          }
          .retry-button {
            margin-top: 1.5rem;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            border: none;
            border-radius: 10px;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            font-size: 0.85rem;
            color: #ffffff;
            transition: all 0.3s ease;
          }
          .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* 🔥 MAIN CONTAINER - CLEAN WHITE BACKGROUND */}
      <div className="admin-verify-container">
        <Container className="main-container" fluid>
          {/* 🔥 PROFESSIONAL HERO SECTION - CENTERED & BALANCED */}
          <div className="hero-wrapper">
            <div className="hero-section">
              <div className="hero-content">
                <div className="hero-main">
                  <div className="hero-icon-wrapper">
                    <div className="hero-icon">
                      <div className="icon-glow"></div>
                      <span className="hero-emoji">🏠</span>
                    </div>
                  </div>
                  <div className="hero-text">
                    <h1 className="hero-title">SpaceLink</h1>
                    <div className="hero-badge">ADMIN PORTAL</div>
                  </div>
                </div>
                <div className="hero-info">
                  <h2 className="hero-subtitle">Property Verification Center</h2>
                  <p className="hero-description">Professional property management and verification system</p>
                </div>
                <div className="hero-stats">
                  <div className="stats-card">
                    <div className="stats-icon">📊</div>
                    <div className="stats-content">
                      <div className="stats-number">{properties.length}</div>
                      <div className="stats-label">Properties Pending Review</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 CONTENT AREA */}
          <div className="content-wrapper">
            {properties.length === 0 ? (
              <div className="no-properties-section">
                <div className="no-properties-icon">✅</div>
                <h2>All Properties Verified</h2>
                <p>Outstanding work! No properties require verification at this time. The system is running smoothly and all submissions are up to date.</p>
              </div>
            ) : (
              <div className="properties-container">
                <Row className="properties-grid" style={{margin: 0}}>
                  {properties.map(property => (
                    <Col 
                      key={property._id} 
                      xl={4}
                      lg={6}
                      md={6} 
                      sm={12} 
                      className="property-col"
                    >
                      <div className="property-card">
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
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="card-content">
                          {/* Title */}
                          <h3 className="property-title">{property.title}</h3>

                          {/* Property Details Grid */}
                          <div className="property-details">
                            {/* Owner */}
                            <div className="detail-item">
                              <div className="detail-icon owner-icon">👤</div>
                              <div className="detail-content">
                                <div className="detail-label">OWNER</div>
                                <div className="detail-value">{property.ownerId?.name || 'N/A'}</div>
                              </div>
                            </div>

                            {/* Category */}
                            <div className="detail-item">
                              <div className="detail-icon category-icon">🏠</div>
                              <div className="detail-content">
                                <div className="detail-label">CATEGORY</div>
                                <div className="detail-value">{property.category}</div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="detail-item">
                              <div className="detail-icon price-icon">💰</div>
                              <div className="detail-content">
                                <div className="detail-label">PRICE</div>
                                <div className="detail-value price">₹{property.price?.toLocaleString() || 'N/A'}</div>
                              </div>
                            </div>

                            {/* Location */}
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

                            {/* Date */}
                            <div className="detail-item detail-item-full">
                              <div className="detail-icon date-icon">📅</div>
                              <div className="detail-content">
                                <div className="detail-label">SUBMITTED</div>
                                <div className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button 
                            onClick={() => openModal(property)}
                            className="review-button"
                          >
                            🔍 Review Property
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* 🔥 PERFECTLY DESIGNED PROFESSIONAL MODAL */}
      <Modal 
        show={showModal} 
        onHide={closeModal}
        size="lg"
        centered
        scrollable
        className="verification-modal"
      >
        {/* Fixed Modal Header */}
        <Modal.Header className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">🏠</div>
            <div className="modal-title-wrapper">
              <h2 className="modal-title">Property Verification Portal</h2>
              <div className="modal-subtitle">
                Review & verify: <strong>{selected?.title}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="modal-close-button"
          >
            ✕
          </button>
        </Modal.Header>

        <Modal.Body className="modal-body">
          {selected && (
            <>
              {/* 🔥 COMPACT PROPERTY INFORMATION */}
              <div className="info-section">
                <h4 className="section-title">
                  <span className="section-icon">🏢</span>
                  Property Information
                </h4>
                
                <div className="info-grid">
                  {/* Owner */}
                  <div className="info-card owner-card">
                    <div className="info-icon owner-info-icon">👤</div>
                    <div className="info-content">
                      <div className="info-label">OWNER</div>
                      <div className="info-value">{selected.ownerId?.name || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="info-card email-card">
                    <div className="info-icon email-info-icon">📧</div>
                    <div className="info-content">
                      <div className="info-label">EMAIL</div>
                      <div className="info-value info-value-email">{selected.ownerId?.email || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="info-card category-card">
                    <div className="info-icon category-info-icon">🏠</div>
                    <div className="info-content">
                      <div className="info-label">CATEGORY</div>
                      <div className="category-badge">{selected.category?.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="info-card price-card">
                    <div className="info-icon price-info-icon">💰</div>
                    <div className="info-content">
                      <div className="info-label">PRICE</div>
                      <div className="info-value price">₹{selected.price?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="info-card location-card">
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

                  {/* Date */}
                  <div className="info-card date-card">
                    <div className="info-icon date-info-icon">📅</div>
                    <div className="info-content">
                      <div className="info-label">SUBMISSION DATE</div>
                      <div className="info-value">{new Date(selected.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selected.description && (
                  <div className="description-section">
                    <div className="description-header">
                      <span className="description-icon">📝</span>
                      Property Description
                    </div>
                    <p className="description-content">{selected.description}</p>
                  </div>
                )}
              </div>

              {/* 🔥 COMPACT IMAGES SECTION */}
              {selected.images && selected.images.length > 0 && (
                <div className="images-section">
                  <h4 className="section-title">
                    <span className="section-icon">🖼️</span>
                    Property Images ({selected.images.length})
                  </h4>
                  <div className="images-grid">
                    {selected.images.map((image, index) => (
                      <div 
                        key={index}
                        onClick={() => openFullscreen(image, 'image', `Property Image ${index + 1}`)}
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

              {/* 🔥 COMPACT DOCUMENTS SECTION */}
              {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                <div className="documents-section">
                  <h4 className="section-title">
                    <span className="section-icon">📄</span>
                    Supporting Documents
                  </h4>
                  <div className="documents-grid">
                    {selected.ownerProof && (
                      <Button
                        onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof Document')}
                        className="document-button"
                      >
                        🆔 Owner Verification
                      </Button>
                    )}
                    {selected.propertyProof && (
                      <Button
                        onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof Document')}
                        className="document-button"
                      >
                        📋 Property Documents
                      </Button>
                    )}
                    {selected.documents && selected.documents.map((doc, index) => (
                      <Button
                        key={index}
                        onClick={() => openFullscreen(doc, 'document', `Additional Document ${index + 1}`)}
                        className="document-button"
                      >
                        📄 Document {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔥 COMPACT DECISION SECTION */}
              <div className="decision-section">
                <h4 className="section-title">
                  <span className="section-icon">⚖️</span>
                  Administrative Decision
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="form-label">Verification Status</Form.Label>
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
                      <Form.Label className="form-label">Administrative Notes (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={verifyNote}
                        onChange={(e) => setVerifyNote(e.target.value)}
                        placeholder="Enter verification notes..."
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
            Cancel Review
          </Button>
          
          <Button 
            onClick={handleVerify} 
            disabled={submitting}
            className={`action-button ${verifyStatus === 'verified' ? 'approve' : 'reject'}`}
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="action-icon">{verifyStatus === 'verified' ? '✅' : '❌'}</span>
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
          delay={5000}
          autohide
          bg={toastType}
          className="premium-toast"
        >
          <Toast.Header className="toast-header">
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Operation Successful' : '❌ System Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="toast-body">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      
      {/* 🔥 TOP 1% AGENCY STYLES - PERFECT DESIGN */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        /* MAIN CONTAINER */
        .admin-verify-container {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .main-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
        }

        /* HERO WRAPPER - CENTERED & PROFESSIONAL */
        .hero-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .hero-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" fill-opacity="0.05"/><circle cx="75" cy="75" r="1" fill="white" fill-opacity="0.05"/><circle cx="50" cy="10" r="1" fill="white" fill-opacity="0.03"/><circle cx="10" cy="90" r="1" fill="white" fill-opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .hero-section {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2rem;
        }

        .hero-main {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .hero-icon-wrapper {
          position: relative;
        }

        .hero-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .icon-glow {
          position: absolute;
          inset: -10px;
          background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          border-radius: 50%;
          filter: blur(20px);
          z-index: -1;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .hero-emoji {
          font-size: 32px;
          position: relative;
          z-index: 2;
        }

        .hero-text {
          text-align: left;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin: 0;
          letter-spacing: -0.03em;
          line-height: 1;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
        }

        .hero-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.75rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: inline-block;
        }

        .hero-info {
          max-width: 600px;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 1rem 0;
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        .hero-stats {
          margin-top: 1rem;
        }

        .stats-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          min-width: 280px;
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .stats-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stats-number {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          line-height: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .stats-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
        }

        /* CONTENT WRAPPER */
        .content-wrapper {
          padding: 3rem 2rem;
          background: #ffffff;
        }

        .properties-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* NO PROPERTIES SECTION */
        .no-properties-section {
          text-align: center;
          background: #ffffff;
          border-radius: 24px;
          padding: 4rem 2rem;
          border: 2px dashed #e2e8f0;
          max-width: 600px;
          margin: 0 auto;
        }

        .no-properties-icon {
          font-size: 80px;
          margin-bottom: 2rem;
          filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
        }

        .no-properties-section h2 {
          color: #0f172a;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .no-properties-section p {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
          margin: 0;
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto;
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
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
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
          transition: opacity 0.3s ease;
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }

        .property-card:hover::before {
          opacity: 1;
        }

        .property-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .property-card:hover .main-image {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
        }

        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #f59e0b;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.625rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .property-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .property-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .detail-item {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .detail-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .detail-item:hover::before {
          opacity: 1;
        }

        .detail-item-full {
          grid-column: 1 / -1;
        }

        .detail-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
          font-size: 0.625rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0f172a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .detail-value.price {
          font-size: 1rem;
          font-weight: 800;
          color: #10b981;
        }

        .review-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          transition: all 0.4s ease;
          width: 100%;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .review-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .review-button:hover::before {
          left: 100%;
        }

        .review-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        /* MODAL STYLES - PERFECTLY SIZED */
        .verification-modal .modal-content {
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1.5rem 2rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .modal-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-title-wrapper {
          flex: 1;
        }

        .modal-title {
          font-size: 1.375rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .modal-subtitle {
          font-size: 0.9375rem;
          font-weight: 500;
          margin-top: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          opacity: 0.9;
        }

        .modal-close-button {
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
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 400;
        }

        .modal-close-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .modal-body {
          background: #f8fafc;
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
        }

        /* COMPACT INFO SECTION */
        .info-section {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          position: relative;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.01em;
        }

        .section-icon {
          font-size: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          padding: 0.375rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.1);
          border-color: #667eea;
        }

        .info-card:hover::before {
          opacity: 1;
        }

        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
          font-size: 0.6875rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.375rem;
        }

        .info-value {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-value.price {
          font-size: 1.125rem;
          font-weight: 800;
          color: #10b981;
        }

        .info-value-email {
          color: #3b82f6;
        }

        .category-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 16px;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        /* DESCRIPTION SECTION */
        .description-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e2e8f0;
        }

        .description-header {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .description-icon {
          font-size: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 6px;
          padding: 0.25rem;
        }

        .description-content {
          font-size: 0.9375rem;
          color: #374151;
          line-height: 1.6;
          font-weight: 500;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          margin: 0;
        }

        /* IMAGES SECTION */
        .images-section {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .image-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .image-item:hover {
          border-color: #667eea;
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
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
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        /* DOCUMENTS SECTION */
        .documents-section {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .documents-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .document-button {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          color: #374151;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
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
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
        }

        /* DECISION SECTION */
        .decision-section {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 2px solid #f1f5f9;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
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
          border-radius: 16px 16px 0 0;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #374151;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-select,
        .notes-textarea {
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
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
          height: 48px;
        }

        .notes-textarea {
          height: 48px;
          resize: none;
        }

        /* MODAL FOOTER */
        .modal-footer {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
          border-top: 2px solid #e2e8f0;
          padding: 1.5rem 2rem;
          gap: 1rem;
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .cancel-button {
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-weight: 700;
          font-size: 0.875rem;
          border: 2px solid #d1d5db;
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
          border-radius: 10px;
          padding: 0.75rem 2rem;
          font-weight: 700;
          font-size: 0.875rem;
          border: none;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 180px;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .action-button.approve {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }

        .action-button.approve:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }

        .action-button.reject {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
        }

        .action-button.reject:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        }

        .action-icon {
          font-size: 1rem;
        }

        /* FULLSCREEN MODAL */
        .fullscreen-modal .modal-content {
          border-radius: 0;
        }

        .fullscreen-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          position: relative;
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
          font-weight: 400;
        }

        .fullscreen-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
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
          .hero-main {
            flex-direction: column;
            text-align: center;
          }

          .hero-text {
            text-align: center;
          }
        }

        @media (max-width: 992px) {
          .content-wrapper {
            padding: 2rem 1rem;
          }

          .hero-wrapper {
            padding: 2rem 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .properties-grid {
            gap: 1.5rem;
          }

          .property-details {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .hero-main {
            gap: 1rem;
          }

          .hero-icon {
            width: 60px;
            height: 60px;
          }

          .hero-emoji {
            font-size: 24px;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .modal-header-content {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .section-title {
            font-size: 1rem;
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
          .hero-wrapper {
            padding: 1.5rem 1rem;
          }

          .content-wrapper {
            padding: 1.5rem 0.5rem;
          }

          .property-col {
            padding: 0 0.5rem;
          }

          .stats-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
