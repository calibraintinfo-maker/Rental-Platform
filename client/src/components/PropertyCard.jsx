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
            bg="light" 
            text="dark" 
            className="me-1 mb-1" 
            style={{ 
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.4rem',
              fontWeight: '500'
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
            bg="light" 
            text="dark" 
            className="me-1 mb-1" 
            style={{ 
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.4rem',
              fontWeight: '500'
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
          bg="light" 
          text="dark" 
          className="me-1 mb-1" 
          style={{ 
            fontSize: '0.7rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.4rem',
            fontWeight: '500'
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
          bg="info" 
          className="me-1 mb-1" 
          style={{ 
            fontSize: '0.7rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.4rem',
            fontWeight: '500'
          }}
        >
          {property.capacity}
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
        className="shadow-sm"
        style={{
          borderRadius: '1rem',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 25px rgba(124, 58, 237, 0.15)';
          e.currentTarget.style.borderColor = '#7c3aed';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        {/* ✅ COMPACT IMAGE CONTAINER - Reduced height */}
        <div style={{ 
          position: 'relative', 
          height: '160px', // ✅ REDUCED from 220px to 160px
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          flexShrink: 0
        }}>
          <img
            src={getImageUrl(Array.isArray(property.images) ? property.images[0] : property.image)}
            alt={property.title || 'Property Image'}
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* ✅ COMPACT STATUS BADGES - Smaller size */}
          <div style={{ 
            position: 'absolute', 
            top: '8px', 
            left: '8px', 
            display: 'flex', 
            gap: '4px',
            flexWrap: 'wrap'
          }}>
            <Badge
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '0.6rem',
                padding: '3px 8px',
                borderRadius: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                border: 'none'
              }}
            >
              ✓ Available
            </Badge>
            <Badge
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '0.6rem',
                padding: '3px 8px',
                borderRadius: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                border: 'none'
              }}
            >
              ✓ Verified
            </Badge>
          </div>
        </div>
        
        {/* ✅ COMPACT CARD BODY - Reduced padding */}
        <Card.Body style={{ 
          padding: '1rem', // ✅ REDUCED from 1.5rem to 1rem
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0
        }}>
          {/* ✅ COMPACT TOP CONTENT */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ COMPACT LOCATION - Smaller margins */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '6px', // ✅ REDUCED from 12px to 6px
              gap: '6px'
            }}>
              <span style={{ 
                color: '#7c3aed', 
                fontSize: '0.9rem'
              }}>
                📍
              </span>
              <small style={{
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: '600',
                fontSize: '0.7rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.5px',
                lineHeight: '1.2'
              }}>
                {property.address?.city || 'City'}, {property.address?.state || 'State'}
              </small>
            </div>

            {/* ✅ COMPACT TITLE - Smaller font and margins */}
            <Card.Title style={{
              fontSize: '1.1rem', // ✅ REDUCED from 1.3rem to 1.1rem
              fontWeight: '700',
              marginBottom: '6px', // ✅ REDUCED from 12px to 6px
              color: '#111827',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.01em',
              lineHeight: '1.2',
              minHeight: '2.2rem', // ✅ REDUCED from 2.6rem to 2.2rem
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.title || 'Premium Property'}
            </Card.Title>

            {/* ✅ COMPACT DESCRIPTION - Smaller font and margins */}
            <Card.Text style={{
              color: '#64748b',
              marginBottom: '8px', // ✅ REDUCED from 16px to 8px
              fontSize: '0.8rem', // ✅ REDUCED from 0.9rem to 0.8rem
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.4',
              minHeight: '2.4rem', // ✅ REDUCED from 3rem to 2.4rem
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {property.description || 'Luxury property with modern amenities and prime location.'}
            </Card.Text>

            {/* ✅ COMPACT CATEGORY AND DETAILS - Smaller margins */}
            <div style={{ marginBottom: '10px' }}> {/* ✅ REDUCED from 20px to 10px */}
              <Badge
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  fontSize: '0.7rem', // ✅ REDUCED from 0.75rem to 0.7rem
                  padding: '4px 10px', // ✅ REDUCED padding
                  borderRadius: '10px',
                  fontWeight: '600',
                  marginBottom: '6px', // ✅ REDUCED from 10px to 6px
                  textTransform: 'capitalize',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)'
                }}
              >
                {property.category || 'Property'}
              </Badge>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4px', // ✅ REDUCED from 6px to 4px
                marginTop: '4px' // ✅ REDUCED from 8px to 4px
              }}>
                {renderPropertyDetails()}
              </div>
            </div>
          </div>

          {/* ✅ SPACER - Remains the same for alignment */}
          <div style={{ flex: 1 }}></div>

          {/* ✅ COMPACT BOTTOM SECTION - Reduced margins */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ COMPACT PRICE - Smaller font and margins */}
            <div style={{
              color: '#10b981',
              fontWeight: '800',
              marginBottom: '4px', // ✅ REDUCED from 8px to 4px
              fontSize: '1.2rem', // ✅ REDUCED from 1.4rem to 1.2rem
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'baseline',
              gap: '3px'
            }}>
              <span>₹{getFormattedPrice()}</span>
              <small style={{ 
                fontSize: '0.8rem', 
                fontWeight: '600',
                color: '#6b7280' 
              }}>
                /{getRentType()}
              </small>
            </div>

            <small style={{
              color: '#64748b',
              fontSize: '0.7rem', // ✅ REDUCED from 0.75rem to 0.7rem
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'block',
              marginBottom: '12px' // ✅ REDUCED from 20px to 12px
            }}>
              Available for {getRentType()}
            </small>

            {/* ✅ COMPACT ACTION BUTTONS - Smaller padding */}
            <div style={{ display: 'flex', gap: '8px' }}> {/* ✅ REDUCED gap from 12px to 8px */}
              <Button
                variant="outline-primary"
                style={{
                  flex: 1,
                  borderRadius: '10px', // ✅ REDUCED from 12px to 10px
                  fontSize: '0.8rem', // ✅ REDUCED from 0.85rem to 0.8rem
                  padding: '10px 12px', // ✅ REDUCED from 12px 16px to 10px 12px
                  borderWidth: '2px',
                  borderColor: '#7c3aed',
                  color: '#7c3aed',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backgroundColor: 'transparent'
                }}
                onClick={handleViewDetailsClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#7c3aed';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#7c3aed';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                View Details
              </Button>
              
              <Button
                style={{
                  flex: 1,
                  borderRadius: '10px', // ✅ REDUCED from 12px to 10px
                  fontSize: '0.8rem', // ✅ REDUCED from 0.85rem to 0.8rem
                  padding: '10px 12px', // ✅ REDUCED from 12px 16px to 10px 12px
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
                }}
                onClick={handleBookNowClick}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                  e.target.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
                  e.target.style.filter = 'brightness(1)';
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
