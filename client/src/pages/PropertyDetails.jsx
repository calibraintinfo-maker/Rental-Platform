import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { api, formatPrice, getImageUrl, handleApiError } from '../utils/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.properties.getById(id);
      setProperty(response.data || response);
    } catch (err) {
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop&auto=format&q=80';
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: '#7c3aed' }} />
        <p className="mt-3">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Property not found'}</p>
          <Button onClick={() => navigate('/find-property')} variant="primary">
            Back to Properties
          </Button>
        </Alert>
      </Container>
    );
  }

  const images = property.images || (property.image ? [property.image] : []);
  const currentImage = images[imageIndex] || '';

  return (
    <div className="property-details-page">
      <Container fluid className="property-container">
        {/* Back Button */}
        <div className="back-button-container">
          <Button
            variant="outline-primary"
            onClick={() => navigate('/find-property')}
            className="back-button"
          >
            ← Back to Properties
          </Button>
        </div>

        {/* Main Layout */}
        <div className="property-layout">
          {/* Left Column - Main Content */}
          <div className="main-content">
            {/* Hero Image Gallery */}
            <Card className="hero-image-card">
              <div className="hero-image-container">
                <img
                  src={getImageUrl(currentImage)}
                  alt={property.title || 'Property'}
                  onError={handleImageError}
                  className="hero-property-image"
                />
                
                {images.length > 1 && (
                  <>
                    <button className="nav-button nav-prev" onClick={prevImage}>
                      ‹
                    </button>
                    <button className="nav-button nav-next" onClick={nextImage}>
                      ›
                    </button>
                    <div className="image-indicator">
                      {imageIndex + 1} of {images.length}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Property Header */}
            <div className="property-header-section">
              <div className="property-tags">
                <Badge className="property-tag category">
                  🏷️ {property.category || 'Land'}
                </Badge>
                <Badge className="property-tag type">
                  📐 {property.subtype || 'Agricultural Land'}
                </Badge>
                <Badge className="property-tag rent">
                  🕒 {Array.isArray(property.rentType) ? property.rentType.join(', ') : (property.rentType || 'yearly')}
                </Badge>
              </div>

              <h1 className="property-title">{property.title || 'Premium Property'}</h1>
              
              <div className="property-location">
                <span className="location-icon">📍</span>
                <span>{property.address?.city || 'namakkal'}, {property.address?.state || 'Tamil nadu'} - {property.address?.zipCode || '123456'}</span>
              </div>

              <div className="property-price">
                {formatPrice(property.price, Array.isArray(property.rentType) ? property.rentType[0] : property.rentType)}
              </div>
              <p className="price-subtitle">Available for {Array.isArray(property.rentType) ? property.rentType.join(', ') : (property.rentType || 'yearly')} rental</p>
            </div>

            {/* Property Information Grid */}
            <Card className="info-card">
              <Card.Body>
                <h3 className="section-title">📊 Property Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">📐 SIZE</div>
                    <div className="info-value">{property.size || '10000'} sq ft</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">📞 CONTACT</div>
                    <div className="info-value">{property.contact || '9087654321'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">🏷️ CATEGORY</div>
                    <div className="info-value">{property.category || 'Land'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">🔧 TYPE</div>
                    <div className="info-value">{property.subtype || 'Agricultural Land'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">🕒 RENT TYPES</div>
                    <div className="info-value">{Array.isArray(property.rentType) ? property.rentType.join(', ') : (property.rentType || 'yearly')}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">📅 ADDED</div>
                    <div className="info-value">August 12, 2025</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Description */}
            <Card className="description-card">
              <Card.Body>
                <h3 className="section-title">📝 Description</h3>
                <p className="description-text">
                  {property.description || 'This is a prime agricultural land located in a strategic location, perfect for farming and cultivation. The property offers excellent accessibility and is ideal for various agricultural activities.'}
                </p>
              </Card.Body>
            </Card>

            {/* Property Owner */}
            <Card className="owner-card">
              <Card.Body>
                <h3 className="section-title">👤 Property Owner</h3>
                <div className="owner-info">
                  <div className="owner-avatar">
                    {(property.owner?.name || 'BHARANEEDHARAN K').charAt(0)}
                  </div>
                  <div className="owner-details">
                    <h4 className="owner-name">{property.owner?.name || 'BHARANEEDHARAN K'}</h4>
                    <div className="owner-contact">
                      <span className="contact-icon">✉️</span>
                      <span>{property.owner?.email || 'bharaneedharan.cb22@bitsathy.ac.in'}</span>
                    </div>
                    <div className="owner-contact">
                      <span className="contact-icon">📞</span>
                      <span>{property.owner?.phone || property.contact || '9087654321'}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="sidebar">
            {/* Booking Card */}
            <Card className="booking-card">
              <Card.Body>
                <h4 className="booking-title">📅 Book This Property</h4>
                <div className="booking-price">
                  {formatPrice(property.price, Array.isArray(property.rentType) ? property.rentType[0] : property.rentType)}
                </div>
                <p className="booking-subtitle">Available for {Array.isArray(property.rentType) ? property.rentType.join(', ') : (property.rentType || 'yearly')} rental</p>
                <Button className="book-button" size="lg">
                  📅 Book Now
                </Button>
                <div className="payment-info">
                  <span>💳</span>
                  <span>Payment: On Spot Only</span>
                </div>
              </Card.Body>
            </Card>

            {/* Property Features */}
            <Card className="features-card">
              <Card.Body>
                <h4 className="features-title">✨ Property Features</h4>
                <div className="features-list">
                  <div className="feature-item">
                    <span className="feature-icon">🌾</span>
                    <span className="feature-text">Land Space</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📐</span>
                    <span className="feature-text">{property.size || '10000'} Area</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🕒</span>
                    <span className="feature-text">{Array.isArray(property.rentType) ? property.rentType.join(', ') : (property.rentType || 'yearly')} Rental</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📞</span>
                    <span className="feature-text">Direct Owner Contact</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Warning Alert */}
            <Alert variant="warning" className="profile-alert">
              ⚠️ Complete your profile before booking
            </Alert>
          </div>
        </div>
      </Container>

      {/* ENHANCED PROFESSIONAL CSS STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .property-details-page {
          background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 2rem 0;
        }
        
        .property-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: #64748b;
          font-weight: 500;
        }
        
        /* BACK BUTTON */
        .back-button-container {
          margin-bottom: 2rem;
        }
        
        .back-button {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #7c3aed;
          border-radius: 16px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 700;
          color: #7c3aed;
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .back-button:hover {
          background: #7c3aed;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.3);
        }
        
        /* MAIN LAYOUT */
        .property-layout {
          display: grid;
          grid-template-columns: 2fr 420px;
          gap: 2.5rem;
          align-items: start;
        }
        
        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .sidebar {
          position: sticky;
          top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        /* ENHANCED CARDS */
        .hero-image-card,
        .info-card,
        .description-card,
        .owner-card,
        .booking-card,
        .features-card {
          border: none;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: saturate(180%) blur(20px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .hero-image-card:hover,
        .info-card:hover,
        .description-card:hover,
        .owner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
        }
        
        /* HERO IMAGE */
        .hero-image-container {
          position: relative;
          height: 400px;
          background: #f1f5f9;
          overflow: hidden;
        }
        
        .hero-property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .hero-image-card:hover .hero-property-image {
          transform: scale(1.05);
        }
        
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          font-size: 1.5rem;
          color: #7c3aed;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-button:hover {
          background: #7c3aed;
          color: white;
          transform: translateY(-50%) scale(1.1);
        }
        
        .nav-prev { left: 20px; }
        .nav-next { right: 20px; }
        
        .image-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        
        /* PROPERTY HEADER */
        .property-header-section {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: saturate(180%) blur(20px);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .property-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        
        .property-tag {
          font-size: 0.85rem;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          border: none;
          backdrop-filter: blur(10px);
        }
        
        .property-tag.category {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }
        
        .property-tag.type {
          background: linear-gradient(135deg, #10b981, #047857);
          color: white;
        }
        
        .property-tag.rent {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }
        
        .property-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 900;
          color: #111827;
          margin-bottom: 1rem;
          line-height: 1.2;
          text-transform: capitalize;
        }
        
        .property-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        
        .location-icon {
          color: #7c3aed;
          font-size: 1.25rem;
        }
        
        .property-price {
          font-size: clamp(1.8rem, 3vw, 2.25rem);
          font-weight: 900;
          color: #059669;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #059669, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .price-subtitle {
          color: #6b7280;
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        
        /* SECTION TITLES */
        .section-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        /* INFO GRID */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .info-item {
          background: rgba(248, 250, 252, 0.8);
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .info-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .info-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }
        
        /* DESCRIPTION */
        .description-text {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #374151;
          margin: 0;
        }
        
        /* OWNER INFO */
        .owner-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .owner-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
        }
        
        .owner-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
        }
        
        .owner-contact {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 4px;
          font-weight: 500;
        }
        
        .contact-icon {
          color: #7c3aed;
          font-size: 1rem;
        }
        
        /* SIDEBAR CARDS */
        .booking-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
          border: 2px solid rgba(124, 58, 237, 0.1);
        }
        
        .booking-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.25rem;
        }
        
        .booking-price {
          font-size: 1.75rem;
          font-weight: 900;
          color: #059669;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #059669, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .booking-subtitle {
          color: #6b7280;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        
        .book-button {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border: none;
          border-radius: 16px;
          font-weight: 700;
          width: 100%;
          margin-bottom: 1.25rem;
          padding: 16px;
          font-size: 1.125rem;
          box-shadow: 0 8px 32px rgba(5, 150, 105, 0.3);
          transition: all 0.3s ease;
        }
        
        .book-button:hover {
          background: linear-gradient(135deg, #047857 0%, #065f46 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(5, 150, 105, 0.4);
        }
        
        .payment-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .features-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.25rem;
        }
        
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .feature-icon {
          font-size: 1.25rem;
          color: #7c3aed;
        }
        
        .feature-text {
          font-size: 1rem;
          color: #374151;
          font-weight: 600;
        }
        
        .profile-alert {
          font-size: 0.95rem;
          padding: 1rem;
          border-radius: 16px;
          margin: 0;
          font-weight: 600;
          background: rgba(255, 243, 205, 0.9);
          border: 1px solid rgba(251, 191, 36, 0.3);
          color: #92400e;
        }
        
        /* RESPONSIVE DESIGN */
        @media (max-width: 1200px) {
          .property-layout {
            grid-template-columns: 1fr 380px;
            gap: 2rem;
          }
        }
        
        @media (max-width: 992px) {
          .property-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .sidebar {
            position: relative;
            top: auto;
            order: -1;
          }
          
          .property-container {
            padding: 0 1rem;
          }
          
          .hero-image-container {
            height: 300px;
          }
        }
        
        @media (max-width: 768px) {
          .property-details-page {
            padding: 1rem 0;
          }
          
          .property-header-section {
            padding: 1.5rem;
          }
          
          .back-button {
            width: 100%;
            text-align: center;
            padding: 12px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .nav-button {
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }
        }
        
        @media (max-width: 576px) {
          .property-container {
            padding: 0 0.5rem;
          }
          
          .owner-info {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .hero-image-container {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
