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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const auth = useAuth();

  // SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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

  if (loading) return (
    <>
      <div ref={containerRef} className="admin-container">
        {/* Background Animation */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
          <div className="particles">
            {[...Array(18)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.9}s`
                }}
              />
            ))}
          </div>
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

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

  if (error) return (
    <>
      <div ref={containerRef} className="admin-container">
        {/* Background Animation */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
        </div>

        <Container>
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        </Container>
      </div>
      {styles}
    </>
  );

  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      .admin-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
        position: relative;
        overflow-x: hidden;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        padding: 2rem 0;
      }

      /* BEAUTIFUL: Professional Background Animations */
      .background-animation {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      .gradient-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
          rgba(124, 58, 237, 0.04) 0%, 
          transparent 25%, 
          rgba(59, 130, 246, 0.03) 50%, 
          transparent 75%, 
          rgba(16, 185, 129, 0.04) 100%);
        animation: gradientShift 15s ease-in-out infinite;
      }

      .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124, 58, 237, 0.08) 1px, transparent 1px);
        background-size: 60px 60px;
        animation: gridMove 25s linear infinite;
      }

      .floating-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(30px);
        opacity: 0.6;
      }

      .orb-1 {
        width: 280px;
        height: 280px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%);
        top: 8%;
        left: 10%;
        animation: float1 12s ease-in-out infinite;
      }

      .orb-2 {
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
        top: 60%;
        right: 12%;
        animation: float2 15s ease-in-out infinite;
      }

      .orb-3 {
        width: 160px;
        height: 160px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
        bottom: 15%;
        left: 15%;
        animation: float3 18s ease-in-out infinite;
      }

      .orb-4 {
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.03) 40%, transparent 70%);
        top: 30%;
        left: 70%;
        animation: float4 20s ease-in-out infinite;
      }

      .mouse-follower {
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(15px);
        transition: transform 0.3s ease-out;
        pointer-events: none;
      }

      .particles {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .particle {
        position: absolute;
        border-radius: 50%;
        background: rgba(124, 58, 237, 0.4);
      }

      .particle-1 { 
        width: 4px; 
        height: 4px; 
        animation: particle1 20s linear infinite; 
      }
      .particle-2 { 
        width: 3px; 
        height: 3px; 
        background: rgba(59, 130, 246, 0.4);
        animation: particle2 25s linear infinite; 
      }
      .particle-3 { 
        width: 5px; 
        height: 5px; 
        background: rgba(16, 185, 129, 0.4);
        animation: particle3 22s linear infinite; 
      }
      .particle-4 { 
        width: 2px; 
        height: 2px; 
        background: rgba(245, 101, 101, 0.4);
        animation: particle4 18s linear infinite; 
      }

      .geometric-shapes {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .shape {
        position: absolute;
        opacity: 0.1;
      }

      .shape-1 {
        width: 50px;
        height: 50px;
        border: 2px solid #7c3aed;
        top: 20%;
        right: 20%;
        animation: rotate 30s linear infinite;
      }

      .shape-2 {
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 30px solid #3b82f6;
        top: 70%;
        left: 80%;
        animation: float1 25s ease-in-out infinite;
      }

      .shape-3 {
        width: 30px;
        height: 30px;
        background: #10b981;
        border-radius: 50%;
        bottom: 30%;
        right: 30%;
        animation: pulse 8s ease-in-out infinite;
      }

      /* Header Section */
      .header-section {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        position: relative;
        z-index: 10;
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

      /* Property Cards */
      .property-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: none;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        height: 100%;
        position: relative;
        z-index: 10;
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
        font-size: 0.9rem;
        color: #4a5568;
      }

      .property-info-item strong {
        color: #2d3748;
        font-weight: 600;
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

      /* Modal Styles */
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

      /* Detail Cards */
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

      /* Action Section */
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

      /* Form Controls */
      .form-input, .form-select {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px);
        border: 1.5px solid rgba(209, 213, 219, 0.6) !important;
        border-radius: 10px !important;
        padding: 12px 16px !important;
        color: #111827 !important;
        font-size: 0.9rem !important;
        transition: all 0.3s ease !important;
        font-family: 'Inter', sans-serif !important;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05) !important;
      }

      .form-input:focus, .form-select:focus {
        background: rgba(255, 255, 255, 0.95) !important;
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        transform: scale(1.01);
      }

      .form-label {
        color: #374151;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 6px;
        display: block;
      }

      /* Loading States */
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        gap: 1rem;
        position: relative;
        z-index: 10;
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
        color: #4a5568;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0;
      }

      .error-alert {
        background: rgba(254, 242, 242, 0.9) !important;
        border: 1px solid rgba(248, 113, 113, 0.3) !important;
        border-radius: 12px !important;
        padding: 1rem 1.5rem !important;
        color: #dc2626 !important;
        font-size: 0.95rem !important;
        position: relative;
        z-index: 10;
      }

      /* Status Badge */
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* BEAUTIFUL: Animation Keyframes */
      @keyframes gradientShift {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        25% { transform: translate(20px, -20px) rotate(90deg) scale(1.05); }
        50% { transform: translate(-15px, -30px) rotate(180deg) scale(0.95); }
        75% { transform: translate(-25px, 15px) rotate(270deg) scale(1.02); }
      }

      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        30% { transform: translate(-30px, -15px) rotate(108deg) scale(1.08); }
        70% { transform: translate(15px, -25px) rotate(252deg) scale(0.92); }
      }

      @keyframes float3 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        20% { transform: translate(15px, -12px) scale(1.06) rotate(72deg); }
        40% { transform: translate(-12px, -20px) scale(0.94) rotate(144deg); }
        60% { transform: translate(-20px, 8px) scale(1.03) rotate(216deg); }
        80% { transform: translate(12px, 16px) scale(0.97) rotate(288deg); }
      }

      @keyframes float4 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(12px, -15px) scale(1.1); }
        66% { transform: translate(-15px, 12px) scale(0.9); }
      }

      @keyframes particle1 {
        0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.8; }
        100% { transform: translateY(-10vh) translateX(80px) rotate(360deg); opacity: 0; }
      }

      @keyframes particle2 {
        0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-10vh) translateX(-60px) rotate(-360deg); opacity: 0; }
      }

      @keyframes particle3 {
        0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.7; }
        90% { opacity: 0.7; }
        100% { transform: translateY(-10vh) translateX(50px) rotate(180deg); opacity: 0; }
      }

      @keyframes particle4 {
        0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateY(-10vh) translateX(-30px) rotate(-180deg); opacity: 0; }
      }

      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(60px, 60px); }
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.1; }
        50% { transform: scale(1.2); opacity: 0.2; }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* RESPONSIVE: Mobile Optimizations */
      @media (max-width: 768px) {
        .orb-1 { width: 200px; height: 200px; }
        .orb-2 { width: 150px; height: 150px; }
        .orb-3 { width: 120px; height: 120px; }
        .orb-4 { width: 100px; height: 100px; }
        
        .page-title {
          font-size: 1.8rem;
        }
      }
    `}</style>
  );

  return (
    <>
      <div ref={containerRef} className="admin-container">
        {/* Beautiful Light Theme Background */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
          <div className="particles">
            {[...Array(18)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.9}s`
                }}
              />
            ))}
          </div>
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <Container>
          {/* Header Section */}
          <div className="header-section">
            <h2 className="page-title">Property Verification</h2>
            <p className="page-subtitle">Review and verify pending property submissions</p>
          </div>

          <Row>
            {properties.map(p => (
              <Col md={6} key={p._id} className="mb-4">
                <Card className="property-card">
                  <Card.Body>
                    <h5 className="property-title">{p.title}</h5>
                    <div className="property-info">
                      <div className="property-info-item">
                        <strong>Owner:</strong> {p.ownerId?.name} ({p.ownerId?.email})
                      </div>
                      <div className="property-info-item">
                        <strong>Category:</strong> {p.category}
                      </div>
                      <div className="property-info-item">
                        <strong>Address:</strong> {p.address.street}, {p.address.city}, {p.address.state} - {p.address.pincode}
                      </div>
                    </div>
                    <Button className="review-button" onClick={() => openModal(p)}>
                      Review & Verify
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="enhanced-modal">
            <Modal.Header closeButton>
              <Modal.Title>Verify Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selected && (
                <div>
                  {/* Status badge */}
                  <div className="d-flex align-items-center mb-3">
                    <span className="status-badge" style={{ backgroundColor: '#f59e0b', color: 'white' }}>
                      <i className="bi bi-hourglass-split me-1" /> Pending Verification
                    </span>
                    <h4 className="mb-0 ms-2" style={{ fontWeight: 700 }}>{selected.title}</h4>
                  </div>

                  <Row>
                    <Col md={7}>
                      <Card className="detail-card">
                        <Card.Body>
                          <h6><i className="bi bi-house-door me-2" />Property Details</h6>
                          <div className="detail-item"><strong>Description:</strong> <span className="detail-value">{selected.description}</span></div>
                          <div className="detail-item"><strong>Category:</strong> <span className="detail-value">{selected.category}</span></div>
                          {selected.subtype && <div className="detail-item"><strong>Subtype:</strong> <span className="detail-value">{selected.subtype}</span></div>}
                          <div className="detail-item"><strong>Price:</strong> <span className="price-highlight">₹{selected.price}</span></div>
                          <div className="detail-item"><strong>Size:</strong> <span className="detail-value">{selected.size}</span></div>
                          <div className="detail-item"><strong>Rent Types:</strong> <span className="detail-value">{selected.rentType && selected.rentType.join(', ')}</span></div>
                        </Card.Body>
                      </Card>

                      <Card className="detail-card">
                        <Card.Body>
                          <h6><i className="bi bi-geo-alt me-2" />Address</h6>
                          <div className="detail-item">{selected.address?.street}</div>
                          <div className="detail-item">{selected.address?.city}, {selected.address?.state} - {selected.address?.pincode}</div>
                          <div className="detail-item"><strong>Contact:</strong> <span className="detail-value">{selected.contact}</span></div>
                        </Card.Body>
                      </Card>

                      <Card className="detail-card">
                        <Card.Body>
                          <h6><i className="bi bi-person-circle me-2" />Owner Details</h6>
                          <div className="detail-item"><strong>Name:</strong> <span className="detail-value">{selected.ownerId?.name}</span></div>
                          <div className="detail-item"><strong>Email:</strong> <span className="detail-value">{selected.ownerId?.email}</span></div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={5}>
                      <Card className="detail-card">
                        <Card.Body>
                          <h6><i className="bi bi-images me-2" />Property Images</h6>
                          <Row className="g-2">
                            {selected.images && selected.images.map((img, idx) => (
                              <Col key={idx} xs={6} className="mb-2">
                                <div style={{ position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                  <img
                                    src={img}
                                    alt={`Property ${idx + 1}`}
                                    style={{ width: '100%', height: '90px', objectFit: 'cover', transition: 'transform 0.2s', border: '1px solid #eee', borderRadius: '8px' }}
                                    onClick={() => setFullscreenDoc({ show: true, src: img, type: 'image', title: `Property Image ${idx + 1}` })}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                  />
                                  <span style={{ position: 'absolute', bottom: 6, right: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 12, padding: '2px 8px', borderRadius: '12px' }}>View</span>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </Card.Body>
                      </Card>

                      <Card className="detail-card">
                        <Card.Body>
                          <h6><i className="bi bi-file-earmark-text me-2" />Proof Documents</h6>
                          <Row>
                            <Col xs={12} className="mb-3">
                              <strong>Owner Proof:</strong><br />
                              {selected.ownerProof && selected.ownerProof.startsWith('data:application/pdf') ? (
                                <>
                                  <iframe
                                    src={selected.ownerProof}
                                    title="Owner Proof PDF"
                                    style={{ width: '100%', height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
                                  />
                                  <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'pdf', title: 'Owner Proof' })}>
                                    View Fullscreen
                                  </Button>
                                </>
                              ) : selected.ownerProof ? (
                                <>
                                  <img src={selected.ownerProof} alt="Owner Proof" style={{ maxWidth: '100%', maxHeight: '100px', border: '1px solid #ccc', borderRadius: '6px' }} />
                                  <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'image', title: 'Owner Proof' })}>
                                    View Fullscreen
                                  </Button>
                                </>
                              ) : 'Not uploaded'}
                            </Col>
                            <Col xs={12}>
                              <strong>Property Proof:</strong><br />
                              {selected.propertyProof && selected.propertyProof.startsWith('data:application/pdf') ? (
                                <>
                                  <iframe
                                    src={selected.propertyProof}
                                    title="Property Proof PDF"
                                    style={{ width: '100%', height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
                                  />
                                  <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'pdf', title: 'Property Proof' })}>
                                    View Fullscreen
                                  </Button>
                                </>
                              ) : selected.propertyProof ? (
                                <>
                                  <img src={selected.propertyProof} alt="Property Proof" style={{ maxWidth: '100%', maxHeight: '100px', border: '1px solid #ccc', borderRadius: '6px' }} />
                                  <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'image', title: 'Property Proof' })}>
                                    View Fullscreen
                                  </Button>
                                </>
                              ) : 'Not uploaded'}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Fullscreen Modal for Document/Image Preview */}
                  <Modal
                    show={fullscreenDoc.show}
                    onHide={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
                    size={fullscreenDoc.type === 'image' ? undefined : 'xl'}
                    centered
                    contentClassName={fullscreenDoc.type === 'image' ? 'bg-dark p-0 border-0' : ''}
                    dialogClassName={fullscreenDoc.type === 'image' ? 'modal-fullscreen' : ''}
                    backdropClassName={fullscreenDoc.type === 'image' ? 'bg-dark' : ''}
                  >
                    {fullscreenDoc.type === 'image' ? (
                      <>
                        <Button
                          variant="light"
                          onClick={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
                          style={{
                            position: 'absolute',
                            top: 24,
                            right: 36,
                            zIndex: 1051,
                            fontSize: 32,
                            fontWeight: 700,
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            padding: '0 16px',
                            lineHeight: '40px',
                            background: '#fff',
                            border: 'none',
                            opacity: 0.95
                          }}
                          aria-label="Close"
                        >
                          &times;
                        </Button>
                        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.98)' }}>
                          <img
                            src={fullscreenDoc.src}
                            alt="Document Preview"
                            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <Modal.Header closeButton>
                          <Modal.Title>{fullscreenDoc.title} - Fullscreen Preview</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                          {fullscreenDoc.type === 'pdf' ? (
                            <iframe
                              src={fullscreenDoc.src}
                              title="PDF Preview"
                              style={{ width: '100%', height: '75vh', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}
                            />
                          ) : null}
                        </Modal.Body>
                      </>
                    )}
                  </Modal>

                  <div className="action-section">
                    <Form>
                      <Row className="align-items-end">
                        <Col md={5} className="mb-3">
                          <Form.Label className="form-label">Status</Form.Label>
                          <Form.Select value={verifyStatus} onChange={e => setVerifyStatus(e.target.value)} className="form-select" size="lg">
                            <option value="verified">Verified ✅</option>
                            <option value="rejected">Rejected ❌</option>
                          </Form.Select>
                        </Col>
                        <Col md={5} className="mb-3">
                          <Form.Label className="form-label">Note (optional)</Form.Label>
                          <Form.Control as="textarea" rows={2} value={verifyNote} onChange={e => setVerifyNote(e.target.value)} className="form-input" size="lg" placeholder="Add a note for the owner..." />
                        </Col>
                        <Col md={2} className="mb-3 d-grid">
                          <Button className="action-button" onClick={handleVerify} disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save'}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer style={{ background: '#f8fafc' }}>
              <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '10px' }}>Close</Button>
              <Button className="action-button" onClick={handleVerify} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
      {styles}
    </>
  );
};

export default AdminVerifyProperties;
