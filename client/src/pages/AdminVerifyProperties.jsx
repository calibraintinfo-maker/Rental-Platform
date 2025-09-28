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
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <div className="loading-text">
          <h3>Loading Dashboard</h3>
          <p>Please wait...</p>
        </div>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-spinner {
            position: relative;
            width: 48px;
            height: 48px;
          }
          .spinner-ring {
            width: 100%;
            height: 100%;
            border: 3px solid #f3f4f6;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            margin: 0;
          }
          .loading-text p {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0.25rem 0 0 0;
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <Button onClick={fetchPending} className="retry-button">
            Try Again
          </Button>
        </div>
        <style jsx>{`
          .error-container {
            min-height: 100vh;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .error-content {
            text-align: center;
            max-width: 400px;
          }
          .error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .error-content h3 {
            color: #dc2626;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          .error-content p {
            color: #6b7280;
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }
          .retry-button {
            background: #3b82f6;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            font-size: 0.875rem;
          }
          .retry-button:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="admin-dashboard">
        {/* 🔥 COMPACT APPLE-STYLE HEADER */}
        <header className="dashboard-header">
          <Container>
            <div className="header-content">
              <div className="brand-section">
                <div className="brand-icon">🏠</div>
                <div className="brand-text">
                  <h1>SpaceLink</h1>
                  <span>Admin Portal</span>
                </div>
              </div>
              
              <div className="header-info">
                <h2>Property Verification</h2>
                <p>Review and approve property submissions</p>
              </div>

              <div className="header-stats">
                <div className="stat-item">
                  <div className="stat-number">{properties.length}</div>
                  <div className="stat-label">Pending Reviews</div>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* 🔥 MAIN CONTENT */}
        <main className="dashboard-main">
          <Container>
            {properties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✅</div>
                <h3>All caught up!</h3>
                <p>No properties require verification at this time.</p>
              </div>
            ) : (
              <div className="properties-section">
                <div className="section-header">
                  <h3>Verification Queue</h3>
                  <p>Properties awaiting your review</p>
                </div>
                
                <div className="properties-list">
                  {properties.map((property, index) => (
                    <div key={property._id} className="property-card" style={{animationDelay: `${index * 0.05}s`}}>
                      <div className="property-image">
                        {property.images && property.images.length > 0 && (
                          <>
                            <img src={property.images[0]} alt={property.title} />
                            <div className="status-badge">Pending</div>
                            {property.images.length > 1 && (
                              <div className="image-count">+{property.images.length - 1}</div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="property-details">
                        <h4 className="property-title">{property.title}</h4>
                        
                        <div className="property-meta">
                          <div className="meta-row">
                            <div className="meta-item">
                              <span className="meta-label">Owner</span>
                              <span className="meta-value">{property.ownerId?.name || 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Category</span>
                              <span className="meta-value">{property.category}</span>
                            </div>
                          </div>
                          
                          <div className="meta-row">
                            <div className="meta-item">
                              <span className="meta-label">Price</span>
                              <span className="meta-value price">₹{property.price?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-label">Location</span>
                              <span className="meta-value">
                                {property.address ? `${property.address.city}, ${property.address.state}` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="meta-row">
                            <div className="meta-item">
                              <span className="meta-label">Submitted</span>
                              <span className="meta-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="property-actions">
                        <Button
                          onClick={() => openModal(property)}
                          className="review-button"
                        >
                          Review Property
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </main>
      </div>

      {/* 🔥 APPLE-STYLE MODAL */}
      <Modal
        show={showModal}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
        className="verification-modal"
      >
        <div className="modal-wrapper">
          <div className="modal-header-custom">
            <div className="modal-header-content">
              <div className="modal-icon">🏠</div>
              <div className="modal-title-section">
                <h3>Property Verification</h3>
                <p>Review: {selected?.title}</p>
              </div>
            </div>
            <button onClick={closeModal} className="modal-close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="modal-body-custom">
            {selected && (
              <>
                {/* Property Information */}
                <div className="info-section">
                  <h4 className="section-title">Property Information</h4>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Owner</span>
                      <span className="info-value">{selected.ownerId?.name || 'N/A'}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{selected.ownerId?.email || 'N/A'}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Category</span>
                      <div className="category-tag">{selected.category}</div>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Price</span>
                      <span className="info-value price">₹{selected.price?.toLocaleString() || 'N/A'}</span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Location</span>
                      <span className="info-value">
                        {selected.address ? `${selected.address.city}, ${selected.address.state}` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="info-item">
                      <span className="info-label">Date Submitted</span>
                      <span className="info-value">{new Date(selected.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {selected.description && (
                    <div className="description-section">
                      <h5>Description</h5>
                      <p>{selected.description}</p>
                    </div>
                  )}
                </div>

                {/* Images */}
                {selected.images && selected.images.length > 0 && (
                  <div className="images-section">
                    <h4 className="section-title">Property Images ({selected.images.length})</h4>
                    <div className="images-grid">
                      {selected.images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => openFullscreen(image, 'image', `Image ${index + 1}`)}
                          className="image-thumbnail"
                        >
                          <img src={image} alt={`Property ${index + 1}`} />
                          <div className="image-overlay">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                  <div className="documents-section">
                    <h4 className="section-title">Documents</h4>
                    <div className="documents-list">
                      {selected.ownerProof && (
                        <button
                          onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof')}
                          className="document-button"
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          Owner Proof
                        </button>
                      )}
                      {selected.propertyProof && (
                        <button
                          onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof')}
                          className="document-button"
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          Property Documents
                        </button>
                      )}
                      {selected.documents && selected.documents.map((doc, index) => (
                        <button
                          key={index}
                          onClick={() => openFullscreen(doc, 'document', `Document ${index + 1}`)}
                          className="document-button"
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          Document {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision */}
                <div className="decision-section">
                  <h4 className="section-title">Verification Decision</h4>
                  <div className="decision-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <Form.Control
                          as="select"
                          value={verifyStatus}
                          onChange={(e) => setVerifyStatus(e.target.value)}
                          className="form-select"
                        >
                          <option value="verified">✅ Approve Property</option>
                          <option value="rejected">❌ Reject Property</option>
                        </Form.Control>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Notes (Optional)</label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={verifyNote}
                          onChange={(e) => setVerifyNote(e.target.value)}
                          placeholder="Add verification notes..."
                          className="form-textarea"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer-custom">
            <Button onClick={closeModal} disabled={submitting} className="cancel-btn">
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={submitting}
              className={`submit-btn ${verifyStatus === 'verified' ? 'approve' : 'reject'}`}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" animation="border" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{verifyStatus === 'verified' ? 'Approve Property' : 'Reject Property'}</span>
              )}
            </Button>
          </div>
        </div>
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
          <Modal.Title>{fullscreenDoc.title}</Modal.Title>
          <button onClick={closeFullscreen} className="fullscreen-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </Modal.Header>
        <Modal.Body className="fullscreen-body">
          {fullscreenDoc.type === 'image' ? (
            <img src={fullscreenDoc.src} alt="Document" className="fullscreen-image" />
          ) : (
            <iframe src={fullscreenDoc.src} title="Document Preview" className="fullscreen-iframe" />
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
          className="custom-toast"
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* 🔥 APPLE/STRIPE INDUSTRY STANDARD STYLES */}
      <style jsx>{`
        /* FONTS & BASE */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .admin-dashboard {
          min-height: 100vh;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* 🔥 COMPACT HEADER - APPLE STYLE */
        .dashboard-header {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem 0 2.5rem 0;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
          font-size: 18px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        }

        .brand-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .brand-text span {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-info h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.01em;
        }

        .header-info p {
          font-size: 0.9375rem;
          color: #6b7280;
          margin: 0;
        }

        .header-stats {
          margin-top: 0.5rem;
        }

        .stat-item {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #3b82f6;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* MAIN CONTENT */
        .dashboard-main {
          padding: 2.5rem 0;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        /* PROPERTIES SECTION */
        .properties-section {
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .section-header p {
          color: #6b7280;
          margin: 0;
        }

        .properties-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .property-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          gap: 1.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .property-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .property-image {
          position: relative;
          width: 120px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f3f4f6;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #fbbf24;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.6875rem;
          font-weight: 600;
        }

        .image-count {
          position: absolute;
          bottom: 6px;
          left: 6px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.6875rem;
          font-weight: 500;
        }

        .property-details {
          flex: 1;
          min-width: 0;
        }

        .property-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 1rem 0;
          line-height: 1.25;
        }

        .property-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .meta-row {
          display: flex;
          gap: 2rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .meta-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .meta-value {
          font-size: 0.875rem;
          color: #111827;
          font-weight: 500;
        }

        .meta-value.price {
          color: #059669;
          font-weight: 600;
        }

        .property-actions {
          display: flex;
          align-items: flex-end;
        }

        .review-button {
          background: #3b82f6;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .review-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        /* MODAL STYLES - APPLE DESIGN */
        .verification-modal .modal-content {
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .modal-wrapper {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .modal-header-custom {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-icon {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        }

        .modal-title-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .modal-title-section p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .modal-body-custom {
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
        }

        /* INFO SECTION */
        .info-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .info-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .info-value {
          font-size: 0.875rem;
          color: #111827;
          font-weight: 500;
        }

        .info-value.price {
          color: #059669;
          font-weight: 600;
        }

        .category-tag {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          width: fit-content;
          text-transform: capitalize;
        }

        .description-section {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .description-section h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .description-section p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        /* IMAGES SECTION */
        .images-section {
          margin-bottom: 2rem;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 0.75rem;
        }

        .image-thumbnail {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          transition: all 0.15s ease;
        }

        .image-thumbnail:hover {
          transform: scale(1.02);
          border-color: #3b82f6;
        }

        .image-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
          color: white;
        }

        .image-thumbnail:hover .image-overlay {
          opacity: 1;
        }

        /* DOCUMENTS SECTION */
        .documents-section {
          margin-bottom: 2rem;
        }

        .documents-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .document-button {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .document-button:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #111827;
        }

        /* DECISION SECTION */
        .decision-section {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .decision-form {
          margin-top: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-select,
        .form-textarea {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.875rem;
          background: #ffffff;
          transition: border-color 0.15s ease;
        }

        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: none;
          font-family: inherit;
        }

        /* MODAL FOOTER */
        .modal-footer-custom {
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .cancel-btn {
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          color: #374151;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.15s ease;
        }

        .cancel-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .submit-btn {
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-btn.approve {
          background: #10b981;
        }

        .submit-btn.approve:hover {
          background: #059669;
        }

        .submit-btn.reject {
          background: #ef4444;
        }

        .submit-btn.reject:hover {
          background: #dc2626;
        }

        /* FULLSCREEN MODAL */
        .fullscreen-modal .modal-content {
          background: #ffffff;
          border: none;
          border-radius: 0;
        }

        .fullscreen-header {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 1.5rem;
        }

        .fullscreen-close {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.15s ease;
        }

        .fullscreen-close:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .fullscreen-body {
          background: #000000;
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
        }

        .fullscreen-iframe {
          width: 100%;
          height: 80vh;
          border: none;
        }

        /* TOAST */
        .custom-toast {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .brand-section {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .property-card {
            flex-direction: column;
            gap: 1rem;
          }
          
          .property-image {
            width: 100%;
            height: 200px;
          }
          
          .meta-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-footer-custom {
            flex-direction: column;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .dashboard-header {
            padding: 1.5rem 0 2rem 0;
          }
          
          .dashboard-main {
            padding: 2rem 0;
          }
          
          .modal-body-custom {
            padding: 1rem;
          }
          
          .modal-footer-custom {
            padding: 1rem;
          }
          
          .images-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
