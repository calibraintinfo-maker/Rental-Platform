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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    .admin-verify-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
      position: relative;
      overflow-x: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 2rem 0;
      padding-top: 100px;
    }

    /* Enhanced Background Animations */
    .background-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }

    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, 
        rgba(102, 126, 234, 0.08) 0%, 
        transparent 25%, 
        rgba(118, 75, 162, 0.06) 50%, 
        transparent 75%, 
        rgba(245, 87, 108, 0.07) 100%);
      animation: gradientShift 20s ease-in-out infinite;
    }

    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 40px 40px;
      animation: gridMove 30s linear infinite;
    }

    .floating-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.7;
    }

    .orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, rgba(102, 126, 234, 0.05) 40%, transparent 70%);
      top: 10%;
      left: 5%;
      animation: float1 15s ease-in-out infinite;
    }

    .orb-2 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(245, 87, 108, 0.2) 0%, rgba(245, 87, 108, 0.05) 40%, transparent 70%);
      top: 60%;
      right: 8%;
      animation: float2 18s ease-in-out infinite;
    }

    .orb-3 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(79, 172, 254, 0.18) 0%, rgba(79, 172, 254, 0.04) 40%, transparent 70%);
      bottom: 20%;
      left: 20%;
      animation: float3 22s ease-in-out infinite;
    }

    .orb-4 {
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.15) 0%, rgba(240, 147, 251, 0.04) 40%, transparent 70%);
      top: 25%;
      left: 75%;
      animation: float4 25s ease-in-out infinite;
    }

    .mouse-follower {
      position: absolute;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(20px);
      transition: transform 0.4s ease-out;
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
      background: rgba(255, 255, 255, 0.6);
    }

    .particle-1 { 
      width: 3px; 
      height: 3px; 
      animation: particle1 25s linear infinite; 
    }
    .particle-2 { 
      width: 4px; 
      height: 4px; 
      background: rgba(102, 126, 234, 0.5);
      animation: particle2 30s linear infinite; 
    }
    .particle-3 { 
      width: 2px; 
      height: 2px; 
      background: rgba(245, 87, 108, 0.5);
      animation: particle3 28s linear infinite; 
    }
    .particle-4 { 
      width: 5px; 
      height: 5px; 
      background: rgba(79, 172, 254, 0.4);
      animation: particle4 22s linear infinite; 
    }

    /* Enhanced Alert */
    .enhanced-alert {
      background: rgba(254, 242, 242, 0.95) !important;
      border: 1px solid rgba(248, 113, 113, 0.3) !important;
      border-radius: 20px !important;
      padding: 2rem !important;
      color: #dc2626 !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      position: relative;
      z-index: 100;
      backdrop-filter: blur(15px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }

    /* Container Styles */
    .container {
      position: relative;
      z-index: 50;
    }

    /* Enhanced Header Title */
    .admin-title {
      font-size: 3.5rem !important;
      font-weight: 900 !important;
      color: #ffffff !important;
      margin-bottom: 3rem !important;
      text-align: center !important;
      position: relative;
      z-index: 10;
      text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }

    /* Enhanced Property Cards */
    .property-card {
      background: rgba(255, 255, 255, 0.98) !important;
      backdrop-filter: blur(25px) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 25px !important;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
      position: relative;
      z-index: 10;
      display: flex !important;
      flex-direction: column !important;
    }

    .property-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe);
      border-radius: 25px 25px 0 0;
    }

    .property-card:hover {
      transform: translateY(-12px) scale(1.03) !important;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2) !important;
      border: 1px solid rgba(102, 126, 234, 0.3) !important;
    }

    .property-card-body {
      padding: 2rem !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
    }

    .property-card h5 {
      font-size: 1.4rem !important;
      font-weight: 700 !important;
      color: #1a202c !important;
      margin-bottom: 1.2rem !important;
      line-height: 1.3 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }

    .property-card p {
      font-size: 0.95rem !important;
      color: #4a5568 !important;
      margin-bottom: 0.8rem !important;
      line-height: 1.5 !important;
    }

    .property-card p strong {
      color: #2d3748 !important;
      font-weight: 600 !important;
    }

    /* Enhanced Review Button */
    .review-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      border-radius: 15px !important;
      padding: 0.9rem 1.8rem !important;
      font-weight: 700 !important;
      font-size: 0.95rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      transition: all 0.4s ease !important;
      width: 100% !important;
      color: white !important;
      margin-top: auto !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
    }

    .review-btn:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4) !important;
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
      color: white !important;
    }

    /* Professional Modal */
    .modal {
      z-index: 9999 !important;
    }

    .modal-backdrop {
      z-index: 9998 !important;
      background-color: rgba(0, 0, 0, 0.8) !important;
      backdrop-filter: blur(5px) !important;
    }

    .modal-dialog {
      max-width: 1200px !important;
      margin: 1rem auto !important;
    }

    .modal-content {
      border: none !important;
      border-radius: 25px !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3) !important;
      overflow: hidden !important;
      backdrop-filter: blur(20px) !important;
      z-index: 10000 !important;
      position: relative;
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none !important;
      padding: 1.8rem 2rem !important;
      position: relative;
      z-index: 10001;
    }

    .modal-title {
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      margin: 0 !important;
      text-align: left !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.7rem !important;
    }

    /* Enhanced Close Button */
    .btn-close {
      filter: brightness(0) invert(1) !important;
      opacity: 1 !important;
      font-size: 1.5rem !important;
      width: 40px !important;
      height: 40px !important;
      background: rgba(255, 255, 255, 0.2) !important;
      border-radius: 50% !important;
      backdrop-filter: blur(10px) !important;
      border: 2px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.1) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
    }

    .modal-body {
      padding: 1.5rem !important;
      background: #ffffff !important;
      max-height: 70vh !important;
      overflow-y: auto !important;
    }

    /* Fixed Footer */
    .modal-footer {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
      border: none !important;
      padding: 1.5rem 2rem !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 1rem !important;
      border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
      position: sticky !important;
      bottom: 0 !important;
      z-index: 1000 !important;
    }

    /* Compact Modal Content */
    .modal .info-card {
      margin-bottom: 1.2rem !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06) !important;
      border-radius: 15px !important;
      border: 1px solid rgba(0, 0, 0, 0.05) !important;
      background: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(10px) !important;
    }

    .modal .info-card-body {
      padding: 1.3rem !important;
    }

    .modal .info-card h6 {
      font-size: 1.1rem !important;
      margin-bottom: 0.8rem !important;
      font-weight: 700 !important;
      color: #1f2937 !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      padding-bottom: 0.6rem !important;
      border-bottom: 2px solid rgba(102, 126, 234, 0.1) !important;
    }

    .modal .info-card .badge {
      font-size: 0.8rem !important;
      padding: 0.4rem 0.8rem !important;
      border-radius: 10px !important;
      font-weight: 600 !important;
      letter-spacing: 0.3px !important;
    }

    .modal .info-card p, .modal .info-card div {
      font-size: 0.9rem !important;
      line-height: 1.4 !important;
      margin-bottom: 0.6rem !important;
      color: #374151 !important;
    }

    .modal .info-card strong {
      font-weight: 600 !important;
      color: #1f2937 !important;
    }

    /* Compact Image Gallery */
    .property-image-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
      gap: 0.8rem !important;
    }

    .property-image-container {
      position: relative !important;
      cursor: pointer !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.3s ease !important;
      aspect-ratio: 16/9 !important;
    }

    .property-image-container:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
    }

    .property-image {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      transition: transform 0.3s ease !important;
    }

    .property-image-overlay {
      position: absolute !important;
      bottom: 0 !important;
      right: 0 !important;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)) !important;
      color: white !important;
      padding: 0.4rem 0.8rem !important;
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      border-top-left-radius: 8px !important;
      backdrop-filter: blur(10px) !important;
    }

    /* Repositioned Verification Section - Now below Owner Information */
    .verification-section {
      padding: 1.5rem !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border-radius: 15px !important;
      margin: 1.5rem 0 !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
    }

    .verification-section h5 {
      color: white !important;
      font-weight: 700 !important;
      margin-bottom: 1.2rem !important;
      font-size: 1.2rem !important;
      text-align: center !important;
      padding-bottom: 0.8rem !important;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2) !important;
    }

    .verification-form {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 1.5rem !important;
      align-items: end !important;
    }

    .view-fullscreen-btn {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
      border: none !important;
      border-radius: 10px !important;
      padding: 0.6rem 1rem !important;
      font-weight: 600 !important;
      font-size: 0.85rem !important;
      color: white !important;
      transition: all 0.3s ease !important;
      width: 100% !important;
      margin-top: 0.8rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.3px !important;
      box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3) !important;
    }

    .view-fullscreen-btn:hover {
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4) !important;
      color: white !important;
    }

    /* Compact Document Preview */
    .document-preview {
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      background: #fff !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06) !important;
      position: relative !important;
    }

    .document-preview iframe {
      width: 100% !important;
      height: 200px !important;
      border: none !important;
      background: #ffffff !important;
      overflow: auto !important;
    }

    .document-preview img {
      width: 100% !important;
      height: 200px !important;
      object-fit: contain !important;
      background: #f8fafc !important;
      cursor: zoom-in !important;
    }

    /* Enhanced Fullscreen Modal */
    .modal-fullscreen {
      z-index: 10050 !important;
    }

    .modal-fullscreen .modal-content {
      z-index: 10051 !important;
      background: rgba(0, 0, 0, 0.95) !important;
      border-radius: 0 !important;
      height: 100vh !important;
      max-height: 100vh !important;
    }

    .fullscreen-close-btn {
      position: fixed !important;
      top: 30px !important;
      right: 30px !important;
      z-index: 10052 !important;
      width: 55px !important;
      height: 55px !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.9) !important;
      border: 3px solid rgba(102, 126, 234, 0.8) !important;
      color: #667eea !important;
      font-size: 22px !important;
      font-weight: 700 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
      backdrop-filter: blur(10px) !important;
    }

    .fullscreen-close-btn:hover {
      background: rgba(102, 126, 234, 0.9) !important;
      color: white !important;
      transform: scale(1.1) rotate(90deg) !important;
      box-shadow: 0 6px 30px rgba(102, 126, 234, 0.4) !important;
    }

    .fullscreen-content {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 100vh !important;
      padding: 2rem !important;
      position: relative !important;
    }

    .fullscreen-image {
      max-width: 90vw !important;
      max-height: 90vh !important;
      border-radius: 15px !important;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6) !important;
      object-fit: contain !important;
    }

    /* Enhanced Form Controls */
    .form-control, .form-select {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(10px) !important;
      border: 2px solid rgba(102, 126, 234, 0.2) !important;
      border-radius: 12px !important;
      padding: 12px 16px !important;
      color: #fff !important;
      font-size: 0.9rem !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    .form-control:focus, .form-select:focus {
      background: rgba(255, 255, 255, 1) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3) !important;
      transform: scale(1.02) !important;
      color: #1f2937 !important;
    }

    .form-label {
      color: white !important;
      font-size: 0.95rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.7rem !important;
      display: block !important;
    }

    /* Enhanced Buttons */
    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      padding: 0.8rem 1.5rem !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
      color: white !important;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      padding: 0.8rem 1.5rem !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3) !important;
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(245, 87, 108, 0.4) !important;
      color: white !important;
    }

    /* Enhanced Badge Styling */
    .badge {
      padding: 0.6rem 1.2rem !important;
      font-size: 0.85rem !important;
      border-radius: 15px !important;
      font-weight: 600 !important;
      letter-spacing: 0.3px !important;
      text-transform: uppercase !important;
    }

    /* Improved scrollbar */
    .modal-body::-webkit-scrollbar {
      width: 8px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    }

    .text-primary {
      color: #667eea !important;
    }

    .text-success {
      color: #10b981 !important;
      font-weight: 700 !important;
    }

    .no-documents {
      padding: 1.5rem;
      text-align: center;
      background: rgba(248, 250, 252, 0.8);
      border-radius: 12px;
      color: #64748b;
      font-style: italic;
      font-size: 0.9rem;
    }

    /* Animation Keyframes */
    @keyframes gradientShift {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      25% { transform: translate(25px, -25px) rotate(90deg) scale(1.1); }
      50% { transform: translate(-20px, -40px) rotate(180deg) scale(0.9); }
      75% { transform: translate(-30px, 20px) rotate(270deg) scale(1.05); }
    }

    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      30% { transform: translate(-35px, -20px) rotate(108deg) scale(1.15); }
      70% { transform: translate(20px, -30px) rotate(252deg) scale(0.85); }
    }

    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
      20% { transform: translate(18px, -15px) scale(1.08) rotate(72deg); }
      40% { transform: translate(-15px, -25px) scale(0.92) rotate(144deg); }
      60% { transform: translate(-25px, 10px) scale(1.06) rotate(216deg); }
      80% { transform: translate(15px, 20px) scale(0.94) rotate(288deg); }
    }

    @keyframes float4 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(15px, -20px) scale(1.12); }
      66% { transform: translate(-20px, 15px) scale(0.88); }
    }

    @keyframes particle1 {
      0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-10vh) translateX(100px) rotate(360deg); opacity: 0; }
    }

    @keyframes particle2 {
      0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateY(-10vh) translateX(-80px) rotate(-360deg); opacity: 0; }
    }

    @keyframes particle3 {
      0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
      10% { opacity: 0.9; }
      90% { opacity: 0.9; }
      100% { transform: translateY(-10vh) translateX(60px) rotate(180deg); opacity: 0; }
    }

    @keyframes particle4 {
      0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
      10% { opacity: 0.7; }
      90% { opacity: 0.7; }
      100% { transform: translateY(-10vh) translateX(-40px) rotate(-180deg); opacity: 0; }
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(40px, 40px); }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .admin-verify-container {
        padding-top: 80px;
      }
      
      .admin-title {
        font-size: 2.5rem !important;
      }
      
      .modal-dialog {
        max-width: 95% !important;
        margin: 0.5rem !important;
      }

      .modal-body {
        max-height: 75vh !important;
        padding: 1.2rem !important;
      }

      .verification-form {
        grid-template-columns: 1fr !important;
        gap: 1.2rem !important;
      }

      .property-image-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
      }
    }
  `;

  if (loading) return (
    <>
      <div ref={containerRef} className="admin-verify-container">
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{ transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)` }}
          ></div>
          <div className="particles">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1.2}s`
                }}
              />
            ))}
          </div>
        </div>
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 100,
        }}>
          <Spinner animation="border" style={{
            width: '3.5rem',
            height: '3.5rem',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderTop: '5px solid #ffffff',
          }} />
          <p style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 700, marginTop: '1.5rem', textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
            Loading properties...
          </p>
        </div>
      </div>
      <style>{styles}</style>
    </>
  );

  if (error) return (
    <>
      <div ref={containerRef} className="admin-verify-container">
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{ transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)` }}
          ></div>
        </div>
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
      <div ref={containerRef} className="admin-verify-container">
        {/* Enhanced Background Animation */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{ transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)` }}
          ></div>
          <div className="particles">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1.2}s`
                }}
              />
            ))}
          </div>
        </div>

        <Container className="py-4">
          <h2 className="admin-title">🏛️ Property Verification Dashboard</h2>
          
          {properties.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '25px',
              backdropFilter: 'blur(25px)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h4 style={{ color: '#10b981', fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                🎉 All Properties Verified!
              </h4>
              <p style={{ color: '#6b7280', fontSize: '1.2rem', fontWeight: 500 }}>
                No properties are currently pending verification. Great job keeping everything up to date!
              </p>
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
                      <p><strong>Category:</strong> <span className="badge bg-info text-white">{p.category}</span></p>
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
                    <span className="badge bg-warning text-dark px-3 py-2 me-3">
                      ⏳ Pending Verification
                    </span>
                    <h4 className="mb-0" style={{ fontWeight: 700, color: '#1f2937' }}>
                      {selected.title}
                    </h4>
                  </div>
                  
                  <Row>
                    <Col lg={8}>
                      {/* Property Details Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6 className="text-primary">🏠 Property Details</h6>
                          <div className="mb-2"><strong>Description:</strong> {selected.description || 'Not provided'}</div>
                          <div className="mb-2"><strong>Category:</strong> <span className="badge bg-info text-white">{selected.category}</span></div>
                          {selected.subtype && <div className="mb-2"><strong>Subtype:</strong> <span className="badge bg-secondary">{selected.subtype}</span></div>}
                          <div className="mb-2"><strong>Price:</strong> <span className="text-success fw-bold">₹{selected.price?.toLocaleString()}</span></div>
                          <div className="mb-2"><strong>Size:</strong> {selected.size || 'Not specified'}</div>
                          <div className="mb-2"><strong>Rent Types:</strong> {selected.rentType?.join(', ') || 'Not specified'}</div>
                        </Card.Body>
                      </Card>

                      {/* Address Information Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6 className="text-primary">📍 Address Information</h6>
                          <div className="mb-2"><strong>Street:</strong> {selected.address?.street || 'Not provided'}</div>
                          <div className="mb-2"><strong>City:</strong> {selected.address?.city || 'Not provided'}</div>
                          <div className="mb-2"><strong>State:</strong> {selected.address?.state || 'Not provided'}</div>
                          <div className="mb-2"><strong>PIN Code:</strong> {selected.address?.pincode || 'Not provided'}</div>
                          <div className="mb-2"><strong>Contact:</strong> <span className="fw-bold text-primary">{selected.contact || 'Not provided'}</span></div>
                        </Card.Body>
                      </Card>

                      {/* Owner Information Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6 className="text-primary">👤 Owner Information</h6>
                          <div className="mb-2"><strong>Name:</strong> <span className="fw-bold">{selected.ownerId?.name || 'Not provided'}</span></div>
                          <div className="mb-2"><strong>Email:</strong> <span className="text-primary">{selected.ownerId?.email || 'Not provided'}</span></div>
                        </Card.Body>
                      </Card>

                      {/* Verification Decision Section - Moved here */}
                      <div className="verification-section">
                        <h5>⚖️ Verification Decision</h5>
                        <Form className="verification-form">
                          <div>
                            <Form.Label>Decision Status</Form.Label>
                            <Form.Select value={verifyStatus} onChange={e => setVerifyStatus(e.target.value)}>
                              <option value="verified">✅ Approve - Verified</option>
                              <option value="rejected">❌ Reject - Declined</option>
                            </Form.Select>
                          </div>
                          <div>
                            <Form.Label>Admin Notes (Optional)</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              rows={3} 
                              value={verifyNote} 
                              onChange={e => setVerifyNote(e.target.value)} 
                              placeholder="Add detailed feedback for the property owner..."
                            />
                          </div>
                        </Form>
                      </div>
                    </Col>

                    <Col lg={4}>
                      {/* Property Images Card */}
                      <Card className="info-card">
                        <Card.Body className="info-card-body">
                          <h6 className="text-primary">🖼️ Property Images</h6>
                          {selected.images && selected.images.length > 0 ? (
                            <div className="property-image-grid">
                              {selected.images.map((img, idx) => (
                                <div key={idx} className="property-image-container" onClick={() => openFullscreen(img, 'image', `Property Image ${idx + 1}`)}>
                                  <img src={img} alt={`Property ${idx + 1}`} className="property-image" />
                                  <div className="property-image-overlay">🔍 View</div>
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
                          <h6 className="text-primary">📄 Verification Documents</h6>
                          
                          {/* Owner Proof */}
                          <div className="mb-3">
                            <strong style={{ color: '#1f2937', display: 'block', marginBottom: '0.5rem' }}>👤 Owner Proof:</strong>
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
                            <strong style={{ color: '#1f2937', display: 'block', marginBottom: '0.5rem' }}>🏠 Property Proof:</strong>
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
            
            {/* Fixed Footer */}
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

          {/* Enhanced Fullscreen Document Modal */}
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
                    borderRadius: '15px',
                    background: '#fff'
                  }}
                />
              )}
            </div>
          </Modal>
        </Container>

        <style>{styles}</style>
      </div>
    </>
  );
};

export default AdminVerifyProperties;
