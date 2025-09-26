import React from 'react';
import { Card, Button } from 'react-bootstrap';
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

  // ✅ MINIMAL BADGES - Only essential ones
  const renderPropertyDetails = () => {
    const residentialTypes = ["Villa", "Apartment", "House", "Studio", "Flat"];
    const details = [];

    if (property.subtype && residentialTypes.includes(property.subtype)) {
      if (property.bedrooms && property.bedrooms > 0) {
        details.push(
          <div 
            key="bedrooms" 
            style={{ 
              fontSize: '0.65rem',
              padding: '4px 10px',
              borderRadius: '8px',
              fontWeight: '600',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: '#7c3aed',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              display: 'inline-block'
            }}
          >
            {property.bedrooms} BHK
          </div>
        );
      }
      if (property.bathrooms && property.bathrooms > 0) {
        details.push(
          <div 
            key="bathrooms" 
            style={{ 
              fontSize: '0.65rem',
              padding: '4px 10px',
              borderRadius: '8px',
              fontWeight: '600',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: '#7c3aed',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              display: 'inline-block'
            }}
          >
            {property.bathrooms} Bath
          </div>
        );
      }
    }

    if (property.size) {
      details.push(
        <div 
          key="area" 
          style={{ 
            fontSize: '0.65rem',
            padding: '4px 10px',
            borderRadius: '8px',
            fontWeight: '600',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            color: '#7c3aed',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            display: 'inline-block'
          }}
        >
          {property.size}
        </div>
      );
    }

    // ✅ ONLY 3 BADGES MAX - No overcrowding
    return details.slice(0, 3);
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
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.12)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        {/* ✅ COMPACT IMAGE */}
        <div style={{ 
          position: 'relative', 
          height: '180px',
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
          
          {/* ✅ COMPACT PURPLE STATUS */}
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
              borderRadius: '10px',
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
        
        {/* ✅ COMPACT CARD BODY */}
        <Card.Body style={{ 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          {/* ✅ COMPACT TOP CONTENT */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ COMPACT LOCATION */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
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
                fontSize: '0.7rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.3px'
              }}>
                {property.address?.city || 'City'}, {property.address?.state || 'State'}
              </span>
            </div>

            {/* ✅ COMPACT TITLE */}
            <Card.Title style={{
              fontSize: '1.15rem',
              fontWeight: '700',
              marginBottom: '8px',
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
              color: '#475569',
              marginBottom: '12px',
              fontSize: '0.8rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.description || 'Luxury property with modern amenities and prime location.'}
            </Card.Text>

            {/* ✅ FIXED BADGE SPACING - HORIZONTAL FLOW */}
            <div style={{ 
              marginBottom: '12px'
            }}>
              {/* ✅ MAIN CATEGORY AND AREA - SAME LINE */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px', // ✅ CONSISTENT SPACING
                marginBottom: '6px' // ✅ REDUCED FROM 8px
              }}>
                <div
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                    display: 'inline-block'
                  }}
                >
                  {property.category || 'Property'} Rentals
                </div>
                
                <div
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.25)',
                    color: '#7c3aed',
                    fontSize: '0.65rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    display: 'inline-block'
                  }}
                >
                  {property.sqft || property.area || '1000'} sq ft
                </div>
              </div>
              
              {/* ✅ DETAIL BADGES - SAME LINE, TIGHT SPACING */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px' // ✅ CONSISTENT SPACING
              }}>
                {renderPropertyDetails()}
              </div>
            </div>
          </div>

          {/* ✅ SPACER */}
          <div style={{ flex: 1, minHeight: '8px' }}></div>

          {/* ✅ COMPACT BOTTOM SECTION */}
          <div style={{ 
            flex: '0 0 auto'
          }}>
            {/* ✅ COMPACT PRICING */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                marginBottom: '4px'
              }}>
                <span style={{
                  color: '#8b5cf6',
                  fontWeight: '800',
                  fontSize: '1.3rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  letterSpacing: '-0.025em'
                }}>
                  ₹{getFormattedPrice()}
                </span>
                <span style={{ 
                  fontSize: '0.75rem', 
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

            {/* ✅ COMPACT BUTTONS */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                style={{
                  flex: 1,
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  padding: '10px 14px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#7c3aed',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: 'rgba(139, 92, 246, 0.05)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onClick={handleViewDetailsClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.25)';
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
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  padding: '10px 14px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onClick={handleBookNowClick}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
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
