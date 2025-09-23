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
        <div className="property-details-page">
          <Container className="py-4">
            <div className="text-center loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading property details...</p>
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
        <div className="property-details-page">
          <Container className="py-4">
            <Alert variant="danger" className="modern-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
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
        <div className="property-details-page">
          <Container className="py-4">
            <Alert variant="warning" className="modern-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
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
      <div className="property-details-page">
        <Container className="py-4">
          <Row>
            <Col>
              <div className="mb-4">
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
                          style={{ height: '450px', objectFit: 'cover', borderRadius: '16px' }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="property-details-image w-100"
                    style={{ height: '450px', objectFit: 'cover', borderRadius: '16px' }}
                  />
                ) : (
                  <div className="no-image-placeholder d-flex align-items-center justify-content-center" 
                       style={{ height: '450px', borderRadius: '16px' }}>
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
                  <div className="mb-4">
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

                  <h1 className="property-title mb-4">{property.title}</h1>

                  <div className="price-location-section mb-4">
                    <Row>
                      <Col md={6}>
                        <div className="price-block">
                          <h3 className="property-price mb-2">
                            {formatPrice(property.price, property.rentType[0])}
                          </h3>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="location-block">
                          <p className="property-location mb-0">
                            📍 {property.address.street && `${property.address.street}, `}
                            {property.address.city}, {property.address.state} - {property.address.pincode}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Row className="property-details-grid mb-4">
                    <Col md={6}>
                      <div className="detail-item">
                        <strong className="detail-label">📐 Size:</strong>
                        <span className="detail-value">{property.size}</span>
                      </div>
                      <div className="detail-item">
                        <strong className="detail-label">🏷️ Category:</strong>
                        <span className="detail-value">{property.category}</span>
                      </div>
                      {property.subtype && (
                        <div className="detail-item">
                          <strong className="detail-label">🏷️ Type:</strong>
                          <span className="detail-value">{property.subtype}</span>
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <strong className="detail-label">📞 Contact:</strong>
                        <span className="detail-value">{property.contact}</span>
                      </div>
                      <div className="detail-item">
                        <strong className="detail-label">💰 Rent Types:</strong>
                        <span className="detail-value">{property.rentType.join(', ')}</span>
                      </div>
                      <div className="detail-item">
                        <strong className="detail-label">📅 Added:</strong>
                        <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Col>
                  </Row>

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
              {/* Booking Card */}
              <Card className="booking-card sticky-top" style={{ top: '20px' }}>
                <Card.Header className="booking-header text-white">
                  <h5 className="mb-0">📋 Book This Property</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4 booking-price-section">
                    <h3 className="booking-price mb-2">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="booking-subtitle mb-0">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  <div className="d-grid gap-3">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="book-now-btn"
                      size="lg"
                    >
                      📅 Book Now
                    </Button>
                    
                    <div className="text-center payment-notice">
                      <small className="text-muted">
                        💳 Payment: On Spot Only
                      </small>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top features-section">
                    <h6 className="features-title mb-3">✨ Property Features</h6>
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

                  <div className="mt-4 pt-3 border-top text-center profile-reminder">
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
      <style dangerouslySetInnerHTML={{__html: getPropertyStyles()}} />
    </>
  );
};

// 🎨 MODERN SPACELINK DESIGN STYLES
const getPropertyStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #86efac 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    overflow-x: hidden;
  }
  
  .property-details-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(5, 150, 105, 0.04) 0%, transparent 50%);
    pointer-events: none;
    animation: backgroundFloat 20s ease-in-out infinite;
  }
  
  @keyframes backgroundFloat {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  /* 🔄 LOADING STATE */
  .loading-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
  }
  
  .text-primary {
    color: #10b981 !important;
  }
  
  /* 🎨 CARDS */
  .property-image-card, .property-details-card, .booking-card {
    border: none !important;
    border-radius: 24px !important;
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.08),
      0 8px 25px rgba(16, 185, 129, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    overflow: hidden;
    position: relative;
  }
  
  .property-image-card::before,
  .property-details-card::before,
  .booking-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981 0%, #22c55e 50%, #34d399 100%);
    z-index: 1;
  }
  
  .property-image-card:hover,
  .property-details-card:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 30px 70px rgba(0, 0, 0, 0.12),
      0 12px 35px rgba(16, 185, 129, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  /* 🖼️ IMAGE CAROUSEL */
  .property-carousel {
    border-radius: 20px !important;
    overflow: hidden;
  }
  
  .property-carousel .carousel-control-prev,
  .property-carousel .carousel-control-next {
    background: rgba(16, 185, 129, 0.9) !important;
    border-radius: 50% !important;
    width: 50px !important;
    height: 50px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    opacity: 0.8 !important;
    transition: all 0.3s ease !important;
  }
  
  .property-carousel .carousel-control-prev:hover,
  .property-carousel .carousel-control-next:hover {
    background: rgba(16, 185, 129, 1) !important;
    opacity: 1 !important;
    transform: translateY(-50%) scale(1.1) !important;
  }
  
  .property-carousel .carousel-control-prev {
    left: 20px !important;
  }
  
  .property-carousel .carousel-control-next {
    right: 20px !important;
  }
  
  .property-carousel .carousel-indicators [data-bs-target] {
    background-color: #10b981 !important;
    border-radius: 50% !important;
    width: 12px !important;
    height: 12px !important;
    margin: 0 4px !important;
  }
  
  .no-image-placeholder {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    border: 2px dashed rgba(16, 185, 129, 0.3) !important;
  }
  
  .placeholder-icon {
    font-size: 4rem;
    color: #10b981;
    margin-bottom: 1rem;
  }
  
  /* 🏷️ BADGES */
  .custom-badge {
    border-radius: 16px !important;
    padding: 8px 16px !important;
    font-size: 0.8rem !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
  
  .custom-badge.primary {
    background: linear-gradient(135deg, #10b981 0%, #22c55e 100%) !important;
    color: white !important;
  }
  
  .custom-badge.secondary {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    color: white !important;
  }
  
  .custom-badge.info {
    background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%) !important;
    color: white !important;
  }
  
  /* 📝 TYPOGRAPHY */
  .property-title {
    font-size: 2.5rem !important;
    font-weight: 900 !important;
    background: linear-gradient(135deg, #10b981 0%, #22c55e 50%, #34d399 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2 !important;
    margin-bottom: 2rem !important;
  }
  
  /* 💰 PRICE & LOCATION */
  .price-location-section {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
    border: 2px solid rgba(16, 185, 129, 0.15);
    border-radius: 20px;
    padding: 2rem;
  }
  
  .property-price {
    font-size: 2.2rem !important;
    font-weight: 800 !important;
    color: #10b981 !important;
    margin: 0 !important;
  }
  
  .property-location {
    font-size: 1.1rem !important;
    color: #6b7280 !important;
    font-weight: 500 !important;
    margin: 0 !important;
  }
  
  /* 📊 PROPERTY DETAILS */
  .property-details-grid {
    background: rgba(248, 250, 252, 0.7);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  .detail-item:last-child {
    border-bottom: none;
  }
  
  .detail-label {
    color: #374151 !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
  }
  
  .detail-value {
    color: #10b981 !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
  }
  
  /* 📝 DESCRIPTION */
  .section-title {
    font-weight: 700 !important;
    color: #374151 !important;
    font-size: 1.4rem !important;
    margin-bottom: 1rem !important;
  }
  
  .description-content {
    font-size: 1.1rem !important;
    line-height: 1.8 !important;
    color: #4b5563 !important;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(16, 185, 129, 0.01) 100%);
    border-radius: 16px;
    border-left: 4px solid #10b981;
    white-space: pre-line;
  }
  
  /* 📋 BOOKING CARD */
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
    margin: -2px -2px 0 -2px !important;
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
    margin: 0 !important;
  }
  
  .booking-subtitle {
    font-weight: 500 !important;
    color: #6b7280 !important;
    margin: 0 !important;
  }
  
  /* 🔘 BUTTONS */
  .back-btn {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 12px 24px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    box-shadow: 0 6px 20px rgba(107, 114, 128, 0.25) !important;
  }
  
  .back-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 10px 30px rgba(107, 114, 128, 0.35) !important;
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
    color: white !important;
  }
  
  .book-now-btn {
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%) !important;
    border: none !important;
    border-radius: 16px !important;
    padding: 16px 20px !important;
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3) !important;
    color: white !important;
  }
  
  .book-now-btn:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4) !important;
    background: linear-gradient(135deg, #d97706 0%, #ea580c 100%) !important;
    color: white !important;
  }
  
  /* 💳 PAYMENT NOTICE */
  .payment-notice {
    background: rgba(16, 185, 129, 0.05);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(16, 185, 129, 0.1);
  }
  
  /* ✨ FEATURES SECTION */
  .features-section {
    background: rgba(16, 185, 129, 0.02);
    margin: -1rem -1rem 0 -1rem;
    padding: 1.5rem;
    border-radius: 0 0 20px 20px;
  }
  
  .features-title {
    color: #374151 !important;
    font-weight: 700 !important;
    font-size: 1.1rem !important;
  }
  
  .property-features-list {
    margin: 0 !important;
  }
  
  .feature-item {
    padding: 0.8rem 0 !important;
    font-weight: 500 !important;
    color: #10b981 !important;
    border-bottom: 1px solid rgba(16, 185, 129, 0.1);
    transition: all 0.2s ease !important;
    margin-bottom: 0 !important;
  }
  
  .feature-item:last-child {
    border-bottom: none !important;
  }
  
  .feature-item:hover {
    color: #059669 !important;
    padding-left: 0.5rem !important;
  }
  
  /* ⚠️ PROFILE REMINDER */
  .profile-reminder {
    background: rgba(245, 158, 11, 0.05);
    margin: -1rem -1rem -1rem -1rem;
    padding: 1.5rem;
    border-radius: 0 0 20px 20px;
    border-top: 1px solid rgba(245, 158, 11, 0.1) !important;
  }
  
  /* 🚨 ALERTS */
  .modern-alert {
    border: none !important;
    border-radius: 18px !important;
    padding: 2rem !important;
    font-weight: 600 !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
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
  
  /* 📱 RESPONSIVE */
  @media (max-width: 991.98px) {
    .booking-card { 
      position: static !important; 
      margin-top: 2rem; 
    }
    
    .property-title { 
      font-size: 2rem !important; 
    }
    
    .property-price, .booking-price { 
      font-size: 1.6rem !important; 
    }
  }
  
  @media (max-width: 767.98px) {
    .property-title { 
      font-size: 1.6rem !important; 
    }
    
    .property-price, .booking-price { 
      font-size: 1.4rem !important; 
    }
    
    .price-location-section {
      padding: 1.5rem;
    }
    
    .property-details-grid {
      padding: 1rem;
    }
  }
`;

export default PropertyDetails;
