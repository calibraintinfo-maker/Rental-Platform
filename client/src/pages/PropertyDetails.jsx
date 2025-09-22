import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { api, handleApiError, formatPrice, getImageUrl } from '../utils/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await api.properties.getById(id);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  // ✅ BEAUTIFUL ICONS WITH COLORS
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      arrowLeft: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" className={className}>
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12,19 5,12 12,5"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      dollarSign: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      maximize: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" className={className}>
          <polyline points="15,3 21,3 21,9"/>
          <polyline points="9,21 3,21 3,15"/>
          <line x1="21" y1="3" x2="14" y2="10"/>
          <line x1="3" y1="21" x2="10" y2="14"/>
        </svg>
      ),
      tag: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className={className}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      star: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" className={className}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ),
      alertTriangle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className={className}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <path d="M12 17h.01"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  if (loading) {
    return (
      <>
        <div className="property-details-container loading-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div className="particles">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.8}s`
                  }}
                />
              ))}
            </div>
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div className="loading-card">
              <div className="loading-icon">
                <Icon name="home" size={32} />
              </div>
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <h4 className="loading-title">Loading Property Details...</h4>
              <p className="loading-subtitle">Fetching comprehensive information</p>
            </div>
          </div>
        </div>

        <style>{getAnimationStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div className="particles">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.8}s`
                  }}
                />
              ))}
            </div>
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          <Container style={{ position: 'relative', zIndex: 2 }}>
            <div className="error-card">
              <div className="error-icon">
                <Icon name="alertTriangle" size={32} />
              </div>
              <div className="error-content">
                <h5 className="error-title">Error Loading Property</h5>
                <p className="error-message">{error}</p>
                <Button 
                  as={Link} 
                  to="/find-property" 
                  className="back-button"
                >
                  <Icon name="arrowLeft" size={16} />
                  Back to Properties
                </Button>
              </div>
            </div>
          </Container>
        </div>

        <style>{getAnimationStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="property-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>

          <Container style={{ position: 'relative', zIndex: 2 }}>
            <div className="error-card">
              <div className="error-icon">
                <Icon name="home" size={32} />
              </div>
              <div className="error-content">
                <h5 className="error-title">Property Not Found</h5>
                <p className="error-message">The requested property could not be found</p>
                <Button 
                  as={Link} 
                  to="/find-property" 
                  className="back-button"
                >
                  <Icon name="arrowLeft" size={16} />
                  Back to Properties
                </Button>
              </div>
            </div>
          </Container>
        </div>

        <style>{getAnimationStyles()}</style>
      </>
    );
  }

  return (
    <>
      <div className="property-details-container">
        
        {/* ✅ SAME BEAUTIFUL BACKGROUND ANIMATIONS */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="particles">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.8}s`
                }}
              />
            ))}
          </div>
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Back Button */}
          <Row className="mb-4">
            <Col>
              <Button 
                as={Link} 
                to="/find-property" 
                className="back-button"
              >
                <Icon name="arrowLeft" size={16} />
                Back to Properties
              </Button>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={8}>
              
              {/* Property Images */}
              <Card className="premium-card image-card mb-4">
                <div className="image-container">
                  {property.images && property.images.length > 0 ? (
                    <Carousel className="property-carousel">
                      {property.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img 
                            src={getImageUrl(image)} 
                            alt={`${property.title} - Image ${index + 1}`}
                            className="property-image"
                          />
                          <div className="image-counter">
                            {index + 1} / {property.images.length}
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : property.image ? (
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="property-image single-image"
                    />
                  ) : (
                    <div className="no-image">
                      <Icon name="home" size={48} />
                      <p>No images available</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Property Details */}
              <Card className="premium-card details-card">
                <Card.Body className="p-4">
                  
                  {/* Badges */}
                  <div className="property-badges mb-3">
                    <Badge className="property-badge primary">{property.category}</Badge>
                    {property.subtype && (
                      <Badge className="property-badge secondary">{property.subtype}</Badge>
                    )}
                    {property.rentType.map(type => (
                      <Badge key={type} className="property-badge info">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* Title & Price */}
                  <div className="property-header mb-4">
                    <h1 className="property-title">{property.title}</h1>
                    <div className="price-display">
                      <Icon name="dollarSign" size={24} />
                      <span className="price-amount">
                        {formatPrice(property.price, property.rentType[0])}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="property-location mb-4">
                    <Icon name="mapPin" size={20} />
                    <span>
                      {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state} - {property.address.pincode}
                    </span>
                  </div>

                  {/* Property Details Grid */}
                  <Row className="property-specs mb-4">
                    <Col md={6}>
                      <div className="spec-item">
                        <Icon name="maximize" size={18} />
                        <div>
                          <span className="spec-label">Size</span>
                          <span className="spec-value">{property.size}</span>
                        </div>
                      </div>
                      <div className="spec-item">
                        <Icon name="tag" size={18} />
                        <div>
                          <span className="spec-label">Category</span>
                          <span className="spec-value">{property.category}</span>
                        </div>
                      </div>
                      {property.subtype && (
                        <div className="spec-item">
                          <Icon name="tag" size={18} />
                          <div>
                            <span className="spec-label">Type</span>
                            <span className="spec-value">{property.subtype}</span>
                          </div>
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="spec-item">
                        <Icon name="phone" size={18} />
                        <div>
                          <span className="spec-label">Contact</span>
                          <span className="spec-value">{property.contact}</span>
                        </div>
                      </div>
                      <div className="spec-item">
                        <Icon name="dollarSign" size={18} />
                        <div>
                          <span className="spec-label">Rent Types</span>
                          <span className="spec-value">{property.rentType.join(', ')}</span>
                        </div>
                      </div>
                      <div className="spec-item">
                        <Icon name="calendar" size={18} />
                        <div>
                          <span className="spec-label">Added</span>
                          <span className="spec-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Description */}
                  <div className="property-description">
                    <h5 className="section-title">
                      <Icon name="home" size={20} />
                      Description
                    </h5>
                    <div className="description-content">
                      {property.description}
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Booking Card */}
              <Card className="premium-card booking-card sticky-card">
                <div className="booking-header">
                  <Icon name="calendar" size={24} />
                  <h5>Book This Property</h5>
                </div>
                <Card.Body className="p-4">
                  
                  {/* Price Display */}
                  <div className="booking-price">
                    <h3 className="price-large">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="price-subtitle">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  {/* Book Button */}
                  <Button 
                    as={Link} 
                    to={`/book/${property._id}`}
                    className="book-button"
                    size="lg"
                  >
                    <Icon name="calendar" size={20} />
                    Book Now
                  </Button>
                  
                  <div className="payment-notice">
                    <Icon name="dollarSign" size={16} />
                    <span>Payment: On Spot Only</span>
                  </div>

                  {/* Features */}
                  <div className="property-features">
                    <h6 className="features-title">
                      <Icon name="star" size={18} />
                      Property Features
                    </h6>
                    <ul className="features-list">
                      <li>
                        <Icon name="check" size={16} />
                        <span>{property.category} Space</span>
                      </li>
                      <li>
                        <Icon name="check" size={16} />
                        <span>{property.size} Area</span>
                      </li>
                      <li>
                        <Icon name="check" size={16} />
                        <span>{property.rentType.join('/')} Rental</span>
                      </li>
                      <li>
                        <Icon name="check" size={16} />
                        <span>Direct Owner Contact</span>
                      </li>
                    </ul>
                  </div>

                  <div className="booking-notice">
                    <Icon name="alertTriangle" size={16} />
                    <span>Complete your profile before booking</span>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{getAnimationStyles()}</style>
    </>
  );
};

// ✅ SAME ANIMATION STYLES WITH PROPERTY-SPECIFIC ADDITIONS
const getAnimationStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding-top: 100px;
    padding-bottom: 60px;
  }
  
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Background animations */
  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(124, 58, 237, 0.04) 0%, 
      transparent 25%, 
      rgba(59, 130, 246, 0.03) 50%, 
      transparent 75%, 
      rgba(16, 185, 129, 0.04) 100%);
    animation: gradientShift 15s ease-in-out infinite;
  }
  
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.08) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 25s linear infinite;
  }
  
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.6;
  }
  
  .orb-1 {
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%);
    top: 8%;
    left: 10%;
    animation: float1 12s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
    top: 60%;
    right: 12%;
    animation: float2 15s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
    bottom: 15%;
    left: 15%;
    animation: float3 18s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.03) 40%, transparent 70%);
    top: 30%;
    left: 70%;
    animation: float4 20s ease-in-out infinite;
  }
  
  .particles {
    position: absolute;
    width: 100%;
    height: calc(100% - 80px);
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.4);
  }
  
  .particle-1 { 
    width: 4px; 
    height: 4px; 
    animation: particle1 20s linear infinite; 
  }
  .particle-2 { 
    width: 3px; 
    height: 3px; 
    background: rgba(59, 130, 246, 0.4);
    animation: particle2 25s linear infinite; 
  }
  .particle-3 { 
    width: 5px; 
    height: 5px; 
    background: rgba(16, 185, 129, 0.4);
    animation: particle3 22s linear infinite; 
  }
  .particle-4 { 
    width: 2px; 
    height: 2px; 
    background: rgba(245, 101, 101, 0.4);
    animation: particle4 18s linear infinite; 
  }
  
  .geometric-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    opacity: 0.1;
  }
  
  .shape-1 {
    width: 50px;
    height: 50px;
    border: 2px solid #7c3aed;
    top: 20%;
    right: 20%;
    animation: rotate 30s linear infinite;
  }
  
  .shape-2 {
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 30px solid #3b82f6;
    top: 70%;
    left: 80%;
    animation: float1 25s ease-in-out infinite;
  }
  
  .shape-3 {
    width: 30px;
    height: 30px;
    background: #10b981;
    border-radius: 50%;
    bottom: 30%;
    right: 30%;
    animation: pulse 8s ease-in-out infinite;
  }
  
  /* Card styling */
  .premium-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.1),
      0 8px 25px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    position: relative;
    animation: cardAppear 0.8s ease-out;
    transition: all 0.3s ease;
  }
  
  .premium-card:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.15),
      0 10px 30px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
  
  .sticky-card {
    position: sticky;
    top: 20px;
  }
  
  /* Back button */
  .back-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  }
  
  .back-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #5a67d8, #667eea);
    color: white;
  }
  
  /* Image card */
  .image-card {
    overflow: hidden;
  }
  
  .image-container {
    position: relative;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .property-image:hover {
    transform: scale(1.02);
  }
  
  .image-counter {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .no-image {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  }
  
  .no-image p {
    margin-top: 12px;
    font-weight: 500;
  }
  
  /* Property details */
  .property-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .property-badge {
    border-radius: 12px;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .property-badge.primary {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: white;
    border: none;
  }
  
  .property-badge.secondary {
    background: linear-gradient(135deg, #6b7280, #9ca3af);
    color: white;
    border: none;
  }
  
  .property-badge.info {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
    border: none;
  }
  
  .property-header {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 16px;
  }
  
  .property-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #1e293b, #475569);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .price-display {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .price-amount {
    font-size: 1.8rem;
    font-weight: 800;
    color: #10b981;
  }
  
  .property-location {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.02));
    border-radius: 12px;
    border-left: 4px solid #ef4444;
  }
  
  .property-location span {
    font-size: 1.1rem;
    color: #374151;
    font-weight: 500;
  }
  
  .property-specs {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 16px;
  }
  
  .spec-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f8fafc;
  }
  
  .spec-item:last-child {
    border-bottom: none;
  }
  
  .spec-item div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .spec-label {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .spec-value {
    font-size: 1rem;
    color: #1e293b;
    font-weight: 600;
  }
  
  .property-description {
    padding-top: 16px;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
  }
  
  .description-content {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid #7c3aed;
    font-size: 1rem;
    line-height: 1.6;
    color: #374151;
    white-space: pre-line;
  }
  
  /* Booking card */
  .booking-header {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: white;
    padding: 16px 20px;
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .booking-header h5 {
    margin: 0;
    font-weight: 700;
    font-size: 1.2rem;
  }
  
  .booking-price {
    text-align: center;
    padding: 20px 0;
    border-bottom: 2px solid #f1f5f9;
    margin-bottom: 20px;
  }
  
  .price-large {
    font-size: 2rem;
    font-weight: 800;
    color: #10b981;
    margin-bottom: 8px;
  }
  
  .price-subtitle {
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
  }
  
  .book-button {
    width: 100%;
    background: linear-gradient(135deg, #10b981, #059669);
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }
  
  .book-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669, #047857);
  }
  
  .payment-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 24px;
    font-weight: 500;
  }
  
  .property-features {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  
  .features-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
  }
  
  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .features-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    font-size: 0.95rem;
    color: #374151;
    font-weight: 500;
  }
  
  .booking-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #f59e0b;
    font-weight: 500;
    text-align: center;
    justify-content: center;
  }
  
  /* Loading and error states */
  .loading-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    max-width: 400px;
  }
  
  .loading-icon {
    margin-bottom: 16px;
  }
  
  .loading-spinner {
    margin: 16px 0;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f4f6;
    border-left: 4px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  .loading-title {
    margin-top: 20px;
    color: #1e293b;
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  .loading-subtitle {
    color: #64748b;
    margin: 8px 0 0 0;
  }
  
  .error-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    border: 1px solid rgba(239, 68, 68, 0.2);
    max-width: 500px;
    margin: 0 auto;
  }
  
  .error-icon {
    color: #f59e0b;
  }
  
  .error-title {
    color: #991b1b;
    margin-bottom: 8px;
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  .error-message {
    color: #991b1b;
    margin-bottom: 16px;
    font-size: 1.1rem;
  }
  
  /* Animations */
  @keyframes gradientShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(20px, -20px) rotate(90deg) scale(1.05); }
    50% { transform: translate(-15px, -30px) rotate(180deg) scale(0.95); }
    75% { transform: translate(-25px, 15px) rotate(270deg) scale(1.02); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    30% { transform: translate(-30px, -15px) rotate(108deg) scale(1.08); }
    70% { transform: translate(15px, -25px) rotate(252deg) scale(0.92); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    20% { transform: translate(15px, -12px) scale(1.06) rotate(72deg); }
    40% { transform: translate(-12px, -20px) scale(0.94) rotate(144deg); }
    60% { transform: translate(-20px, 8px) scale(1.03) rotate(216deg); }
    80% { transform: translate(12px, 16px) scale(0.97) rotate(288deg); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(12px, -15px) scale(1.1); }
    66% { transform: translate(-15px, 12px) scale(0.9); }
  }
  
  @keyframes particle1 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translateY(-10vh) translateX(80px) rotate(360deg); opacity: 0; }
  }
  
  @keyframes particle2 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-10vh) translateX(-60px) rotate(-360deg); opacity: 0; }
  }
  
  @keyframes particle3 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.7; }
    90% { opacity: 0.7; }
    100% { transform: translateY(-10vh) translateX(50px) rotate(180deg); opacity: 0; }
  }
  
  @keyframes particle4 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-10vh) translateX(-30px) rotate(-180deg); opacity: 0; }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.2); opacity: 0.2; }
  }
  
  @keyframes cardAppear {
    from { 
      opacity: 0; 
      transform: translateY(25px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .property-title { font-size: 1.8rem; }
    .price-large { font-size: 1.6rem; }
    .sticky-card { position: static; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
  }
`;

export default PropertyDetails;
