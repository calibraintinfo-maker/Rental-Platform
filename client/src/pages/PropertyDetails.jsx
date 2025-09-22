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

  // ✅ BEAUTIFUL ICONS WITH PERFECT COLORS (YOUR ORIGINAL)
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      arrowLeft: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
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
        <div className="property-container">
          <div className="animated-background">
            <div className="gradient-overlay"></div>
            <div className="grid-pattern"></div>
            <div className="floating-elements">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          <Container className="content-layer">
            <div className="loading-display">
              <div className="loading-card">
                <Icon name="home" size={40} />
                <div className="spinner"></div>
                <h4>Loading Property Details...</h4>
                <p>Please wait while we fetch the information</p>
              </div>
            </div>
          </Container>
        </div>
        <style>{getPerfectStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-container">
          <div className="animated-background">
            <div className="gradient-overlay"></div>
            <div className="grid-pattern"></div>
            <div className="floating-elements">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          <Container className="content-layer">
            <div className="error-display">
              <div className="error-card">
                <Icon name="alertTriangle" size={40} />
                <h4>Error Loading Property</h4>
                <p>{error}</p>
                <Button as={Link} to="/find-property" className="action-button">
                  <Icon name="arrowLeft" size={16} />
                  Back to Properties
                </Button>
              </div>
            </div>
          </Container>
        </div>
        <style>{getPerfectStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="property-container">
          <div className="animated-background">
            <div className="gradient-overlay"></div>
            <div className="grid-pattern"></div>
            <div className="floating-elements">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          <Container className="content-layer">
            <div className="not-found-display">
              <div className="not-found-card">
                <Icon name="home" size={40} />
                <h4>Property Not Found</h4>
                <p>The requested property could not be found</p>
                <Button as={Link} to="/find-property" className="action-button">
                  <Icon name="arrowLeft" size={16} />
                  Back to Properties
                </Button>
              </div>
            </div>
          </Container>
        </div>
        <style>{getPerfectStyles()}</style>
      </>
    );
  }

  return (
    <>
      <div className="property-container">
        
        {/* ✅ PERFECT ANIMATED BACKGROUND */}
        <div className="animated-background">
          <div className="gradient-overlay"></div>
          <div className="grid-pattern"></div>
          <div className="floating-elements">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>

        {/* ✅ CONTENT LAYER */}
        <Container className="content-layer">
          
          {/* Back Button */}
          <div className="back-section">
            <Button as={Link} to="/find-property" className="back-button">
              <Icon name="arrowLeft" size={16} />
              Back to Properties
            </Button>
          </div>

          <Row className="g-4">
            <Col lg={8}>
              
              {/* Property Images */}
              <Card className="glass-card image-card">
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
                          <div className="image-overlay">
                            <span className="image-counter">
                              {index + 1} / {property.images.length}
                            </span>
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
                      <Icon name="home" size={64} />
                      <p>No images available</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Property Details */}
              <Card className="glass-card details-card">
                <Card.Body>
                  
                  {/* Badges */}
                  <div className="badge-container">
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
                  <div className="property-header">
                    <h1 className="property-title">{property.title}</h1>
                    <div className="price-section">
                      <Icon name="dollarSign" size={24} />
                      <span className="price-amount">
                        {formatPrice(property.price, property.rentType[0])}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="location-section">
                    <Icon name="mapPin" size={20} />
                    <span className="location-text">
                      {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state} - {property.address.pincode}
                    </span>
                  </div>

                  {/* Property Details Grid */}
                  <div className="details-grid">
                    <Row>
                      <Col md={6}>
                        <div className="detail-item">
                          <Icon name="maximize" size={18} />
                          <div className="detail-content">
                            <span className="detail-label">Size</span>
                            <span className="detail-value">{property.size}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <Icon name="tag" size={18} />
                          <div className="detail-content">
                            <span className="detail-label">Category</span>
                            <span className="detail-value">{property.category}</span>
                          </div>
                        </div>
                        {property.subtype && (
                          <div className="detail-item">
                            <Icon name="tag" size={18} />
                            <div className="detail-content">
                              <span className="detail-label">Type</span>
                              <span className="detail-value">{property.subtype}</span>
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <Icon name="phone" size={18} />
                          <div className="detail-content">
                            <span className="detail-label">Contact</span>
                            <span className="detail-value">{property.contact}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <Icon name="dollarSign" size={18} />
                          <div className="detail-content">
                            <span className="detail-label">Rent Types</span>
                            <span className="detail-value">{property.rentType.join(', ')}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <Icon name="calendar" size={18} />
                          <div className="detail-content">
                            <span className="detail-label">Added</span>
                            <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Description */}
                  <div className="description-section">
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
              <Card className="glass-card booking-card sticky-card">
                <div className="booking-header">
                  <Icon name="calendar" size={24} />
                  <h5>Book This Property</h5>
                </div>
                <Card.Body>
                  
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
                  
                  <div className="payment-info">
                    <Icon name="dollarSign" size={16} />
                    <span>Payment: On Spot Only</span>
                  </div>

                  {/* Features - ONLY CHANGE: PROPERLY FORMATTED FEATURES */}
                  <div className="features-section">
                    <h6 className="features-title">
                      <Icon name="star" size={18} />
                      Property Features
                    </h6>
                    <div className="features-list">
                      <div className="feature-item">
                        <Icon name="check" size={16} />
                        <span>{property.category} Space</span>
                      </div>
                      <div className="feature-item">
                        <Icon name="check" size={16} />
                        <span>{property.size.toString().match(/\d+$/) ? `${property.size} sq ft` : property.size} Area</span>
                      </div>
                      <div className="feature-item">
                        <Icon name="check" size={16} />
                        <span>{property.rentType.join('/')} Rental</span>
                      </div>
                      <div className="feature-item">
                        <Icon name="check" size={16} />
                        <span>Direct Owner Contact</span>
                      </div>
                    </div>
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

      <style>{getPerfectStyles()}</style>
    </>
  );
};

// ✅ PERFECT ANIMATION STYLES (YOUR EXACT ORIGINAL STYLES)
const getPerfectStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .property-container {
    min-height: 100vh;
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding-top: 100px;
    padding-bottom: 60px;
  }
  
  /* ✅ PERFECT ANIMATED BACKGROUND */
  .animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #f8fafc 0%, 
      #e2e8f0 20%, 
      #cbd5e1 40%, 
      #94a3b8 60%, 
      #64748b 80%, 
      #475569 100%);
    animation: gradientShift 20s ease-in-out infinite;
  }
  
  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridFloat 30s linear infinite;
  }
  
  .floating-elements {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.7;
  }
  
  .orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%);
    top: 10%;
    left: 10%;
    animation: float1 15s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
    top: 60%;
    right: 15%;
    animation: float2 18s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
    bottom: 20%;
    left: 20%;
    animation: float3 22s ease-in-out infinite;
  }
  
  /* ✅ CONTENT LAYER */
  .content-layer {
    position: relative;
    z-index: 2;
  }
  
  /* ✅ GLASS MORPHISM CARDS */
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 25px -8px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: cardSlideIn 0.8s ease-out;
  }
  
  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 35px 60px -12px rgba(0, 0, 0, 0.3),
      0 12px 35px -8px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
  
  /* ✅ BACK SECTION */
  .back-section {
    margin-bottom: 2rem;
    animation: slideInFromLeft 0.6s ease-out;
  }
  
  .back-button {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none;
    border-radius: 16px;
    padding: 12px 24px;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
    text-decoration: none;
  }
  
  .back-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(124, 58, 237, 0.5);
    background: linear-gradient(135deg, #6d28d9, #7c3aed);
    color: white;
  }
  
  /* ✅ IMAGE CARD */
  .image-card {
    margin-bottom: 2rem;
    overflow: hidden;
  }
  
  .image-container {
    position: relative;
    height: 450px;
    border-radius: 20px;
    overflow: hidden;
  }
  
  .property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  .property-image:hover {
    transform: scale(1.05);
  }
  
  .image-overlay {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    color: white;
    padding: 8px 16px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .no-image {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    color: #64748b;
    border-radius: 20px;
  }
  
  .no-image p {
    margin-top: 16px;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  /* ✅ PROPERTY DETAILS */
  .badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .property-badge {
    border-radius: 16px;
    padding: 8px 16px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
  }
  
  .property-badge.primary {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: white;
  }
  
  .property-badge.secondary {
    background: linear-gradient(135deg, #6b7280, #9ca3af);
    color: white;
  }
  
  .property-badge.info {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
  }
  
  .property-header {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid rgba(124, 58, 237, 0.1);
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
  
  .property-title {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #475569);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }
  
  .price-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .price-amount {
    font-size: 2rem;
    font-weight: 800;
    color: #10b981;
  }
  
  .location-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.02));
    border-radius: 16px;
    border-left: 4px solid #ef4444;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
  
  .location-text {
    font-size: 1.1rem;
    color: #374151;
    font-weight: 500;
  }
  
  .details-grid {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid rgba(124, 58, 237, 0.1);
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
  }
  
  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .detail-value {
    font-size: 1rem;
    color: #1e293b;
    font-weight: 600;
  }
  
  .description-section {
    animation: fadeInUp 0.8s ease-out 0.6s both;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.4rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }
  
  .description-content {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    padding: 24px;
    border-radius: 16px;
    border-left: 4px solid #7c3aed;
    font-size: 1rem;
    line-height: 1.7;
    color: #374151;
    white-space: pre-line;
  }
  
  /* ✅ BOOKING CARD */
  .sticky-card {
    position: sticky;
    top: 20px;
    animation: slideInFromRight 0.8s ease-out;
  }
  
  .booking-header {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: white;
    padding: 20px;
    border-radius: 24px 24px 0 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .booking-header h5 {
    margin: 0;
    font-weight: 700;
    font-size: 1.3rem;
  }
  
  .booking-price {
    text-align: center;
    padding: 24px 0;
    border-bottom: 2px solid rgba(124, 58, 237, 0.1);
    margin-bottom: 24px;
  }
  
  .price-large {
    font-size: 2.2rem;
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
    border-radius: 16px;
    padding: 18px;
    font-size: 1.2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    text-decoration: none;
    color: white;
  }
  
  .book-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(16, 185, 129, 0.5);
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
  }
  
  .payment-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #6b7280;
    margin-bottom: 24px;
    font-weight: 500;
  }
  
  .features-section {
    border-bottom: 2px solid rgba(124, 58, 237, 0.1);
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
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
    border: 1px solid rgba(16, 185, 129, 0.1);
    border-radius: 16px;
    padding: 20px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 0.95rem;
    color: #10b981;
    font-weight: 500;
  }
  
  .feature-item:last-child {
    margin-bottom: 0;
  }
  
  .booking-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #f59e0b;
    font-weight: 500;
  }
  
  /* ✅ LOADING & ERROR STATES */
  .loading-display,
  .error-display,
  .not-found-display {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }
  
  .loading-card,
  .error-card,
  .not-found-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    animation: cardSlideIn 0.8s ease-out;
  }
  
  .loading-card h4,
  .error-card h4,
  .not-found-card h4 {
    margin: 20px 0 10px 0;
    color: #1e293b;
    font-weight: 700;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-left: 3px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  
  .action-button {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .action-button:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #6d28d9, #7c3aed);
    color: white;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift {
    0%, 100% { 
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 20%, #cbd5e1 40%, #94a3b8 60%, #64748b 80%, #475569 100%);
    }
    50% { 
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 20%, #94a3b8 40%, #64748b 60%, #475569 80%, #334155 100%);
    }
  }
  
  @keyframes gridFloat {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.1); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-25px, -20px) scale(1.05); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -25px) scale(1.08); }
  }
  
  @keyframes cardSlideIn {
    from { 
      opacity: 0; 
      transform: translateY(30px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes slideInFromLeft {
    from { 
      opacity: 0; 
      transform: translateX(-30px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes slideInFromRight {
    from { 
      opacity: 0; 
      transform: translateX(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .sticky-card { position: static; }
    .property-title { font-size: 2rem; }
    .price-large { font-size: 1.8rem; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
  }
  
  @media (max-width: 767.98px) {
    .property-container { padding-top: 80px; }
    .image-container { height: 300px; }
    .property-title { font-size: 1.8rem; }
  }
`;

export default PropertyDetails;
