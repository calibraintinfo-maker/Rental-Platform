import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, handleApiError, formatPrice, getImageUrl } from '../utils/api';
import CustomCalendar from '../components/CustomCalendar';

const BookProperty = () => {
  const { propertyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    bookingType: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  useEffect(() => {
    fetchProperty();
    checkProfileComplete();
    fetchBookedDates();
  }, [propertyId]);

  const fetchBookedDates = async () => {
    try {
      const res = await api.properties.getBookedDates(propertyId);
      setBookedRanges(res.data.data || []);
    } catch (err) {
      // Ignore error, just show all dates
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await api.properties.getById(propertyId);
      setProperty(response.data);
      
      // Set default booking type if only one available
      if (response.data.rentType.length === 1) {
        setFormData(prev => ({
          ...prev,
          bookingType: response.data.rentType[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const checkProfileComplete = async () => {
    try {
      const response = await api.user.checkProfileComplete();
      if (!response.data.profileComplete) {
        setProfileIncomplete(true);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePrice = () => {
    if (!property || !formData.fromDate || !formData.toDate || !formData.bookingType) {
      return 0;
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const timeDiff = to.getTime() - from.getTime();

    switch (formData.bookingType) {
      case 'hourly':
        const hours = Math.ceil(timeDiff / (1000 * 3600));
        return property.price * Math.max(1, hours);
      case 'monthly':
        const months = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
        return property.price * Math.max(1, months);
      case 'yearly':
        const years = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365));
        return property.price * Math.max(1, years);
      default:
        return property.price;
    }
  };

  const validateForm = () => {
    if (!formData.fromDate) {
      setError('Please select a start date');
      return false;
    }

    if (!formData.toDate) {
      setError('Please select an end date');
      return false;
    }

    if (!formData.bookingType) {
      setError('Please select a booking type');
      return false;
    }

    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const now = new Date();

    if (fromDate < now.setHours(0, 0, 0, 0)) {
      setError('Start date cannot be in the past');
      return false;
    }

    if (fromDate >= toDate) {
      setError('End date must be after start date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        propertyId,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        bookingType: formData.bookingType,
        notes: formData.notes
      };

      const response = await api.bookings.create(bookingData);
      
      // Redirect to bookings page with success message
      navigate('/my-bookings', { 
        state: { message: 'Booking created successfully!' } 
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = handleApiError(error);
      
      if (errorMessage.includes('profile')) {
        setProfileIncomplete(true);
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="elite-booking-page">
        <div className="elite-loading-screen">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading booking details</h3>
            <p className="loading-subtitle">This won't take long</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="elite-booking-page">
        <Container className="elite-container">
          <div className="error-container">
            <Alert className="elite-alert danger">Property not found</Alert>
            <Button as={Link} to="/find-property" className="elite-button primary">
              ← Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (profileIncomplete) {
    return (
      <div className="elite-booking-page">
        <Container className="elite-container">
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="profile-incomplete-card">
                <div className="profile-incomplete-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h3 className="profile-incomplete-title">Complete Your Profile</h3>
                  <p className="profile-incomplete-text">Complete your profile before booking properties to ensure a smooth experience.</p>
                  <Button as={Link} to="/profile" className="glass-complete-profile-button">
                    Complete Profile
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <div className="elite-booking-page">
      {/* Navigation Header */}
      <div className="elite-header">
        <Container>
          <Button as={Link} to={`/property/${propertyId}`} className="nav-back-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Property Details
          </Button>
        </Container>
      </div>

      <Container className="elite-container">
        <Row className="elite-grid">
          <Col lg={8}>
            <div className="booking-form-card">
              <div className="glass-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Book Property</span>
              </div>
              
              <div className="card-body">
                {error && (
                  <Alert className="elite-alert danger">{error}</Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <div className="form-group">
                        <label className="form-label">Select Booking Dates *</label>
                        <div className="calendar-wrapper">
                          <CustomCalendar
                            bookedRanges={bookedRanges}
                            value={formData.fromDate && formData.toDate ? [new Date(formData.fromDate), new Date(formData.toDate)] : null}
                            onChange={range => {
                              if (Array.isArray(range)) {
                                setFormData({
                                  ...formData,
                                  fromDate: range[0].toISOString().split('T')[0],
                                  toDate: range[1].toISOString().split('T')[0]
                                });
                              }
                            }}
                            minDate={new Date()}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="form-group">
                    <label className="form-label">Booking Type *</label>
                    <select
                      name="bookingType"
                      value={formData.bookingType}
                      onChange={handleInputChange}
                      required
                      className="elite-select"
                    >
                      <option value="">Select booking type</option>
                      {property.rentType.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price, type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Notes (Optional)</label>
                    <textarea
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or notes for the owner"
                      className="elite-textarea"
                    />
                  </div>

                  {/* User Information Card */}
                  <div className="user-info-card">
                    <div className="user-info-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>Your Information</span>
                    </div>
                    <div className="user-info-grid">
                      <div className="user-info-item">
                        <span className="info-label">Name</span>
                        <span className="info-value">{user?.name}</span>
                      </div>
                      <div className="user-info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{user?.email}</span>
                      </div>
                      <div className="user-info-item">
                        <span className="info-label">Contact</span>
                        <span className="info-value">{user?.contact}</span>
                      </div>
                      <div className="user-info-item">
                        <span className="info-label">Address</span>
                        <span className="info-value">{user?.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="submit-button-wrapper">
                    <Button 
                      type="submit" 
                      className="glass-confirm-button"
                      disabled={submitting || !totalPrice}
                    >
                      {submitting ? (
                        <>
                          <div className="button-spinner"></div>
                          Creating Booking...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            {/* Property Summary Sidebar */}
            <div className="property-summary-card">
              <div className="glass-summary-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                <span>Property Summary</span>
              </div>
              
              <div className="summary-body">
                <img 
                  src={getImageUrl(property.image)} 
                  alt={property.title}
                  className="property-summary-image"
                />
                
                <h6 className="property-summary-title">{property.title}</h6>
                <div className="property-summary-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{property.address.city}, {property.address.state}</span>
                </div>
                <div className="property-summary-details">
                  <span className="detail-tag">{property.size}</span>
                  <span className="detail-tag">{property.category}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="pricing-section">
                  <h6 className="section-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                    </svg>
                    Pricing
                  </h6>
                  <div className="pricing-item">
                    <span className="pricing-label">Base Price:</span>
                    <span className="pricing-value">{formatPrice(property.price, formData.bookingType || property.rentType[0])}</span>
                  </div>
                  {totalPrice > 0 && (
                    <div className="pricing-item total">
                      <span className="pricing-label">Total Amount:</span>
                      <span className="pricing-value total-amount">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="summary-divider"></div>

                <div className="booking-details-section">
                  <h6 className="section-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11H3a2 2 0 0 0-2 2v3c0 1 0 3 1.5 3S4 17 4 16.5v-1"/>
                      <path d="M21 16.5c0 .5 0 2-1.5 2S18 17 18 16v-3a2 2 0 0 0-2-2h-6"/>
                      <circle cx="12" cy="5" r="3"/>
                    </svg>
                    Booking Details
                  </h6>
                  {formData.fromDate && (
                    <div className="booking-detail-item">
                      <span className="detail-label">Start:</span>
                      <span className="detail-value">{new Date(formData.fromDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {formData.toDate && (
                    <div className="booking-detail-item">
                      <span className="detail-label">End:</span>
                      <span className="detail-value">{new Date(formData.toDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {formData.bookingType && (
                    <div className="booking-detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{formData.bookingType}</span>
                    </div>
                  )}
                </div>

                <div className="payment-notice">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <div className="payment-notice-content">
                    <span className="payment-mode">Payment Mode: On Spot Only</span>
                    <span className="payment-description">Payment will be made directly to the property owner upon arrival.</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ✅ TOP 1% AGENCY STYLING - CLEAN WHITE + VIOLET GLASS BUTTONS/LABELS */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .elite-booking-page {
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
          gap: 40px;
          align-items: start;
        }

        /* Profile Incomplete Card */
        .profile-incomplete-card {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .profile-incomplete-content svg {
          color: #8b5cf6;
          margin-bottom: 24px;
        }

        .profile-incomplete-title {
          font-size: 24px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 12px;
          letter-spacing: -0.025em;
        }

        .profile-incomplete-text {
          font-size: 16px;
          color: #71717a;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .glass-complete-profile-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          backdrop-filter: blur(20px);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }

        .glass-complete-profile-button:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
        }

        /* Error Container */
        .error-container {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
        }

        .elite-alert {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .elite-alert.danger {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
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

        /* Booking Form Card */
        .booking-form-card {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .glass-card-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
          backdrop-filter: blur(20px);
          color: white;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-body {
          padding: 32px;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 8px;
          display: block;
        }

        .calendar-wrapper {
          background: #fafafa;
          border: 1px solid #f4f4f5;
          border-radius: 12px;
          padding: 20px;
        }

        .elite-select {
          width: 100%;
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 15px;
          font-weight: 500;
          color: #09090b;
          transition: all 0.2s ease;
        }

        .elite-select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .elite-textarea {
          width: 100%;
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 15px;
          font-weight: 500;
          color: #09090b;
          resize: vertical;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .elite-textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .elite-textarea::placeholder {
          color: #71717a;
        }

        /* User Info Card */
        .user-info-card {
          background: #fafafa;
          border: 1px solid #f4f4f5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
        }

        .user-info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 16px;
        }

        .user-info-header svg {
          color: #8b5cf6;
        }

        .user-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .user-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 12px;
          font-weight: 600;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .info-value {
          font-size: 14px;
          font-weight: 500;
          color: #09090b;
        }

        /* Submit Button */
        .submit-button-wrapper {
          margin-top: 32px;
        }

        .glass-confirm-button {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          backdrop-filter: blur(20px);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .glass-confirm-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
        }

        .glass-confirm-button:disabled {
          opacity: 0.6;
          transform: none !important;
          box-shadow: none !important;
          cursor: not-allowed;
        }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Property Summary Card */
        .property-summary-card {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 120px;
        }

        .glass-summary-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
          backdrop-filter: blur(20px);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .summary-body {
          padding: 24px;
        }

        .property-summary-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .property-summary-title {
          font-size: 16px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .property-summary-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #71717a;
          margin-bottom: 12px;
        }

        .property-summary-location svg {
          color: #8b5cf6;
        }

        .property-summary-details {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .detail-tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .summary-divider {
          height: 1px;
          background: #f4f4f5;
          margin: 20px 0;
        }

        .pricing-section,
        .booking-details-section {
          margin-bottom: 20px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #09090b;
          margin-bottom: 12px;
        }

        .section-title svg {
          color: #8b5cf6;
        }

        .pricing-item,
        .booking-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }

        .pricing-label,
        .detail-label {
          font-size: 14px;
          font-weight: 500;
          color: #71717a;
        }

        .pricing-value,
        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #09090b;
        }

        .pricing-item.total {
          border-top: 1px solid #f4f4f5;
          padding-top: 12px;
          margin-top: 8px;
        }

        .total-amount {
          color: #16a34a;
          font-size: 16px;
        }

        .payment-notice {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 20px;
        }

        .payment-notice svg {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .payment-notice-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .payment-mode {
          font-size: 13px;
          font-weight: 600;
          color: #92400e;
        }

        .payment-description {
          font-size: 12px;
          color: #92400e;
          line-height: 1.4;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .elite-grid {
            flex-direction: column;
          }

          .property-summary-card {
            position: static;
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .elite-booking-page {
            padding-top: 60px;
          }

          .elite-header {
            top: 60px;
          }

          .elite-container {
            padding: 48px 16px;
          }

          .card-body {
            padding: 24px;
          }

          .summary-body {
            padding: 20px;
          }

          .user-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BookProperty;
