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
              padding: '0.3rem 0.6rem',
              borderRadius: '0.5rem',
              fontWeight: '500'
            }}
          >
            🛏️ {property.bedrooms} BHK
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
              padding: '0.3rem 0.6rem',
              borderRadius: '0.5rem',
              fontWeight: '500'
            }}
          >
            🚿 {property.bathrooms} Bath
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
            padding: '0.3rem 0.6rem',
            borderRadius: '0.5rem',
            fontWeight: '500'
          }}
        >
          📐 {property.size}
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
            padding: '0.3rem 0.6rem',
            borderRadius: '0.5rem',
            fontWeight: '500'
          }}
        >
          👥 {property.capacity}
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
          borderRadius: '1.2rem',
          cursor: 'pointer',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 58, 237, 0.15)';
          e.currentTarget.style.borderColor = '#7c3aed';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        {/* ✅ ENHANCED IMAGE CONTAINER with better visual elements */}
        <div style={{ 
          position: 'relative', 
          height: '180px', // ✅ Balanced height 
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
          
          {/* ✅ ENHANCED STATUS BADGES with better positioning */}
          <div style={{ 
            position: 'absolute', 
            top: '12px', 
            left: '12px', 
            display: 'flex', 
            gap: '6px',
            flexDirection: 'column'
          }}>
            <Badge
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.9)',
                color: 'white',
                fontSize: '0.65rem',
                padding: '4px 10px',
                borderRadius: '15px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                border: 'none',
                backdropFilter: 'blur(10px)'
              }}
            >
              ✓ Available
            </Badge>
            <Badge
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                fontSize: '0.65rem',
                padding: '4px 10px',
                borderRadius: '15px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                border: 'none',
                backdropFilter: 'blur(10px)'
              }}
            >
              ✓ Verified
            </Badge>
          </div>

          {/* ✅ ADDED: Price overlay on image for visual richness */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '6px 12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              color: '#10b981',
              fontWeight: '800',
              fontSize: '0.9rem',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              ₹{getFormattedPrice()}
            </div>
            <div style={{
              color: '#6b7280',
              fontSize: '0.65rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              /{getRentType()}
            </div>
          </div>

          {/* ✅ ENHANCED gradient overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
            pointerEvents: 'none'
          }} />
        </div>
        
        {/* ✅ ENHANCED CARD BODY with better spacing */}
        <Card.Body style={{ 
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)'
        }}>
          {/* ✅ ENHANCED TOP CONTENT with visual separators */}
          <div style={{ flex: '0 0 auto' }}>
            {/* ✅ ENHANCED LOCATION with better visual treatment */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
              gap: '8px',
              padding: '6px 10px',
              background: 'rgba(124, 58, 237, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(124, 58, 237, 0.1)'
            }}>
              <span style={{ 
                color: '#7c3aed', 
                fontSize: '0.9rem'
              }}>
                📍
              </span>
              <small style={{
                color: '#7c3aed',
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

            {/* ✅ ENHANCED TITLE with better typography */}
            <Card.Title style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#111827',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.01em',
              lineHeight: '1.3',
              minHeight: '2.4rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {property.title || 'Premium Property'}
            </Card.Title>

            {/* ✅ ENHANCED DESCRIPTION with better contrast */}
            <Card.Text style={{
              color: '#64748b',
              marginBottom: '12px',
              fontSize: '0.85rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.5',
              minHeight: '2.55rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              background: 'rgba(100, 116, 139, 0.05)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(100, 116, 139, 0.1)'
            }}>
              {property.description || 'Luxury property with modern amenities and prime location.'}
            </Card.Text>

            {/* ✅ ENHANCED CATEGORY AND DETAILS with visual grouping */}
            <div style={{ 
              marginBottom: '15px',
              padding: '10px',
              background: 'rgba(124, 58, 237, 0.02)',
              borderRadius: '10px',
              border: '1px solid rgba(124, 58, 237, 0.08)'
            }}>
              <Badge
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '5px 12px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'capitalize',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)'
                }}
              >
                🏢 {property.category || 'Property'}
              </Badge>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px',
                marginTop: '6px'
              }}>
                {renderPropertyDetails()}
              </div>
            </div>
          </div>

          {/* ✅ SPACER */}
          <div style={{ flex: 1 }}></div>

          {/* ✅ ENHANCED BOTTOM SECTION with visual separation */}
          <div style={{ 
            flex: '0 0 auto',
            borderTop: '2px solid #f1f5f9',
            paddingTop: '15px'
          }}>
            {/* ✅ ENHANCED PRICE SECTION with background */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              marginBottom: '15px'
            }}>
              <div style={{
                color: '#10b981',
                fontWeight: '800',
                fontSize: '1.3rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '2px'
              }}>
                <span>💰</span>
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
                color: '#10b981',
                fontSize: '0.7rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>✅</span> Available for {getRentType()}
              </small>
            </div>

            {/* ✅ ENHANCED ACTION BUTTONS with better spacing */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline-primary"
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  padding: '12px 16px',
                  borderWidth: '2px',
                  borderColor: '#7c3aed',
                  color: '#7c3aed',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backgroundColor: 'transparent',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.1)'
                }}
                onClick={handleViewDetailsClick}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#7c3aed';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#7c3aed';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.1)';
                }}
              >
                👁️ View Details
              </Button>
              
              <Button
                style={{
                  flex: 1,
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  padding: '12px 16px',
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
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.4)';
                  e.target.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
                  e.target.style.filter = 'brightness(1)';
                }}
              >
                🎯 Book Now
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
