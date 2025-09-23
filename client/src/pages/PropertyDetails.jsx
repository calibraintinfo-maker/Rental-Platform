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

  // ✅ SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  // Mouse tracking for interactive effects
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

  // Rest of your component code remains exactly the same...
  if (loading) {
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
                    animationDelay: `${index * 1.2}s`
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
            <div className="text-center loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 loading-text">Loading property details...</p>
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
          <div className="background-animation">
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
                    animationDelay: `${index * 1.2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <Container className="py-4">
            <Alert variant="danger" className="modern-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
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
          <div className="background-animation">
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
                    animationDelay: `${index * 1.2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <Container className="py-4">
            <Alert variant="warning" className="modern-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
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
        {/* ✅ BEAUTIFUL LOGIN-STYLE BACKGROUND */}
        <div className="background-animation">
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
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1.1}s`
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
          <Row>
            <Col>
              <div className="mb-3">
                <Button as={Link} to="/find-property" className="back-btn mb-3">
                  ← Back to Properties
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              {/* Property Images Carousel */}
              <Card className="mb-4 property-image-card">
                {property.images && property.images.length > 0 ? (
                  <Carousel className="property-carousel" indicators={true} controls={true}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="property-details-image w-100"
                          style={{ height: '400px', objectFit: 'cover', borderRadius: '16px' }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="property-details-image w-100"
                    style={{ height: '400px', objectFit: 'cover', borderRadius: '16px' }}
                  />
                ) : (
                  <div className="no-image-placeholder d-flex align-items-center justify-content-center" 
                       style={{ height: '400px', borderRadius: '16px' }}>
                    <div className="text-center">
                      <div className="placeholder-icon">🏠</div>
                      <p className="text-muted h5">No images available</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Property Details */}
              <Card className="property-details-card">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <Badge className="custom-badge primary me-2">{property.category}</Badge>
                    {property.subtype && (
                      <Badge className="custom-badge secondary me-2">{property.subtype}</Badge>
                    )}
                    {property.rentType.map(type => (
                      <Badge key={type} className="custom-badge info me-1">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="property-title mb-3">{property.title}</h1>

                  {/* ✅ FIXED PRICE & LOCATION ALIGNMENT */}
                  <div className="price-location-section mb-3">
                    <Row className="align-items-center">
                      <Col md={6}>
                        <div className="price-block text-start">
                          <h3 className="property-price mb-1">
                            {formatPrice(property.price, property.rentType[0])}
                          </h3>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="location-block text-end">
                          <p className="property-location mb-0">
                            📍 {property.address.street && `${property.address.street}, `}
                            {property.address.city}, {property.address.state} - {property.address.pincode}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* ✅ ENHANCED PROPERTY DETAILS GRID */}
                  <div className="enhanced-details-grid mb-3">
                    <div className="details-grid-header">
                      <h5 className="grid-title mb-0">📋 Property Information</h5>
                    </div>
                    <div className="details-grid-body">
                      <Row>
                        <Col md={6}>
                          <div className="detail-card">
                            <div className="detail-icon">📐</div>
                            <div className="detail-content">
                              <span className="detail-label">Size</span>
                              <span className="detail-value">{property.size}</span>
                            </div>
                          </div>
                          <div className="detail-card">
                            <div className="detail-icon">🏷️</div>
                            <div className="detail-content">
                              <span className="detail-label">Category</span>
                              <span className="detail-value">{property.category}</span>
                            </div>
                          </div>
                          {property.subtype && (
                            <div className="detail-card">
                              <div className="detail-icon">🏠</div>
                              <div className="detail-content">
                                <span className="detail-label">Type</span>
                                <span className="detail-value">{property.subtype}</span>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col md={6}>
                          <div className="detail-card">
                            <div className="detail-icon">📞</div>
                            <div className="detail-content">
                              <span className="detail-label">Contact</span>
                              <span className="detail-value">{property.contact}</span>
                            </div>
                          </div>
                          <div className="detail-card">
                            <div className="detail-icon">💰</div>
                            <div className="detail-content">
                              <span className="detail-label">Rent Types</span>
                              <span className="detail-value">{property.rentType.join(', ')}</span>
                            </div>
                          </div>
                          <div className="detail-card">
                            <div className="detail-icon">📅</div>
                            <div className="detail-content">
                              <span className="detail-label">Added</span>
                              <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div className="description-section">
                    <h4 className="section-title mb-3">📝 Description</h4>
                    <div className="description-content">
                      {property.description}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* ✅ COMPACT BOOKING CARD */}
              <Card className="booking-card sticky-top" style={{ top: '20px' }}>
                <Card.Header className="booking-header text-white">
                  <h6 className="mb-0">📋 Book This Property</h6>
                </Card.Header>
                <Card.Body className="p-3">
                  <div className="text-center mb-3 booking-price-section">
                    <h4 className="booking-price mb-1">
                      {formatPrice(property.price, property.rentType[0])}
                    </h4>
                    <p className="booking-subtitle mb-0">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  <div className="d-grid gap-2">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="book-now-btn"
                    >
                      📅 Book Now
                    </Button>
                    
                    <div className="text-center payment-notice">
                      <small className="text-muted">
                        💳 Payment: On Spot Only
                      </small>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top features-section">
                    <h6 className="features-title mb-2">✨ Property Features</h6>
                    <ul className="list-unstyled property-features-list">
                      <li className="feature-item">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {property.category} Space
                      </li>
                      <li className="feature-item">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {property.size} Area
                      </li>
                      <li className="feature-item">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {property.rentType.join('/')} Rental
                      </li>
                      <li className="feature-item">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Direct Owner Contact
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3 pt-2 border-top text-center profile-reminder">
                    <small className="text-muted">
                      ⚠️ Complete profile before booking
                    </small>
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

// Keep all your existing styles exactly the same...
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow-x: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  /* ✅ BEAUTIFUL LOGIN-STYLE BACKGROUND ANIMATIONS */
  .background-animation {
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
      linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.06) 1px, transparent 1px);
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
    background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%);
    top: 10%;
    left: 8%;
    animation: float1 14s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%);
    top: 55%;
    right: 10%;
    animation: float2 16s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 40%, transparent 70%);
    bottom: 20%;
    left: 12%;
    animation: float3 18s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.08) 0%, rgba(245, 101, 101, 0.02) 40%, transparent 70%);
    top: 35%;
    left: 75%;
    animation: float4 22s ease-in-out infinite;
  }
  
  .mouse-follower {
    position: absolute;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(20px);
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
    background: rgba(124, 58, 237, 0.3);
  }
  
  .particle-1 { 
    width: 4px; 
    height: 4px; 
    animation: particle1 22s linear infinite; 
  }
  .particle-2 { 
    width: 3px; 
    height: 3px; 
    background: rgba(59, 130, 246, 0.3);
    animation: particle2 26s linear infinite; 
  }
  .particle-3 { 
    width: 5px; 
    height: 5px; 
    background: rgba(16, 185, 129, 0.3);
    animation: particle3 24s linear infinite; 
  }
  .particle-4 { 
    width: 2px; 
    height: 2px; 
    background: rgba(245, 101, 101, 0.3);
    animation: particle4 20s linear infinite; 
  }
  
  .geometric-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    opacity: 0.08;
  }
  
  .shape-1 {
    width: 60px;
    height: 60px;
    border: 2px solid #7c3aed;
    top: 25%;
    right: 25%;
    animation: rotate 35s linear infinite;
  }
  
  .shape-2 {
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 35px solid #3b82f6;
    top: 65%;
    left: 85%;
    animation: float1 28s ease-in-out infinite;
  }
  
  .shape-3 {
    width: 35px;
    height: 35px;
    background: #10b981;
    border-radius: 50%;
    bottom: 35%;
    right: 35%;
    animation: pulse 10s ease-in-out infinite;
  }
  
  /* ✅ BEAUTIFUL CARDS WITH GLASSMORPHISM */
  .property-image-card, .property-details-card, .booking-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 20px !important;
    box-shadow: 
      0 15px 45px rgba(0, 0, 0, 0.08),
      0 5px 20px rgba(124, 58, 237, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    z-index: 10;
    animation: cardAppear 0.8s ease-out;
    transition: all 0.3s ease;
  }
  
  .property-image-card:hover,
  .property-details-card:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 55px rgba(0, 0, 0, 0.12),
      0 8px 25px rgba(124, 58, 237, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  /* ✅ LOADING STATE */
  .loading-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
  }
  
  .text-primary, .spinner-border {
    color: #7c3aed !important;
    border-color: #7c3aed !important;
    border-right-color: transparent !important;
  }
  
  .loading-text {
    color: #4b5563;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  /* ✅ CAROUSEL STYLING */
  .property-carousel {
    border-radius: 16px !important;
    overflow: hidden;
  }
  
  .property-carousel .carousel-control-prev,
  .property-carousel .carousel-control-next {
    background: rgba(124, 58, 237, 0.9) !important;
    border-radius: 50% !important;
    width: 45px !important;
    height: 45px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    opacity: 0.8 !important;
    transition: all 0.3s ease !important;
  }
  
  .property-carousel .carousel-control-prev:hover,
  .property-carousel .carousel-control-next:hover {
    background: rgba(124, 58, 237, 1) !important;
    opacity: 1 !important;
    transform: translateY(-50%) scale(1.1) !important;
  }
  
  .property-carousel .carousel-control-prev {
    left: 15px !important;
  }
  
  .property-carousel .carousel-control-next {
    right: 15px !important;
  }
  
  .property-carousel .carousel-indicators [data-bs-target] {
    background-color: #7c3aed !important;
    border-radius: 50% !important;
    width: 10px !important;
    height: 10px !important;
    margin: 0 3px !important;
  }
  
  .no-image-placeholder {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    border: 2px dashed rgba(124, 58, 237, 0.3) !important;
  }
  
  .placeholder-icon {
    font-size: 3rem;
    color: #7c3aed;
    margin-bottom: 1rem;
  }
  
  /* ✅ BETTER COLOR BADGES */
  .custom-badge {
    border-radius: 12px !important;
    padding: 6px 12px !important;
    font-size: 0.75rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08) !important;
  }
  
  .custom-badge.primary {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    color: white !important;
  }
  
  .custom-badge.secondary {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    color: white !important;
  }
  
  .custom-badge.info {
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%) !important;
    color: white !important;
  }
  
  /* ✅ BETTER TYPOGRAPHY WITH PROPER COLORS */
  .property-title {
    font-size: 2.2rem !important;
    font-weight: 900 !important;
    color: #1f2937 !important;
    line-height: 1.2 !important;
    margin-bottom: 1.5rem !important;
  }
  
  /* ✅ PERFECT ALIGNED PRICE & LOCATION */
  .price-location-section {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%);
    border: 2px solid rgba(59, 130, 246, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
  }
  
  .price-block {
    display: flex;
    align-items: center;
    height: 100%;
  }
  
  .location-block {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
  
  .property-price {
    font-size: 1.8rem !important;
    font-weight: 800 !important;
    color: #2563eb !important;
    margin: 0 !important;
  }
  
  .property-location {
    font-size: 1rem !important;
    color: #6b7280 !important;
    font-weight: 500 !important;
    margin: 0 !important;
    text-align: right !important;
  }
  
  /* ✅ ENHANCED PROPERTY DETAILS GRID */
  .enhanced-details-grid {
    background: rgba(248, 250, 252, 0.9);
    border-radius: 18px;
    border: 2px solid rgba(59, 130, 246, 0.1);
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.05);
  }
  
  .details-grid-header {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  }
  
  .grid-title {
    font-weight: 700 !important;
    color: #1e293b !important;
    font-size: 1.1rem !important;
  }
  
  .details-grid-body {
    padding: 1.5rem;
  }
  
  .detail-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-bottom: 0.75rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.08);
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.04);
  }
  
  .detail-card:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(59, 130, 246, 0.15);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.08);
  }
  
  .detail-card:last-child {
    margin-bottom: 0;
  }
  
  .detail-icon {
    font-size: 1.3rem;
    margin-right: 1rem;
    width: 35px;
    text-align: center;
  }
  
  .detail-content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .detail-label {
    font-size: 0.8rem !important;
    color: #6b7280 !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    margin-bottom: 0.2rem !important;
  }
  
  .detail-value {
    font-size: 0.95rem !important;
    color: #2563eb !important;
    font-weight: 700 !important;
  }
  
  /* ✅ DESCRIPTION */
  .section-title {
    font-weight: 700 !important;
    color: #374151 !important;
    font-size: 1.3rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  .description-content {
    font-size: 1rem !important;
    line-height: 1.7 !important;
    color: #4b5563 !important;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(59, 130, 246, 0.01) 100%);
    border-radius: 14px;
    border-left: 3px solid #2563eb;
    white-space: pre-line;
  }
  
  /* ✅ COMPACT BOOKING CARD */
  .booking-card {
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.08),
      0 8px 25px rgba(59, 130, 246, 0.12) !important;
    border: 2px solid rgba(59, 130, 246, 0.1) !important;
  }
  
  .booking-header {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%) !important;
    border-radius: 20px 20px 0 0 !important;
    padding: 1rem !important;
    margin: -2px -2px 0 -2px !important;
    border: none !important;
  }
  
  .booking-price-section {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    margin-bottom: 1rem;
  }
  
  .booking-price {
    font-size: 1.6rem !important;
    font-weight: 800 !important;
    color: #2563eb !important;
    margin: 0 !important;
  }
  
  .booking-subtitle {
    font-weight: 500 !important;
    color: #6b7280 !important;
    margin: 0 !important;
    font-size: 0.85rem !important;
  }
  
  /* ✅ BETTER BUTTONS */
  .back-btn {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 10px 20px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    box-shadow: 0 4px 15px rgba(107, 114, 128, 0.2) !important;
    position: relative;
    z-index: 10;
  }
  
  .back-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3) !important;
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
    color: white !important;
  }
  
  .book-now-btn {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 16px !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    box-shadow: 0 6px 20px rgba(22, 163, 74, 0.25) !important;
    color: white !important;
  }
  
  .book-now-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(22, 163, 74, 0.35) !important;
    background: linear-gradient(135deg, #15803d 0%, #16a34a 100%) !important;
    color: white !important;
  }
  
  /* ✅ PAYMENT NOTICE */
  .payment-notice {
    background: rgba(59, 130, 246, 0.05);
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid rgba(59, 130, 246, 0.1);
  }
  
  /* ✅ COMPACT FEATURES SECTION */
  .features-section {
    background: rgba(59, 130, 246, 0.02);
    margin: -0.75rem -0.75rem 0 -0.75rem;
    padding: 1rem;
    border-radius: 0 0 18px 18px;
  }
  
  .features-title {
    color: #374151 !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
  }
  
  .property-features-list {
    margin: 0 !important;
  }
  
  .feature-item {
    padding: 0.5rem 0 !important;
    font-weight: 500 !important;
    color: #2563eb !important;
    border-bottom: 1px solid rgba(59, 130, 246, 0.08);
    transition: all 0.2s ease !important;
    margin-bottom: 0 !important;
    font-size: 0.85rem !important;
  }
  
  .feature-item:last-child {
    border-bottom: none !important;
  }
  
  .feature-item:hover {
    color: #1d4ed8 !important;
    padding-left: 0.5rem !important;
  }
  
  /* ✅ PROFILE REMINDER */
  .profile-reminder {
    background: rgba(34, 197, 94, 0.05);
    margin: -0.75rem -0.75rem -0.75rem -0.75rem;
    padding: 1rem;
    border-radius: 0 0 18px 18px;
    border-top: 1px solid rgba(34, 197, 94, 0.1) !important;
  }
  
  /* ✅ ALERTS */
  .modern-alert {
    border: none !important;
    border-radius: 16px !important;
    padding: 1.5rem !important;
    font-weight: 600 !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08) !important;
    position: relative;
    z-index: 10;
  }
  
  .alert-danger.modern-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    color: #dc2626 !important;
  }
  
  .alert-warning.modern-alert {
    background: rgba(255, 251, 235, 0.95) !important;
    border: 2px solid rgba(251, 191, 36, 0.3) !important;
    color: #d97706 !important;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(25px, -25px) rotate(90deg) scale(1.05); }
    50% { transform: translate(-20px, -35px) rotate(180deg) scale(0.95); }
    75% { transform: translate(-30px, 20px) rotate(270deg) scale(1.02); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    30% { transform: translate(-35px, -20px) rotate(108deg) scale(1.08); }
    70% { transform: translate(20px, -30px) rotate(252deg) scale(0.92); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    20% { transform: translate(20px, -15px) scale(1.06) rotate(72deg); }
    40% { transform: translate(-15px, -25px) scale(0.94) rotate(144deg); }
    60% { transform: translate(-25px, 10px) scale(1.03) rotate(216deg); }
    80% { transform: translate(15px, 20px) scale(0.97) rotate(288deg); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(15px, -18px) scale(1.1); }
    66% { transform: translate(-18px, 15px) scale(0.9); }
  }
  
  @keyframes particle1 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-10vh) translateX(100px) rotate(360deg); opacity: 0; }
  }
  
  @keyframes particle2 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.4; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-10vh) translateX(-80px) rotate(-360deg); opacity: 0; }
  }
  
  @keyframes particle3 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-10vh) translateX(60px) rotate(180deg); opacity: 0; }
  }
  
  @keyframes particle4 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-10vh) translateX(-40px) rotate(-180deg); opacity: 0; }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.08; }
    50% { transform: scale(1.3); opacity: 0.15; }
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
  
  /* ✅ PERFECT RESPONSIVE DESIGN */
  @media (max-width: 991.98px) {
    .booking-card { 
      position: static !important; 
      margin-top: 1.5rem; 
    }
    
    .property-title { 
      font-size: 1.8rem !important; 
    }
    
    .property-price, .booking-price { 
      font-size: 1.4rem !important; 
    }
    
    .location-block {
      justify-content: flex-start !important;
      margin-top: 0.75rem !important;
    }
    
    .property-location {
      text-align: left !important;
    }
    
    .orb-1 { width: 220px; height: 220px; }
    .orb-2 { width: 160px; height: 160px; }
    .orb-3 { width: 130px; height: 130px; }
    .orb-4 { width: 110px; height: 110px; }
  }
  
  @media (max-width: 767.98px) {
    .property-title { 
      font-size: 1.5rem !important; 
    }
    
    .property-price, .booking-price { 
      font-size: 1.2rem !important; 
    }
    
    .price-location-section {
      padding: 1.25rem;
    }
    
    .details-grid-body {
      padding: 1rem;
    }
    
    .detail-card {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .detail-icon {
      font-size: 1.1rem;
      width: 28px;
      margin-right: 0.75rem;
    }
    
    .orb-1 { width: 180px; height: 180px; }
    .orb-2 { width: 130px; height: 130px; }
    .orb-3 { width: 100px; height: 100px; }
    .orb-4 { width: 80px; height: 80px; }
  }
`;

export default PropertyDetails;
