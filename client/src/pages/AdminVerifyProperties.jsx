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

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    .admin-verify-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
      position: relative;
      overflow-x: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 2rem 0;
      padding-top: 100px;
    }

    /* Background Animations */
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

    /* Loading Styles */
    .loading-wrapper {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 100;
    }

    .custom-spinner {
      width: 3rem !important;
      height: 3rem !important;
      border: 4px solid rgba(102, 126, 234, 0.2) !important;
      border-top: 4px solid #667eea !important;
      animation: spin 1s linear infinite !important;
    }

    .loading-text {
      color: #4a5568;
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 1rem;
    }

    /* Enhanced Alert */
    .enhanced-alert {
      background: rgba(254, 242, 242, 0.95) !important;
      border: 1px solid rgba(248, 113, 113, 0.3) !important;
      border-radius: 16px !important;
      padding: 1.5rem !important;
      color: #dc2626 !important;
      font-size: 1rem !important;
      font-weight: 500 !important;
      position: relative;
      z-index: 100;
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    /* Container Styles */
    .container {
      position: relative;
      z-index: 50;
    }

    /* Header Title */
    .admin-title {
      font-size: 2.8rem !important;
      font-weight: 800 !important;
      color: #1a202c !important;
      margin-bottom: 2.5rem !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      text-align: center !important;
      position: relative;
      z-index: 10;
    }

    /* Compact Card Styles */
    .card {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) !important;
      border: none !important;
      border-radius: 20px !important;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06) !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
      height: 240px !important;
      position: relative;
      z-index: 10;
      display: flex !important;
      flex-direction: column !important;
    }

    .card:hover {
      transform: translateY(-8px) scale(1.02) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
    }

    .card-body {
      padding: 1.2rem !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
    }

    .card h5 {
      font-size: 1.1rem !important;
      font-weight: 700 !important;
      color: #1a202c !important;
      margin-bottom: 0.6rem !important;
      line-height: 1.3 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }

    .card p {
      font-size: 0.85rem !important;
      color: #4a5568 !important;
      margin-bottom: 0.4rem !important;
      line-height: 1.4 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 1 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }

    .card p strong {
      color: #2d3748 !important;
      font-weight: 600 !important;
    }

    /* Enhanced Button */
    .btn-info {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 0.5rem 1rem !important;
      font-weight: 600 !important;
      font-size: 0.85rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.6px !important;
      transition: all 0.3s ease !important;
      width: 100% !important;
      color: white !important;
      margin-top: auto !important;
    }

    .btn-info:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
      color: white !important;
    }

    /* FIXED: Button Colors and Styles */
    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      padding: 0.7rem 1.3rem !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;
      color: white !important;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3) !important;
      color: white !important;
    }

    /* FIXED: Cancel Button - Changed from secondary to danger with proper contrast */
    .btn-danger {
      background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      padding: 0.7rem 1.3rem !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;
      color: white !important;
    }

    .btn-danger:hover {
      background: linear-gradient(135deg, #e11d48 0%, #be185d 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(244, 63, 94, 0.3) !important;
      color: white !important;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
      border: none !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      padding: 0.7rem 1.3rem !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;
      color: white !important;
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, #4b5563 0%, #374151 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(107, 114, 128, 0.3) !important;
      color: white !important;
    }

    /* Better row and column spacing */
    .row {
      margin-left: -0.75rem !important;
      margin-right: -0.75rem !important;
    }

    .row > * {
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }

    .col-lg-4 {
      margin-bottom: 1.5rem !important;
    }

    /* Professional Modal */
    .modal {
      z-index: 9999 !important;
    }

    .modal-backdrop {
      z-index: 9998 !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
    }

    .modal-dialog {
      max-width: 1400px !important;
      margin: 0.5rem auto !important;
    }

    .modal-content {
      border: none !important;
      border-radius: 24px !important;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3) !important;
      overflow: hidden !important;
      backdrop-filter: blur(20px) !important;
      z-index: 10000 !important;
      position: relative;
    }

    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none !important;
      padding: 1.5rem 2rem !important;
      position: relative;
      z-index: 10001;
    }

    .modal-title {
      font-size: 1.4rem !important;
      font-weight: 700 !important;
      margin: 0 !important;
      text-align: left !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.6rem !important;
    }

    /* FIXED: Highly Visible Close Button - Made it stand out much more */
    .btn-close {
      filter: none !important; /* Removed the invert filter */
      opacity: 1 !important;
      font-size: 1.8rem !important;
      width: 50px !important;
      height: 50px !important;
      background: rgba(255, 255, 255, 0.95) !important; /* Much more visible white background */
      border-radius: 50% !important;
      backdrop-filter: blur(10px) !important;
      border: 3px solid rgba(239, 68, 68, 0.8) !important; /* Red border for contrast */
      transition: all 0.3s ease !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
      position: relative !important;
      color: #dc2626 !important; /* Red color for the X */
      font-weight: 900 !important;
    }

    .btn-close:hover {
      background: rgba(239, 68, 68, 0.95) !important; /* Red background on hover */
      transform: scale(1.15) rotate(90deg) !important;
      border-color: rgba(255, 255, 255, 0.9) !important;
      box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4) !important;
      color: white !important; /* White X on hover */
    }

    /* Add custom X symbol to make it more visible */
    .btn-close::before {
      content: '✕' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      font-size: 22px !important;
      font-weight: 900 !important;
      line-height: 1 !important;
    }

    .modal-body {
      padding: 1.8rem !important;
      background: #ffffff !important;
      max-height: 75vh !important;
      overflow-y: auto !important;
    }

    .modal-footer {
      background: #ffffff !important;
      border: none !important;
      padding: 1.5rem 2rem !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 1rem !important;
      border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
    }

    /* More Compact Modal Content */
    .modal .card {
      min-height: auto !important;
      height: auto !important;
      margin-bottom: 1.5rem !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
      border-radius: 16px !important;
      border: 1px solid rgba(0, 0, 0, 0.06) !important;
    }

    .modal .card-body {
      padding: 1.5rem !important;
    }

    /* FIXED: Better Card Headers with improved text styling */
    .modal h6 {
      font-size: 1.15rem !important;
      margin-bottom: 1.2rem !important;
      font-weight: 700 !important;
      color: #1f2937 !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.6rem !important;
      padding-bottom: 0.8rem !important;
      border-bottom: 2px solid rgba(102, 126, 234, 0.15) !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      font-family: 'Inter', sans-serif !important;
    }

    /* FIXED: Better Badge Styling */
    .modal .badge {
      font-size: 0.8rem !important;
      padding: 0.5rem 0.9rem !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      letter-spacing: 0.5px !important;
      text-transform: uppercase !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* FIXED: Better Property Details Text Design */
    .modal .card .property-detail-item {
      padding: 0.7rem 0 !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      font-size: 0.95rem !important;
      line-height: 1.5 !important;
      transition: all 0.2s ease !important;
    }

    .modal .card .property-detail-item:last-child {
      border-bottom: none !important;
    }

    .modal .card .property-detail-item:hover {
      background: rgba(102, 126, 234, 0.03) !important;
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
      border-radius: 6px !important;
    }

    .modal .card .property-detail-label {
      font-weight: 600 !important;
      color: #374151 !important;
      flex: 0 0 35% !important;
      text-transform: capitalize !important;
    }

    .modal .card .property-detail-value {
      flex: 1 !important;
      color: #1f2937 !important;
      font-weight: 500 !important;
      text-align: right !important;
    }

    .modal .card .property-detail-value.highlight {
      color: #10b981 !important;
      font-weight: 700 !important;
    }

    /* More Compact Image Grid */
    .property-image-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) !important;
      gap: 1rem !important;
    }

    .property-image-container {
      position: relative !important;
      cursor: pointer !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.3s ease !important;
      aspect-ratio: 16/9 !important;
    }

    .property-image-container:hover {
      transform: scale(1.04) !important;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18) !important;
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
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9)) !important;
      color: white !important;
      padding: 0.4rem 0.8rem !important;
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      border-top-left-radius: 8px !important;
      backdrop-filter: blur(10px) !important;
    }

    /* MOVED UP: Much More Compact Verification Section */
    .verification-section {
      padding: 1.2rem !important;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
      border-radius: 16px !important;
      border: 1px solid rgba(102, 126, 234, 0.1) !important;
      margin-bottom: 1.5rem !important; /* CHANGED: from margin-top to margin-bottom */
      order: -1 !important; /* ADDED: This will move it above other content */
    }

    .verification-section h5 {
      color: #1f2937 !important;
      font-weight: 700 !important;
      margin-bottom: 1rem !important;
      font-size: 1.15rem !important;
      text-align: center !important;
      padding-bottom: 0.6rem !important;
      border-bottom: 2px solid rgba(102, 126, 234, 0.1) !important;
    }

    .verification-form {
      display: grid !important;
      grid-template-columns: 1fr 2fr 1fr !important;
      gap: 1.5rem !important;
      align-items: end !important;
    }

    /* Compact View Fullscreen Button */
    .view-fullscreen-btn {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
      border: none !important;
      border-radius: 10px !important;
      padding: 0.6rem 1.2rem !important;
      font-weight: 600 !important;
      font-size: 0.85rem !important;
      color: white !important;
      transition: all 0.3s ease !important;
      width: 100% !important;
      margin-top: 0.8rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.4px !important;
      box-shadow: 0 3px 12px rgba(99, 102, 241, 0.3) !important;
    }

    .view-fullscreen-btn:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important;
      color: white !important;
    }

    /* More Compact Document Preview */
    .document-preview {
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      background: #fff !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
      position: relative !important;
    }

    .document-preview iframe {
      width: 100% !important;
      height: 200px !important;
      border: none !important;
      background: #ffffff !important;
      overflow: auto !important;
      zoom: 1 !important;
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
      top: 25px !important;
      right: 30px !important;
      z-index: 10052 !important;
      width: 55px !important;
      height: 55px !important;
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.95) !important;
      border: 3px solid rgba(16, 185, 129, 0.8) !important;
      color: #059669 !important;
      font-size: 20px !important;
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
      background: rgba(16, 185, 129, 0.9) !important;
      color: white !important;
      transform: scale(1.1) rotate(90deg) !important;
      box-shadow: 0 6px 30px rgba(16, 185, 129, 0.4) !important;
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
      border-radius: 16px !important;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6) !important;
      object-fit: contain !important;
    }

    /* Compact Form Controls */
    .form-control, .form-select {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(10px) !important;
      border: 2px solid rgba(209, 213, 219, 0.6) !important;
      border-radius: 10px !important;
      padding: 10px 14px !important;
      color: #111827 !important;
      font-size: 0.9rem !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
    }

    .form-control:focus, .form-select:focus {
      background: rgba(255, 255, 255, 1) !important;
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
      transform: scale(1.01) !important;
    }

    .form-label {
      color: #1f2937 !important;
      font-size: 0.95rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.7rem !important;
      display: block !important;
    }

    /* Badge Styling */
    .badge {
      padding: 0.5rem 1rem !important;
      font-size: 0.85rem !important;
      border-radius: 16px !important;
      font-weight: 600 !important;
      letter-spacing: 0.4px !important;
      text-transform: uppercase !important;
    }

    /* Improved scrollbar for modal */
    .modal-body::-webkit-scrollbar {
      width: 6px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 8px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    }

    /* Rounded corners for inner cards */
    .rounded-4 {
      border-radius: 16px !important;
    }

    .shadow-sm {
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08) !important;
    }

    /* Text colors */
    .text-primary {
      color: #667eea !important;
    }

    .text-success {
      color: #10b981 !important;
      font-weight: 700 !important;
    }

    .bg-light {
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(10px) !important;
    }

    /* Animation Keyframes */
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .admin-verify-container {
        padding-top: 80px;
      }
      
      .orb-1 { width: 200px; height: 200px; }
      .orb-2 { width: 150px; height: 150px; }
      .orb-3 { width: 120px; height: 120px; }
      .orb-4 { width: 100px; height: 100px; }
      
      .admin-title {
        font-size: 2.2rem !important;
      }
      
      .card {
        height: 220px !important;
      }
      
      .card-body {
        padding: 1rem !important;
      }

      .modal-dialog {
        max-width: 95% !important;
        margin: 0.3rem !important;
      }

      .modal-body {
        max-height: 80vh !important;
        padding: 1.2rem !important;
      }

      .col-lg-4 {
        margin-bottom: 1.2rem !important;
      }

      .fullscreen-close-btn {
        width: 45px !important;
        height: 45px !important;
        top: 15px !important;
        right: 15px !important;
        font-size: 18px !important;
      }

      .verification-form {
        grid-template-columns: 1fr !important;
        gap: 1.2rem !important;
      }

      .property-image-grid {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
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
        </div>
        <div className="loading-wrapper">
          <Spinner animation="border" className="custom-spinner" />
          <p className="loading-text">Loading properties...</p>
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
            {error}
          </Alert>
        </Container>
      </div>
      <style>{styles}</style>
    </>
  );

  return (
    <>
      <div ref={containerRef} className="admin-verify-container">
        {/* Beautiful Background Animation */}
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
        </div>

        <Container className="py-4">
          <h2 className="admin-title">Property Verification</h2>
          <Row>
            {properties.map(p => (
              <Col lg={4} md={6} key={p._id} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>{p.title}</h5>
                    <p><strong>Owner:</strong> {p.ownerId?.name} ({p.ownerId?.email})</p>
                    <p><strong>Category:</strong> {p.category}</p>
                    <p><strong>Address:</strong> {p.address.street}, {p.address.city}, {p.address.state} - {p.address.pincode}</p>
                    <Button variant="info" onClick={() => openModal(p)}>Review & Verify</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>🔍 Verify Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selected && (
                <div>
                  {/* Status badge */}
                  <div className="d-flex align-items-center mb-3">
                    <span className="badge bg-warning text-dark px-3 py-2 me-3" style={{ fontSize: '0.9rem', borderRadius: '12px', letterSpacing: '0.5px' }}>
                      <i className="bi bi-hourglass-split me-2" />⏳ Pending Verification
                    </span>
                    <h4 className="mb-0" style={{ fontWeight: '700', fontSize: '1.3rem', color: '#1f2937' }}>{selected.title}</h4>
                  </div>

                  {/* MOVED UP: Verification Decision Section */}
                  <div className="verification-section">
                    <h5>⚖️ Verification Decision</h5>
                    <Form>
                      <div className="verification-form">
                        <div>
                          <Form.Label>Status Decision</Form.Label>
                          <Form.Select value={verifyStatus} onChange={e => setVerifyStatus(e.target.value)}>
                            <option value="verified">✅ Approved - Verified</option>
                            <option value="rejected">❌ Rejected - Declined</option>
                          </Form.Select>
                        </div>
                        <div>
                          <Form.Label>Admin Notes (Optional)</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={2} 
                            value={verifyNote} 
                            onChange={e => setVerifyNote(e.target.value)} 
                            placeholder="Add detailed notes for the property owner..."
                            style={{ resize: 'vertical' }}
                          />
                        </div>
                        <div>
                          <Button 
                            variant="primary" 
                            onClick={handleVerify} 
                            disabled={submitting} 
                            style={{ height: 'fit-content', marginTop: '1.8rem' }}
                          >
                            {submitting ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Processing...
                              </>
                            ) : (
                              <>
                                💾 Save Decision
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                  
                  <Row>
                    <Col lg={8}>
                      <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Body>
                          <h6 className="text-primary mb-3">🏠 Property Details</h6>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Description:</span>
                            <span className="property-detail-value">{selected.description}</span>
                          </div>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Category:</span>
                            <span className="property-detail-value">
                              <span className="badge bg-info text-white">{selected.category}</span>
                            </span>
                          </div>
                          
                          {selected.subtype && (
                            <div className="property-detail-item">
                              <span className="property-detail-label">Subtype:</span>
                              <span className="property-detail-value">
                                <span className="badge bg-secondary">{selected.subtype}</span>
                              </span>
                            </div>
                          )}
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Price:</span>
                            <span className="property-detail-value highlight">₹{selected.price}</span>
                          </div>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Size:</span>
                            <span className="property-detail-value">{selected.size}</span>
                          </div>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Rent Types:</span>
                            <span className="property-detail-value">{selected.rentType && selected.rentType.join(', ')}</span>
                          </div>
                        </Card.Body>
                      </Card>

                      <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Body>
                          <h6 className="text-primary mb-3">📍 Address Information</h6>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Street:</span>
                            <span className="property-detail-value">{selected.address?.street}</span>
                          </div>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Location:</span>
                            <span className="property-detail-value">{selected.address?.city}, {selected.address?.state} - {selected.address?.pincode}</span>
                          </div>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Contact:</span>
                            <span className="property-detail-value highlight">{selected.contact}</span>
                          </div>
                        </Card.Body>
                      </Card>

                      <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Body>
                          <h6 className="text-primary mb-3">👤 Owner Information</h6>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Name:</span>
                            <span className="property-detail-value">{selected.ownerId?.name}</span>
                          </div>
                          
                          <div className="property-detail-item">
                            <span className="property-detail-label">Email:</span>
                            <span className="property-detail-value highlight">{selected.ownerId?.email}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col lg={4}>
                      <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Body>
                          <h6 className="text-primary mb-3">🖼️ Property Images</h6>
                          <div className="property-image-grid">
                            {selected.images && selected.images.map((img, idx) => (
                              <div key={idx} className="property-image-container">
                                <img
                                  src={img}
                                  alt={`Property ${idx + 1}`}
                                  className="property-image"
                                  onClick={() => setFullscreenDoc({ show: true, src: img, type: 'image', title: `Property Image ${idx + 1}` })}
                                />
                                <div className="property-image-overlay">
                                  🔍 View
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card.Body>
                      </Card>

                      <Card className="mb-3 shadow-sm border-0 rounded-4">
                        <Card.Body>
                          <h6 className="text-primary mb-3">📄 Proof Documents</h6>
                          
                          <div className="mb-3">
                            <strong style={{ fontSize: '0.9rem', color: '#1f2937' }}>👤 Owner Proof:</strong>
                            {selected.ownerProof && selected.ownerProof.startsWith('data:application/pdf') ? (
                              <div className="document-preview mt-2">
                                <iframe
                                  src={selected.ownerProof}
                                  title="Owner Proof PDF"
                                  style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    border: 'none'
                                  }}
                                />
                                <Button 
                                  className="view-fullscreen-btn"
                                  onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'pdf', title: 'Owner Proof' })}
                                >
                                  🔍 View Fullscreen
                                </Button>
                              </div>
                            ) : selected.ownerProof ? (
                              <div className="document-preview mt-2">
                                <img 
                                  src={selected.ownerProof} 
                                  alt="Owner Proof"
                                />
                                <Button 
                                  className="view-fullscreen-btn"
                                  onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'image', title: 'Owner Proof' })}
                                >
                                  🔍 View Fullscreen
                                </Button>
                              </div>
                            ) : <span style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic' }}>❌ Not uploaded</span>}
                          </div>

                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#1f2937' }}>🏠 Property Proof:</strong>
                            {selected.propertyProof && selected.propertyProof.startsWith('data:application/pdf') ? (
                              <div className="document-preview mt-2">
                                <iframe
                                  src={selected.propertyProof}
                                  title="Property Proof PDF"
                                  style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    border: 'none'
                                  }}
                                />
                                <Button 
                                  className="view-fullscreen-btn"
                                  onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'pdf', title: 'Property Proof' })}
                                >
                                  🔍 View Fullscreen
                                </Button>
                              </div>
                            ) : selected.propertyProof ? (
                              <div className="document-preview mt-2">
                                <img 
                                  src={selected.propertyProof} 
                                  alt="Property Proof"
                                />
                                <Button 
                                  className="view-fullscreen-btn"
                                  onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'image', title: 'Property Proof' })}
                                >
                                  🔍 View Fullscreen
                                </Button>
                              </div>
                            ) : <span style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic' }}>❌ Not uploaded</span>}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowModal(false)}>
                ❌ Cancel
              </Button>
              <Button variant="primary" onClick={handleVerify} disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    💾 Save Verification
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Enhanced Fullscreen Modal for Document/Image Preview */}
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
                <button
                  className="fullscreen-close-btn"
                  onClick={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
                  aria-label="Close Fullscreen View"
                  title="Close (ESC)"
                >
                  ✕
                </button>
                <div className="fullscreen-content">
                  <img
                    src={fullscreenDoc.src}
                    alt="Document Preview"
                    className="fullscreen-image"
                  />
                </div>
              </>
            ) : (
              <>
                <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Modal.Title>📄 {fullscreenDoc.title} - Document Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: 0 }}>
                  {fullscreenDoc.type === 'pdf' ? (
                    <iframe
                      src={fullscreenDoc.src}
                      title="PDF Preview"
                      style={{ 
                        width: '100%', 
                        height: '80vh', 
                        border: 'none', 
                        background: '#fff'
                      }}
                    />
                  ) : null}
                </Modal.Body>
              </>
            )}
          </Modal>
        </Container>
      </div>
      <style>{styles}</style>
    </>
  );
};

export default AdminVerifyProperties;
