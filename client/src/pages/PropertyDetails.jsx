import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Carousel } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { api, handleApiError, formatPrice, getImageUrl } from '../utils/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
          {/* ✅ COLORFUL THEME BACKGROUND */}
          <div className="colorful-background">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
            <div className="particles">
              {[...Array(18)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.9}s`
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
        <style>{getPropertyStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-details-container">
          <div className="colorful-background">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
            <div className="particles">
              {[...Array(18)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.9}s`
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

          <Container className="py-4">
            <Alert variant="danger" className="error-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="back-button">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getPropertyStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="property-details-container">
          <div className="colorful-background">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
            <div className="particles">
              {[...Array(18)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.9}s`
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

          <Container className="py-4">
            <Alert variant="warning" className="error-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-button">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getPropertyStyles()}</style>
      </>
    );
  }

  return (
    <>
      <div className="property-details-container">
        
        {/* ✅ COLORFUL THEME BACKGROUND - SAME AS LOGIN */}
        <div className="colorful-background">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
          <div className="particles">
            {[...Array(18)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.9}s`
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

        <Container className="py-4 position-relative">
          
          {/* ✅ BACK BUTTON */}
          <Row>
            <Col>
              <div className="mb-4">
                <Button as={Link} to="/find-property" className="back-button mb-3">
                  ← Back to Properties
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              
              {/* ✅ AMAZING IMAGE CARD */}
              <Card className="property-card image-card mb-4">
                {property.images && property.images.length > 0 ? (
                  <Carousel className="property-carousel" indicators={true} controls={true}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="property-image w-100"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="property-image w-100"
                  />
                ) : (
                  <div className="no-image-state">
                    <div className="no-image-icon">🏠</div>
                    <p className="no-image-text">No images available</p>
                  </div>
                )}
              </Card>

              {/* ✅ AMAZING DETAILS CARD */}
              <Card className="property-card details-card">
                <Card.Body className="card-body">
                  
                  {/* Badges Section */}
                  <div className="badges-section mb-4">
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

                  {/* Title */}
                  <h1 className="property-title mb-4">{property.title}</h1>

                  {/* Price & Location */}
                  <div className="price-location-section mb-4">
                    <div className="price-display">
                      <div className="price-icon">💰</div>
                      <div className="price-content">
                        <h4 className="property-price">
                          {formatPrice(property.price, property.rentType[0])}
                        </h4>
                        <p className="price-subtitle">
                          Available for {property.rentType.join(', ')} rental
                        </p>
                      </div>
                    </div>
                    <div className="location-display">
                      <div className="location-icon">📍</div>
                      <div className="location-content">
                        <p className="property-location">
                          {property.address.street && `${property.address.street}, `}
                          {property.address.city}, {property.address.state} - {property.address.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="details-section mb-4">
                    <h5 className="section-title mb-3">
                      <span className="section-icon">📊</span>
                      Property Details
                    </h5>
                    <Row className="details-grid">
                      <Col md={6}>
                        <div className="detail-item">
                          <div className="detail-icon">📐</div>
                          <div className="detail-content">
                            <strong className="detail-label">Size:</strong>
                            <span className="detail-value">{property.size}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">🏷️</div>
                          <div className="detail-content">
                            <strong className="detail-label">Category:</strong>
                            <span className="detail-value">{property.category}</span>
                          </div>
                        </div>
                        {property.subtype && (
                          <div className="detail-item">
                            <div className="detail-icon">🏷️</div>
                            <div className="detail-content">
                              <strong className="detail-label">Type:</strong>
                              <span className="detail-value">{property.subtype}</span>
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="detail-item">
                          <div className="detail-icon">📞</div>
                          <div className="detail-content">
                            <strong className="detail-label">Contact:</strong>
                            <span className="detail-value">{property.contact}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">💰</div>
                          <div className="detail-content">
                            <strong className="detail-label">Rent Types:</strong>
                            <span className="detail-value">{property.rentType.join(', ')}</span>
                          </div>
                        </div>
                        <div className="detail-item">
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
                  <div className="description-section">
                    <h5 className="section-title mb-3">
                      <span className="section-icon">📝</span>
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
              
              {/* ✅ AMAZING BOOKING CARD */}
              <Card className="property-card booking-card">
                <div className="booking-header">
                  <div className="booking-header-icon">📋</div>
                  <h5 className="booking-header-title">Book This Property</h5>
                </div>
                <Card.Body className="card-body">
                  
                  {/* Price Display */}
                  <div className="booking-price-section mb-4">
                    <h3 className="booking-price">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="booking-price-subtitle">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  {/* Book Button */}
                  <div className="booking-actions mb-4">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="book-button"
                      size="lg"
                    >
                      <span className="button-icon">📅</span>
                      Book Now
                    </Button>
                    
                    <div className="payment-info">
                      <span className="payment-icon">💳</span>
                      <small className="payment-text">Payment: On Spot Only</small>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="features-section">
                    <h6 className="features-title mb-3">
                      <span className="features-icon">✨</span>
                      Property Features
                    </h6>
                    <div className="features-list">
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.category} Space</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.size} Area</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.rentType.join('/')} Rental</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">Direct Owner Contact</span>
                      </div>
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="booking-notice">
                    <span className="notice-icon">⚠️</span>
                    <small className="notice-text">Complete your profile before booking</small>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{getPropertyStyles()}</style>
    </>
  );
};

// 🎨 COLORFUL THEME STYLES - SAME AS LOGIN
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* ✅ COLORFUL BACKGROUND - SAME AS LOGIN */
  .colorful-background {
    position: fixed;
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
  
  .mouse-follower {
    position: absolute;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(15px);
    transition: transform 0.3s ease-out;
    pointer-events: none;
  }
  
  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
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
  
  /* ✅ AMAZING PROPERTY CARDS */
  .property-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 20px !important;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.1),
      0 8px 25px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    z-index: 10;
    transition: all 0.3s ease !important;
    animation: cardAppear 0.8s ease-out;
    overflow: hidden;
  }
  
  .property-card:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.15),
      0 10px 30px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  .property-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7c3aed 0%, #3b82f6 35%, #10b981 70%, #f59e0b 100%);
    border-radius: 20px 20px 0 0;
  }
  
  .card-body {
    padding: 2rem !important;
    color: #1f2937;
  }
  
  /* ✅ BACK BUTTON */
  .back-button {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 14px 28px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25) !important;
    text-decoration: none !important;
    animation: slideInLeft 0.6s ease-out;
  }
  
  .back-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.35) !important;
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
    color: white !important;
  }
  
  /* ✅ IMAGE CARD */
  .image-card::before {
    background: linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  }
  
  .property-image {
    height: 350px !important;
    object-fit: cover !important;
    border-radius: 16px !important;
    transition: transform 0.6s ease !important;
  }
  
  .property-image:hover {
    transform: scale(1.02);
  }
  
  .property-carousel .carousel-indicators {
    bottom: 15px !important;
  }
  
  .property-carousel .carousel-indicators button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    margin: 0 5px !important;
    background-color: rgba(255, 255, 255, 0.7) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
  }
  
  .property-carousel .carousel-indicators button.active {
    background-color: rgba(124, 58, 237, 0.9) !important;
    border-color: rgba(124, 58, 237, 1) !important;
  }
  
  .property-carousel .carousel-control-prev,
  .property-carousel .carousel-control-next {
    width: 50px !important;
    height: 50px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: rgba(0, 0, 0, 0.6) !important;
    border-radius: 50% !important;
    border: none !important;
    backdrop-filter: blur(10px) !important;
  }
  
  .property-carousel .carousel-control-prev {
    left: 15px !important;
  }
  
  .property-carousel .carousel-control-next {
    right: 15px !important;
  }
  
  .no-image-state {
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
  
  /* ✅ DETAILS CARD */
  .details-card::before {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  }
  
  .badges-section {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .property-badge {
    border-radius: 16px !important;
    padding: 8px 16px !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  }
  
  .property-badge.primary {
    background: linear-gradient(135deg, #7c3aed, #a855f7) !important;
    color: white !important;
  }
  
  .property-badge.secondary {
    background: linear-gradient(135deg, #f093fb, #f5576c) !important;
    color: white !important;
  }
  
  .property-badge.info {
    background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
    color: white !important;
  }
  
  .property-title {
    font-size: 2.5rem !important;
    font-weight: 900 !important;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
  
  .price-location-section {
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
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 1.5rem;
  }
  
  .price-icon {
    font-size: 1.8rem;
    margin-top: 5px;
  }
  
  .price-content h4 {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 1.8rem !important;
    margin: 0 0 5px 0 !important;
  }
  
  .price-subtitle {
    color: #6b7280 !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .location-display {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .location-icon {
    font-size: 1.5rem;
  }
  
  .property-location {
    color: #374151 !important;
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .details-section {
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }
  
  .section-title {
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
  
  .details-grid {
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.05) 0%, 
      rgba(102, 126, 234, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(102, 126, 234, 0.1);
  }
  
  .detail-item {
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
  
  .description-section {
    animation: fadeInUp 0.8s ease-out 0.6s both;
  }
  
  .description-content {
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
  
  /* ✅ BOOKING CARD */
  .booking-card {
    position: sticky;
    top: 20px;
  }
  
  .booking-card::before {
    background: linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%);
  }
  
  .booking-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 1.5rem 2rem;
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: -1px -1px 0 -1px;
  }
  
  .booking-header-icon {
    font-size: 1.5rem;
  }
  
  .booking-header-title {
    font-weight: 800;
    font-size: 1.2rem;
    margin: 0;
  }
  
  .booking-price-section {
    text-align: center;
    padding: 1.5rem 0;
    border-bottom: 3px solid rgba(16, 185, 129, 0.1);
  }
  
  .booking-price {
    color: #10b981 !important;
    font-weight: 900 !important;
    font-size: 2rem !important;
    margin-bottom: 8px !important;
  }
  
  .booking-price-subtitle {
    color: #6b7280 !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .booking-actions {
    border-bottom: 3px solid rgba(16, 185, 129, 0.1);
  }
  
  .book-button {
    width: 100% !important;
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 16px 24px !important;
    font-size: 1rem !important;
    font-weight: 800 !important;
    margin-bottom: 1rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.25) !important;
    text-decoration: none !important;
    color: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
  }
  
  .book-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 12px 30px rgba(245, 87, 108, 0.35) !important;
    background: linear-gradient(135deg, #e11d48 0%, #ec4899 100%) !important;
    color: white !important;
  }
  
  .button-icon {
    font-size: 1.1rem;
  }
  
  .payment-info {
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
  
  .features-section {
    border-bottom: 3px solid rgba(16, 185, 129, 0.1);
    padding-bottom: 1.5rem;
  }
  
  .features-title {
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
  
  .features-list {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.08) 0%, 
      rgba(16, 185, 129, 0.03) 100%);
    border: 2px solid rgba(16, 185, 129, 0.1);
    border-radius: 16px;
    padding: 1.2rem;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #047857;
  }
  
  .feature-item:last-child {
    margin-bottom: 0;
  }
  
  .feature-check {
    font-size: 1rem;
  }
  
  .booking-notice {
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
  
  /* ✅ ERROR ALERTS */
  .error-alert {
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
    border: 4px solid rgba(124, 58, 237, 0.2);
    border-left: 4px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1.5rem auto;
  }
  
  .loading-card h4 {
    color: #1e293b;
    font-weight: 800;
    margin: 1.5rem 0;
  }
  
  /* ✅ ANIMATIONS - SAME AS LOGIN */
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
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
    .booking-card { position: static; }
    .property-title { font-size: 2rem !important; }
    .booking-price { font-size: 1.6rem !important; }
  }
  
  @media (max-width: 767.98px) {
    .card-body { padding: 1.5rem !important; }
    .property-image { height: 280px !important; }
    .property-title { font-size: 1.8rem !important; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
    .price-display { flex-direction: column; align-items: flex-start; gap: 10px; }
    .location-display { flex-direction: column; align-items: flex-start; gap: 10px; }
  }
`;

export default PropertyDetails;
