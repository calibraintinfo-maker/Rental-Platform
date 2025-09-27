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
      <div className="property-loading">
        <Container className="py-4">
          <div className="text-center">
            <div className="loading-spinner">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h4 className="loading-title">Loading Property Details</h4>
            <p className="loading-subtitle">Please wait while we fetch the information...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-error">
        <Container className="py-4">
          <Alert variant="danger" className="error-alert">{error}</Alert>
          <Button as={Link} to="/find-property" className="back-btn-error">
            ← Back to Properties
          </Button>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-error">
        <Container className="py-4">
          <Alert variant="warning" className="error-alert">Property not found</Alert>
          <Button as={Link} to="/find-property" className="back-btn-error">
            ← Back to Properties
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="property-details-page">
      {/* Hero Header */}
      <div className="property-header">
        <Container>
          <Button as={Link} to="/find-property" className="back-button">
            <i className="bi bi-arrow-left"></i>
            Back to Properties
          </Button>
        </Container>
      </div>

      <Container className="property-container">
        <Row className="property-main-row">
          {/* Left Column - Images & Details */}
          <Col xl={8} lg={7}>
            {/* Image Gallery */}
            <div className="image-gallery-section">
              {property.images && property.images.length > 0 ? (
                <div className="image-gallery-wrapper">
                  <Carousel className="property-carousel" indicators={false} controls={true}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div className="carousel-image-container">
                          <img 
                            src={getImageUrl(image)} 
                            alt={`${property.title} - Image ${index + 1}`}
                            className="property-main-image"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="image-counter-overlay">
                    <span className="image-counter">
                      1 / {property.images.length}
                    </span>
                  </div>
                </div>
              ) : property.image ? (
                <div className="single-image-container">
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="property-main-image"
                  />
                </div>
              ) : (
                <div className="no-image-placeholder">
                  <div className="no-image-content">
                    <i className="bi bi-image no-image-icon"></i>
                    <p className="no-image-text">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="property-info-section">
              {/* Property Header */}
              <div className="property-header-info">
                <div className="property-badges">
                  <Badge className="category-badge">{property.category}</Badge>
                  {property.subtype && (
                    <Badge className="subtype-badge">{property.subtype}</Badge>
                  )}
                  {property.rentType.map(type => (
                    <Badge key={type} className="rent-badge">
                      {type.toUpperCase()}
                    </Badge>
                  ))}
                </div>

                <h1 className="property-title">{property.title}</h1>

                <div className="property-location">
                  <i className="bi bi-geo-alt location-icon"></i>
                  <span className="location-text">
                    {property.address.street && `${property.address.street}, `}
                    {property.address.city}, {property.address.state} - {property.address.pincode}
                  </span>
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="property-details-grid">
                <Row className="details-row">
                  <Col md={6}>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="bi bi-rulers"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Size</span>
                        <span className="detail-value">{property.size}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="bi bi-telephone"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Contact</span>
                        <span className="detail-value">{property.contact}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="bi bi-tag"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{property.category}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="bi bi-cash-coin"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Rent Types</span>
                        <span className="detail-value">{property.rentType.join(', ')}</span>
                      </div>
                    </div>
                  </Col>
                  {property.subtype && (
                    <Col md={6}>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <i className="bi bi-building"></i>
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{property.subtype}</span>
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col md={6}>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="bi bi-calendar-plus"></i>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Added</span>
                        <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Description Section */}
              <div className="description-section">
                <h5 className="section-title">
                  <i className="bi bi-file-text section-icon"></i>
                  Description
                </h5>
                <div className="description-content">
                  <p className="description-text" style={{ whiteSpace: 'pre-line' }}>
                    {property.description}
                  </p>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Column - Booking Card */}
          <Col xl={4} lg={5}>
            <div className="booking-sidebar">
              <Card className="booking-card">
                <div className="booking-header">
                  <h4 className="booking-title">
                    <i className="bi bi-bookmark-check"></i>
                    Book This Property
                  </h4>
                </div>

                <Card.Body className="booking-body">
                  {/* Price Section */}
                  <div className="price-section">
                    <div className="price-display">
                      <span className="price-amount">
                        {formatPrice(property.price, property.rentType[0])}
                      </span>
                    </div>
                    <p className="price-subtitle">
                      Available for {property.rentType.join(', ')} rental
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="booking-actions">
                    <Button 
                      as={Link} 
                      to={`/book/${property._id}`}
                      className="book-now-btn"
                      size="lg"
                    >
                      <i className="bi bi-calendar-check"></i>
                      Book Now
                    </Button>
                  </div>

                  {/* Payment Info */}
                  <div className="payment-info">
                    <div className="payment-notice">
                      <i className="bi bi-credit-card payment-icon"></i>
                      <small className="payment-text">Payment: On Spot Only</small>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="features-section">
                    <h6 className="features-title">
                      <i className="bi bi-check-circle"></i>
                      Property Features
                    </h6>
                    <ul className="features-list">
                      <li className="feature-item">
                        <i className="bi bi-check-lg feature-check"></i>
                        <span>{property.category} Space</span>
                      </li>
                      <li className="feature-item">
                        <i className="bi bi-check-lg feature-check"></i>
                        <span>{property.size} Area</span>
                      </li>
                      <li className="feature-item">
                        <i className="bi bi-check-lg feature-check"></i>
                        <span>{property.rentType.join('/')} Rental</span>
                      </li>
                      <li className="feature-item">
                        <i className="bi bi-check-lg feature-check"></i>
                        <span>Direct Owner Contact</span>
                      </li>
                    </ul>
                  </div>

                  {/* Warning Notice */}
                  <div className="booking-warning">
                    <div className="warning-content">
                      <i className="bi bi-exclamation-triangle warning-icon"></i>
                      <small className="warning-text">
                        Complete your profile before booking
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ PROFESSIONAL INDUSTRY-STANDARD STYLING */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

        /* Global Styles */
        .property-details-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #fafbfc;
          min-height: 100vh;
          padding-top: 80px;
          line-height: 1.6;
        }

        /* Loading States */
        .property-loading {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          color: white;
          padding-top: 80px;
        }

        .loading-spinner .spinner-border {
          width: 3rem;
          height: 3rem;
          border-width: 0.3em;
          border-color: rgba(255,255,255,0.25);
          border-right-color: white;
          margin-bottom: 1.5rem;
        }

        .loading-title {
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .loading-subtitle {
          font-size: 1rem;
          opacity: 0.9;
        }

        /* Error States */
        .property-error {
          background: #fafbfc;
          min-height: 100vh;
          padding-top: 120px;
        }

        .error-alert {
          border-radius: 12px;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .back-btn-error {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .back-btn-error:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.3);
          color: white;
        }

        /* Header */
        .property-header {
          background: white;
          padding: 1.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 0;
        }

        .back-button {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          font-size: 0.95rem;
        }

        .back-button:hover {
          background: #e2e8f0;
          color: #334155;
          transform: translateX(-2px);
        }

        .back-button i {
          font-size: 1rem;
        }

        /* Main Container */
        .property-container {
          max-width: 1200px;
          padding: 2rem 1rem;
        }

        .property-main-row {
          gap: 2.5rem;
        }

        /* Image Gallery */
        .image-gallery-section {
          margin-bottom: 2rem;
        }

        .image-gallery-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .property-carousel {
          border-radius: 16px;
          overflow: hidden;
        }

        .carousel-image-container {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .property-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .single-image-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .image-counter-overlay {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .no-image-placeholder {
          height: 400px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #cbd5e1;
        }

        .no-image-content {
          text-align: center;
          color: #64748b;
        }

        .no-image-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .no-image-text {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
        }

        /* Carousel Controls */
        .property-carousel .carousel-control-prev,
        .property-carousel .carousel-control-next {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
          color: #374151;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.3s ease;
        }

        .property-carousel .carousel-control-prev:hover,
        .property-carousel .carousel-control-next:hover {
          background: white;
          color: #1f2937;
        }

        .property-carousel .carousel-control-prev {
          left: 20px;
        }

        .property-carousel .carousel-control-next {
          right: 20px;
        }

        /* Property Information */
        .property-info-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }

        .property-header-info {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .property-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .category-badge {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
        }

        .subtype-badge {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
        }

        .rent-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          border: none;
        }

        .property-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
        }

        .location-icon {
          color: #6366f1;
          font-size: 1.1rem;
        }

        /* Details Grid */
        .property-details-grid {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .details-row {
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem 0;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 2px;
        }

        .detail-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        /* Description */
        .description-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
        }

        .section-icon {
          color: #6366f1;
        }

        .description-content {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.25rem;
        }

        .description-text {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        /* Booking Sidebar */
        .booking-sidebar {
          position: sticky;
          top: 100px;
        }

        .booking-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          overflow: hidden;
        }

        .booking-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 1.5rem;
        }

        .booking-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .booking-body {
          padding: 2rem;
        }

        /* Price Section */
        .price-section {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%);
          border-radius: 12px;
          border: 1px solid rgba(99,102,241,0.1);
        }

        .price-display {
          margin-bottom: 0.5rem;
        }

        .price-amount {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .price-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0;
        }

        /* Action Button */
        .booking-actions {
          margin-bottom: 1.5rem;
        }

        .book-now-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 14px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .book-now-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16,185,129,0.3);
          color: white;
        }

        /* Payment Info */
        .payment-info {
          margin-bottom: 1.5rem;
        }

        .payment-notice {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .payment-icon {
          color: #d97706;
          font-size: 1rem;
        }

        .payment-text {
          color: #92400e;
          font-weight: 500;
          font-size: 0.875rem;
        }

        /* Features */
        .features-section {
          margin-bottom: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .features-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          color: #4b5563;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .feature-check {
          color: #10b981;
          font-weight: 600;
        }

        /* Warning Notice */
        .booking-warning {
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .warning-content {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .warning-icon {
          color: #dc2626;
          font-size: 1rem;
        }

        .warning-text {
          color: #b91c1c;
          font-weight: 500;
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .property-container {
            padding: 1.5rem 1rem;
          }
          
          .property-main-row {
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .property-details-page {
            padding-top: 70px;
          }
          
          .property-header {
            padding: 1rem 0;
          }
          
          .property-container {
            padding: 1rem 0.5rem;
          }
          
          .property-info-section {
            padding: 1.5rem;
          }
          
          .property-title {
            font-size: 1.5rem;
          }
          
          .carousel-image-container {
            height: 250px;
          }
          
          .booking-sidebar {
            position: static;
            top: auto;
            margin-top: 2rem;
          }
          
          .booking-body {
            padding: 1.5rem;
          }
          
          .price-amount {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .property-badges {
            justify-content: center;
          }
          
          .detail-item {
            padding: 0.75rem 0;
          }
          
          .property-details-grid {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
