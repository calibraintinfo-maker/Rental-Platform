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
    window.scrollTo(0, 0);
    fetchProperty();
    checkProfileComplete();
    fetchBookedDates();
  }, [propertyId]);

  const fetchBookedDates = async () => {
    try {
      const res = await api.properties.getBookedDates(propertyId);
      setBookedRanges(res.data?.data || []);
    } catch (err) {
      console.warn('Could not fetch booked dates:', err);
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await api.properties.getById(propertyId);
      setProperty(response.data);
      
      if (response.data.rentType && response.data.rentType.length === 1) {
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
      if (response.data && !response.data.profileComplete) {
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
      case 'daily':
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return property.price * Math.max(1, days);
      case 'monthly':
        const months = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
        return property.price * Math.max(1, months);
      case 'yearly':
        const years = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365));
        return property.price * Math.max(1, years);
      default:
        const defaultDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return property.price * Math.max(1, defaultDays);
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
    now.setHours(0, 0, 0, 0);

    if (fromDate < now) {
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

  const getPriceUnit = (type) => {
    switch (type) {
      case 'hourly': return 'hour';
      case 'daily': return 'day';
      case 'monthly': return 'month';
      case 'yearly': return 'year';
      default: return 'day';
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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
            <Card style={{ 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              border: 'none', 
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, #007bff, #0056b3)', 
                color: 'white', 
                padding: '1.5rem', 
                border: 'none' 
              }}>
                <h4 className="mb-0">📅 Book Property</h4>
              </Card.Header>
              <Card.Body style={{ padding: '2rem' }}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '600', color: '#495057', marginBottom: '0.75rem' }}>
                          Select Booking Dates *
                        </Form.Label>
                        <div style={{ 
                          padding: '1rem', 
                          background: '#f8f9fa', 
                          borderRadius: '8px', 
                          border: '2px solid #e9ecef' 
                        }}>
                          <CustomCalendar
                            bookedRanges={bookedRanges}
                            value={formData.fromDate && formData.toDate ? [new Date(formData.fromDate), new Date(formData.toDate)] : null}
                            onChange={range => {
                              if (Array.isArray(range) && range.length === 2) {
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
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#495057', marginBottom: '0.75rem' }}>
                      Booking Type *
                    </Form.Label>
                    <Form.Select
                      name="bookingType"
                      value={formData.bookingType}
                      onChange={handleInputChange}
                      required
                      style={{ 
                        border: '2px solid #e9ecef', 
                        borderRadius: '8px', 
                        padding: '0.75rem 1rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <option value="">Select booking type</option>
                      {property.rentType && property.rentType.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)} - {formatPrice(property.price)}/{getPriceUnit(type)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: '600', color: '#495057', marginBottom: '0.75rem' }}>
                      Additional Notes (Optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or notes for the owner"
                      style={{ 
                        border: '2px solid #e9ecef', 
                        borderRadius: '8px', 
                        padding: '0.75rem 1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </Form.Group>

                  <Card style={{ 
                    background: '#f8f9fa', 
                    border: '2px solid #e9ecef', 
                    borderRadius: '12px',
                    marginBottom: '2rem'
                  }}>
                    <Card.Header style={{ 
                      background: '#e9ecef', 
                      borderBottom: '2px solid #dee2e6', 
                      padding: '1rem 1.5rem' 
                    }}>
                      <h6 className="mb-0">👤 Your Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
                            <strong>Name:</strong> {user?.name || 'Not provided'}
                          </div>
                          <div style={{ padding: '0.5rem 0' }}>
                            <strong>Email:</strong> {user?.email || 'Not provided'}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #e9ecef' }}>
                            <strong>Contact:</strong> {user?.phone || user?.contact || 'Not provided'}
                          </div>
                          <div style={{ padding: '0.5rem 0' }}>
                            <strong>Address:</strong> {user?.address || 'Not provided'}
                          </div>
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
                      style={{
                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '1rem 2rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(40, 167, 69, 0.3)',
                        opacity: (submitting || !formData.fromDate || !formData.toDate || !formData.bookingType) ? '0.6' : '1',
                        cursor: (submitting || !formData.fromDate || !formData.toDate || !formData.bookingType) ? 'not-allowed' : 'pointer'
                      }}
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
            <Card style={{ 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              border: 'none', 
              borderRadius: '12px',
              position: 'sticky',
              top: '20px'
            }}>
              <Card.Header style={{ 
                background: 'linear-gradient(135deg, #6c757d, #495057)', 
                color: 'white', 
                padding: '1rem 1.5rem', 
                border: 'none' 
              }}>
                <h6 className="mb-0">🏠 Property Summary</h6>
              </Card.Header>
              <Card.Body style={{ padding: '1.5rem' }}>
                {/* Property Image */}
                {property.images && property.images.length > 0 && (
                  <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    borderRadius: '8px', 
                    marginBottom: '1rem' 
                  }}>
                    <img 
                      src={getImageUrl(property.images[0])} 
                      alt={property.name || property.title || 'Property'}
                      style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={(e) => {
                        e.target.src = '/placeholder-property.jpg';
                      }}
                    />
                  </div>
                )}
                
                {/* Property Details */}
                <div style={{ marginBottom: '1rem' }}>
                  <h6 style={{ color: '#212529', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {property.name || property.title || 'Property'}
                  </h6>
                  
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    📍 {property.location || property.address?.city || property.address || 'Location not specified'}
                  </div>
                  
                  <div style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '0' }}>
                    📐 {property.size || 'Size not specified'} • 🏷️ {property.category || 'Category not specified'}
                  </div>
                </div>

                <hr />

                {/* Pricing Section */}
                <div style={{ marginBottom: '1rem' }}>
                  <h6 style={{ color: '#495057', fontWeight: '600', marginBottom: '0.75rem' }}>
                    💰 Pricing
                  </h6>
                  <div style={{ padding: '0.25rem 0', color: '#495057' }}>
                    <strong>Base Price:</strong> {formatPrice(property.price)}/
                    {property.rentType && property.rentType.length > 0 ? getPriceUnit(property.rentType[0]) : 'day'}
                  </div>
                  {totalPrice > 0 && (
                    <div style={{ 
                      padding: '0.5rem 0 0.25rem 0', 
                      borderTop: '1px solid #e9ecef', 
                      marginTop: '0.5rem',
                      color: '#495057'
                    }}>
                      <strong>Total Amount:</strong> <span style={{ color: '#28a745', fontWeight: '600', fontSize: '1.1rem' }}>
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  )}
                </div>

                <hr />

                {/* Booking Details Section */}
                <div style={{ marginBottom: '1rem' }}>
                  <h6 style={{ color: '#495057', fontWeight: '600', marginBottom: '0.75rem' }}>
                    📋 Booking Details
                  </h6>
                  {formData.fromDate && (
                    <div style={{ padding: '0.25rem 0', color: '#495057' }}>
                      <strong>Check-in:</strong> {new Date(formData.fromDate).toLocaleDateString()}
                    </div>
                  )}
                  {formData.toDate && (
                    <div style={{ padding: '0.25rem 0', color: '#495057' }}>
                      <strong>Check-out:</strong> {new Date(formData.toDate).toLocaleDateString()}
                    </div>
                  )}
                  {formData.bookingType && (
                    <div style={{ padding: '0.25rem 0', color: '#495057' }}>
                      <strong>Type:</strong> {formData.bookingType.charAt(0).toUpperCase() + formData.bookingType.slice(1)}
                    </div>
                  )}
                </div>

                {/* Payment Info */}
                <Alert 
                  variant="info" 
                  style={{ 
                    border: 'none', 
                    background: '#e7f3ff', 
                    borderLeft: '4px solid #007bff', 
                    marginBottom: '0' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ marginRight: '0.75rem', fontSize: '1.2rem', marginTop: '0.1rem' }}>
                      💳
                    </span>
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
    </div>
  );
};

export default BookProperty;
