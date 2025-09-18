import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/api';

const PropertyCard = ({ property, showOwner = false }) => {
  // Get the first image from images array, or fallback to single image field
  const displayImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : property.image;

  return (
    <Card className="property-card h-100">
      <Card.Img 
        variant="top" 
        src={getImageUrl(displayImage)} 
        className="property-image"
        alt={property.title}
      />
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="primary" className="me-2">{property.category}</Badge>
          {property.subtype && (
            <Badge bg="secondary">{property.subtype}</Badge>
          )}
          {property.images && property.images.length > 1 && (
            <Badge bg="info" className="ms-1">📸 {property.images.length}</Badge>
          )}
        </div>
        
        <Card.Title className="h5">{property.title}</Card.Title>
        
        <Card.Text className="text-muted mb-2">
          📍 {property.address.city}, {property.address.state}
        </Card.Text>
        
        <Card.Text className="text-truncate" style={{ maxHeight: '3rem' }}>
          {property.description}
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="price-badge">
              {formatPrice(property.price, property.rentType[0])}
            </span>
            <small className="text-muted">📐 {property.size}</small>
          </div>
          
          {showOwner && property.ownerId && (
            <small className="text-muted d-block mb-2">
              👤 {property.ownerId.name}
            </small>
          )}
          
          <div className="d-flex gap-2">
            <Link 
              to={`/property/${property._id}`} 
              className="btn btn-outline-primary btn-sm flex-fill"
            >
              View Details
            </Link>
            <Link 
              to={`/book/${property._id}`} 
              className="btn btn-primary btn-sm flex-fill"
            >
              Book Now
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
