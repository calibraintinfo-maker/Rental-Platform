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
      <div className="premium-loading-wrapper">
        <Container className="py-4">
          <div className="text-center">
            <div className="premium-spinner">
              <div className="spinner-border premium-spinner-custom" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h3 className="premium-loading-text">Loading Property Details</h3>
            <p className="premium-loading-subtitle">Fetching premium property information...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error-wrapper">
        <Container className="py-4">
          <div className="premium-error-card">
            <Alert variant="danger" className="premium-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="premium-btn primary">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="premium-error-wrapper">
        <Container className="py-4">
          <div className="premium-error-card">
            <Alert variant="warning" className="premium-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="premium-btn primary">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="premium-property-details">
      <Container className="py-4">
        <Row>
          <Col>
            <div className="mb-4">
              <Button as={Link} to="/find-property" className="premium-back-btn mb-3">
                <span className="back-arrow">←</span>
                <span>Back to Properties</span>
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="premium-property-row">
          <Col lg={8}>
            {/* Property Images Carousel */}
            <Card className="premium-image-card mb-4">
              {property.images && property.images.length > 0 ? (
                <div className="premium-carousel-wrapper">
                  <Carousel className="premium-carousel">
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="premium-property-image w-100"
                        />
                        <div className="premium-carousel-caption">
                          <span className="image-counter">
                            {index + 1} / {property.images.length}
                          </span>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              ) : property.image ? (
                <img 
                  src={getImageUrl(property.image)} 
                  alt={property.title}
                  className="premium-property-image w-100"
                />
              ) : (
                <div className="premium-no-image">
                  <div className="no-image-icon">🏠</div>
                  <p className="no-image-text">No images available</p>
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card className="premium-details-card">
              <Card.Body className="premium-card-body">
                <div className="premium-badges mb-3">
                  <Badge className="premium-badge primary me-2">{property.category}</Badge>
                  {property.subtype && (
                    <Badge className="premium-badge secondary me-2">{property.subtype}</Badge>
                  )}
                  {property.rentType.map(type => (
                    <Badge key={type} className="premium-badge info me-1">
                      {type}
                    </Badge>
                  ))}
                </div>

                <h1 className="premium-title mb-3">{property.title}</h1>

                <div className="premium-price-location mb-4">
                  <h4 className="premium-price mb-2">
                    {formatPrice(property.price, property.rentType[0])}
                  </h4>
                  <p className="premium-location mb-0">
                    <span className="location-icon">📍</span>
                    {property.address.street && `${property.address.street}, `}
                    {property.address.city}, {property.address.state} - {property.address.pincode}
                  </p>
                </div>

                <Row className="premium-details-row mb-4">
                  <Col md={6}>
                    <div className="premium-detail-item mb-3">
                      <span className="detail-icon">📐</span>
                      <span className="detail-label">Size:</span>
                      <span className="detail-value">{property.size}</span>
                    </div>
                    <div className="premium-detail-item mb-3">
                      <span className="detail-icon">🏷️</span>
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{property.category}</span>
                    </div>
                    {property.subtype && (
                      <div className="premium-detail-item mb-3">
                        <span className="detail-icon">🏷️</span>
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{property.subtype}</span>
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    <div className="premium-detail-item mb-3">
                      <span className="detail-icon">📞</span>
                      <span className="detail-label">Contact:</span>
                      <span className="detail-value">{property.contact}</span>
                    </div>
                    <div className="premium-detail-item mb-3">
                      <span className="detail-icon">💰</span>
                      <span className="detail-label">Rent Types:</span>
                      <span className="detail-value">{property.rentType.join(', ')}</span>
                    </div>
                    <div className="premium-detail-item mb-3">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Added:</span>
                      <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Col>
                </Row>

                <div className="premium-description mb-4">
                  <h5 className="premium-section-title mb-3">
                    <span className="section-icon">📝</span>
                    Description
                  </h5>
                  <div className="premium-description-content">
                    <p className="description-text" style={{ whiteSpace: 'pre-line' }}>
                      {property.description}
                    </p>
                  </div>
                </div>

                {/* Property Owner details removed as requested */}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Booking Card */}
            <Card className="premium-booking-card sticky-top">
              <div className="premium-booking-header">
                <h5 className="booking-title mb-0">
                  <span className="booking-icon">📋</span>
                  Book This Property
                </h5>
              </div>
              <Card.Body className="premium-booking-body">
                <div className="premium-price-summary text-center mb-4">
                  <h3 className="booking-price mb-2">
                    {formatPrice(property.price, property.rentType[0])}
                  </h3>
                  <p className="booking-availability mb-0">
                    Available for {property.rentType.join(', ')} rental
                  </p>
                </div>

                <div className="premium-booking-actions d-grid gap-3">
                  <Button 
                    as={Link} 
                    to={`/book/${property._id}`}
                    className="premium-book-btn"
                    size="lg"
                  >
                    <span className="btn-icon">📅</span>
                    <span>Book Now</span>
                  </Button>
                  
                  <div className="premium-payment-note text-center">
                    <small className="payment-text">
                      <span className="payment-icon">💳</span>
                      Payment: On Spot Only
                    </small>
                  </div>
                </div>

                <div className="premium-features mt-4 pt-3">
                  <h6 className="features-title mb-3">
                    <span className="features-icon">✨</span>
                    Property Features
                  </h6>
                  <ul className="premium-features-list list-unstyled">
                    <li className="feature-item mb-2">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{property.category} Space</span>
                    </li>
                    <li className="feature-item mb-2">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{property.size} Area</span>
                    </li>
                    <li className="feature-item mb-2">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">{property.rentType.join('/')} Rental</span>
                    </li>
                    <li className="feature-item mb-2">
                      <span className="feature-check">✓</span>
                      <span className="feature-text">Direct Owner Contact</span>
                    </li>
                  </ul>
                </div>

                <div className="premium-booking-note mt-4 pt-3 text-center">
                  <small className="booking-note-text">
                    <span className="note-icon">⚠️</span>
                    Complete your profile before booking
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Contact Information and Property Owner details removed as requested */}
          </Col>
        </Row>
      </Container>

      {/* ✅ PREMIUM STYLING - NO LOGIC CHANGES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .premium-property-details {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding-top: 80px;
        }
        
        .premium-loading-wrapper {
          background: linear-gradient(135deg, #8b5cf6 20%, #7c3aed 45%, #a855f7 70%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          color: white;
        }
        
        .premium-spinner {
          margin-bottom: 2rem;
        }
        
        .premium-spinner-custom {
          width: 3rem;
          height: 3rem;
          border: 0.25rem solid rgba(255, 255, 255, 0.2);
          border-right-color: white;
        }
        
        .premium-loading-text {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .premium-loading-subtitle {
          font-size: 1rem;
          opacity: 0.9;
        }
        
        .premium-error-wrapper {
          background: #f8fafc;
          min-height: 100vh;
          padding-top: 80px;
        }
        
        .premium-error-card {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }
        
        .premium-alert {
          border-radius: 12px;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          font-weight: 500;
        }
        
        .premium-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
          color: white;
        }
        
        .premium-back-btn {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 600;
          color: #374151;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .premium-back-btn:hover {
          background: white;
          color: #6366f1;
          transform: translateX(-5px);
        }
        
        .back-arrow {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }
        
        .premium-back-btn:hover .back-arrow {
          transform: translateX(-3px);
        }
        
        .premium-property-row {
          gap: 2rem;
        }
        
        .premium-image-card {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .premium-image-card:hover {
          transform: translateY(-5px);
        }
        
        .premium-carousel-wrapper {
          position: relative;
        }
        
        .premium-carousel .carousel-control-prev,
        .premium-carousel .carousel-control-next {
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          border: none;
        }
        
        .premium-carousel .carousel-control-prev {
          left: 20px;
        }
        
        .premium-carousel .carousel-control-next {
          right: 20px;
        }
        
        .premium-property-image {
          height: 450px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .premium-carousel-caption {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .image-counter {
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .premium-no-image {
          height: 450px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        
        .no-image-icon {
          font-size: 4rem;
          opacity: 0.5;
        }
        
        .no-image-text {
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }
        
        .premium-details-card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .premium-details-card:hover {
          transform: translateY(-5px);
        }
        
        .premium-card-body {
          padding: 2.5rem;
        }
        
        .premium-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .premium-badge {
          font-weight: 600;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
        }
        
        .premium-badge.primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }
        
        .premium-badge.secondary {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
        }
        
        .premium-badge.info {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
        }
        
        .premium-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        
        .premium-price-location {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.1);
        }
        
        .premium-price {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .premium-location {
          color: #64748b;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .location-icon {
          color: #6366f1;
        }
        
        .premium-details-row {
          background: rgba(248, 250, 252, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
        }
        
        .premium-detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        
        .detail-icon {
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
        }
        
        .detail-label {
          font-weight: 600;
          color: #374151;
          min-width: 80px;
        }
        
        .detail-value {
          color: #64748b;
          font-weight: 500;
        }
        
        .premium-description {
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }
        
        .premium-section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .section-icon {
          color: #6366f1;
        }
        
        .premium-description-content {
          background: rgba(248, 250, 252, 0.3);
          border-radius: 12px;
          padding: 1.25rem;
        }
        
        .description-text {
          color: #4b5563;
          line-height: 1.7;
          margin: 0;
        }
        
        .premium-booking-card {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          top: 100px !important;
          transition: transform 0.3s ease;
        }
        
        .premium-booking-card:hover {
          transform: translateY(-5px);
        }
        
        .premium-booking-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 1.5rem;
        }
        
        .booking-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }
        
        .booking-icon {
          font-size: 1.2rem;
        }
        
        .premium-booking-body {
          padding: 2rem;
        }
        
        .premium-price-summary {
          background: rgba(99, 102, 241, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(99, 102, 241, 0.1);
        }
        
        .booking-price {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .booking-availability {
          color: #64748b;
          font-weight: 500;
        }
        
        .premium-book-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          padding: 15px;
          color: white;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .premium-book-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
          color: white;
        }
        
        .btn-icon {
          font-size: 1.2rem;
        }
        
        .premium-payment-note {
          background: rgba(251, 191, 36, 0.1);
          border-radius: 10px;
          padding: 12px;
          border: 1px solid rgba(251, 191, 36, 0.2);
        }
        
        .payment-text {
          color: #92400e;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .payment-icon {
          color: #f59e0b;
        }
        
        .premium-features {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .features-title {
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .features-icon {
          color: #8b5cf6;
        }
        
        .premium-features-list {
          margin: 0;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
        }
        
        .feature-check {
          width: 20px;
          height: 20px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.75rem;
        }
        
        .feature-text {
          color: #4b5563;
          font-weight: 500;
        }
        
        .premium-booking-note {
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          background: rgba(239, 68, 68, 0.05);
          border-radius: 10px;
          padding: 12px;
          border: 1px solid rgba(239, 68, 68, 0.1);
        }
        
        .booking-note-text {
          color: #b91c1c;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        .note-icon {
          color: #ef4444;
        }
        
        @media (max-width: 768px) {
          .premium-card-body {
            padding: 1.5rem;
          }
          
          .premium-title {
            font-size: 1.75rem;
          }
          
          .premium-price {
            font-size: 1.5rem;
          }
          
          .premium-booking-card {
            margin-top: 2rem;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
