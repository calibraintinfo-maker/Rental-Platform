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
        padding: 1.5rem 0;
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
      
      /* ✅ COMPACT CONTAINER */
      .booking-container {
        position: relative;
        z-index: 10;
        max-width: 850px;
      }
      
      /* ✅ COMPACT PROFESSIONAL HEADER */
      .header-section {
        text-align: center;
        margin-bottom: 1.5rem;
        color: white;
      }
      
      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.25rem 0;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        letter-spacing: -0.025em;
      }
      
      .page-subtitle {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        font-weight: 500;
      }
      
      /* ✅ COMPACT CARD */
      .booking-details-card {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.9);
        border-radius: 16px;
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 1);
        position: relative;
        z-index: 10;
        animation: cardAppear 0.6s ease-out;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .booking-details-card:hover {
        transform: translateY(-2px);
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.12),
          0 10px 20px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 1);
      }
      
      .card-body {
        padding: 1.5rem;
        color: #1f2937;
      }
      
      /* ✅ COMPACT GRID LAYOUT */
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      /* ✅ SECTION HEADERS - PROPER SPACING */
      .section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .section-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e5e7eb;
        margin-bottom: 0.25rem;
      }
      
      .section-icon {
        width: 1.75rem;
        height: 1.75rem;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.9rem;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        flex-shrink: 0;
      }
      
      .section-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
        letter-spacing: -0.01em;
      }
      
      /* ✅ PROPER TEXT SIZES - READABLE */
      .data-grid {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
      }
      
      .data-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.7rem 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
        min-height: auto;
        gap: 1rem;
      }
      
      .data-item:last-child {
        border-bottom: none;
      }
      
      .data-item:hover {
        background: rgba(99, 102, 241, 0.02);
        margin: 0 -0.6rem;
        padding: 0.7rem 0.6rem;
        border-radius: 8px;
        border-bottom: 1px solid transparent;
      }
      
      .data-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        flex-shrink: 0;
        min-width: fit-content;
      }
      
      .data-value {
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
        text-align: right;
        word-break: break-word;
        max-width: 60%;
        line-height: 1.3;
      }
      
      /* ✅ STATUS BADGE - PROPER SIZE */
      .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.7rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        box-shadow: 0 1px 3px rgba(245, 158, 11, 0.4);
        white-space: nowrap;
      }
      
      /* ✅ DATES SECTION - COMPACT */
      .dates-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      
      .date-item {
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 10px;
        text-align: center;
        transition: all 0.2s ease;
      }
      
      .date-item:hover {
        background: rgba(99, 102, 241, 0.04);
        transform: translateY(-1px);
      }
      
      .date-item.from-date {
        background: rgba(16, 185, 129, 0.08);
      }
      
      .date-item.to-date {
        background: rgba(239, 68, 68, 0.08);
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
      
      /* ✅ PRICE SECTION - PERFECT SIZE */
      .price-section {
        background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
        border-radius: 12px;
        padding: 1rem;
        text-align: center;
        color: white;
        margin-top: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .price-label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 0.3rem;
      }
      
      .price-value {
        font-size: 1.5rem;
        font-weight: 800;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      /* ✅ OWNER SECTION - PROPER SPACING */
      .owner-section {
        margin-top: 1.5rem;
      }
      
      .owner-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      
      .owner-card {
        background: rgba(0, 0, 0, 0.02);
        border-radius: 10px;
        padding: 0.75rem;
        transition: all 0.2s ease;
      }
      
      .owner-card:hover {
        background: rgba(99, 102, 241, 0.04);
        transform: translateY(-1px);
      }
      
      /* ✅ SPECIAL FIX FOR EMAIL - NO WRAPPING */
      .owner-card .data-value {
        font-size: 0.8rem;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      /* ✅ COMPACT BUTTON SECTION */
      .button-section {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e5e7eb;
      }
      
      .purple-button {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%) !important;
        border: none !important;
        border-radius: 25px !important;
        padding: 0.6rem 1.8rem !important;
        font-weight: 700 !important;
        font-size: 0.85rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        color: white !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.4rem !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4) !important;
        font-family: 'Inter', sans-serif !important;
      }
      
      .purple-button:hover {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5) !important;
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
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        max-width: 350px;
        margin: 0 auto;
        animation: cardAppear 0.6s ease-out;
      }
      
      .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #6366f1;
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
        border-radius: 12px !important;
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
          transform: translateY(10px) scale(0.98); 
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
          gap: 1.25rem;
        }
        
        .dates-section {
          grid-template-columns: 1fr;
        }
        
        .owner-grid {
          grid-template-columns: 1fr;
        }
        
        .card-body {
          padding: 1.25rem;
        }
        
        .page-title {
          font-size: 1.5rem;
        }
        
        .booking-details-container {
          padding: 1rem 0;
        }
        
        .data-value {
          max-width: 55%;
        }
        
        .owner-card .data-value {
          max-width: 100%;
        }
      }
      
      @media (max-width: 480px) {
        .card-body {
          padding: 1rem;
        }
        
        .page-title {
          font-size: 1.25rem;
        }
        
        .section-title {
          font-size: 0.95rem;
        }
        
        .data-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        
        .data-value {
          max-width: 100%;
          text-align: left;
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

          {/* ✅ PERFECT PROFESSIONAL CARD */}
          <Card className="booking-details-card">
            <Card.Body className="card-body">
              
              {/* ✅ TWO-COLUMN GRID */}
              <div className="content-grid">
                
                {/* ✅ PROPERTY SECTION */}
                <div className="section">
                  <div className="section-header">
                    <div className="section-icon">🏠</div>
                    <h3 className="section-title">Property Information</h3>
                  </div>
                  
                  <div className="data-grid">
                    <div className="data-item">
                      <span className="data-label">Property Title</span>
                      <span className="data-value">{booking.propertyId?.title || 'N/A'}</span>
                    </div>
                    
                    <div className="data-item">
                      <span className="data-label">Category</span>
                      <span className="data-value">{booking.propertyId?.category || 'N/A'}</span>
                    </div>
                    
                    <div className="data-item">
                      <span className="data-label">Location</span>
                      <span className="data-value">
                        {booking.propertyId?.address?.city || 'N/A'}, {booking.propertyId?.address?.state || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ BOOKING SECTION */}
                <div className="section">
                  <div className="section-header">
                    <div className="section-icon">📅</div>
                    <h3 className="section-title">Booking Information</h3>
                  </div>
                  
                  <div className="data-grid">
                    <div className="data-item">
                      <span className="data-label">Status</span>
                      <span className="status-badge">{booking.status}</span>
                    </div>
                    
                    <div className="data-item">
                      <span className="data-label">Booking Type</span>
                      <span className="data-value">{booking.bookingType}</span>
                    </div>

                    {booking.notes && (
                      <div className="data-item">
                        <span className="data-label">Notes</span>
                        <span className="data-value">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* ✅ DATES SIDE BY SIDE */}
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

              {/* ✅ OWNER SECTION WITH FIXED EMAIL */}
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

              {/* ✅ PURPLE BACK BUTTON */}
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
