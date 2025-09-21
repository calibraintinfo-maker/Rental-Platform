import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { formatDate, formatPrice, getImageUrl } from '../utils/api';

const BookingCard = ({ booking }) => {
  
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
      padding: '6px 12px', // Much smaller padding
      borderRadius: '16px', // Smaller radius
      backgroundColor: getStatusColor(status),
      color: 'white',
      fontSize: '0.7rem', // Smaller font
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      boxShadow: `0 2px 8px ${getStatusColor(status)}30`
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

  return (
    <div style={{
      padding: '20px 24px', // Much smaller padding
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px', // Smaller border radius
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', // Lighter shadow
      border: '1px solid rgba(226, 232, 240, 0.6)'
    }}>
      
      <Row className="align-items-center">
        
        {/* Compact Property Image */}
        <Col lg={3} md={4} className="mb-3 mb-md-0">
          <div style={{
            position: 'relative',
            borderRadius: '10px', // Smaller radius
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', // Lighter shadow
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            aspectRatio: '4/3',
            height: '100px' // Fixed compact height
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
                fontSize: '0.75rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Property Image
              </div>
            )}
            
            {/* Compact Property ID Badge */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              padding: '3px 8px', // Much smaller
              borderRadius: '12px',
              fontSize: '0.65rem', // Smaller font
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              #{booking._id?.slice(-6)?.toUpperCase()}
            </div>
          </div>
        </Col>

        {/* Compact Property Details */}
        <Col lg={6} md={8}>
          <div style={{ paddingLeft: '16px' }}>
            
            {/* Compact Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div>
                <h4 style={{ // Changed from h3 to h4
                  fontSize: '1.1rem', // Much smaller
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 4px 0',
                  lineHeight: '1.3'
                }}>
                  {booking.propertyId?.title || `Property #${booking._id?.slice(-4)?.toUpperCase()}`}
                </h4>
                
                {/* Compact Location */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                  fontSize: '0.8rem', // Smaller
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  <LocationIcon />
                  {booking.propertyId?.address?.city}, {booking.propertyId?.address?.state}
                </div>
              </div>
              
              <StatusBadge status={booking.status} />
            </div>

            {/* Compact Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px 16px', // Much smaller gaps
              fontSize: '0.8rem' // Smaller base font
            }}>
              
              <div>
                <div style={{
                  fontSize: '0.7rem', // Smaller labels
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  marginBottom: '2px'
                }}>
                  Check-in
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#1e293b'
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
                  marginBottom: '2px'
                }}>
                  Check-out
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#1e293b'
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
                  marginBottom: '2px'
                }}>
                  Booking Type
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  textTransform: 'capitalize'
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
                  marginBottom: '2px'
                }}>
                  Payment
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {booking.paymentMode}
                </div>
              </div>
            </div>

            {/* Compact Notes */}
            {booking.notes && (
              <div style={{
                marginTop: '12px',
                padding: '10px',
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

        {/* Compact Price & Actions */}
        <Col lg={3}>
          <div style={{
            textAlign: 'right',
            paddingLeft: '16px'
          }}>
            
            {/* Compact Price Box */}
            <div style={{
              marginBottom: '12px',
              padding: '12px 16px', // Smaller padding
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))',
              borderRadius: '10px', // Smaller radius
              border: '1px solid rgba(16, 185, 129, 0.15)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: '4px'
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
                fontSize: '1.4rem', // Much smaller than before
                fontWeight: '800',
                color: '#059669',
                lineHeight: '1.2'
              }}>
                ₹{booking.totalPrice?.toLocaleString()}
              </div>
            </div>

            {/* Compact Booking Date */}
            <div style={{ marginBottom: '12px' }}>
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
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#64748b'
              }}>
                {formatDate(booking.createdAt)}
              </div>
            </div>

            {/* Compact Action Button */}
            <button style={{
              width: '100%',
              padding: '8px 16px', // Perfect button size
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem', // Smaller button text
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0px)';
            }}
            >
              View Details
            </button>
          </div>
        </Col>
      </Row>

      {/* Subtle decorative elements - much smaller */}
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
