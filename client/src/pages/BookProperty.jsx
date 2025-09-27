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
      <div className="ultimate-booking-page">
        <div className="ultimate-loading-screen">
          <div className="loading-container">
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
              <div className="loading-pulse"></div>
            </div>
            <h3 className="loading-title">Loading booking details</h3>
            <p className="loading-subtitle">Preparing your booking experience</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="ultimate-booking-page">
        <Container className="ultimate-container">
          <div className="error-container">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <h3 className="error-title">Property Not Found</h3>
            <p className="error-description">The property you're looking for doesn't exist or has been removed.</p>
            <Button as={Link} to="/find-property" className="ultimate-button primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <div className="ultimate-booking-page">
        <Container className="ultimate-container">
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="profile-incomplete-card">
                <div className="profile-incomplete-content">
                  <div className="profile-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <h3 className="profile-incomplete-title">Complete Your Profile</h3>
                  <p className="profile-incomplete-text">Complete your profile to unlock seamless booking and enhance your experience with personalized recommendations.</p>
                  <Button as={Link} to="/profile" className="ultimate-glass-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
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

  return (
    <div className="ultimate-booking-page">
      {/* Premium Navigation Header */}
      <div className="ultimate-header">
        <Container>
          <div className="header-content">
            <Button as={Link} to={`/property/${propertyId}`} className="nav-back-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      <Container className="ultimate-container">
        <div className="ultimate-grid">
          {/* Left Side - Premium Booking Form */}
          <div className="form-section">
            <div className="booking-form-card">
              <div className="ultimate-glass-header">
                <div className="header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="header-content">
                  <h2 className="header-title">Book Property</h2>
                  <p className="header-subtitle">Secure your space in just a few clicks</p>
                </div>
              </div>
              
              <div className="card-body">
                {error && (
                  <div className="ultimate-alert error">
                    <div className="alert-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <span>{error}</span>
                  </div>
                )}

                <Form onSubmit={handleSubmit} className="ultimate-form">
                  <div className="form-section-group">
                    <div className="section-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <h3 className="section-title">Select Your Dates</h3>
                    </div>
                    
                    <div className="form-group calendar-group">
                      <label className="ultimate-label">
                        Booking Dates 
                        <span className="required-indicator">*</span>
                      </label>
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
                  </div>

                  <div className="form-section-group">
                    <div className="section-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                      </svg>
                      <h3 className="section-title">Booking Configuration</h3>
                    </div>

                    <div className="form-group">
                      <label className="ultimate-label">
                        Booking Type 
                        <span className="required-indicator">*</span>
                      </label>
                      <div className="select-wrapper">
                        <select
                          name="bookingType"
                          value={formData.bookingType}
                          onChange={handleInputChange}
                          required
                          className="ultimate-select"
                        >
                          <option value="">Choose your preferred booking type</option>
                          {property.rentType.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price, type)}
                            </option>
                          ))}
                        </select>
                        <div className="select-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="ultimate-label">
                        Additional Notes
                        <span className="optional-indicator">Optional</span>
                      </label>
                      <div className="textarea-wrapper">
                        <textarea
                          rows={4}
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Share any special requirements, preferences, or questions for the property owner..."
                          className="ultimate-textarea"
                        />
                        <div className="textarea-counter">
                          {formData.notes.length}/500
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Premium User Information Card */}
                  <div className="form-section-group">
                    <div className="section-header">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <h3 className="section-title">Your Information</h3>
                    </div>

                    <div className="user-info-premium-card">
                      <div className="user-info-grid">
                        <div className="user-info-item">
                          <div className="info-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          </div>
                          <div className="info-content">
                            <span className="info-label">Full Name</span>
                            <span className="info-value">{user?.name || 'Not provided'}</span>
                          </div>
                        </div>
                        
                        <div className="user-info-item">
                          <div className="info-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                              <polyline points="22,6 12,13 2,6"/>
                            </svg>
                          </div>
                          <div className="info-content">
                            <span className="info-label">Email Address</span>
                            <span className="info-value">{user?.email || 'Not provided'}</span>
                          </div>
                        </div>
                        
                        <div className="user-info-item">
                          <div className="info-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                          </div>
                          <div className="info-content">
                            <span className="info-label">Phone Number</span>
                            <span className="info-value">{user?.contact || 'Not provided'}</span>
                          </div>
                        </div>
                        
                        <div className="user-info-item">
                          <div className="info-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                          </div>
                          <div className="info-content">
                            <span className="info-label">Address</span>
                            <span className="info-value">{user?.address || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button 
                      type="submit" 
                      className={`ultimate-glass-submit-button ${!isFormValid || submitting ? 'disabled' : ''}`}
                      disabled={submitting || !isFormValid}
                    >
                      {submitting ? (
                        <div className="button-loading">
                          <div className="button-spinner"></div>
                          <span>Creating Booking...</span>
                        </div>
                      ) : (
                        <div className="button-content">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {/* Right Side - Premium Property Summary Sidebar */}
          <div className="sidebar-section">
            <div className="property-summary-card">
              <div className="ultimate-glass-summary-header">
                <div className="summary-header-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                </div>
                <div className="summary-header-content">
                  <h3 className="summary-title">Property Summary</h3>
                  <p className="summary-subtitle">Review your selection</p>
                </div>
              </div>
              
              <div className="summary-body">
                <div className="property-preview">
                  <div className="property-image-wrapper">
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="property-summary-image"
                    />
                    <div className="image-overlay">
                      <div className="property-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Premium
                      </div>
                    </div>
                  </div>
                  
                  <div className="property-details">
                    <h4 className="property-summary-title">{property.title}</h4>
                    <div className="property-summary-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{property.address.city}, {property.address.state}</span>
                    </div>
                    <div className="property-summary-tags">
                      <span className="property-tag size">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                        </svg>
                        {property.size}
                      </span>
                      <span className="property-tag category">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                        </svg>
                        {property.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="pricing-breakdown">
                  <div className="breakdown-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                    </svg>
                    <h4 className="breakdown-title">Pricing Breakdown</h4>
                  </div>
                  
                  <div className="pricing-items">
                    <div className="pricing-item">
                      <span className="pricing-label">Base Rate</span>
                      <span className="pricing-value">{formatPrice(property.price, formData.bookingType || property.rentType[0])}</span>
                    </div>
                    {totalPrice > 0 && (
                      <>
                        <div className="pricing-item subtotal">
                          <span className="pricing-label">Subtotal</span>
                          <span className="pricing-value">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="pricing-divider"></div>
                        <div className="pricing-item total">
                          <span className="pricing-label">Total Amount</span>
                          <span className="pricing-value total-amount">₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="booking-summary">
                  <div className="summary-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <h4 className="summary-section-title">Booking Details</h4>
                  </div>
                  
                  <div className="booking-details-list">
                    {formData.fromDate ? (
                      <div className="booking-detail-item">
                        <div className="detail-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Check-in</span>
                          <span className="detail-value">{new Date(formData.fromDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="booking-detail-item placeholder">
                        <div className="detail-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m9 12 2 2 4-4"/>
                          </svg>
                        </div>
                        <span className="detail-placeholder">Select check-in date</span>
                      </div>
                    )}
                    
                    {formData.toDate ? (
                      <div className="booking-detail-item">
                        <div className="detail-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Check-out</span>
                          <span className="detail-value">{new Date(formData.toDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="booking-detail-item placeholder">
                        <div className="detail-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m9 12 2 2 4-4"/>
                          </svg>
                        </div>
                        <span className="detail-placeholder">Select check-out date</span>
                      </div>
                    )}
                    
                    {formData.bookingType ? (
                      <div className="booking-detail-item">
                        <div className="detail-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                          </svg>
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Booking Type</span>
                          <span className="detail-value booking-type">{formData.bookingType}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="booking-detail-item placeholder">
                        <div className="detail-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="m9 12 2 2 4-4"/>
                          </svg>
                        </div>
                        <span className="detail-placeholder">Choose booking type</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="premium-payment-notice">
                  <div className="notice-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span className="notice-title">Secure Payment</span>
                  </div>
                  <p className="notice-description">
                    Payment will be processed securely on-site upon arrival. No online payment required.
                  </p>
                  <div className="security-badges">
                    <div className="security-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="security-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* ✅ ULTIMATE TOP 1% AGENCY STYLING - APPLE/STRIPE/LINEAR QUALITY */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family:Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family:JetBrains+Mono:wght@400;500;600&display=swap');

        .ultimate-booking-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          padding-top: 72px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
          font-feature-settings: 'rlig' 1, 'calt' 1, 'ss01' 1, 'ss02' 1;
          letter-spacing: -0.01em;
        }

        /* Premium Loading Screen */
        .ultimate-loading-screen {
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
          backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.4);
        }

        .loading-spinner-wrapper {
          position: relative;
          margin: 0 auto 32px;
          width: 48px;
          height: 48px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .loading-pulse {
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        .loading-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .loading-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        /* Premium Error State */
        .error-container {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
          padding: 48px 32px;
        }

        .error-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #dc2626;
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.2);
        }

        .error-title {
          font-size: 24px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 12px;
          letter-spacing: -0.025em;
        }

        .error-description {
          font-size: 16px;
          color: #71717a;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        /* Premium Header */
        .ultimate-header {
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          padding: 16px 0;
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
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .nav-back-button:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
          transform: translateY(-1px);
        }

        /* Premium Progress Indicator */
        .booking-progress {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #71717a;
        }

        .progress-step.active {
          color: #8b5cf6;
        }

        .step-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-indicator {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          border-color: #8b5cf6;
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .progress-line {
          width: 32px;
          height: 2px;
          background: #e2e8f0;
          border-radius: 1px;
        }

        /* Main Layout */
        .ultimate-container {
          max-width: 1280px;
          padding: 80px 24px 120px;
        }

        .ultimate-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 48px;
          align-items: start;
        }

        .form-section {
          min-width: 0;
        }

        .sidebar-section {
          position: sticky;
          top: 140px;
        }

        /* Profile Incomplete Card */
        .profile-incomplete-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .profile-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #8b5cf6;
        }

        .profile-incomplete-title {
          font-size: 28px;
          font-weight: 800;
          color: #09090b;
          margin-bottom: 16px;
          letter-spacing: -0.025em;
        }

        .profile-incomplete-text {
          font-size: 16px;
          color: #71717a;
          margin-bottom: 32px;
          line-height: 1.7;
        }

        /* Premium Buttons */
        .ultimate-button.primary,
        .ultimate-glass-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          backdrop-filter: blur(20px);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .ultimate-glass-button:hover,
        .ultimate-button.primary:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(139, 92, 246, 0.6);
        }

        /* Premium Form Card */
        .booking-form-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .ultimate-glass-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          color: white;
          padding: 32px 32px 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .header-content h2.header-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 4px;
          letter-spacing: -0.025em;
          line-height: 1.3;
        }

        .header-subtitle {
          font-size: 15px;
          opacity: 0.9;
          margin: 0;
          font-weight: 500;
        }

        .card-body {
          padding: 40px 32px;
        }

        /* Premium Alert */
        .ultimate-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 32px;
          font-size: 15px;
          font-weight: 500;
          border: 1px solid;
        }

        .ultimate-alert.error {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-color: #fca5a5;
          color: #dc2626;
        }

        .alert-icon {
          flex-shrink: 0;
        }

        /* Premium Form */
        .ultimate-form {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .form-section-group {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .section-header svg {
          color: #8b5cf6;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #09090b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ultimate-label {
          font-size: 14px;
          font-weight: 700;
          color: #09090b;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.01em;
        }

        .required-indicator {
          color: #dc2626;
          font-weight: 500;
          font-size: 13px;
        }

        .optional-indicator {
          background: #f1f5f9;
          color: #71717a;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        /* Premium Calendar */
        .calendar-wrapper {
          background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .calendar-wrapper:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        /* Premium Select */
        .select-wrapper {
          position: relative;
        }

        .ultimate-select {
          width: 100%;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 48px 16px 16px;
          font-size: 15px;
          font-weight: 600;
          color: #09090b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          appearance: none;
          cursor: pointer;
        }

        .ultimate-select:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
          transform: translateY(-1px);
        }

        .select-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .ultimate-select:focus + .select-arrow {
          color: #8b5cf6;
          transform: translateY(-50%) rotate(180deg);
        }

        /* Premium Textarea */
        .textarea-wrapper {
          position: relative;
        }

        .ultimate-textarea {
          width: 100%;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          font-size: 15px;
          font-weight: 500;
          color: #09090b;
          resize: vertical;
          min-height: 120px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          line-height: 1.6;
        }

        .ultimate-textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
          transform: translateY(-1px);
        }

        .ultimate-textarea::placeholder {
          color: #94a3b8;
          font-weight: 500;
        }

        .textarea-counter {
          position: absolute;
          bottom: 12px;
          right: 16px;
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 4px 8px;
          border-radius: 6px;
        }

        /* Premium User Info Card */
        .user-info-premium-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
        }

        .user-info-grid {
          display: grid;
          gap: 20px;
        }

        .user-info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .user-info-item:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .info-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .info-label {
          font-size: 12px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #09090b;
          word-break: break-word;
        }

        /* Premium Submit Button */
        .form-actions {
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .ultimate-glass-submit-button {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          backdrop-filter: blur(20px);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 20px 24px;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
        }

        .ultimate-glass-submit-button:hover:not(.disabled) {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(139, 92, 246, 0.6);
        }

        .ultimate-glass-submit-button.disabled {
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
          gap: 8px;
        }

        .button-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Premium Property Summary Card */
        .property-summary-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .ultimate-glass-summary-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          color: white;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .summary-header-icon {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .summary-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 2px;
          letter-spacing: -0.025em;
        }

        .summary-subtitle {
          font-size: 13px;
          opacity: 0.9;
          margin: 0;
          font-weight: 500;
        }

        .summary-body {
          padding: 32px 24px;
        }

        /* Premium Property Preview */
        .property-preview {
          margin-bottom: 32px;
        }

        .property-image-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .property-summary-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          transition: all 0.3s ease;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 12px;
        }

        .property-badge {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          color: #8b5cf6;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .property-details h4.property-summary-title {
          font-size: 18px;
          font-weight: 700;
          color: #09090b;
          margin-bottom: 8px;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }

        .property-summary-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #71717a;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .property-summary-location svg {
          color: #8b5cf6;
        }

        .property-summary-tags {
          display: flex;
          gap: 8px;
        }

        .property-tag {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          color: #8b5cf6;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(139, 92, 246, 0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        /* Premium Dividers */
        .summary-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
          margin: 32px 0;
        }

        /* Premium Pricing Breakdown */
        .pricing-breakdown {
          margin-bottom: 32px;
        }

        .breakdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .breakdown-header svg {
          color: #8b5cf6;
        }

        .breakdown-title {
          font-size: 16px;
          font-weight: 700;
          color: #09090b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .pricing-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pricing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .pricing-item.subtotal {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-color: #cbd5e1;
        }

        .pricing-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 8px 0;
        }

        .pricing-item.total {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border: 2px solid #c4b5fd;
          font-weight: 700;
        }

        .pricing-label {
          font-size: 14px;
          font-weight: 600;
          color: #71717a;
        }

        .pricing-item.total .pricing-label {
          color: #6d28d9;
        }

        .pricing-value {
          font-size: 14px;
          font-weight: 700;
          color: #09090b;
          font-family: 'JetBrains Mono', monospace;
        }

        .total-amount {
          color: #7c3aed;
          font-size: 16px;
        }

        /* Premium Booking Summary */
        .booking-summary {
          margin-bottom: 32px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .summary-header svg {
          color: #8b5cf6;
        }

        .summary-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #09090b;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .booking-details-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .booking-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .booking-detail-item:not(.placeholder) {
          border-color: #c4b5fd;
          background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
        }

        .booking-detail-item.placeholder {
          border-style: dashed;
          opacity: 0.6;
        }

        .detail-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .booking-detail-item.placeholder .detail-icon {
          background: #f1f5f9;
          color: #94a3b8;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-size: 14px;
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

        .detail-placeholder {
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
          font-style: italic;
        }

        /* Premium Payment Notice */
        .premium-payment-notice {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 2px solid #fde68a;
          border-radius: 16px;
          padding: 20px;
        }

        .notice-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .notice-header svg {
          color: #f59e0b;
        }

        .notice-title {
          font-size: 14px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .notice-description {
          font-size: 13px;
          color: #92400e;
          line-height: 1.5;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .security-badges {
          display: flex;
          gap: 8px;
        }

        .security-badge {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #fcd34d;
          border-radius: 20px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .security-badge svg {
          width: 10px;
          height: 10px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .ultimate-grid {
            grid-template-columns: 1fr;
            gap: 32px;
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
          .ultimate-booking-page {
            padding-top: 60px;
          }

          .ultimate-header {
            top: 60px;
            padding: 12px 0;
          }

          .ultimate-container {
            padding: 64px 16px 80px;
          }

          .card-body {
            padding: 32px 24px;
          }

          .summary-body {
            padding: 24px 20px;
          }

          .user-info-grid {
            grid-template-columns: 1fr;
          }

          .ultimate-glass-header {
            padding: 24px 24px 20px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .ultimate-grid {
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default BookProperty;
