import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/api';

const PropertyCard = React.memo(({ 
  property, 
  showOwner = false,
  onViewDetails, 
  onBookNow 
}) => {
  const navigate = useNavigate();
  if (!property) return null;

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/350x200/f8f9fa/6c757d?text=Property+Image';
  };

  // ✅ REFINED: Rent type logic - cleaner implementation
  const getRentType = () => {
    const price = Number(property.price) || 0;
    return price > 100000 ? 'yearly' : 'monthly';
  };

  const getFormattedPrice = () => {
    const price = Number(property.price) || 0;
    return price.toLocaleString('en-IN');
  };

  // ✅ ENHANCED: Property details with better styling
  const renderPropertyDetails = () => {
    const residentialTypes = ["Villa", "Apartment", "House", "Studio", "Flat"];
    const details = [];

    if (property.subtype && residentialTypes.includes(property.subtype)) {
      if (property.bedrooms && property.bedrooms > 0) {
        details.push(
          <Badge 
            key="bedrooms" 
            style={{ 
              fontSize: '0.7rem',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: '500',
              backgroundColor: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}
          >
            {property.bedrooms} BHK
          </Badge>
        );
      }
      if (property.bathrooms && property.bathrooms > 0) {
        details.push(
          <Badge 
            key="bathrooms" 
            style={{ 
              fontSize: '0.7rem',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: '500',
              backgroundColor: '#f8fafc',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}
          >
            {property.bathrooms} Bath
          </Badge>
        );
      }
    }

    if (property.size) {
      details.push(
        <Badge 
          key="area" 
          style={{ 
            fontSize: '0.7rem',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: '500',
            backgroundColor: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0'
          }}
        >
          {property.size}
        </Badge>
      );
    }

    if (property.capacity) {
      details.push(
        <Badge 
          key="capacity" 
          style={{ 
            fontSize: '0.7rem',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: '500',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            border: '1px solid #d1fae5'
          }}
        >
          {property.capacity} People
        </Badge>
      );
    }

    return details;
  };

  const handleViewDetailsClick = () => {
    if (onViewDetails) onViewDetails();
    else navigate(`/property/${property._id}`);
  };

  const handleBookNowClick = () => {
    if (onBookNow) onBookNow();
    else navigate(`/book/${property._id}`);
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex'
    }}>
      <Card
        style={{
          borderRadius: '16px',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 25px rgba(0, 0, 0, 0.06)',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-12px)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(79, 70, 229, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.06)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        {/* ✅ ENTERPRISE-LEVEL IMAGE CONTAINER - No overlays, clean design */}
        <div style={{ 
          position: 'relative', 
          height: '240px',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <img
            src={getImageUrl(Array.isArray(property.images) ? property.images[0] : property.image)}
            alt={property.title || 'Property Image'}
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* ✅ MINIMAL PROFESSIONAL STATUS - Top right, subtle */}
          <div style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px',
            display: 'flex',
            gap: '6px',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: '600',
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              Available
            </div>
          </div>
        </div>
        
        {/* ✅ PREMIUM CARD BODY - Rich content, proper spacing */}
        <Card.Body style={{ 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)'
        }}>
          {/* ✅ TOP CONTENT SECTION - Rich information display */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ LOCATION - Elegant, prominent */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              gap: '8px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ef4444'
              }}></div>
              <span style={{
                color: '#64748b',
                fontWeight: '600',
                fontSize: '0.8rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.3px'
              }}>
                {property.address?.city || 'City'}, {property.address?.state || 'State'}
              </span>
            </div>

            {/* ✅ TITLE - Premium typography */}
            <Card.Title style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              marginBottom: '12px',
              color: '#0f172a',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.025em',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.title || 'Premium Property'}
            </Card.Title>

            {/* ✅ DESCRIPTION - Rich text display */}
            <Card.Text style={{
              color: '#64748b',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.description || 'Luxury property with modern amenities and prime location designed for contemporary living.'}
            </Card.Text>

            {/* ✅ PROPERTY DETAILS - Professional grid layout */}
            <div style={{ 
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Badge
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '0.75rem',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  border: '1px solid #e2e8f0',
                  alignSelf: 'flex-start'
                }}
              >
                {property.category || 'Property'}
              </Badge>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px'
              }}>
                {renderPropertyDetails()}
              </div>
            </div>
          </div>

          {/* ✅ SPACER */}
          <div style={{ flex: 1, minHeight: '12px' }}></div>

          {/* ✅ BOTTOM SECTION - Premium pricing and actions */}
          <div style={{ 
            flex: '0 0 auto'
          }}>
            {/* ✅ PRICING SECTION - Elegant, prominent */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
              border: '1px solid #d1fae5',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{
                  color: '#059669',
                  fontWeight: '800',
                  fontSize: '1.6rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  ₹{getFormattedPrice()}
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: '#6b7280' 
                }}>
                  /{getRentType()}
                </span>
              </div>

              <div style={{
                color: '#059669',
                fontSize: '0.75rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></div>
                Available for {getRentType()}
              </div>
            </div>

            {/* ✅ ACTION BUTTONS - Enterprise-level design */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  padding: '14px 20px',
                  border: '2px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onClick={handleViewDetailsClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.color = '#334155';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.color = '#475569';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                View Details
              </Button>
              
              <Button
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
                }}
                onClick={handleBookNowClick}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
