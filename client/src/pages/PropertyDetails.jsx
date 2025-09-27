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
      <div className="glass-loading-container">
        <div className="glass-loading-content">
          <div className="glass-loading-spinner"></div>
          <h3 className="glass-loading-text">Loading property details</h3>
          <p className="glass-loading-subtext">This won't take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-error-container">
        <Container>
          <div className="glass-error-content">
            <Alert variant="danger" className="glass-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="glass-button">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="glass-error-container">
        <Container>
          <div className="glass-error-content">
            <Alert variant="warning" className="glass-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="glass-button">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="glass-property-page">
      <Container className="py-4">
        {/* Back Button */}
        <Row className="mb-4">
          <Col>
            <Button 
              as={Link} 
              to="/find-property" 
              className="glass-back-button"
            >
              ← Back to Properties
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Main Content - Left Side */}
          <Col lg={8}>
            {/* Property Images */}
            <div className="glass-image-card mb-4">
              {property.images && property.images.length > 0 ? (
                <Carousel className="glass-carousel">
                  {property.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${property.title} - Image ${index + 1}`}
                        className="glass-property-image"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : property.image ? (
                <img 
                  src={getImageUrl(property.image)} 
                  alt={property.title}
                  className="glass-property-image"
                />
              ) : (
                <div className="glass-no-image">
                  <div className="glass-no-image-icon">📷</div>
                  <p>No images available</p>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="glass-info-card">
              {/* Badges */}
              <div className="glass-badges mb-3">
                <span className="glass-badge primary">{property.category}</span>
                {property.subtype && (
                  <span className="glass-badge secondary">{property.subtype}</span>
                )}
                {property.rentType.map(type => (
                  <span key={type} className="glass-badge accent">{type}</span>
                ))}
              </div>

              {/* Title */}
              <h1 className="glass-property-title">{property.title}</h1>

              {/* Location */}
              <div className="glass-location mb-4">
                <span className="glass-location-icon">📍</span>
                <span>
                  {property.address.street && `${property.address.street}, `}
                  {property.address.city}, {property.address.state} - {property.address.pincode}
                </span>
              </div>

              {/* Details Grid */}
              <div className="glass-details-section mb-4">
                <h3 className="glass-section-title">Property Details</h3>
                <Row className="glass-details-grid">
                  <Col md={6}>
                    <div className="glass-detail-item">
                      <div className="glass-detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="glass-detail-label">SIZE</div>
                        <div className="glass-detail-value">{property.size}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="glass-detail-item">
                      <div className="glass-detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="glass-detail-label">CONTACT</div>
                        <div className="glass-detail-value">{property.contact}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="glass-detail-item">
                      <div className="glass-detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="glass-detail-label">CATEGORY</div>
                        <div className="glass-detail-value">{property.category}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="glass-detail-item">
                      <div className="glass-detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                        </svg>
                      </div>
                      <div>
                        <div className="glass-detail-label">RENT TYPES</div>
                        <div className="glass-detail-value">{property.rentType.join(', ')}</div>
                      </div>
                    </div>
                  </Col>
                  {property.subtype && (
                    <Col md={6}>
                      <div className="glass-detail-item">
                        <div className="glass-detail-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18"/>
                            <path d="M5 21V7l8-4v18"/>
                          </svg>
                        </div>
                        <div>
                          <div className="glass-detail-label">TYPE</div>
                          <div className="glass-detail-value">{property.subtype}</div>
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col md={6}>
                    <div className="glass-detail-item">
                      <div className="glass-detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div>
                        <div className="glass-detail-label">DATE ADDED</div>
                        <div className="glass-detail-value">{new Date(property.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Description */}
              <div className="glass-description">
                <h5 className="glass-section-title">📝 Description</h5>
                <div className="glass-description-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
                </div>
              </div>
            </div>
          </Col>

          {/* Sidebar - Right Side */}
          <Col lg={4}>
            <div className="glass-booking-sidebar">
              <div className="glass-booking-card">
                <div className="glass-booking-header">
                  <h3 className="glass-price-amount">₹{formatPrice(property.price, property.rentType[0]).replace('₹', '')}/monthly</h3>
                  <p className="glass-price-availability">Available for {property.rentType.join(', ')} rental</p>
                </div>
                <div className="glass-booking-body">
                  {/* Reserve Button */}
                  <Button 
                    as={Link} 
                    to={`/book/${property._id}`}
                    className="glass-reserve-button"
                    size="lg"
                  >
                    Reserve Property
                  </Button>

                  {/* Payment Info */}
                  <div className="glass-payment-info">
                    <small>💳 Payment processed on-site</small>
                  </div>

                  {/* Features */}
                  <div className="glass-features">
                    <h6 className="glass-features-title">What's included</h6>
                    <ul className="glass-features-list">
                      <li>✓ {property.category} space access</li>
                      <li>✓ {property.size} total area</li>
                      <li>✓ Flexible {property.rentType.join('/')} terms</li>
                      <li>✓ Direct owner communication</li>
                    </ul>
                  </div>

                  {/* Warning */}
                  <div className="glass-booking-warning">
                    <small>⚠️ Complete your profile to proceed with booking</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ WORLD-CLASS GLASSMORPHISM STYLING */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .glass-property-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding-top: 100px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        /* Loading States */
        .glass-loading-container,
        .glass-error-container {
          min-height: 100vh;
          padding-top: 120px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .glass-loading-content,
        .glass-error-content {
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .glass-loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: glassSpin 0.8s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes glassSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .glass-loading-text {
          font-size: 22px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .glass-loading-subtext {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .glass-alert {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 24px;
          font-weight: 500;
          color: white;
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .glass-back-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .glass-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .glass-image-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .glass-carousel {
          border-radius: 20px;
          overflow: hidden;
        }

        .glass-property-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .glass-no-image {
          height: 400px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 20px;
        }

        .glass-no-image-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .glass-info-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .glass-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .glass-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .glass-badge.primary {
          background: rgba(255, 255, 255, 0.25);
        }

        .glass-badge.secondary {
          background: rgba(255, 255, 255, 0.15);
        }

        .glass-badge.accent {
          background: rgba(59, 130, 246, 0.3);
        }

        .glass-property-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .glass-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          font-weight: 500;
        }

        .glass-location-icon {
          color: white;
          font-size: 1.1rem;
        }

        .glass-details-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .glass-section-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .glass-details-grid {
          gap: 1rem;
        }

        .glass-detail-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .glass-detail-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .glass-detail-icon {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .glass-detail-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .glass-detail-value {
          font-size: 15px;
          font-weight: 600;
          color: white;
        }

        .glass-description {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-description-content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 15px;
        }

        .glass-description-content p {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          margin: 0;
          font-size: 15px;
        }

        .glass-booking-sidebar {
          position: sticky;
          top: 120px;
        }

        .glass-booking-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .glass-booking-header {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          color: white;
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-price-amount {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .glass-price-availability {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
          font-weight: 500;
        }

        .glass-booking-body {
          padding: 2rem;
        }

        .glass-reserve-button {
          width: 100%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px;
          transition: all 0.3s ease;
          color: white;
          text-decoration: none;
          margin-bottom: 1rem;
        }

        .glass-reserve-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          color: white;
        }

        .glass-payment-info {
          background: rgba(254, 243, 199, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .glass-features {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
        }

        .glass-features-title {
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .glass-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }

        .glass-features-list li {
          padding: 6px 0;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          font-size: 14px;
        }

        .glass-booking-warning {
          background: rgba(254, 242, 242, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          text-align: center;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .glass-booking-sidebar {
            position: static;
            top: auto;
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .glass-property-page {
            padding-top: 80px;
          }

          .glass-property-title {
            font-size: 1.75rem;
          }

          .glass-property-image {
            height: 250px;
          }

          .glass-details-section {
            padding: 1rem;
          }

          .glass-detail-item {
            padding: 0.75rem;
          }

          .glass-booking-header {
            padding: 1.5rem;
          }

          .glass-booking-body {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
