import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Badge, Toast } from 'react-bootstrap';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
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
      setToastMessage(`Property ${verifyStatus === 'verified' ? 'approved' : 'rejected'} successfully!`);
      setToastType('success');
      setShowToast(true);
      fetchPending();
    } catch {
      setToastMessage('Failed to update property status');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter properties based on search and status
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'pending' && property.status === 'pending') ||
                         (filterStatus === 'verified' && property.status === 'verified') ||
                         (filterStatus === 'rejected' && property.status === 'rejected');
    
    return matchesSearch && matchesFilter;
  });

  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      .admin-verify-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Inter', sans-serif;
        padding: 2rem 0;
      }

      .header-section {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      .page-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #1a202c;
        margin: 0 0 0.5rem 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .page-subtitle {
        color: #718096;
        font-size: 1.1rem;
        margin: 0;
        font-weight: 500;
      }

      .controls-section {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      }

      .search-input {
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.8);
      }

      .search-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: white;
      }

      .filter-select {
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
        background: rgba(255, 255, 255, 0.8);
        transition: all 0.3s ease;
      }

      .filter-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: white;
      }

      .property-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: none;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        height: 100%;
      }

      .property-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .property-card .card-body {
        padding: 1.75rem;
      }

      .property-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 1rem;
        line-height: 1.3;
      }

      .property-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }

      .property-info-item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        font-size: 0.9rem;
      }

      .property-info-label {
        font-weight: 600;
        color: #4a5568;
        min-width: 70px;
        flex-shrink: 0;
      }

      .property-info-value {
        color: #2d3748;
        font-weight: 500;
        flex: 1;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-pending {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: white;
      }

      .status-verified {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      .status-rejected {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
      }

      .review-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        width: 100%;
        color: white;
      }

      .review-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
      }

      .enhanced-modal .modal-content {
        border: none;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        overflow: hidden;
      }

      .enhanced-modal .modal-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 1.5rem 2rem;
      }

      .enhanced-modal .modal-title {
        font-size: 1.3rem;
        font-weight: 700;
        margin: 0;
      }

      .enhanced-modal .btn-close {
        filter: invert(1);
      }

      .enhanced-modal .modal-body {
        padding: 2rem;
        background: #f8fafc;
      }

      .detail-card {
        background: white;
        border: none;
        border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        margin-bottom: 1.5rem;
        overflow: hidden;
      }

      .detail-card .card-body {
        padding: 1.5rem;
      }

      .detail-card h6 {
        color: #667eea;
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .detail-item {
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
      }

      .detail-item strong {
        color: #4a5568;
        font-weight: 600;
        margin-right: 0.5rem;
      }

      .detail-value {
        color: #2d3748;
        font-weight: 500;
      }

      .price-highlight {
        color: #10b981;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.75rem;
      }

      .image-thumbnail {
        position: relative;
        cursor: pointer;
        border-radius: 12px;
        overflow: hidden;
        aspect-ratio: 1;
        transition: all 0.3s ease;
      }

      .image-thumbnail:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .image-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: white;
        padding: 0.5rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .document-preview {
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
      }

      .document-preview:hover {
        border-color: #667eea;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
      }

      .document-preview iframe,
      .document-preview img {
        border-radius: 8px;
        margin-bottom: 0.75rem;
      }

      .action-section {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        margin-top: 1.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }

      .action-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        padding: 0.75rem 2rem;
        font-weight: 700;
        font-size: 0.95rem;
        color: white;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .action-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      .action-button:disabled {
        opacity: 0.6;
        transform: none;
        cursor: not-allowed;
      }

      .fullscreen-modal {
        z-index: 2000;
      }

      .fullscreen-modal .modal-content {
        background: rgba(0, 0, 0, 0.95);
        border: none;
        border-radius: 0;
      }

      .fullscreen-close {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 2001;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a202c;
        transition: all 0.3s ease;
      }

      .fullscreen-close:hover {
        background: white;
        transform: scale(1.1);
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        gap: 1rem;
      }

      .loading-spinner {
        width: 3rem;
        height: 3rem;
        border: 4px solid rgba(102, 126, 234, 0.2);
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-text {
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .error-alert {
        background: rgba(254, 242, 242, 0.95);
        border: 1px solid #fed7d7;
        border-radius: 12px;
        color: #c53030;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: white;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .empty-state p {
        font-size: 1rem;
        opacity: 0.8;
        margin: 0;
      }

      .toast-container {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 2000;
      }

      .toast-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 12px;
      }

      .toast-error {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        border: none;
        border-radius: 12px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .admin-verify-container {
          padding: 1rem 0;
        }

        .header-section,
        .controls-section {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .page-title {
          font-size: 1.8rem;
        }

        .enhanced-modal .modal-body {
          padding: 1.5rem;
        }

        .image-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `}</style>
  );

  if (loading) {
    return (
      <>
        <div className="admin-verify-container">
          <Container>
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading properties...</p>
            </div>
          </Container>
        </div>
        {styles}
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="admin-verify-container">
          <Container>
            <div className="error-alert">
              {error}
            </div>
          </Container>
        </div>
        {styles}
      </>
    );
  }

  return (
    <>
      <div className="admin-verify-container">
        <Container>
          {/* Header Section */}
          <div className="header-section">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="page-title">Property Verification</h1>
                <p className="page-subtitle">Review and manage pending property submissions</p>
              </div>
              <Badge bg="primary" className="status-pending" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                {filteredProperties.length} Properties
              </Badge>
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <Row className="g-3">
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Search properties, owners, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Properties</option>
                  <option value="pending">Pending Review</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <h3>No Properties Found</h3>
              <p>There are currently no properties matching your criteria.</p>
            </div>
          ) : (
            <Row className="g-4">
              {filteredProperties.map(property => (
                <Col xl={4} lg={6} key={property._id}>
                  <Card className="property-card h-100">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="property-title">{property.title}</h5>
                        <Badge 
                          className={`status-badge status-${property.status || 'pending'}`}
                        >
                          {property.status || 'pending'}
                        </Badge>
                      </div>
                      
                      <div className="property-info flex-grow-1">
                        <div className="property-info-item">
                          <span className="property-info-label">Owner:</span>
                          <span className="property-info-value">
                            {property.ownerId?.name || 'Unknown'} ({property.ownerId?.email || 'No email'})
                          </span>
                        </div>
                        
                        <div className="property-info-item">
                          <span className="property-info-label">Category:</span>
                          <span className="property-info-value">{property.category}</span>
                        </div>
                        
                        <div className="property-info-item">
                          <span className="property-info-label">Location:</span>
                          <span className="property-info-value">
                            {property.address?.city}, {property.address?.state} - {property.address?.pincode}
                          </span>
                        </div>
                        
                        {property.price && (
                          <div className="property-info-item">
                            <span className="property-info-label">Price:</span>
                            <span className="property-info-value price-highlight">₹{property.price.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="review-button mt-3"
                        onClick={() => openModal(property)}
                      >
                        Review & Verify
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>

        {/* Enhanced Verification Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="xl" 
          className="enhanced-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Property Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selected && (
              <div>
                {/* Property Header */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="mb-1" style={{ fontWeight: 700 }}>{selected.title}</h4>
                    <Badge className={`status-badge status-${selected.status || 'pending'}`}>
                      {selected.status || 'pending'}
                    </Badge>
                  </div>
                </div>

                <Row>
                  <Col lg={7}>
                    {/* Property Details */}
                    <Card className="detail-card">
                      <Card.Body>
                        <h6><i className="bi bi-house-door"></i> Property Details</h6>
                        <div className="detail-item">
                          <strong>Description:</strong>
                          <div className="detail-value">{selected.description}</div>
                        </div>
                        <div className="detail-item">
                          <strong>Category:</strong>
                          <span className="detail-value">{selected.category}</span>
                        </div>
                        {selected.subtype && (
                          <div className="detail-item">
                            <strong>Subtype:</strong>
                            <span className="detail-value">{selected.subtype}</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <strong>Price:</strong>
                          <span className="detail-value price-highlight">₹{selected.price?.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Size:</strong>
                          <span className="detail-value">{selected.size}</span>
                        </div>
                        {selected.rentType && (
                          <div className="detail-item">
                            <strong>Rent Types:</strong>
                            <span className="detail-value">{selected.rentType.join(', ')}</span>
                          </div>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Address */}
                    <Card className="detail-card">
                      <Card.Body>
                        <h6><i className="bi bi-geo-alt"></i> Address & Contact</h6>
                        <div className="detail-item">
                          <strong>Address:</strong>
                          <div className="detail-value">
                            {selected.address?.street}<br />
                            {selected.address?.city}, {selected.address?.state} - {selected.address?.pincode}
                          </div>
                        </div>
                        <div className="detail-item">
                          <strong>Contact:</strong>
                          <span className="detail-value">{selected.contact}</span>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Owner Details */}
                    <Card className="detail-card">
                      <Card.Body>
                        <h6><i className="bi bi-person-circle"></i> Owner Information</h6>
                        <div className="detail-item">
                          <strong>Name:</strong>
                          <span className="detail-value">{selected.ownerId?.name}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Email:</strong>
                          <span className="detail-value">{selected.ownerId?.email}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={5}>
                    {/* Property Images */}
                    <Card className="detail-card">
                      <Card.Body>
                        <h6><i className="bi bi-images"></i> Property Images</h6>
                        <div className="image-grid">
                          {selected.images && selected.images.map((img, idx) => (
                            <div 
                              key={idx} 
                              className="image-thumbnail"
                              onClick={() => setFullscreenDoc({ show: true, src: img, type: 'image', title: `Property Image ${idx + 1}` })}
                            >
                              <img src={img} alt={`Property ${idx + 1}`} />
                              <div className="image-overlay">View</div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Documents */}
                    <Card className="detail-card">
                      <Card.Body>
                        <h6><i className="bi bi-file-earmark-text"></i> Proof Documents</h6>
                        
                        <div className="mb-3">
                          <strong>Owner Proof:</strong>
                          {selected.ownerProof ? (
                            <div className="document-preview">
                              {selected.ownerProof.startsWith('data:application/pdf') ? (
                                <>
                                  <iframe
                                    src={selected.ownerProof}
                                    title="Owner Proof PDF"
                                    style={{ width: '100%', height: '150px', border: 'none' }}
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary" 
                                    onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'pdf', title: 'Owner Proof' })}
                                  >
                                    View Fullscreen
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <img 
                                    src={selected.ownerProof} 
                                    alt="Owner Proof" 
                                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} 
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary" 
                                    onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'image', title: 'Owner Proof' })}
                                  >
                                    View Fullscreen
                                  </Button>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-muted">Not uploaded</div>
                          )}
                        </div>

                        <div>
                          <strong>Property Proof:</strong>
                          {selected.propertyProof ? (
                            <div className="document-preview">
                              {selected.propertyProof.startsWith('data:application/pdf') ? (
                                <>
                                  <iframe
                                    src={selected.propertyProof}
                                    title="Property Proof PDF"
                                    style={{ width: '100%', height: '150px', border: 'none' }}
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary" 
                                    onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'pdf', title: 'Property Proof' })}
                                  >
                                    View Fullscreen
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <img 
                                    src={selected.propertyProof} 
                                    alt="Property Proof" 
                                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} 
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary" 
                                    onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'image', title: 'Property Proof' })}
                                  >
                                    View Fullscreen
                                  </Button>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-muted">Not uploaded</div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Action Section */}
                <div className="action-section">
                  <Row className="g-3 align-items-end">
                    <Col md={4}>
                      <Form.Label className="fw-bold">Verification Status</Form.Label>
                      <Form.Select 
                        value={verifyStatus} 
                        onChange={e => setVerifyStatus(e.target.value)}
                        className="filter-select"
                      >
                        <option value="verified">✅ Approve</option>
                        <option value="rejected">❌ Reject</option>
                      </Form.Select>
                    </Col>
                    <Col md={5}>
                      <Form.Label className="fw-bold">Admin Note (Optional)</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={verifyNote} 
                        onChange={e => setVerifyNote(e.target.value)}
                        placeholder="Add a note for the owner..."
                        className="search-input"
                      />
                    </Col>
                    <Col md={3}>
                      <Button 
                        className="action-button w-100"
                        onClick={handleVerify} 
                        disabled={submitting}
                      >
                        {submitting ? 'Processing...' : 'Update Status'}
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Fullscreen Document Modal */}
        <Modal
          show={fullscreenDoc.show}
          onHide={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
          size={fullscreenDoc.type === 'image' ? undefined : 'xl'}
          centered
          className={fullscreenDoc.type === 'image' ? 'fullscreen-modal' : 'enhanced-modal'}
          dialogClassName={fullscreenDoc.type === 'image' ? 'modal-fullscreen' : ''}
        >
          {fullscreenDoc.type === 'image' ? (
            <>
              <Button
                className="fullscreen-close"
                onClick={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
                aria-label="Close"
              >
                ×
              </Button>
              <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem'
              }}>
                <img
                  src={fullscreenDoc.src}
                  alt="Document Preview"
                  style={{ 
                    maxWidth: '95vw', 
                    maxHeight: '95vh', 
                    borderRadius: '12px',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{fullscreenDoc.title} - Document Preview</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ 
                minHeight: '80vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {fullscreenDoc.type === 'pdf' && (
                  <iframe
                    src={fullscreenDoc.src}
                    title="PDF Preview"
                    style={{ 
                      width: '100%', 
                      height: '75vh', 
                      border: 'none', 
                      borderRadius: '8px' 
                    }}
                  />
                )}
              </Modal.Body>
            </>
          )}
        </Modal>

        {/* Toast Notifications */}
        <div className="toast-container">
          <Toast 
            show={showToast} 
            onClose={() => setShowToast(false)} 
            delay={3000} 
            autohide
            className={toastType === 'success' ? 'toast-success' : 'toast-error'}
          >
            <Toast.Header>
              <strong className="me-auto">
                {toastType === 'success' ? 'Success' : 'Error'}
              </strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </div>
      </div>
      {styles}
    </>
  );
};

export default AdminVerifyProperties;
