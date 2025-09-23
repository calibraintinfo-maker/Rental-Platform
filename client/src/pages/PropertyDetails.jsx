import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Carousel } from 'react-bootstrap';
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

  if (loading) {
    return (
      <>
        <div className="property-details-container">
          <div className="rich-animated-bg">
            <div className="gradient-layers">
              <div className="gradient-layer-1"></div>
              <div className="gradient-layer-2"></div>
              <div className="gradient-layer-3"></div>
            </div>
            <div className="grid-patterns">
              <div className="grid-pattern-1"></div>
              <div className="grid-pattern-2"></div>
            </div>
            <div className="floating-elements">
              <div className="floating-orb orb-1"></div>
              <div className="floating-orb orb-2"></div>
              <div className="floating-orb orb-3"></div>
              <div className="floating-orb orb-4"></div>
              <div className="floating-orb orb-5"></div>
              <div className="floating-orb orb-6"></div>
            </div>
            <div className="decorative-shapes">
              <div className="shape-1"></div>
              <div className="shape-2"></div>
              <div className="shape-3"></div>
              <div className="shape-4"></div>
            </div>
          </div>
          <Container className="py-4">
            <div className="loading-state">
              <div className="loading-card">
                <div className="loading-icon">🏠</div>
                <div className="spinner"></div>
                <h4>Loading property details...</h4>
              </div>
            </div>
          </Container>
        </div>
        <style>{getRichPropertyStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-details-container">
          <div className="rich-animated-bg">
            <div className="gradient-layers">
              <div className="gradient-layer-1"></div>
              <div className="gradient-layer-2"></div>
              <div className="gradient-layer-3"></div>
            </div>
            <div className="grid-patterns">
              <div className="grid-pattern-1"></div>
              <div className="grid-pattern-2"></div>
            </div>
            <div className="floating-elements">
              <div className="floating-orb orb-1"></div>
              <div className="floating-orb orb-2"></div>
              <div className="floating-orb orb-3"></div>
              <div className="floating-orb orb-4"></div>
              <div className="floating-orb orb-5"></div>
              <div className="floating-orb orb-6"></div>
            </div>
            <div className="decorative-shapes">
              <div className="shape-1"></div>
              <div className="shape-2"></div>
              <div className="shape-3"></div>
              <div className="shape-4"></div>
            </div>
          </div>
          <Container className="py-4">
            <Alert variant="danger" className="rich-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="rich-back-btn">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getRichPropertyStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="property-details-container">
          <div className="rich-animated-bg">
            <div className="gradient-layers">
              <div className="gradient-layer-1"></div>
              <div className="gradient-layer-2"></div>
              <div className="gradient-layer-3"></div>
            </div>
            <div className="grid-patterns">
              <div className="grid-pattern-1"></div>
              <div className="grid-pattern-2"></div>
            </div>
            <div className="floating-elements">
              <div className="floating-orb orb-1"></div>
              <div className="floating-orb orb-2"></div>
              <div className="floating-orb orb-3"></div>
              <div className="floating-orb orb-4"></div>
              <div className="floating-orb orb-5"></div>
              <div className="floating-orb orb-6"></div>
            </div>
            <div className="decorative-shapes">
              <div className="shape-1"></div>
              <div className="shape-2"></div>
              <div className="shape-3"></div>
              <div className="shape-4"></div>
            </div>
          </div>
          <Container className="py-4">
            <Alert variant="warning" className="rich-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="rich-back-btn">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getRichPropertyStyles()}</style>
      </>
    );
  }

  return (
    <>
      <div className="property-details-container">
        
        {/* ✅ RICH ANIMATED BACKGROUND */}
        <div className="rich-animated-bg">
          <div className="gradient-layers">
            <div className="gradient-layer-1"></div>
            <div className="gradient-layer-2"></div>
            <div className="gradient-layer-3"></div>
          </div>
          <div className="grid-patterns">
            <div className="grid-pattern-1"></div>
            <div className="grid-pattern-2"></div>
          </div>
          <div className="floating-elements">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div className="floating-orb orb-5"></div>
            <div className="floating-orb orb-6"></div>
          </div>
          <div className="decorative-shapes">
            <div className="shape-1"></div>
            <div className="shape-2"></div>
            <div className="shape-3"></div>
            <div className="shape-4"></div>
          </div>
        </div>

        <Container className="py-4">
          <Row>
            <Col>
              <div className="mb-4">
                <Button as={Link} to="/find-property" className="rich-back-btn mb-3">
                  ← Back to Properties
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              
              {/* ✅ CLEAN IMAGE CAROUSEL - NO LABELS */}
              <Card className="rich-card mb-4">
                {property.images && property.images.length > 0 ? (
                  <Carousel className="rich-carousel" indicators={true} controls={true}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="rich-property-image w-100"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="rich-property-image w-100"
                  />
                ) : (
                  <div className="rich-no-image">
                    <div className="no-image-icon">🏠</div>
                    <p className="no-image-text">No images available</p>
                  </div>
                )}
              </Card>

              {/* ✅ RICH PROPERTY DETAILS */}
              <Card className="rich-card">
                <Card.Body className="rich-card-body">
                  
                  {/* Badges */}
                  <div className="rich-badges mb-4">
                    <Badge className="rich-badge primary">{property.category}</Badge>
                    {property.subtype && (
                      <Badge className="rich-badge secondary">{property.subtype}</Badge>
                    )}
                    {property.rentType.map(type => (
                      <Badge key={type} className="rich-badge info">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="rich-title mb-4">{property.title}</h1>

                  {/* Price & Location */}
                  <div className="rich-price-location mb-4">
                    <div className="price-display">
                      <div className="price-icon">💰</div>
                      <h4 className="rich-price">
                        {formatPrice(property.price, property.rentType[0])}
                      </h4>
                    </div>
                    <div className="location-display">
                      <div className="location-icon">📍</div>
                      <p className="rich-location">
                        {property.address.street && `${property.address.street}, `}
                        {property.address.city}, {property.address.state} - {property.address.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="rich-details-section mb-4">
                    <h5 className="rich-section-title mb-3">
                      <span className="section-icon">📊</span>
                      Property Details
                    </h5>
                    <Row className="rich-details-grid">
                      <Col md={6}>
                        <div className="rich-detail-item">
                          <div className="detail-icon">📐</div>
                          <div className="detail-content">
                            <strong className="detail-label">Size:</strong>
                            <span className="detail-value">{property.size}</span>
                          </div>
                        </div>
                        <div className="rich-detail-item">
                          <div className="detail-icon">🏷️</div>
                          <div className="detail-content">
                            <strong className="detail-label">Category:</strong>
                            <span className="detail-value">{property.category}</span>
                          </div>
                        </div>
                        {property.subtype && (
                          <div className="rich-detail-item">
                            <div className="detail-icon">🏷️</div>
                            <div className="detail-content">
                              <strong className="detail-label">Type:</strong>
                              <span className="detail-value">{property.subtype}</span>
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="rich-detail-item">
                          <div className="detail-icon">📞</div>
                          <div className="detail-content">
                            <strong className="detail-label">Contact:</strong>
                            <span className="detail-value">{property.contact}</span>
                          </div>
                        </div>
                        <div className="rich-detail-item">
                          <div className="detail-icon">💰</div>
                          <div className="detail-content">
                            <strong className="detail-label">Rent Types:</strong>
                            <span className="detail-value">{property.rentType.join(', ')}</span>
                          </div>
                        </div>
                        <div className="rich-detail-item">
                          <div className="detail-icon">📅</div>
                          <div className="detail-content">
                            <strong className="detail-label">Added:</strong>
                            <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Description */}
                  <div className="rich-description-section">
                    <h5 className="rich-section-title mb-3">
                      <span className="section-icon">📝</span>
                      Description
                    </h5>
                    <div className="rich-description-content">
                      {property.description}
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              
              {/* ✅ RICH BOOKING CARD */}
              <Card className="rich-card rich-booking-card">
                <div className="rich-booking-header">
                  <div className="booking-header-icon">📋</div>
                  <h5 className="booking-header-title">Book This Property</h5>
                </div>
                <Card.Body className="rich-card-body">
                  
                  {/* Price Display */}
                  <div className="rich-booking-price mb-4">
                    <h3 className="rich-booking-amount">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="rich-booking-subtitle">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  {/* Book Button */}
                  <div className="rich-booking-actions mb-4">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="rich-book-btn"
                      size="lg"
                    >
                      <span className="btn-icon">📅</span>
                      Book Now
                    </Button>
                    
                    <div className="rich-payment-info">
                      <span className="payment-icon">💳</span>
                      <small className="payment-text">Payment: On Spot Only</small>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="rich-features-section">
                    <h6 className="rich-features-title mb-3">
                      <span className="features-icon">✨</span>
                      Property Features
                    </h6>
                    <div className="rich-features-list">
                      <div className="rich-feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.category} Space</span>
                      </div>
                      <div className="rich-feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.size} Area</span>
                      </div>
                      <div className="rich-feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.rentType.join('/')} Rental</span>
                      </div>
                      <div className="rich-feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">Direct Owner Contact</span>
                      </div>
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="rich-notice">
                    <span className="notice-icon">⚠️</span>
                    <small className="notice-text">Complete your profile before booking</small>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{getRichPropertyStyles()}</style>
    </>
  );
};

// 🎨 RICH PROFESSIONAL STYLES
const getRichPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  /* ✅ MAIN CONTAINER */
  .property-details-container {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* ✅ RICH ANIMATED BACKGROUND */
  .rich-animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
  
  .gradient-layers {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .gradient-layer-1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #667eea 0%, 
      #764ba2 20%, 
      #f093fb 40%, 
      #f5576c 60%, 
      #4facfe 80%, 
      #00f2fe 100%);
    animation: gradientShift1 20s ease-in-out infinite;
  }
  
  .gradient-layer-2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 25% 25%, 
      rgba(124, 58, 237, 0.15) 0%, 
      transparent 50%),
    radial-gradient(circle at 75% 75%, 
      rgba(59, 130, 246, 0.15) 0%, 
      transparent 50%),
    radial-gradient(circle at 50% 50%, 
      rgba(16, 185, 129, 0.1) 0%, 
      transparent 50%);
    animation: gradientShift2 25s ease-in-out infinite reverse;
  }
  
  .gradient-layer-3 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 25%, 
      rgba(255, 255, 255, 0.05) 50%, 
      transparent 75%, 
      rgba(255, 255, 255, 0.1) 100%);
    animation: gradientShift3 30s ease-in-out infinite;
  }
  
  .grid-patterns {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .grid-pattern-1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 80px 80px;
    animation: gridMove1 40s linear infinite;
  }
  
  .grid-pattern-2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.08) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: gridMove2 60s linear infinite reverse;
  }
  
  .floating-elements {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.7;
  }
  
  .orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.1) 40%, transparent 70%);
    top: 10%;
    left: 15%;
    animation: float1 15s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%);
    top: 70%;
    right: 20%;
    animation: float2 18s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%);
    bottom: 20%;
    left: 20%;
    animation: float3 22s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.2) 0%, rgba(245, 101, 101, 0.06) 40%, transparent 70%);
    top: 40%;
    right: 10%;
    animation: float4 25s ease-in-out infinite;
  }
  
  .orb-5 {
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(240, 147, 251, 0.2) 0%, rgba(240, 147, 251, 0.06) 40%, transparent 70%);
    top: 80%;
    left: 60%;
    animation: float5 20s ease-in-out infinite;
  }
  
  .orb-6 {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(79, 172, 254, 0.18) 0%, rgba(79, 172, 254, 0.05) 40%, transparent 70%);
    bottom: 60%;
    right: 50%;
    animation: float6 16s ease-in-out infinite;
  }
  
  .decorative-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape-1 {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    top: 15%;
    right: 15%;
    animation: rotate 40s linear infinite;
    transform-origin: center;
  }
  
  .shape-2 {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 40px solid rgba(255, 255, 255, 0.15);
    top: 60%;
    left: 80%;
    animation: float1 30s ease-in-out infinite;
  }
  
  .shape-3 {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    bottom: 25%;
    right: 25%;
    animation: pulse 10s ease-in-out infinite;
  }
  
  .shape-4 {
    position: absolute;
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    top: 30%;
    left: 5%;
    animation: float2 35s ease-in-out infinite;
  }
  
  /* ✅ RICH CARDS */
  .rich-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(30px) saturate(200%);
    -webkit-backdrop-filter: blur(30px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.9) !important;
    border-radius: 20px !important;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 10px 25px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
    position: relative;
    z-index: 10;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    animation: slideInUp 0.8s ease-out;
  }
  
  .rich-card:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 35px 70px rgba(0, 0, 0, 0.2),
      0 15px 35px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 1) !important;
  }
  
  .rich-card-body {
    padding: 2rem !important;
    color: #1f2937;
  }
  
  /* ✅ RICH BACK BUTTON */
  .rich-back-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 14px 28px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4) !important;
    text-decoration: none !important;
    animation: slideInLeft 0.6s ease-out;
  }
  
  .rich-back-btn:hover {
    transform: translateY(-4px) scale(1.05) !important;
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5) !important;
    background: linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%) !important;
    color: white !important;
  }
  
  /* ✅ RICH IMAGE STYLES - NO CAPTION LABELS */
  .rich-property-image {
    height: 350px !important;
    object-fit: cover !important;
    border-radius: 16px !important;
    transition: transform 0.6s ease !important;
  }
  
  .rich-property-image:hover {
    transform: scale(1.05);
  }
  
  .rich-carousel .carousel-indicators {
    bottom: 15px !important;
  }
  
  .rich-carousel .carousel-indicators button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    margin: 0 5px !important;
    background-color: rgba(255, 255, 255, 0.7) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
  }
  
  .rich-carousel .carousel-indicators button.active {
    background-color: rgba(124, 58, 237, 0.9) !important;
    border-color: rgba(124, 58, 237, 1) !important;
  }
  
  .rich-carousel .carousel-control-prev,
  .rich-carousel .carousel-control-next {
    width: 50px !important;
    height: 50px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: rgba(0, 0, 0, 0.6) !important;
    border-radius: 50% !important;
    border: none !important;
    backdrop-filter: blur(10px) !important;
  }
  
  .rich-carousel .carousel-control-prev {
    left: 15px !important;
  }
  
  .rich-carousel .carousel-control-next {
    right: 15px !important;
  }
  
  /* ✅ NO IMAGE STATE */
  .rich-no-image {
    height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 16px;
  }
  
  .no-image-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }
  
  .no-image-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: #64748b;
    margin: 0;
  }
  
  /* ✅ RICH BADGES */
  .rich-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .rich-badge {
    border-radius: 16px !important;
    padding: 8px 16px !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  }
  
  .rich-badge.primary {
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    color: white !important;
  }
  
  .rich-badge.secondary {
    background: linear-gradient(135deg, #f093fb, #f5576c) !important;
    color: white !important;
  }
  
  .rich-badge.info {
    background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
    color: white !important;
  }
  
  /* ✅ RICH TITLE */
  .rich-title {
    font-size: 2.5rem !important;
    font-weight: 900 !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
  
  /* ✅ RICH PRICE & LOCATION */
  .rich-price-location {
    background: linear-gradient(135deg, 
      rgba(245, 87, 108, 0.08) 0%, 
      rgba(245, 87, 108, 0.03) 100%);
    padding: 1.5rem;
    border-radius: 20px;
    border-left: 5px solid #f5576c;
    margin-bottom: 2rem;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
  
  .price-display {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1rem;
  }
  
  .price-icon {
    font-size: 1.8rem;
  }
  
  .rich-price {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 1.8rem !important;
    margin: 0 !important;
  }
  
  .location-display {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .location-icon {
    font-size: 1.5rem;
  }
  
  .rich-location {
    color: #374151 !important;
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  /* ✅ RICH DETAILS SECTION */
  .rich-details-section {
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }
  
  .rich-section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1e293b;
    font-weight: 800;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
  
  .section-icon {
    font-size: 1.4rem;
  }
  
  .rich-details-grid {
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.05) 0%, 
      rgba(102, 126, 234, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(102, 126, 234, 0.1);
  }
  
  .rich-detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .detail-icon {
    font-size: 1.2rem;
    width: 30px;
    text-align: center;
  }
  
  .detail-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .detail-label {
    color: #374151;
    font-weight: 700;
    font-size: 0.9rem;
    min-width: 80px;
  }
  
  .detail-value {
    color: #1e293b;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  /* ✅ RICH DESCRIPTION */
  .rich-description-section {
    animation: fadeInUp 0.8s ease-out 0.6s both;
  }
  
  .rich-description-content {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.05) 0%, 
      rgba(16, 185, 129, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 16px;
    border-left: 5px solid #10b981;
    font-size: 1rem;
    line-height: 1.7;
    color: #374151;
    white-space: pre-line;
  }
  
  /* ✅ RICH BOOKING CARD */
  .rich-booking-card {
    position: sticky;
    top: 20px;
  }
  
  .rich-booking-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .booking-header-icon {
    font-size: 1.5rem;
  }
  
  .booking-header-title {
    font-weight: 800;
    font-size: 1.2rem;
    margin: 0;
  }
  
  .rich-booking-price {
    text-align: center;
    padding: 1.5rem 0;
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
  }
  
  .rich-booking-amount {
    color: #10b981 !important;
    font-weight: 900 !important;
    font-size: 2rem !important;
    margin-bottom: 8px !important;
  }
  
  .rich-booking-subtitle {
    color: #6b7280 !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .rich-booking-actions {
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
  }
  
  .rich-book-btn {
    width: 100% !important;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 16px 24px !important;
    font-size: 1rem !important;
    font-weight: 800 !important;
    margin-bottom: 1rem !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3) !important;
    text-decoration: none !important;
    color: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
  }
  
  .rich-book-btn:hover {
    transform: translateY(-4px) scale(1.02) !important;
    box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4) !important;
    background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
    color: white !important;
  }
  
  .btn-icon {
    font-size: 1.1rem;
  }
  
  .rich-payment-info {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #6b7280;
    font-weight: 600;
  }
  
  .payment-icon {
    font-size: 1rem;
  }
  
  /* ✅ RICH FEATURES */
  .rich-features-section {
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
    padding-bottom: 1.5rem;
  }
  
  .rich-features-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #1e293b;
    font-weight: 800;
    font-size: 1.1rem;
  }
  
  .features-icon {
    font-size: 1.2rem;
  }
  
  .rich-features-list {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.08) 0%, 
      rgba(16, 185, 129, 0.03) 100%);
    border: 2px solid rgba(16, 185, 129, 0.1);
    border-radius: 16px;
    padding: 1.2rem;
  }
  
  .rich-feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #047857;
  }
  
  .rich-feature-item:last-child {
    margin-bottom: 0;
  }
  
  .feature-check {
    font-size: 1rem;
  }
  
  /* ✅ RICH NOTICE */
  .rich-notice {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 1rem;
    background: linear-gradient(135deg, 
      rgba(245, 158, 11, 0.1) 0%, 
      rgba(245, 158, 11, 0.05) 100%);
    border-radius: 12px;
    border: 1px solid rgba(245, 158, 11, 0.2);
    color: #d97706;
    font-weight: 700;
  }
  
  .notice-icon {
    font-size: 1.1rem;
  }
  
  /* ✅ RICH ALERTS */
  .rich-alert {
    background: rgba(254, 242, 242, 0.9) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    border-radius: 16px !important;
    padding: 1.5rem !important;
    color: #dc2626 !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
  }
  
  /* ✅ LOADING STATE */
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }
  
  .loading-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  }
  
  .loading-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-left: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1.5rem auto;
  }
  
  .loading-card h4 {
    color: #1e293b;
    font-weight: 800;
    margin: 1.5rem 0;
  }
  
  /* ✅ RICH ANIMATIONS */
  @keyframes gradientShift1 {
    0%, 100% { 
      background-position: 0% 50%; 
      opacity: 1;
    }
    50% { 
      background-position: 100% 50%; 
      opacity: 0.8;
    }
  }
  
  @keyframes gradientShift2 {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
  }
  
  @keyframes gradientShift3 {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(50px); }
  }
  
  @keyframes gridMove1 {
    0% { transform: translate(0, 0); }
    100% { transform: translate(80px, 80px); }
  }
  
  @keyframes gridMove2 {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(30px, -20px) rotate(90deg) scale(1.1); }
    50% { transform: translate(-20px, -40px) rotate(180deg) scale(0.9); }
    75% { transform: translate(-35px, 25px) rotate(270deg) scale(1.05); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    33% { transform: translate(-35px, -20px) rotate(120deg) scale(1.15); }
    66% { transform: translate(20px, -35px) rotate(240deg) scale(0.85); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    20% { transform: translate(20px, -15px) scale(1.08) rotate(72deg); }
    40% { transform: translate(-15px, -25px) scale(0.92) rotate(144deg); }
    60% { transform: translate(-25px, 10px) scale(1.04) rotate(216deg); }
    80% { transform: translate(15px, 20px) scale(0.96) rotate(288deg); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(15px, -25px) scale(1.12); }
    50% { transform: translate(-25px, -15px) scale(0.88); }
    75% { transform: translate(-10px, 20px) scale(1.06); }
  }
  
  @keyframes float5 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    30% { transform: translate(25px, -10px) scale(1.1) rotate(90deg); }
    70% { transform: translate(-20px, 25px) scale(0.9) rotate(270deg); }
  }
  
  @keyframes float6 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40% { transform: translate(-20px, -20px) scale(1.15); }
    80% { transform: translate(20px, 15px) scale(0.85); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.3); opacity: 0.3; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-30px); 
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
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .rich-booking-card { position: static; }
    .rich-title { font-size: 2rem !important; }
    .rich-booking-amount { font-size: 1.6rem !important; }
  }
  
  @media (max-width: 767.98px) {
    .rich-card-body { padding: 1.5rem !important; }
    .rich-property-image { height: 280px !important; }
    .rich-title { font-size: 1.8rem !important; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
    .orb-5 { width: 80px; height: 80px; }
    .orb-6 { width: 60px; height: 60px; }
  }
`;

export default PropertyDetails;
