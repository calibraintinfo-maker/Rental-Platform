import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/api';

const PropertyCard = React.memo(({ 
  property, 
  showOwner = false,
  onViewDetails, 
  onBookNow 
}) => {
  const navigate = useNavigate();
  if (!property) return null;

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/350x200/f8f9fa/6c757d?text=Property+Image';
  };

  // ✅ REFINED: Rent type logic - cleaner implementation
  const getRentType = () => {
    const price = Number(property.price) || 0;
    return price > 100000 ? 'yearly' : 'monthly';
  };

  const getFormattedPrice = () => {
    const price = Number(property.price) || 0;
    return price.toLocaleString('en-IN');
  };

  // ✅ ENHANCED BADGES - Premium styling
  const renderPropertyDetails = () => {
    const residentialTypes = ["Villa", "Apartment", "House", "Studio", "Flat"];
    const details = [];

    if (property.subtype && residentialTypes.includes(property.subtype)) {
      if (property.bedrooms && property.bedrooms > 0) {
        details.push(
          <div 
            key="bedrooms" 
            className="premium-detail-badge bedroom-badge"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10"/>
              <path d="M5 20v2h14v-2"/>
            </svg>
            {property.bedrooms} BHK
          </div>
        );
      }
      if (property.bathrooms && property.bathrooms > 0) {
        details.push(
          <div 
            key="bathrooms" 
            className="premium-detail-badge bathroom-badge"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
              <line x1="10" y1="5" x2="8" y2="7"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="7" y1="19" x2="7" y2="21"/>
              <line x1="17" y1="19" x2="17" y2="21"/>
            </svg>
            {property.bathrooms} Bath
          </div>
        );
      }
    }

    if (property.size) {
      details.push(
        <div 
          key="area" 
          className="premium-detail-badge area-badge"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path d="M8 21V5a2 2 0 012-2h4a2 2 0 012 2v16"/>
          </svg>
          {property.size}
        </div>
      );
    }

    // ✅ ONLY 3 BADGES MAX - No overcrowding
    return details.slice(0, 3);
  };

  const handleViewDetailsClick = () => {
    if (onViewDetails) onViewDetails();
    else navigate(`/property/${property._id}`);
  };

  const handleBookNowClick = () => {
    if (onBookNow) onBookNow();
    else navigate(`/book/${property._id}`);
  };

  const isHighValue = Number(property.price) > 50000;

  return (
    <div className="spaced-property-card-wrapper">
      <Card className="spaced-elite-property-card">
        {/* ✅ RESTORED IMAGE SIZE - NO LIKE/SHARE BUTTONS */}
        <div className="spaced-image-container">
          <img
            src={getImageUrl(Array.isArray(property.images) ? property.images[0] : property.image)}
            alt={property.title || 'Property Image'}
            onError={handleImageError}
            className="spaced-property-image"
          />
          
          {/* ✅ CLEAN STATUS BADGES ONLY */}
          <div className="spaced-status-overlay">
            <div className="spaced-availability-badge">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              Available
            </div>
            {isHighValue && (
              <div className="spaced-premium-badge">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                Premium
              </div>
            )}
          </div>

          {/* ✅ SIMPLE PROPERTY TYPE */}
          <div className="spaced-property-type">
            <span>{property.category || 'Property'}</span>
          </div>
        </div>
        
        {/* ✅ RESTORED CARD BODY SIZE */}
        <Card.Body className="spaced-card-body">
          {/* ✅ TOP SECTION */}
          <div className="spaced-top-section">
            {/* ✅ LOCATION */}
            <div className="spaced-location">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="location-text">
                {property.address?.city || 'City'}, {property.address?.state || 'State'}
              </span>
              <div className="verified-dot">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
            </div>

            {/* ✅ TITLE */}
            <Card.Title className="spaced-property-title">
              {property.title || 'Premium Property'}
            </Card.Title>

            {/* ✅ DESCRIPTION */}
            <Card.Text className="spaced-description">
              {property.description || 'Luxury property with modern amenities and prime location. Experience comfort and elegance.'}
            </Card.Text>
          </div>

          {/* ✅ BADGES SECTION */}
          <div className="spaced-badges-section">
            {/* ✅ MAIN BADGES ROW */}
            <div className="spaced-main-badges">
              <div className="spaced-primary-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                {property.category || 'Property'} Rentals
              </div>
              
              <div className="spaced-area-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                </svg>
                {property.sqft || property.area || '1000'} sq ft
              </div>
            </div>
            
            {/* ✅ DETAIL BADGES ROW */}
            <div className="spaced-detail-badges">
              {renderPropertyDetails()}
            </div>
          </div>

          {/* ✅ SPACER */}
          <div className="spaced-card-spacer"></div>

          {/* ✅ PRICING */}
          <div className="spaced-pricing-container">
            <div className="spaced-pricing-content">
              <div className="spaced-price-row">
                <div className="spaced-price-main">
                  <span className="spaced-currency">₹</span>
                  <span className="spaced-amount">{getFormattedPrice()}</span>
                  <span className="spaced-period">/{getRentType()}</span>
                </div>
                <div className="spaced-status">
                  <div className="status-dot"></div>
                  <span className="status-text">Market Rate</span>
                </div>
              </div>

              <div className="spaced-availability">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Available for {getRentType()} booking</span>
                <span className="last-updated">Updated recently</span>
              </div>
            </div>
          </div>

          {/* ✅ ACTION BUTTONS */}
          <div className="spaced-actions">
            <Button
              className="spaced-view-button"
              onClick={handleViewDetailsClick}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>View Details</span>
            </Button>
            
            <Button
              className="spaced-book-button"
              onClick={handleBookNowClick}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H3a2 2 0 0 0-2 2v3c0 1 0 3 1.5 3S4 17 4 16.5v-1"/>
                <path d="M21 16.5c0 .5 0 2-1.5 2S18 17 18 16v-3a2 2 0 0 0-2-2h-6"/>
                <circle cx="12" cy="5" r="3"/>
              </svg>
              <span>Book Now</span>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* ✅ PERFECT TOP 1% AGENCY STYLING WITH PROPER SPACING */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .spaced-property-card-wrapper {
          height: 100%;
          display: flex;
          margin-bottom: 24px; /* ✅ PERFECT CARD SPACING */
          padding: 0 4px; /* ✅ ADDS HORIZONTAL BREATHING ROOM */
        }

        .spaced-elite-property-card {
          border-radius: 20px; /* ✅ RESTORED ORIGINAL SIZE */
          cursor: pointer;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 8px 32px rgba(139, 92, 246, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .spaced-elite-property-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.02) 0%, 
            rgba(168, 85, 247, 0.01) 50%,
            rgba(124, 58, 237, 0.02) 100%);
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .spaced-elite-property-card:hover {
          transform: translateY(-8px); /* ✅ RESTORED ORIGINAL HOVER */
          box-shadow: 
            0 20px 60px rgba(139, 92, 246, 0.15),
            0 8px 24px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(139, 92, 246, 0.3);
          background: rgba(255, 255, 255, 0.06);
        }

        .spaced-elite-property-card:hover::before {
          opacity: 1;
        }

        /* ✅ RESTORED IMAGE SECTION - ORIGINAL SIZE */
        .spaced-image-container {
          position: relative;
          height: 200px; /* ✅ RESTORED FROM 160px TO 200px */
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .spaced-property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: brightness(1.1) contrast(1.05) saturate(1.1);
        }

        .spaced-elite-property-card:hover .spaced-property-image {
          transform: scale(1.08);
          filter: brightness(1.2) contrast(1.1) saturate(1.2);
        }

        /* ✅ CLEAN STATUS OVERLAY */
        .spaced-status-overlay {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }

        .spaced-availability-badge {
          background: rgba(34, 197, 94, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .spaced-premium-badge {
          background: rgba(245, 158, 11, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .spaced-property-type {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
          border: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }

        .spaced-elite-property-card:hover .spaced-property-type {
          opacity: 1;
          transform: translateY(0);
        }

        /* ✅ RESTORED CARD BODY SIZE */
        .spaced-card-body {
          padding: 20px; /* ✅ RESTORED FROM 16px TO 20px */
          display: flex;
          flex-direction: column;
          flex: 1;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.08) 100%);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }

        .spaced-card-body::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.3) 50%, 
            transparent 100%);
        }

        .spaced-top-section {
          flex: 0 0 auto;
          margin-bottom: 16px; /* ✅ RESTORED SPACING */
        }

        .spaced-location {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 20px;
          width: fit-content;
          transition: all 0.3s ease;
          color: #8b5cf6;
        }

        .spaced-location:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.2);
          transform: translateY(-1px);
        }

        .location-text {
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .verified-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22c55e;
          margin-left: 4px;
        }

        .spaced-property-title {
          font-size: 18px; /* ✅ RESTORED ORIGINAL SIZE */
          font-weight: 800;
          margin-bottom: 10px;
          color: #0f172a;
          letter-spacing: -0.025em;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .spaced-description {
          color: #475569;
          margin-bottom: 16px;
          font-size: 13px; /* ✅ RESTORED SIZE */
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 500;
        }

        .spaced-badges-section {
          flex: 0 0 auto;
          margin-bottom: 16px;
        }

        .spaced-main-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .spaced-primary-badge {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          font-size: 11px;
          padding: 8px 14px;
          border-radius: 12px;
          font-weight: 700;
          text-transform: capitalize;
          box-shadow: 
            0 4px 16px rgba(139, 92, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .spaced-primary-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .spaced-area-badge {
          background: rgba(139, 92, 246, 0.08);
          color: #7c3aed;
          font-size: 10px;
          padding: 6px 10px;
          border-radius: 10px;
          font-weight: 700;
          border: 1px solid rgba(139, 92, 246, 0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .spaced-detail-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .premium-detail-badge {
          background: rgba(139, 92, 246, 0.06);
          color: #7c3aed;
          font-size: 10px;
          padding: 6px 10px;
          border-radius: 10px;
          font-weight: 700;
          border: 1px solid rgba(139, 92, 246, 0.15);
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .premium-detail-badge:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.25);
          transform: translateY(-1px);
        }

        .spaced-card-spacer {
          flex: 1;
          min-height: 12px;
        }

        /* ✅ RESTORED PRICING */
        .spaced-pricing-container {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.08) 0%, 
            rgba(139, 92, 246, 0.04) 50%,
            rgba(168, 85, 247, 0.08) 100%);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 18px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .spaced-pricing-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.6) 50%, 
            transparent 100%);
        }

        .spaced-pricing-container:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.12) 0%, 
            rgba(139, 92, 246, 0.06) 50%,
            rgba(168, 85, 247, 0.12) 100%);
          border-color: rgba(139, 92, 246, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
        }

        .spaced-pricing-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .spaced-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .spaced-price-main {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .spaced-currency {
          color: #8b5cf6;
          font-weight: 700;
          font-size: 16px;
          margin-right: 2px;
        }

        .spaced-amount {
          color: #8b5cf6;
          font-weight: 900;
          font-size: 22px; /* ✅ RESTORED SIZE */
          letter-spacing: -0.025em;
          font-feature-settings: 'tnum';
        }

        .spaced-period {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin-left: 4px;
        }

        .spaced-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          color: #22c55e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .spaced-availability {
          color: #8b5cf6;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          justify-content: space-between;
        }

        .last-updated {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 500;
        }

        /* ✅ RESTORED BUTTONS */
        .spaced-actions {
          display: flex;
          gap: 12px;
        }

        .spaced-view-button {
          flex: 1;
          border-radius: 12px;
          font-size: 12px;
          padding: 12px 16px; /* ✅ RESTORED PADDING */
          border: 1px solid rgba(139, 92, 246, 0.2);
          color: #7c3aed;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(139, 92, 246, 0.04);
          backdrop-filter: blur(8px);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          position: relative;
          overflow: hidden;
        }

        .spaced-view-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .spaced-view-button:hover::before {
          left: 100%;
        }

        .spaced-view-button:hover {
          background: rgba(139, 92, 246, 0.08);
          border-color: rgba(139, 92, 246, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.25);
          color: #6d28d9;
        }

        .spaced-book-button {
          flex: 1;
          border-radius: 12px;
          font-size: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 4px 16px rgba(139, 92, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          position: relative;
          overflow: hidden;
        }

        .spaced-book-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .spaced-book-button:hover::before {
          left: 100%;
        }

        .spaced-book-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
          color: white;
        }

        /* ✅ RESPONSIVE DESIGN */
        @media (max-width: 1200px) {
          .spaced-property-card-wrapper {
            margin-bottom: 20px;
            padding: 0 2px;
          }
        }

        @media (max-width: 768px) {
          .spaced-property-card-wrapper {
            margin-bottom: 16px;
            padding: 0;
          }

          .spaced-elite-property-card {
            border-radius: 16px;
          }

          .spaced-image-container {
            height: 180px;
          }

          .spaced-card-body {
            padding: 16px;
          }

          .spaced-property-title {
            font-size: 16px;
          }

          .spaced-description {
            font-size: 12px;
          }

          .spaced-actions {
            gap: 10px;
          }

          .spaced-view-button,
          .spaced-book-button {
            font-size: 11px;
            padding: 10px 14px;
          }
        }

        /* ✅ PERFECT GRID SPACING */
        @media (min-width: 1400px) {
          .spaced-property-card-wrapper {
            margin-bottom: 28px; /* ✅ EXTRA SPACE ON LARGE SCREENS */
            padding: 0 6px;
          }
        }
      `}</style>
    </div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
