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
        <div className="premium-container">
          <div className="animated-bg">
            <div className="gradient-layer"></div>
            <div className="pattern-overlay"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          <Container className="content-wrapper py-4">
            <div className="loading-center">
              <div className="glass-loading-card">
                <div className="loading-icon">🏠</div>
                <div className="premium-spinner"></div>
                <h4 className="loading-title">Loading Property Details...</h4>
                <p className="loading-subtitle">Please wait while we fetch the information</p>
              </div>
            </div>
          </Container>
        </div>
        <style>{getPremiumStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="premium-container">
          <div className="animated-bg">
            <div className="gradient-layer"></div>
            <div className="pattern-overlay"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          <Container className="content-wrapper py-4">
            <div className="error-center">
              <div className="glass-error-card">
                <div className="error-icon">⚠️</div>
                <h4 className="error-title">Error Loading Property</h4>
                <p className="error-message">{error}</p>
                <Button as={Link} to="/find-property" className="premium-back-btn">
                  ← Back to Properties
                </Button>
              </div>
            </div>
          </Container>
        </div>
        <style>{getPremiumStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="premium-container">
          <div className="animated-bg">
            <div className="gradient-layer"></div>
            <div className="pattern-overlay"></div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          <Container className="content-wrapper py-4">
            <div className="not-found-center">
              <div className="glass-notfound-card">
                <div className="notfound-icon">🏘️</div>
                <h4 className="notfound-title">Property Not Found</h4>
                <p className="notfound-message">The requested property could not be found</p>
                <Button as={Link} to="/find-property" className="premium-back-btn">
                  ← Back to Properties
                </Button>
              </div>
            </div>
          </Container>
        </div>
        <style>{getPremiumStyles()}</style>
      </>
    );
  }

  return (
    <>
      <div className="premium-container">
        
        {/* ✨ PREMIUM ANIMATED BACKGROUND */}
        <div className="animated-bg">
          <div className="gradient-layer"></div>
          <div className="pattern-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* 🎯 MAIN CONTENT */}
        <Container className="content-wrapper py-4">
          <Row>
            <Col>
              <div className="mb-4">
                <Button as={Link} to="/find-property" className="premium-back-button mb-3">
                  ← Back to Properties
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              
              {/* 🖼️ PREMIUM IMAGE CAROUSEL */}
              <Card className="premium-glass-card mb-4">
                <div className="image-showcase">
                  {property.images && property.images.length > 0 ? (
                    <Carousel className="premium-carousel">
                      {property.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <div className="image-wrapper">
                            <img 
                              src={getImageUrl(image)} 
                              alt={`${property.title} - Image ${index + 1}`}
                              className="premium-property-image"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Property+Image';
                              }}
                            />
                            <div className="image-gradient-overlay"></div>
                            <div className="image-info-badge">
                              <span className="image-counter">
                                📷 {index + 1} of {property.images.length}
                              </span>
                            </div>
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : property.image ? (
                    <div className="single-image-wrapper">
                      <img 
                        src={getImageUrl(property.image)} 
                        alt={property.title}
                        className="premium-property-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Property+Image';
                        }}
                      />
                      <div className="image-gradient-overlay"></div>
                    </div>
                  ) : (
                    <div className="no-image-placeholder">
                      <div className="no-image-icon">🏠</div>
                      <p className="no-image-text">No images available</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* 📋 PREMIUM PROPERTY DETAILS */}
              <Card className="premium-glass-card">
                <Card.Body className="premium-card-body">
                  
                  {/* 🏷️ BEAUTIFUL BADGES */}
                  <div className="premium-badges-row mb-4">
                    <Badge className="premium-badge primary-badge">{property.category}</Badge>
                    {property.subtype && (
                      <Badge className="premium-badge secondary-badge">{property.subtype}</Badge>
                    )}
                    {property.rentType.map(type => (
                      <Badge key={type} className="premium-badge info-badge">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* 📍 TITLE & PRICE SECTION */}
                  <div className="property-hero-section mb-4">
                    <h1 className="premium-title">{property.title}</h1>
                    <div className="price-showcase">
                      <div className="price-icon">💰</div>
                      <h4 className="premium-price">
                        {formatPrice(property.price, property.rentType[0])}
                      </h4>
                    </div>
                  </div>

                  {/* 🌍 LOCATION SECTION */}
                  <div className="location-showcase mb-4">
                    <div className="location-icon">📍</div>
                    <p className="location-text">
                      {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state} - {property.address.pincode}
                    </p>
                  </div>

                  {/* 📊 DETAILS GRID */}
                  <div className="details-premium-grid mb-4">
                    <Row>
                      <Col md={6}>
                        <div className="detail-premium-item">
                          <div className="detail-icon">📐</div>
                          <div className="detail-content">
                            <strong className="detail-label">Size:</strong>
                            <span className="detail-value">{property.size}</span>
                          </div>
                        </div>
                        <div className="detail-premium-item">
                          <div className="detail-icon">🏷️</div>
                          <div className="detail-content">
                            <strong className="detail-label">Category:</strong>
                            <span className="detail-value">{property.category}</span>
                          </div>
                        </div>
                        {property.subtype && (
                          <div className="detail-premium-item">
                            <div className="detail-icon">🏷️</div>
                            <div className="detail-content">
                              <strong className="detail-label">Type:</strong>
                              <span className="detail-value">{property.subtype}</span>
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <div className="detail-premium-item">
                          <div className="detail-icon">📞</div>
                          <div className="detail-content">
                            <strong className="detail-label">Contact:</strong>
                            <span className="detail-value">{property.contact}</span>
                          </div>
                        </div>
                        <div className="detail-premium-item">
                          <div className="detail-icon">💰</div>
                          <div className="detail-content">
                            <strong className="detail-label">Rent Types:</strong>
                            <span className="detail-value">{property.rentType.join(', ')}</span>
                          </div>
                        </div>
                        <div className="detail-premium-item">
                          <div className="detail-icon">📅</div>
                          <div className="detail-content">
                            <strong className="detail-label">Added:</strong>
                            <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 📝 DESCRIPTION SECTION */}
                  <div className="description-premium-section">
                    <h5 className="section-premium-title">
                      <span className="section-icon">📝</span>
                      Description
                    </h5>
                    <div className="description-premium-content">
                      {property.description}
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              
              {/* 🎯 PREMIUM BOOKING CARD */}
              <Card className="premium-glass-card premium-sticky-card">
                <div className="booking-premium-header">
                  <div className="booking-header-icon">📋</div>
                  <h5 className="booking-header-title">Book This Property</h5>
                </div>
                <Card.Body className="premium-card-body">
                  
                  {/* 💎 PRICE DISPLAY */}
                  <div className="booking-price-section mb-4">
                    <h3 className="booking-premium-price">
                      {formatPrice(property.price, property.rentType[0])}
                    </h3>
                    <p className="booking-price-subtitle">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  {/* 🚀 ACTION BUTTONS */}
                  <div className="booking-actions">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="premium-book-button"
                      size="lg"
                    >
                      <span className="btn-icon">📅</span>
                      Book Now
                    </Button>
                    
                    <div className="payment-premium-info">
                      <span className="payment-icon">💳</span>
                      <small className="payment-text">Payment: On Spot Only</small>
                    </div>
                  </div>

                  {/* ✨ FEATURES SECTION */}
                  <div className="features-premium-section">
                    <h6 className="features-premium-title">
                      <span className="features-icon">✨</span>
                      Property Features
                    </h6>
                    <div className="features-premium-list">
                      <div className="feature-premium-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.category} Space</span>
                      </div>
                      <div className="feature-premium-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.size} Area</span>
                      </div>
                      <div className="feature-premium-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{property.rentType.join('/')} Rental</span>
                      </div>
                      <div className="feature-premium-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">Direct Owner Contact</span>
                      </div>
                    </div>
                  </div>

                  {/* ⚠️ NOTICE */}
                  <div className="booking-premium-notice">
                    <span className="notice-icon">⚠️</span>
                    <small className="notice-text">Complete your profile before booking</small>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{getPremiumStyles()}</style>
    </>
  );
};

// 🎨 PREMIUM STYLES
const getPremiumStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  /* 🌟 MAIN CONTAINER */
  .premium-container {
    min-height: 100vh;
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }
  
  /* ✨ ANIMATED BACKGROUND */
  .animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
  
  .gradient-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #667eea 0%, 
      #764ba2 25%, 
      #f093fb 50%, 
      #f5576c 75%, 
      #4facfe 100%);
    animation: gradientMove 15s ease-in-out infinite;
  }
  
  .pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%);
    background-size: 400px 400px;
    animation: patternFloat 20s linear infinite;
  }
  
  .floating-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.6;
  }
  
  .shape-1 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
    top: 20%;
    left: 10%;
    animation: floatUp 12s ease-in-out infinite;
  }
  
  .shape-2 {
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
    top: 60%;
    right: 20%;
    animation: floatDown 16s ease-in-out infinite;
  }
  
  .shape-3 {
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    bottom: 30%;
    left: 30%;
    animation: floatSide 14s ease-in-out infinite;
  }
  
  /* 🎯 CONTENT WRAPPER */
  .content-wrapper {
    position: relative;
    z-index: 2;
  }
  
  /* 💎 PREMIUM GLASS CARDS */
  .premium-glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px) saturate(180%);
    -webkit-backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 32px;
    box-shadow: 
      0 32px 64px -12px rgba(0, 0, 0, 0.25),
      0 16px 32px -8px rgba(76, 172, 254, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    animation: slideInUp 0.8s ease-out;
  }
  
  .premium-glass-card:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 40px 80px -12px rgba(0, 0, 0, 0.3),
      0 20px 40px -8px rgba(76, 172, 254, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 1);
  }
  
  .premium-card-body {
    padding: 2.5rem;
  }
  
  /* 🔙 PREMIUM BACK BUTTON */
  .premium-back-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 20px;
    padding: 16px 32px;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.4s ease;
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    animation: slideInLeft 0.6s ease-out;
  }
  
  .premium-back-button:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.6);
    background: linear-gradient(135deg, #5a6fd8, #6a42a0);
    color: white;
  }
  
  /* 🖼️ IMAGE SHOWCASE */
  .image-showcase {
    position: relative;
    height: 500px;
    border-radius: 28px;
    overflow: hidden;
  }
  
  .image-wrapper,
  .single-image-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  .premium-property-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
    border-radius: 28px;
  }
  
  .premium-property-image:hover {
    transform: scale(1.08);
  }
  
  .image-gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    pointer-events: none;
  }
  
  .image-info-badge {
    position: absolute;
    bottom: 24px;
    right: 24px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(15px);
    color: white;
    padding: 12px 20px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.95rem;
  }
  
  .no-image-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 28px;
  }
  
  .no-image-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .no-image-text {
    font-size: 1.2rem;
    font-weight: 600;
    color: #64748b;
  }
  
  /* 🏷️ PREMIUM BADGES */
  .premium-badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  
  .premium-badge {
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .primary-badge {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  }
  
  .secondary-badge {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
  }
  
  .info-badge {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
  }
  
  /* 📍 PROPERTY HERO */
  .property-hero-section {
    padding: 2rem 0;
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
    animation: fadeInUp 0.8s ease-out 0.3s both;
  }
  
  .premium-title {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #667eea, #764ba2);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
    line-height: 1.1;
  }
  
  .price-showcase {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .price-icon {
    font-size: 2rem;
  }
  
  .premium-price {
    font-size: 2.2rem;
    font-weight: 800;
    color: #10b981;
    margin: 0;
  }
  
  /* 🌍 LOCATION SHOWCASE */
  .location-showcase {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(245, 87, 108, 0.05), rgba(245, 87, 108, 0.02));
    border-radius: 24px;
    border-left: 6px solid #f5576c;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }
  
  .location-icon {
    font-size: 1.5rem;
  }
  
  .location-text {
    font-size: 1.2rem;
    color: #374151;
    font-weight: 600;
    margin: 0;
  }
  
  /* 📊 DETAILS GRID */
  .details-premium-grid {
    padding: 2rem 0;
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }
  
  .detail-premium-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
  }
  
  .detail-icon {
    font-size: 1.5rem;
    min-width: 40px;
    text-align: center;
  }
  
  .detail-content {
    flex: 1;
  }
  
  .detail-label {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    margin-right: 12px;
  }
  
  .detail-value {
    font-size: 1.1rem;
    color: #1e293b;
    font-weight: 700;
  }
  
  /* 📝 DESCRIPTION */
  .description-premium-section {
    animation: fadeInUp 0.8s ease-out 0.6s both;
  }
  
  .section-premium-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.6rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }
  
  .section-icon {
    font-size: 1.8rem;
  }
  
  .description-premium-content {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    padding: 2rem;
    border-radius: 20px;
    border-left: 6px solid #667eea;
    font-size: 1.1rem;
    line-height: 1.8;
    color: #374151;
    white-space: pre-line;
    font-weight: 500;
  }
  
  /* 🎯 BOOKING CARD */
  .premium-sticky-card {
    position: sticky;
    top: 30px;
    animation: slideInRight 0.8s ease-out;
  }
  
  .booking-premium-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 2rem;
    border-radius: 32px 32px 0 0;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .booking-header-icon {
    font-size: 2rem;
  }
  
  .booking-header-title {
    margin: 0;
    font-weight: 800;
    font-size: 1.4rem;
  }
  
  .booking-price-section {
    text-align: center;
    padding: 2rem 0;
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
  }
  
  .booking-premium-price {
    font-size: 2.5rem;
    font-weight: 900;
    color: #10b981;
    margin-bottom: 0.5rem;
  }
  
  .booking-price-subtitle {
    color: #6b7280;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }
  
  .booking-actions {
    margin-bottom: 2rem;
  }
  
  .premium-book-button {
    width: 100%;
    background: linear-gradient(135deg, #10b981, #059669);
    border: none;
    border-radius: 20px;
    padding: 20px;
    font-size: 1.3rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 1.5rem;
    transition: all 0.4s ease;
    box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
    text-decoration: none;
    color: white;
  }
  
  .premium-book-button:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(16, 185, 129, 0.6);
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
  }
  
  .btn-icon {
    font-size: 1.5rem;
  }
  
  .payment-premium-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    color: #6b7280;
  }
  
  .payment-icon {
    font-size: 1.2rem;
  }
  
  /* ✨ FEATURES */
  .features-premium-section {
    border-bottom: 3px solid rgba(102, 126, 234, 0.1);
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }
  
  .features-premium-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.3rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }
  
  .features-icon {
    font-size: 1.5rem;
  }
  
  .features-premium-list {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
    border: 2px solid rgba(16, 185, 129, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
  }
  
  .feature-premium-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: #10b981;
  }
  
  .feature-premium-item:last-child {
    margin-bottom: 0;
  }
  
  .feature-check {
    font-size: 1.2rem;
  }
  
  /* ⚠️ NOTICE */
  .booking-premium-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    color: #f59e0b;
  }
  
  .notice-icon {
    font-size: 1.2rem;
  }
  
  /* 🔄 LOADING STATES */
  .loading-center,
  .error-center,
  .not-found-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
  }
  
  .glass-loading-card,
  .glass-error-card,
  .glass-notfound-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px);
    border-radius: 32px;
    padding: 3rem;
    text-align: center;
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.25);
    animation: slideInUp 0.8s ease-out;
    max-width: 500px;
  }
  
  .loading-icon,
  .error-icon,
  .notfound-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .loading-title,
  .error-title,
  .notfound-title {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1e293b;
    margin: 1.5rem 0 1rem 0;
  }
  
  .loading-subtitle,
  .error-message,
  .notfound-message {
    font-size: 1.1rem;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 2rem;
  }
  
  .premium-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-left: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 1.5rem auto;
  }
  
  .premium-back-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 16px;
    padding: 12px 24px;
    color: white;
    font-weight: 700;
    transition: all 0.3s ease;
    text-decoration: none;
  }
  
  .premium-back-btn:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #5a6fd8, #6a42a0);
    color: white;
  }
  
  /* 🎬 ANIMATIONS */
  @keyframes gradientMove {
    0%, 100% { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
    }
    50% { 
      background: linear-gradient(135deg, #4facfe 0%, #667eea 25%, #764ba2 50%, #f093fb 75%, #f5576c 100%);
    }
  }
  
  @keyframes patternFloat {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-50px, -50px) rotate(360deg); }
  }
  
  @keyframes floatUp {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.1); }
  }
  
  @keyframes floatDown {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(25px) scale(0.9); }
  }
  
  @keyframes floatSide {
    0%, 100% { transform: translateX(0) scale(1); }
    50% { transform: translateX(40px) scale(1.05); }
  }
  
  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(40px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-40px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(40px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
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
  
  /* 📱 RESPONSIVE */
  @media (max-width: 991.98px) {
    .premium-sticky-card { position: static; }
    .premium-title { font-size: 2.2rem; }
    .booking-premium-price { font-size: 2rem; }
    .shape-1 { width: 250px; height: 250px; }
    .shape-2 { width: 200px; height: 200px; }
    .shape-3 { width: 150px; height: 150px; }
  }
  
  @media (max-width: 767.98px) {
    .premium-container { padding-top: 20px; }
    .image-showcase { height: 350px; }
    .premium-title { font-size: 1.8rem; }
    .premium-card-body { padding: 1.5rem; }
  }
`;

export default PropertyDetails;
