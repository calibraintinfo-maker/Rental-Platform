import React, { useEffect, useState, useContext, useRef } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
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

  const openFullscreen = (src, type, title) => {
    setFullscreenDoc({ show: true, src, type, title });
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    
    /* Main Container */
    .admin-verify-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 100%);
      position: relative;
      overflow-x: hidden;
      font-family: 'Inter', sans-serif;
      padding: 2rem 0;
      padding-top: 120px;
    }

    /* Animated Background */
    .background-effects {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
      filter: blur(60px);
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: -10%;
      animation: float-1 20s ease-in-out infinite;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: -5%;
      animation: float-2 25s ease-in-out infinite;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 20%;
      animation: float-3 30s ease-in-out infinite;
    }

    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      animation: grid-move 40s linear infinite;
    }

    .mouse-glow {
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(30px);
      transition: transform 0.5s ease-out;
      pointer-events: none;
    }

    @keyframes float-1 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(50px, -30px) rotate(120deg); }
      66% { transform: translate(-30px, 40px) rotate(240deg); }
    }

    @keyframes float-2 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-40px, -50px) rotate(180deg); }
    }

    @keyframes float-3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.1); }
      66% { transform: translate(-20px, 30px) scale(0.9); }
    }

    @keyframes grid-move {
      0% { transform: translate(0, 0); }
      100% { transform: translate(80px, 80px); }
    }

    /* Loading Animation */
    .loading-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 1000;
    }

    .modern-spinner {
      width: 60px;
      height: 60px;
      border: 3px solid rgba(99, 102, 241, 0.1);
      border-top: 3px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .loading-text {
      color: #e2e8f0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Main Content */
    .content-container {
      position: relative;
      z-index: 10;
    }

    /* Header */
    .admin-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .admin-title {
      font-size: 3.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .admin-subtitle {
      color: #94a3b8;
      font-size: 1.2rem;
      font-weight: 400;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Enhanced Alert */
    .modern-alert {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      color: #fca5a5;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }

    /* Property Cards */
    .property-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 0;
      margin-bottom: 2rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      position: relative;
      height: 100%;
    }

    .property-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .property-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
    }

    .property-card:hover::before {
      opacity: 1;
    }

    .property-card-body {
      padding: 2rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .property-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 1rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .property-info {
      color: #cbd5e1;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .property-info strong {
      color: #e2e8f0;
      font-weight: 600;
    }

    .property-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .review-btn {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      border-radius: 12px;
      padding: 0.875rem 1.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      color: white;
      transition: all 0.3s ease;
      margin-top: auto;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
    }

    .review-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
      background: linear-gradient(135deg, #5b61f0 0%, #7c3aed 100%);
      color: white;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #94a3b8;
    }

    .empty-state h4 {
      color: #e2e8f0;
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .empty-state p {
      font-size: 1.1rem;
      opacity: 0.8;
    }

    /* Modal Styles */
    .modal {
      z-index: 9999;
    }

    .modal-backdrop {
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
    }

    .modal-dialog {
      max-width: 1400px;
      margin: 1rem auto;
    }

    .modal-content {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 24px;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }

    .modal-header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      padding: 2rem;
      position: relative;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-header .btn-close {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .modal-header .btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .modal-body {
      padding: 2rem;
      background: rgba(15, 23, 42, 0.8);
      max-height: 75vh;
      overflow-y: auto;
      padding-bottom: 140px;
    }

    .modal-body::-webkit-scrollbar {
      width: 8px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.5);
      border-radius: 4px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.7);
    }

    /* Status Badge */
    .status-badge {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.2);
      padding: 0.75rem 1.5rem;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .property-main-title {
      color: #f8fafc;
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0;
    }

    /* Modal Cards */
    .modal-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .modal-card:hover {
      border-color: rgba(99, 102, 241, 0.3);
      transform: translateY(-2px);
    }

    .modal-card-body {
      padding: 1.5rem;
    }

    .modal-card-title {
      color: #6366f1;
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-info {
      color: #cbd5e1;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }

    .modal-info strong {
      color: #e2e8f0;
      font-weight: 600;
    }

    /* Image Gallery */
    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .gallery-image {
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .gallery-image:hover {
      transform: scale(1.05);
    }

    .gallery-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }

    .gallery-image:hover img {
      transform: scale(1.1);
    }

    .gallery-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      padding: 0.5rem;
      font-size: 0.75rem;
      color: white;
      font-weight: 500;
    }

    /* Document Viewer */
    .doc-preview {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .doc-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      margin-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .doc-item:hover {
      background: rgba(99, 102, 241, 0.1);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .doc-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .doc-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .doc-details h6 {
      color: #e2e8f0;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
    }

    .doc-details span {
      color: #94a3b8;
      font-size: 0.85rem;
    }

    .doc-view-btn {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .doc-view-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
      color: white;
    }

    .no-doc {
      color: #64748b;
      font-style: italic;
      padding: 1rem;
      text-align: center;
      background: rgba(100, 116, 139, 0.1);
      border-radius: 8px;
    }

    /* Verification Decision Section */
    .verification-section {
      background: rgba(99, 102, 241, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 16px;
      padding: 2rem;
      margin-top: 2rem;
    }

    .verification-title {
      color: #e2e8f0;
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .verification-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: end;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      color: #cbd5e1;
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .form-control, .form-select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      color: #e2e8f0;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
      background: rgba(255, 255, 255, 0.08);
      border-color: #6366f1;
      box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.25);
      color: #e2e8f0;
    }

    .form-control::placeholder {
      color: #64748b;
    }

    .save-decision-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      border-radius: 12px;
      padding: 1rem 2rem;
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-self: start;
    }

    .save-decision-btn:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
      color: white;
    }

    .save-decision-btn:disabled {
      opacity: 0.6;
      transform: none;
      box-shadow: none;
    }

    /* Fixed Footer */
    .modal-footer {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 11000;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 16px;
      padding: 1rem 2rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-footer-btn {
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      border: none;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cancel-btn {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .cancel-btn:hover {
      background: #ef4444;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }

    .verify-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .verify-btn:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
      color: white;
    }

    .verify-btn:disabled {
      opacity: 0.6;
      transform: none;
      box-shadow: none;
    }

    /* Fullscreen Modal */
    .fullscreen-modal .modal-dialog {
      max-width: 95vw;
      height: 95vh;
      margin: 2.5vh auto;
    }

    .fullscreen-modal .modal-content {
      height: 100%;
      background: rgba(15, 23, 42, 0.98);
    }

    .fullscreen-modal .modal-body {
      padding: 0;
      height: calc(100% - 80px);
      max-height: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fullscreen-modal iframe,
    .fullscreen-modal img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
    }

    .fullscreen-close {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1051;
      width: 50px;
      height: 50px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      color: white;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .fullscreen-close:hover {
      background: rgba(99, 102, 241, 0.2);
      transform: scale(1.1);
      color: white;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .admin-title {
        font-size: 2.5rem;
      }
      
      .verification-form {
        grid-template-columns: 1fr;
      }
      
      .modal-footer {
        left: 1rem;
        right: 1rem;
        transform: none;
        width: auto;
      }
    }
  `;

  if (loading) {
    return (
      <div className="admin-verify-container" ref={containerRef}>
        <div className="background-effects">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="grid-overlay"></div>
          <div 
            className="mouse-glow"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
        </div>
        <div className="loading-container">
          <div className="modern-spinner"></div>
          <div className="loading-text">Loading pending properties...</div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-verify-container" ref={containerRef}>
        <div className="background-effects">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="grid-overlay"></div>
          <div 
            className="mouse-glow"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
        </div>
        <Container className="content-container">
          <Alert className="modern-alert">
            <strong>⚠️ Error:</strong> {error}
          </Alert>
        </Container>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="admin-verify-container" ref={containerRef}>
      {/* Background Effects */}
      <div className="background-effects">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="grid-overlay"></div>
        <div 
          className="mouse-glow"
          style={{
            transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
          }}
        ></div>
      </div>

      <Container className="content-container">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">⚖️ Property Verification</h1>
          <p className="admin-subtitle">
            Review and verify property submissions to ensure quality and authenticity
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="empty-state">
            <h4>🎉 All Caught Up!</h4>
            <p>No properties pending verification at the moment.</p>
          </div>
        ) : (
          <Row>
            {properties.map((property) => (
              <Col lg={4} md={6} key={property._id}>
                <div className="property-card">
                  <div className="property-card-body">
                    <div className="property-status">
                      ⏳ Pending Review
                    </div>
                    <h5 className="property-title">{property.title}</h5>
                    <div className="property-info">
                      <strong>Type:</strong> {property.category || 'Not specified'}
                    </div>
                    <div className="property-info">
                      <strong>Price:</strong> ₹{property.price?.toLocaleString()}/month
                    </div>
                    <div className="property-info">
                      <strong>Location:</strong> {property.address?.city || property.location || 'Not provided'}
                    </div>
                    <div className="property-info">
                      <strong>Owner:</strong> {property.ownerId?.name || 'Not provided'}
                    </div>
                    <div className="property-info">
                      <strong>Submitted:</strong> {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                    <button 
                      className="review-btn"
                      onClick={() => openModal(property)}
                    >
                      🔍 Review & Verify
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Verification Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" className="verification-modal">
          <Modal.Header closeButton>
            <Modal.Title>🔍 Property Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selected && (
              <>
                {/* Header Section */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <div className="status-badge mb-2">
                      ⏳ Pending Verification
                    </div>
                    <h3 className="property-main-title">{selected.title}</h3>
                  </div>
                </div>

                <Row>
                  <Col lg={8}>
                    {/* Property Details */}
                    <div className="modal-card">
                      <div className="modal-card-body">
                        <h6 className="modal-card-title">🏠 Property Details</h6>
                        <div className="modal-info">
                          <strong>Description:</strong> {selected.description || 'No description provided'}
                        </div>
                        <div className="modal-info">
                          <strong>Category:</strong> {selected.category || 'Not specified'}
                        </div>
                        {selected.subtype && (
                          <div className="modal-info">
                            <strong>Subtype:</strong> {selected.subtype}
                          </div>
                        )}
                        <div className="modal-info">
                          <strong>Price:</strong> <span style={{color: '#10b981', fontWeight: 'bold'}}>₹{selected.price?.toLocaleString()}</span>
                        </div>
                        <div className="modal-info">
                          <strong>Size:</strong> {selected.size || 'Not provided'}
                        </div>
                        <div className="modal-info">
                          <strong>Rent Types:</strong> {selected.rentType?.join(', ') || selected.rentTypes || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="modal-card">
                      <div className="modal-card-body">
                        <h6 className="modal-card-title">📍 Address Information</h6>
                        <div className="modal-info">
                          <strong>Street:</strong> {selected.address?.street || 'Not provided'}
                        </div>
                        <div className="modal-info">
                          <strong>City:</strong> {selected.address?.city || 'Not provided'}
                        </div>
                        <div className="modal-info">
                          <strong>State:</strong> {selected.address?.state || 'Not provided'}
                        </div>
                        <div className="modal-info">
                          <strong>Pincode:</strong> {selected.address?.pincode || 'Not provided'}
                        </div>
                        <div className="modal-info">
                          <strong>Contact:</strong> {selected.contact || 'Not provided'}
                        </div>
                      </div>
                    </div>

                    {/* Owner Details */}
                    <div className="modal-card">
                      <div className="modal-card-body">
                        <h6 className="modal-card-title">👤 Owner Details</h6>
                        <div className="modal-info">
                          <strong>Name:</strong> {selected.ownerId?.name || 'Not provided'}
                        </div>
                        <div className="modal-info">
                          <strong>Email:</strong> {selected.ownerId?.email || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={4}>
                    {/* Property Images */}
                    <div className="modal-card">
                      <div className="modal-card-body">
                        <h6 className="modal-card-title">🖼️ Property Images</h6>
                        {selected.images && selected.images.length > 0 ? (
                          <div className="image-gallery">
                            {selected.images.map((image, idx) => (
                              <div key={idx} className="gallery-image" onClick={() => openFullscreen(image, 'image', `Property Image ${idx + 1}`)}>
                                <img src={image} alt={`Property ${idx + 1}`} />
                                <div className="gallery-overlay">View</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-doc">📷 No images uploaded</div>
                        )}
                      </div>
                    </div>

                    {/* Proof Documents */}
                    <div className="modal-card">
                      <div className="modal-card-body">
                        <h6 className="modal-card-title">📄 Proof Documents</h6>
                        
                        {/* Owner Proof */}
                        <div className="mb-3">
                          <strong style={{color: '#cbd5e1', display: 'block', marginBottom: '0.75rem'}}>👤 Owner Proof:</strong>
                          {selected.ownerProof ? (
                            <div className="doc-preview">
                              <div className="doc-item">
                                <div className="doc-info">
                                  <div className="doc-icon">📄</div>
                                  <div className="doc-details">
                                    <h6>Owner Identity Document</h6>
                                    <span>Verification document</span>
                                  </div>
                                </div>
                                <button 
                                  className="doc-view-btn"
                                  onClick={() => openFullscreen(selected.ownerProof, selected.ownerProof.includes('pdf') ? 'pdf' : 'image', 'Owner Proof')}
                                >
                                  👁️ View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="no-doc">📄 No owner proof uploaded</div>
                          )}
                        </div>

                        {/* Property Proof */}
                        <div>
                          <strong style={{color: '#cbd5e1', display: 'block', marginBottom: '0.75rem'}}>🏠 Property Proof:</strong>
                          {selected.propertyProof ? (
                            <div className="doc-preview">
                              <div className="doc-item">
                                <div className="doc-info">
                                  <div className="doc-icon">🏠</div>
                                  <div className="doc-details">
                                    <h6>Property Document</h6>
                                    <span>Ownership/rental document</span>
                                  </div>
                                </div>
                                <button 
                                  className="doc-view-btn"
                                  onClick={() => openFullscreen(selected.propertyProof, selected.propertyProof.includes('pdf') ? 'pdf' : 'image', 'Property Proof')}
                                >
                                  👁️ View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="no-doc">🏠 No property proof uploaded</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Verification Decision Section */}
                <div className="verification-section">
                  <h5 className="verification-title">⚖️ Verification Decision</h5>
                  <div className="verification-form">
                    <div className="form-group">
                      <label className="form-label">Status Decision</label>
                      <select 
                        className="form-select" 
                        value={verifyStatus} 
                        onChange={e => setVerifyStatus(e.target.value)}
                      >
                        <option value="verified">✅ Approved - Verified</option>
                        <option value="rejected">❌ Rejected - Declined</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Admin Notes (Optional)</label>
                      <textarea 
                        className="form-control" 
                        rows={3} 
                        value={verifyNote} 
                        onChange={e => setVerifyNote(e.target.value)} 
                        placeholder="Add detailed notes for the property owner..."
                      />
                    </div>
                    <div className="form-group">
                      <button 
                        className="save-decision-btn"
                        onClick={handleVerify} 
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Spinner size="sm" />
                            Processing...
                          </>
                        ) : (
                          <>💾 Save Decision</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="modal-footer">
            <button 
              className="modal-footer-btn cancel-btn"
              onClick={() => setShowModal(false)}
            >
              ❌ Cancel
            </button>
            <button 
              className="modal-footer-btn verify-btn"
              onClick={handleVerify} 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" />
                  Processing...
                </>
              ) : (
                <>💾 Save Verification</>
              )}
            </button>
          </Modal.Footer>
        </Modal>

        {/* Fullscreen Document Modal */}
        <Modal 
          show={fullscreenDoc.show} 
          onHide={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })} 
          size="xl" 
          className="fullscreen-modal"
          centered
        >
          <button
            className="fullscreen-close"
            onClick={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
          >
            ✕
          </button>
          <Modal.Body>
            {fullscreenDoc.type === 'image' ? (
              <img src={fullscreenDoc.src} alt={fullscreenDoc.title} />
            ) : (
              <iframe src={fullscreenDoc.src} title={fullscreenDoc.title} />
            )}
          </Modal.Body>
        </Modal>

        <style>{styles}</style>
      </Container>
    </div>
  );
};

export default AdminVerifyProperties;
