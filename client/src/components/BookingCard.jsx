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

  // SINGLE Status badge - PROPERLY POSITIONED
  const StatusBadge = ({ status }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 14px',
      borderRadius: '20px',
      backgroundColor: getStatusColor(status),
      color: 'white',
      fontSize: '0.65rem', 
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: `0 2px 8px ${getStatusColor(status)}30`,
      whiteSpace: 'nowrap'
    }}>
      {status}
    </div>
  );

  // Icons
  const LocationIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px', flexShrink: 0 }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const PriceIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  // FIXED: Proper card click handling
  const handleCardClick = (e) => {
    // Only trigger if not clicking on button
    if (e.target.closest('button')) return;
    
    if (onCardClick) {
      onCardClick(booking);
    }
  };

  return (
    <div 
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        boxShadow: '0 3px 15px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(226, 232, 240, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
      }}
      onClick={handleCardClick} // FIXED: Now clickable
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.12)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = '0 3px 15px rgba(0, 0, 0, 0.08)';
      }}
    >
      
      <Row className="align-items-center">
        
        {/* BIGGER Property Image */}
        <Col lg={3} md={4} className="mb-3 mb-md-0">
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            aspectRatio: '4/3',
            height: '160px' // BIGGER IMAGE
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
                fontSize: '0.85rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Property Image
              </div>
            )}
            
            {/* Property ID Badge */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '15px',
              fontSize: '0.65rem',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              #{booking._id?.slice(-6)?.toUpperCase()}
            </div>
          </div>
        </Col>

        {/* Property Details - FIXED ALIGNMENT */}
        <Col lg={6} md={5}>
          <div style={{ paddingLeft: '20px' }}>
            
            {/* Header with SINGLE STATUS BADGE */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '18px',
              gap: '16px'
            }}>
              <div style={{ 
                flex: 1,
                minWidth: 0
              }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.025em'
                }}>
                  {booking.propertyId?.title || `Property #${booking._id?.slice(-4)?.toUpperCase()}`}
                </h4>
                
                {/* Location */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  lineHeight: '1.4'
                }}>
                  <LocationIcon />
                  <span>{booking.propertyId?.address?.city}, {booking.propertyId?.address?.state}</span>
                </div>
              </div>
              
              {/* SINGLE Status Badge - NO DUPLICATES */}
              <div style={{ flexShrink: 0 }}>
                <StatusBadge status={booking.status} />
              </div>
            </div>

            {/* Details Grid - PERFECT ALIGNMENT */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px 24px',
              fontSize: '0.8rem'
            }}>
              
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  marginBottom: '6px',
                  lineHeight: '1'
                }}>
                  Check-in
                </div>
                <div style={{
                  fontSize: '0.9rem',
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
                  letterSpacing: '0.4px',
                  marginBottom: '6px',
                  lineHeight: '1'
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
                  letterSpacing: '0.4px',
                  marginBottom: '6px',
                  lineHeight: '1'
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
                  letterSpacing: '0.4px',
                  marginBottom: '6px',
                  lineHeight: '1'
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
                marginTop: '18px',
                padding: '14px',
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '10px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  marginBottom: '6px',
                  lineHeight: '1'
                }}>
                  Notes
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#475569',
                  lineHeight: '1.4'
                }}>
                  {booking.notes}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Price & Actions - SINGLE BUTTON ONLY */}
        <Col lg={3}>
          <div style={{
            textAlign: 'right',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            height: '100%',
            justifyContent: 'center'
          }}>
            
            {/* PERFECT Price Box */}
            <div style={{
              marginBottom: '18px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              minWidth: '160px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                gap: '6px'
              }}>
                <PriceIcon />
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}>
                  Total Price
                </span>
              </div>
              <div style={{
                fontSize: '1.6rem',
                fontWeight: '800',
                color: '#059669',
                lineHeight: '1.2',
                letterSpacing: '-0.025em'
              }}>
                ₹{booking.totalPrice?.toLocaleString()}
              </div>
            </div>

            {/* Booking Date */}
            <div style={{ 
              marginBottom: '18px', 
              textAlign: 'center',
              minWidth: '160px'
            }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: '6px',
                lineHeight: '1'
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

            {/* SINGLE BUTTON - NO DUPLICATES */}
            <button 
              style={{
                width: '140px',
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 3px 12px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 10 // Ensure button is on top
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 3px 12px rgba(59, 130, 246, 0.3)';
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onCardClick) onCardClick(booking);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span style={{ 
                color: 'white', 
                fontWeight: '600',
                opacity: '1',
                visibility: 'visible'
              }}>
                View Details
              </span>
            </button>
          </div>
        </Col>
      </Row>

      {/* Decorative element */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        right: '-12px',
        width: '50px',
        height: '50px',
        background: `radial-gradient(circle, ${getStatusColor(booking.status)}08, transparent)`,
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default BookingCard;
