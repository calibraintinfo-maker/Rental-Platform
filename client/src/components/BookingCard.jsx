import React from 'react';
import { Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  // Status color mapping - ENHANCED
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
    return statusColors[status?.toLowerCase()] || '#6b7280';
  };

  // 🔥 PROPER IMAGE HANDLING - ENHANCED TO MATCH YOUR DESIGN
  const getValidImages = (property) => {
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const validImages = property.images.filter(img => 
        img && typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image'))
      );
      if (validImages.length > 0) {
        return validImages[0]; // Return first valid image
      }
    }
    
    if (property?.image && typeof property.image === 'string' && property.image.trim()) {
      return property.image;
    }
    
    // Fallback to premium images if no property image
    const premiumImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&h=400&fit=crop&auto=format&q=80'
    ];
    return premiumImages[Math.floor(Math.random() * premiumImages.length)];
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format price function
  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString('en-IN');
  };

  // 🔥 PROPER LOCATION HANDLING - ENHANCED
  const getLocation = () => {
    const property = booking.property || booking.propertyId;
    
    if (property?.address?.city && property?.address?.state) {
      return `${property.address.city}, ${property.address.state}`;
    }
    if (property?.address?.full) {
      return property.address.full;
    }
    if (property?.location) {
      return property.location;
    }
    // Enhanced fallback
    return booking.property?.location || booking.property?.address?.city || 'Location not specified';
  };

  // 🔥 PROPER PROPERTY TITLE - ENHANCED
  const getPropertyTitle = () => {
    const property = booking.property || booking.propertyId;
    
    if (property?.title) {
      return property.title;
    }
    if (property?.name) {
      return property.name;
    }
    if (property?.propertyId) {
      return property.propertyId;
    }
    // Enhanced fallback
    return `Property #${booking._id?.slice(-4)?.toUpperCase() || '0000'}`;
  };

  // Handle card click
  const handleCardClick = () => {
    navigate(`/booking/${booking._id}`);
  };

  const statusColor = getStatusColor(booking.status);

  return (
    <div 
      style={{
        cursor: 'pointer',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        overflow: 'hidden',
        position: 'relative',
        padding: '24px'
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
      }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, 
          ${statusColor} 0%, 
          transparent 100%)`
      }}></div>

      <Row className="align-items-center">
        
        {/* Left: Modern Card Preview WITH ENHANCED PROPERTY IMAGE LOADING */}
        <Col lg={3} md={12} className="mb-3 mb-lg-0">
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            aspectRatio: '16/10',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
            // 🔥 ENHANCED PROPERTY IMAGE LOADING WITH SMART DETECTION
            background: (() => {
              const propertyImage = getValidImages(booking.property || booking.propertyId);
              return `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("${propertyImage}")`;
            })(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            {/* Card Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
              }}>
                PROPERTY
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '2px 6px',
                borderRadius: '4px',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}>
                #{booking._id?.slice(-4) || '****'}
              </div>
            </div>

            {/* Property ID */}
            <div style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
              letterSpacing: '1px'
            }}>
              {(booking.property || booking.propertyId)?.propertyId || getPropertyTitle()}
            </div>

            {/* Card Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <div style={{ 
                fontSize: '9px', 
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
              }}>
                SpaceLink
              </div>
              <div style={{
                width: '24px',
                height: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)'
              }}>
                <div style={{
                  width: '12px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '2px'
                }}></div>
              </div>
            </div>
          </div>
        </Col>

        {/* Center: Booking Information - ENHANCED */}
        <Col lg={6} md={12} className="mb-3 mb-lg-0">
          <div>
            {/* Property Title & Status */}
            <div className="d-flex align-items-center gap-3 mb-2">
              <h4 style={{ 
                margin: 0, 
                fontWeight: '700', 
                fontSize: '1.3rem',
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}>
                {getPropertyTitle()}
              </h4>
              <Badge 
                style={{ 
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: booking.status === 'pending' ? 
                    'linear-gradient(135deg, #fbbf24, #f59e0b)' : 
                    booking.status === 'approved' ? 
                    'linear-gradient(135deg, #34d399, #10b981)' : 
                    booking.status === 'active' ? 
                    'linear-gradient(135deg, #60a5fa, #3b82f6)' : 
                    booking.status === 'rejected' ? 
                    'linear-gradient(135deg, #f87171, #ef4444)' : 
                    'linear-gradient(135deg, #9ca3af, #6b7280)',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {booking.status}
              </Badge>
            </div>

            {/* Location - ENHANCED */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span style={{ 
                fontSize: '14px', 
                color: '#64748b',
                fontWeight: '500' 
              }}>
                {getLocation()}
              </span>
            </div>

            {/* Booking Details Grid - ENHANCED */}
            <Row className="g-3">
              <Col sm={6}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.04)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.08)'
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                    CHECK-IN
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {formatDate(booking.checkIn || booking.fromDate || booking.checkInDate)}
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.04)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.08)'
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                    CHECK-OUT
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {formatDate(booking.checkOut || booking.toDate || booking.checkOutDate)}
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.04)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.08)'
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                    BOOKING TYPE
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {booking.bookingType || 'Monthly'}
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.04)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(139, 92, 246, 0.08)'
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                    PAYMENT
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {booking.paymentMethod || booking.paymentMode || 'On Spot'}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Right: Price & Actions - ENHANCED */}
        <Col lg={3} md={12}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(5, 150, 105, 0.02))',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(16, 185, 129, 0.1)'
          }}>
            {/* Total Price Label */}
            <div style={{ 
              fontSize: '10px', 
              color: '#64748b',
              fontWeight: '700',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              TOTAL PRICE
            </div>

            {/* Price - ENHANCED */}
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '800', 
              color: '#059669',
              marginBottom: '4px',
              letterSpacing: '-0.02em'
            }}>
              ₹{formatPrice(booking.totalPrice || booking.totalAmount || booking.price || 0)}
            </div>

            {/* Booking Date - ENHANCED */}
            <div style={{ 
              fontSize: '11px', 
              color: '#64748b',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              Booked {formatDate(booking.createdAt || booking.bookingDate)}
            </div>

            {/* Action Button - ENHANCED */}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/booking/${booking._id}`);
              }}
              style={{
                borderRadius: '10px',
                fontWeight: '600',
                padding: '10px 20px',
                fontSize: '12px',
                border: '2px solid #3b82f6',
                color: '#3b82f6',
                background: 'transparent',
                transition: 'all 0.2s ease',
                width: '100%',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>VIEW DETAILS</span>
              </div>
            </Button>
          </div>
        </Col>

      </Row>
    </div>
  );
};

export default BookingCard;
