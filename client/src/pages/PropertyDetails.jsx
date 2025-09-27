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
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3 className="loading-text">Loading property details</h3>
          <p className="loading-subtext">This won't take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Container>
          <div className="error-content">
            <Alert variant="danger" className="modern-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="modern-button">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container">
        <Container>
          <div className="error-content">
            <Alert variant="warning" className="modern-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="modern-button">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="property-details-page">
      <Container className="py-4">
        {/* Back Button */}
        <Row className="mb-4">
          <Col>
            <Button 
              as={Link} 
              to="/find-property" 
              className="back-button"
            >
              ← Back to Properties
            </Button>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Main Content - Left Side */}
          <Col lg={8}>
            {/* Property Images */}
            <Card className="image-card mb-4">
              {property.images && property.images.length > 0 ? (
                <Carousel className="property-carousel">
                  {property.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${property.title} - Image ${index + 1}`}
                        className="property-image"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : property.image ? (
                <img 
                  src={getImageUrl(property.image)} 
                  alt={property.title}
                  className="property-image"
                />
              ) : (
                <div className="no-image">
                  <div className="no-image-icon">📷</div>
                  <p>No images available</p>
                </div>
              )}
            </Card>

            {/* Property Information */}
            <Card className="info-card">
              <Card.Body>
                {/* Badges */}
                <div className="badges mb-3">
                  <Badge className="custom-badge primary">{property.category}</Badge>
                  {property.subtype && (
                    <Badge className="custom-badge secondary">{property.subtype}</Badge>
                  )}
                  {property.rentType.map(type => (
                    <Badge key={type} className="custom-badge accent">{type}</Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="property-title">{property.title}</h1>

                {/* Location */}
                <div className="location mb-4">
                  <span className="location-icon">📍</span>
                  <span>
                    {property.address.street && `${property.address.street}, `}
                    {property.address.city}, {property.address.state} - {property.address.pincode}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="details-section mb-4">
                  <h3 className="section-title">Property Details</h3>
                  <Row className="details-grid">
                    <Col md={6}>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="detail-label">SIZE</div>
                          <div className="detail-value">{property.size}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="detail-label">CONTACT</div>
                          <div className="detail-value">{property.contact}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                            <line x1="7" y1="7" x2="7.01" y2="7"/>
                          </svg>
                        </div>
                        <div>
                          <div className="detail-label">CATEGORY</div>
                          <div className="detail-value">{property.category}</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                          </svg>
                        </div>
                        <div>
                          <div className="detail-label">RENT TYPES</div>
                          <div className="detail-value">{property.rentType.join(', ')}</div>
                        </div>
                      </div>
                    </Col>
                    {property.subtype && (
                      <Col md={6}>
                        <div className="detail-item">
                          <div className="detail-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 21h18"/>
                              <path d="M5 21V7l8-4v18"/>
                            </svg>
                          </div>
                          <div>
                            <div className="detail-label">TYPE</div>
                            <div className="detail-value">{property.subtype}</div>
                          </div>
                        </div>
                      </Col>
                    )}
                    <Col md={6}>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                        </div>
                        <div>
                          <div className="detail-label">DATE ADDED</div>
                          <div className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Description */}
                <div className="description">
                  <h5 className="section-title">📝 Description</h5>
                  <div className="description-content">
                    <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar - Right Side */}
          <Col lg={4}>
            <div className="booking-sidebar">
              <Card className="booking-card">
                <div className="booking-header">
                  <h3 className="price-amount">₹{formatPrice(property.price, property.rentType[0]).replace('₹', '')}/monthly</h3>
                  <p className="price-availability">Available for {property.rentType.join(', ')} rental</p>
                </div>
                <Card.Body>
                  {/* Reserve Button */}
                  <Button 
                    as={Link} 
                    to={`/book/${property._id}`}
                    className="reserve-button w-100 mb-3"
                    size="lg"
                  >
                    Reserve Property
                  </Button>

                  {/* Payment Info */}
                  <div className="payment-info text-center mb-4">
                    <small>💳 Payment processed on-site</small>
                  </div>

                  {/* Features */}
                  <div className="features">
                    <h6 className="features-title">What's included</h6>
                    <ul className="features-list">
                      <li>✓ {property.category} space access</li>
                      <li>✓ {property.size} total area</li>
                      <li>✓ Flexible {property.rentType.join('/')} terms</li>
                      <li>✓ Direct owner communication</li>
                    </ul>
                  </div>

                  {/* Warning */}
                  <div className="booking-warning text-center">
                    <small>⚠️ Complete your profile to proceed with booking</small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ WORLD-CLASS ENTERPRISE STYLING WITH YOUR EXACT COLOR THEME */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .property-details-page {
          min-height: 100vh;
          background: #ffffff;
          padding-top: 100px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .loading-container,
        .error-container {
          min-height: 100vh;
          padding-top: 120px;
          background: #ffffff;
        }

        .loading-content,
        .error-content {
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 22px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .loading-subtext {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .modern-alert {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          font-weight: 500;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .modern-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.39);
        }

        .modern-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(139, 92, 246, 0.5);
        }

        .back-button {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          border-radius: 10px;
          padding: 12px 20px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .back-button:hover {
          background: #f9fafb;
          border-color: #8b5cf6;
          color: #8b5cf6;
          transform: translateY(-1px);
        }

        .image-card {
          border: none;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          background: #ffffff;
        }

        .property-carousel {
          border-radius: 16px;
          overflow: hidden;
        }

        .property-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .no-image {
          height: 400px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
        }

        .no-image-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .info-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          background: #ffffff;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .custom-badge {
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-badge.primary {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          color: white;
        }

        .custom-badge.secondary {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
        }

        .custom-badge.accent {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .property-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 1rem;
          font-weight: 500;
        }

        .location-icon {
          color: #8b5cf6;
          font-size: 1.1rem;
        }

        .details-section {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .details-grid {
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(139, 92, 246, 0.1);
        }

        .detail-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
        }

        .detail-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.39);
        }

        .detail-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
        }

        .description {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .description-content {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .description-content p {
          color: #4b5563;
          line-height: 1.7;
          margin: 0;
          font-size: 15px;
        }

        .booking-sidebar {
          position: sticky;
          top: 120px;
        }

        .booking-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          background: #ffffff;
        }

        .booking-header {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .price-amount {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.5rem 0;
        }

        .price-availability {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
          font-weight: 500;
        }

        .reserve-button {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          padding: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px 0 rgba(31, 41, 55, 0.39);
        }

        .reserve-button:hover {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(31, 41, 55, 0.5);
          color: white;
        }

        .payment-info {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 12px;
          color: #92400e;
          font-weight: 500;
        }

        .features {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .features-title {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }

        .features-list li {
          padding: 6px 0;
          color: #4b5563;
          font-weight: 500;
          font-size: 14px;
        }

        .booking-warning {
          background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
          border: 1px solid #f87171;
          border-radius: 8px;
          padding: 12px;
          color: #b91c1c;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .booking-sidebar {
            position: static;
            top: auto;
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .property-details-page {
            padding-top: 80px;
          }

          .property-title {
            font-size: 1.75rem;
          }

          .property-image {
            height: 250px;
          }

          .details-section {
            padding: 1rem;
          }

          .detail-item {
            padding: 0.75rem;
          }

          .booking-header {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
