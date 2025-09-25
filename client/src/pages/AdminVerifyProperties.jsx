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

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    .admin-verify-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e5e7eb 75%, #f3f4f6 100%);
      padding: 2rem 0;
      padding-top: 100px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .container {
      position: relative;
      z-index: 10;
    }

    /* Professional Header */
    .admin-title {
      font-size: 3rem !important;
      font-weight: 800 !important;
      color: #1e293b !important;
      margin-bottom: 3rem !important;
      text-align: center !important;
      position: relative;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .admin-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 2px;
    }

    /* Premium Property Cards */
    .property-card {
      background: #ffffff !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 16px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
      position: relative;
      height: 100% !important;
    }

    .property-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
    }

    .property-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
      border-color: #3b82f6 !important;
    }

    .property-card-body {
      padding: 1.5rem !important;
      height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
    }

    .property-card h5 {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: #1e293b !important;
      margin-bottom: 1rem !important;
      line-height: 1.4 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }

    .property-card p {
      font-size: 0.875rem !important;
      color: #64748b !important;
      margin-bottom: 0.5rem !important;
      line-height: 1.5 !important;
      font-weight: 500 !important;
    }

    .property-card p strong {
      color: #374151 !important;
      font-weight: 600 !important;
    }

    .property-card .text-success {
      color: #059669 !important;
      font-weight: 700 !important;
    }

    .property-card .badge {
      font-size: 0.75rem !important;
      padding: 0.375rem 0.75rem !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
    }

    .property-card .badge.bg-info {
      background-color: #0ea5e9 !important;
      color: white !important;
    }

    /* Enhanced Review Button */
    .review-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      text-transform: none !important;
      letter-spacing: 0.025em !important;
      transition: all 0.3s ease !important;
      width: 100% !important;
      color: white !important;
      margin-top: auto !important;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5) !important;
    }

    .review-btn:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5) !important;
      color: white !important;
    }

    /* Professional Modal */
    .modal {
      z-index: 9999 !important;
    }

    .modal-backdrop {
      z-index: 9998 !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
      backdrop-filter: blur(4px) !important;
    }

    .modal-dialog {
      max-width: 1200px !important;
      margin: 1rem auto !important;
    }

    .modal-content {
      border: none !important;
      border-radius: 20px !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      overflow: hidden !important;
      background: white !important;
    }

    .modal-header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      color: white !important;
      border: none !important;
      padding: 1.5rem 2rem !important;
    }

    .modal-title {
      font-size: 1.375rem !important;
      font-weight: 700 !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }

    .btn-close {
      filter: brightness(0) invert(1) !important;
      opacity: 1 !important;
      width: 32px !important;
      height: 32px !important;
      background: rgba(255, 255, 255, 0.2) !important;
      border-radius: 50% !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.2s ease !important;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.05) !important;
    }

    .modal-body {
      padding: 1.5rem !important;
      background: #ffffff !important;
      max-height: 70vh !important;
      overflow-y: auto !important;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      padding: 0.5rem 1rem !important;
      background: #fef3c7 !important;
      color: #92400e !important;
      border-radius: 12px !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      margin-bottom: 1.5rem !important;
      border: 1px solid #fcd34d !important;
    }

    .property-title {
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      color: #1e293b !important;
      margin: 0 !important;
    }

    /* Information Cards */
    .info-card {
      background: #ffffff !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 12px !important;
      margin-bottom: 1rem !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
      transition: all 0.2s ease !important;
    }

    .info-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      border-color: #d1d5db !important;
    }

    .info-card-body {
      padding: 1.25rem !important;
    }

    .info-card h6 {
      font-size: 1rem !important;
      font-weight: 700 !important;
      color: #1e293b !important;
      margin-bottom: 1rem !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      padding-bottom: 0.75rem !important;
      border-bottom: 2px solid #f1f5f9 !important;
    }

    .info-card p, .info-card div {
      font-size: 0.875rem !important;
      line-height: 1.6 !important;
      margin-bottom: 0.75rem !important;
      color: #475569 !important;
      font-weight: 500 !important;
    }

    .info-card strong {
      font-weight: 600 !important;
      color: #1e293b !important;
    }

    .info-card .text-success {
      color: #059669 !important;
      font-weight: 700 !important;
    }

    .info-card .text-primary {
      color: #3b82f6 !important;
      font-weight: 600 !important;
    }

    .info-card .badge {
      font-size: 0.75rem !important;
      padding: 0.25rem 0.625rem !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.025em !important;
    }

    .info-card .badge.bg-info {
      background-color: #0ea5e9 !important;
      color: white !important;
    }

    .info-card .badge.bg-secondary {
      background-color: #64748b !important;
      color: white !important;
    }

    /* Image Gallery */
    .property-image-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
      gap: 0.75rem !important;
    }

    .property-image-container {
      position: relative !important;
      cursor: pointer !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.2s ease !important;
      aspect-ratio: 4/3 !important;
      background: #f8fafc !important;
    }

    .property-image-container:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15) !important;
    }

    .property-image {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }

    .property-image-overlay {
      position: absolute !important;
      bottom: 0 !important;
      right: 0 !important;
      background: rgba(59, 130, 246, 0.9) !important;
      color: white !important;
      padding: 0.25rem 0.5rem !important;
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      border-top-left-radius: 4px !important;
    }

    /* FIXED: Verification Decision Section - Equal Label Sizes */
    .verification-section {
      padding: 1.5rem !important;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      color: white !important;
      border-radius: 16px !important;
      margin: 1.5rem 0 !important;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4) !important;
    }

    .verification-section h5 {
      color: white !important;
      font-weight: 700 !important;
      margin-bottom: 1.5rem !important;
      font-size: 1.125rem !important;
      text-align: center !important;
      padding-bottom: 0.75rem !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    .verification-form {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 1.5rem !important;
      align-items: start !important;
    }

    /* CRITICAL FIX: Equal label sizes */
    .verification-form .form-group {
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
    }

    .verification-form .form-label {
      color: white !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.75rem !important;
      display: block !important;
      height: 1.25rem !important; /* Fixed height for equal sizing */
      line-height: 1.25rem !important; /* Same as height for perfect alignment */
    }

    .verification-form .form-control,
    .verification-form .form-select {
      background: rgba(255, 255, 255, 0.95) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      border-radius: 8px !important;
      padding: 0.75rem !important;
      color: #1e293b !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
      flex: 1 !important;
      min-height: 120px !important; /* Equal minimum height for textarea */
    }

    .verification-form .form-select {
      min-height: 2.75rem !important; /* Specific height for select */
    }

    .verification-form .form-control:focus,
    .verification-form .form-select:focus {
      background: white !important;
      border-color: rgba(255, 255, 255, 0.6) !important;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2) !important;
      outline: none !important;
    }

    /* Document Preview */
    .document-preview {
      border: 1px solid #e5e7eb !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      background: #ffffff !important;
      margin-bottom: 0.75rem !important;
    }

    .document-preview iframe,
    .document-preview img {
      width: 100% !important;
      height: 160px !important;
      object-fit: contain !important;
      background: #f8fafc !important;
      cursor: zoom-in !important;
    }

    .view-fullscreen-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 0.5rem 1rem !important;
      font-weight: 600 !important;
      font-size: 0.75rem !important;
      color: white !important;
      transition: all 0.2s ease !important;
      width: 100% !important;
      text-transform: uppercase !important;
      letter-spacing: 0.025em !important;
    }

    .view-fullscreen-btn:hover {
      background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%) !important;
      transform: translateY(-1px) !important;
      color: white !important;
    }

    .no-documents {
      padding: 1rem;
      text-align: center;
      background: #f8fafc;
      border-radius: 8px;
      color: #64748b;
      font-size: 0.875rem;
      font-style: italic;
    }

    /* FIXED: Modal Footer - Sticky at bottom */
    .modal-footer {
      background: #f8fafc !important;
      border: none !important;
      padding: 1.25rem 2rem !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 1rem !important;
      border-top: 1px solid #e5e7eb !important;
      position: sticky !important;
      bottom: 0 !important;
      z-index: 1000 !important;
    }

    /* Enhanced Buttons */
    .btn-primary {
      background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
      border: none !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      font-size: 0.875rem !important;
      transition: all 0.2s ease !important;
      color: white !important;
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.4) !important;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #047857 0%, #065f46 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 6px rgba(5, 150, 105, 0.4) !important;
      color: white !important;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #64748b 0%, #475569 100%) !important;
      border: none !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      font-size: 0.875rem !important;
      transition: all 0.2s ease !important;
      color: white !important;
      box-shadow: 0 2px 4px rgba(100, 116, 139, 0.4) !important;
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, #475569 0%, #334155 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 6px rgba(100, 116, 139, 0.4) !important;
      color: white !important;
    }

    /* Fullscreen Modal */
    .modal-fullscreen .modal-content {
      background: rgba(0, 0, 0, 0.95) !important;
      border-radius: 0 !important;
    }

    .fullscreen-close-btn {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 10001 !important;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.9) !important;
      border: none !important;
      color: #1e293b !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }

    .fullscreen-close-btn:hover {
      background: white !important;
      transform: scale(1.1) !important;
    }

    .fullscreen-content {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 100vh !important;
      padding: 2rem !important;
    }

    .fullscreen-image {
      max-width: 90vw !important;
      max-height: 90vh !important;
      border-radius: 8px !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
      object-fit: contain !important;
    }

    /* Enhanced Alert */
    .enhanced-alert {
      background: #fef2f2 !important;
      border: 1px solid #fecaca !important;
      border-radius: 12px !important;
      padding: 1.5rem !important;
      color: #dc2626 !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
    }

    /* Success State */
    .success-state {
      text-align: center;
      padding: 3rem 2rem;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .success-state h4 {
      color: #059669;
      font-size: 1.875rem;
      margin-bottom: 1rem;
      font-weight: 800;
    }

    .success-state p {
      color: #64748b;
      font-size: 1rem;
      font-weight: 500;
    }

    /* Loading State */
    .loading-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 100;
    }

    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      color: #64748b;
      font-size: 1rem;
      font-weight: 600;
      margin-top: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Improved Scrollbar */
    .modal-body::-webkit-scrollbar {
      width: 6px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 3px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .admin-verify-container {
        padding-top: 80px;
      }
      
      .admin-title {
        font-size: 2.25rem !important;
      }
      
      .modal-dialog {
        max-width: 95% !important;
        margin: 0.5rem !important;
      }

      .modal-body {
        max-height: 70vh !important;
        padding: 1rem !important;
      }

      .verification-form {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }

      .property-image-grid {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
      }
    }
  `;

  if (loading) return (
    <>
      <div className="admin-verify-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading properties...</p>
        </div>
      </div>
      <style>{styles}</style>
    </>
  );

  if (error) return (
    <>
      <div className="admin-verify-container">
        <Container>
          <Alert variant="danger" className="enhanced-alert">
            <strong>⚠️ Error:</strong> {error}
          </Alert>
        </Container>
      </div>
      <style>{styles}</style>
    </>
  );

  return (
    <>
      <div className="admin-verify-container">
        <Container className="py-4">
          <h2 className="admin-title">🏛️ Property Verification Dashboard</h2>
          
          {properties.length === 0 ? (
            <div className="success-state">
              <h4>🎉 All Properties Verified!</h4>
              <p>No properties are currently pending verification. Great job keeping everything up to date!</p>
            </div>
          ) : (
            <Row>
              {properties.map(p => (
                <Col lg={4} md={6} key={p._id} className="mb-4">
                  <Card className="property-card">
                    <Card.Body className="property-card-body">
                      <h5>{p.title}</h5>
                      <p><strong>Owner:</strong> {p.ownerId?.name}</p>
                      <p><strong>Email:</strong> {p.ownerId?.email}</p>
                      <p><strong>Category:</strong> <span className="badge bg-info">{p.category}</span></p>
                      <p><strong>Price:</strong> <span className="text-success">₹{p.price?.toLocaleString()}</span></p>
                      <p><strong>Location:</strong> {p.address?.city}, {p.address?.state}</p>
                      <p><strong>Submitted:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
                      <Button className="review-btn" onClick={() => openModal(p)}>
                        🔍 Review & Verify
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          {/* Enhanced Verification Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>🔍 Property Verification Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selected && (
                <div>
                  {/* Status Badge and Title */}
                  <div className="d-flex align-items-center mb-4">
                    <span className="status-badge">
                      ⏳ Pending Verification
                    </span>
                    <h4 className="property-title ms-3">
                      {selected.title}
                    </h4>
                  </div>
                  
                  <Row>
                    <Col lg={8}>
                      {/* Property Details Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6>🏠 Property Details</h6>
                          <div className="mb-2"><strong>Description:</strong> {selected.description || 'Not provided'}</div>
                          <div className="mb-2"><strong>Category:</strong> <span className="badge bg-info">{selected.category}</span></div>
                          {selected.subtype && <div className="mb-2"><strong>Subtype:</strong> <span className="badge bg-secondary">{selected.subtype}</span></div>}
                          <div className="mb-2"><strong>Price:</strong> <span className="text-success">₹{selected.price?.toLocaleString()}</span></div>
                          <div className="mb-2"><strong>Size:</strong> {selected.size || 'Not specified'}</div>
                          <div className="mb-2"><strong>Rent Types:</strong> {selected.rentType?.join(', ') || 'Not specified'}</div>
                        </Card.Body>
                      </Card>

                      {/* Address Information Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6>📍 Address Information</h6>
                          <div className="mb-2"><strong>Street:</strong> {selected.address?.street || 'Not provided'}</div>
                          <div className="mb-2"><strong>City:</strong> {selected.address?.city || 'Not provided'}</div>
                          <div className="mb-2"><strong>State:</strong> {selected.address?.state || 'Not provided'}</div>
                          <div className="mb-2"><strong>PIN Code:</strong> {selected.address?.pincode || 'Not provided'}</div>
                          <div className="mb-2"><strong>Contact:</strong> <span className="text-primary">{selected.contact || 'Not provided'}</span></div>
                        </Card.Body>
                      </Card>

                      {/* Owner Information Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6>👤 Owner Information</h6>
                          <div className="mb-2"><strong>Name:</strong> {selected.ownerId?.name || 'Not provided'}</div>
                          <div className="mb-2"><strong>Email:</strong> <span className="text-primary">{selected.ownerId?.email || 'Not provided'}</span></div>
                        </Card.Body>
                      </Card>

                      {/* FIXED: Verification Decision Section with Equal Label Sizes */}
                      <div className="verification-section">
                        <h5>⚖️ Verification Decision</h5>
                        <div className="verification-form">
                          <div className="form-group">
                            <Form.Label>Decision Status</Form.Label>
                            <Form.Select value={verifyStatus} onChange={e => setVerifyStatus(e.target.value)}>
                              <option value="verified">✅ Approve - Verified</option>
                              <option value="rejected">❌ Reject - Declined</option>
                            </Form.Select>
                          </div>
                          <div className="form-group">
                            <Form.Label>Admin Notes (Optional)</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              rows={3} 
                              value={verifyNote} 
                              onChange={e => setVerifyNote(e.target.value)} 
                              placeholder="Add detailed feedback for the property owner..."
                            />
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4}>
                      {/* Property Images Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6>🖼️ Property Images</h6>
                          {selected.images && selected.images.length > 0 ? (
                            <div className="property-image-grid">
                              {selected.images.map((img, idx) => (
                                <div key={idx} className="property-image-container" onClick={() => openFullscreen(img, 'image', `Property Image ${idx + 1}`)}>
                                  <img src={img} alt={`Property ${idx + 1}`} className="property-image" />
                                  <div className="property-image-overlay">View</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-documents">📷 No images uploaded</div>
                          )}
                        </Card.Body>
                      </Card>

                      {/* Proof Documents Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6>📄 Verification Documents</h6>
                          
                          {/* Owner Proof */}
                          <div className="mb-3">
                            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b' }}>👤 Owner Proof:</strong>
                            {selected.ownerProof ? (
                              <div className="document-preview">
                                {selected.ownerProof.includes('pdf') ? (
                                  <iframe src={selected.ownerProof} title="Owner Proof PDF" />
                                ) : (
                                  <img src={selected.ownerProof} alt="Owner Proof" onClick={() => openFullscreen(selected.ownerProof, 'image', 'Owner Proof')} />
                                )}
                                <Button 
                                  className="view-fullscreen-btn"
                                  onClick={() => openFullscreen(selected.ownerProof, selected.ownerProof.includes('pdf') ? 'pdf' : 'image', 'Owner Proof')}
                                >
                                  🔍 View Fullscreen
                                </Button>
                              </div>
                            ) : (
                              <div className="no-documents">❌ No owner proof uploaded</div>
                            )}
                          </div>

                          {/* Property Proof */}
                          <div>
                            <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b' }}>🏠 Property Proof:</strong>
                            {selected.propertyProof ? (
                              <div className="document-preview">
                                {selected.propertyProof.includes('pdf') ? (
                                  <iframe src={selected.propertyProof} title="Property Proof PDF" />
                                ) : (
                                  <img src={selected.propertyProof} alt="Property Proof" onClick={() => openFullscreen(selected.propertyProof, 'image', 'Property Proof')} />
                                )}
                                <Button 
                                  className="view-fullscreen-btn"
                                  onClick={() => openFullscreen(selected.propertyProof, selected.propertyProof.includes('pdf') ? 'pdf' : 'image', 'Property Proof')}
                                >
                                  🔍 View Fullscreen
                                </Button>
                              </div>
                            ) : (
                              <div className="no-documents">❌ No property proof uploaded</div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Modal.Body>
            
            {/* FIXED: Sticky Footer */}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleVerify} disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  '💾 Save Verification'
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Fullscreen Document Modal */}
          <Modal 
            show={fullscreenDoc.show} 
            onHide={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })} 
            size="xl" 
            className="modal-fullscreen"
            centered
          >
            <button
              className="fullscreen-close-btn"
              onClick={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
            >
              ✕
            </button>
            <div className="fullscreen-content">
              {fullscreenDoc.type === 'image' ? (
                <img 
                  src={fullscreenDoc.src} 
                  alt={fullscreenDoc.title}
                  className="fullscreen-image"
                />
              ) : (
                <iframe 
                  src={fullscreenDoc.src} 
                  title={fullscreenDoc.title}
                  style={{
                    width: '90vw',
                    height: '90vh',
                    border: 'none',
                    borderRadius: '8px',
                    background: '#fff'
                  }}
                />
              )}
            </div>
          </Modal>
        </Container>
      </div>

      <style>{styles}</style>
    </>
  );
};

export default AdminVerifyProperties;
