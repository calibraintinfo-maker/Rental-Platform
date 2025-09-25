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

    @keyframes gradientShift {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }

    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }

    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-40px, -20px) rotate(180deg); }
    }

    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(20px, -40px) rotate(90deg); }
      50% { transform: translate(-30px, -20px) rotate(180deg); }
      75% { transform: translate(-10px, 30px) rotate(270deg); }
    }

    @keyframes float4 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(25px, -35px) scale(1.1); }
    }

    @keyframes particle1 {
      0% { transform: translateY(100vh) translateX(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
    }

    @keyframes particle2 {
      0% { transform: translateY(100vh) translateX(100vw); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) translateX(-100px); opacity: 0; }
    }

    @keyframes particle3 {
      0% { transform: translateY(100vh) translateX(50vw); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) translateX(30vw); opacity: 0; }
    }

    @keyframes particle4 {
      0% { transform: translateY(100vh) translateX(25vw); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px) translateX(75vw); opacity: 0; }
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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

    /* Button Colors and Styles */
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

    /* FIXED: Top close button - smaller and subtle */
    .modal-header .btn-close {
      width: 30px !important;
      height: 30px !important;
      font-size: 1.3rem !important;
      color: #6b7280 !important;
      filter: none !important;
      border-radius: 6px !important;
      background: rgba(255,255,255,0.8) !important;
      border: 1.5px solid #d1d5db !important;
      box-shadow: 0 1px 10px rgba(0,0,0,0.08) !important;
      transition: background-color 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .modal-header .btn-close:hover {
      background-color: rgba(229, 231, 235, 0.9) !important;
      color: #374151 !important;
      transform: scale(1.1) !important;
    }
    .modal-header .btn-close::before {
      content: '✕' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      font-size: 1.3rem !important;
      font-weight: 700 !important;
      line-height: 1 !important;
      color: #6b7280 !important;
    }

    .modal-body {
      padding: 1.8rem !important;
      background: #ffffff !important;
      padding-bottom: 140px !important;
      max-height: 75vh !important;
      overflow-y: auto !important;
    }

    /* FIXED: Fixed footer with buttons always visible at bottom */
    .modal-footer {
      position: fixed !important;
      bottom: 15px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 11000 !important;
      background: #fff !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
      border-radius: 24px !important;
      padding: 1rem 2rem !important;
      max-width: 760px !important;
      width: 90% !important;
      gap: 1rem !important;
      display: flex !important;
      justify-content: flex-end !important;
      border: none !important;
    }

    /* FIXED: Bottom Cancel button with smaller balanced cross icon, red-themed */
    .btn-danger {
      position: relative !important;
      padding-left: 2.3rem !important;
      padding-right: 1.5rem !important;
      background: transparent !important;
      border: 2.5px solid #dc2626 !important;
      box-shadow: none !important;
      color: #dc2626 !important;
      font-weight: 700 !important;
      font-size: 1rem !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.6rem !important;
      border-radius: 12px !important;
      width: auto !important;
      min-width: 90px !important;
    }
    .btn-danger:hover {
      background: #dc2626 !important;
      color: white !important;
      border-color: #b91c1c !important;
      box-shadow: 0 8px 20px rgba(220,38,38,0.35) !important;
    }
    .btn-danger::before {
      content: '×' !important;
      position: absolute !important;
      left: 0.55rem !important;
      font-size: 1.25rem !important;
      font-weight: 900 !important;
      line-height: 1 !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      color: #dc2626 !important;
      pointer-events: none !important;
    }

    /* Verification Decision section styling */
    .verification-section {
      padding: 1.2rem !important;
      background: linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%) !important;
      border-radius: 16px !important;
      border: 1px solid rgba(102,126,234,0.1) !important;
      margin-bottom: 1.5rem !important;
    }

    /* Status Decision and Admin Notes same width, side by side */
    .verification-form {
      display: flex !important;
      gap: 1rem !important;
      flex-wrap: wrap !important;
    }
    .verification-form > div {
      flex: 1 1 48% !important;
      min-width: 250px !important;
    }
    .verification-form > div:last-child {
      flex: 1 1 100% !important;
      margin-top: 1rem !important;
      display: flex;
      justify-content: flex-start;
    }

    /* Adjust Save Decision button padding and min width */
    .verification-form > div:last-child button {
      padding-left: 1.6rem !important;
      padding-right: 1.6rem !important;
      width: auto !important;
      min-width: 130px !important;
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

    .modal .card h6 {
      font-size: 1rem !important;
      font-weight: 700 !important;
      color: #667eea !important;
      margin-bottom: 1rem !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }

    .modal .card p {
      font-size: 0.9rem !important;
      color: #4a5568 !important;
      margin-bottom: 0.5rem !important;
      line-height: 1.5 !important;
    }

    .modal .card p strong {
      color: #2d3748 !important;
      font-weight: 600 !important;
    }

    /* Document viewer styles */
    .doc-viewer {
      background: #f7fafc;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .doc-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .doc-item:last-child {
      margin-bottom: 0;
    }

    .doc-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .doc-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .doc-details h6 {
      font-size: 0.9rem !important;
      font-weight: 600 !important;
      color: #2d3748 !important;
      margin: 0 !important;
    }

    .doc-details span {
      font-size: 0.75rem;
      color: #718096;
    }

    /* Fullscreen document modal */
    .fullscreen-modal .modal-dialog {
      max-width: 95vw !important;
      height: 95vh !important;
      margin: 2.5vh auto !important;
    }

    .fullscreen-modal .modal-content {
      height: 100% !important;
    }

    .fullscreen-modal .modal-body {
      padding: 0 !important;
      height: calc(100% - 80px) !important;
      max-height: none !important;
    }

    .fullscreen-modal iframe,
    .fullscreen-modal img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
    }
  `;

  if (loading) {
    return (
      <div className="admin-verify-container" ref={containerRef}>
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
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
          </div>
        </div>
        <div className="loading-wrapper">
          <Spinner className="custom-spinner" />
          <div className="loading-text">Loading pending properties...</div>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="admin-verify-container" ref={containerRef}>
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
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>
      </div>

      <Container>
        <h1 className="admin-title">⚖️ Property Verification Center</h1>
        
        {error && (
          <Alert variant="danger" className="enhanced-alert">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#4a5568' }}>
            <h4>🎉 All caught up!</h4>
            <p>No properties pending verification at the moment.</p>
          </div>
        ) : (
          <Row>
            {properties.map((property) => (
              <Col lg={4} md={6} sm={12} key={property._id}>
                <Card>
                  <Card.Body>
                    <h5>{property.title}</h5>
                    <p><strong>Type:</strong> {property.category || 'Not specified'}</p>
                    <p><strong>Price:</strong> ₹{property.price}/month</p>
                    <p><strong>Location:</strong> {property.location || 'Not provided'}</p>
                    <p><strong>Submitted:</strong> {new Date(property.createdAt).toLocaleDateString()}</p>
                    <Button variant="info" onClick={() => openModal(property)}>
                      📋 Review & Verify
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Verification Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>🔍 Verify Property</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selected && (
              <>
                {/* Status badge and title */}
                <div className="d-flex align-items-center mb-3">
                  <span className="badge bg-warning text-dark px-3 py-2 me-3" style={{ fontSize: '0.9rem', borderRadius: '12px', letterSpacing: '0.5px' }}>
                    <i className="bi bi-hourglass-split me-2" />⏳ Pending Verification
                  </span>
                  <h4 className="mb-0 fw-bold" style={{ fontSize: '1.3rem', color: '#1f2937' }}>{selected.title}</h4>
                </div>

                <Row>
                  <Col lg={8}>
                    {/* Property Details card */}
                    <Card className="mb-3 shadow-sm border-0 rounded-4">
                      <Card.Body>
                        <h6 className="text-primary mb-3">🏠 Property Details</h6>
                        <p><strong>Description:</strong> {selected.description || 'No description provided'}</p>
                        <p><strong>Category:</strong> <span className="badge bg-info text-white px-2 py-1" style={{ borderRadius: '8px' }}>{selected.category || 'Not specified'}</span></p>
                        <p><strong>Subtype:</strong> <span className="badge bg-secondary text-white px-2 py-1" style={{ borderRadius: '8px' }}>{selected.subtype || 'Not specified'}</span></p>
                        <p><strong>Price:</strong> <span style={{ color: '#059669', fontWeight: '700', fontSize: '1.1rem' }}>₹{selected.price}</span></p>
                        <p><strong>Size:</strong> {selected.size || 'Not provided'}</p>
                        <p><strong>Rent Types:</strong> {selected.rentTypes || 'Not specified'}</p>
                      </Card.Body>
                    </Card>

                    {/* Address Information card */}
                    <Card className="mb-3 shadow-sm border-0 rounded-4">
                      <Card.Body>
                        <h6 className="text-primary mb-3">📍 Address Information</h6>
                        <p><strong>Street:</strong> {selected.street || 'Not provided'}</p>
                        <p><strong>Location:</strong> {selected.location || 'Not provided'}</p>
                      </Card.Body>
                    </Card>

                    {/* Owner Information card */}
                    <Card className="mb-3 shadow-sm border-0 rounded-4">
                      <Card.Body>
                        <h6 className="text-primary mb-3">👤 Owner Information</h6>
                        <p><strong>Owner:</strong> {selected.owner?.name || 'Not provided'}</p>
                        <p><strong>Email:</strong> {selected.owner?.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> {selected.owner?.phone || 'Not provided'}</p>
                      </Card.Body>
                    </Card>

                    {/* MOVED: Verification Decision - now BELOW Owner Information */}
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
                              style={{ marginTop: '1.8rem', width: 'auto', minWidth: '130px', paddingLeft: '1.6rem', paddingRight: '1.6rem' }}
                            >
                              {submitting ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Processing...
                                </>
                              ) : (
                                <>💾 Save Decision</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </Col>

                  <Col lg={4}>
                    {/* Property Images card */}
                    <Card className="mb-3 shadow-sm border-0 rounded-4">
                      <Card.Body>
                        <h6 className="text-primary mb-3">🖼️ Property Images</h6>
                        {selected.images && selected.images.length > 0 ? (
                          <div className="row g-2">
                            {selected.images.slice(0, 4).map((image, idx) => (
                              <div key={idx} className="col-6">
                                <img 
                                  src={image} 
                                  alt={`Property ${idx + 1}`}
                                  className="img-fluid rounded"
                                  style={{ 
                                    height: '80px', 
                                    width: '100%', 
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => openFullscreen(image, 'image', `Property Image ${idx + 1}`)}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4" style={{ color: '#718096' }}>
                            📷 No images uploaded
                          </div>
                        )}
                        {selected.images && selected.images.length > 4 && (
                          <div className="text-center mt-2">
                            <Button variant="outline-primary" size="sm">
                              View All ({selected.images.length}) Images
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Proof Documents card */}
                    <Card className="shadow-sm border-0 rounded-4">
                      <Card.Body>
                        <h6 className="text-primary mb-3">📄 Proof Documents</h6>
                        
                        <div className="mb-3">
                          <p><strong>👤 Owner Proof:</strong></p>
                          {selected.ownerProof ? (
                            <div className="doc-viewer">
                              <div className="doc-item">
                                <div className="doc-info">
                                  <div className="doc-icon">📄</div>
                                  <div className="doc-details">
                                    <h6>Owner Identity Document</h6>
                                    <span>Verification document</span>
                                  </div>
                                </div>
                                <Button 
                                  variant="primary" 
                                  size="sm"
                                  onClick={() => openFullscreen(selected.ownerProof, 'document', 'Owner Proof')}
                                >
                                  👁️ View
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3" style={{ color: '#718096', fontSize: '0.9rem' }}>
                              📄 No owner proof uploaded
                            </div>
                          )}
                        </div>

                        <div>
                          <p><strong>🏠 Property Proof:</strong></p>
                          {selected.propertyProof ? (
                            <div className="doc-viewer">
                              <div className="doc-item">
                                <div className="doc-info">
                                  <div className="doc-icon">🏠</div>
                                  <div className="doc-details">
                                    <h6>Property Document</h6>
                                    <span>Ownership/rental document</span>
                                  </div>
                                </div>
                                <Button 
                                  variant="primary" 
                                  size="sm"
                                  onClick={() => openFullscreen(selected.propertyProof, 'document', 'Property Proof')}
                                >
                                  👁️ View
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3" style={{ color: '#718096', fontSize: '0.9rem' }}>
                              🏠 No property proof uploaded
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Modal.Body>

          {/* Fixed footer buttons */}
          <Modal.Footer>
            <Button variant="danger" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleVerify} disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                <>💾 Save Verification</>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Fullscreen Document Modal */}
        <Modal show={fullscreenDoc.show} onHide={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })} size="lg" className="fullscreen-modal">
          <Modal.Header closeButton>
            <Modal.Title>{fullscreenDoc.title}</Modal.Title>
          </Modal.Header>
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
