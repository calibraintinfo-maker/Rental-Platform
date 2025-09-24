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
        padding: 1.5rem 0;
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
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%);
        top: 8%;
        left: 10%;
        animation: float1 12s ease-in-out infinite;
      }
      
      .orb-2 {
        width: 150px;
        height: 150px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
        top: 60%;
        right: 12%;
        animation: float2 15s ease-in-out infinite;
      }
      
      .orb-3 {
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
        bottom: 15%;
        left: 15%;
        animation: float3 18s ease-in-out infinite;
      }
      
      /* ✅ PERFECT PROFESSIONAL CONTAINER - A PINCH WIDER */
      .booking-container {
        position: relative;
        z-index: 10;
        max-width: 1000px;
      }
      
      /* ✅ ENHANCED PROFESSIONAL HEADER WITH BETTER SPACING */
      .header-section {
        text-align: center;
        margin-bottom: 2rem;
        color: white;
        padding: 1.5rem 0;
      }
      
      .brand-section {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 1rem;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.6rem 1.2rem;
        border-radius: 40px;
        backdrop-filter: blur(15px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .brand-icon {
        font-size: 1.1rem;
      }
      
      .brand-text {
        font-size: 0.95rem;
        font-weight: 600;
        color: white;
        letter-spacing: 0.02em;
      }
      
      .page-title {
        font-size: 2.25rem;
        font-weight: 800;
        margin: 0.6rem 0;
        color: white;
        text-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        letter-spacing: -0.02em;
        background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .page-subtitle {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
        font-weight: 500;
        letter-spacing: 0.01em;
      }
      
      /* ✅ PERFECT MAIN CARD - REDUCED HEIGHT, PROFESSIONAL WIDTH */
      .booking-details-card {
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(25px) saturate(200%);
        -webkit-backdrop-filter: blur(25px) saturate(200%);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: 18px;
        box-shadow: 
          0 18px 45px rgba(0, 0, 0, 0.08),
          0 8px 25px rgba(124, 58, 237, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.95);
        position: relative;
        z-index: 10;
        animation: cardAppear 0.8s ease-out;
        transition: all 0.3s ease;
        margin-bottom: 2rem;
      }
      
      .booking-details-card:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 25px 60px rgba(0, 0, 0, 0.12),
          0 12px 30px rgba(124, 58, 237, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.98);
      }
      
      .card-body {
        padding: 2rem;
        color: #1f2937;
      }
      
      /* ✅ BIGGER, MORE PROFESSIONAL SECTION HEADERS */
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.8rem;
        border-bottom: 2px solid #e5e7eb;
      }
      
      .section-icon {
        width: 2.75rem;
        height: 2.75rem;
        background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.35rem;
        box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35);
        flex-shrink: 0;
      }
      
      .section-title {
        font-size: 1.4rem;
        font-weight: 800;
        color: #1a202c;
        margin: 0;
        letter-spacing: -0.01em;
      }
      
      /* ✅ PROFESSIONAL INFO GRID */
      .info-grid {
        display: grid;
        gap: 1.2rem;
      }
      
      .info-item {
        background: rgba(248, 250, 252, 0.8);
        border: 1px solid rgba(226, 232, 240, 0.7);
        border-radius: 12px;
        padding: 1.25rem;
        transition: all 0.3s ease;
      }
      
      .info-item:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(124, 58, 237, 0.25);
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }
      
      .info-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #6b7280;
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
        margin-top: 1rem;
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
        transform: translateY(-1px);
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
        font-size: 1.1rem;
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
        border-radius: 14px;
        padding: 1.75rem;
        text-align: center;
        color: white;
        margin-top: 1.2rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
      }
      
      .price-value {
        font-size: 2.25rem;
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
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.2rem;
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
        transform: translateY(-1px);
      }
      
      /* ✅ PURPLE BACK BUTTON - SAME AS YOUR BOOK NOW BUTTON */
      .button-section {
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #e5e7eb;
      }
      
      .modern-btn {
        border: none !important;
        border-radius: 25px !important;
        padding: 0.875rem 2.5rem !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        transition: all 0.3s ease !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.6rem !important;
        font-family: 'Inter', sans-serif !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
      }
      
      .modern-btn.purple {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%) !important;
        color: white !important;
        box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4) !important;
      }
      
      .modern-btn.purple:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%) !important;
        transform: translateY(-3px) scale(1.03) !important;
        box-shadow: 0 12px 28px rgba(139, 92, 246, 0.5) !important;
      }
      
      .btn-icon {
        font-size: 1rem;
        font-weight: 700;
      }
      
      /* ✅ LOADING & ERROR STATES */
      .loading-wrapper,
      .error-wrapper {
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(25px) saturate(200%);
        border-radius: 18px;
        padding: 2.5rem 2rem;
        text-align: center;
        box-shadow: 
          0 18px 45px rgba(0, 0, 0, 0.08),
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
        font-size: 0.95rem;
      }
      
      .modern-alert {
        border: none !important;
        border-radius: 12px !important;
        padding: 1rem !important;
        margin-bottom: 1.5rem !important;
        font-weight: 500 !important;
        font-size: 0.95rem !important;
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
      
      /* ✅ ANIMATIONS */
      @keyframes gradientShift {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        25% { transform: translate(15px, -15px) rotate(90deg) scale(1.03); }
        50% { transform: translate(-10px, -20px) rotate(180deg) scale(0.97); }
        75% { transform: translate(-20px, 10px) rotate(270deg) scale(1.02); }
      }
      
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        30% { transform: translate(-25px, -10px) rotate(108deg) scale(1.06); }
        70% { transform: translate(10px, -20px) rotate(252deg) scale(0.94); }
      }
      
      @keyframes float3 {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        20% { transform: translate(12px, -8px) scale(1.04) rotate(72deg); }
        40% { transform: translate(-8px, -15px) scale(0.96) rotate(144deg); }
        60% { transform: translate(-15px, 6px) scale(1.02) rotate(216deg); }
        80% { transform: translate(8px, 12px) scale(0.98) rotate(288deg); }
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
          transform: translateY(20px) scale(0.96); 
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
          font-size: 1.75rem;
        }
        
        .section-title {
          font-size: 1.2rem;
        }
        
        .section-icon {
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.2rem;
        }
        
        .date-section {
          grid-template-columns: 1fr;
        }
        
        .owner-grid {
          grid-template-columns: 1fr;
        }
        
        .price-value {
          font-size: 1.875rem;
        }
      }
      
      @media (max-width: 576px) {
        .card-body {
          padding: 1.25rem;
        }
        
        .page-title {
          font-size: 1.5rem;
        }
        
        .section-title {
          font-size: 1.1rem;
        }
        
        .section-icon {
          width: 2.25rem;
          height: 2.25rem;
          font-size: 1.1rem;
        }
        
        .price-value {
          font-size: 1.5rem;
        }
        
        .modern-btn {
          padding: 0.75rem 2rem !important;
          font-size: 0.9rem !important;
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
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
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
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>

          <Container className="booking-container">
            <div className="error-wrapper">
              <Alert variant="danger" className="modern-alert error-alert">
                {error}
              </Alert>
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="modern-btn purple"
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
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>

          <Container className="booking-container">
            <div className="error-wrapper">
              <Alert variant="warning" className="modern-alert warning-alert">
                Booking not found.
              </Alert>
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="modern-btn purple"
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
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        <Container className="booking-container">
          {/* ✅ ENHANCED PROFESSIONAL HEADER */}
          <div className="header-section">
            <div className="brand-section">
              <span className="brand-icon">📋</span>
              <span className="brand-text">SpaceLink</span>
            </div>
            <h1 className="page-title">Booking Details</h1>
            <p className="page-subtitle">Complete information about your reservation</p>
          </div>

          {/* ✅ PERFECT PROFESSIONAL MAIN CARD */}
          <Card className="booking-details-card">
            <Card.Body className="card-body">
              
              <Row>
                {/* ✅ PROPERTY INFORMATION - BIGGER HEADERS */}
                <Col md={6}>
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

                {/* ✅ BOOKING INFORMATION - BIGGER HEADERS */}
                <Col md={6}>
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

                    {booking.notes && (
                      <div className="info-item">
                        <label className="info-label">Notes</label>
                        <p className="info-value">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* ✅ DATE SECTION */}
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
                  
                  {/* ✅ PRICE SECTION */}
                  <div className="price-section">
                    <label className="info-label" style={{color: 'rgba(255, 255, 255, 0.8)'}}>Total Price</label>
                    <p className="price-value">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </Col>
              </Row>

              {/* ✅ OWNER INFORMATION - BIGGER HEADERS */}
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

              {/* ✅ PURPLE BACK BUTTON - SAME STYLE AS YOUR BOOK NOW BUTTON */}
              <div className="button-section">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(-1)} 
                  className="modern-btn purple"
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
