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

  // ✅ YOUR EXACT ORIGINAL LOGIC
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
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading booking details...</p>
        </div>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Property not found</Alert>
        <Button as={Link} to="/find-property" variant="primary">
          ← Back to Properties
        </Button>
      </Container>
    );
  }

  if (profileIncomplete) {
    return (
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
    );
  }

  const totalPrice = calculatePrice();

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col>
            <div className="mb-3">
              <Button as={Link} to={`/property/${propertyId}`} variant="outline-secondary" className="mb-2">
                ← Back to Property Details
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            {/* ✅ COMPACT MAIN FORM - REDUCED VERTICAL SPACING */}
            <Card className="modern-booking-card">
              <Card.Header className="bg-primary text-white compact-header">
                <h4 className="mb-0">📅 Book Property</h4>
              </Card.Header>
              <Card.Body className="compact-body">
                {error && <Alert variant="danger" className="compact-alert">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label>Select Booking Dates *</Form.Label>
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
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-2">
                    <Form.Label>Booking Type *</Form.Label>
                    <Form.Select
                      name="bookingType"
                      value={formData.bookingType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select booking type</option>
                      {property.rentType.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price, type)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Notes (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or notes for the owner"
                    />
                  </Form.Group>

                  {/* ✅ COMPACT AUTO-FILLED USER INFORMATION - EXACT SAME AS ORIGINAL */}
                  <Card className="mb-3 bg-light compact-user-card">
                    <Card.Header className="compact-user-header">
                      <h6 className="mb-0">👤 Your Information</h6>
                    </Card.Header>
                    <Card.Body className="compact-user-body">
                      <Row>
                        <Col md={6}>
                          <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
                          <p className="mb-1"><strong>Email:</strong> {user?.email}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><strong>Contact:</strong> {user?.contact}</p>
                          <p className="mb-1"><strong>Address:</strong> {user?.address}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
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
            {/* ✅ PERFECT BOOKING SUMMARY - EXACT SAME LOGIC AS YOUR ORIGINAL */}
            <Card className="sticky-top perfect-summary-card" style={{ top: '20px' }}>
              <Card.Header className="perfect-summary-header">
                <h6 className="mb-0">🏠 Property Summary</h6>
              </Card.Header>
              <Card.Body className="perfect-summary-body">
                <img 
                  src={getImageUrl(property.image)} 
                  alt={property.title}
                  className="img-fluid rounded mb-3 property-summary-img"
                />
                
                <h6 className="property-title-summary mb-2">{property.title}</h6>
                <p className="property-location-summary text-muted mb-2">
                  📍 {property.address.city}, {property.address.state}
                </p>
                <p className="property-details-summary text-muted mb-3">
                  📐 {property.size} • 🏷️ {property.category}
                </p>

                <hr className="summary-divider" />

                <div className="mb-3">
                  <h6 className="pricing-title mb-2">💰 Pricing</h6>
                  <p className="mb-1">
                    <strong>Base Price:</strong> {formatPrice(property.price, formData.bookingType || property.rentType[0])}
                  </p>
                  {totalPrice > 0 && (
                    <p className="mb-1">
                      <strong>Total Amount:</strong> <span className="text-success">₹{totalPrice.toLocaleString()}</span>
                    </p>
                  )}
                </div>

                <hr className="summary-divider" />

                <div className="mb-3">
                  <h6 className="booking-details-title mb-2">📋 Booking Details</h6>
                  {formData.fromDate && (
                    <p className="mb-1">
                      <strong>Start:</strong> {new Date(formData.fromDate).toLocaleDateString()}
                    </p>
                  )}
                  {formData.toDate && (
                    <p className="mb-1">
                      <strong>End:</strong> {new Date(formData.toDate).toLocaleDateString()}
                    </p>
                  )}
                  {formData.bookingType && (
                    <p className="mb-1">
                      <strong>Type:</strong> {formData.bookingType}
                    </p>
                  )}
                </div>

                <Alert variant="info" className="small payment-alert">
                  <strong>💳 Payment Mode:</strong> On Spot Only
                  <br />
                  <small>Payment will be made directly to the property owner upon arrival.</small>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ✅ COMPACT STYLES - ONLY REDUCES VERTICAL SPACING, KEEPS TEXT SIZES */}
      <style>{`
        /* ✅ MODERN BOOKING CARD - REDUCED VERTICAL SPACING */
        .modern-booking-card {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .compact-header {
          padding: 0.75rem 1rem !important; /* Reduced from default 1rem 1.5rem */
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
        }

        .compact-header h4 {
          font-size: 1.25rem; /* Normal size, not smaller */
          font-weight: 700;
        }

        .compact-body {
          padding: 1rem !important; /* Reduced from default 1.5rem */
        }

        .compact-alert {
          margin-bottom: 0.75rem !important; /* Reduced from default 1rem */
          border-radius: 8px;
        }

        /* ✅ FORM SPACING - REDUCED MARGINS ONLY */
        .compact-body .form-group, 
        .compact-body .mb-2 {
          margin-bottom: 0.75rem !important;
        }

        .compact-body .mb-3 {
          margin-bottom: 1rem !important;
        }

        .compact-body .form-label {
          font-weight: 600;
          margin-bottom: 0.4rem !important;
          color: #374151;
        }

        .compact-body .form-control,
        .compact-body .form-select {
          border-radius: 6px;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
        }

        .compact-body .form-control:focus,
        .compact-body .form-select:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25);
        }

        /* ✅ COMPACT USER INFO CARD */
        .compact-user-card {
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.08);
        }

        .compact-user-header {
          padding: 0.5rem 0.75rem !important; /* Reduced padding */
          background: #f8f9fa;
        }

        .compact-user-header h6 {
          font-size: 0.9rem; /* Keep normal readable size */
          font-weight: 700;
          color: #374151;
        }

        .compact-user-body {
          padding: 0.75rem !important; /* Reduced from default 1rem */
        }

        .compact-user-body p {
          margin-bottom: 0.4rem !important; /* Reduced spacing */
          font-size: 0.875rem; /* Normal readable size */
        }

        .compact-user-body strong {
          color: #374151;
        }

        /* ✅ PERFECT SUMMARY CARD - MATCHES YOUR ORIGINAL DESIGN */
        .perfect-summary-card {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .perfect-summary-header {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          padding: 0.75rem 1rem;
          border: none;
        }

        .perfect-summary-header h6 {
          font-size: 0.9rem;
          font-weight: 700;
          margin: 0;
        }

        .perfect-summary-body {
          padding: 1rem;
        }

        .property-summary-img {
          height: 150px;
          object-fit: cover;
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .property-title-summary {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.3;
        }

        .property-location-summary {
          font-size: 0.875rem;
          color: #6b7280 !important;
        }

        .property-details-summary {
          font-size: 0.875rem;
          color: #6b7280 !important;
        }

        .summary-divider {
          margin: 0.75rem 0;
          border-top: 1px solid #e5e7eb;
        }

        .pricing-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #374151;
        }

        .booking-details-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #374151;
        }

        .perfect-summary-body p {
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .perfect-summary-body strong {
          color: #374151;
        }

        .payment-alert {
          background-color: rgba(219, 234, 254, 0.5) !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
          border-radius: 8px !important;
          padding: 0.75rem !important;
          margin: 0 !important;
        }

        .payment-alert strong {
          color: #1d4ed8;
        }

        .payment-alert small {
          color: #1e40af;
        }

        /* ✅ SUBMIT BUTTON */
        .compact-body .btn-primary {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .compact-body .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #047857 0%, #059669 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }

        .compact-body .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        /* ✅ RESPONSIVE DESIGN */
        @media (max-width: 991.98px) {
          .perfect-summary-card {
            position: static !important;
            margin-top: 1rem;
          }
        }

        @media (max-width: 767.98px) {
          .compact-header {
            padding: 0.5rem 0.75rem !important;
          }
          
          .compact-body {
            padding: 0.75rem !important;
          }
          
          .perfect-summary-body {
            padding: 0.75rem;
          }
          
          .property-summary-img {
            height: 120px;
          }
        }
      `}</style>
    </>
  );
};

export default BookProperty;
