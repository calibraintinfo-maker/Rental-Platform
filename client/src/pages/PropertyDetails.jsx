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
    <div className="modern-property-page">
      {/* Header Navigation */}
      <div className="page-header">
        <Container>
          <Button as={Link} to="/find-property" className="nav-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Properties
          </Button>
        </Container>
      </div>

      <Container className="page-content">
        <div className="content-layout">
          {/* Main Content */}
          <div className="main-content">
            {/* Gallery Section */}
            <div className="gallery-section">
              {property.images && property.images.length > 0 ? (
                <div className="image-gallery">
                  <Carousel className="modern-carousel" indicators={false}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div className="image-container">
                          <img 
                            src={getImageUrl(image)} 
                            alt={`${property.title} - ${index + 1}`}
                            className="gallery-image"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="image-indicator">
                    {property.images.length > 1 && `1 / ${property.images.length}`}
                  </div>
                </div>
              ) : property.image ? (
                <div className="image-gallery">
                  <div className="image-container">
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="gallery-image"
                    />
                  </div>
                </div>
              ) : (
                <div className="no-image-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                  <h4>No images available</h4>
                  <p>This property doesn't have any images yet</p>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="property-info">
              {/* Tags */}
              <div className="property-tags">
                <span className="tag primary">{property.category}</span>
                {property.subtype && (
                  <span className="tag secondary">{property.subtype}</span>
                )}
                {property.rentType.map(type => (
                  <span key={type} className="tag accent">{type}</span>
                ))}
              </div>

              {/* Title & Location */}
              <div className="property-header">
                <h1 className="property-title">{property.title}</h1>
                <div className="property-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>
                    {property.address.street && `${property.address.street}, `}
                    {property.address.city}, {property.address.state} - {property.address.pincode}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="details-section">
                <h3 className="section-heading">Property Details</h3>
                <div className="details-grid">
                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                        <path d="M8 21V5a2 2 0 012-2h4a2 2 0 012 2v16"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Size</span>
                      <span className="detail-value">{property.size}</span>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Contact</span>
                      <span className="detail-value">{property.contact}</span>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">{property.category}</span>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Rent Types</span>
                      <span className="detail-value">{property.rentType.join(', ')}</span>
                    </div>
                  </div>

                  {property.subtype && (
                    <div className="detail-card">
                      <div className="detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 21h18"/>
                          <path d="M5 21V7l8-4v18"/>
                          <path d="M19 21V11l-6-4"/>
                        </svg>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Type</span>
                        <span className="detail-value">{property.subtype}</span>
                      </div>
                    </div>
                  )}

                  <div className="detail-card">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Date Added</span>
                      <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="description-section">
                <h3 className="section-heading">Description</h3>
                <div className="description-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="booking-widget">
              {/* Price Header */}
              <div className="price-header">
                <div className="price-display">
                  <span className="price-amount">{formatPrice(property.price, property.rentType[0])}</span>
                  <span className="price-period">Available for {property.rentType.join(', ')} rental</span>
                </div>
              </div>

              {/* Booking Form */}
              <div className="booking-form">
                <Button 
                  as={Link} 
                  to={`/book/${property._id}`}
                  className="primary-button"
                  size="lg"
                >
                  Reserve Property
                </Button>

                <div className="booking-notice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <span>Payment processed on-site</span>
                </div>

                <div className="divider"></div>

                {/* Property Highlights */}
                <div className="highlights">
                  <h4 className="highlights-title">What's included</h4>
                  <ul className="highlights-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {property.category} space access
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {property.size} total area
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Flexible {property.rentType.join('/')} terms
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Direct owner communication
                    </li>
                  </ul>
                </div>

                <div className="booking-warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span>Complete your profile to proceed with booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ✅ WORLD-CLASS ENTERPRISE STYLING */}
      <style jsx>{`
        @import url('https://rsms.me/inter/inter.css');

        * {
          box-sizing: border-box;
        }

        .modern-property-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fafafa;
          min-height: 100vh;
          padding-top: 72px;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'rlig' 1, 'calt' 1;
          line-height: 1.5;
        }

        /* Loading States */
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-content {
          text-align: center;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid #e4e4e7;
          border-radius: 50%;
          border-top-color: #09090b;
          animation: spin 0.8s ease infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 18px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 8px;
        }

        .loading-subtext {
          font-size: 14px;
          color: #71717a;
          margin: 0;
        }

        /* Error States */
        .error-container {
          background: #fafafa;
          min-height: 100vh;
          padding-top: 120px;
        }

        .error-content {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
        }

        .modern-alert {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 24px;
          font-size: 15px;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .modern-button {
          background: #09090b;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .modern-button:hover {
          background: #27272a;
          color: white;
          transform: translateY(-1px);
        }

        /* Header */
        .page-header {
          background: rgba(250, 250, 250, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e4e4e7;
          padding: 16px 0;
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .nav-back {
          background: transparent;
          border: 1px solid #e4e4e7;
          color: #71717a;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .nav-back:hover {
          border-color: #d4d4d8;
          color: #09090b;
          background: white;
        }

        /* Main Layout */
        .page-content {
          max-width: 1200px;
          padding: 80px 24px 80px;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 48px;
          align-items: start;
        }

        /* Gallery */
        .gallery-section {
          margin-bottom: 48px;
        }

        .image-gallery {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          border: 1px solid #e4e4e7;
        }

        .modern-carousel .carousel-control-prev,
        .modern-carousel .carousel-control-next {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          color: #09090b;
          top: 50%;
          transform: translateY(-50%);
        }

        .modern-carousel .carousel-control-prev {
          left: 16px;
        }

        .modern-carousel .carousel-control-next {
          right: 16px;
        }

        .image-container {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .no-image-state {
          aspect-ratio: 16/10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #71717a;
          text-align: center;
          padding: 48px;
        }

        .no-image-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .no-image-state h4 {
          font-size: 16px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 4px;
        }

        .no-image-state p {
          font-size: 14px;
          margin: 0;
        }

        /* Property Info */
        .property-info {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          padding: 32px;
        }

        .property-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .tag.primary {
          background: #09090b;
          color: white;
        }

        .tag.secondary {
          background: #f4f4f5;
          color: #71717a;
        }

        .tag.accent {
          background: #f0f9ff;
          color: #0284c7;
        }

        .property-header {
          margin-bottom: 32px;
        }

        .property-title {
          font-size: 32px;
          font-weight: 700;
          color: #09090b;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          color: #71717a;
          font-weight: 500;
        }

        .property-location svg {
          color: #09090b;
        }

        /* Details Section */
        .details-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #f4f4f5;
        }

        .section-heading {
          font-size: 20px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 20px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #f4f4f5;
        }

        .detail-icon {
          width: 36px;
          height: 36px;
          background: #09090b;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 500;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          margin-bottom: 2px;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #09090b;
        }

        /* Description */
        .description-section {
          margin-bottom: 32px;
        }

        .description-content {
          background: #fafafa;
          border: 1px solid #f4f4f5;
          border-radius: 8px;
          padding: 20px;
        }

        .description-content p {
          font-size: 15px;
          line-height: 1.6;
          color: #52525b;
          margin: 0;
        }

        /* Sidebar */
        .sidebar {
          position: sticky;
          top: 140px;
        }

        .booking-widget {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .price-header {
          padding: 24px;
          border-bottom: 1px solid #f4f4f5;
        }

        .price-display {
          text-align: center;
        }

        .price-amount {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 4px;
        }

        .price-period {
          font-size: 14px;
          color: #71717a;
          font-weight: 500;
        }

        .booking-form {
          padding: 24px;
        }

        .primary-button {
          width: 100%;
          background: #09090b;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          transition: all 0.15s ease;
        }

        .primary-button:hover {
          background: #27272a;
          color: white;
          transform: translateY(-1px);
        }

        .booking-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 6px;
          font-size: 13px;
          color: #92400e;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .divider {
          height: 1px;
          background: #f4f4f5;
          margin: 20px 0;
        }

        .highlights {
          margin-bottom: 20px;
        }

        .highlights-title {
          font-size: 16px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 12px;
        }

        .highlights-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .highlights-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          font-size: 14px;
          color: #52525b;
          font-weight: 500;
        }

        .highlights-list svg {
          color: #16a34a;
          flex-shrink: 0;
        }

        .booking-warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          font-size: 12px;
          color: #b91c1c;
          font-weight: 500;
          line-height: 1.4;
        }

        .booking-warning svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .sidebar {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .modern-property-page {
            padding-top: 60px;
          }

          .page-header {
            top: 60px;
          }

          .page-content {
            padding: 60px 16px;
          }

          .property-info {
            padding: 24px;
          }

          .property-title {
            font-size: 24px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .booking-widget {
            margin-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
