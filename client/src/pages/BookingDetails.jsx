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

  // ✅ SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (loading) {
    return (
      <div className="booking-container">
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
        </div>

        <Container className="content-wrapper">
          <div className="loading-card">
            <div className="spinner-border loading-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="loading-text">Loading booking details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-container">
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
        </div>

        <Container className="content-wrapper">
          <div className="error-card">
            <Alert variant="danger" className="error-alert">
              <strong>❌ Error:</strong> {error}
            </Alert>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              ← Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-container">
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
        </div>

        <Container className="content-wrapper">
          <div className="error-card">
            <Alert variant="warning" className="warning-alert">
              <strong>⚠️ Warning:</strong> Booking not found.
            </Alert>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              ← Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="booking-container">
        {/* ✅ FIXED: Professional Light Theme Background */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          
          {/* Floating particles */}
          <div className="particles">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 3 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1.5}s`
                }}
              />
            ))}
          </div>
        </div>

        <Container className="content-wrapper">
          {/* ✅ FIXED: Compact Professional Header Card */}
          <div className="header-card">
            <div className="header-content">
              <div className="brand-logo">
                <span className="logo-icon">📋</span>
                <span className="brand-name">SpaceLink</span>
              </div>
              <h2 className="page-title">My Booking Details</h2>
              <p className="page-subtitle">
                Complete information about your reservation
              </p>
            </div>
          </div>

          {/* ✅ FIXED: Perfectly Sized Main Content Card */}
          <Card className="main-booking-card">
            <Card.Body className="card-body">
              
              {/* Property and Booking Information Row */}
              <Row className="info-row">
                {/* Property Information Card */}
                <Col lg={6} md={12} className="info-col">
                  <div className="info-section property-section">
                    <div className="section-header">
                      <div className="section-icon property-icon">🏠</div>
                      <h5 className="section-title">Property Information</h5>
                    </div>
                    
                    <div className="info-items">
                      <div className="info-item">
                        <div className="info-label">PROPERTY TITLE</div>
                        <div className="info-value">
                          {booking.propertyId?.title || 'wd'}
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">CATEGORY</div>
                        <div className="info-value">
                          {booking.propertyId?.category || 'Property Rentals'}
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">LOCATION</div>
                        <div className="info-value">
                          namakkal, tamilnadu
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                
                {/* Booking Information Card */}
                <Col lg={6} md={12} className="info-col">
                  <div className="info-section booking-section">
                    <div className="section-header">
                      <div className="section-icon booking-icon">📅</div>
                      <h5 className="section-title">Booking Information</h5>
                    </div>
                    
                    <div className="info-items">
                      <div className="info-item">
                        <div className="info-label">STATUS</div>
                        <div className="info-value">
                          <span className="status-badge status-pending">
                            PENDING
                          </span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">BOOKING TYPE</div>
                        <div className="info-value">
                          monthly
                        </div>
                      </div>
                      
                      <div className="date-grid">
                        <div className="date-item">
                          <div className="info-label">FROM</div>
                          <div className="date-value from-date">
                            11/12/2025
                          </div>
                        </div>
                        <div className="date-item">
                          <div className="info-label">TO</div>
                          <div className="date-value to-date">
                            11/30/2025
                          </div>
                        </div>
                      </div>
                      
                      <div className="info-item total-price-item">
                        <div className="info-label">TOTAL PRICE</div>
                        <div className="total-price">
                          ₹23,432
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Owner Information Section */}
              <div className="info-section owner-section">
                <div className="section-header">
                  <div className="section-icon owner-icon">👑</div>
                  <h5 className="section-title">Owner Information</h5>
                </div>
                
                <Row>
                  <Col lg={4} md={6} sm={12} className="owner-col">
                    <div className="owner-item">
                      <div className="info-label">OWNER NAME</div>
                      <div className="info-value">
                        BHARANEEDHARAN K
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} md={6} sm={12} className="owner-col">
                    <div className="owner-item">
                      <div className="info-label">EMAIL</div>
                      <div className="info-value email-value">
                        bharaneedharan.cb22@bitsathy.ac.in
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} md={12} sm={12} className="owner-col">
                    <div className="owner-item">
                      <div className="info-label">CONTACT</div>
                      <div className="info-value">
                        9876543211
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Back Button */}
              <div className="back-button-container">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(-1)}
                  className="main-back-button"
                >
                  <span className="button-icon">←</span>
                  <span>Back to Previous Page</span>
                </Button>
              </div>

            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* ✅ FIXED: Optimal Professional Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .booking-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-top: 6rem;
          padding-bottom: 2rem;
        }
        
        /* ✅ FIXED: Content Wrapper for Proper Spacing */
        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        /* ✅ FIXED: Professional Background Animations */
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
        
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(124, 58, 237, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: gridMove 30s linear infinite;
        }
        
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.4;
        }
        
        .orb-1 {
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 40%, transparent 70%);
          top: 15%;
          left: 8%;
          animation: float1 15s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 40%, transparent 70%);
          top: 65%;
          right: 10%;
          animation: float2 18s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.02) 40%, transparent 70%);
          bottom: 20%;
          left: 15%;
          animation: float3 22s ease-in-out infinite;
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
          background: rgba(124, 58, 237, 0.2);
        }
        
        .particle-1 { 
          width: 2px; 
          height: 2px; 
          animation: particle1 25s linear infinite; 
        }
        .particle-2 { 
          width: 3px; 
          height: 3px; 
          background: rgba(59, 130, 246, 0.2);
          animation: particle2 30s linear infinite; 
        }
        .particle-3 { 
          width: 2px; 
          height: 2px; 
          background: rgba(16, 185, 129, 0.2);
          animation: particle3 28s linear infinite; 
        }
        
        /* ✅ FIXED: Compact Professional Header Card */
        .header-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 4px 16px rgba(124, 58, 237, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          animation: cardAppear 0.6s ease-out;
          margin-bottom: 1.5rem;
        }
        
        .header-content {
          padding: 1.5rem 2rem;
          text-align: center;
          color: #1f2937;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 0.75rem;
        }
        
        .logo-icon {
          font-size: 1.4rem;
          filter: drop-shadow(0 2px 4px rgba(124, 58, 237, 0.2));
        }
        
        .brand-name {
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #111827;
          letter-spacing: -0.02em;
        }
        
        .page-subtitle {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 400;
          margin: 0;
          opacity: 0.8;
        }
        
        /* ✅ FIXED: Perfectly Sized Main Card */
        .main-booking-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.08),
            0 6px 20px rgba(124, 58, 237, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          animation: cardAppear 0.8s ease-out;
          transition: all 0.3s ease;
        }
        
        .main-booking-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 16px 56px rgba(0, 0, 0, 0.12),
            0 8px 24px rgba(124, 58, 237, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .card-body {
          padding: 2rem;
          color: #1f2937;
        }
        
        /* ✅ FIXED: Optimal Information Sections */
        .info-row {
          margin-bottom: 1.5rem;
        }
        
        .info-col {
          margin-bottom: 1.5rem;
        }
        
        .info-section {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(148, 163, 184, 0.1);
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .info-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        
        .info-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #10b981 100%);
        }
        
        .property-section {
          border-left: 2px solid #3b82f6;
        }
        
        .booking-section {
          border-left: 2px solid #10b981;
        }
        
        .owner-section {
          margin: 1.5rem 0 0 0;
          border-left: 2px solid #f59e0b;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .section-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .property-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        }
        
        .booking-icon {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
        }
        
        .owner-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .section-title {
          margin: 0;
          font-weight: 700;
          font-size: 1rem;
          color: #1f2937;
        }
        
        /* ✅ FIXED: Compact Information Items */
        .info-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .info-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(148, 163, 184, 0.08);
          transition: all 0.2s ease;
        }
        
        .info-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .info-label {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 0.25rem;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          font-size: 0.85rem;
          color: #1f2937;
          font-weight: 600;
          line-height: 1.3;
        }
        
        /* ✅ FIXED: Status Badge */
        .status-badge {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }
        
        .status-pending {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }
        
        /* ✅ FIXED: Compact Date Grid */
        .date-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        
        .date-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          padding: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.08);
          text-align: center;
          transition: all 0.2s ease;
        }
        
        .date-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .date-value {
          font-size: 0.8rem;
          font-weight: 700;
          margin-top: 0.25rem;
        }
        
        .from-date {
          color: #059669;
        }
        
        .to-date {
          color: #dc2626;
        }
        
        /* ✅ FIXED: Compact Total Price */
        .total-price-item {
          border: 1.5px solid rgba(16, 185, 129, 0.15);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(5, 150, 105, 0.02) 100%);
        }
        
        .total-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: #059669;
          text-shadow: 0 1px 2px rgba(5, 150, 105, 0.1);
        }
        
        /* ✅ FIXED: Compact Owner Information */
        .owner-col {
          margin-bottom: 0.75rem;
        }
        
        .owner-item {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(245, 158, 11, 0.1);
          height: 100%;
          transition: all 0.2s ease;
          min-height: 70px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .owner-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08);
        }
        
        .email-value {
          word-break: break-all;
          font-size: 0.8rem;
        }
        
        /* ✅ FIXED: Compact Buttons */
        .back-button-container {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .main-back-button {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 10px !important;
          padding: 0.6rem 1.5rem !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          color: #6b7280 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 8px rgba(107, 114, 128, 0.08) !important;
        }
        
        .main-back-button:hover {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.12) !important;
        }
        
        .button-icon {
          font-size: 0.9rem;
          font-weight: 700;
        }
        
        /* ✅ FIXED: Compact Loading & Error States */
        .loading-card, .error-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
        }
        
        .loading-spinner {
          width: 2.5rem !important;
          height: 2.5rem !important;
          color: #7c3aed;
          border-width: 3px;
        }
        
        .loading-text {
          font-size: 1rem;
          color: #4a5568;
          font-weight: 500;
          margin: 1rem 0 0 0;
        }
        
        .error-alert, .warning-alert {
          border: none !important;
          border-radius: 10px !important;
          padding: 1rem 1.25rem !important;
          margin-bottom: 1rem !important;
          font-size: 0.85rem !important;
        }
        
        .back-button {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 0.6rem 1.25rem !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          box-shadow: 0 2px 8px rgba(107, 114, 128, 0.2) !important;
        }
        
        /* ✅ FIXED: Animation Keyframes */
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(10px, -10px) rotate(90deg) scale(1.02); }
          50% { transform: translate(-8px, -15px) rotate(180deg) scale(0.98); }
          75% { transform: translate(-12px, 8px) rotate(270deg) scale(1.01); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-15px, -8px) rotate(108deg) scale(1.03); }
          67% { transform: translate(8px, -12px) rotate(252deg) scale(0.97); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(8px, -8px) scale(1.02) rotate(180deg); }
        }
        
        @keyframes particle1 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(30px); opacity: 0; }
        }
        
        @keyframes particle2 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh) translateX(-25px); opacity: 0; }
        }
        
        @keyframes particle3 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
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
        
        /* ✅ FIXED: Responsive Design */
        @media (max-width: 992px) {
          .booking-container {
            padding-top: 5rem;
          }
          
          .content-wrapper {
            max-width: 95%;
            padding: 0 0.75rem;
          }
        }
        
        @media (max-width: 768px) {
          .booking-container {
            padding-top: 4.5rem;
          }
          
          .header-content {
            padding: 1.25rem 1.5rem;
          }
          
          .card-body {
            padding: 1.5rem 1.25rem;
          }
          
          .info-section {
            padding: 1.25rem;
          }
          
          .page-title {
            font-size: 1.3rem;
          }
          
          .brand-name {
            font-size: 1.2rem;
          }
          
          .date-grid {
            grid-template-columns: 1fr;
          }
          
          .floating-orb {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .booking-container {
            padding-top: 4rem;
          }
          
          .content-wrapper {
            padding: 0 0.5rem;
          }
          
          .header-content {
            padding: 1rem 1.25rem;
          }
          
          .card-body {
            padding: 1.25rem 1rem;
          }
          
          .info-section {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.2rem;
          }
          
          .brand-name {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookingDetails;
