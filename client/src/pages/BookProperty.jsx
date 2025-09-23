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

  // ✅ SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <>
        <div className="booking-container">
          <div className="booking-background">
            <div className="gradient-overlay"></div>
            <div className="floating-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          
          <Container className="py-5">
            <div className="text-center loading-state">
              <div className="modern-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring spinner-ring-2"></div>
                <div className="spinner-ring spinner-ring-3"></div>
              </div>
              <h4 className="loading-text mt-4">Loading booking details...</h4>
              <p className="loading-subtext">Please wait while we fetch the property information</p>
            </div>
          </Container>
        </div>
        <style>{getBookingStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="booking-container">
          <div className="booking-background">
            <div className="gradient-overlay"></div>
            <div className="floating-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          
          <Container className="py-5">
            <div className="text-center">
              <Alert variant="danger" className="modern-alert error-alert">
                <div className="alert-icon">🚫</div>
                <h5>Property Not Found</h5>
                <p className="mb-0">The requested property could not be found</p>
              </Alert>
              <Button as={Link} to="/find-property" className="modern-btn primary-btn mt-3">
                <span className="btn-icon">← </span>
                Back to Properties
              </Button>
            </div>
          </Container>
        </div>
        <style>{getBookingStyles()}</style>
      </>
    );
  }

  if (profileIncomplete) {
    return (
      <>
        <div className="booking-container">
          <div className="booking-background">
            <div className="gradient-overlay"></div>
            <div className="floating-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>
          
          <Container className="py-5">
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="modern-card profile-warning-card">
                  <Card.Body className="text-center p-5">
                    <div className="warning-icon mb-4">⚠️</div>
                    <h3 className="card-title mb-3">Complete Your Profile</h3>
                    <p className="card-text mb-4">
                      You need to complete your profile before booking properties.
                    </p>
                    <Button as={Link} to="/profile" className="modern-btn primary-btn btn-lg">
                      <span className="btn-icon">👤</span>
                      Complete Profile
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <style>{getBookingStyles()}</style>
      </>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <>
      <div className="booking-container">
        <div className="booking-background">
          <div className="gradient-overlay"></div>
          <div className="floating-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
          </div>
          <div className="grid-pattern"></div>
        </div>

        <Container className="py-5">
          <Row>
            <Col>
              <div className="page-header mb-4">
                <Button as={Link} to={`/property/${propertyId}`} className="modern-btn back-btn mb-4">
                  <span className="btn-icon">←</span>
                  Back to Property Details
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={8}>
              <Card className="modern-card main-booking-card">
                <Card.Header className="modern-card-header">
                  <div className="header-content">
                    <div className="header-icon">📅</div>
                    <div className="header-text">
                      <h4 className="header-title">Book This Property</h4>
                      <p className="header-subtitle">Complete the form below to secure your booking</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  {error && (
                    <Alert variant="danger" className="modern-alert error-alert mb-4">
                      <div className="alert-icon">⚠️</div>
                      <div className="alert-content">
                        <strong>Error:</strong> {error}
                      </div>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <span className="section-icon">📅</span>
                        Select Booking Dates
                      </h6>
                      <div className="calendar-container">
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

                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <span className="section-icon">🏷️</span>
                        Booking Type
                      </h6>
                      <Form.Group>
                        <Form.Select
                          name="bookingType"
                          value={formData.bookingType}
                          onChange={handleInputChange}
                          className="modern-select"
                          required
                        >
                          <option value="">Choose your booking type</option>
                          {property.rentType.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price, type)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="form-section mb-4">
                      <h6 className="form-section-title">
                        <span className="section-icon">📝</span>
                        Additional Notes
                        <span className="optional-badge">Optional</span>
                      </h6>
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Share any special requirements, preferences, or questions for the property owner..."
                          className="modern-textarea"
                        />
                      </Form.Group>
                    </div>

                    <Card className="user-info-card mb-4">
                      <Card.Header className="user-info-header">
                        <h6 className="mb-0">
                          <span className="section-icon">👤</span>
                          Your Contact Information
                        </h6>
                      </Card.Header>
                      <Card.Body className="p-3">
                        <Row>
                          <Col md={6}>
                            <div className="info-item">
                              <div className="info-label">Full Name</div>
                              <div className="info-value">{user?.name || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Email Address</div>
                              <div className="info-value">{user?.email || 'Not provided'}</div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="info-item">
                              <div className="info-label">Contact Number</div>
                              <div className="info-value">{user?.contact || 'Not provided'}</div>
                            </div>
                            <div className="info-item">
                              <div className="info-label">Address</div>
                              <div className="info-value">{user?.address || 'Not provided'}</div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    <div className="submit-section">
                      <Button 
                        type="submit" 
                        className="modern-btn primary-btn confirm-btn"
                        disabled={submitting || !totalPrice}
                      >
                        {submitting ? (
                          <>
                            <div className="btn-spinner"></div>
                            <span>Processing Booking...</span>
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">✨</span>
                            <span>Confirm Booking</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <div className="sticky-sidebar">
                <Card className="modern-card summary-card">
                  <Card.Header className="summary-header">
                    <h6 className="mb-0">
                      <span className="section-icon">🏠</span>
                      Booking Summary
                    </h6>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="property-preview mb-4">
                      <img 
                        src={getImageUrl(property.image)} 
                        alt={property.title}
                        className="preview-image"
                      />
                      <div className="preview-content">
                        <h6 className="property-title">{property.title}</h6>
                        <div className="property-location">
                          <span className="location-icon">📍</span>
                          {property.address.city}, {property.address.state}
                        </div>
                        <div className="property-details">
                          <span className="detail-item">
                            <span className="detail-icon">📐</span>
                            {property.size}
                          </span>
                          <span className="detail-separator">•</span>
                          <span className="detail-item">
                            <span className="detail-icon">🏷️</span>
                            {property.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pricing-section mb-4">
                      <h6 className="section-title">
                        <span className="section-icon">💰</span>
                        Pricing Details
                      </h6>
                      <div className="pricing-item">
                        <span className="pricing-label">Base Rate:</span>
                        <span className="pricing-value">
                          {formatPrice(property.price, formData.bookingType || property.rentType[0])}
                        </span>
                      </div>
                      {totalPrice > 0 && (
                        <div className="total-price">
                          <span className="total-label">Total Amount:</span>
                          <span className="total-value">₹{totalPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="booking-details-section mb-4">
                      <h6 className="section-title">
                        <span className="section-icon">📋</span>
                        Booking Details
                      </h6>
                      {formData.fromDate ? (
                        <div className="detail-row">
                          <span className="detail-label">Check-in:</span>
                          <span className="detail-value">
                            {new Date(formData.fromDate).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      ) : (
                        <div className="detail-row placeholder">
                          <span className="detail-label">Check-in:</span>
                          <span className="detail-placeholder">Select dates</span>
                        </div>
                      )}
                      
                      {formData.toDate ? (
                        <div className="detail-row">
                          <span className="detail-label">Check-out:</span>
                          <span className="detail-value">
                            {new Date(formData.toDate).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      ) : (
                        <div className="detail-row placeholder">
                          <span className="detail-label">Check-out:</span>
                          <span className="detail-placeholder">Select dates</span>
                        </div>
                      )}
                      
                      {formData.bookingType ? (
                        <div className="detail-row">
                          <span className="detail-label">Type:</span>
                          <span className="detail-value booking-type">
                            {formData.bookingType.charAt(0).toUpperCase() + formData.bookingType.slice(1)}
                          </span>
                        </div>
                      ) : (
                        <div className="detail-row placeholder">
                          <span className="detail-label">Type:</span>
                          <span className="detail-placeholder">Select type</span>
                        </div>
                      )}
                    </div>

                    <Alert variant="info" className="payment-info">
                      <div className="payment-header">
                        <span className="payment-icon">💳</span>
                        <strong>Payment Information</strong>
                      </div>
                      <div className="payment-content">
                        <p className="payment-method">Payment Mode: <strong>On Spot Only</strong></p>
                        <p className="payment-note">Payment will be made directly to the property owner upon arrival.</p>
                      </div>
                    </Alert>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <style>{getBookingStyles()}</style>
    </>
  );
};

const getBookingStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .booking-container {
    min-height: 100vh;
    position: relative;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* ✅ BEAUTIFUL: Modern Background */
  .booking-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(124, 58, 237, 0.03) 0%, 
      transparent 25%, 
      rgba(59, 130, 246, 0.02) 50%, 
      transparent 75%, 
      rgba(16, 185, 129, 0.03) 100%);
    animation: gradientFlow 20s ease-in-out infinite;
  }
  
  .floating-orbs {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.4;
  }
  
  .orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
    top: 10%;
    left: 5%;
    animation: float1 15s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    top: 60%;
    right: 10%;
    animation: float2 18s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
    bottom: 20%;
    left: 20%;
    animation: float3 22s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.08) 0%, transparent 70%);
    top: 40%;
    left: 60%;
    animation: float4 25s ease-in-out infinite;
  }
  
  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 30s linear infinite;
  }
  
  /* ✅ MODERN: Card Designs */
  .modern-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.08),
      0 8px 25px rgba(124, 58, 237, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 10;
    transition: all 0.3s ease;
  }
  
  .modern-card:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.12),
      0 12px 30px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
  
  .main-booking-card {
    animation: cardSlideIn 0.6s ease-out;
  }
  
  .summary-card {
    animation: cardSlideIn 0.6s ease-out 0.2s both;
  }
  
  /* ✅ MODERN: Card Headers */
  .modern-card-header {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    border-radius: 20px 20px 0 0 !important;
    padding: 1.5rem 2rem;
    border: none;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .header-icon {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
  }
  
  .header-text {
    flex: 1;
  }
  
  .header-title {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  
  .header-subtitle {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.9;
    font-weight: 400;
  }
  
  .summary-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-radius: 20px 20px 0 0 !important;
    padding: 1rem 1.5rem;
    border: none;
  }
  
  .user-info-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-radius: 12px 12px 0 0 !important;
    padding: 0.75rem 1rem;
    border: none;
  }
  
  /* ✅ BEAUTIFUL: Form Sections */
  .form-section {
    padding: 1.5rem;
    background: rgba(248, 250, 252, 0.5);
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.5);
  }
  
  .form-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #374151;
  }
  
  .section-icon {
    font-size: 1.1rem;
  }
  
  .optional-badge {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
    margin-left: 0.5rem;
  }
  
  /* ✅ MODERN: Form Controls */
  .modern-select,
  .modern-textarea {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(10px);
    border: 1.5px solid rgba(209, 213, 219, 0.6) !important;
    border-radius: 12px !important;
    padding: 0.75rem 1rem !important;
    color: #111827 !important;
    font-size: 0.9rem !important;
    transition: all 0.3s ease !important;
    font-family: 'Inter', sans-serif !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  }
  
  .modern-select:focus,
  .modern-textarea:focus {
    background: rgba(255, 255, 255, 0.95) !important;
    border-color: #7c3aed !important;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
    transform: scale(1.005);
  }
  
  .modern-textarea::placeholder {
    color: #9ca3af !important;
    font-size: 0.85rem !important;
  }
  
  .calendar-container {
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(209, 213, 219, 0.3);
  }
  
  /* ✅ MODERN: User Info Card */
  .user-info-card {
    background: rgba(59, 130, 246, 0.02);
    border: 1px solid rgba(59, 130, 246, 0.1);
    border-radius: 16px;
  }
  
  .info-item {
    margin-bottom: 0.75rem;
  }
  
  .info-item:last-child {
    margin-bottom: 0;
  }
  
  .info-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }
  
  .info-value {
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    border: 1px solid rgba(209, 213, 219, 0.3);
  }
  
  /* ✅ MODERN: Buttons */
  .modern-btn {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #475569;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .modern-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    color: #334155;
  }
  
  .primary-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25) !important;
  }
  
  .primary-btn:hover {
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(124, 58, 237, 0.35) !important;
    color: white !important;
  }
  
  .back-btn {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }
  
  .confirm-btn {
    width: 100%;
    padding: 1rem 2rem !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  .btn-icon {
    font-size: 1rem;
  }
  
  .btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
  }
  
  /* ✅ BEAUTIFUL: Property Summary */
  .sticky-sidebar {
    position: sticky;
    top: 2rem;
  }
  
  .property-preview {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
  }
  
  .preview-image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .preview-content {
    padding: 0.5rem 0;
  }
  
  .property-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  
  .property-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .location-icon {
    font-size: 0.9rem;
  }
  
  .property-details {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #9ca3af;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .detail-icon {
    font-size: 0.75rem;
  }
  
  .detail-separator {
    color: #d1d5db;
  }
  
  /* ✅ BEAUTIFUL: Pricing Section */
  .pricing-section,
  .booking-details-section {
    padding: 1rem;
    background: rgba(248, 250, 252, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(226, 232, 240, 0.5);
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
  }
  
  .pricing-item,
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(226, 232, 240, 0.3);
  }
  
  .pricing-item:last-child,
  .detail-row:last-child {
    border-bottom: none;
  }
  
  .pricing-label,
  .detail-label {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .pricing-value,
  .detail-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
  }
  
  .total-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0 0.5rem;
    border-top: 2px solid rgba(16, 185, 129, 0.2);
    margin-top: 0.5rem;
  }
  
  .total-label {
    font-size: 0.95rem;
    font-weight: 700;
    color: #374151;
  }
  
  .total-value {
    font-size: 1.2rem;
    font-weight: 800;
    color: #10b981;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .detail-placeholder {
    color: #9ca3af;
    font-style: italic;
    font-size: 0.8rem;
  }
  
  .booking-type {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
  
  .detail-row.placeholder {
    opacity: 0.6;
  }
  
  /* ✅ MODERN: Payment Info */
  .payment-info {
    background: rgba(59, 130, 246, 0.05) !important;
    border: 1px solid rgba(59, 130, 246, 0.15) !important;
    border-radius: 12px !important;
    padding: 1rem !important;
    margin: 0 !important;
  }
  
  .payment-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .payment-icon {
    font-size: 1.1rem;
  }
  
  .payment-content p {
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  .payment-content p:last-child {
    margin-bottom: 0;
  }
  
  .payment-method {
    font-weight: 600;
    color: #374151;
  }
  
  .payment-note {
    color: #6b7280;
    font-size: 0.8rem !important;
  }
  
  /* ✅ MODERN: Alerts */
  .modern-alert {
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(10px);
    border-radius: 12px !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: 1rem !important;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .error-alert {
    background: rgba(254, 242, 242, 0.9) !important;
    border: 1px solid rgba(248, 113, 113, 0.2) !important;
  }
  
  .alert-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .alert-content {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  /* ✅ BEAUTIFUL: Loading States */
  .loading-state {
    padding: 4rem 2rem;
  }
  
  .modern-spinner {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;
  }
  
  .spinner-ring {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 4px solid transparent;
    border-radius: 50%;
    animation: spin 2s linear infinite;
  }
  
  .spinner-ring:nth-child(1) {
    border-top-color: #7c3aed;
    animation-delay: 0s;
  }
  
  .spinner-ring-2 {
    border-top-color: #3b82f6;
    animation-delay: -0.4s;
    width: 60px;
    height: 60px;
    top: 10px;
    left: 10px;
  }
  
  .spinner-ring-3 {
    border-top-color: #10b981;
    animation-delay: -0.8s;
    width: 40px;
    height: 40px;
    top: 20px;
    left: 20px;
  }
  
  .loading-text {
    color: #374151;
    font-weight: 600;
    font-size: 1.2rem;
  }
  
  .loading-subtext {
    color: #6b7280;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  /* ✅ MODERN: Profile Warning */
  .profile-warning-card {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .warning-icon {
    font-size: 4rem;
    filter: drop-shadow(0 4px 12px rgba(245, 158, 11, 0.3));
  }
  
  .card-title {
    color: #111827;
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  .card-text {
    color: #6b7280;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  /* ✅ BEAUTIFUL: Animations */
  @keyframes gradientFlow {
    0%, 100% { opacity: 1; transform: rotate(0deg); }
    50% { opacity: 0.8; transform: rotate(180deg); }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, -40px) scale(0.95); }
    75% { transform: translate(-30px, 20px) scale(1.02); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    30% { transform: translate(-40px, -20px) scale(1.08); }
    70% { transform: translate(20px, -30px) scale(0.92); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    20% { transform: translate(20px, -15px) scale(1.06); }
    40% { transform: translate(-15px, -25px) scale(0.94); }
    60% { transform: translate(-25px, 10px) scale(1.03); }
    80% { transform: translate(15px, 20px) scale(0.97); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(15px, -20px) scale(1.1); }
    66% { transform: translate(-20px, 15px) scale(0.9); }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes cardSlideIn {
    from { 
      opacity: 0; 
      transform: translateY(30px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* ✅ RESPONSIVE: Mobile Optimizations */
  @media (max-width: 768px) {
    .booking-container {
      padding: 0;
    }
    
    .modern-card {
      border-radius: 16px;
      margin-bottom: 1rem;
    }
    
    .modern-card-header {
      padding: 1rem 1.5rem;
      border-radius: 16px 16px 0 0 !important;
    }
    
    .header-title {
      font-size: 1.1rem;
    }
    
    .header-subtitle {
      font-size: 0.8rem;
    }
    
    .form-section {
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .preview-image {
      height: 150px;
    }
    
    .sticky-sidebar {
      position: relative;
      top: 0;
    }
    
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
  }
  
  @media (max-width: 576px) {
    .modern-card-header {
      padding: 0.75rem 1rem;
    }
    
    .header-content {
      gap: 0.75rem;
    }
    
    .header-icon {
      font-size: 1.5rem;
    }
    
    .property-details {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
    
    .detail-separator {
      display: none;
    }
  }
`;

export default BookProperty;
