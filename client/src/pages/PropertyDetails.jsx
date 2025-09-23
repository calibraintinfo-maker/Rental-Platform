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
          <div className="animated-bg">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
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
          <div className="animated-bg">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
          <Container className="py-4">
            <Alert variant="danger" className="compact-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="compact-back-btn">
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
          <div className="animated-bg">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
          </div>
          <Container className="py-4">
            <Alert variant="warning" className="compact-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="compact-back-btn">
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
        
        {/* ✅ BEAUTIFUL ANIMATED BACKGROUND */}
        <div className="animated-bg">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
        </div>

        <Container className="py-4">
          <Row>
            <Col>
              <div className="mb-4">
                <Button as={Link} to="/find-property" className="compact-back-btn mb-3">
                  ← Back to Properties
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              
              {/* ✅ COMPACT IMAGE CAROUSEL */}
              <Card className="compact-card mb-4">
                {property.images && property.images.length > 0 ? (
                  <Carousel className="compact-carousel">
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="compact-property-image w-100"
                        />
                        <Carousel.Caption className="compact-caption">
                          <p className="mb-0">Image {index + 1} of {property.images.length}</p>
                        </Carousel.Caption>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="compact-property-image w-100"
                  />
                ) : (
                  <div className="compact-no-image">
                    <p className="text-muted">No images available</p>
                  </div>
                )}
              </Card>

              {/* ✅ COMPACT PROPERTY DETAILS */}
              <Card className="compact-card">
                <Card.Body className="compact-card-body">
                  
                  {/* Badges */}
                  <div className="compact-badges mb-3">
                    <Badge className="compact-badge primary">{property.category}</Badge>
                    {property.subtype && (
                      <Badge className="compact-badge secondary">{property.subtype}</Badge>
                    )}
                    {property.rentType.map(type => (
                      <Badge key={type} className="compact-badge info">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="compact-title mb-3">{property.title}</h1>

                  {/* Price & Location */}
                  <div className="compact-price-location mb-4">
                    <h4 className="compact-price mb-2">
                      {formatPrice(property.price, property.rentType[0])}
                    </h4>
                    <p className="compact-location mb-0">
                      📍 {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state} - {property.address.pincode}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <Row className="compact-details-grid mb-4">
                    <Col md={6}>
                      <div className="compact-detail-item">
                        <strong>📐 Size:</strong>
                        <span>{property.size}</span>
                      </div>
                      <div className="compact-detail-item">
                        <strong>🏷️ Category:</strong>
                        <span>{property.category}</span>
                      </div>
                      {property.subtype && (
                        <div className="compact-detail-item">
                          <strong>🏷️ Type:</strong>
                          <span>{property.subtype}</span>
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="compact-detail-item">
                        <strong>📞 Contact:</strong>
                        <span>{property.contact}</span>
                      </div>
                      <div className="compact-detail-item">
                        <strong>💰 Rent Types:</strong>
                        <span>{property.rentType.join(', ')}</span>
                      </div>
                      <div className="compact-detail-item">
                        <strong>📅 Added:</strong>
                        <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Col>
                  </Row>

                  {/* Description */}
                  <div className="compact-description">
                    <h5 className="compact-section-title mb-3">📝 Description</h5>
                    <p className="compact-description-text">
                      {property.description}
                    </p>
                  </div>

                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              
              {/* ✅ COMPACT BOOKING CARD */}
              <Card className="compact-card compact-booking-card">
                <Card.Header className="compact-booking-header">
                  <h5 className="mb-0">📋 Book This Property</h5>
                </Card.Header>
                <Card.Body className="compact-card-body">
                  
                  {/* Price Display */}
                  <div className="compact-booking-price mb-4">
                    <h3 className="compact-booking-amount mb-2">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="compact-booking-subtitle mb-0">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  {/* Book Button */}
                  <div className="compact-booking-actions">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="compact-book-btn"
                      size="lg"
                    >
                      📅 Book Now
                    </Button>
                    
                    <div className="compact-payment-info">
                      <small>💳 Payment: On Spot Only</small>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="compact-features">
                    <h6 className="compact-features-title mb-3">✨ Property Features</h6>
                    <ul className="compact-features-list">
                      <li>
                        <span className="compact-check">✅</span>
                        {property.category} Space
                      </li>
                      <li>
                        <span className="compact-check">✅</span>
                        {property.size} Area
                      </li>
                      <li>
                        <span className="compact-check">✅</span>
                        {property.rentType.join('/')} Rental
                      </li>
                      <li>
                        <span className="compact-check">✅</span>
                        Direct Owner Contact
                      </li>
                    </ul>
                  </div>

                  {/* Notice */}
                  <div className="compact-notice">
                    <small>⚠️ Complete your profile before booking</small>
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

// 🎨 COMPACT PROFESSIONAL STYLES
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  /* ✅ MAIN CONTAINER */
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* ✅ ANIMATED BACKGROUND */
  .animated-bg {
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
  
  /* ✅ COMPACT CARDS */
  .compact-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 16px !important;
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(124, 58, 237, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    z-index: 10;
    transition: all 0.3s ease !important;
  }
  
  .compact-card:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 16px 40px rgba(0, 0, 0, 0.15),
      0 6px 20px rgba(124, 58, 237, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  .compact-card-body {
    padding: 1.5rem !important;
    color: #1f2937;
  }
  
  /* ✅ COMPACT BACK BUTTON */
  .compact-back-btn {
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 10px 20px !important;
    color: white !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
    text-decoration: none !important;
  }
  
  .compact-back-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
    background: linear-gradient(135deg, #5a6fd8, #6a42a0) !important;
    color: white !important;
  }
  
  /* ✅ COMPACT IMAGE STYLES */
  .compact-property-image {
    height: 280px !important;
    object-fit: cover !important;
    border-radius: 12px !important;
  }
  
  .compact-caption {
    background: rgba(0,0,0,0.7) !important;
    border-radius: 8px !important;
    bottom: 10px !important;
    left: 10px !important;
    right: 10px !important;
    padding: 8px 12px !important;
  }
  
  .compact-no-image {
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 12px;
  }
  
  /* ✅ COMPACT BADGES */
  .compact-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .compact-badge {
    border-radius: 12px !important;
    padding: 4px 12px !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
  }
  
  .compact-badge.primary {
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    color: white !important;
  }
  
  .compact-badge.secondary {
    background: linear-gradient(135deg, #f093fb, #f5576c) !important;
    color: white !important;
  }
  
  .compact-badge.info {
    background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
    color: white !important;
  }
  
  /* ✅ COMPACT TITLE */
  .compact-title {
    font-size: 1.8rem !important;
    font-weight: 700 !important;
    background: linear-gradient(135deg, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
  }
  
  /* ✅ COMPACT PRICE & LOCATION */
  .compact-price-location {
    background: linear-gradient(135deg, rgba(245, 87, 108, 0.05), rgba(245, 87, 108, 0.02));
    padding: 1rem;
    border-radius: 12px;
    border-left: 4px solid #f5576c;
  }
  
  .compact-price {
    color: #10b981 !important;
    font-weight: 700 !important;
  }
  
  .compact-location {
    color: #6b7280 !important;
    font-size: 0.9rem !important;
    font-weight: 500 !important;
  }
  
  /* ✅ COMPACT DETAILS GRID */
  .compact-details-grid {
    border-top: 2px solid rgba(102, 126, 234, 0.1);
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
    padding: 1rem 0;
  }
  
  .compact-detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 0.85rem;
  }
  
  .compact-detail-item strong {
    color: #374151;
    font-weight: 600;
    min-width: 100px;
  }
  
  .compact-detail-item span {
    color: #1e293b;
    font-weight: 500;
  }
  
  /* ✅ COMPACT DESCRIPTION */
  .compact-section-title {
    color: #1e293b;
    font-weight: 700;
    font-size: 1.1rem;
  }
  
  .compact-description-text {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    padding: 1rem;
    border-radius: 12px;
    border-left: 4px solid #667eea;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #374151;
    white-space: pre-line;
    margin: 0;
  }
  
  /* ✅ COMPACT BOOKING CARD */
  .compact-booking-card {
    position: sticky;
    top: 20px;
  }
  
  .compact-booking-header {
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    color: white !important;
    padding: 1rem 1.5rem !important;
    border-radius: 16px 16px 0 0 !important;
    border: none !important;
  }
  
  .compact-booking-header h5 {
    font-weight: 700 !important;
    font-size: 1rem !important;
  }
  
  .compact-booking-price {
    text-align: center;
    padding: 1rem 0;
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  }
  
  .compact-booking-amount {
    color: #10b981 !important;
    font-weight: 800 !important;
    font-size: 1.6rem !important;
  }
  
  .compact-booking-subtitle {
    color: #6b7280 !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
  }
  
  .compact-booking-actions {
    margin-bottom: 1rem;
  }
  
  .compact-book-btn {
    width: 100% !important;
    background: linear-gradient(135deg, #10b981, #059669) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 12px 20px !important;
    font-size: 0.9rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.8rem !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3) !important;
    text-decoration: none !important;
    color: white !important;
  }
  
  .compact-book-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4) !important;
    background: linear-gradient(135deg, #059669, #047857) !important;
    color: white !important;
  }
  
  .compact-payment-info {
    text-align: center;
    color: #6b7280;
    font-weight: 500;
  }
  
  /* ✅ COMPACT FEATURES */
  .compact-features {
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  
  .compact-features-title {
    color: #1e293b;
    font-weight: 700;
    font-size: 0.95rem;
  }
  
  .compact-features-list {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
    border: 1px solid rgba(16, 185, 129, 0.1);
    border-radius: 12px;
    padding: 0.8rem;
    margin: 0;
    list-style: none;
  }
  
  .compact-features-list li {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #10b981;
  }
  
  .compact-features-list li:last-child {
    margin-bottom: 0;
  }
  
  .compact-check {
    font-size: 0.9rem;
  }
  
  /* ✅ COMPACT NOTICE */
  .compact-notice {
    text-align: center;
    color: #f59e0b;
    font-weight: 500;
  }
  
  /* ✅ COMPACT ALERTS */
  .compact-alert {
    background: rgba(254, 242, 242, 0.9) !important;
    border: 1px solid rgba(248, 113, 113, 0.3) !important;
    border-radius: 12px !important;
    padding: 1rem !important;
    color: #dc2626 !important;
    font-size: 0.9rem !important;
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
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  .loading-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(102, 126, 234, 0.2);
    border-left: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1rem auto;
  }
  
  .loading-card h4 {
    color: #1e293b;
    font-weight: 700;
    margin: 1rem 0;
  }
  
  /* ✅ ANIMATIONS */
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
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .compact-booking-card { position: static; }
    .compact-title { font-size: 1.5rem !important; }
    .compact-booking-amount { font-size: 1.4rem !important; }
  }
  
  @media (max-width: 767.98px) {
    .compact-card-body { padding: 1rem !important; }
    .compact-property-image { height: 220px !important; }
    .compact-title { font-size: 1.3rem !important; }
  }
`;

export default PropertyDetails;
