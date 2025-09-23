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

  // ✅ LOADING STATE WITH PROPER STYLING
  if (loading) {
    return (
      <>
        <div className="property-details-container">
          <div className="animated-background">
            <div className="gradient-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
          <Container className="py-4 main-content">
            <div className="loading-state">
              <div className="spinner"></div>
              <h4>Loading property details...</h4>
            </div>
          </Container>
        </div>
        <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
      </>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <>
        <div className="property-details-container">
          <Container className="py-4 main-content">
            <Alert variant="danger" className="error-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="back-button">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
      </>
    );
  }

  // ✅ NO PROPERTY STATE
  if (!property) {
    return (
      <>
        <div className="property-details-container">
          <Container className="py-4 main-content">
            <Alert variant="warning" className="error-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-button">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
      </>
    );
  }

  return (
    <>
      <div className="property-details-container">
        {/* ✅ ANIMATED BACKGROUND - FIXED */}
        <div className="animated-background">
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
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1.2}s`
                }}
              />
            ))}
          </div>
        </div>

        <Container className="py-4 main-content">
          {/* ✅ BACK BUTTON */}
          <Row>
            <Col>
              <Button as={Link} to="/find-property" className="back-button mb-4">
                ← Back to Properties
              </Button>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              {/* ✅ PROPERTY IMAGES - FIXED TO SHOW PROPERLY */}
              <Card className="property-card image-card mb-4">
                <Card.Body className="p-0">
                  {property.images && property.images.length > 0 ? (
                    <Carousel 
                      className="property-carousel" 
                      indicators={property.images.length > 1} 
                      controls={property.images.length > 1}
                      interval={null}
                    >
                      {property.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img 
                            src={getImageUrl(image)} 
                            alt={property.title || 'Property'}
                            className="property-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/800x400?text=Property+Image';
                            }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : property.image ? (
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title || 'Property'}
                      className="property-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x400?text=Property+Image';
                      }}
                    />
                  ) : (
                    <div className="no-image-state">
                      <div className="no-image-icon">🏠</div>
                      <p className="no-image-text">No images available</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* ✅ PROPERTY DETAILS CARD - FIXED CONTENT */}
              <Card className="property-card details-card">
                <Card.Body>
                  {/* ✅ BADGES */}
                  <div className="badges-section mb-3">
                    <Badge className="property-badge primary">{property.category || 'Property'}</Badge>
                    {property.subtype && (
                      <Badge className="property-badge secondary me-2">{property.subtype}</Badge>
                    )}
                    {property.rentType && property.rentType.length > 0 && property.rentType.map((type, index) => (
                      <Badge key={index} className="property-badge info me-1">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* ✅ TITLE */}
                  <h1 className="property-title mb-3">
                    {property.title || property.category || 'Property Title'}
                  </h1>

                  {/* ✅ PRICE & LOCATION */}
                  <div className="price-location-section mb-4">
                    <div className="price-display">
                      <div className="price-icon">💰</div>
                      <div className="price-content">
                        <h4 className="property-price">
                          {property.price ? formatPrice(property.price, property.rentType?.[0] || 'monthly') : '₹Price on Request'}
                        </h4>
                      </div>
                    </div>
                    <div className="location-display mt-3">
                      <div className="location-icon">📍</div>
                      <div className="location-content">
                        <p className="property-location">
                          {property.address ? (
                            `${property.address.street ? property.address.street + ', ' : ''}${property.address.city || ''}, ${property.address.state || ''} - ${property.address.pincode || ''}`
                          ) : (
                            'Location details not available'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ✅ PROPERTY DETAILS */}
                  <div className="details-section mb-4">
                    <h5 className="section-title mb-3">
                      <span className="section-icon">📊</span>
                      Property Details
                    </h5>
                    <div className="details-grid">
                      <Row>
                        <Col md={6}>
                          <div className="detail-item">
                            <div className="detail-icon">📐</div>
                            <div className="detail-content">
                              <strong className="detail-label">Size:</strong>
                              <span className="detail-value">{property.size || 'Not specified'}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">🏷️</div>
                            <div className="detail-content">
                              <strong className="detail-label">Category:</strong>
                              <span className="detail-value">{property.category || 'Not specified'}</span>
                            </div>
                          </div>
                          {property.subtype && (
                            <div className="detail-item">
                              <div className="detail-icon">🏢</div>
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
                              <span className="detail-value">{property.contact || 'Contact owner'}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">💰</div>
                            <div className="detail-content">
                              <strong className="detail-label">Rent Types:</strong>
                              <span className="detail-value">
                                {property.rentType && property.rentType.length > 0 ? property.rentType.join(', ') : 'Monthly'}
                              </span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">📅</div>
                            <div className="detail-content">
                              <strong className="detail-label">Added:</strong>
                              <span className="detail-value">
                                {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* ✅ DESCRIPTION */}
                  <div className="description-section">
                    <h5 className="section-title mb-3">
                      <span className="section-icon">📝</span>
                      Description
                    </h5>
                    <div className="description-content">
                      {property.description || 'No description available for this property.'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* ✅ BOOKING CARD - FIXED */}
              <Card className="property-card booking-card">
                <div className="booking-header">
                  <div className="booking-header-icon">📋</div>
                  <h5 className="booking-header-title">Book This Property</h5>
                </div>
                <Card.Body>
                  <div className="booking-price-section mb-4">
                    <h3 className="booking-price">
                      {property.price ? formatPrice(property.price, property.rentType?.[0] || 'monthly') : '₹Price on Request'}
                    </h3>
                    <p className="booking-price-subtitle">
                      Available for {property.rentType && property.rentType.length > 0 ? property.rentType.join(', ') : 'rental'}
                    </p>
                  </div>

                  <div className="booking-actions mb-4">
                    <Button 
                      className="book-button w-100"
                      size="lg"
                      onClick={() => alert('Booking feature coming soon!')}
                    >
                      <span className="button-icon">📅</span>
                      Book Now
                    </Button>
                    
                    <div className="payment-info text-center mt-3">
                      <span className="payment-icon">💳</span>
                      <small className="payment-text ms-2">Payment: On Spot Only</small>
                    </div>
                  </div>

                  <div className="features-section">
                    <h6 className="features-title mb-3">
                      <span className="features-icon">✨</span>
                      Property Features
                    </h6>
                    <div className="features-list">
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.category || 'Commercial'} Space</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.size || 'Spacious'} Area</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">
                          {property.rentType && property.rentType.length > 0 ? property.rentType.join('/') : 'Flexible'} Rental
                        </span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">Direct Owner Contact</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-notice mt-4">
                    <span className="notice-icon">⚠️</span>
                    <small className="notice-text ms-2">Complete your profile before booking</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ COMPLETE STYLES */}
      <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
    </>
  );
};

// ✅ COMPLETE WORKING STYLES
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* ✅ ANIMATED BACKGROUND */
  .animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  
  .main-content {
    position: relative;
    z-index: 10;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(124, 58, 237, 0.06) 0%, 
      transparent 25%, 
      rgba(59, 130, 246, 0.05) 50%, 
      transparent 75%, 
      rgba(16, 185, 129, 0.06) 100%);
    animation: gradientShift 12s ease-in-out infinite;
  }
  
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
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
    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%);
    top: 10%;
    left: 5%;
    animation: float1 15s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
    top: 50%;
    right: 10%;
    animation: float2 18s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
    bottom: 20%;
    left: 20%;
    animation: float3 20s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.03) 40%, transparent 70%);
    top: 30%;
    left: 60%;
    animation: float4 22s ease-in-out infinite;
  }
  
  .mouse-follower {
    position: absolute;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%);
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
    z-index: 1;
  }
  
  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.6);
  }
  
  .particle-1 { width: 4px; height: 4px; animation: particle1 25s linear infinite; }
  .particle-2 { width: 3px; height: 3px; background: rgba(59, 130, 246, 0.6); animation: particle2 30s linear infinite; }
  .particle-3 { width: 5px; height: 5px; background: rgba(16, 185, 129, 0.6); animation: particle3 28s linear infinite; }
  .particle-4 { width: 2px; height: 2px; background: rgba(245, 101, 101, 0.6); animation: particle4 22s linear infinite; }
  
  /* ✅ PROPERTY CARDS */
  .property-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 20px !important;
    box-shadow: 
      0 15px 40px rgba(0, 0, 0, 0.08),
      0 6px 20px rgba(124, 58, 237, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    transition: all 0.3s ease !important;
    animation: cardAppear 0.6s ease-out;
    overflow: hidden;
  }
  
  .property-card:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 60px rgba(0, 0, 0, 0.12),
      0 10px 30px rgba(124, 58, 237, 0.12),
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
  
  /* ✅ BACK BUTTON */
  .back-button {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    border: none !important;
    border-radius: 15px !important;
    padding: 15px 30px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25) !important;
    text-decoration: none !important;
  }
  
  .back-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.35) !important;
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
    color: white !important;
  }
  
  /* ✅ PROPERTY IMAGE */
  .property-image {
    width: 100% !important;
    height: 400px !important;
    object-fit: cover !important;
    border-radius: 16px !important;
    transition: transform 0.4s ease !important;
  }
  
  .property-image:hover { 
    transform: scale(1.02); 
  }
  
  .no-image-state {
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 16px;
    color: #64748b;
  }
  
  .no-image-icon { 
    font-size: 4rem; 
    margin-bottom: 1rem; 
    opacity: 0.7; 
  }
  
  .no-image-text { 
    font-size: 1.1rem; 
    font-weight: 600; 
    margin: 0; 
  }
  
  /* ✅ CAROUSEL */
  .property-carousel .carousel-indicators {
    bottom: 20px !important;
    margin-bottom: 0 !important;
  }
  
  .property-carousel .carousel-indicators button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    margin: 0 6px !important;
    background-color: rgba(255, 255, 255, 0.7) !important;
    border: 2px solid rgba(255, 255, 255, 0.9) !important;
  }
  
  .property-carousel .carousel-indicators button.active {
    background-color: #7c3aed !important;
    border-color: #7c3aed !important;
  }
  
  .property-carousel .carousel-control-prev,
  .property-carousel .carousel-control-next {
    width: 50px !important;
    height: 50px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: rgba(0, 0, 0, 0.6) !important;
    border-radius: 50% !important;
    backdrop-filter: blur(10px) !important;
  }
  
  .property-carousel .carousel-control-prev { left: 20px !important; }
  .property-carousel .carousel-control-next { right: 20px !important; }
  
  /* ✅ BADGES */
  .badges-section {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 1.5rem;
  }
  
  .property-badge {
    border-radius: 15px !important;
    padding: 10px 18px !important;
    font-size: 0.8rem !important;
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
  
  /* ✅ PROPERTY TITLE */
  .property-title {
    font-size: 2.2rem !important;
    font-weight: 800 !important;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
    margin-bottom: 1.5rem !important;
  }
  
  /* ✅ PRICE & LOCATION */
  .price-location-section {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%);
    padding: 2rem;
    border-radius: 16px;
    border: 2px solid rgba(124, 58, 237, 0.1);
    margin-bottom: 2rem;
  }
  
  .price-display {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 1rem;
  }
  
  .price-icon { 
    font-size: 1.8rem; 
  }
  
  .property-price {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 1.8rem !important;
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
    line-height: 1.4 !important;
  }
  
  /* ✅ SECTION TITLES */
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
  
  /* ✅ DETAILS GRID */
  .details-section {
    margin-bottom: 2rem;
  }
  
  .details-grid {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0.02) 100%);
    padding: 2rem;
    border-radius: 16px;
    border: 2px solid rgba(59, 130, 246, 0.1);
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 1.2rem;
    padding: 0.8rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .detail-item:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(5px);
  }
  
  .detail-item:last-child { 
    margin-bottom: 0; 
  }
  
  .detail-icon { 
    font-size: 1.2rem; 
    width: 32px; 
    text-align: center; 
  }
  
  .detail-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-label {
    color: #6b7280;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .detail-value {
    color: #1e293b;
    font-weight: 700;
    font-size: 1rem;
  }
  
  /* ✅ DESCRIPTION */
  .description-content {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.02) 100%);
    padding: 2rem;
    border-radius: 16px;
    border: 2px solid rgba(16, 185, 129, 0.1);
    font-size: 1.1rem;
    line-height: 1.7;
    color: #374151;
    white-space: pre-line;
    font-weight: 500;
  }
  
  /* ✅ BOOKING CARD */
  .booking-card {
    position: sticky;
    top: 30px;
  }
  
  .booking-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    gap: 15px;
    margin: -1px -1px 0 -1px;
  }
  
  .booking-header-icon { 
    font-size: 1.4rem; 
  }
  
  .booking-header-title { 
    font-weight: 700; 
    font-size: 1.2rem; 
    margin: 0; 
  }
  
  .booking-price-section {
    text-align: center;
    padding: 2rem;
    border-bottom: 3px solid rgba(16, 185, 129, 0.1);
  }
  
  .booking-price {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 2rem !important;
    margin-bottom: 10px !important;
  }
  
  .booking-price-subtitle {
    color: #6b7280 !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .booking-actions { 
    padding: 1.5rem; 
    border-bottom: 3px solid rgba(16, 185, 129, 0.1); 
  }
  
  .book-button {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%) !important;
    border: none !important;
    border-radius: 15px !important;
    padding: 18px 25px !important;
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.25) !important;
    text-decoration: none !important;
    color: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 12px !important;
  }
  
  .book-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(245, 87, 108, 0.35) !important;
    background: linear-gradient(135deg, #e11d48 0%, #ec4899 100%) !important;
    color: white !important;
  }
  
  .button-icon { 
    font-size: 1.2rem; 
  }
  
  .payment-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #6b7280;
    font-weight: 600;
    margin-top: 1rem;
  }
  
  .payment-icon { 
    font-size: 1.1rem; 
  }
  
  /* ✅ FEATURES SECTION */
  .features-section { 
    padding: 1.5rem; 
    border-bottom: 3px solid rgba(16, 185, 129, 0.1); 
  }
  
  .features-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #1e293b;
    font-weight: 700;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .features-icon { 
    font-size: 1.3rem; 
  }
  
  .features-list {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%);
    border: 2px solid rgba(16, 185, 129, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: #047857;
    padding: 0.5rem;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background: rgba(16, 185, 129, 0.1);
    transform: translateX(5px);
  }
  
  .feature-item:last-child { 
    margin-bottom: 0; 
  }
  
  .feature-check { 
    font-size: 1.1rem; 
  }
  
  .booking-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%);
    border-radius: 12px;
    border: 2px solid rgba(245, 158, 11, 0.15);
    color: #d97706;
    font-weight: 600;
    text-align: center;
    margin: 1.5rem;
    margin-bottom: 0;
  }
  
  .notice-icon { 
    font-size: 1.2rem; 
  }
  
  /* ✅ LOADING STATE */
  .loading-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    text-align: center;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(124, 58, 237, 0.2);
    border-left: 4px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 2rem;
  }
  
  .loading-state h4 { 
    color: #1e293b; 
    font-weight: 700; 
    font-size: 1.3rem; 
  }
  
  .error-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    border-radius: 15px !important;
    padding: 2rem !important;
    color: #dc2626 !important;
    font-size: 1.1rem !important;
    font-weight: 600 !important;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift { 
    0%, 100% { opacity: 1; } 
    50% { opacity: 0.8; } 
  }
  
  @keyframes float1 { 
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 
    25% { transform: translate(30px, -30px) rotate(90deg) scale(1.1); } 
    50% { transform: translate(-20px, -40px) rotate(180deg) scale(0.9); } 
    75% { transform: translate(-35px, 20px) rotate(270deg) scale(1.05); } 
  }
  
  @keyframes float2 { 
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 
    30% { transform: translate(-40px, -20px) rotate(108deg) scale(1.15); } 
    70% { transform: translate(20px, -35px) rotate(252deg) scale(0.85); } 
  }
  
  @keyframes float3 { 
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); } 
    20% { transform: translate(20px, -15px) scale(1.1) rotate(72deg); } 
    40% { transform: translate(-15px, -25px) scale(0.9) rotate(144deg); } 
    60% { transform: translate(-25px, 10px) scale(1.05) rotate(216deg); } 
    80% { transform: translate(15px, 20px) scale(0.95) rotate(288deg); } 
  }
  
  @keyframes float4 { 
    0%, 100% { transform: translate(0, 0) scale(1); } 
    33% { transform: translate(15px, -20px) scale(1.2); } 
    66% { transform: translate(-20px, 15px) scale(0.8); } 
  }
  
  @keyframes particle1 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 1; } 
    90% { opacity: 1; } 
    100% { transform: translateY(-20vh) translateX(100px) rotate(360deg); opacity: 0; } 
  }
  
  @keyframes particle2 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 0.8; } 
    90% { opacity: 0.8; } 
    100% { transform: translateY(-20vh) translateX(-80px) rotate(-360deg); opacity: 0; } 
  }
  
  @keyframes particle3 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 0.9; } 
    90% { opacity: 0.9; } 
    100% { transform: translateY(-20vh) translateX(60px) rotate(180deg); opacity: 0; } 
  }
  
  @keyframes particle4 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 0.7; } 
    90% { opacity: 0.7; } 
    100% { transform: translateY(-20vh) translateX(-40px) rotate(-180deg); opacity: 0; } 
  }
  
  @keyframes gridMove { 
    0% { transform: translate(0, 0); } 
    100% { transform: translate(50px, 50px); } 
  }
  
  @keyframes spin { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }
  
  @keyframes cardAppear { 
    from { opacity: 0; transform: translateY(30px) scale(0.95); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
  }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .booking-card { 
      position: static; 
      margin-top: 2rem; 
    }
    
    .property-title { 
      font-size: 1.8rem !important; 
    }
    
    .booking-price { 
      font-size: 1.6rem !important; 
    }
    
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
  }
  
  @media (max-width: 767.98px) {
    .property-image { 
      height: 300px !important; 
    }
    
    .property-title { 
      font-size: 1.6rem !important; 
    }
    
    .price-location-section,
    .details-grid,
    .description-content,
    .features-list {
      padding: 1.5rem;
    }
    
    .booking-price-section {
      padding: 1.5rem;
    }
    
    .detail-content {
      flex-direction: row;
      gap: 10px;
    }
  }
`;

export default PropertyDetails;
