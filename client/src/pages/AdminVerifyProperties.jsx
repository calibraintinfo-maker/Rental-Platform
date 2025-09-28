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
      <div className="elite-loading">
        <div className="loading-core">
          <div className="pulse-rings">
            <div className="ring-1"></div>
            <div className="ring-2"></div>
            <div className="ring-3"></div>
          </div>
          <div className="loading-icon">⚡</div>
        </div>
        <div className="loading-info">
          <h3>Initializing Dashboard</h3>
          <p>Preparing verification workspace...</p>
          <div className="progress-line">
            <div className="progress-fill"></div>
          </div>
        </div>
        <style jsx>{`
          .elite-loading {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2.5rem;
            color: white;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .loading-core {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .pulse-rings {
            position: absolute;
          }
          .ring-1, .ring-2, .ring-3 {
            position: absolute;
            border: 2px solid #00d4ff;
            border-radius: 50%;
            opacity: 0.6;
            animation: pulseRing 2s ease-out infinite;
          }
          .ring-1 {
            width: 80px;
            height: 80px;
            top: -40px;
            left: -40px;
          }
          .ring-2 {
            width: 120px;
            height: 120px;
            top: -60px;
            left: -60px;
            animation-delay: 0.5s;
          }
          .ring-3 {
            width: 160px;
            height: 160px;
            top: -80px;
            left: -80px;
            animation-delay: 1s;
          }
          @keyframes pulseRing {
            0% {
              opacity: 1;
              transform: scale(0.8);
            }
            100% {
              opacity: 0;
              transform: scale(1.5);
            }
          }
          .loading-icon {
            font-size: 2.5rem;
            z-index: 10;
            animation: bounce 1.5s ease-in-out infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .loading-info {
            text-align: center;
            max-width: 400px;
          }
          .loading-info h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #00d4ff;
          }
          .loading-info p {
            opacity: 0.8;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
          }
          .progress-line {
            width: 200px;
            height: 2px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 1px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00d4ff, #0099cc);
            animation: fillProgress 2s ease-in-out infinite;
          }
          @keyframes fillProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="elite-error">
        <div className="error-container">
          <div className="error-visual">
            <div className="error-icon">⚠️</div>
          </div>
          <div className="error-content">
            <h2>Connection Failed</h2>
            <p>{error}</p>
            <Button onClick={fetchPending} className="retry-btn">
              Retry Connection
            </Button>
          </div>
        </div>
        <style jsx>{`
          .elite-error {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          .error-container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          .error-visual {
            margin-bottom: 2rem;
          }
          .error-icon {
            font-size: 4rem;
            display: inline-block;
            animation: shake 0.5s ease-in-out infinite alternate;
          }
          @keyframes shake {
            from { transform: translateX(-2px); }
            to { transform: translateX(2px); }
          }
          .error-content h2 {
            color: #ff6b6b;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .error-content p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .retry-btn {
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="elite-dashboard">
        {/* 🔥 WORLD-CLASS HEADER */}
        <header className="dashboard-header">
          <div className="header-backdrop"></div>
          <Container>
            <div className="header-content">
              <div className="brand-section">
                <div className="brand-logo">
                  <div className="logo-core">
                    <span>🏠</span>
                  </div>
                </div>
                <div className="brand-info">
                  <h1>SpaceLink</h1>
                  <span className="brand-tag">Admin Portal</span>
                </div>
              </div>
              
              <div className="title-section">
                <h2>Property Verification Center</h2>
                <p>Enterprise property management with streamlined verification workflows</p>
              </div>

              <div className="metrics-panel">
                <div className="metric-card">
                  <div className="metric-visual">
                    <div className="progress-circle">
                      <svg width="60" height="60">
                        <circle cx="30" cy="30" r="25" fill="none" stroke="#333" strokeWidth="3"/>
                        <circle 
                          cx="30" 
                          cy="30" 
                          r="25" 
                          fill="none" 
                          stroke="#00d4ff" 
                          strokeWidth="3"
                          strokeDasharray="157"
                          strokeDashoffset={157 - (properties.length * 15.7)}
                          style={{transition: 'stroke-dashoffset 0.8s ease'}}
                        />
                      </svg>
                      <div className="circle-center">
                        <span className="metric-number">{properties.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="metric-info">
                    <h3>Pending Reviews</h3>
                    <div className="status-indicator">
                      <div className="status-dot"></div>
                      <span>System Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* 🔥 MAIN CONTENT */}
        <main className="dashboard-main">
          <Container>
            {properties.length === 0 ? (
              <div className="empty-workspace">
                <div className="empty-visual">
                  <div className="success-badge">✅</div>
                </div>
                <div className="empty-content">
                  <h2>All Properties Verified</h2>
                  <p>Outstanding work! Your verification queue is completely up to date. All property submissions have been processed successfully.</p>
                </div>
              </div>
            ) : (
              <div className="properties-workspace">
                <div className="workspace-header">
                  <h3>Verification Queue</h3>
                  <p>Review and approve pending property submissions</p>
                </div>
                
                <div className="properties-list">
                  {properties.map((property, index) => (
                    <div key={property._id} className="property-item" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="property-image">
                        {property.images && property.images.length > 0 && (
                          <>
                            <img src={property.images[0]} alt={property.title} />
                            <div className="image-overlay"></div>
                            <div className="status-tag">PENDING</div>
                            {property.images.length > 1 && (
                              <div className="image-counter">+{property.images.length - 1}</div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="property-details">
                        <h4 className="property-title">{property.title}</h4>
                        
                        <div className="details-grid">
                          <div className="detail-row">
                            <div className="detail-item">
                              <span className="detail-label">Owner</span>
                              <span className="detail-value">{property.ownerId?.name || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Category</span>
                              <span className="detail-value">{property.category}</span>
                            </div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-item">
                              <span className="detail-label">Price</span>
                              <span className="detail-value price">₹{property.price?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Location</span>
                              <span className="detail-value">
                                {property.address ? `${property.address.city}, ${property.address.state}` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="detail-row">
                            <div className="detail-item">
                              <span className="detail-label">Submitted</span>
                              <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="property-actions">
                        <Button
                          onClick={() => openModal(property)}
                          className="review-btn"
                        >
                          <span className="btn-icon">🔍</span>
                          <span>Review Property</span>
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

      {/* 🔥 ELITE MODAL */}
      <Modal
        show={showModal}
        onHide={closeModal}
        size="lg"
        centered
        scrollable
        className="elite-modal"
      >
        <div className="modal-container">
          <div className="modal-header-elite">
            <div className="header-content">
              <div className="modal-icon">🏠</div>
              <div className="title-section">
                <h3>Property Verification</h3>
                <p>Review: <strong>{selected?.title}</strong></p>
              </div>
            </div>
            <button onClick={closeModal} className="close-btn">✕</button>
          </div>

          <div className="modal-body-elite">
            {selected && (
              <>
                {/* Property Information */}
                <div className="info-section">
                  <h4 className="section-header">
                    <span className="header-icon">🏢</span>
                    Property Information
                  </h4>
                  
                  <div className="info-cards">
                    <div className="info-card">
                      <span className="card-label">Owner</span>
                      <span className="card-value">{selected.ownerId?.name || 'N/A'}</span>
                    </div>
                    
                    <div className="info-card">
                      <span className="card-label">Email</span>
                      <span className="card-value">{selected.ownerId?.email || 'N/A'}</span>
                    </div>
                    
                    <div className="info-card">
                      <span className="card-label">Category</span>
                      <span className="card-badge">{selected.category?.toUpperCase()}</span>
                    </div>
                    
                    <div className="info-card">
                      <span className="card-label">Price</span>
                      <span className="card-value price">₹{selected.price?.toLocaleString() || 'N/A'}</span>
                    </div>
                    
                    <div className="info-card">
                      <span className="card-label">Location</span>
                      <span className="card-value">
                        {selected.address ? `${selected.address.city}, ${selected.address.state}` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="info-card">
                      <span className="card-label">Date</span>
                      <span className="card-value">{new Date(selected.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {selected.description && (
                    <div className="description-block">
                      <h5>Property Description</h5>
                      <p>{selected.description}</p>
                    </div>
                  )}
                </div>

                {/* Images */}
                {selected.images && selected.images.length > 0 && (
                  <div className="images-section">
                    <h4 className="section-header">
                      <span className="header-icon">🖼️</span>
                      Images ({selected.images.length})
                    </h4>
                    <div className="images-gallery">
                      {selected.images.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => openFullscreen(image, 'image', `Image ${index + 1}`)}
                          className="gallery-item"
                        >
                          <img src={image} alt={`Property ${index + 1}`} />
                          <div className="gallery-overlay">
                            <span>🔍</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {((selected.documents && selected.documents.length > 0) || selected.ownerProof || selected.propertyProof) && (
                  <div className="documents-section">
                    <h4 className="section-header">
                      <span className="header-icon">📄</span>
                      Documents
                    </h4>
                    <div className="documents-list">
                      {selected.ownerProof && (
                        <Button
                          onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof')}
                          className="doc-btn"
                        >
                          🆔 Owner Proof
                        </Button>
                      )}
                      {selected.propertyProof && (
                        <Button
                          onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof')}
                          className="doc-btn"
                        >
                          📋 Property Docs
                        </Button>
                      )}
                      {selected.documents && selected.documents.map((doc, index) => (
                        <Button
                          key={index}
                          onClick={() => openFullscreen(doc, 'document', `Document ${index + 1}`)}
                          className="doc-btn"
                        >
                          📄 Doc {index + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision */}
                <div className="decision-section">
                  <h4 className="section-header">
                    <span className="header-icon">⚖️</span>
                    Administrative Decision
                  </h4>
                  <div className="decision-form">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <Form.Control
                        as="select"
                        value={verifyStatus}
                        onChange={(e) => setVerifyStatus(e.target.value)}
                        className="elite-select"
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
                        placeholder="Enter verification notes..."
                        className="elite-textarea"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer-elite">
            <Button onClick={closeModal} disabled={submitting} className="cancel-btn">
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={submitting}
              className={`action-btn ${verifyStatus === 'verified' ? 'approve' : 'reject'}`}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" animation="border" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{verifyStatus === 'verified' ? '✅' : '❌'}</span>
                  <span>{verifyStatus === 'verified' ? 'Approve Property' : 'Reject Property'}</span>
                </>
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
        <Modal.Header className="fs-header">
          <Modal.Title>{fullscreenDoc.title}</Modal.Title>
          <button onClick={closeFullscreen} className="fs-close">✕</button>
        </Modal.Header>
        <Modal.Body className="fs-body">
          {fullscreenDoc.type === 'image' ? (
            <img src={fullscreenDoc.src} alt="Document" className="fs-image" />
          ) : (
            <iframe src={fullscreenDoc.src} title="Document Preview" className="fs-iframe" />
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
          className="elite-toast"
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Success' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* 🔥 WORLD-CLASS STYLES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700;800;900&display=swap');
        
        /* MAIN DASHBOARD */
        .elite-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          color: white;
        }

        /* HEADER */
        .dashboard-header {
          position: relative;
          padding: 3rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
        }

        .header-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          text-align: center;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-logo {
          position: relative;
        }

        .logo-core {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        }

        .brand-info h1 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #00d4ff 0%, #ffffff 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tag {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .title-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #ffffff;
        }

        .title-section p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 1rem;
        }

        .metrics-panel {
          margin-top: 1rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .metric-visual {
          position: relative;
        }

        .progress-circle {
          position: relative;
        }

        .circle-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #00d4ff;
        }

        .metric-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #ffffff;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-indicator span {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
        }

        /* MAIN CONTENT */
        .dashboard-main {
          padding: 3rem 0;
        }

        /* EMPTY STATE */
        .empty-workspace {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-visual {
          margin-bottom: 2rem;
        }

        .success-badge {
          font-size: 4rem;
          display: inline-block;
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
          border-radius: 50%;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 8px 32px rgba(0, 255, 136, 0.3);
        }

        .empty-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .empty-content p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin: 0;
        }

        /* PROPERTIES WORKSPACE */
        .properties-workspace {
          max-width: 900px;
          margin: 0 auto;
        }

        .workspace-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .workspace-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .workspace-header p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .properties-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .property-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .property-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 212, 255, 0.3);
        }

        .property-image {
          position: relative;
          width: 120px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .status-tag {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ff9500;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 700;
        }

        .image-counter {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.625rem;
        }

        .property-details {
          flex: 1;
          min-width: 0;
        }

        .property-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #ffffff;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          gap: 2rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .detail-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 0.875rem;
          color: #ffffff;
          font-weight: 500;
        }

        .detail-value.price {
          color: #00ff88;
          font-weight: 700;
        }

        .property-actions {
          display: flex;
          align-items: center;
        }

        .review-btn {
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }

        .review-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
        }

        .btn-icon {
          font-size: 1rem;
        }

        /* ELITE MODAL */
        .elite-modal .modal-content {
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .modal-container {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-header-elite {
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .title-section h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .title-section p {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .modal-body-elite {
          padding: 2rem;
          max-height: 70vh;
          overflow-y: auto;
          color: white;
        }

        /* INFO SECTION */
        .info-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #00d4ff;
        }

        .header-icon {
          font-size: 1.25rem;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 212, 255, 0.3);
        }

        .card-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .card-value {
          font-size: 0.875rem;
          color: #ffffff;
          font-weight: 500;
        }

        .card-value.price {
          color: #00ff88;
          font-weight: 700;
        }

        .card-badge {
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-block;
          width: fit-content;
        }

        .description-block {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .description-block h5 {
          font-size: 0.875rem;
          color: #00d4ff;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .description-block p {
          margin: 0;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        /* IMAGES SECTION */
        .images-section {
          margin-bottom: 2rem;
        }

        .images-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gallery-item:hover {
          transform: scale(1.05);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .gallery-overlay span {
          font-size: 1.5rem;
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

        .doc-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .doc-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        /* DECISION SECTION */
        .decision-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .decision-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          color: #00d4ff;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .elite-select,
        .elite-textarea {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 0.75rem;
          color: white;
          font-size: 0.875rem;
        }

        .elite-select:focus,
        .elite-textarea:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: #00d4ff;
          box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }

        .elite-textarea {
          resize: none;
        }

        /* MODAL FOOTER */
        .modal-footer-elite {
          background: rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .action-btn.approve {
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
        }

        .action-btn.reject {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        /* FULLSCREEN MODAL */
        .fullscreen-modal .modal-content {
          background: rgba(15, 15, 35, 0.98);
          border: none;
          border-radius: 0;
        }

        .fs-header {
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
        }

        .fs-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
        }

        .fs-body {
          background: #000;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
        }

        .fs-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
        }

        .fs-iframe {
          width: 100%;
          height: 80vh;
          border: none;
        }

        /* TOAST */
        .elite-toast {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .brand-section {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .property-item {
            flex-direction: column;
            gap: 1rem;
          }
          
          .property-image {
            width: 100%;
            height: 160px;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .decision-form {
            grid-template-columns: 1fr;
          }
          
          .modal-footer-elite {
            flex-direction: column;
          }
          
          .info-cards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .dashboard-header {
            padding: 2rem 0;
          }
          
          .dashboard-main {
            padding: 2rem 0;
          }
          
          .modal-body-elite {
            padding: 1rem;
          }
          
          .modal-footer-elite {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdminVerifyProperties;
