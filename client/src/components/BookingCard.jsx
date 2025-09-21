import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { formatDate, formatPrice, getImageUrl } from '../utils/api';

const BookingCard = ({ booking, onCardClick }) => {
  
  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#f59e0b',
      approved: '#10b981', 
      active: '#3b82f6',
      rejected: '#ef4444',
      ended: '#6b7280',
      expired: '#ef4444',
      cancelled: '#374151'
    };
    return statusColors[status] || '#6b7280';
  };

  // Perfect sized status badge
  const StatusBadge = ({ status }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px', // Even smaller
      borderRadius: '16px',
      backgroundColor: getStatusColor(status),
      color: 'white',
      fontSize: '0.65rem', // Smaller font
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      boxShadow: `0 2px 6px ${getStatusColor(status)}25`
    }}>
      {status}
    </div>
  );

  // Compact icons
  const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const PriceIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  // Handle card click
  const handleCardClick = (e) => {
    // Prevent click if clicking on button
    if (e.target.closest('button')) return;
    if (onCardClick) {
      onCardClick(booking);
    }
  };

  return (
    <div 
      style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(226, 232, 240, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={handleCardClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
      }}
    >
      
      <Row className="align-items-center">
        
        {/* BIGGER Property Image - as requested */}
        <Col lg={3} md={4} className="mb-3 mb-md-0">
          <div style={{
            position: 'relative',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            aspectRatio: '4/3',
            height: '140px' // BIGGER - increased from 100px to 140px
          }}>
            <img 
              src={getImageUrl(booking.propertyId?.image)}
              alt={booking.propertyId?.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            
            {!booking.propertyId?.image && (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem', // Slightly bigger for larger image
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Property Image
              </div>
            )}
            
            {/* Property ID Badge */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.65rem',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              #{booking._id?.slice(-6)?.toUpperCase()}
            </div>
          </div>
        </Col>

        {/* Property Details - FIXED TYPOGRAPHY */}
        <Col lg={6} md={5}>
          <div style={{ paddingLeft: '16px' }}>
            
            {/* Header with PERFECT ALIGNMENT */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px' // More space
            }}>
              <div style={{ flex: 1, marginRight: '16px' }}>
                <h4 style={{
                  fontSize: '1.25rem', // Slightly bigger title
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 6px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.025em'
                }}>
                  {booking.propertyId?.title || `Property #${booking._id?.slice(-4)?.toUpperCase()}`}
                </h4>
                
                {/* Location with proper spacing */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                  fontSize: '0.85rem', // Slightly bigger
                  fontWeight: '500',
                  marginBottom: '2px'
                }}>
                  <LocationIcon />
                  {booking.propertyId?.address?.city}, {booking.propertyId?.address?.state}
                </div>
              </div>
              
              <StatusBadge status={booking.status} />
            </div>

            {/* Details Grid - PERFECT ALIGNMENT */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px 20px', // Better spacing
              fontSize: '0.8rem'
            }}>
              
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '4px' // More space
                }}>
                  Check-in
                </div>
                <div style={{
                  fontSize: '0.9rem', // Slightly bigger data
                  fontWeight: '600',
                  color: '#1e293b',
                  lineHeight: '1.3'
                }}>
                  {formatDate(booking.fromDate)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '4px'
                }}>
                  Check-out
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  lineHeight: '1.3'
                }}>
                  {formatDate(booking.toDate)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '4px'
                }}>
                  Booking Type
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  textTransform: 'capitalize',
                  lineHeight: '1.3'
                }}>
                  {booking.bookingType}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '4px'
                }}>
                  Payment
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  lineHeight: '1.3'
                }}>
                  {booking.paymentMode}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {booking.notes && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '4px'
                }}>
                  Notes
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: '1.4'
                }}>
                  {booking.notes}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Price & Actions - PERFECT ALIGNMENT */}
        <Col lg={3}>
          <div style={{
            textAlign: 'right',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            
            {/* Price Box */}
            <div style={{
              marginBottom: '16px',
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              minWidth: '140px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: '6px'
              }}>
                <PriceIcon />
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginLeft: '4px'
                }}>
                  Total Price
                </span>
              </div>
              <div style={{
                fontSize: '1.5rem', // Perfect size
                fontWeight: '800',
                color: '#059669',
                lineHeight: '1.2'
              }}>
                ₹{booking.totalPrice?.toLocaleString()}
              </div>
            </div>

            {/* Booking Date */}
            <div style={{ marginBottom: '16px', textAlign: 'right' }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                marginBottom: '4px'
              }}>
                Booked on
              </div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#64748b',
                lineHeight: '1.3'
              }}>
                {formatDate(booking.createdAt)}
              </div>
            </div>

            {/* SINGLE PERFECT-SIZED BUTTON */}
            <button 
              style={{
                width: '120px', // Fixed width - not too big
                padding: '8px 16px', // Perfect button size
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem', // Perfect button text size
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)';
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                if (onCardClick) onCardClick(booking);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Details
            </button>
          </div>
        </Col>
      </Row>

      {/* Subtle decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '40px',
        height: '40px',
        background: `radial-gradient(circle, ${getStatusColor(booking.status)}08, transparent)`,
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default BookingCard;
