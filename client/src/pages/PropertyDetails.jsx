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
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
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
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/find-property" variant="primary">
          ← Back to Properties
        </Button>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Property not found</Alert>
        <Button as={Link} to="/find-property" variant="primary">
          ← Back to Properties
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="mb-4">
            <Button as={Link} to="/find-property" variant="outline-secondary" className="mb-3">
              ← Back to Properties
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          {/* Property Images Carousel */}
          <Card className="mb-4">
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
          <Card>
            <Card.Body>
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

              <h1 className="mb-3">{property.title}</h1>

              <div className="mb-4">
                <h4 className="text-primary mb-2">
                  {formatPrice(property.price, property.rentType[0])}
                </h4>
                <p className="text-muted mb-0">
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
                <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {property.description}
                </p>
              </div>

              {/* Property Owner details removed as requested */}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Booking Card */}
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📋 Book This Property</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="text-primary mb-2">
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
                <ul className="list-unstyled">
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

          {/* Contact Information and Property Owner details removed as requested */}
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyDetails;
