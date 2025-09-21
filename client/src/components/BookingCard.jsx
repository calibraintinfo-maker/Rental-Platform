import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { formatDate, formatPrice, getImageUrl } from '../utils/api';

const BookingCard = ({ booking }) => {
  
  // Enhanced status badge logic with professional styling
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

  // Professional status badge component
  const StatusBadge = ({ status }) => (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      borderRadius: '20px',
      backgroundColor: getStatusColor(status),
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: `0 4px 12px ${getStatusColor(status)}40`,
      border: `2px solid ${getStatusColor(status)}20`
    }}>
      {status}
    </div>
  );

  // Professional icons
  const LocationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const PriceIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Main Content Layout */}
      <Row className="align-items-center">
        
        {/* Property Image - Enhanced */}
        <Col lg={3} md={4} className="mb-3 mb-md-0">
          <div style={{
            position: 'relative',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            aspectRatio: '4/3'
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
            
            {/* Fallback for missing image */}
            {!booking.propertyId?.image && (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Property Image
              </div>
            )}
            
            {/* Property ID Badge */}
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(12px)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '25px',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.8px'
            }}>
              #{booking._id?.slice(-6)?.toUpperCase()}
            </div>
          </div>
        </Col>

        {/* Property Details - Professional Layout */}
        <Col lg={6} md={8}>
          <div style={{ paddingLeft: '28px' }}>
            
            {/* Header with Title and Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3',
                  letterSpacing: '-0.025em'
                }}>
                  {booking.propertyId?.title || `Property #${booking._id?.slice(-4)?.toUpperCase()}`}
                </h3>
                
                {/* Location with Icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  <LocationIcon />
                  {booking.propertyId?.address?.city}, {booking.propertyId?.address?.state}
                </div>
              </div>
              
              {/* Status Badge */}
              <StatusBadge status={booking.status} />
            </div>

            {/* Booking Details Grid - Professional */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px 24px',
              marginTop: '24px'
            }}>
              
              {/* Check-in Date */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  <CalendarIcon />
                  <span style={{ marginLeft: '4px' }}>Check-in</span>
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {formatDate(booking.fromDate)}
                </div>
              </div>

              {/* Check-out Date */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  <CalendarIcon />
                  <span style={{ marginLeft: '4px' }}>Check-out</span>
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {formatDate(booking.toDate)}
                </div>
              </div>

              {/* Booking Type */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Booking Type
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  textTransform: 'capitalize'
                }}>
                  {booking.bookingType}
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Payment
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {booking.paymentMode}
                </div>
              </div>
            </div>

            {/* Notes Section - Enhanced */}
            {booking.notes && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Notes
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#475569',
                  lineHeight: '1.5'
                }}>
                  {booking.notes}
                </div>
              </div>
            )}
          </div>
        </Col>

        {/* Price & Booking Info - Enhanced */}
        <Col lg={3}>
          <div style={{
            textAlign: 'right',
            paddingLeft: '28px'
          }}>
            
            {/* Total Price - Professional */}
            <div style={{
              marginBottom: '20px',
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))',
              borderRadius: '16px',
              border: '2px solid rgba(16, 185, 129, 0.15)',
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: '8px'
              }}>
                <PriceIcon />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginLeft: '6px'
                }}>
                  Total Price
                </span>
              </div>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#059669',
                lineHeight: '1.2'
              }}>
                ₹{booking.totalPrice?.toLocaleString()}
              </div>
            </div>

            {/* Booking Date */}
            <div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>
                Booked on
              </div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#64748b'
              }}>
                {formatDate(booking.createdAt)}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Subtle Professional Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-25px',
        right: '-25px',
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${getStatusColor(booking.status)}10, transparent)`,
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        left: '-20px',
        width: '80px',
        height: '80px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06), transparent)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default BookingCard;
