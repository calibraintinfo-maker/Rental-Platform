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
      <div className="loading-state">
        <Container className="py-4">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <h4>Loading Property Details</h4>
            <p>Please wait...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <Container className="py-4">
          <Alert variant="danger">{error}</Alert>
          <Button as={Link} to="/find-property" variant="primary">
            ← Back to Properties
          </Button>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-state">
        <Container className="py-4">
          <Alert variant="warning">Property not found</Alert>
          <Button as={Link} to="/find-property" variant="primary">
            ← Back to Properties
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="property-page">
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
                  <Badge bg="primary" className="me-2">{property.category}</Badge>
                  {property.subtype && (
                    <Badge bg="secondary" className="me-2">{property.subtype}</Badge>
                  )}
                  {property.rentType.map(type => (
                    <Badge key={type} bg="info" className="me-1">{type}</Badge>
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
                <Row className="details-grid mb-4">
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-icon">📐</span>
                      <div>
                        <div className="detail-label">Size</div>
                        <div className="detail-value">{property.size}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-icon">📞</span>
                      <div>
                        <div className="detail-label">Contact</div>
                        <div className="detail-value">{property.contact}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-icon">🏷️</span>
                      <div>
                        <div className="detail-label">Category</div>
                        <div className="detail-value">{property.category}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <div>
                        <div className="detail-label">Rent Types</div>
                        <div className="detail-value">{property.rentType.join(', ')}</div>
                      </div>
                    </div>
                  </Col>
                  {property.subtype && (
                    <Col md={6}>
                      <div className="detail-item">
                        <span className="detail-icon">🏢</span>
                        <div>
                          <div className="detail-label">Type</div>
                          <div className="detail-value">{property.subtype}</div>
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col md={6}>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div>
                        <div className="detail-label">Added</div>
                        <div className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </Col>
                </Row>

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
                <Card.Header className="booking-header">
                  <h4>📋 Book This Property</h4>
                </Card.Header>
                <Card.Body>
                  {/* Price Section */}
                  <div className="price-section text-center mb-4">
                    <h3 className="price">{formatPrice(property.price, property.rentType[0])}</h3>
                    <p className="availability">Available for {property.rentType.join(', ')} rental</p>
                  </div>

                  {/* Book Button */}
                  <Button 
                    as={Link} 
                    to={`/book/${property._id}`}
                    className="book-button w-100 mb-3"
                    size="lg"
                  >
                    📅 Book Now
                  </Button>

                  {/* Payment Info */}
                  <div className="payment-info text-center mb-4">
                    <small>💳 Payment: On Spot Only</small>
                  </div>

                  {/* Features */}
                  <div className="features">
                    <h6 className="features-title">✨ Property Features</h6>
                    <ul className="features-list">
                      <li>✓ {property.category} Space</li>
                      <li>✓ {property.size} Area</li>
                      <li>✓ {property.rentType.join('/')} Rental</li>
                      <li>✓ Direct Owner Contact</li>
                    </ul>
                  </div>

                  {/* Warning */}
                  <div className="booking-warning text-center">
                    <small>⚠️ Complete your profile before booking</small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ CLEAN, PROFESSIONAL STYLING */}
      <style jsx>{`
        .property-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding-top: 100px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .loading-state,
        .error-state {
          min-height: 100vh;
          padding-top: 120px;
          background: #f8f9fa;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .back-button {
          background: #fff;
          border: 1px solid #dee2e6;
          color: #6c757d;
          border-radius: 8px;
          padding: 10px 20px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
          color: #495057;
        }

        .image-card {
          border: none;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        .property-carousel {
          border-radius: 12px;
          overflow: hidden;
        }

        .property-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .no-image {
          height: 400px;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          border: 2px dashed #dee2e6;
          border-radius: 12px;
        }

        .no-image-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .info-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .property-title {
          font-size: 2rem;
          font-weight: 700;
          color: #212529;
          margin-bottom: 1rem;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6c757d;
          font-size: 1rem;
        }

        .location-icon {
          color: #007bff;
        }

        .details-grid {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
        }

        .detail-icon {
          font-size: 1.5rem;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #6c757d;
          font-weight: 500;
        }

        .detail-value {
          font-size: 1rem;
          color: #212529;
          font-weight: 600;
        }

        .description {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #dee2e6;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 1rem;
        }

        .description-content {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .description-content p {
          color: #495057;
          line-height: 1.6;
          margin: 0;
        }

        .booking-sidebar {
          position: sticky;
          top: 120px;
        }

        .booking-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .booking-header {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border-bottom: none;
          border-radius: 12px 12px 0 0 !important;
        }

        .booking-header h4 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .price-section {
          background: rgba(0,123,255,0.1);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .price {
          font-size: 1.75rem;
          font-weight: 700;
          color: #007bff;
          margin: 0;
        }

        .availability {
          color: #6c757d;
          margin: 0;
          font-size: 0.9rem;
        }

        .book-button {
          background: linear-gradient(135deg, #28a745, #20c997);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.2s;
        }

        .book-button:hover {
          background: linear-gradient(135deg, #218838, #1e9b8a);
          transform: translateY(-1px);
        }

        .payment-info {
          background: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 8px;
          padding: 12px;
          color: #856404;
        }

        .features {
          border-top: 1px solid #dee2e6;
          padding-top: 1.5rem;
        }

        .features-title {
          font-weight: 600;
          color: #212529;
          margin-bottom: 1rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }

        .features-list li {
          padding: 6px 0;
          color: #495057;
          font-weight: 500;
        }

        .booking-warning {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 12px;
          color: #721c24;
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
          .property-page {
            padding-top: 80px;
          }

          .property-title {
            font-size: 1.5rem;
          }

          .property-image {
            height: 250px;
          }

          .details-grid {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
