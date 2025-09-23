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
      <>
        <div className="book-container">
          <Container className="py-4">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading booking details...</p>
            </div>
          </Container>
        </div>
        <style>{getStyles()}</style>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="book-container">
          <Container className="py-4">
            <Alert variant="danger">Property not found</Alert>
            <Button as={Link} to="/find-property" variant="primary">
              ← Back to Properties
            </Button>
          </Container>
        </div>
        <style>{getStyles()}</style>
      </>
    );
  }

  if (profileIncomplete) {
    return (
      <>
        <div className="book-container">
          <Container className="py-4">
            <Row className="justify-content-center">
              <Col md={8}>
                <Alert variant="warning" className="text-center">
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
        <style>{getStyles()}</style>
      </>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <>
      <div className="book-container">
        <Container className="py-4">
          <Row>
            <Col>
              <div className="mb-3">
                <Button as={Link} to={`/property/${propertyId}`} variant="outline-secondary" className="back-btn">
                  ← Back to Property
                </Button>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={8}>
              <Card className="booking-card shadow-sm">
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
                <Card className="summary-card shadow-sm">
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
      <style>{getStyles()}</style>
    </>
  );
};

const getStyles = () => `
  .book-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
  }

  /* Fixed button styling */
  .back-btn {
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 500;
    border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: white;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  .back-btn:hover {
    background: rgba(255,255,255,0.2);
    color: white;
    transform: translateY(-1px);
  }

  /* Card styling */
  .booking-card, .summary-card {
    border: none;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  }

  .booking-header {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    color: white;
    padding: 1.5rem 2rem;
    border: none;
  }

  .summary-header {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 1rem 1.5rem;
    border: none;
  }

  /* Form sections */
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

  /* Form controls */
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

  /* Calendar wrapper */
  .calendar-wrapper {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(209,213,219,0.3);
  }

  /* User info card */
  .user-info-card {
    background: rgba(59,130,246,0.05);
    border: 1px solid rgba(59,130,246,0.1);
    border-radius: 12px;
  }

  .user-info-card .card-header {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 0.75rem 1rem;
    border: none;
  }

  .info-item {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .info-item:last-child {
    margin-bottom: 0;
  }

  /* Button */
  .confirm-btn {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 6px 20px rgba(124,58,237,0.3);
    transition: all 0.3s ease;
  }

  .confirm-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(124,58,237,0.4);
  }

  .confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Sidebar */
  .sidebar-sticky {
    position: sticky;
    top: 2rem;
  }

  /* Property preview */
  .property-img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }

  .property-name {
    font-weight: 700;
    color: #111827;
    font-size: 1.1rem;
    line-height: 1.3;
  }

  .property-location {
    color: #6b7280;
    font-size: 0.85rem;
    margin: 0;
  }

  .property-specs {
    color: #9ca3af;
    font-size: 0.8rem;
    margin: 0;
  }

  /* Pricing */
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
    font-size: 0.9rem;
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
    font-size: 1.1rem;
  }

  /* Booking details */
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
    font-size: 0.9rem;
  }

  .detail-row:last-child {
    margin-bottom: 0;
  }

  .booking-type {
    color: #7c3aed;
    font-weight: 600;
    text-transform: capitalize;
  }

  /* Payment alert */
  .payment-alert {
    background: rgba(59,130,246,0.1);
    border: 1px solid rgba(59,130,246,0.2);
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.85rem;
    margin-bottom: 0;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .book-container {
      padding: 0;
    }

    .booking-header {
      padding: 1rem 1.5rem;
    }

    .booking-card .card-body {
      padding: 1.5rem;
    }

    .form-section {
      padding: 1rem;
    }

    .sidebar-sticky {
      position: relative;
      top: 0;
    }

    .property-img {
      height: 120px;
    }

    .back-btn {
      padding: 6px 12px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 576px) {
    .booking-header h4 {
      font-size: 1.1rem;
    }
    
    .booking-header p {
      font-size: 0.8rem;
    }

    .confirm-btn {
      padding: 0.875rem 1.5rem;
      font-size: 0.9rem;
    }

    .property-img {
      height: 100px;
    }
  }
`;

export default BookProperty;
