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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ✅ SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProperty();
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
        <div className="book-container">
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
            <div className="text-center loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 loading-text">Loading booking details...</p>
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
        <div className="book-container">
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
            <Alert variant="danger" className="modern-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getBookingStyles()}</style>
      </>
    );
  }

  if (profileIncomplete) {
    return (
      <>
        <div className="book-container">
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
        <style>{getBookingStyles()}</style>
      </>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <>
      <div className="book-container">
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

        <Container className="py-4">
          <Row>
            <Col>
              <div className="mb-3">
                <Button as={Link} to={`/property/${propertyId}`} className="back-btn">
                  ← Back to Property
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={8}>
              <Card className="booking-card">
                <Card.Header className="booking-header">
                  <h4 className="mb-0">📅 Book This Property</h4>
                  <p className="mb-0 text-white-50">Complete the form below to secure your booking</p>
                </Card.Header>
                <Card.Body className="p-4">
                  {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <div className="form-section mb-4">
                      <h6 className="section-title">📅 Select Booking Dates</h6>
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

                    <div className="form-section mb-4">
                      <h6 className="section-title">🏷️ Booking Type</h6>
                      <Form.Select
                        name="bookingType"
                        value={formData.bookingType}
                        onChange={handleInputChange}
                        className="form-control-modern"
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

                    <div className="form-section mb-4">
                      <h6 className="section-title">📝 Additional Notes <span className="optional">Optional</span></h6>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requirements or notes for the owner"
                        className="form-control-modern"
                      />
                    </div>

                    <Card className="user-info-card mb-4">
                      <Card.Header>
                        <h6 className="mb-0">👤 Your Information</h6>
                      </Card.Header>
                      <Card.Body className="p-3">
                        <Row>
                          <Col md={6}>
                            <p className="info-item"><strong>Name:</strong> {user?.name}</p>
                            <p className="info-item"><strong>Email:</strong> {user?.email}</p>
                          </Col>
                          <Col md={6}>
                            <p className="info-item"><strong>Contact:</strong> {user?.contact}</p>
                            <p className="info-item"><strong>Address:</strong> {user?.address}</p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        className="confirm-btn"
                        disabled={submitting || !totalPrice}
                      >
                        {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <div className="sidebar-sticky">
                <Card className="summary-card">
                  <Card.Header className="summary-header">
                    <h6 className="mb-0">🏠 Booking Summary</h6>
                  </Card.Header>
                  <Card.Body className="p-3">
                    <div className="property-preview mb-3">
                      <img 
                        src={getImageUrl(property.image)} 
                        alt={property.title}
                        className="property-img"
                      />
                      
                      <h6 className="property-name mt-2 mb-2">{property.title}</h6>
                      <p className="property-location mb-2">
                        📍 {property.address.city}, {property.address.state}
                      </p>
                      <p className="property-specs mb-3">
                        📐 {property.size} • 🏷️ {property.category}
                      </p>
                    </div>

                    <hr />

                    <div className="pricing-section mb-3">
                      <h6 className="section-subtitle">💰 Pricing Details</h6>
                      <div className="price-row">
                        <span>Base Rate:</span>
                        <span className="fw-bold">{formatPrice(property.price, formData.bookingType || property.rentType[0])}</span>
                      </div>
                      {totalPrice > 0 && (
                        <div className="price-row total-row">
                          <span className="fw-bold">Total Amount:</span>
                          <span className="total-price">₹{totalPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <hr />

                    <div className="booking-details mb-3">
                      <h6 className="section-subtitle">📋 Booking Details</h6>
                      {formData.fromDate && (
                        <div className="detail-row">
                          <span>Start:</span>
                          <span>{new Date(formData.fromDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {formData.toDate && (
                        <div className="detail-row">
                          <span>End:</span>
                          <span>{new Date(formData.toDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {formData.bookingType && (
                        <div className="detail-row">
                          <span>Type:</span>
                          <span className="booking-type">{formData.bookingType}</span>
                        </div>
                      )}
                    </div>

                    <Alert variant="info" className="payment-alert">
                      <strong>💳 Payment Mode:</strong> On Spot Only
                      <br />
                      <small>Payment will be made directly to the property owner upon arrival.</small>
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .book-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow-x: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  /* ✅ BEAUTIFUL LOGIN-STYLE BACKGROUND ANIMATIONS */
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
    opacity: 0.7;
  }
  
  .orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(124, 58, 237, 0.04) 40%, transparent 70%);
    top: 10%;
    left: 8%;
    animation: float1 14s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 40%, transparent 70%);
    top: 55%;
    right: 10%;
    animation: float2 16s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 40%, transparent 70%);
    bottom: 20%;
    left: 12%;
    animation: float3 18s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.08) 0%, rgba(245, 101, 101, 0.02) 40%, transparent 70%);
    top: 35%;
    left: 75%;
    animation: float4 22s ease-in-out infinite;
  }
  
  .mouse-follower {
    position: absolute;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(20px);
    transition: transform 0.3s ease-out;
    pointer-events: none;
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
    background: rgba(124, 58, 237, 0.3);
  }
  
  .particle-1 { 
    width: 4px; 
    height: 4px; 
    animation: particle1 22s linear infinite; 
  }
  .particle-2 { 
    width: 3px; 
    height: 3px; 
    background: rgba(59, 130, 246, 0.3);
    animation: particle2 26s linear infinite; 
  }
  .particle-3 { 
    width: 5px; 
    height: 5px; 
    background: rgba(16, 185, 129, 0.3);
    animation: particle3 24s linear infinite; 
  }
  .particle-4 { 
    width: 2px; 
    height: 2px; 
    background: rgba(245, 101, 101, 0.3);
    animation: particle4 20s linear infinite; 
  }
  
  .geometric-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    opacity: 0.08;
  }
  
  .shape-1 {
    width: 60px;
    height: 60px;
    border: 2px solid #7c3aed;
    top: 25%;
    right: 25%;
    animation: rotate 35s linear infinite;
  }
  
  .shape-2 {
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 35px solid #3b82f6;
    top: 65%;
    left: 85%;
    animation: float1 28s ease-in-out infinite;
  }
  
  .shape-3 {
    width: 35px;
    height: 35px;
    background: #10b981;
    border-radius: 50%;
    bottom: 35%;
    right: 35%;
    animation: pulse 10s ease-in-out infinite;
  }

  /* ✅ LOADING STATE */
  .loading-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
  }
  
  .text-primary, .spinner-border {
    color: #7c3aed !important;
    border-color: #7c3aed !important;
    border-right-color: transparent !important;
  }
  
  .loading-text {
    color: #4b5563;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  /* ✅ BEAUTIFUL CARDS WITH GLASSMORPHISM */
  .booking-card, .summary-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 20px !important;
    box-shadow: 
      0 15px 45px rgba(0, 0, 0, 0.08),
      0 5px 20px rgba(124, 58, 237, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    z-index: 10;
    animation: cardAppear 0.8s ease-out;
    transition: all 0.3s ease;
  }
  
  .booking-card:hover,
  .summary-card:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 20px 55px rgba(0, 0, 0, 0.12),
      0 8px 25px rgba(124, 58, 237, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }

  /* ✅ CARD HEADERS */
  .booking-header {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    color: white !important;
    padding: 1.5rem !important;
    border: none !important;
    border-radius: 20px 20px 0 0 !important;
    margin: -1px -1px 0 -1px !important;
  }

  .summary-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    color: white !important;
    padding: 1rem !important;
    border: none !important;
    border-radius: 20px 20px 0 0 !important;
    margin: -1px -1px 0 -1px !important;
  }

  /* ✅ FORM SECTIONS */
  .form-section {
    background: rgba(248,250,252,0.5);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(226,232,240,0.5);
  }

  .section-title {
    color: #374151;
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .section-subtitle {
    color: #374151;
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }

  .optional {
    color: #6b7280;
    font-size: 0.8rem;
    font-weight: 400;
  }

  /* ✅ FORM CONTROLS */
  .form-control-modern {
    border-radius: 8px;
    border: 1px solid rgba(209,213,219,0.6);
    padding: 0.75rem;
    transition: all 0.3s ease;
    background: rgba(255,255,255,0.9);
  }

  .form-control-modern:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    background: white;
  }

  /* ✅ CALENDAR WRAPPER */
  .calendar-wrapper {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(209,213,219,0.3);
  }

  /* ✅ USER INFO CARD */
  .user-info-card {
    background: rgba(59,130,246,0.05) !important;
    border: 1px solid rgba(59,130,246,0.1) !important;
    border-radius: 12px !important;
  }

  .user-info-card .card-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
    color: white !important;
    padding: 0.75rem 1rem !important;
    border: none !important;
    border-radius: 12px 12px 0 0 !important;
    margin: -1px -1px 0 -1px !important;
  }

  .info-item {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  /* ✅ BUTTONS */
  .back-btn {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 10px 20px !important;
    color: white !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    box-shadow: 0 4px 15px rgba(107, 114, 128, 0.2) !important;
    position: relative;
    z-index: 10;
  }
  
  .back-btn:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3) !important;
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%) !important;
    color: white !important;
  }

  .confirm-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 1rem 2rem !important;
    font-weight: 700 !important;
    font-size: 1rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    box-shadow: 0 6px 20px rgba(124,58,237,0.3) !important;
    transition: all 0.3s ease !important;
    color: white !important;
  }

  .confirm-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(124,58,237,0.4) !important;
    color: white !important;
  }

  .confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ✅ SIDEBAR */
  .sidebar-sticky {
    position: sticky;
    top: 2rem;
  }

  /* ✅ PROPERTY PREVIEW */
  .property-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
  }

  .property-name {
    font-weight: 700;
    color: #111827;
    font-size: 1rem;
    line-height: 1.3;
  }

  .property-location {
    color: #6b7280;
    font-size: 0.8rem;
    margin: 0;
  }

  .property-specs {
    color: #9ca3af;
    font-size: 0.75rem;
    margin: 0;
  }

  /* ✅ PRICING */
  .pricing-section {
    background: rgba(248,250,252,0.5);
    padding: 1rem;
    border-radius: 8px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }

  .price-row:last-child {
    margin-bottom: 0;
  }

  .total-row {
    border-top: 1px solid rgba(209,213,219,0.3);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  .total-price {
    color: #10b981;
    font-weight: 700;
    font-size: 1rem;
  }

  /* ✅ BOOKING DETAILS */
  .booking-details {
    background: rgba(248,250,252,0.5);
    padding: 1rem;
    border-radius: 8px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }

  .detail-row:last-child {
    margin-bottom: 0;
  }

  .booking-type {
    color: #7c3aed;
    font-weight: 600;
    text-transform: capitalize;
  }

  /* ✅ PAYMENT ALERT */
  .payment-alert {
    background: rgba(59,130,246,0.1) !important;
    border: 1px solid rgba(59,130,246,0.2) !important;
    border-radius: 8px !important;
    padding: 0.75rem !important;
    font-size: 0.8rem !important;
    margin-bottom: 0 !important;
  }

  /* ✅ ALERTS */
  .modern-alert {
    border: none !important;
    border-radius: 16px !important;
    padding: 1.5rem !important;
    font-weight: 600 !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08) !important;
    position: relative;
    z-index: 10;
  }
  
  .alert-danger.modern-alert {
    background: rgba(254, 242, 242, 0.95) !important;
    border: 2px solid rgba(248, 113, 113, 0.3) !important;
    color: #dc2626 !important;
  }
  
  .alert-warning.modern-alert {
    background: rgba(255, 251, 235, 0.95) !important;
    border: 2px solid rgba(251, 191, 36, 0.3) !important;
    color: #d97706 !important;
  }

  .alert-info.modern-alert {
    background: rgba(239, 246, 255, 0.95) !important;
    border: 2px solid rgba(59, 130, 246, 0.3) !important;
    color: #2563eb !important;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(25px, -25px) rotate(90deg) scale(1.05); }
    50% { transform: translate(-20px, -35px) rotate(180deg) scale(0.95); }
    75% { transform: translate(-30px, 20px) rotate(270deg) scale(1.02); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    30% { transform: translate(-35px, -20px) rotate(108deg) scale(1.08); }
    70% { transform: translate(20px, -30px) rotate(252deg) scale(0.92); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    20% { transform: translate(20px, -15px) scale(1.06) rotate(72deg); }
    40% { transform: translate(-15px, -25px) scale(0.94) rotate(144deg); }
    60% { transform: translate(-25px, 10px) scale(1.03) rotate(216deg); }
    80% { transform: translate(15px, 20px) scale(0.97) rotate(288deg); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(15px, -18px) scale(1.1); }
    66% { transform: translate(-18px, 15px) scale(0.9); }
  }
  
  @keyframes particle1 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-10vh) translateX(100px) rotate(360deg); opacity: 0; }
  }
  
  @keyframes particle2 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.4; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-10vh) translateX(-80px) rotate(-360deg); opacity: 0; }
  }
  
  @keyframes particle3 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-10vh) translateX(60px) rotate(180deg); opacity: 0; }
  }
  
  @keyframes particle4 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-10vh) translateX(-40px) rotate(-180deg); opacity: 0; }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.08; }
    50% { transform: scale(1.3); opacity: 0.15; }
  }
  
  @keyframes cardAppear {
    from { 
      opacity: 0; 
      transform: translateY(25px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  /* ✅ PERFECT RESPONSIVE DESIGN */
  @media (max-width: 991.98px) {
    .sidebar-sticky { 
      position: static !important; 
      margin-top: 1.5rem; 
    }
    
    .booking-header {
      padding: 1.25rem !important;
    }
    
    .booking-card .card-body {
      padding: 1.5rem !important;
    }
    
    .form-section {
      padding: 1.25rem;
    }
    
    .orb-1 { width: 220px; height: 220px; }
    .orb-2 { width: 160px; height: 160px; }
    .orb-3 { width: 130px; height: 130px; }
    .orb-4 { width: 110px; height: 110px; }
  }
  
  @media (max-width: 767.98px) {
    .booking-header {
      padding: 1rem !important;
    }
    
    .booking-header h4 {
      font-size: 1.1rem;
    }
    
    .booking-header p {
      font-size: 0.8rem;
    }
    
    .booking-card .card-body {
      padding: 1.25rem !important;
    }
    
    .form-section {
      padding: 1rem;
    }
    
    .property-img {
      height: 100px;
    }
    
    .property-name {
      font-size: 0.9rem;
    }
    
    .property-location {
      font-size: 0.75rem;
    }
    
    .property-specs {
      font-size: 0.7rem;
    }
    
    .price-row, .detail-row {
      font-size: 0.8rem;
    }
    
    .total-price {
      font-size: 0.9rem;
    }
    
    .confirm-btn {
      padding: 0.875rem 1.5rem !important;
      font-size: 0.9rem !important;
    }
    
    .orb-1 { width: 180px; height: 180px; }
    .orb-2 { width: 130px; height: 130px; }
    .orb-3 { width: 100px; height: 100px; }
    .orb-4 { width: 80px; height: 80px; }
  }

  @media (max-width: 576px) {
    .back-btn {
      padding: 8px 16px !important;
      font-size: 0.8rem !important;
    }
  }
`;

export default BookProperty;
