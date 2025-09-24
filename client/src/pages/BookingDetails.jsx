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
      <div className="modern-booking-container">
        <Container className="modern-container">
          <div className="loading-wrapper">
            <div className="modern-spinner"></div>
            <p className="loading-text">Loading booking details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-booking-container">
        <Container className="modern-container">
          <div className="error-wrapper">
            <Alert variant="danger" className="modern-alert error-alert">
              {error}
            </Alert>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
              className="modern-btn secondary"
            >
              Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="modern-booking-container">
        <Container className="modern-container">
          <div className="error-wrapper">
            <Alert variant="warning" className="modern-alert warning-alert">
              Booking not found.
            </Alert>
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
              className="modern-btn secondary"
            >
              Go Back
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="modern-booking-container">
        <Container className="modern-container">
          {/* Header */}
          <div className="modern-header">
            <div className="brand-section">
              <span className="brand-icon">📋</span>
              <span className="brand-text">SpaceLink</span>
            </div>
            <h1 className="page-title">My Booking Details</h1>
            <p className="page-subtitle">Complete information about your reservation</p>
          </div>

          {/* Main Content Card */}
          <Card className="modern-card">
            <Card.Body className="modern-card-body">
              <Row>
                {/* Property Information */}
                <Col md={6}>
                  <div className="info-section">
                    <div className="section-header">
                      <h5 className="section-title">
                        <span className="section-icon">🏠</span>
                        Property Information
                      </h5>
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <label className="info-label">Title</label>
                        <p className="info-value">{booking.propertyId?.title || 'sdf'}</p>
                      </div>
                      <div className="info-item">
                        <label className="info-label">Category</label>
                        <p className="info-value">{booking.propertyId?.category || 'Commercial'}</p>
                      </div>
                      <div className="info-item">
                        <label className="info-label">Address</label>
                        <p className="info-value">
                          namakkal, tamilnadu
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Booking Information */}
                <Col md={6}>
                  <div className="info-section">
                    <div className="section-header">
                      <h5 className="section-title">
                        <span className="section-icon">📅</span>
                        Booking Information
                      </h5>
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <label className="info-label">Status</label>
                        <span className="status-badge status-pending">PENDING</span>
                      </div>
                      <div className="info-item">
                        <label className="info-label">Type</label>
                        <p className="info-value">monthly</p>
                      </div>
                      <div className="date-row">
                        <div className="date-item">
                          <label className="info-label">From</label>
                          <p className="date-value from-date">11/12/2025</p>
                        </div>
                        <div className="date-item">
                          <label className="info-label">To</label>
                          <p className="date-value to-date">11/30/2025</p>
                        </div>
                      </div>
                      <div className="info-item price-item">
                        <label className="info-label">Total Price</label>
                        <p className="price-value">₹23,432</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <hr className="modern-divider" />

              {/* Owner Information */}
              <div className="info-section">
                <div className="section-header">
                  <h5 className="section-title">
                    <span className="section-icon">👑</span>
                    Owner Information
                  </h5>
                </div>
                <Row>
                  <Col md={4}>
                    <div className="info-item">
                      <label className="info-label">Name</label>
                      <p className="info-value">BHARANEEDHARAN K</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="info-item">
                      <label className="info-label">Email</label>
                      <p className="info-value email-text">bharaneedharan.cb22@bitsathy.ac.in</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="info-item">
                      <label className="info-label">Contact</label>
                      <p className="info-value">9876543211</p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Back Button */}
              <div className="button-section">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(-1)} 
                  className="modern-btn back-btn"
                >
                  <span className="btn-icon">←</span>
                  Back
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modern Clean Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        /* Container & Layout */
        .modern-booking-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .modern-container {
          max-width: 900px;
          padding: 0 1rem;
        }
        
        /* Header */
        .modern-header {
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
        
        /* Main Card */
        .modern-card {
          background: white;
          border: none;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .modern-card-body {
          padding: 2.5rem;
        }
        
        /* Info Sections */
        .info-section {
          margin-bottom: 2rem;
        }
        
        .section-header {
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }
        
        .section-icon {
          font-size: 1.1rem;
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #718096;
          margin-bottom: 0.25rem;
        }
        
        .info-value {
          font-size: 1rem;
          font-weight: 500;
          color: #1a202c;
          margin: 0;
          line-height: 1.4;
        }
        
        .email-text {
          word-break: break-word;
          font-size: 0.9rem;
        }
        
        /* Status Badge */
        .status-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.25rem;
        }
        
        .status-pending {
          background: #fed7aa;
          color: #c2410c;
        }
        
        /* Date Row */
        .date-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .date-item {
          display: flex;
          flex-direction: column;
        }
        
        .date-value {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          margin-top: 0.25rem;
        }
        
        .from-date {
          color: #059669;
        }
        
        .to-date {
          color: #dc2626;
        }
        
        /* Price */
        .price-item {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e0f2fe;
        }
        
        .price-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0369a1;
          margin: 0;
          margin-top: 0.25rem;
        }
        
        /* Divider */
        .modern-divider {
          border: none;
          height: 1px;
          background: #e2e8f0;
          margin: 2rem 0;
        }
        
        /* Buttons */
        .button-section {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .modern-btn {
          border: none !important;
          border-radius: 8px !important;
          padding: 0.75rem 2rem !important;
          font-weight: 500 !important;
          font-size: 0.95rem !important;
          transition: all 0.2s ease !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
        }
        
        .back-btn {
          background: #f8fafc !important;
          color: #475569 !important;
          border: 1px solid #e2e8f0 !important;
        }
        
        .back-btn:hover {
          background: #e2e8f0 !important;
          color: #334155 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .secondary {
          background: #6b7280 !important;
          color: white !important;
        }
        
        .secondary:hover {
          background: #4b5563 !important;
          transform: translateY(-1px);
        }
        
        .btn-icon {
          font-size: 1rem;
          font-weight: 600;
        }
        
        /* Loading & Error States */
        .loading-wrapper,
        .error-wrapper {
          background: white;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 0 auto;
        }
        
        .modern-spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-text {
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }
        
        .modern-alert {
          border: none !important;
          border-radius: 8px !important;
          padding: 1rem !important;
          margin-bottom: 1.5rem !important;
          font-weight: 500 !important;
        }
        
        .error-alert {
          background: #fef2f2 !important;
          color: #991b1b !important;
        }
        
        .warning-alert {
          background: #fffbeb !important;
          color: #92400e !important;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .modern-booking-container {
            padding: 1rem 0;
          }
          
          .modern-container {
            padding: 0 0.75rem;
          }
          
          .modern-card-body {
            padding: 1.5rem;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
          
          .date-row {
            grid-template-columns: 1fr;
          }
          
          .loading-wrapper,
          .error-wrapper {
            padding: 2rem 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .modern-card-body {
            padding: 1.25rem;
          }
          
          .page-title {
            font-size: 1.35rem;
          }
          
          .brand-section {
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookingDetails;
