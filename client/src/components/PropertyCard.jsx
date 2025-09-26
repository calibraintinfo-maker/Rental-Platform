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
              fontSize: '0.65rem',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: '500',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: '#7c3aed',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(8px)'
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
              fontSize: '0.65rem',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: '500',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: '#7c3aed',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(8px)'
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
            fontSize: '0.65rem',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: '500',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            color: '#7c3aed',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            backdropFilter: 'blur(8px)'
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
            fontSize: '0.65rem',
            padding: '3px 8px',
            borderRadius: '6px',
            fontWeight: '500',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            backdropFilter: 'blur(8px)'
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
          borderRadius: '20px',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.12)',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        {/* ✅ COMPACT GLASSY IMAGE CONTAINER */}
        <div style={{ 
          position: 'relative', 
          height: '200px', // ✅ REDUCED from 240px to 200px
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
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* ✅ GLASSY PURPLE STATUS */}
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px',
            display: 'flex',
            gap: '4px',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <div style={{
              background: 'rgba(139, 92, 246, 0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '12px',
              padding: '6px 10px',
              fontSize: '0.65rem',
              fontWeight: '600',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
            }}>
              Available
            </div>
          </div>
        </div>
        
        {/* ✅ COMPACT GLASSY CARD BODY */}
        <Card.Body style={{ 
          padding: '18px', // ✅ REDUCED from 24px to 18px
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          {/* ✅ COMPACT TOP CONTENT */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ GLASSY LOCATION */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px', // ✅ REDUCED from 16px to 12px
              gap: '6px'
            }}>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#8b5cf6'
              }}></div>
              <span style={{
                color: '#8b5cf6',
                fontWeight: '600',
                fontSize: '0.75rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.3px'
              }}>
                {property.address?.city || 'City'}, {property.address?.state || 'State'}
              </span>
            </div>

            {/* ✅ COMPACT TITLE */}
            <Card.Title style={{
              fontSize: '1.2rem', // ✅ REDUCED from 1.4rem to 1.2rem
              fontWeight: '700',
              marginBottom: '10px', // ✅ REDUCED from 12px to 10px
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

            {/* ✅ COMPACT DESCRIPTION */}
            <Card.Text style={{
              color: '#64748b',
              marginBottom: '16px', // ✅ REDUCED from 20px to 16px
              fontSize: '0.85rem', // ✅ REDUCED from 0.9rem to 0.85rem
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2, // ✅ REDUCED from 3 to 2 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.description || 'Luxury property with modern amenities and prime location designed for contemporary living.'}
            </Card.Text>

            {/* ✅ COMPACT GLASSY PROPERTY DETAILS */}
            <div style={{ 
              marginBottom: '16px', // ✅ REDUCED from 24px to 16px
              display: 'flex',
              flexDirection: 'column',
              gap: '8px' // ✅ REDUCED from 12px to 8px
            }}>
              <Badge
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#7c3aed',
                  fontSize: '0.7rem', // ✅ REDUCED from 0.75rem to 0.7rem
                  padding: '6px 12px', // ✅ REDUCED padding
                  borderRadius: '10px',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  backdropFilter: 'blur(8px)',
                  alignSelf: 'flex-start'
                }}
              >
                {property.category || 'Property'}
              </Badge>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px'
              }}>
                {renderPropertyDetails()}
              </div>
            </div>
          </div>

          {/* ✅ SPACER */}
          <div style={{ flex: 1, minHeight: '8px' }}></div> {/* ✅ REDUCED from 12px to 8px */}

          {/* ✅ COMPACT GLASSY BOTTOM SECTION */}
          <div style={{ 
            flex: '0 0 auto'
          }}>
            {/* ✅ COMPACT GLASSY PRICING */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              padding: '12px', // ✅ REDUCED from 16px to 12px
              marginBottom: '16px' // ✅ REDUCED from 20px to 16px
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                marginBottom: '2px'
              }}>
                <span style={{
                  color: '#8b5cf6',
                  fontWeight: '800',
                  fontSize: '1.4rem', // ✅ Kept same for prominence
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  ₹{getFormattedPrice()}
                </span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: '600',
                  color: '#64748b' 
                }}>
                  /{getRentType()}
                </span>
              </div>

              <div style={{
                color: '#8b5cf6',
                fontSize: '0.7rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7'
                }}></div>
                Available for {getRentType()}
              </div>
            </div>

            {/* ✅ COMPACT GLASSY BUTTONS */}
            <div style={{ display: 'flex', gap: '10px' }}> {/* ✅ REDUCED from 12px to 10px */}
              <Button
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.8rem', // ✅ REDUCED from 0.85rem to 0.8rem
                  padding: '12px 16px', // ✅ REDUCED padding
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#7c3aed',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: 'rgba(139, 92, 246, 0.05)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onClick={handleViewDetailsClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                View Details
              </Button>
              
              <Button
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.8rem', // ✅ REDUCED from 0.85rem to 0.8rem
                  padding: '12px 16px', // ✅ REDUCED padding
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onClick={handleBookNowClick}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)';
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
