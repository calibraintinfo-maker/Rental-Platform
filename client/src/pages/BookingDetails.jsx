import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
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
      
      /* ✅ SAME BACKGROUND AS LOGIN PAGE */
      .booking-details-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
        position: relative;
        overflow: hidden;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        padding: 2rem 0;
      }
      
      /* ✅ SAME BACKGROUND ANIMATIONS AS LOGIN PAGE */
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
      
      /* ✅ CONTAINER & LAYOUT */
      .booking-container {
        position: relative;
        z-index: 10;
        max-width: 1000px;
      }
      
      /* ✅ HEADER SECTION */
      .header-section {
        text-align: center;
        margin-bottom: 2rem;
        color: white;
      }
      
      .brand-section {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.5rem 1rem;
        border-radius: 50px;
        backdrop-filter: blur(10px);
      }
      
      .brand-icon {
        font-size: 1.2rem;
      }
      
      .brand-text {
        font-size: 1rem;
        font-weight: 600;
        color: white;
      }
      
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0.5rem 0;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .page-subtitle {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        font-weight: 400;
      }
      
      /* ✅ MAIN BOOKING CARD - SAME STYLE AS LOGIN CARD */
      .booking-details-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 20px;
        box-shadow: 
          0 20px 60px rgba(0, 0, 0, 0.1),
          0 8px 25px rgba(124, 58, 237, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
        position: relative;
        z-index: 10;
        animation: cardAppear 0.8s ease-out;
        transition: all 0.3s ease;
        margin-bottom: 2rem;
      }
      
      .booking-details-card:hover {
        transform: translateY(-6px);
        box-shadow: 
          0 25px 70px rgba(0, 0, 0, 0.15),
          0 10px 30px rgba(124, 58, 237, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.95);
      }
      
      .card-body {
        padding: 2.5rem;
        color: #1f2937;
      }
      
      /* ✅ INFO SECTIONS */
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid #e2e8f0;
      }
      
      .section-icon {
        width: 2.5rem;
        height: 2.5rem;
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
      }
      
      .section-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
        letter-spacing: -0.02em;
      }
      
      /* ✅ INFO GRID */
      .info-grid {
        display: grid;
        gap: 1.5rem;
      }
      
      .info-item {
        background: rgba(248, 250, 252, 0.8);
        border: 1px solid rgba(226, 232, 240, 0.8);
        border-radius: 12px;
        padding: 1.25rem;
        transition: all 0.3s ease;
      }
      
      .info-item:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(124, 58, 237, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }
      
      .info-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #718096;
        margin-bottom: 0.5rem;
        display: block;
      }
      
      .info-value {
        font-size: 1rem;
        font-weight: 600;
        color: #1a202c;
        margin: 0;
        line-height: 1.4;
      }
      
      /* ✅ STATUS BADGE */
      .status-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      }
      
      /* ✅ DATE SECTION */
      .date-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      
      .date-card {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
        border: 1px solid rgba(124, 58, 237, 0.15);
        border-radius: 12px;
        padding: 1.25rem;
        text-align: center;
        transition: all 0.3s ease;
      }
      
      .date-card:hover {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
        border-color: rgba(124, 58, 237, 0.25);
        transform: translateY(-2px);
      }
      
      .date-card.from-date {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
        border-color: rgba(16, 185, 129, 0.15);
      }
      
      .date-card.from-date:hover {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%);
        border-color: rgba(16, 185, 129, 0.25);
      }
      
      .date-card.to-date {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
        border-color: rgba(239, 68, 68, 0.15);
      }
      
      .date-card.to-date:hover {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.08) 100%);
        border-color: rgba(239, 68, 68, 0.25);
      }
      
      .date-value {
        font-size: 1.125rem;
        font-weight: 700;
        margin-top: 0.5rem;
      }
      
      .from-date .date-value {
        color: #059669;
      }
      
      .to-date .date-value {
        color: #dc2626;
      }
      
      /* ✅ PRICE SECTION */
      .price-section {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        color: white;
        margin-top: 1rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
      }
      
      .price-value {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      /* ✅ OWNER SECTION */
      .owner-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }
      
      .owner-card {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
        border: 1px solid rgba(124, 58, 237, 0.15);
        border-radius: 12px;
        padding: 1.25rem;
        transition: all 0.3s ease;
      }
      
      .owner-card:hover {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
        border-color: rgba(124, 58, 237, 0.25);
        transform: translateY(-2px);
      }
      
      /* ✅ BUTTONS */
      .button-section {
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #e2e8f0;
      }
      
      .modern-btn {
        border: none !important;
        border-radius: 12px !important;
        padding: 0.875rem 2rem !important;
        font-weight: 600 !important;
        font-size: 0.95rem !important;
        transition: all 0.3s ease !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        font-family: 'Inter', sans-serif !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
      }
      
      .modern-btn.secondary {
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
        color: white !important;
      }
      
      .modern-btn.secondary:hover {
        background: linear-gradient(135deg, #4b5563 0%, #374151 100%) !important;
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3) !important;
      }
      
      .btn-icon {
        font-size: 1rem;
        font-weight: 700;
      }
      
      /* ✅ LOADING & ERROR STATES - SAME AS LOGIN */
      .loading-wrapper,
      .error-wrapper {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px) saturate(180%);
        border-radius: 20px;
        padding: 3rem 2rem;
        text-align: center;
        box-shadow: 
          0 20px 60px rgba(0, 0, 0, 0.1),
          0 8px 25px rgba(124, 58, 237, 0.1);
        max-width: 400px;
        margin: 0 auto;
        animation: cardAppear 0.8s ease-out;
      }
      
      .modern-spinner {
        width: 3rem;
        height: 3rem;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #7c3aed;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      
      .loading-text {
        color: #64748b;
        font-weight: 500;
        margin: 0;
      }
      
      .modern-alert {
        border: none !important;
        border-radius: 12px !important;
        padding: 1rem !important;
        margin-bottom: 1.5rem !important;
        font-weight: 500 !important;
      }
      
      .error-alert {
        background: rgba(254, 242, 242, 0.9) !important;
        color: #991b1b !important;
        border: 1px solid rgba(248, 113, 113, 0.3) !important;
      }
      
      .warning-alert {
        background: rgba(255, 251, 235, 0.9) !important;
        color: #92400e !important;
        border: 1px solid rgba(251, 191, 36, 0.3) !important;
      }
      
      /* ✅ ANIMATIONS - SAME AS LOGIN */
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
      
      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(60px, 60px); }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes cardAppear {
        from { 
          opacity: 0; 
          transform: translateY(25px) scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
        }
      }
      
      /* ✅ RESPONSIVE DESIGN */
      @media (max-width: 768px) {
        .booking-details-container {
          padding: 1rem 0;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .page-title {
          font-size: 1.5rem;
        }
        
        .date-section {
          grid-template-columns: 1fr;
        }
        
        .owner-grid {
          grid-template-columns: 1fr;
        }
        
        .price-value {
          font-size: 2rem;
        }
        
        .orb-1 { width: 200px; height: 200px; }
        .orb-2 { width: 150px; height: 150px; }
        .orb-3 { width: 120px; height: 120px; }
        .orb-4 { width: 100px; height: 100px; }
      }
      
      @media (max-width: 576px) {
        .card-body {
          padding: 1.25rem;
        }
        
        .page-title {
          font-size: 1.3rem;
        }
        
        .section-icon {
          width: 2rem;
          height: 2rem;
          font-size: 1rem;
        }
        
        .section-title {
          font-size: 1.1rem;
        }
      }
    `}</style>
  );

  if (loading) {
    return (
      <>
        <div className="booking-details-container">
          {/* ✅ SAME BACKGROUND ANIMATION AS LOGIN PAGE */}
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>

          <Container className="booking-container">
            <div className="loading-wrapper">
              <div className="modern-spinner"></div>
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
          {/* Background Animation */}
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>

          <Container className="booking-container">
            <div className="error-wrapper">
              <Alert variant="danger" className="modern-alert error-alert">
                {error}
              </Alert>
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="modern-btn secondary"
              >
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
          {/* Background Animation */}
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>

          <Container className="booking-container">
            <div className="error-wrapper">
              <Alert variant="warning" className="modern-alert warning-alert">
                Booking not found.
              </Alert>
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="modern-btn secondary"
              >
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
        {/* ✅ SAME BACKGROUND ANIMATION AS LOGIN PAGE */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
        </div>

        <Container className="booking-container">
          {/* ✅ HEADER */}
          <div className="header-section">
            <div className="brand-section">
              <span className="brand-icon">📋</span>
              <span className="brand-text">SpaceLink</span>
            </div>
            <h1 className="page-title">Booking Details</h1>
            <p className="page-subtitle">Complete information about your reservation</p>
          </div>

          {/* ✅ MAIN BOOKING CARD */}
          <Card className="booking-details-card">
            <Card.Body className="card-body">
              
              <Row>
                {/* ✅ PROPERTY INFORMATION */}
                <Col lg={6}>
                  <div className="section-header">
                    <div className="section-icon">🏠</div>
                    <h3 className="section-title">Property Information</h3>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="info-label">Property Title</label>
                      <p className="info-value">{booking.propertyId?.title || 'N/A'}</p>
                    </div>
                    
                    <div className="info-item">
                      <label className="info-label">Category</label>
                      <p className="info-value">{booking.propertyId?.category || 'N/A'}</p>
                    </div>
                    
                    <div className="info-item">
                      <label className="info-label">Location</label>
                      <p className="info-value">
                        {booking.propertyId?.address?.city || 'N/A'}, {booking.propertyId?.address?.state || 'N/A'}
                      </p>
                    </div>
                  </div>
                </Col>

                {/* ✅ BOOKING INFORMATION */}
                <Col lg={6}>
                  <div className="section-header">
                    <div className="section-icon">📅</div>
                    <h3 className="section-title">Booking Information</h3>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <label className="info-label">Status</label>
                      <span className="status-badge">{booking.status}</span>
                    </div>
                    
                    <div className="info-item">
                      <label className="info-label">Booking Type</label>
                      <p className="info-value">{booking.bookingType}</p>
                    </div>
                    
                    <div className="date-section">
                      <div className="date-card from-date">
                        <label className="info-label">From Date</label>
                        <p className="date-value">
                          {new Date(booking.fromDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="date-card to-date">
                        <label className="info-label">To Date</label>
                        <p className="date-value">
                          {new Date(booking.toDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="info-item">
                        <label className="info-label">Notes</label>
                        <p className="info-value">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* ✅ PRICE SECTION */}
                  <div className="price-section">
                    <label className="info-label" style={{color: 'rgba(255, 255, 255, 0.8)'}}>Total Price</label>
                    <p className="price-value">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </Col>
              </Row>

              {/* ✅ OWNER INFORMATION */}
              <div style={{marginTop: '2.5rem'}}>
                <div className="section-header">
                  <div className="section-icon">👑</div>
                  <h3 className="section-title">Owner Information</h3>
                </div>
                
                <div className="owner-grid">
                  <div className="owner-card">
                    <label className="info-label">Owner Name</label>
                    <p className="info-value">
                      {booking.propertyId?.ownerId?.name || booking.propertyId?.ownerId || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="owner-card">
                    <label className="info-label">Email Address</label>
                    <p className="info-value" style={{fontSize: '0.9rem', wordBreak: 'break-word'}}>
                      {booking.propertyId?.ownerId?.email || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="owner-card">
                    <label className="info-label">Contact Number</label>
                    <p className="info-value">
                      {booking.propertyId?.ownerId?.contact || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ BACK BUTTON */}
              <div className="button-section">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(-1)} 
                  className="modern-btn secondary"
                >
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
