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
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
          <Container className="py-4 main-content">
            <div className="text-center loading-state">
              <div className="spinner-border" role="status" style={{ color: '#10b981' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2" style={{ color: '#1e293b', fontWeight: '600' }}>Loading property details...</p>
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
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
          <Container className="py-4 main-content">
            <Alert variant="danger" className="property-alert">{error}</Alert>
            <Button as={Link} to="/find-property" variant="primary" className="property-button">
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
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
          <Container className="py-4 main-content">
            <Alert variant="warning" className="property-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" variant="primary" className="property-button">
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
        {/* ✅ BEAUTIFUL ANIMATED BACKGROUND */}
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
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 3 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        <Container className="py-4 main-content">
          <Row>
            <Col>
              <div className="mb-4">
                <Button as={Link} to="/find-property" variant="outline-secondary" className="mb-3 property-back-button">
                  ← Back to Properties
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              {/* ✅ PROPERTY IMAGES - NO LABELS! */}
              <Card className="mb-4 property-card image-card">
                {property.images && property.images.length > 0 ? (
                  <Carousel 
                    className="property-carousel-clean"
                    indicators={false} 
                    controls={property.images.length > 1}
                    interval={null}
                  >
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt="Property"
                          className="property-details-image w-100"
                          style={{ height: '450px', objectFit: 'cover' }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt="Property"
                    className="property-details-image w-100"
                    style={{ height: '450px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="no-image-placeholder d-flex align-items-center justify-content-center" 
                       style={{ height: '450px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                    <div className="text-center">
                      <div style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }}>🏠</div>
                      <p className="text-muted h5">Property Images Coming Soon</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* ✅ PROPERTY DETAILS CARD */}
              <Card className="property-card">
                <Card.Body className="p-4">
                  {/* ✅ BADGES */}
                  <div className="badges-section mb-4">
                    <Badge className="property-badge primary me-2">{property.category || 'Property'}</Badge>
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
                  <h1 className="property-title mb-4">
                    {property.title || property.category || 'Premium Property'}
                  </h1>

                  {/* ✅ PRICE & LOCATION SECTION */}
                  <div className="price-location-card mb-4">
                    <Row>
                      <Col md={6}>
                        <div className="price-display">
                          <div className="price-icon">💰</div>
                          <div className="price-content">
                            <h3 className="property-price mb-1">
                              {property.price ? formatPrice(property.price, property.rentType?.[0] || 'monthly') : '₹Price on Request'}
                            </h3>
                            <p className="price-subtitle">
                              Available for {property.rentType && property.rentType.length > 0 ? property.rentType.join(', ') : 'monthly'} rental
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="location-display">
                          <div className="location-icon">📍</div>
                          <div className="location-content">
                            <h5 className="location-title mb-1">Location</h5>
                            <p className="property-location">
                              {property.address ? (
                                `${property.address.street ? property.address.street + ', ' : ''}${property.address.city || ''}, ${property.address.state || ''} - ${property.address.pincode || ''}`
                              ) : (
                                'Prime Location - Contact for Details'
                              )}
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* ✅ PROPERTY DETAILS GRID */}
                  <div className="details-section mb-4">
                    <h4 className="section-title mb-3">
                      <span className="section-icon">📊</span>
                      Property Details
                    </h4>
                    <Row className="details-grid">
                      <Col md={6}>
                        <div className="detail-item">
                          <div className="detail-icon">📐</div>
                          <div className="detail-content">
                            <strong className="detail-label">Size:</strong>
                            <span className="detail-value">{property.size || 'Contact for details'}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">🏷️</div>
                          <div className="detail-content">
                            <strong className="detail-label">Category:</strong>
                            <span className="detail-value">{property.category || 'Premium Space'}</span>
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
                            <span className="detail-value">{property.contact || 'Available on Request'}</span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">💰</div>
                          <div className="detail-content">
                            <strong className="detail-label">Rent Types:</strong>
                            <span className="detail-value">
                              {property.rentType && property.rentType.length > 0 ? property.rentType.join(', ') : 'Flexible Terms'}
                            </span>
                          </div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">📅</div>
                          <div className="detail-content">
                            <strong className="detail-label">Listed:</strong>
                            <span className="detail-value">
                              {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently Added'}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* ✅ DESCRIPTION */}
                  <div className="description-section">
                    <h4 className="section-title mb-3">
                      <span className="section-icon">📝</span>
                      Description
                    </h4>
                    <div className="description-content">
                      {property.description || 'A premium property offering excellent facilities and prime location. Contact us for more details about this exceptional space.'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* ✅ BOOKING CARD */}
              <Card className="sticky-top property-card booking-card" style={{ top: '20px' }}>
                <Card.Header className="booking-header text-white">
                  <h5 className="mb-0">
                    <span className="me-2">📋</span>
                    Book This Property
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4 booking-price-section">
                    <h3 className="booking-price mb-2">
                      {property.price ? formatPrice(property.price, property.rentType?.[0] || 'monthly') : '₹Contact for Price'}
                    </h3>
                    <p className="text-muted mb-0 booking-subtitle">
                      Available for {property.rentType && property.rentType.length > 0 ? property.rentType.join(', ') : 'flexible'} terms
                    </p>
                  </div>

                  <div className="d-grid gap-3">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      variant="primary" 
                      size="lg"
                      className="booking-button"
                    >
                      <span className="me-2">📅</span>
                      Book Now
                    </Button>
                    
                    <div className="text-center payment-info">
                      <small className="text-muted">
                        <span className="me-1">💳</span>
                        Payment: On Spot Only
                      </small>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top features-section">
                    <h6 className="mb-3 features-title">
                      <span className="me-2">✨</span>
                      Property Features
                    </h6>
                    <ul className="list-unstyled property-features">
                      <li className="mb-3">
                        <div className="feature-item">
                          <span className="feature-icon">🏠</span>
                          <span className="feature-text">{property.category || 'Premium'} Space</span>
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="feature-item">
                          <span className="feature-icon">📐</span>
                          <span className="feature-text">{property.size || 'Spacious'} Area</span>
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="feature-item">
                          <span className="feature-icon">💰</span>
                          <span className="feature-text">{property.rentType && property.rentType.length > 0 ? property.rentType.join('/') : 'Flexible'} Rental</span>
                        </div>
                      </li>
                      <li className="mb-3">
                        <div className="feature-item">
                          <span className="feature-icon">👤</span>
                          <span className="feature-text">Direct Owner Contact</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-top text-center completion-reminder">
                    <div className="reminder-icon mb-2">⚠️</div>
                    <small className="text-muted">
                      Complete your profile before booking
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ ENHANCED STYLES WITH GREEN THEME */}
      <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
    </>
  );
};

// ✅ PERFECT STYLES WITH GREEN THEME
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #86efac 100%);
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
      rgba(16, 185, 129, 0.08) 0%, 
      transparent 25%, 
      rgba(34, 197, 94, 0.06) 50%, 
      transparent 75%, 
      rgba(5, 150, 105, 0.08) 100%);
    animation: gradientShift 15s ease-in-out infinite;
  }
  
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 25s linear infinite;
  }
  
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
    opacity: 0.6;
  }
  
  .orb-1 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
    top: 15%;
    left: 10%;
    animation: float1 18s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 40%, transparent 70%);
    top: 60%;
    right: 15%;
    animation: float2 22s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.03) 40%, transparent 70%);
    bottom: 25%;
    left: 25%;
    animation: float3 25s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, rgba(52, 211, 153, 0.02) 40%, transparent 70%);
    top: 35%;
    left: 70%;
    animation: float4 20s ease-in-out infinite;
  }
  
  .mouse-follower {
    position: absolute;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(20px);
    transition: transform 0.4s ease-out;
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
  }
  
  .particle-1 { 
    width: 6px; 
    height: 6px; 
    background: rgba(16, 185, 129, 0.7); 
    animation: particle1 30s linear infinite; 
  }
  
  .particle-2 { 
    width: 4px; 
    height: 4px; 
    background: rgba(34, 197, 94, 0.6); 
    animation: particle2 35s linear infinite; 
  }
  
  .particle-3 { 
    width: 5px; 
    height: 5px; 
    background: rgba(5, 150, 105, 0.8); 
    animation: particle3 25s linear infinite; 
  }
  
  /* ✅ ENHANCED CARDS */
  .property-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 24px !important;
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.08),
      0 8px 25px rgba(16, 185, 129, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    transition: all 0.4s ease !important;
    animation: cardAppear 0.8s ease-out;
    overflow: hidden;
  }
  
  .property-card:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 30px 70px rgba(0, 0, 0, 0.12),
      0 12px 35px rgba(16, 185, 129, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  .property-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #10b981 0%, #22c55e 35%, #059669 70%, #34d399 100%);
    border-radius: 24px 24px 0 0;
  }
  
  /* ✅ IMAGE CARD SPECIFIC */
  .image-card {
    overflow: hidden !important;
  }
  
  .property-carousel-clean .carousel-control-prev,
  .property-carousel-clean .carousel-control-next {
    background: rgba(16, 185, 129, 0.8) !important;
    border-radius: 50% !important;
    width: 50px !important;
    height: 50px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    opacity: 0.8 !important;
    transition: all 0.3s ease !important;
  }
  
  .property-carousel-clean .carousel-control-prev:hover,
  .property-carousel-clean .carousel-control-next:hover {
    background: rgba(16, 185, 129, 0.95) !important;
    opacity: 1 !important;
    transform: translateY(-50%) scale(1.1) !important;
  }
  
  .property-carousel-clean .carousel-control-prev {
    left: 20px !important;
  }
  
  .property-carousel-clean .carousel-control-next {
    right: 20px !important;
  }
  
  .property-details-image {
    border-radius: 24px !important;
    transition: transform 0.3s ease !important;
  }
  
  .property-card:hover .property-details-image {
    transform: scale(1.02);
  }
  
  /* ✅ BUTTONS */
  .property-back-button {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 14px 28px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 0.95rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(107, 114, 128, 0.25) !important;
  }
  
  .property-back-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(107, 114, 128, 0.35) !important;
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
    color: white !important;
  }
  
  .property-button {
    background: linear-gradient(135deg, #10b981 0%, #22c55e 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 14px 28px !important;
    color: white !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25) !important;
  }
  
  .property-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.35) !important;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
    color: white !important;
  }
  
  /* ✅ BADGES */
  .property-badge {
    border-radius: 14px !important;
    padding: 10px 18px !important;
    font-size: 0.8rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1) !important;
    border: none !important;
  }
  
  .property-badge.primary {
    background: linear-gradient(135deg, #10b981 0%, #22c55e 100%) !important;
    color: white !important;
  }
  
  .property-badge.secondary {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    color: white !important;
  }
  
  .property-badge.info {
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%) !important;
    color: white !important;
  }
  
  /* ✅ TYPOGRAPHY */
  .property-title {
    font-size: 2.25rem !important;
    font-weight: 900 !important;
    background: linear-gradient(135deg, #10b981 0%, #22c55e 50%, #34d399 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
    margin-bottom: 1.5rem !important;
  }
  
  /* ✅ PRICE & LOCATION CARD */
  .price-location-card {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.02) 100%);
    border: 2px solid rgba(16, 185, 129, 0.15);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .price-display, .location-display {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .price-icon, .location-icon {
    font-size: 2rem;
    margin-top: 0.25rem;
  }
  
  .property-price {
    font-size: 2rem !important;
    font-weight: 800 !important;
    color: #10b981 !important;
    margin-bottom: 0.5rem !important;
  }
  
  .price-subtitle {
    color: #6b7280 !important;
    font-weight: 500 !important;
    margin: 0 !important;
  }
  
  .location-title {
    font-weight: 700 !important;
    color: #374151 !important;
  }
  
  .property-location {
    color: #6b7280 !important;
    font-weight: 500 !important;
    margin: 0 !important;
  }
  
  /* ✅ DETAILS SECTION */
  .section-title {
    font-weight: 700 !important;
    color: #374151 !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
  }
  
  .section-icon {
    font-size: 1.25rem;
  }
  
  .details-grid .detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  .detail-icon {
    font-size: 1.25rem;
    width: 30px;
    text-align: center;
  }
  
  .detail-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .detail-label {
    color: #374151 !important;
    font-weight: 600 !important;
  }
  
  .detail-value {
    color: #10b981 !important;
    font-weight: 600 !important;
  }
  
  /* ✅ DESCRIPTION */
  .description-content {
    font-size: 1.1rem !important;
    line-height: 1.8 !important;
    color: #4b5563 !important;
    padding: 1.5rem;
    background: rgba(16, 185, 129, 0.03);
    border-radius: 16px;
    border-left: 4px solid #10b981;
  }
  
  /* ✅ BOOKING CARD */
  .booking-card {
    box-shadow: 
      0 25px 60px rgba(0, 0, 0, 0.1),
      0 10px 30px rgba(16, 185, 129, 0.15) !important;
    border: 2px solid rgba(16, 185, 129, 0.1) !important;
  }
  
  .booking-header {
    background: linear-gradient(135deg, #10b981 0%, #22c55e 100%) !important;
    border-radius: 24px 24px 0 0 !important;
    padding: 1.5rem !important;
    margin: -1px -1px 0 -1px !important;
    border: none !important;
  }
  
  .booking-price-section {
    padding: 1.5rem 0;
    border-bottom: 2px solid rgba(16, 185, 129, 0.1);
    margin-bottom: 1.5rem;
  }
  
  .booking-price {
    font-size: 2rem !important;
    font-weight: 800 !important;
    color: #10b981 !important;
  }
  
  .booking-subtitle {
    font-weight: 500 !important;
    color: #6b7280 !important;
  }
  
  .booking-button {
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 18px 20px !important;
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.25) !important;
  }
  
  .booking-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 12px 35px rgba(245, 158, 11, 0.35) !important;
    background: linear-gradient(135deg, #d97706 0%, #ea580c 100%) !important;
    color: white !important;
  }
  
  .payment-info {
    background: rgba(16, 185, 129, 0.05);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  /* ✅ FEATURES SECTION */
  .features-section {
    background: rgba(16, 185, 129, 0.02);
    margin: -1rem;
    padding: 1.5rem 1rem 1rem 1rem;
    border-radius: 0 0 24px 24px;
  }
  
  .features-title {
    color: #374151 !important;
    font-weight: 700 !important;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background: rgba(16, 185, 129, 0.1);
    transform: translateX(5px);
  }
  
  .feature-icon {
    font-size: 1.25rem;
    width: 30px;
    text-align: center;
  }
  
  .feature-text {
    color: #10b981 !important;
    font-weight: 600 !important;
  }
  
  /* ✅ COMPLETION REMINDER */
  .completion-reminder {
    background: rgba(245, 158, 11, 0.05);
    margin: -1rem;
    padding: 1.5rem;
    border-radius: 0 0 24px 24px;
    border-top: 1px solid rgba(245, 158, 11, 0.1) !important;
  }
  
  .reminder-icon {
    font-size: 1.5rem;
    color: #f59e0b;
  }
  
  /* ✅ ALERTS */
  .property-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    border-radius: 18px !important;
    padding: 2rem !important;
    color: #dc2626 !important;
    font-weight: 600 !important;
    backdrop-filter: blur(10px);
  }
  
  .loading-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift { 
    0%, 100% { opacity: 1; } 
    50% { opacity: 0.7; } 
  }
  
  @keyframes float1 { 
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 
    25% { transform: translate(40px, -30px) rotate(90deg) scale(1.1); } 
    50% { transform: translate(-30px, -50px) rotate(180deg) scale(0.9); } 
    75% { transform: translate(-45px, 30px) rotate(270deg) scale(1.05); } 
  }
  
  @keyframes float2 { 
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 
    30% { transform: translate(-50px, -25px) rotate(108deg) scale(1.15); } 
    70% { transform: translate(30px, -45px) rotate(252deg) scale(0.85); } 
  }
  
  @keyframes float3 { 
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); } 
    20% { transform: translate(25px, -20px) scale(1.1) rotate(72deg); } 
    40% { transform: translate(-20px, -30px) scale(0.9) rotate(144deg); } 
    60% { transform: translate(-30px, 15px) scale(1.05) rotate(216deg); } 
    80% { transform: translate(20px, 25px) scale(0.95) rotate(288deg); } 
  }
  
  @keyframes float4 { 
    0%, 100% { transform: translate(0, 0) scale(1); } 
    33% { transform: translate(20px, -25px) scale(1.2); } 
    66% { transform: translate(-25px, 20px) scale(0.8); } 
  }
  
  @keyframes particle1 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 1; } 
    90% { opacity: 1; } 
    100% { transform: translateY(-20vh) translateX(120px) rotate(360deg); opacity: 0; } 
  }
  
  @keyframes particle2 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 0.8; } 
    90% { opacity: 0.8; } 
    100% { transform: translateY(-20vh) translateX(-100px) rotate(-360deg); opacity: 0; } 
  }
  
  @keyframes particle3 { 
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; } 
    10% { opacity: 0.9; } 
    90% { opacity: 0.9; } 
    100% { transform: translateY(-20vh) translateX(80px) rotate(180deg); opacity: 0; } 
  }
  
  @keyframes gridMove { 
    0% { transform: translate(0, 0); } 
    100% { transform: translate(60px, 60px); } 
  }
  
  @keyframes cardAppear { 
    from { opacity: 0; transform: translateY(40px) scale(0.95); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
  }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .booking-card { 
      position: static !important; 
      margin-top: 2rem; 
    }
    
    .property-title { 
      font-size: 1.75rem !important; 
    }
    
    .property-price { 
      font-size: 1.5rem !important; 
    }
    
    .booking-price { 
      font-size: 1.6rem !important; 
    }
    
    .orb-1 { width: 250px; height: 250px; }
    .orb-2 { width: 180px; height: 180px; }
    .orb-3 { width: 140px; height: 140px; }
    .orb-4 { width: 120px; height: 120px; }
    
    .price-location-card {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 767.98px) {
    .property-title { 
      font-size: 1.5rem !important; 
    }
    
    .property-price { 
      font-size: 1.3rem !important; 
    }
    
    .booking-price { 
      font-size: 1.4rem !important; 
    }
    
    .price-location-card {
      padding: 1rem;
    }
    
    .price-display, .location-display {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
    
    .details-grid .detail-item {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
`;

export default PropertyDetails;
