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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProperty();
    checkProfileComplete();
    fetchBookedDates();
  }, [propertyId]);

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
        <style>{getPerfectFixedStyles()}</style>
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
          </div>
          <Container className="py-4">
            <Alert variant="danger" className="modern-alert">Property not found</Alert>
            <Button as={Link} to="/find-property" className="back-btn">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getPerfectFixedStyles()}</style>
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
        <style>{getPerfectFixedStyles()}</style>
      </>
    );
  }

  const totalPrice = calculatePrice();

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
              <div className="mb-4">
                <Button as={Link} to={`/property/${propertyId}`} className="back-btn mb-3">
                  ← Back to Property Details
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              {/* ✅ REDUCED HEIGHT BOOKING CARD */}
              <Card className="mb-4 main-booking-card-compact">
                <Card.Header className="booking-header">
                  <h4 className="booking-main-title mb-0">📅 Book Property</h4>
                </Card.Header>
                <Card.Body className="p-3">
                  {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    {/* Booking Dates Section */}
                    <div className="booking-form-section-compact mb-3">
                      <div className="section-header-compact">
                        <h5 className="section-title-compact">📅 Select Booking Dates *</h5>
                      </div>
                      <div className="section-body-compact">
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

                    {/* Booking Type Section */}
                    <div className="booking-form-section-compact mb-3">
                      <div className="section-header-compact">
                        <h5 className="section-title-compact">🏷️ Booking Type *</h5>
                      </div>
                      <div className="section-body-compact">
                        <Form.Select
                          name="bookingType"
                          value={formData.bookingType}
                          onChange={handleInputChange}
                          className="form-control-perfect-dropdown"
                          required
                        >
                          <option value="">Select booking type</option>
                          {property.rentType.map(type => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price)}/{type === 'monthly' ? 'month' : type === 'yearly' ? 'year' : type === 'hourly' ? 'hour' : type.slice(0, -2) || 'unit'}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </div>

                    {/* Additional Notes Section */}
                    <div className="booking-form-section-compact mb-3">
                      <div className="section-header-compact">
                        <h5 className="section-title-compact">📝 Additional Notes (Optional)</h5>
                      </div>
                      <div className="section-body-compact">
                        <Form.Control
                          as="textarea"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="form-control-perfect"
                          placeholder="Any special requirements or notes for the owner"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Your Information Section */}
                    <div className="booking-form-section-compact mb-4">
                      <div className="section-header-compact">
                        <h5 className="section-title-compact">👤 Your Information</h5>
                      </div>
                      <div className="section-body-compact">
                        <Row>
                          <Col md={6}>
                            <div className="info-item-compact">
                              <div className="info-icon-compact">👤</div>
                              <div className="info-content-compact">
                                <div className="info-label-compact">Name</div>
                                <div className="info-value-compact">{user?.name || 'Not provided'}</div>
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="info-item-compact">
                              <div className="info-icon-compact">📧</div>
                              <div className="info-content-compact">
                                <div className="info-label-compact">Email</div>
                                <div className="info-value-compact">{user?.email || 'Not provided'}</div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <div className="info-item-compact">
                              <div className="info-icon-compact">📱</div>
                              <div className="info-content-compact">
                                <div className="info-label-compact">Contact</div>
                                <div className="info-value-compact">{user?.phone || 'Not provided'}</div>
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="info-item-compact">
                              <div className="info-icon-compact">📍</div>
                              <div className="info-content-compact">
                                <div className="info-label-compact">Address</div>
                                <div className="info-value-compact">{user?.address || 'Not provided'}</div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="book-now-btn-perfect w-100"
                      disabled={submitting || !formData.fromDate || !formData.toDate || !formData.bookingType}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Booking...
                        </>
                      ) : (
                        `📅 Book Now - ${formatPrice(totalPrice)}`
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* ✅ PROPERTY SUMMARY CARD WITH PERFECT ALIGNMENT AND LOCATION */}
              <Card className="property-summary-card">
                <Card.Header className="property-summary-header-purple">
                  <h6 className="mb-0">🏠 Property Summary</h6>
                </Card.Header>
                <Card.Body className="p-3">
                  {/* Property Image */}
                  {property.images && property.images.length > 0 && (
                    <img
                      src={getImageUrl(property.images[0])}
                      alt={property.name}
                      className="property-summary-image-perfect"
                    />
                  )}

                  {/* ✅ PROFESSIONAL PROPERTY INFO WITH LOCATION */}
                  <div className="property-info-professional">
                    <h5 className="property-name-professional">{property.name}</h5>
                    
                    {/* ✅ LOCATION NOW VISIBLE AND PRESENT */}
                    <div className="property-location-professional">
                      <div className="location-icon">📍</div>
                      <div className="location-text">{property.location || property.address || 'Location not specified'}</div>
                    </div>
                    
                    {/* ✅ FIXED PROPERTY DETAILS ALIGNMENT - LEFT ALIGNED */}
                    <div className="property-details-professional">
                      <div className="detail-item">
                        <div className="detail-icon">📐</div>
                        <div className="detail-text">{property.size}</div>
                      </div>
                      <div className="detail-separator">•</div>
                      <div className="detail-item">
                        <div className="detail-icon">🏷️</div>
                        <div className="detail-text">{property.category}</div>
                      </div>
                    </div>
                  </div>

                  <hr className="professional-divider" />

                  {/* ✅ PROFESSIONAL PRICING SECTION - FIXED DUPLICATE TEXT */}
                  <div className="pricing-section-professional">
                    <h5 className="pricing-title-professional">💰 Pricing</h5>
                    
                    <div className="price-item">
                      <div className="price-label">Base Price:</div>
                      <div className="price-value">
                        {formatPrice(property.price)}/
                        {property.rentType[0] === 'monthly' ? 'month' : 
                         property.rentType[0] === 'yearly' ? 'year' : 
                         property.rentType[0] === 'hourly' ? 'hour' :
                         property.rentType[0]?.slice(0, -2) || 'unit'}
                      </div>
                    </div>
                    
                    {formData.fromDate && formData.toDate && formData.bookingType && (
                      <div className="price-item total-price-item">
                        <div className="price-label">Total Amount:</div>
                        <div className="total-amount-value">{formatPrice(totalPrice)}</div>
                      </div>
                    )}
                  </div>

                  <hr className="professional-divider" />

                  {/* ✅ BOOKING DETAILS SECTION - NO GAP ISSUES */}
                  <div className="booking-details-section-professional">
                    <h5 className="booking-details-title-professional">📋 Booking Details</h5>
                    
                    <div className="booking-details-content">
                      {formData.fromDate && (
                        <div className="booking-detail-item">
                          <div className="detail-label">Check-in:</div>
                          <div className="detail-value">{new Date(formData.fromDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      
                      {formData.toDate && (
                        <div className="booking-detail-item">
                          <div className="detail-label">Check-out:</div>
                          <div className="detail-value">{new Date(formData.toDate).toLocaleDateString()}</div>
                        </div>
                      )}
                      
                      {formData.bookingType && (
                        <div className="booking-detail-item">
                          <div className="detail-label">Type:</div>
                          <div className="detail-value">{formData.bookingType.charAt(0).toUpperCase() + formData.bookingType.slice(1)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ PERFECT PAYMENT SECTION - FIXED ICON ALIGNMENT */}
                  <div className="payment-section-professional">
                    <div className="payment-alert-professional-v2">
                      <div className="payment-content">
                        <div className="payment-icon">💳</div>
                        <div className="payment-text-content">
                          <div className="payment-title">Payment Mode: On Spot Only</div>
                          <div className="payment-desc">
                            Payment will be made directly to the property owner upon arrival.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <style>{getPerfectFixedStyles()}</style>
    </>
  );
};

// ✅ COMPLETE STYLES FUNCTION WITH ALL FIXES
const getPerfectFixedStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  
  .property-details-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow-x: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    scroll-behavior: smooth;
  }
  
  /* ✅ BACKGROUND ANIMATIONS */
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
    animation: float3 30s ease-in-out infinite;
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

  /* ✅ COMPACT BOOKING CARD - REDUCED HEIGHT */
  .main-booking-card-compact, .property-summary-card {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.8) !important;
    border-radius: 16px !important;
    box-shadow: 
      0 12px 28px rgba(0, 0, 0, 0.06),
      0 4px 12px rgba(124, 58, 237, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
    position: relative;
    z-index: 10;
    animation: cardAppear 0.6s ease-out;
    transition: all 0.3s ease;
  }
  
  .main-booking-card-compact:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 15px 32px rgba(0, 0, 0, 0.08),
      0 5px 15px rgba(124, 58, 237, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.95) !important;
  }

  /* ✅ BOOKING CARD HEADER */
  .booking-header {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
    border-radius: 16px 16px 0 0 !important;
    padding: 1rem 1.25rem !important;
    margin: -1px -1px 0 -1px !important;
    border: none !important;
  }

  /* ✅ PURPLE PROPERTY SUMMARY HEADER */
  .property-summary-header-purple {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
    border-radius: 16px 16px 0 0 !important;
    padding: 1rem 1.25rem !important;
    margin: -1px -1px 0 -1px !important;
    border: none !important;
    color: white !important;
  }

  .booking-main-title {
    font-size: 1.4rem !important;
    font-weight: 800 !important;
    color: white !important;
    line-height: 1.2 !important;
    margin: 0 !important;
  }

  .property-summary-header-purple h6 {
    font-size: 1.1rem !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }

  /* ✅ COMPACT FORM SECTIONS */
  .booking-form-section-compact {
    background: rgba(248, 250, 252, 0.7);
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.08);
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(59, 130, 246, 0.03);
    margin-bottom: 1rem;
  }
  
  .section-header-compact {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(59, 130, 246, 0.06);
  }
  
  .section-title-compact {
    font-weight: 700 !important;
    color: #1e293b !important;
    font-size: 1rem !important;
    margin: 0 !important;
  }
  
  .section-body-compact {
    padding: 1rem;
  }

  /* ✅ COMPACT USER INFO ITEMS */
  .info-item-compact {
    display: flex;
    align-items: center;
    padding: 0.6rem;
    margin-bottom: 0.4rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    border: 1px solid rgba(59, 130, 246, 0.06);
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.02);
  }
  
  .info-item-compact:hover {
    transform: translateX(2px);
    background: rgba(255, 255, 255, 1);
    border-color: rgba(59, 130, 246, 0.08);
    box-shadow: 0 3px 8px rgba(59, 130, 246, 0.04);
  }
  
  .info-item-compact:last-child {
    margin-bottom: 0;
  }
  
  .info-icon-compact {
    font-size: 1.1rem;
    margin-right: 0.6rem;
    width: 20px;
    text-align: center;
  }
  
  .info-content-compact {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  
  .info-label-compact {
    font-size: 0.75rem !important;
    color: #6b7280 !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.2px !important;
    margin-bottom: 0.2rem !important;
  }
  
  .info-value-compact {
    font-size: 0.9rem !important;
    color: #2563eb !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    word-break: break-word !important;
  }

  /* ✅ PERFECT FORM CONTROLS */
  .form-control-perfect {
    border-radius: 10px !important;
    border: 2px solid rgba(209,213,219,0.5) !important;
    padding: 0.7rem 0.9rem !important;
    transition: all 0.2s ease !important;
    background: rgba(255,255,255,0.9) !important;
    font-size: 0.95rem !important;
    font-weight: 500 !important;
  }

  .form-control-perfect:focus {
    border-color: #7c3aed !important;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08) !important;
    background: white !important;
  }

  /* ✅ FIXED DROPDOWN DESIGN */
  .form-control-perfect-dropdown {
    border-radius: 10px !important;
    border: 2px solid rgba(209,213,219,0.5) !important;
    padding: 0.7rem 0.9rem !important;
    transition: all 0.2s ease !important;
    background: rgba(255,255,255,0.95) !important;
    font-size: 0.95rem !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03) !important;
  }

  .form-control-perfect-dropdown:focus {
    border-color: #7c3aed !important;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1), 0 4px 12px rgba(124,58,237,0.08) !important;
    background: white !important;
    outline: none !important;
  }

  .form-control-perfect-dropdown:hover {
    border-color: rgba(124,58,237,0.3) !important;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04) !important;
  }

  .form-control-perfect-dropdown option {
    padding: 0.5rem !important;
    font-weight: 500 !important;
    color: #374151 !important;
    background: white !important;
  }

  /* ✅ PERFECT PROPERTY SUMMARY IMAGE */
  .property-summary-image-perfect {
    width: 100% !important;
    height: 140px !important;
    object-fit: cover !important;
    border-radius: 12px !important;
    margin-bottom: 1rem !important;
    border: 1px solid rgba(59, 130, 246, 0.08) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }

  /* ✅ PROFESSIONAL TEXT DESIGN */
  .property-info-professional {
    margin-bottom: 1rem;
  }

  .property-name-professional {
    font-weight: 800 !important;
    color: #111827 !important;
    font-size: 1.2rem !important;
    line-height: 1.3 !important;
    margin-bottom: 0.75rem !important;
    letter-spacing: -0.01em !important;
  }

  /* ✅ LOCATION NOW VISIBLE AND STYLED */
  .property-location-professional {
    display: flex !important;
    align-items: center;
    margin-bottom: 0.6rem;
    padding: 0.5rem 0.75rem;
    background: rgba(239, 246, 255, 0.6);
    border-radius: 8px;
    border: 1px solid rgba(59, 130, 246, 0.08);
    opacity: 1 !important;
    visibility: visible !important;
  }

  .location-icon {
    font-size: 1rem;
    margin-right: 0.5rem;
    color: #3b82f6;
  }

  .location-text {
    color: #374151 !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  /* ✅ FIXED PROPERTY DETAILS ALIGNMENT - LEFT ALIGNED */
  .property-details-professional {
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
    padding: 0.6rem 0.8rem;
    background: rgba(243, 244, 246, 0.8);
    border-radius: 8px;
    border: 1px solid rgba(156, 163, 175, 0.15);
    gap: 1rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    flex: none;
    justify-content: flex-start;
  }

  .detail-icon {
    font-size: 0.9rem;
    margin-right: 0.4rem;
  }

  .detail-text {
    color: #4b5563 !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    white-space: nowrap;
  }

  .detail-separator {
    margin: 0 0.75rem;
    color: #9ca3af;
    font-weight: bold;
    flex-shrink: 0;
  }

  .professional-divider {
    border: none !important;
    height: 1px !important;
    background: linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.3), transparent) !important;
    margin: 1rem 0 !important;
  }

  /* ✅ PROFESSIONAL PRICING ALIGNMENT - FIXED DUPLICATE TEXT */
  .pricing-section-professional {
    margin-bottom: 1rem;
  }

  .pricing-title-professional {
    color: #111827 !important;
    font-weight: 800 !important;
    font-size: 1rem !important;
    margin-bottom: 0.75rem !important;
  }

  .price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.8rem;
    margin-bottom: 0.4rem;
    background: rgba(249, 250, 251, 0.8);
    border-radius: 8px;
    border: 1px solid rgba(229, 231, 235, 0.6);
    min-height: 40px;
  }

  .price-label {
    color: #6b7280 !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }

  .price-value {
    color: #111827 !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    text-align: right !important;
    line-height: 1.2 !important;
  }

  .total-price-item {
    background: rgba(34, 197, 94, 0.05) !important;
    border: 1px solid rgba(34, 197, 94, 0.15) !important;
  }

  .total-amount-value {
    color: #16a34a !important;
    font-weight: 800 !important;
    font-size: 1.1rem !important;
    text-align: right !important;
  }

  /* ✅ FIXED GAP - BOOKING DETAILS TO PAYMENT MODE */
  .booking-details-section-professional {
    margin-bottom: 0.75rem !important;
  }

  .booking-details-title-professional {
    color: #111827 !important;
    font-weight: 800 !important;
    font-size: 1rem !important;
    margin-bottom: 0.75rem !important;
  }

  .booking-details-content {
    background: rgba(249, 250, 251, 0.6);
    border-radius: 8px;
    padding: 0.75rem;
    border: 1px solid rgba(229, 231, 235, 0.4);
  }

  .booking-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
    min-height: 28px;
  }

  .booking-detail-item:last-child {
    margin-bottom: 0;
  }

  .detail-label {
    color: #6b7280 !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }

  .detail-value {
    color: #111827 !important;
    font-size: 0.9rem !important;
    font-weight: 700 !important;
    text-align: right !important;
    line-height: 1.2 !important;
  }

  /* ✅ PERFECT PAYMENT SECTION - NO EMPTY LABELS */
  .payment-section-professional {
    margin-top: 0 !important;
  }

  /* Hide any empty elements */
  .payment-section-professional > *:empty {
    display: none !important;
  }

  /* ✅ PERFECT PAYMENT ICON AND TEXT ALIGNMENT - VERSION 2 */
  .payment-alert-professional-v2 {
    background: rgba(239, 246, 255, 0.9) !important;
    border: 1px solid rgba(59, 130, 246, 0.2) !important;
    border-radius: 10px !important;
    padding: 0.8rem !important;
    margin-bottom: 0 !important;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05) !important;
  }

  .payment-content {
    display: flex !important;
    align-items: center !important;
    gap: 0.6rem !important;
  }

  .payment-icon {
    font-size: 1.1rem !important;
    color: #1e40af !important;
    margin-top: 0 !important;
    flex-shrink: 0 !important;
    line-height: 1 !important;
  }

  .payment-text-content {
    flex: 1 !important;
  }

  .payment-title {
    color: #1e40af !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.4rem !important;
    line-height: 1.1 !important;
  }

  .payment-desc {
    color: #3730a3 !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
    line-height: 1.4 !important;
  }

  /* ✅ PERFECT BOOK NOW BUTTON */
  .book-now-btn-perfect {
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important;
    border: none !important;
    color: white !important;
    font-weight: 800 !important;
    font-size: 1.1rem !important;
    padding: 0.9rem 1.5rem !important;
    border-radius: 12px !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3) !important;
    text-transform: none !important;
    letter-spacing: 0.3px !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .book-now-btn-perfect:hover:not(:disabled) {
    background: linear-gradient(135deg, #15803d 0%, #16a34a 100%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 24px rgba(34, 197, 94, 0.4) !important;
    color: white !important;
  }

  .book-now-btn-perfect:active:not(:disabled) {
    transform: translateY(0) !important;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3) !important;
  }

  .book-now-btn-perfect:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%) !important;
    cursor: not-allowed !important;
    box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2) !important;
    transform: none !important;
  }

  /* ✅ BACK BUTTON STYLING */
  .back-btn {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 2px solid rgba(99, 102, 241, 0.2) !important;
    color: #4f46e5 !important;
    font-weight: 700 !important;
    font-size: 0.95rem !important;
    padding: 0.6rem 1.2rem !important;
    border-radius: 10px !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 3px 12px rgba(79, 70, 229, 0.1) !important;
    text-decoration: none !important;
  }

  .back-btn:hover {
    background: #4f46e5 !important;
    color: white !important;
    border-color: #4f46e5 !important;
    transform: translateX(-3px) !important;
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.2) !important;
    text-decoration: none !important;
  }

  /* ✅ LOADING STATE */
  .loading-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .loading-text {
    color: #4f46e5 !important;
    font-weight: 600 !important;
    font-size: 1.1rem !important;
  }

  .spinner-border {
    width: 3rem !important;
    height: 3rem !important;
  }

  /* ✅ MODERN ALERT */
  .modern-alert {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(220, 38, 127, 0.2) !important;
    border-radius: 12px !important;
    color: #be185d !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 16px rgba(220, 38, 127, 0.1) !important;
  }

  /* ✅ ANIMATIONS */
  @keyframes cardAppear {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes gridMove {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(50px, 50px);
    }
  }

  @keyframes float1 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(30px, -30px) rotate(120deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(240deg);
    }
  }

  @keyframes float2 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-40px, -20px) rotate(180deg);
    }
  }

  @keyframes float3 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(25px, -35px) scale(1.1);
    }
  }

  @keyframes float4 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(15px, -15px) rotate(90deg);
    }
    50% {
      transform: translate(30px, 10px) rotate(180deg);
    }
    75% {
      transform: translate(10px, 25px) rotate(270deg);
    }
  }

  @keyframes particle1 {
    0% {
      transform: translateY(100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) translateX(50px);
      opacity: 0;
    }
  }

  @keyframes particle2 {
    0% {
      transform: translateY(100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) translateX(-30px);
      opacity: 0;
    }
  }

  @keyframes particle3 {
    0% {
      transform: translateY(100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) translateX(70px);
      opacity: 0;
    }
  }

  @keyframes particle4 {
    0% {
      transform: translateY(100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) translateX(-50px);
      opacity: 0;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  /* ✅ RESPONSIVE DESIGN */
  @media (max-width: 768px) {
    .property-summary-image-perfect {
      height: 120px !important;
    }

    .booking-main-title {
      font-size: 1.2rem !important;
    }

    .property-name-professional {
      font-size: 1.1rem !important;
    }

    .book-now-btn-perfect {
      font-size: 1rem !important;
      padding: 0.8rem 1.2rem !important;
    }

    .back-btn {
      font-size: 0.9rem !important;
      padding: 0.5rem 1rem !important;
    }

    .section-body-compact {
      padding: 0.8rem;
    }

    .info-item-compact {
      padding: 0.5rem;
    }
  }

  @media (max-width: 576px) {
    .property-details-professional {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .detail-separator {
      display: none;
    }

    .detail-item {
      justify-content: center;
    }

    .booking-detail-item {
      flex-direction: column;
      gap: 0.2rem;
      text-align: center;
    }

    .price-item {
      flex-direction: column;
      gap: 0.3rem;
      text-align: center;
    }
  }
`;

export default BookProperty;
