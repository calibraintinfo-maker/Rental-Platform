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

  if (loading) {
    return (
      <div className="booking-container">
        {/* ✅ BEAUTIFUL: Professional Light Theme Background */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>

        <Container className="py-4 text-center">
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
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
        </div>

        <Container className="py-4">
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
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
        </div>

        <Container className="py-4">
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
        {/* ✅ BEAUTIFUL: Professional Light Theme Background */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          
          {/* Floating particles */}
          <div className="particles">
            {[...Array(12)].map((_, index) => (
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

        <Container>
          {/* ✅ PERFECT: Professional Header Card */}
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

          {/* ✅ PERFECT: Professional Main Content Card */}
          <Card className="main-booking-card">
            <Card.Body className="card-body">
              
              {/* Property and Booking Information Row */}
              <Row className="info-row">
                {/* Property Information Card */}
                <Col md={6} className="info-col">
                  <div className="info-section property-section">
                    <div className="section-header">
                      <div className="section-icon property-icon">🏠</div>
                      <h5 className="section-title">Property Information</h5>
                    </div>
                    
                    <div className="info-items">
                      <div className="info-item">
                        <div className="info-label">PROPERTY TITLE</div>
                        <div className="info-value">
                          {booking.propertyId?.title || 'Property Name Not Available'}
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">CATEGORY</div>
                        <div className="info-value">
                          {booking.propertyId?.category || 'Not specified'}
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">LOCATION</div>
                        <div className="info-value">
                          {booking.propertyId?.address?.city || 'City'}, {booking.propertyId?.address?.state || 'State'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                
                {/* Booking Information Card */}
                <Col md={6} className="info-col">
                  <div className="info-section booking-section">
                    <div className="section-header">
                      <div className="section-icon booking-icon">📅</div>
                      <h5 className="section-title">Booking Information</h5>
                    </div>
                    
                    <div className="info-items">
                      <div className="info-item">
                        <div className="info-label">STATUS</div>
                        <div className="info-value">
                          <span className={`status-badge status-${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <div className="info-label">BOOKING TYPE</div>
                        <div className="info-value">
                          {booking.bookingType || 'Not specified'}
                        </div>
                      </div>
                      
                      <div className="date-grid">
                        <div className="date-item">
                          <div className="info-label">FROM</div>
                          <div className="date-value from-date">
                            {new Date(booking.fromDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="date-item">
                          <div className="info-label">TO</div>
                          <div className="date-value to-date">
                            {new Date(booking.toDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="info-item total-price-item">
                        <div className="info-label">TOTAL PRICE</div>
                        <div className="total-price">
                          ₹{booking.totalPrice?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Additional Notes Section (if exists) */}
              {booking.notes && (
                <div className="info-section notes-section">
                  <div className="section-header">
                    <div className="section-icon notes-icon">📝</div>
                    <h5 className="section-title">Additional Notes</h5>
                  </div>
                  <div className="notes-content">
                    {booking.notes}
                  </div>
                </div>
              )}

              {/* Owner Information Section */}
              <div className="info-section owner-section">
                <div className="section-header">
                  <div className="section-icon owner-icon">👑</div>
                  <h5 className="section-title">Owner Information</h5>
                </div>
                
                <Row>
                  <Col md={4} className="owner-col">
                    <div className="owner-item">
                      <div className="info-label">OWNER NAME</div>
                      <div className="info-value">
                        {booking.propertyId?.ownerId?.name || booking.propertyId?.ownerId || 'N/A'}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="owner-col">
                    <div className="owner-item">
                      <div className="info-label">EMAIL</div>
                      <div className="info-value email-value">
                        {booking.propertyId?.ownerId?.email || 'N/A'}
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="owner-col">
                    <div className="owner-item">
                      <div className="info-label">CONTACT</div>
                      <div className="info-value">
                        {booking.propertyId?.ownerId?.contact || 'N/A'}
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

      {/* ✅ PERFECT: Professional Light Theme Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .booking-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        
        /* ✅ BEAUTIFUL: Professional Background Animations */
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
          background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%);
          top: 10%;
          left: 8%;
          animation: float1 12s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%);
          top: 60%;
          right: 10%;
          animation: float2 15s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 40%, transparent 70%);
          bottom: 20%;
          left: 12%;
          animation: float3 18s ease-in-out infinite;
        }
        
        .orb-4 {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(245, 101, 101, 0.08) 0%, rgba(245, 101, 101, 0.02) 40%, transparent 70%);
          top: 35%;
          left: 65%;
          animation: float4 20s ease-in-out infinite;
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
          background: rgba(124, 58, 237, 0.3);
        }
        
        .particle-1 { 
          width: 3px; 
          height: 3px; 
          animation: particle1 20s linear infinite; 
        }
        .particle-2 { 
          width: 2px; 
          height: 2px; 
          background: rgba(59, 130, 246, 0.3);
          animation: particle2 25s linear infinite; 
        }
        .particle-3 { 
          width: 4px; 
          height: 4px; 
          background: rgba(16, 185, 129, 0.3);
          animation: particle3 22s linear infinite; 
        }
        .particle-4 { 
          width: 2px; 
          height: 2px; 
          background: rgba(245, 101, 101, 0.3);
          animation: particle4 18s linear infinite; 
        }
        
        /* ✅ PERFECT: Professional Header Card */
        .header-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.1),
            0 8px 25px rgba(124, 58, 237, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          position: relative;
          z-index: 10;
          animation: cardAppear 0.8s ease-out;
          margin-bottom: 1.5rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .header-content {
          padding: 2rem;
          text-align: center;
          color: #1f2937;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 1rem;
        }
        
        .logo-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 6px rgba(124, 58, 237, 0.3));
        }
        
        .brand-name {
          font-size: 1.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        
        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #111827;
          letter-spacing: -0.02em;
        }
        
        .page-subtitle {
          color: #6b7280;
          font-size: 0.95rem;
          font-weight: 400;
          margin: 0;
          opacity: 0.8;
        }
        
        /* ✅ PERFECT: Professional Main Card */
        .main-booking-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          box-shadow: 
            0 25px 70px rgba(0, 0, 0, 0.12),
            0 8px 25px rgba(124, 58, 237, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          position: relative;
          z-index: 10;
          animation: cardAppear 0.9s ease-out;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .main-booking-card:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.15),
            0 10px 30px rgba(124, 58, 237, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .card-body {
          padding: 2.5rem;
          color: #1f2937;
        }
        
        /* ✅ PERFECT: Information Sections */
        .info-row {
          margin-bottom: 2rem;
        }
        
        .info-col {
          margin-bottom: 1.5rem;
        }
        
        .info-section {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
          borderRadius: 18px;
          padding: 1.75rem;
          border: 1px solid rgba(148, 163, 184, 0.15);
          height: 100%;
          min-height: 280px;
          position: relative;
          overflow: hidden;
        }
        
        .info-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #10b981 100%);
        }
        
        .property-section {
          border-left: 3px solid #3b82f6;
        }
        
        .booking-section {
          border-left: 3px solid #10b981;
        }
        
        .notes-section {
          margin: 1.5rem 0;
          border-left: 3px solid #8b5cf6;
          min-height: auto;
        }
        
        .owner-section {
          margin: 1.5rem 0;
          border-left: 3px solid #f59e0b;
          min-height: auto;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        }
        
        .section-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        
        .property-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        }
        
        .booking-icon {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
        }
        
        .notes-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }
        
        .owner-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .section-title {
          margin: 0;
          font-weight: 700;
          font-size: 1.15rem;
          color: #1f2937;
        }
        
        /* ✅ PERFECT: Information Items */
        .info-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .info-item {
          background: rgba(255, 255, 255, 0.85);
          borderRadius: 12px;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(148, 163, 184, 0.1);
          transition: all 0.3s ease;
        }
        
        .info-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        .info-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 0.4rem;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          font-size: 0.95rem;
          color: #1f2937;
          font-weight: 600;
          line-height: 1.4;
        }
        
        /* ✅ PERFECT: Status Badge */
        .status-badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }
        
        .status-pending {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }
        
        .status-approved {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .status-rejected {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        
        .status-ended {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        }
        
        /* ✅ PERFECT: Date Grid */
        .date-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .date-item {
          background: rgba(255, 255, 255, 0.85);
          borderRadius: 12px;
          padding: 1rem;
          border: 1px solid rgba(148, 163, 184, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .date-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        .date-value {
          font-size: 0.9rem;
          font-weight: 700;
          margin-top: 0.3rem;
        }
        
        .from-date {
          color: #059669;
        }
        
        .to-date {
          color: #dc2626;
        }
        
        /* ✅ PERFECT: Total Price */
        .total-price-item {
          border: 2px solid rgba(16, 185, 129, 0.2);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.02) 100%);
        }
        
        .total-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: #059669;
          text-shadow: 0 1px 3px rgba(5, 150, 105, 0.2);
        }
        
        /* ✅ PERFECT: Notes Section */
        .notes-content {
          background: rgba(255, 255, 255, 0.85);
          borderRadius: 12px;
          padding: 1.25rem;
          border: 1px solid rgba(139, 92, 246, 0.15);
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.6;
          border-left: 3px solid #8b5cf6;
        }
        
        /* ✅ PERFECT: Owner Information */
        .owner-col {
          margin-bottom: 1rem;
        }
        
        .owner-item {
          background: rgba(255, 255, 255, 0.85);
          borderRadius: 12px;
          padding: 1.25rem;
          border: 1px solid rgba(245, 158, 11, 0.15);
          height: 100%;
          transition: all 0.3s ease;
          min-height: 90px;
        }
        
        .owner-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.15);
        }
        
        .email-value {
          word-break: break-all;
          font-size: 0.85rem;
        }
        
        /* ✅ PERFECT: Buttons */
        .back-button-container {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(148, 163, 184, 0.15);
        }
        
        .main-back-button {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid #e5e7eb !important;
          border-radius: 14px !important;
          padding: 0.85rem 2.5rem !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          color: #6b7280 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.1) !important;
        }
        
        .main-back-button:hover {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(107, 114, 128, 0.2) !important;
        }
        
        .button-icon {
          font-size: 1rem;
          font-weight: 700;
        }
        
        /* ✅ PERFECT: Loading & Error States */
        .loading-card, .error-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border-radius: 20px;
          padding: 3rem 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        
        .loading-spinner {
          width: 3rem !important;
          height: 3rem !important;
          color: #7c3aed;
          border-width: 3px;
        }
        
        .loading-text {
          font-size: 1.1rem;
          color: #4a5568;
          font-weight: 500;
          margin: 1.5rem 0 0 0;
        }
        
        .error-alert, .warning-alert {
          border: none !important;
          border-radius: 12px !important;
          padding: 1.25rem 1.5rem !important;
          margin-bottom: 1.5rem !important;
          font-size: 0.9rem !important;
        }
        
        .error-alert {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%) !important;
          color: #dc2626 !important;
        }
        
        .warning-alert {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%) !important;
          color: #d97706 !important;
        }
        
        .back-button {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 0.75rem 1.5rem !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3) !important;
        }
        
        /* ✅ BEAUTIFUL: Animation Keyframes */
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(15px, -15px) rotate(90deg) scale(1.02); }
          50% { transform: translate(-10px, -20px) rotate(180deg) scale(0.98); }
          75% { transform: translate(-18px, 10px) rotate(270deg) scale(1.01); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          30% { transform: translate(-20px, -10px) rotate(108deg) scale(1.04); }
          70% { transform: translate(10px, -18px) rotate(252deg) scale(0.96); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          20% { transform: translate(10px, -8px) scale(1.03) rotate(72deg); }
          40% { transform: translate(-8px, -15px) scale(0.97) rotate(144deg); }
          60% { transform: translate(-15px, 5px) scale(1.02) rotate(216deg); }
          80% { transform: translate(8px, 12px) scale(0.98) rotate(288deg); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8px, -12px) scale(1.05); }
          66% { transform: translate(-12px, 8px) scale(0.95); }
        }
        
        @keyframes particle1 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) translateX(50px); opacity: 0; }
        }
        
        @keyframes particle2 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(-40px); opacity: 0; }
        }
        
        @keyframes particle3 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) translateX(30px); opacity: 0; }
        }
        
        @keyframes particle4 {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh) translateX(-20px); opacity: 0; }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes cardAppear {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        /* ✅ RESPONSIVE: Mobile Optimizations */
        @media (max-width: 768px) {
          .booking-container {
            padding-top: 1.5rem;
          }
          
          .header-content {
            padding: 1.5rem;
          }
          
          .card-body {
            padding: 2rem 1.5rem;
          }
          
          .info-section {
            padding: 1.5rem;
            min-height: auto;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .brand-name {
            font-size: 1.4rem;
          }
          
          .date-grid {
            grid-template-columns: 1fr;
          }
          
          .orb-1, .orb-2, .orb-3, .orb-4 {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .booking-container {
            padding-top: 1rem;
          }
          
          .header-content {
            padding: 1.25rem;
          }
          
          .card-body {
            padding: 1.5rem 1rem;
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
        }
      `}</style>
    </>
  );
};

export default BookingDetails;
