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
      <div className="elite-loading">
        <Container>
          <div className="loading-content">
            <div className="elite-spinner"></div>
            <h3 className="loading-title">Loading Property</h3>
            <p className="loading-subtitle">Fetching details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="elite-error">
        <Container>
          <div className="error-content">
            <Alert variant="danger" className="elite-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="elite-back-btn">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="elite-error">
        <Container>
          <div className="error-content">
            <Alert variant="warning" className="elite-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="elite-back-btn">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="elite-property-page">
      {/* Navigation Bar */}
      <nav className="elite-nav">
        <Container>
          <Button as={Link} to="/find-property" className="elite-nav-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Properties
          </Button>
        </Container>
      </nav>

      <Container className="elite-container">
        <div className="elite-layout">
          {/* Main Content */}
          <div className="elite-main">
            {/* Image Gallery */}
            <section className="elite-gallery">
              {property.images && property.images.length > 0 ? (
                <div className="gallery-container">
                  <Carousel className="elite-carousel" indicators={false}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div className="image-wrapper">
                          <img 
                            src={getImageUrl(image)} 
                            alt={`${property.title} - ${index + 1}`}
                            className="elite-image"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="image-counter">
                    1/{property.images.length}
                  </div>
                </div>
              ) : property.image ? (
                <div className="gallery-container">
                  <div className="image-wrapper">
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="elite-image"
                    />
                  </div>
                </div>
              ) : (
                <div className="no-image">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <p>No images available</p>
                </div>
              )}
            </section>

            {/* Property Information */}
            <section className="elite-info">
              {/* Header */}
              <div className="info-header">
                <div className="badge-group">
                  <span className="elite-badge primary">{property.category}</span>
                  {property.subtype && (
                    <span className="elite-badge secondary">{property.subtype}</span>
                  )}
                  {property.rentType.map(type => (
                    <span key={type} className="elite-badge accent">{type}</span>
                  ))}
                </div>
                
                <h1 className="property-title">{property.title}</h1>
                
                <div className="location-info">
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
              <div className="details-grid">
                <Row>
                  <Col md={6}>
                    <div className="detail-card">
                      <div className="detail-icon size">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Size</span>
                        <span className="detail-value">{property.size}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-card">
                      <div className="detail-icon contact">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Contact</span>
                        <span className="detail-value">{property.contact}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-card">
                      <div className="detail-icon category">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                          <line x1="7" y1="7" x2="7.01" y2="7"/>
                        </svg>
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{property.category}</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="detail-card">
                      <div className="detail-icon rent">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Rent Types</span>
                        <span className="detail-value">{property.rentType.join(', ')}</span>
                      </div>
                    </div>
                  </Col>
                  {property.subtype && (
                    <Col md={6}>
                      <div className="detail-card">
                        <div className="detail-icon type">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18"/>
                            <path d="M5 21V7l8-4v18"/>
                            <path d="M19 21V11l-6-4"/>
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{property.subtype}</span>
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col md={6}>
                    <div className="detail-card">
                      <div className="detail-icon date">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div className="detail-text">
                        <span className="detail-label">Added</span>
                        <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Description */}
              <div className="description-section">
                <h3 className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Description
                </h3>
                <div className="description-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="elite-sidebar">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Book This Property</h3>
                <div className="price-display">
                  <span className="price">{formatPrice(property.price, property.rentType[0])}</span>
                  <span className="price-period">Available for {property.rentType.join(', ')} rental</span>
                </div>
              </div>

              <div className="booking-content">
                <Button 
                  as={Link} 
                  to={`/book/${property._id}`}
                  className="elite-book-btn"
                  size="lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Book Now
                </Button>

                <div className="payment-notice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Payment: On Spot Only
                </div>

                <div className="features-section">
                  <h4>Property Features</h4>
                  <ul className="features-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {property.category} Space
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {property.size} Area
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {property.rentType.join('/')} Rental
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Direct Owner Contact
                    </li>
                  </ul>
                </div>

                <div className="booking-warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Complete your profile before booking
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* ✅ WORLD-CLASS ENTERPRISE STYLING */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .elite-property-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #fafafa;
          min-height: 100vh;
          padding-top: 72px;
          color: #0a0a0a;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        /* Loading State */
        .elite-loading {
          background: #fafafa;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 72px;
        }

        .loading-content {
          text-align: center;
          max-width: 300px;
        }

        .elite-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid #f0f0f0;
          border-top: 2px solid #0a0a0a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 20px;
          font-weight: 600;
          color: #0a0a0a;
          margin-bottom: 8px;
        }

        .loading-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        /* Error State */
        .elite-error {
          background: #fafafa;
          min-height: 100vh;
          padding-top: 120px;
        }

        .error-content {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }

        .elite-alert {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 16px;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .elite-back-btn {
          background: #0a0a0a;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .elite-back-btn:hover {
          background: #333;
          color: white;
          transform: translateY(-1px);
        }

        /* Navigation */
        .elite-nav {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: rgba(250,250,250,0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e5e5e5;
          padding: 12px 0;
          z-index: 100;
        }

        .elite-nav-back {
          background: none;
          border: 1px solid #e5e5e5;
          color: #666;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .elite-nav-back:hover {
          border-color: #0a0a0a;
          color: #0a0a0a;
          background: #fff;
        }

        /* Main Layout */
        .elite-container {
          max-width: 1200px;
          padding: 80px 24px 60px;
        }

        .elite-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 60px;
          align-items: start;
        }

        .elite-main {
          min-width: 0;
        }

        /* Image Gallery */
        .elite-gallery {
          margin-bottom: 48px;
        }

        .gallery-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .elite-carousel {
          border-radius: 12px;
          overflow: hidden;
        }

        .image-wrapper {
          aspect-ratio: 16/10;
          overflow: hidden;
        }

        .elite-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .image-counter {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .no-image {
          aspect-ratio: 16/10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          color: #999;
          border: 1px dashed #ddd;
          border-radius: 12px;
        }

        .no-image svg {
          margin-bottom: 12px;
        }

        .no-image p {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }

        /* Carousel Controls */
        .elite-carousel .carousel-control-prev,
        .elite-carousel .carousel-control-next {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          color: #333;
          top: 50%;
          transform: translateY(-50%);
          border: 1px solid rgba(0,0,0,0.1);
        }

        .elite-carousel .carousel-control-prev {
          left: 16px;
        }

        .elite-carousel .carousel-control-next {
          right: 16px;
        }

        /* Property Information */
        .elite-info {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .info-header {
          margin-bottom: 40px;
        }

        .badge-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .elite-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .elite-badge.primary {
          background: #0a0a0a;
          color: white;
        }

        .elite-badge.secondary {
          background: #f0f0f0;
          color: #666;
        }

        .elite-badge.accent {
          background: #e6f7ff;
          color: #0066cc;
        }

        .property-title {
          font-size: 32px;
          font-weight: 700;
          color: #0a0a0a;
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 16px;
          font-weight: 500;
        }

        /* Details Grid */
        .details-grid {
          margin-bottom: 40px;
        }

        .detail-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8f8f8;
          border-radius: 8px;
          margin-bottom: 16px;
          transition: background 0.2s ease;
        }

        .detail-card:hover {
          background: #f0f0f0;
        }

        .detail-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .detail-icon.size { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .detail-icon.contact { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .detail-icon.category { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
        .detail-icon.rent { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
        .detail-icon.type { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .detail-icon.date { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }

        .detail-text {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 500;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #0a0a0a;
        }

        /* Description */
        .description-section {
          padding-top: 40px;
          border-top: 1px solid #e5e5e5;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 600;
          color: #0a0a0a;
          margin-bottom: 16px;
        }

        .description-content {
          background: #f8f8f8;
          padding: 24px;
          border-radius: 8px;
        }

        .description-content p {
          font-size: 15px;
          line-height: 1.6;
          color: #333;
          margin: 0;
        }

        /* Sidebar */
        .elite-sidebar {
          position: sticky;
          top: 160px;
        }

        .booking-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .booking-header {
          padding: 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .booking-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #0a0a0a;
          margin-bottom: 16px;
        }

        .price-display {
          text-align: center;
        }

        .price {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #0a0a0a;
          margin-bottom: 4px;
        }

        .price-period {
          font-size: 14px;
          color: #666;
        }

        .booking-content {
          padding: 24px;
        }

        .elite-book-btn {
          width: 100%;
          background: #0a0a0a;
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }

        .elite-book-btn:hover {
          background: #333;
          color: white;
          transform: translateY(-1px);
        }

        .payment-notice {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #92400e;
          margin-bottom: 24px;
        }

        .features-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #0a0a0a;
          margin-bottom: 16px;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 14px;
          color: #333;
        }

        .features-list svg {
          color: #10b981;
          flex-shrink: 0;
        }

        .booking-warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #991b1b;
          font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .elite-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .elite-sidebar {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .elite-property-page {
            padding-top: 60px;
          }

          .elite-nav {
            top: 60px;
          }

          .elite-container {
            padding: 60px 16px 40px;
          }

          .elite-info {
            padding: 24px;
          }

          .property-title {
            font-size: 24px;
          }

          .detail-card {
            padding: 16px;
          }

          .booking-header,
          .booking-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
