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
              padding: '4px 10px',
              borderRadius: '8px',
              fontWeight: '600',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: '#7c3aed',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(8px)',
              margin: '2px'
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
              padding: '4px 10px',
              borderRadius: '8px',
              fontWeight: '600',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: '#7c3aed',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(8px)',
              margin: '2px'
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
            padding: '4px 10px',
            borderRadius: '8px',
            fontWeight: '600',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            color: '#7c3aed',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(8px)',
            margin: '2px'
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
            padding: '4px 10px',
            borderRadius: '8px',
            fontWeight: '600',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#059669',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            backdropFilter: 'blur(8px)',
            margin: '2px'
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
        style={{
          borderRadius: '20px',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        }}
      >
        {/* ✅ PREMIUM GLASSY IMAGE CONTAINER */}
        <div style={{ 
          position: 'relative', 
          height: '220px', // ✅ Increased for better proportion
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
            top: '16px', 
            right: '16px',
            display: 'flex',
            gap: '6px',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <div style={{
              background: 'rgba(139, 92, 246, 0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '12px',
              padding: '8px 12px',
              fontSize: '0.7rem',
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
            }}>
              Available
            </div>
          </div>
        </div>
        
        {/* ✅ RICH CONTENT CARD BODY */}
        <Card.Body style={{ 
          padding: '24px', // ✅ Increased back for more content space
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          {/* ✅ RICH TOP CONTENT SECTION */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ PREMIUM LOCATION WITH STYLING */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              gap: '8px',
              background: 'rgba(139, 92, 246, 0.08)',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#8b5cf6'
              }}></div>
              <span style={{
                color: '#8b5cf6',
                fontWeight: '700',
                fontSize: '0.75rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                {property.address?.city || 'City'}, {property.address?.state || 'State'}
              </span>
            </div>

            {/* ✅ PREMIUM TITLE */}
            <Card.Title style={{
              fontSize: '1.35rem', // ✅ Increased for prominence
              fontWeight: '800',
              marginBottom: '14px',
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

            {/* ✅ RICH DESCRIPTION WITH BACKGROUND */}
            <Card.Text style={{
              color: '#475569',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6',
              display: '-webkit-box',
              WebkitLineClamp: 3, // ✅ Back to 3 lines for richness
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              background: 'rgba(148, 163, 184, 0.05)',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              {property.description || 'Luxury property with modern amenities and prime location designed for contemporary living with exceptional features.'}
            </Card.Text>

            {/* ✅ RICH PROPERTY DETAILS SECTION */}
            <div style={{ 
              marginBottom: '20px',
              background: 'rgba(139, 92, 246, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.15)'
            }}>
              {/* ✅ PURPLE CATEGORY BADGE (was blue before) */}
              <Badge
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.9)', // ✅ CHANGED TO PURPLE
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  border: 'none',
                  marginBottom: '12px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' // ✅ PURPLE SHADOW
                }}
              >
                {property.category || 'Property'} Rentals
              </Badge>
              
              {/* ✅ ADDITIONAL INFO SECTION */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <Badge
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)', // ✅ PURPLE THEME
                    color: '#7c3aed',
                    fontSize: '0.7rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {property.sqft || property.area || '1000'} {/* ✅ SHOW AREA INFO */}
                </Badge>
              </div>
              
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

          {/* ✅ PREMIUM GLASSY BOTTOM SECTION */}
          <div style={{ 
            flex: '0 0 auto'
          }}>
            {/* ✅ PREMIUM PRICING WITH MORE VISUAL RICHNESS */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '14px',
              padding: '18px 16px',
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* ✅ DECORATIVE ELEMENT */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '12px',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%)',
                borderRadius: '50%'
              }}></div>

              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginBottom: '6px'
              }}>
                <span style={{
                  color: '#8b5cf6',
                  fontWeight: '900',
                  fontSize: '1.6rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  ₹{getFormattedPrice()}
                </span>
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  color: '#64748b' 
                }}>
                  /{getRentType()}
                </span>
              </div>

              <div style={{
                color: '#8b5cf6',
                fontSize: '0.75rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7'
                }}></div>
                Available for {getRentType()}
              </div>
            </div>

            {/* ✅ PREMIUM GLASSY BUTTONS */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  padding: '14px 18px',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  color: '#7c3aed',
                  fontWeight: '700',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onClick={handleViewDetailsClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.08)';
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.4)';
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
                  fontSize: '0.85rem',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '700',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onClick={handleBookNowClick}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.5)';
                  e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
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
