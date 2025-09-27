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

  // Helper function to format price correctly
  const getFormattedPrice = (price, rentType) => {
    if (!price) return '0';
    // Remove any existing currency symbol and clean the price
    const cleanPrice = String(price).replace('₹', '').replace(',', '');
    return cleanPrice;
  };

  if (loading) {
    return (
      <div className="elite-loading-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="loading-title">Loading property details</h3>
          <p className="loading-subtitle">This won't take long</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="elite-error-screen">
        <Container>
          <div className="error-container">
            <Alert variant="danger" className="elite-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="elite-button primary">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="elite-error-screen">
        <Container>
          <div className="error-container">
            <Alert variant="warning" className="elite-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="elite-button primary">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="elite-property-details">
      {/* Navigation Header */}
      <div className="elite-header">
        <Container>
          <Button as={Link} to="/find-property" className="nav-back-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Properties
          </Button>
        </Container>
      </div>

      <Container className="elite-container">
        <div className="elite-grid">
          {/* Main Content */}
          <div className="content-section">
            {/* Image Gallery */}
            <div className="gallery-wrapper">
              {property.images && property.images.length > 0 ? (
                <div className="image-gallery">
                  <Carousel className="elite-carousel" indicators={false}>
                    {property.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div className="image-slide">
                          <img 
                            src={getImageUrl(image)} 
                            alt={`${property.title} - ${index + 1}`}
                            className="property-image"
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="image-counter">
                    1 / {property.images.length}
                  </div>
                </div>
              ) : property.image ? (
                <div className="image-gallery">
                  <div className="image-slide">
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="property-image"
                    />
                  </div>
                </div>
              ) : (
                <div className="no-image-placeholder">
                  <div className="placeholder-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <h4>No images available</h4>
                    <p>This property doesn't have any images yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="property-info">
              {/* Property Tags */}
              <div className="property-tags">
                <span className="tag tag-primary">{property.category}</span>
                {property.subtype && (
                  <span className="tag tag-secondary">{property.subtype}</span>
                )}
                {property.rentType.map(type => (
                  <span key={type} className="tag tag-accent">{type}</span>
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

              {/* Property Details Grid */}
              <div className="details-section">
                <h3 className="section-title">Property Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                        <path d="M8 21V5a2 2 0 012-2h4a2 2 0 012 2v16"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">SIZE</span>
                      <span className="detail-value">{property.size}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">CONTACT</span>
                      <span className="detail-value">{property.contact}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">CATEGORY</span>
                      <span className="detail-value">{property.category}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">RENT TYPES</span>
                      <span className="detail-value">{property.rentType.join(', ')}</span>
                    </div>
                  </div>

                  {property.subtype && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 21h18"/>
                          <path d="M5 21V7l8-4v18"/>
                          <path d="M19 21V11l-6-4"/>
                        </svg>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">TYPE</span>
                        <span className="detail-value">{property.subtype}</span>
                      </div>
                    </div>
                  )}

                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">DATE ADDED</span>
                      <span className="detail-value">{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="description-section">
                <h3 className="section-title">Description</h3>
                <div className="description-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clean White Booking Sidebar with ONLY Button/Label Glass Effects */}
          <div className="sidebar-section">
            <div className="clean-booking-card">
              {/* Price Header with Glass Effect */}
              <div className="glass-price-header">
                <div className="glass-price-amount">₹{getFormattedPrice(property.price)}/month</div>
                <div className="glass-price-period">Available for {property.rentType.join(', ')} rental</div>
              </div>

              {/* Reserve Button with Glass Effect */}
              <div className="booking-body">
                <Button 
                  as={Link} 
                  to={`/book/${property._id}`}
                  className="glass-reserve-button"
                  size="lg"
                >
                  Reserve Property
                </Button>

                {/* Clean Payment Notice */}
                <div className="clean-payment-notice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <span>Payment processed on-site</span>
                </div>

                {/* Clean What's Included Section */}
                <div className="clean-included-section">
                  <h4 className="clean-included-title">What's included</h4>
                  <ul className="clean-included-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{property.category} space access</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{property.size} total area</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Flexible {property.rentType.join('/')} terms</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Direct owner communication</span>
                    </li>
                  </ul>
                </div>

                {/* Clean Profile Warning */}
                <div className="clean-profile-warning">
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

      {/* ✅ TOP 1% AGENCY STYLING - CLEAN WHITE CARD + VIOLET GLASS BUTTONS/LABELS ONLY */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .elite-property-details {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #fafafa;
          min-height: 100vh;
          padding-top: 72px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'rlig' 1, 'calt' 1;
        }

        /* Loading Screen */
        .elite-loading-screen {
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

        .loading-container {
          text-align: center;
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid #e4e4e7;
          border-top: 2px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 18px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 8px;
        }

        .loading-subtitle {
          font-size: 14px;
          color: #71717a;
          margin: 0;
        }

        /* Error Screen */
        .elite-error-screen {
          background: #fafafa;
          min-height: 100vh;
          padding-top: 120px;
        }

        .error-container {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
        }

        .elite-alert {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .elite-button.primary {
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .elite-button.primary:hover {
          background: #7c3aed;
          color: white;
          transform: translateY(-1px);
        }

        /* Header */
        .elite-header {
          background: rgba(250, 250, 250, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e4e4e7;
          padding: 12px 0;
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .nav-back-button {
          background: white;
          border: 1px solid #e4e4e7;
          color: #71717a;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-back-button:hover {
          border-color: #d4d4d8;
          color: #09090b;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        /* Main Layout */
        .elite-container {
          max-width: 1200px;
          padding: 64px 20px 80px;
        }

        .elite-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: start;
        }

        /* Gallery */
        .gallery-wrapper {
          margin-bottom: 40px;
        }

        .image-gallery {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          border: 1px solid #e4e4e7;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .elite-carousel .carousel-control-prev,
        .elite-carousel .carousel-control-next {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          color: #09090b;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.2s ease;
          backdrop-filter: blur(12px);
        }

        .elite-carousel .carousel-control-prev:hover,
        .elite-carousel .carousel-control-next:hover {
          background: white;
          color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .elite-carousel .carousel-control-prev {
          left: 16px;
        }

        .elite-carousel .carousel-control-next {
          right: 16px;
        }

        .image-slide {
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-counter {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(9, 9, 11, 0.8);
          backdrop-filter: blur(12px);
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .no-image-placeholder {
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f4f5;
          border: 2px dashed #e4e4e7;
          border-radius: 12px;
        }

        .placeholder-content {
          text-align: center;
          color: #71717a;
        }

        .placeholder-content svg {
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .placeholder-content h4 {
          font-size: 16px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 4px;
        }

        .placeholder-content p {
          font-size: 14px;
          margin: 0;
        }

        /* Property Info */
        .property-info {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .property-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .tag-primary {
          background: rgba(9, 9, 11, 0.1);
          color: #09090b;
          border-color: rgba(9, 9, 11, 0.2);
        }

        .tag-secondary {
          background: rgba(113, 113, 122, 0.1);
          color: #71717a;
          border-color: rgba(113, 113, 122, 0.2);
        }

        .tag-accent {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.2);
        }

        .property-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f4f4f5;
        }

        .property-title {
          font-size: 32px;
          font-weight: 700;
          color: #09090b;
          line-height: 1.2;
          margin-bottom: 12px;
          letter-spacing: -0.025em;
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
          color: #8b5cf6;
        }

        /* Details Section */
        .details-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f4f4f5;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 20px;
          letter-spacing: -0.025em;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #fafafa;
          border-radius: 8px;
          border: 1px solid #f4f4f5;
          transition: all 0.2s ease;
        }

        .detail-item:hover {
          background: #f4f4f5;
          border-color: #e4e4e7;
          transform: translateY(-1px);
        }

        .detail-icon {
          width: 36px;
          height: 36px;
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .detail-content {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 600;
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

        /* ✅ CLEAN WHITE CARD WITH VIOLET GLASS BUTTONS/LABELS ONLY */
        .sidebar-section {
          position: sticky;
          top: 120px;
        }

        .clean-booking-card {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        /* ✅ VIOLET GLASS PRICE HEADER ONLY */
        .glass-price-header {
          padding: 32px 24px;
          text-align: center;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
          backdrop-filter: blur(20px);
          color: white;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-price-amount {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.025em;
        }

        .glass-price-period {
          font-size: 14px;
          opacity: 0.95;
          font-weight: 500;
        }

        /* ✅ CLEAN WHITE BOOKING BODY */
        .booking-body {
          padding: 24px;
          background: white;
        }

        /* ✅ VIOLET GLASS RESERVE BUTTON ONLY */
        .glass-reserve-button {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          backdrop-filter: blur(20px);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }

        .glass-reserve-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
        }

        /* ✅ CLEAN PAYMENT NOTICE */
        .clean-payment-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          font-size: 13px;
          color: #92400e;
          font-weight: 500;
          margin-bottom: 20px;
        }

        /* ✅ CLEAN INCLUDED SECTION */
        .clean-included-section {
          border-top: 1px solid #f4f4f5;
          padding-top: 20px;
          margin-bottom: 20px;
        }

        .clean-included-title {
          font-size: 16px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 12px;
        }

        .clean-included-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .clean-included-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .clean-included-list svg {
          color: #10b981;
          flex-shrink: 0;
        }

        /* ✅ CLEAN PROFILE WARNING */
        .clean-profile-warning {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 12px;
          color: #b91c1c;
          font-weight: 500;
          line-height: 1.4;
        }

        .clean-profile-warning svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .elite-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .sidebar-section {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .elite-property-details {
            padding-top: 60px;
          }

          .elite-header {
            top: 60px;
          }

          .elite-container {
            padding: 48px 16px;
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

          .glass-price-header {
            padding: 24px 20px;
          }

          .glass-price-amount {
            font-size: 24px;
          }

          .booking-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
