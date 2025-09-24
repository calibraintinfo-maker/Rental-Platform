import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { api, handleApiError } from '../utils/api';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.bookings.getById(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      /* ✅ SAME PROFESSIONAL BACKGROUND */
      .booking-details-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        padding: 6rem 0 2rem 0;
        position: relative;
        overflow: hidden;
      }
      
      .background-animation {
        position: absolute;
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
          rgba(124, 58, 237, 0.03) 0%, 
          transparent 25%, 
          rgba(59, 130, 246, 0.02) 50%, 
          transparent 75%, 
          rgba(16, 185, 129, 0.03) 100%);
        animation: gradientShift 20s ease-in-out infinite;
      }
      
      .floating-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(40px);
        opacity: 0.4;
      }
      
      .orb-1 {
        width: 160px;
        height: 160px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 40%, transparent 70%);
        top: 10%;
        left: 15%;
        animation: float1 15s ease-in-out infinite;
      }
      
      .orb-2 {
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 40%, transparent 70%);
        top: 65%;
        right: 20%;
        animation: float2 18s ease-in-out infinite;
      }
      
      /* ✅ WIDER CONTAINER */
      .booking-container {
        position: relative;
        z-index: 10;
        max-width: 1000px;
      }
      
      /* ✅ VISIBLE HEADER */
      .header-section {
        text-align: center;
        margin-bottom: 1.5rem;
        color: white;
        position: relative;
        z-index: 20;
        padding-top: 1rem;
      }
      
      .page-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0 0 0.4rem 0;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        letter-spacing: -0.025em;
      }
      
      .page-subtitle {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      
      /* ✅ REDUCED HEIGHT CARD DESIGN */
      .booking-details-card {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.1),
          0 10px 20px rgba(0, 0, 0, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 1);
        position: relative;
        z-index: 10;
        animation: cardAppear 0.8s ease-out;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: visible;
      }
      
      .booking-details-card:hover {
        transform: translateY(-3px);
        box-shadow: 
          0 35px 70px rgba(0, 0, 0, 0.15),
          0 15px 30px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 1);
      }
      
      /* ✅ REDUCED CARD PADDING */
      .card-body {
        padding: 2rem;
        color: #1f2937;
      }
      
      /* ✅ TIGHTER GRID LAYOUT */
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 1.5rem;
      }
      
      /* ✅ REDUCED SECTION SPACING */
      .section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;
      }
      
      /* ✅ ENHANCED PROPERTY SECTION WITH SUBTLE DECORATIONS */
      .property-section {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.01) 100%);
        border-radius: 16px;
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(99, 102, 241, 0.08);
      }
      
      .property-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.2) 50%, transparent 100%);
      }
      
      .property-section::after {
        content: '';
        position: absolute;
        top: 10px;
        right: 15px;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
      }
      
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding-bottom: 0.6rem;
        border-bottom: 2px solid #e5e7eb;
        margin-bottom: 0.4rem;
      }
      
      .section-icon {
        width: 1.8rem;
        height: 1.8rem;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.9rem;
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
        flex-shrink: 0;
      }
      
      .section-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
        letter-spacing: -0.01em;
      }
      
      /* ✅ ENHANCED PROPERTY DATA CARDS WITH VISUAL ELEMENTS */
      .data-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 0.8rem;
      }
      
      .data-card {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
        border: 1px solid rgba(99, 102, 241, 0.1);
        border-radius: 12px;
        padding: 0.8rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .data-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      }
      
      .data-card::after {
        content: '';
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
        border-radius: 50%;
        opacity: 0.6;
      }
      
      .data-card:hover {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
      }
      
      .data-card:hover::after {
        opacity: 1;
        transform: scale(1.2);
      }
      
      .data-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.8rem;
        position: relative;
        z-index: 2;
      }
      
      /* ✅ IMPROVED TEXT READABILITY WITH BIGGER LABELS */
      .data-label {
        font-size: 0.95rem;
        font-weight: 600;
        color: #4b5563;
        flex-shrink: 0;
        min-width: fit-content;
        line-height: 1.4;
        position: relative;
      }
      
      .data-label::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 1px;
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        transition: width 0.3s ease;
      }
      
      .data-card:hover .data-label::after {
        width: 100%;
      }
      
      .data-value {
        font-size: 0.9rem;
        font-weight: 700;
        color: #111827;
        text-align: right;
        word-break: break-word;
        line-height: 1.4;
        max-width: 60%;
      }
      
      /* ✅ VISUAL INDICATOR FOR EMPTY SPACE */
      .property-summary {
        margin-top: 1rem;
        padding: 0.8rem;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(34, 197, 94, 0.02) 100%);
        border-radius: 10px;
        border: 1px solid rgba(16, 185, 129, 0.1);
        position: relative;
      }
      
      .property-summary::before {
        content: '✨';
        position: absolute;
        top: 8px;
        right: 12px;
        font-size: 0.9rem;
        opacity: 0.7;
      }
      
      .property-summary-text {
        font-size: 0.8rem;
        color: #059669;
        font-weight: 500;
        margin: 0;
        font-style: italic;
        line-height: 1.4;
      }
      
      /* ✅ IMPROVED STATUS BADGE */
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.3rem 0.7rem;
        border-radius: 8px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
        white-space: nowrap;
      }
      
      /* ✅ COMPACT BOOKING SECTION */
      .booking-data-grid {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }
      
      .booking-info-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 0.8rem;
        margin-bottom: 0.8rem;
      }
      
      /* ✅ COMPACT DATES SECTION */
      .dates-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.8rem;
        margin: 0.8rem 0;
      }
      
      .date-item {
        padding: 0.8rem;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 10px;
        text-align: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
      
      .date-item:hover {
        background: rgba(99, 102, 241, 0.04);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .date-item.from-date {
        background: rgba(16, 185, 129, 0.08);
        border-color: rgba(16, 185, 129, 0.2);
      }
      
      .date-item.to-date {
        background: rgba(239, 68, 68, 0.08);
        border-color: rgba(239, 68, 68, 0.2);
      }
      
      .date-label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
        margin-bottom: 0.4rem;
      }
      
      .date-value {
        font-size: 0.9rem;
        font-weight: 700;
        color: #111827;
      }
      
      .from-date .date-value {
        color: #059669;
      }
      
      .to-date .date-value {
        color: #dc2626;
      }
      
      /* ✅ COMPACT PRICE SECTION WITH PERFECT SIZE */
      .price-section {
        background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
        border-radius: 12px;
        padding: 1.2rem;
        text-align: center;
        color: white;
        margin-top: 0.8rem;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .price-label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 0.4rem;
      }
      
      /* ✅ PERFECT PRICE SIZE */
      .price-value {
        font-size: 1.3rem;
        font-weight: 800;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
      }
      
      /* ✅ COMPACT OWNER SECTION */
      .owner-section {
        margin-top: 1.5rem;
        padding-top: 1.2rem;
        border-top: 2px solid #e5e7eb;
      }
      
      .owner-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 0.8rem;
      }
      
      .owner-card {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
        border: 1px solid rgba(99, 102, 241, 0.1);
        border-radius: 12px;
        padding: 1rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .owner-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      }
      
      .owner-card:hover {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
      }
      
      /* ✅ IMPROVED OWNER TEXT READABILITY */
      .owner-card .data-value {
        font-size: 0.8rem;
        font-weight: 700;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4;
        color: #111827;
      }
      
      .owner-card .data-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #4b5563;
      }
      
      /* ✅ COMPACT BUTTON SECTION */
      .button-section {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 2px solid #e5e7eb;
      }
      
      .purple-button {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%) !important;
        border: none !important;
        border-radius: 25px !important;
        padding: 0.7rem 2rem !important;
        font-weight: 700 !important;
        font-size: 0.85rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        color: white !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4) !important;
        font-family: 'Inter', sans-serif !important;
      }
      
      .purple-button:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 7px 20px rgba(139, 92, 246, 0.5) !important;
      }
      
      .btn-icon {
        font-size: 0.85rem;
        font-weight: 700;
      }
      
      /* ✅ LOADING STATES */
      .loading-wrapper,
      .error-wrapper {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px) saturate(180%);
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        margin: 0 auto;
        animation: cardAppear 0.8s ease-out;
      }
      
      .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #6366f1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      
      .loading-text {
        color: #6b7280;
        font-weight: 500;
        margin: 0;
        font-size: 0.9rem;
      }
      
      .alert-modern {
        border: none !important;
        border-radius: 15px !important;
        padding: 1rem !important;
        margin-bottom: 1rem !important;
        font-weight: 500 !important;
        font-size: 0.9rem !important;
      }
      
      .alert-danger {
        background: rgba(254, 242, 242, 0.9) !important;
        color: #991b1b !important;
      }
      
      .alert-warning {
        background: rgba(255, 251, 235, 0.9) !important;
        color: #92400e !important;
      }
      
      /* ✅ ANIMATIONS */
      @keyframes gradientShift {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(20px, -20px) scale(1.05); }
      }
      
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-15px, -10px) scale(1.03); }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes cardAppear {
        from { 
          opacity: 0; 
          transform: translateY(20px) scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }
      
      /* ✅ RESPONSIVE DESIGN */
      @media (max-width: 768px) {
        .content-grid {
          grid-template-columns: 1fr;
          gap: 1.2rem;
        }
        
        .dates-section {
          grid-template-columns: 1fr;
        }
        
        .owner-grid {
          grid-template-columns: 1fr;
        }
        
        .data-grid {
          grid-template-columns: 1fr;
        }
        
        .booking-info-cards {
          grid-template-columns: 1fr;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .property-section {
          padding: 1.2rem;
        }
        
        .page-title {
          font-size: 1.5rem;
        }
        
        .page-subtitle {
          font-size: 0.85rem;
        }
        
        .booking-details-container {
          padding: 5rem 0 1.5rem 0;
        }
        
        .booking-container {
          max-width: 100%;
          padding: 0 1rem;
        }
      }
      
      @media (max-width: 480px) {
        .card-body {
          padding: 1.2rem;
        }
        
        .property-section {
          padding: 1rem;
        }
        
        .page-title {
          font-size: 1.3rem;
        }
        
        .section-title {
          font-size: 1rem;
        }
        
        .owner-grid {
          grid-template-columns: 1fr;
          gap: 0.8rem;
        }
        
        .booking-details-container {
          padding: 4rem 0 1rem 0;
        }
        
        .owner-card {
          padding: 0.8rem;
        }
        
        .data-card {
          padding: 0.7rem;
        }
        
        .price-value {
          font-size: 1.1rem;
        }
        
        /* ✅ SMALLER LABELS ON MOBILE */
        .data-label {
          font-size: 0.85rem;
        }
        
        .data-value {
          font-size: 0.8rem;
        }
      }
    `}</style>
  );

  if (loading) {
    return (
      <>
        <div className="booking-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
          </div>
          <Container className="booking-container">
            <div className="loading-wrapper">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading booking details...</p>
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
        <div className="booking-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
          </div>
          <Container className="booking-container">
            <div className="error-wrapper">
              <Alert variant="danger" className="alert-modern alert-danger">
                {error}
              </Alert>
              <Button onClick={() => navigate(-1)} className="purple-button">
                <span className="btn-icon">←</span>
                Go Back
              </Button>
            </div>
          </Container>
        </div>
        {styles}
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <div className="booking-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
          </div>
          <Container className="booking-container">
            <div className="error-wrapper">
              <Alert variant="warning" className="alert-modern alert-warning">
                Booking not found.
              </Alert>
              <Button onClick={() => navigate(-1)} className="purple-button">
                <span className="btn-icon">←</span>
                Go Back
              </Button>
            </div>
          </Container>
        </div>
        {styles}
      </>
    );
  }

  return (
    <>
      <div className="booking-details-container">
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
        </div>

        <Container className="booking-container">
          {/* ✅ COMPACT HEADER */}
          <div className="header-section">
            <h1 className="page-title">Booking Details</h1>
            <p className="page-subtitle">Complete information about your reservation</p>
          </div>

          {/* ✅ COMPACT PROFESSIONAL CARD */}
          <Card className="booking-details-card">
            <Card.Body className="card-body">
              
              {/* ✅ COMPACT TWO-COLUMN GRID */}
              <div className="content-grid">
                
                {/* ✅ ENHANCED PROPERTY SECTION WITH VISUAL ELEMENTS */}
                <div className="property-section">
                  <div className="section-header">
                    <div className="section-icon">🏠</div>
                    <h3 className="section-title">Property Information</h3>
                  </div>
                  
                  <div className="data-grid">
                    <div className="data-card">
                      <div className="data-item">
                        <span className="data-label">Property Title</span>
                        <span className="data-value">{booking.propertyId?.title || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="data-card">
                      <div className="data-item">
                        <span className="data-label">Category</span>
                        <span className="data-value">{booking.propertyId?.category || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="data-card">
                      <div className="data-item">
                        <span className="data-label">Location</span>
                        <span className="data-value">
                          {booking.propertyId?.address?.city || 'N/A'}, {booking.propertyId?.address?.state || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ✅ ADDED VISUAL SUMMARY TO FILL SPACE */}
                  <div className="property-summary">
                    <p className="property-summary-text">
                      This property offers premium amenities and is located in a desirable area perfect for your stay.
                    </p>
                  </div>
                </div>

                {/* ✅ COMPACT BOOKING SECTION */}
                <div className="section">
                  <div className="section-header">
                    <div className="section-icon">📅</div>
                    <h3 className="section-title">Booking Information</h3>
                  </div>
                  
                  <div className="booking-data-grid">
                    <div className="booking-info-cards">
                      <div className="data-card">
                        <div className="data-item">
                          <span className="data-label">Status</span>
                          <span className="status-badge">{booking.status}</span>
                        </div>
                      </div>
                      
                      <div className="data-card">
                        <div className="data-item">
                          <span className="data-label">Booking Type</span>
                          <span className="data-value">{booking.bookingType}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="data-card" style={{gridColumn: '1 / -1'}}>
                          <div className="data-item">
                            <span className="data-label">Notes</span>
                            <span className="data-value">{booking.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ✅ COMPACT DATES */}
                    <div className="dates-section">
                      <div className="date-item from-date">
                        <div className="date-label">From Date</div>
                        <div className="date-value">
                          {new Date(booking.fromDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="date-item to-date">
                        <div className="date-label">To Date</div>
                        <div className="date-value">
                          {new Date(booking.toDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* ✅ PERFECT PRICE SECTION */}
                    <div className="price-section">
                      <div className="price-label">Total Price</div>
                      <div className="price-value">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ COMPACT OWNER SECTION */}
              <div className="owner-section">
                <div className="section-header">
                  <div className="section-icon">👑</div>
                  <h3 className="section-title">Owner Information</h3>
                </div>
                
                <div className="owner-grid">
                  <div className="owner-card">
                    <div className="data-item">
                      <span className="data-label">Owner Name</span>
                      <span className="data-value">
                        {booking.propertyId?.ownerId?.name || booking.propertyId?.ownerId || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="owner-card">
                    <div className="data-item">
                      <span className="data-label">Email Address</span>
                      <span className="data-value" title={booking.propertyId?.ownerId?.email || 'N/A'}>
                        {booking.propertyId?.ownerId?.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="owner-card">
                    <div className="data-item">
                      <span className="data-label">Contact Number</span>
                      <span className="data-value">
                        {booking.propertyId?.ownerId?.contact || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ COMPACT BACK BUTTON */}
              <div className="button-section">
                <Button onClick={() => navigate(-1)} className="purple-button">
                  <span className="btn-icon">←</span>
                  Back
                </Button>
              </div>

            </Card.Body>
          </Card>
        </Container>
      </div>
      {styles}
    </>
  );
};

export default BookingDetails;
