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
              {[...Array(12)].map((_, index) => (
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
        <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-details-container">
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
          </div>

          <Container className="py-4">
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

  if (!property) {
    return (
      <>
        <div className="property-details-container">
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
          </div>

          <Container className="py-4">
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
        {/* ✅ FIXED - ANIMATED BACKGROUND WITH PROPER Z-INDEX */}
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
            {[...Array(12)].map((_, index) => (
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

        <Container className="py-4 main-content">
          {/* Back Button */}
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
              {/* ✅ FIXED - Property Images Carousel WITHOUT LABELS */}
              <Card className="property-card image-card mb-4">
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
                          alt={property.title}
                          className="property-image w-100"
                        />
                        {/* ✅ NO CAROUSEL.CAPTION = NO LABELS! */}
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

              {/* ✅ FIXED - Property Details Card - FULLY VISIBLE NOW */}
              <Card className="property-card details-card">
                <Card.Body className="card-body">
                  <div className="badges-section mb-3">
                    <Badge className="property-badge primary">{property.category}</Badge>
                    {property.subtype && (
                      <Badge className="property-badge secondary me-2">{property.subtype}</Badge>
                    )}
                    {property.rentType && property.rentType.map((type, index) => (
                      <Badge key={index} className="property-badge info me-1">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="property-title mb-3">{property.title || 'Property Title'}</h1>

                  <div className="price-location-section mb-4">
                    <div className="price-display mb-3">
                      <div className="price-icon">💰</div>
                      <div className="price-content">
                        <h4 className="property-price">
                          {formatPrice(property.price, property.rentType?.[0] || 'monthly')}
                        </h4>
                      </div>
                    </div>
                    <div className="location-display">
                      <div className="location-icon">📍</div>
                      <div className="location-content">
                        <p className="property-location">
                          {property.address?.street && `${property.address.street}, `}
                          {property.address?.city}, {property.address?.state} - {property.address?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

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
                            <span className="detail-value">{property.size || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">🏷️</div>
                          <div className="detail-content">
                            <strong className="detail-label">Category:</strong>
                            <span className="detail-value">{property.category || 'N/A'}</span>
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
                            <span className="detail-value">{property.contact || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">💰</div>
                          <div className="detail-content">
                            <strong className="detail-label">Rent Types:</strong>
                            <span className="detail-value">{property.rentType?.join(', ') || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">📅</div>
                          <div className="detail-content">
                            <strong className="detail-label">Added:</strong>
                            <span className="detail-value">{property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="description-section">
                    <h5 className="section-title mb-3">
                      <span className="section-icon">📝</span>
                      Description
                    </h5>
                    <div className="description-content">
                      {property.description || 'No description available.'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* ✅ Booking Card - FULLY STYLED */}
              <Card className="property-card booking-card">
                <div className="booking-header">
                  <div className="booking-header-icon">📋</div>
                  <h5 className="booking-header-title">Book This Property</h5>
                </div>
                <Card.Body className="card-body">
                  <div className="booking-price-section mb-4">
                    <h3 className="booking-price">
                      {formatPrice(property.price, property.rentType?.[0] || 'monthly')}
                    </h3>
                    <p className="booking-price-subtitle">
                      Available for {property.rentType?.join(', ') || 'rental'}
                    </p>
                  </div>

                  <div className="booking-actions mb-4">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="book-button w-100"
                      size="lg"
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
                        <span className="feature-text">{property.category || 'Category'} Space</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.size || 'Size'} Area</span>
                      </div>
                      <div className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.rentType?.join('/') || 'Flexible'} Rental</span>
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

      {/* ✅ COMPLETE STYLES INLINE */}
      <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
    </>
  );
};

// ✅ ALL STYLES IN ONE FUNCTION - FIXED Z-INDEX ISSUES
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* ✅ FIXED - ANIMATED BACKGROUND WITH PROPER Z-INDEX */
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
  
  /* ✅ FIXED - PARTICLES WITH PROPER Z-INDEX */
  .particles {
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    z-index: 1;
  }
  
  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.4);
  }
  
  .particle-1 { width: 4px; height: 4px; animation: particle1 20s linear infinite; }
  .particle-2 { width: 3px; height: 3px; background: rgba(59, 130, 246, 0.4); animation: particle2 25s linear infinite; }
  .particle-3 { width: 5px; height: 5px; background: rgba(16, 185, 129, 0.4); animation: particle3 22s linear infinite; }
  .particle-4 { width: 2px; height: 2px; background: rgba(245, 101, 101, 0.4); animation: particle4 18s linear infinite; }
  
  .geometric-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    opacity: 0.1;
  }
  
  .shape-1 { width: 50px; height: 50px; border: 2px solid #7c3aed; top: 20%; right: 20%; animation: rotate 30s linear infinite; }
  .shape-2 { width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-bottom: 30px solid #3b82f6; top: 70%; left: 80%; animation: float1 25s ease-in-out infinite; }
  .shape-3 { width: 30px; height: 30px; background: #10b981; border-radius: 50%; bottom: 30%; right: 30%; animation: pulse 8s ease-in-out infinite; }
  
  /* ✅ PROPERTY CARDS */
  .property-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 16px !important;
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
    transform: translateY(-3px);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.12),
      0 8px 25px rgba(124, 58, 237, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  .property-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #7c3aed 0%, #3b82f6 35%, #10b981 70%, #f59e0b 100%);
    border-radius: 16px 16px 0 0;
  }
  
  .card-body {
    padding: 1.5rem !important;
    color: #1f2937;
  }
  
  /* ✅ BACK BUTTON */
  .back-button {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 24px !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2) !important;
    text-decoration: none !important;
    position: relative;
  }
  
  .back-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3) !important;
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
    color: white !important;
  }
  
  /* ✅ IMAGE CARD */
  .image-card::before { background: linear-gradient(90deg, #f093fb 0%, #f5576c 50%, #4facfe 100%); }
  
  .property-image {
    height: 400px !important;
    object-fit: cover !important;
    border-radius: 12px !important;
    transition: transform 0.4s ease !important;
  }
  
  .property-image:hover { transform: scale(1.02); }
  
  /* ✅ CAROUSEL STYLES - FIXED INDICATORS */
  .property-carousel .carousel-indicators {
    bottom: 15px !important;
    margin-bottom: 0 !important;
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
    width: 45px !important;
    height: 45px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: rgba(0, 0, 0, 0.6) !important;
    border-radius: 50% !important;
    border: none !important;
    backdrop-filter: blur(10px) !important;
  }
  
  .property-carousel .carousel-control-prev { left: 15px !important; }
  .property-carousel .carousel-control-next { right: 15px !important; }
  
  .no-image-state {
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 12px;
  }
  
  .no-image-icon { font-size: 3rem; margin-bottom: 0.5rem; opacity: 0.6; }
  .no-image-text { font-size: 1rem; font-weight: 600; color: #64748b; margin: 0; }
  
  /* ✅ DETAILS CARD */
  .details-card::before { background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%); }
  
  .badges-section {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .property-badge {
    border-radius: 12px !important;
    padding: 8px 16px !important;
    font-size: 0.75rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08) !important;
  }
  
  .property-badge.primary { background: linear-gradient(135deg, #7c3aed, #a855f7) !important; color: white !important; }
  .property-badge.secondary { background: linear-gradient(135deg, #f093fb, #f5576c) !important; color: white !important; }
  .property-badge.info { background: linear-gradient(135deg, #4facfe, #00f2fe) !important; color: white !important; }
  
  .property-title {
    font-size: 2rem !important;
    font-weight: 800 !important;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
  }
  
  .price-location-section {
    background: linear-gradient(135deg, rgba(245, 87, 108, 0.06) 0%, rgba(245, 87, 108, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid #f5576c;
  }
  
  .price-display {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .price-icon { font-size: 1.5rem; }
  
  .property-price {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 1.6rem !important;
    margin: 0 !important;
  }
  
  .location-display {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .location-icon { font-size: 1.3rem; }
  
  .property-location {
    color: #374151 !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #1e293b;
    font-weight: 800;
    font-size: 1.2rem;
  }
  
  .section-icon { font-size: 1.3rem; }
  
  .details-grid {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.06) 0%, rgba(102, 126, 234, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.08);
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
  }
  
  .detail-icon { font-size: 1.1rem; width: 28px; text-align: center; }
  
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
  
  .description-content {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 12px;
    border-left: 4px solid #10b981;
    font-size: 1rem;
    line-height: 1.6;
    color: #374151;
    white-space: pre-line;
  }
  
  /* ✅ BOOKING CARD */
  .booking-card {
    position: sticky;
    top: 20px;
  }
  
  .booking-card::before { background: linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%); }
  
  .booking-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 16px 16px 0 0;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: -1px -1px 0 -1px;
  }
  
  .booking-header-icon { font-size: 1.3rem; }
  .booking-header-title { font-weight: 700; font-size: 1.1rem; margin: 0; }
  
  .booking-price-section {
    text-align: center;
    padding: 1.5rem 0;
    border-bottom: 2px solid rgba(16, 185, 129, 0.08);
  }
  
  .booking-price {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 1.7rem !important;
    margin-bottom: 8px !important;
  }
  
  .booking-price-subtitle {
    color: #6b7280 !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    margin: 0 !important;
  }
  
  .booking-actions { border-bottom: 2px solid rgba(16, 185, 129, 0.08); padding-bottom: 1rem; }
  
  .book-button {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 15px 20px !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.2) !important;
    text-decoration: none !important;
    color: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 10px !important;
  }
  
  .book-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3) !important;
    background: linear-gradient(135deg, #e11d48 0%, #ec4899 100%) !important;
    color: white !important;
  }
  
  .button-icon { font-size: 1.1rem; }
  
  .payment-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #6b7280;
    font-weight: 600;
  }
  
  .payment-icon { font-size: 1rem; }
  
  .features-section { border-bottom: 2px solid rgba(16, 185, 129, 0.08); padding-bottom: 1rem; }
  
  .features-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #1e293b;
    font-weight: 700;
    font-size: 1.1rem;
  }
  
  .features-icon { font-size: 1.2rem; }
  
  .features-list {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%);
    border: 2px solid rgba(16, 185, 129, 0.1);
    border-radius: 12px;
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
  
  .feature-item:last-child { margin-bottom: 0; }
  .feature-check { font-size: 1rem; }
  
  .booking-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%);
    border-radius: 10px;
    border: 1px solid rgba(245, 158, 11, 0.15);
    color: #d97706;
    font-weight: 600;
    text-align: center;
  }
  
  .notice-icon { font-size: 1.1rem; }
  
  /* ✅ LOADING & ERROR STATES */
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
  }
  
  .loading-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    position: relative;
  }
  
  .loading-icon { font-size: 3.5rem; margin-bottom: 1rem; }
  
  .spinner {
    width: 45px;
    height: 45px;
    border: 3px solid rgba(124, 58, 237, 0.2);
    border-left: 3px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1.5rem auto;
  }
  
  .loading-card h4 { color: #1e293b; font-weight: 700; margin: 1rem 0; font-size: 1.2rem; }
  
  .error-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    border-radius: 12px !important;
    padding: 1.5rem !important;
    color: #dc2626 !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    position: relative;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  @keyframes float1 { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(20px, -20px) rotate(90deg) scale(1.05); } 50% { transform: translate(-15px, -30px) rotate(180deg) scale(0.95); } 75% { transform: translate(-25px, 15px) rotate(270deg) scale(1.02); } }
  @keyframes float2 { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 30% { transform: translate(-30px, -15px) rotate(108deg) scale(1.08); } 70% { transform: translate(15px, -25px) rotate(252deg) scale(0.92); } }
  @keyframes float3 { 0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); } 20% { transform: translate(15px, -12px) scale(1.06) rotate(72deg); } 40% { transform: translate(-12px, -20px) scale(0.94) rotate(144deg); } 60% { transform: translate(-20px, 8px) scale(1.03) rotate(216deg); } 80% { transform: translate(12px, 16px) scale(0.97) rotate(288deg); } }
  @keyframes float4 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(12px, -15px) scale(1.1); } 66% { transform: translate(-15px, 12px) scale(0.9); } }
  @keyframes particle1 { 0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-20vh) translateX(80px) rotate(360deg); opacity: 0; } }
  @keyframes particle2 { 0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateY(-20vh) translateX(-60px) rotate(-360deg); opacity: 0; } }
  @keyframes particle3 { 0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.7; } 100% { transform: translateY(-20vh) translateX(50px) rotate(180deg); opacity: 0; } }
  @keyframes particle4 { 0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.5; } 100% { transform: translateY(-20vh) translateX(-30px) rotate(-180deg); opacity: 0; } }
  @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(60px, 60px); } }
  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.2); opacity: 0.2; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes cardAppear { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .booking-card { position: static; }
    .property-title { font-size: 1.7rem !important; }
    .booking-price { font-size: 1.5rem !important; }
  }
  
  @media (max-width: 767.98px) {
    .card-body { padding: 1.25rem !important; }
    .property-image { height: 300px !important; }
    .property-title { font-size: 1.5rem !important; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
    .price-display { flex-direction: column; align-items: flex-start; gap: 8px; }
    .location-display { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`;

export default PropertyDetails;
