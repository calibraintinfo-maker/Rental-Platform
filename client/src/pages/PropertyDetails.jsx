import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel } from 'react-bootstrap';
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

  // ✅ CLEAN, MINIMAL ICONS
  const Icon = ({ name, size = 16 }) => {
    const icons = {
      arrowLeft: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12,19 5,12 12,5"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      maximize: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,3 21,3 21,9"/>
          <polyline points="9,21 3,21 3,15"/>
          <line x1="21" y1="3" x2="14" y2="10"/>
          <line x1="3" y1="21" x2="10" y2="14"/>
        </svg>
      ),
      tag: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading property details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger">{error}</div>
        <Button as={Link} to="/find-property" variant="primary">
          <Icon name="arrowLeft" size={16} />
          <span className="ms-2">Back to Properties</span>
        </Button>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-4">
        <div className="alert alert-warning">Property not found</div>
        <Button as={Link} to="/find-property" variant="primary">
          <Icon name="arrowLeft" size={16} />
          <span className="ms-2">Back to Properties</span>
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-4">
        
        {/* Back Button */}
        <div className="mb-3">
          <Button 
            as={Link} 
            to="/find-property" 
            variant="outline-primary"
            size="sm"
          >
            <Icon name="arrowLeft" size={16} />
            <span className="ms-2">Back to Properties</span>
          </Button>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            
            {/* Property Images */}
            <Card className="mb-4">
              <div className="property-images">
                {property.images && property.images.length > 0 ? (
                  <Carousel>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img 
                          src={getImageUrl(image)} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="d-block w-100 property-image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : property.image ? (
                  <img 
                    src={getImageUrl(property.image)} 
                    alt={property.title}
                    className="d-block w-100 property-image"
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <Icon name="home" size={48} />
                    <p className="text-muted">No images available</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <Card.Body>
                
                {/* Badges */}
                <div className="mb-3">
                  <Badge bg="primary" className="me-2">{property.category}</Badge>
                  {property.subtype && (
                    <Badge bg="secondary" className="me-2">{property.subtype}</Badge>
                  )}
                  {property.rentType.map(type => (
                    <Badge key={type} bg="info" className="me-1">
                      {type}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="mb-3">{property.title}</h1>

                {/* Price */}
                <div className="mb-3">
                  <h4 className="text-success mb-1">
                    {formatPrice(property.price, property.rentType[0])}
                  </h4>
                  <div className="text-muted d-flex align-items-center">
                    <Icon name="mapPin" size={16} />
                    <span className="ms-1">
                      {property.address.street && `${property.address.street}, `}
                      {property.address.city}, {property.address.state} - {property.address.pincode}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="property-detail-item">
                      <Icon name="maximize" size={16} />
                      <span className="ms-2"><strong>Size:</strong> {property.size}</span>
                    </div>
                    <div className="property-detail-item">
                      <Icon name="tag" size={16} />
                      <span className="ms-2"><strong>Category:</strong> {property.category}</span>
                    </div>
                    {property.subtype && (
                      <div className="property-detail-item">
                        <Icon name="tag" size={16} />
                        <span className="ms-2"><strong>Type:</strong> {property.subtype}</span>
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    <div className="property-detail-item">
                      <Icon name="phone" size={16} />
                      <span className="ms-2"><strong>Contact:</strong> {property.contact}</span>
                    </div>
                    <div className="property-detail-item">
                      <Icon name="tag" size={16} />
                      <span className="ms-2"><strong>Rent Types:</strong> {property.rentType.join(', ')}</span>
                    </div>
                    <div className="property-detail-item">
                      <Icon name="calendar" size={16} />
                      <span className="ms-2"><strong>Added:</strong> {new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Col>
                </Row>

                {/* Description */}
                <div>
                  <h5 className="mb-3">Description</h5>
                  <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                    {property.description}
                  </p>
                </div>

              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Booking Card */}
            <Card className="booking-card">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0 d-flex align-items-center">
                  <Icon name="calendar" size={18} />
                  <span className="ms-2">Book This Property</span>
                </h5>
              </Card.Header>
              <Card.Body>
                
                {/* Price */}
                <div className="text-center mb-3">
                  <h3 className="text-success mb-1">
                    {formatPrice(property.price, property.rentType[0])}
                  </h3>
                  <small className="text-muted">
                    Available for {property.rentType.join(', ')} rental
                  </small>
                </div>

                {/* Book Button */}
                <Button 
                  as={Link} 
                  to={`/book/${property._id}`}
                  variant="success" 
                  size="lg"
                  className="w-100 mb-3"
                >
                  <Icon name="calendar" size={16} />
                  <span className="ms-2">Book Now</span>
                </Button>
                
                <div className="text-center mb-3">
                  <small className="text-muted">💳 Payment: On Spot Only</small>
                </div>

                {/* Features */}
                <div>
                  <h6 className="mb-2">✨ Property Features</h6>
                  <div className="feature-list">
                    <div className="feature-item">
                      <Icon name="check" size={14} />
                      <span className="ms-2">{property.category} Space</span>
                    </div>
                    <div className="feature-item">
                      <Icon name="check" size={14} />
                      <span className="ms-2">{property.size} Area</span>
                    </div>
                    <div className="feature-item">
                      <Icon name="check" size={14} />
                      <span className="ms-2">{property.rentType.join('/')} Rental</span>
                    </div>
                    <div className="feature-item">
                      <Icon name="check" size={14} />
                      <span className="ms-2">Direct Owner Contact</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <small className="text-warning">
                    ⚠️ Complete your profile before booking
                  </small>
                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .property-image {
          height: 400px;
          object-fit: cover;
        }
        
        .no-image-placeholder {
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .property-detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          color: #495057;
        }
        
        .booking-card {
          position: sticky;
          top: 20px;
        }
        
        .feature-list {
          border: 1px solid #e9ecef;
          border-radius: 0.375rem;
          padding: 1rem;
          background-color: #f8f9fa;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #28a745;
        }
        
        .feature-item:last-child {
          margin-bottom: 0;
        }
        
        @media (max-width: 991.98px) {
          .booking-card {
            position: static;
          }
        }
      `}</style>
    </>
  );
};

export default PropertyDetails;
