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
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
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
            <div className="mb-4">
              <Button as={Link} to={`/property/${propertyId}`} variant="outline-secondary" className="mb-3">
                ← Back to Property Details
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">📅 Book Property</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
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

                  <Form.Group className="mb-3">
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
                          {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price)}/{type === 'monthly' ? 'month' : type === 'yearly' ? 'year' : type === 'hourly' ? 'hour' : type.slice(0, -2) || 'unit'}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
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

                  {/* Auto-filled user information */}
                  <Card className="mb-4 bg-light">
                    <Card.Header>
                      <h6 className="mb-0">👤 Your Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p className="mb-1"><strong>Name:</strong> {user?.name || 'Not provided'}</p>
                          <p className="mb-1"><strong>Email:</strong> {user?.email || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><strong>Contact:</strong> {user?.phone || 'Not provided'}</p>
                          <p className="mb-1"><strong>Address:</strong> {user?.address || 'Not provided'}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg"
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
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* ✅ FIXED PROPERTY SUMMARY - ALL ISSUES RESOLVED */}
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h6 className="mb-0">🏠 Property Summary</h6>
              </Card.Header>
              <Card.Body>
                {/* Property Image - FIXED */}
                {property.images && property.images.length > 0 && (
                  <img 
                    src={getImageUrl(property.images[0])} 
                    alt={property.name}
                    className="img-fluid rounded mb-3"
                    style={{ height: '150px', objectFit: 'cover', width: '100%' }}
                  />
                )}
                
                {/* ✅ PROPERTY NAME - FIXED */}
                <h6 className="mb-2">{property.name}</h6>
                
                {/* ✅ LOCATION - NOW VISIBLE AND FIXED */}
                <p className="text-muted mb-2">
                  📍 {property.location || property.address || 'Location not specified'}
                </p>
                
                {/* ✅ PROPERTY DETAILS - FIXED ALIGNMENT */}
                <p className="text-muted mb-3">
                  📐 {property.size} • 🏷️ {property.category}
                </p>

                <hr />

                {/* ✅ PRICING - FIXED DUPLICATE TEXT */}
                <div className="mb-3">
                  <h6 className="mb-2">💰 Pricing</h6>
                  <p className="mb-1">
                    <strong>Base Price:</strong> {formatPrice(property.price)}/
                    {property.rentType[0] === 'monthly' ? 'month' : 
                     property.rentType[0] === 'yearly' ? 'year' : 
                     property.rentType[0] === 'hourly' ? 'hour' :
                     property.rentType[0]?.slice(0, -2) || 'unit'}
                  </p>
                  {totalPrice > 0 && (
                    <p className="mb-1">
                      <strong>Total Amount:</strong> <span className="text-success">{formatPrice(totalPrice)}</span>
                    </p>
                  )}
                </div>

                <hr />

                {/* ✅ BOOKING DETAILS - NO GAPS */}
                <div className="mb-3">
                  <h6 className="mb-2">📋 Booking Details</h6>
                  {formData.fromDate && (
                    <p className="mb-1">
                      <strong>Check-in:</strong> {new Date(formData.fromDate).toLocaleDateString()}
                    </p>
                  )}
                  {formData.toDate && (
                    <p className="mb-1">
                      <strong>Check-out:</strong> {new Date(formData.toDate).toLocaleDateString()}
                    </p>
                  )}
                  {formData.bookingType && (
                    <p className="mb-1">
                      <strong>Type:</strong> {formData.bookingType.charAt(0).toUpperCase() + formData.bookingType.slice(1)}
                    </p>
                  )}
                </div>

                {/* ✅ PAYMENT MODE - PERFECT ALIGNMENT */}
                <Alert variant="info" className="small">
                  <div className="d-flex align-items-center">
                    <span className="me-2">💳</span>
                    <div>
                      <strong>Payment Mode: On Spot Only</strong>
                      <br />
                      <small>Payment will be made directly to the property owner upon arrival.</small>
                    </div>
                  </div>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ✅ SIMPLE CLEAN STYLES - NO ANIMATIONS */}
      <style jsx>{`
        .sticky-top {
          position: -webkit-sticky;
          position: sticky;
        }
        
        .d-grid {
          display: grid;
        }
        
        .d-flex {
          display: flex;
        }
        
        .align-items-center {
          align-items: center;
        }
        
        .me-2 {
          margin-right: 0.5rem;
        }
        
        .text-success {
          color: #198754 !important;
        }
        
        .text-muted {
          color: #6c757d !important;
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </>
  );
};

export default BookProperty;
