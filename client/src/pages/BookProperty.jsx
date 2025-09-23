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
  const [userProfile, setUserProfile] = useState(null); // ✅ NEW: Store complete user profile
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ✅ SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProperty();
    fetchUserProfile(); // ✅ NEW: Fetch complete user profile
    checkProfileComplete();
    fetchBookedDates();
  }, [propertyId]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ✅ NEW: Fetch complete user profile with all details
  const fetchUserProfile = async () => {
    try {
      const response = await api.user.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Use basic user data if profile fetch fails
      setUserProfile(user);
    }
  };

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
        <div className="property-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
            <div className="particles">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 1.2}s`
                  }}
                />
              ))}
            </div>
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
          <Container className="py-4">
            <div className="text-center loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 loading-text">Loading booking details...</p>
            </div>
          </Container>
        </div>
        <style>{getCompactBookingStyles()}</style>
      </>
    );
  }

  if (error && !property) {
    return (
      <>
        <div className="property-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
            <div className="particles">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 1.2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <Container className="py-4">
            <Alert variant="danger" className="modern-alert">{error}</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getCompactBookingStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="property-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
            <div className="particles">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 1.2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <Container className="py-4">
            <Alert variant="warning" className="modern-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getCompactBookingStyles()}</style>
      </>
    );
  }

  if (profileIncomplete) {
    return (
      <>
        <div className="property-details-container">
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div 
              className="mouse-follower"
              style={{
                transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
              }}
            ></div>
          </div>
          <Container className="py-4">
            <Row className="justify-content-center">
              <Col md={8}>
                <Alert variant="warning" className="modern-alert text-center">
                  <h4>Complete Your Profile</h4>
                  <p>You need to complete your profile before booking properties.</p>
                  <Button as={Link} to="/profile" variant="primary" size="lg">
                    Complete Profile
                  </Button>
                </Alert>
              </Col>
            </Row>
          </Container>
        </div>
        <style>{getCompactBookingStyles()}</style>
      </>
    );
  }

  const totalPrice = calculatePrice();
  const currentUser = userProfile || user; // Use complete profile or fallback to basic user

  return (
    <>
      <div className="property-details-container">
        {/* ✅ BEAUTIFUL LOGIN-STYLE BACKGROUND */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
          <div className="particles">
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1.1}s`
                }}
              />
            ))}
          </div>
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <Container className="py-3">
          <Row>
            <Col>
              <div className="mb-2">
                <Button as={Link} to={`/property/${propertyId}`} className="back-btn mb-3">
                  ← Back to Property
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              {/* ✅ COMPACT MAIN CARD */}
              <Card className="mb-3 property-details-card">
                <Card.Body className="p-3">
                  {/* Property Title */}
                  <h1 className="property-title mb-2">📅 Book This Property</h1>
                  <p className="booking-subtitle mb-3">Complete the form below to secure your booking</p>
                  
                  {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    {/* ✅ COMPACT BOOKING DATES */}
                    <div className="form-section mb-3">
                      <div className="section-header">
                        <h6 className="section-title">📅 Select Booking Dates</h6>
                      </div>
                      <div className="section-body">
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

                    {/* ✅ COMPACT BOOKING TYPE */}
                    <div className="form-section mb-3">
                      <div className="section-header">
                        <h6 className="section-title">🏷️ Booking Type</h6>
                      </div>
                      <div className="section-body">
                        <Form.Select
                          name="bookingType"
                          value={formData.bookingType}
                          onChange={handleInputChange}
                          className="form-control-compact"
                          required
                        >
                          <option value="">Select booking type</option>
                          {property.rentType.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price, type)}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </div>

                    {/* ✅ COMPACT NOTES */}
                    <div className="form-section mb-3">
                      <div className="section-header">
                        <h6 className="section-title">📝 Additional Notes <small className="text-muted">(Optional)</small></h6>
                      </div>
                      <div className="section-body">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any special requirements or notes for the owner"
                          className="form-control-compact"
                        />
                      </div>
                    </div>

                    {/* ✅ COMPACT USER INFORMATION WITH PROPER DATA */}
                    <div className="form-section mb-3">
                      <div className="section-header">
                        <h6 className="section-title">👤 Your Information</h6>
                      </div>
                      <div className="section-body">
                        <Row className="g-2">
                          <Col sm={6}>
                            <div className="info-item">
                              <div className="info-icon">👨‍💼</div>
                              <div className="info-content">
                                <span className="info-label">Name</span>
                                <span className="info-value">{currentUser?.name || 'Not provided'}</span>
                              </div>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="info-item">
                              <div className="info-icon">📧</div>
                              <div className="info-content">
                                <span className="info-label">Email</span>
                                <span className="info-value">{currentUser?.email || 'Not provided'}</span>
                              </div>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="info-item">
                              <div className="info-icon">📱</div>
                              <div className="info-content">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{currentUser?.contact || currentUser?.phone || 'Not provided'}</span>
                              </div>
                            </div>
                          </Col>
                          <Col sm={6}>
                            <div className="info-item">
                              <div className="info-icon">🏠</div>
                              <div className="info-content">
                                <span className="info-label">Address</span>
                                <span className="info-value">
                                  {currentUser?.address ? 
                                    (typeof currentUser.address === 'string' ? 
                                      currentUser.address : 
                                      `${currentUser.address.street || ''} ${currentUser.address.city || ''} ${currentUser.address.state || ''}`.trim() || 'Not provided'
                                    ) : 
                                    'Not provided'
                                  }
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    {/* ✅ COMPACT SUBMIT BUTTON */}
                    <div className="d-grid">
                      <Button 
                        type="submit"
                        disabled={submitting}
                        className="book-now-btn"
                        size="lg"
                      >
                        {submitting ? 'Creating Booking...' : `📅 Confirm Booking`}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* ✅ COMPACT BOOKING SUMMARY CARD */}
              <Card className="booking-card sticky-top" style={{ top: '20px' }}>
                <Card.Header className="booking-header text-white">
                  <h6 className="mb-0">📋 Booking Summary</h6>
                </Card.Header>
                <Card.Body className="p-2">
                  {/* Property Image */}
                  <div className="text-center mb-2">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={getImageUrl(property.images[0])} 
                        alt={property.title}
                        className="property-summary-image"
                      />
                    ) : property.image ? (
                      <img 
                        src={getImageUrl(property.image)} 
                        alt={property.title}
                        className="property-summary-image"
                      />
                    ) : (
                      <div className="property-summary-image d-flex align-items-center justify-content-center" 
                           style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
                        <span style={{ fontSize: '2rem' }}>🏠</span>
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <h6 className="property-name">{property.title}</h6>
                  <p className="property-location">
                    📍 {property.address.city}, {property.address.state}
                  </p>

                  {/* Pricing Display */}
                  <div className="pricing-display mb-2">
                    <h4 className="booking-price mb-1">
                      {formatPrice(property.price, property.rentType[0])}
                    </h4>
                    {totalPrice > 0 && totalPrice !== property.price && (
                      <p className="total-amount mb-0">
                        Total: {formatPrice(totalPrice, formData.bookingType)}
                      </p>
                    )}
                  </div>

                  {/* Booking Details */}
                  {(formData.fromDate || formData.toDate || formData.bookingType) && (
                    <div className="mb-2">
                      <h6 className="features-title mb-1">📋 Selected Details</h6>
                      {formData.fromDate && (
                        <div className="booking-detail-item">
                          <span className="detail-label">From:</span>
                          <span className="detail-value">{new Date(formData.fromDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {formData.toDate && (
                        <div className="booking-detail-item">
                          <span className="detail-label">To:</span>
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
                  )}

                  {/* Payment Info */}
                  <div className="payment-reminder">
                    <small>
                      ⚠️ Payment will be made directly to property owner
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <style>{getCompactBookingStyles()}</style>
    </>
  );
};

// ✅ COMPLETE STYLES FUNCTION WITH ALL ANIMATIONS
const getCompactBookingStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow-x: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  /* ✅ FIXED BACKGROUND ANIMATIONS */
  .background-animation {
    position: fixed;
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
      rgba(124, 58, 237, 0.04) 0%, 
      transparent 25%, 
      rgba(59, 130, 246, 0.03) 50%, 
      transparent 75%, 
      rgba(16, 185, 129, 0.04) 100%);
    animation: gradientShift 15s ease-in-out infinite;
  }
  
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.06) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
  }
  
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;
    z-index: 1;
  }
  
  .orb-1 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 40%, transparent 70%);
    top: 10%;
    left: 8%;
    animation: float1 20s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 40%, transparent 70%);
    top: 55%;
    right: 10%;
    animation: float2 25s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, rgba(16, 185, 129, 0.01) 40%, transparent 70%);
    bottom: 15%;
    left: 5%;
    animation: float3Fixed 30s ease-in-out infinite;
    z-index: 1;
  }
  
  .orb-4 {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.04) 0%, rgba(245, 101, 101, 0.01) 40%, transparent 70%);
    top: 25%;
    right: 5%;
    animation: float4 28s ease-in-out infinite;
  }
  
  .mouse-follower {
    position: absolute;
    width: 80px;
    height: 80px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(15px);
    transition: transform 0.3s ease-out;
    pointer-events: none;
    opacity: 0.4;
  }
  
  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.15);
  }
  
  .particle-1 { 
    width: 3px; 
    height: 3px; 
    animation: particle1 25s linear infinite; 
  }
  .particle-2 { 
    width: 2px; 
    height: 2px; 
    background: rgba(59, 130, 246, 0.15);
    animation: particle2 30s linear infinite; 
  }
  .particle-3 { 
    width: 4px; 
    height: 4px; 
    background: rgba(16, 185, 129, 0.15);
    animation: particle3 28s linear infinite; 
  }
  .particle-4 { 
    width: 2px; 
    height: 2px; 
    background: rgba(245, 101, 101, 0.15);
    animation: particle4 22s linear infinite; 
  }
  
  .geometric-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    opacity: 0.04;
    z-index: 1;
  }
  
  .shape-1 {
    width: 40px;
    height: 40px;
    border: 1px solid #7c3aed;
    top: 20%;
    right: 20%;
    animation: rotate 40s linear infinite;
  }
  
  .shape-2 {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 20px solid #3b82f6;
    top: 60%;
    left: 80%;
    animation: float1 35s ease-in-out infinite;
  }
  
  .shape-3 {
    width: 20px;
    height: 20px;
    background: #10b981;
    border-radius: 50%;
    bottom: 25%;
    right: 30%;
    animation: pulse 12s ease-in-out infinite;
  }
  
  /* ✅ SUPER COMPACT CARDS */
  .property-details-card, .booking-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 16px !important;
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.06),
      0 3px 12px rgba(124, 58, 237, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    z-index: 10;
    animation: cardAppear 0.6s ease-out;
    transition: all 0.2s ease;
  }
  
  .property-details-card:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.08),
      0 4px 15px rgba(124, 58, 237, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }
  
  /* ✅ SUPER COMPACT TYPOGRAPHY */
  .property-title {
    font-size: 1.4rem !important;
    font-weight: 800 !important;
    color: #1f2937 !important;
    line-height: 1.2 !important;
    margin-bottom: 0.3rem !important;
  }
  
  .booking-subtitle {
    font-size: 0.8rem !important;
    color: #6b7280 !important;
    font-weight: 500 !important;
    margin-bottom: 1rem !important;
  }
  
  /* ✅ SUPER COMPACT FORM SECTIONS */
  .form-section {
    background: rgba(248, 250, 252, 0.7);
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.08);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.03);
  }
  
  .section-header {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid rgba(59, 130, 246, 0.06);
  }
  
  .section-title {
    font-weight: 700 !important;
    color: #1e293b !important;
    font-size: 0.8rem !important;
    margin: 0 !important;
  }
  
  .section-body {
    padding: 0.75rem;
  }
  
  /* ✅ COMPACT USER INFO */
  .info-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    border: 1px solid rgba(59, 130, 246, 0.05);
    transition: all 0.15s ease;
    box-shadow: 0 1px 3px rgba(59, 130, 246, 0.02);
  }
  
  .info-item:hover {
    transform: translateX(2px);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(59, 130, 246, 0.1);
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.04);
  }
  
  .info-item:last-child {
    margin-bottom: 0;
  }
  
  .info-icon {
    font-size: 0.9rem;
    margin-right: 0.5rem;
    width: 20px;
    text-align: center;
  }
  
  .info-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  
  .info-label {
    font-size: 0.65rem !important;
    color: #6b7280 !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.2px !important;
    margin-bottom: 0.1rem !important;
  }
  
  .info-value {
    font-size: 0.75rem !important;
    color: #2563eb !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    word-break: break-word !important;
  }
  
  /* ✅ COMPACT FORM CONTROLS */
  .form-control-compact {
    border-radius: 6px;
    border: 1px solid rgba(209,213,219,0.5);
    padding: 0.5rem;
    transition: all 0.2s ease;
    background: rgba(255,255,255,0.9);
    font-size: 0.8rem;
  }

  .form-control-compact:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124,58,237,0.08);
    background: white;
  }
  
  /* ✅ PERFECT COMPACT BOOKING CARD */
  .booking-card {
    box-shadow: 
      0 10px 25px rgba(0, 0, 0, 0.05),
      0 3px 10px rgba(59, 130, 246, 0.06) !important;
    border: 1px solid rgba(59, 130, 246, 0.08) !important;
    max-width: 100% !important;
  }
  
  .booking-header {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
    border-radius: 16px 16px 0 0 !important;
    padding: 0.6rem 0.8rem !important;
    margin: -1px -1px 0 -1px !important;
    border: none !important;
  }

  .booking-header h6 {
    font-size: 0.8rem !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }
  
  .property-summary-image {
    width: 100% !important;
    height: 80px !important;
    object-fit: cover !important;
    border-radius: 6px !important;
    margin-bottom: 0.5rem !important;
    border: 1px solid rgba(59, 130, 246, 0.08) !important;
  }

  .property-name {
    font-weight: 700 !important;
    color: #111827 !important;
    font-size: 0.8rem !important;
    line-height: 1.3 !important;
    margin-bottom: 0.2rem !important;
    text-align: center !important;
  }

  .property-location {
    color: #6b7280 !important;
    font-size: 0.7rem !important;
    margin: 0 0 0.75rem 0 !important;
    text-align: center !important;
  }

  .pricing-display {
    background: rgba(79, 70, 229, 0.04);
    padding: 0.5rem;
    border-radius: 6px;
    text-align: center;
  }

  .booking-price {
    font-size: 1rem !important;
    font-weight: 800 !important;
    color: #4f46e5 !important;
    margin: 0 !important;
  }
  
  .total-amount {
    color: #10b981 !important;
    font-weight: 600 !important;
    margin: 0.2rem 0 0 0 !important;
    font-size: 0.7rem !important;
  }
  
  .features-title {
    color: #374151 !important;
    font-weight: 700 !important;
    font-size: 0.75rem !important;
    margin-bottom: 0.3rem !important;
  }
  
  .booking-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0;
    font-size: 0.7rem !important;
    border-bottom: 1px solid rgba(79, 70, 229, 0.04);
  }
  
  .booking-detail-item:last-child {
    border-bottom: none;
  }
  
  .booking-detail-item .detail-label {
    color: #6b7280 !important;
    font-weight: 600 !important;
  }
  
  .booking-detail-item .detail-value {
    color: #4f46e5 !important;
    font-weight: 700 !important;
  }
  
  .payment-reminder {
    background: rgba(34, 197, 94, 0.03);
    margin: -0.5rem -0.5rem -0.5rem -0.5rem;
    padding: 0.5rem;
    border-radius: 0 0 14px 14px;
    border-top: 1px solid rgba(34, 197, 94, 0.06) !important;
  }

  .payment-reminder small {
    font-size: 0.65rem !important;
    color: #059669 !important;
    font-weight: 600 !important;
  }
  
  /* ✅ COMPACT BUTTONS */
  .back-btn {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 6px 12px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 0.75rem !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 2px 6px rgba(107, 114, 128, 0.12) !important;
    position: relative;
    z-index: 10;
  }
  
  .back-btn:hover {
    transform: translateY(-1px) scale(1.02) !important;
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.2) !important;
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
    color: white !important;
  }
  
  .book-now-btn {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 12px !important;
    font-size: 0.8rem !important;
    font-weight: 700 !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 3px 10px rgba(22, 163, 74, 0.15) !important;
    color: white !important;
  }
  
  .book-now-btn:hover:not(:disabled) {
    transform: translateY(-1px) scale(1.02) !important;
    box-shadow: 0 4px 15px rgba(22, 163, 74, 0.25) !important;
    background: linear-gradient(135deg, #15803d 0%, #16a34a 100%) !important;
    color: white !important;
  }

  .book-now-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* ✅ LOADING STATE */
  .loading-state {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  
  .spinner-border {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 0.25em;
  }
  
  .text-primary, .spinner-border {
    color: #7c3aed !important;
    border-color: #7c3aed !important;
    border-right-color: transparent !important;
  }
  
  .loading-text {
    color: #4b5563;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  /* ✅ ALERTS */
  .modern-alert {
    border: none !important;
    border-radius: 10px !important;
    padding: 0.75rem !important;
    font-weight: 600 !important;
    font-size: 0.8rem !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05) !important;
    position: relative;
    z-index: 10;
  }
  
  .alert-danger.modern-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 1px solid rgba(248, 113, 113, 0.15) !important;
    color: #dc2626 !important;
  }
  
  .alert-warning.modern-alert {
    background: rgba(255, 251, 235, 0.95) !important;
    border: 1px solid rgba(251, 191, 36, 0.15) !important;
    color: #d97706 !important;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(10px, -10px) rotate(30deg) scale(1.01); }
    50% { transform: translate(-8px, -15px) rotate(60deg) scale(0.99); }
    75% { transform: translate(-10px, 8px) rotate(90deg) scale(1.005); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    30% { transform: translate(-15px, -8px) rotate(40deg) scale(1.02); }
    70% { transform: translate(8px, -12px) rotate(80deg) scale(0.98); }
  }
  
  @keyframes float3Fixed {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(6px, -5px) scale(1.01); }
    50% { transform: translate(-5px, -8px) scale(0.99); }
    75% { transform: translate(-8px, 3px) scale(1.005); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(5px, -7px) scale(1.01); }
    66% { transform: translate(-7px, 5px) scale(0.99); }
  }
  
  @keyframes particle1 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-10vh) translateX(30px) rotate(120deg); opacity: 0; }
  }
  
  @keyframes particle2 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.25; }
    90% { opacity: 0.25; }
    100% { transform: translateY(-10vh) translateX(-25px) rotate(-120deg); opacity: 0; }
  }
  
  @keyframes particle3 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.2; }
    90% { opacity: 0.2; }
    100% { transform: translateY(-10vh) translateX(20px) rotate(180deg); opacity: 0; }
  }
  
  @keyframes particle4 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.15; }
    90% { opacity: 0.15; }
    100% { transform: translateY(-10vh) translateX(-15px) rotate(-90deg); opacity: 0; }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes cardAppear {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.04; }
    50% { transform: scale(1.1); opacity: 0.08; }
  }
  
  /* ✅ RESPONSIVE DESIGN */
  @media (max-width: 768px) {
    .property-title {
      font-size: 1.2rem !important;
    }
    
    .booking-subtitle {
      font-size: 0.75rem !important;
    }
    
    .section-title {
      font-size: 0.75rem !important;
    }
    
    .info-label {
      font-size: 0.6rem !important;
    }
    
    .info-value {
      font-size: 0.7rem !important;
    }
    
    .property-summary-image {
      height: 60px !important;
    }
    
    .booking-price {
      font-size: 0.9rem !important;
    }
    
    .orb-1, .orb-2 {
      width: 150px;
      height: 150px;
    }
    
    .orb-3, .orb-4 {
      width: 80px;
      height: 80px;
    }
  }
  
  @media (max-width: 576px) {
    .property-details-card {
      margin: 0 -15px;
      border-radius: 0 !important;
    }
    
    .booking-card {
      margin: 0 -15px;
      border-radius: 0 !important;
    }
    
    .info-item {
      padding: 0.4rem;
      margin-bottom: 0.25rem;
    }
    
    .section-body {
      padding: 0.5rem;
    }
    
    .section-header {
      padding: 0.4rem 0.6rem;
    }
  }
`;

export default BookProperty;
