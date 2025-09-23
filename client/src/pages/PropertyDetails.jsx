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
              <div className="spinner-border" role="status" style={{ color: '#7c3aed' }}>
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
        {/* ✅ ANIMATED BACKGROUND */}
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
              {/* Property Images Carousel */}
              <Card className="mb-4 property-card">
                {property.images && property.images.length > 0 ? (
                  <Carousel>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="property-details-image w-100"
                          style={{ height: '400px', objectFit: 'cover' }}
                        />
                        <Carousel.Caption style={{ 
                          background: 'rgba(0,0,0,0.7)', 
                          borderRadius: '8px',
                          bottom: '10px',
                          left: '10px',
                          right: '10px'
                        }}>
                          <p className="mb-0">Image {index + 1} of {property.images.length}</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="property-details-image w-100"
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" 
                       style={{ height: '400px' }}>
                    <p className="text-muted">No images available</p>
                  </div>
                )}
              </Card>

              {/* Property Details */}
              <Card className="property-card">
                <Card.Body>
                  <div className="mb-3">
                    <Badge bg="primary" className="me-2 property-badge">{property.category}</Badge>
                    {property.subtype && (
                      <Badge bg="secondary" className="me-2 property-badge">{property.subtype}</Badge>
                    )}
                    {property.rentType.map(type => (
                      <Badge key={type} bg="info" className="me-1 property-badge">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  <h1 className="mb-3 property-title">{property.title}</h1>

                  <div className="mb-4 price-location-section">
                    <h4 className="text-primary mb-2 property-price">
                      {formatPrice(property.price, property.rentType[0])}
                    </h4>
                    <p className="text-muted mb-0 property-location">
                      📍 {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state} - {property.address.pincode}
                    </p>
                  </div>

                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">📐 Size:</strong>
                        <span>{property.size}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">🏷️ Category:</strong>
                        <span>{property.category}</span>
                      </div>
                      {property.subtype && (
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-2">🏷️ Type:</strong>
                          <span>{property.subtype}</span>
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">📞 Contact:</strong>
                        <span>{property.contact}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">💰 Rent Types:</strong>
                        <span>{property.rentType.join(', ')}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2">📅 Added:</strong>
                        <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <h5 className="mb-3">📝 Description</h5>
                    <p className="text-muted property-description" style={{ whiteSpace: 'pre-line' }}>
                      {property.description}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Booking Card */}
              <Card className="sticky-top property-card booking-card" style={{ top: '20px' }}>
                <Card.Header className="booking-header text-white">
                  <h5 className="mb-0">📋 Book This Property</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4 booking-price-section">
                    <h3 className="text-primary mb-2 booking-price">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="text-muted mb-0">
                      Available for {property.rentType.join(', ')} rental
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
                      📅 Book Now
                    </Button>
                    
                    <div className="text-center">
                      <small className="text-muted">
                        💳 Payment: On Spot Only
                      </small>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top">
                    <h6 className="mb-3">✨ Property Features</h6>
                    <ul className="list-unstyled property-features">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {property.category} Space
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {property.size} Area
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {property.rentType.join('/')} Rental
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Direct Owner Contact
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-top text-center">
                    <small className="text-muted">
                      ⚠️ Complete your profile before booking
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ ANIMATED BACKGROUND STYLES */}
      <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
    </>
  );
};

// ✅ COMPLETE ANIMATED STYLES
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
  
  /* ✅ ENHANCED CARDS */
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
  
  /* ✅ ENHANCED BUTTONS */
  .property-back-button {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    border: none !important;
    border-radius: 15px !important;
    padding: 12px 24px !important;
    color: white !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(107, 114, 128, 0.25) !important;
  }
  
  .property-back-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.35) !important;
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
    color: white !important;
  }
  
  .property-button {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    border: none !important;
    border-radius: 15px !important;
    padding: 12px 24px !important;
    color: white !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.25) !important;
  }
  
  .property-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.35) !important;
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
    color: white !important;
  }
  
  /* ✅ ENHANCED BADGES */
  .property-badge {
    border-radius: 12px !important;
    padding: 8px 16px !important;
    font-size: 0.75rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  }
  
  /* ✅ ENHANCED TYPOGRAPHY */
  .property-title {
    font-size: 2rem !important;
    font-weight: 800 !important;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #f093fb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
  }
  
  .property-price {
    font-size: 1.8rem !important;
    font-weight: 800 !important;
    color: #10b981 !important;
  }
  
  .property-location {
    font-size: 1.1rem !important;
    font-weight: 600 !important;
    color: #374151 !important;
  }
  
  .property-description {
    font-size: 1rem !important;
    line-height: 1.7 !important;
    color: #4b5563 !important;
  }
  
  /* ✅ ENHANCED BOOKING CARD */
  .booking-card {
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.1),
      0 8px 25px rgba(124, 58, 237, 0.1) !important;
  }
  
  .booking-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    border-radius: 20px 20px 0 0 !important;
    padding: 1.5rem !important;
    margin: -1px -1px 0 -1px !important;
  }
  
  .booking-price-section {
    padding: 1.5rem 0;
    border-bottom: 2px solid rgba(16, 185, 129, 0.1);
  }
  
  .booking-price {
    font-size: 1.8rem !important;
    font-weight: 800 !important;
    color: #10b981 !important;
  }
  
  .booking-button {
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%) !important;
    border: none !important;
    border-radius: 15px !important;
    padding: 16px 20px !important;
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.25) !important;
  }
  
  .booking-button:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(245, 87, 108, 0.35) !important;
    background: linear-gradient(135deg, #e11d48 0%, #ec4899 100%) !important;
    color: white !important;
  }
  
  .property-features li {
    padding: 0.5rem 0;
    font-weight: 600;
    color: #047857;
    transition: all 0.3s ease;
  }
  
  .property-features li:hover {
    transform: translateX(5px);
  }
  
  /* ✅ PRICE & LOCATION SECTION */
  .price-location-section {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%);
    padding: 1.5rem;
    border-radius: 16px;
    border: 2px solid rgba(124, 58, 237, 0.1);
  }
  
  /* ✅ ALERTS */
  .property-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    border-radius: 15px !important;
    padding: 1.5rem !important;
    color: #dc2626 !important;
    font-weight: 600 !important;
    backdrop-filter: blur(10px);
  }
  
  .loading-state {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
  
  @keyframes cardAppear { 
    from { opacity: 0; transform: translateY(30px) scale(0.95); } 
    to { opacity: 1; transform: translateY(0) scale(1); } 
  }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .booking-card { 
      position: static !important; 
      margin-top: 2rem; 
    }
    
    .property-title { 
      font-size: 1.6rem !important; 
    }
    
    .property-price { 
      font-size: 1.4rem !important; 
    }
    
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
  }
  
  @media (max-width: 767.98px) {
    .property-title { 
      font-size: 1.4rem !important; 
    }
    
    .property-price { 
      font-size: 1.3rem !important; 
    }
    
    .booking-price { 
      font-size: 1.5rem !important; 
    }
    
    .price-location-section {
      padding: 1rem;
    }
  }
`;

export default PropertyDetails;
