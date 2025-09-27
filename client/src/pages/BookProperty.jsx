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

  const totalPrice = calculatePrice();
  const isFormValid = formData.fromDate && formData.toDate && formData.bookingType;

  if (loading) {
    return (
      <div className="compact-booking-page">
        <div className="compact-loading-screen">
          <div className="loading-container">
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
            </div>
            <h3 className="loading-title">Loading</h3>
            <p className="loading-subtitle">Preparing your booking</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="compact-booking-page">
        <Container className="compact-container">
          <div className="compact-error-container">
            <div className="error-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <h3 className="error-title">Property Not Found</h3>
            <p className="error-description">The property doesn't exist or has been removed.</p>
            <Button as={Link} to="/find-property" className="compact-button primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Properties
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (profileIncomplete) {
    return (
      <div className="compact-booking-page">
        <Container className="compact-container">
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="compact-profile-card">
                <div className="profile-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h3 className="profile-title">Complete Your Profile</h3>
                <p className="profile-text">Please complete your profile to continue booking.</p>
                <Button as={Link} to="/profile" className="compact-glass-button">
                  Complete Profile
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="compact-booking-page">
      {/* Compact Header */}
      <div className="compact-header">
        <Container>
          <div className="header-content">
            <Button as={Link} to={`/property/${propertyId}`} className="nav-back-button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Property
            </Button>
            <div className="booking-progress">
              <div className="progress-step active">
                <div className="step-indicator">1</div>
                <span>Details</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-indicator">2</div>
                <span>Payment</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="compact-container">
        <div className="compact-grid">
          {/* Left Side - Compact Booking Form */}
          <div className="form-section">
            <div className="compact-form-card">
              <div className="compact-glass-header">
                <div className="header-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="header-content">
                  <h2 className="header-title">Book Property</h2>
                  <p className="header-subtitle">Secure your space</p>
                </div>
              </div>
              
              <div className="compact-card-body">
                {error && (
                  <div className="compact-alert error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <Form onSubmit={handleSubmit} className="compact-form">
                  <div className="form-section-group">
                    <div className="compact-section-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <h3 className="compact-section-title">Select Dates</h3>
                    </div>
                    
                    <div className="compact-form-group">
                      <label className="compact-label">
                        Booking Dates <span className="required">*</span>
                      </label>
                      <div className="compact-calendar-wrapper">
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
                  </div>

                  <div className="form-section-group">
                    <div className="compact-section-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                      </svg>
                      <h3 className="compact-section-title">Configuration</h3>
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-label">
                        Booking Type <span className="required">*</span>
                      </label>
                      <div className="compact-select-wrapper">
                        <select
                          name="bookingType"
                          value={formData.bookingType}
                          onChange={handleInputChange}
                          required
                          className="compact-select"
                        >
                          <option value="">Choose booking type</option>
                          {property.rentType.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price, type)}
                            </option>
                          ))}
                        </select>
                        <div className="select-arrow">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="compact-form-group">
                      <label className="compact-label">
                        Additional Notes
                        <span className="optional">Optional</span>
                      </label>
                      <div className="compact-textarea-wrapper">
                        <textarea
                          rows={3}
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Special requirements or questions..."
                          className="compact-textarea"
                        />
                        <div className="textarea-counter">
                          {formData.notes.length}/300
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact User Information */}
                  <div className="form-section-group">
                    <div className="compact-section-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <h3 className="compact-section-title">Your Information</h3>
                    </div>

                    <div className="compact-user-info">
                      <div className="user-info-grid">
                        <div className="compact-info-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          <div>
                            <span className="info-label">Name</span>
                            <span className="info-value">{user?.name || 'Not set'}</span>
                          </div>
                        </div>
                        
                        <div className="compact-info-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          <div>
                            <span className="info-label">Email</span>
                            <span className="info-value">{user?.email || 'Not set'}</span>
                          </div>
                        </div>
                        
                        <div className="compact-info-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                          </svg>
                          <div>
                            <span className="info-label">Phone</span>
                            <span className="info-value">{user?.contact || 'Not set'}</span>
                          </div>
                        </div>
                        
                        <div className="compact-info-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          <div>
                            <span className="info-label">Address</span>
                            <span className="info-value">{user?.address || 'Not set'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="compact-form-actions">
                    <Button 
                      type="submit" 
                      className={`compact-glass-submit ${!isFormValid || submitting ? 'disabled' : ''}`}
                      disabled={submitting || !isFormValid}
                    >
                      {submitting ? (
                        <div className="button-loading">
                          <div className="compact-spinner"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        <div className="button-content">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11H3a2 2 0 0 0-2 2v3c0 1 0 3 1.5 3S4 17 4 16.5v-1"/>
                            <path d="M21 16.5c0 .5 0 2-1.5 2S18 17 18 16v-3a2 2 0 0 0-2-2h-6"/>
                            <circle cx="12" cy="5" r="3"/>
                          </svg>
                          <span>Confirm Booking</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          {/* Right Side - Compact Property Summary */}
          <div className="sidebar-section">
            <div className="compact-summary-card">
              <div className="compact-glass-summary-header">
                <div className="summary-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
                <div>
                  <h3 className="summary-title">Property Summary</h3>
                  <p className="summary-subtitle">Review selection</p>
                </div>
              </div>
              
              <div className="compact-summary-body">
                {/* Compact Property Preview */}
                <div className="compact-property-preview">
                  <div className="compact-image-wrapper">
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="compact-property-image"
                    />
                    <div className="compact-badge">Premium</div>
                  </div>
                  
                  <div className="compact-property-details">
                    <h4 className="compact-property-title">{property.title}</h4>
                    <div className="compact-property-location">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{property.address.city}, {property.address.state}</span>
                    </div>
                    <div className="compact-property-tags">
                      <span className="compact-tag">{property.size}</span>
                      <span className="compact-tag">{property.category}</span>
                    </div>
                  </div>
                </div>

                <div className="compact-divider"></div>

                {/* Compact Pricing */}
                <div className="compact-pricing">
                  <div className="compact-pricing-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                    </svg>
                    <h4>Pricing</h4>
                  </div>
                  
                  <div className="compact-pricing-items">
                    <div className="compact-pricing-item">
                      <span>Base Rate</span>
                      <span>{formatPrice(property.price, formData.bookingType || property.rentType[0])}</span>
                    </div>
                    {totalPrice > 0 && (
                      <div className="compact-pricing-item total">
                        <span>Total</span>
                        <span className="total-amount">₹{totalPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="compact-divider"></div>

                {/* Compact Booking Details */}
                <div className="compact-booking-details">
                  <div className="compact-details-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <h4>Booking Details</h4>
                  </div>
                  
                  <div className="compact-details-list">
                    <div className={`compact-detail-item ${!formData.fromDate ? 'placeholder' : ''}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <div>
                        <span className="detail-label">Check-in</span>
                        <span className="detail-value">
                          {formData.fromDate ? new Date(formData.fromDate).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric'
                          }) : 'Select date'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`compact-detail-item ${!formData.toDate ? 'placeholder' : ''}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <div>
                        <span className="detail-label">Check-out</span>
                        <span className="detail-value">
                          {formData.toDate ? new Date(formData.toDate).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric'
                          }) : 'Select date'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`compact-detail-item ${!formData.bookingType ? 'placeholder' : ''}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                      </svg>
                      <div>
                        <span className="detail-label">Type</span>
                        <span className="detail-value booking-type">
                          {formData.bookingType || 'Choose type'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Payment Notice */}
                <div className="compact-payment-notice">
                  <div className="notice-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <p>Payment processed on-site upon arrival. No online payment required.</p>
                  <div className="security-badges">
                    <div className="security-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="security-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span>Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ✅ COMPACT TOP 1% AGENCY STYLING */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');

        .compact-booking-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding-top: 72px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'rlig' 1, 'calt' 1;
          letter-spacing: -0.01em;
        }

        /* Compact Loading Screen */
        .compact-loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .loading-spinner-wrapper {
          margin: 0 auto 20px;
          width: 32px;
          height: 32px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
          letter-spacing: -0.025em;
        }

        .loading-subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        /* Compact Error States */
        .compact-error-container {
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
          padding: 32px 24px;
        }

        .error-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #dc2626;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        .error-title {
          font-size: 18px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .error-description {
          font-size: 14px;
          color: #71717a;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .compact-profile-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .profile-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #8b5cf6;
        }

        .profile-title {
          font-size: 18px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .profile-text {
          font-size: 14px;
          color: #71717a;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        /* Compact Header */
        .compact-header {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          padding: 12px 0;
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-back-button {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .nav-back-button:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
          transform: translateY(-1px);
        }

        .booking-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #71717a;
        }

        .progress-step.active {
          color: #8b5cf6;
        }

        .step-indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-indicator {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-color: #8b5cf6;
          color: white;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        }

        .progress-line {
          width: 24px;
          height: 2px;
          background: #e2e8f0;
          border-radius: 1px;
        }

        /* Compact Layout */
        .compact-container {
          max-width: 1200px;
          padding: 60px 20px 80px;
        }

        .compact-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }

        .form-section {
          min-width: 0;
        }

        .sidebar-section {
          position: sticky;
          top: 120px;
        }

        /* Compact Buttons */
        .compact-button.primary,
        .compact-glass-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .compact-glass-button:hover,
        .compact-button.primary:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        /* Compact Form Card */
        .compact-form-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .compact-glass-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
          backdrop-filter: blur(20px);
          color: white;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .header-content h2.header-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 2px;
          letter-spacing: -0.025em;
          line-height: 1.3;
        }

        .header-subtitle {
          font-size: 13px;
          opacity: 0.9;
          margin: 0;
          font-weight: 500;
        }

        .compact-card-body {
          padding: 24px;
        }

        /* Compact Alert */
        .compact-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .compact-alert.error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #dc2626;
          border: 1px solid #fca5a5;
        }

        /* Compact Form */
        .compact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .compact-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .compact-section-header svg {
          color: #8b5cf6;
        }

        .compact-section-title {
          font-size: 15px;
          font-weight: 700;
          color: #09090b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .compact-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .compact-label {
          font-size: 13px;
          font-weight: 600;
          color: #09090b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .required {
          color: #dc2626;
          font-weight: 500;
          font-size: 12px;
        }

        .optional {
          background: #f1f5f9;
          color: #71717a;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        /* Compact Calendar */
        .compact-calendar-wrapper {
          background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .compact-calendar-wrapper:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        /* Compact Select */
        .compact-select-wrapper {
          position: relative;
        }

        .compact-select {
          width: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 36px 12px 12px;
          font-size: 14px;
          font-weight: 500;
          color: #09090b;
          transition: all 0.2s ease;
          appearance: none;
          cursor: pointer;
        }

        .compact-select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
          pointer-events: none;
          transition: all 0.2s ease;
        }

        .compact-select:focus + .select-arrow {
          color: #8b5cf6;
          transform: translateY(-50%) rotate(180deg);
        }

        /* Compact Textarea */
        .compact-textarea-wrapper {
          position: relative;
        }

        .compact-textarea {
          width: 100%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #09090b;
          resize: vertical;
          transition: all 0.2s ease;
          font-family: inherit;
          line-height: 1.5;
        }

        .compact-textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .compact-textarea::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .textarea-counter {
          position: absolute;
          bottom: 8px;
          right: 12px;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Compact User Info */
        .compact-user-info {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }

        .user-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .compact-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .compact-info-item:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .compact-info-item svg {
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .compact-info-item div {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .info-label {
          font-size: 10px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 12px;
          font-weight: 600;
          color: #09090b;
          word-break: break-word;
        }

        /* Compact Submit Button */
        .compact-form-actions {
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .compact-glass-submit {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .compact-glass-submit:hover:not(.disabled) {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .compact-glass-submit.disabled {
          opacity: 0.6;
          transform: none !important;
          box-shadow: none !important;
          cursor: not-allowed;
          background: #94a3b8;
        }

        .button-loading,
        .button-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .compact-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Compact Property Summary */
        .compact-summary-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }

        .compact-glass-summary-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
          backdrop-filter: blur(20px);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-icon {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .summary-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 1px;
          letter-spacing: -0.025em;
        }

        .summary-subtitle {
          font-size: 12px;
          opacity: 0.9;
          margin: 0;
          font-weight: 500;
        }

        .compact-summary-body {
          padding: 20px;
        }

        /* Compact Property Preview */
        .compact-property-preview {
          margin-bottom: 20px;
        }

        .compact-image-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .compact-property-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .compact-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .compact-property-details h4.compact-property-title {
          font-size: 15px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 6px;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        .compact-property-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #71717a;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .compact-property-location svg {
          color: #8b5cf6;
        }

        .compact-property-tags {
          display: flex;
          gap: 6px;
        }

        .compact-tag {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          border: 1px solid rgba(139, 92, 246, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        /* Compact Dividers */
        .compact-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
          margin: 20px 0;
        }

        /* Compact Pricing */
        .compact-pricing {
          margin-bottom: 20px;
        }

        .compact-pricing-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .compact-pricing-header svg {
          color: #8b5cf6;
        }

        .compact-pricing-header h4 {
          font-size: 14px;
          font-weight: 700;
          color: #09090b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .compact-pricing-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .compact-pricing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 600;
        }

        .compact-pricing-item.total {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border: 1px solid #c4b5fd;
          font-weight: 700;
        }

        .compact-pricing-item span:first-child {
          color: #71717a;
        }

        .compact-pricing-item.total span:first-child {
          color: #6d28d9;
        }

        .compact-pricing-item span:last-child {
          color: #09090b;
        }

        .total-amount {
          color: #7c3aed !important;
          font-size: 14px;
        }

        /* Compact Booking Details */
        .compact-booking-details {
          margin-bottom: 20px;
        }

        .compact-details-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .compact-details-header svg {
          color: #8b5cf6;
        }

        .compact-details-header h4 {
          font-size: 14px;
          font-weight: 700;
          color: #09090b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .compact-details-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .compact-detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .compact-detail-item:not(.placeholder) {
          border-color: #c4b5fd;
          background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
        }

        .compact-detail-item.placeholder {
          border-style: dashed;
          opacity: 0.6;
        }

        .compact-detail-item svg {
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .compact-detail-item.placeholder svg {
          color: #94a3b8;
        }

        .compact-detail-item div {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }

        .detail-label {
          font-size: 10px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-size: 12px;
          font-weight: 600;
          color: #09090b;
          word-break: break-word;
        }

        .booking-type {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          text-transform: capitalize;
        }

        /* Compact Payment Notice */
        .compact-payment-notice {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 16px;
        }

        .notice-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .notice-header svg {
          color: #f59e0b;
        }

        .notice-header span {
          font-size: 12px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .compact-payment-notice p {
          font-size: 11px;
          color: #92400e;
          line-height: 1.5;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .security-badges {
          display: flex;
          gap: 6px;
        }

        .security-badge {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #fcd34d;
          border-radius: 12px;
          padding: 3px 6px;
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 9px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .compact-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .sidebar-section {
            position: static;
            top: auto;
          }

          .booking-progress {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .compact-booking-page {
            padding-top: 60px;
          }

          .compact-header {
            top: 60px;
            padding: 10px 0;
          }

          .compact-container {
            padding: 48px 16px 60px;
          }

          .compact-card-body {
            padding: 20px;
          }

          .compact-summary-body {
            padding: 16px;
          }

          .user-info-grid {
            grid-template-columns: 1fr;
          }

          .compact-glass-header {
            padding: 16px 20px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default BookProperty;
