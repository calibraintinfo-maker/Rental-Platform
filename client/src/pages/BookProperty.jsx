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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)' }}>
        <Container className="py-5">
          <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Col xs={12} className="text-center">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ fontSize: '1.1rem', color: '#6b7280' }}>Loading booking details...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)' }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6}>
              <Card style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)', 
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
              }}>
                <Card.Body className="p-4 text-center">
                  <h4>Property not found</h4>
                  <Button as={Link} to="/find-property" variant="primary">
                    ← Back to Properties
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (profileIncomplete) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)' }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card style={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(20px)', 
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
              }}>
                <Card.Body className="p-5 text-center">
                  <h4>Complete Your Profile</h4>
                  <p>You need to complete your profile before booking properties.</p>
                  <Button as={Link} to="/profile" variant="primary" size="lg">
                    Complete Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const totalPrice = calculatePrice();

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        {/* Background Animation */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {/* Animated gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.04) 0%, transparent 25%, rgba(59, 130, 246, 0.03) 50%, transparent 75%, rgba(16, 185, 129, 0.04) 100%)',
            animation: 'gradientShift 15s ease-in-out infinite'
          }} />
          
          {/* Grid overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridMove 25s linear infinite'
          }} />
        </div>

        <Container className="py-4" style={{ position: 'relative', zIndex: 10 }}>
          <Row>
            <Col>
              <div className="mb-4">
                <Button 
                  as={Link} 
                  to={`/property/${propertyId}`} 
                  variant="outline-secondary" 
                  className="mb-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1.5px solid rgba(209, 213, 219, 0.6)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ← Back to Property Details
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={8}>
              <Card style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 25px rgba(124, 58, 237, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease',
                animation: 'cardAppear 0.8s ease-out'
              }}>
                <Card.Header style={{ 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', 
                  color: 'white', 
                  padding: '1.5rem', 
                  border: 'none',
                  borderRadius: '20px 20px 0 0'
                }}>
                  <h4 className="mb-0" style={{ fontWeight: '700', fontSize: '1.5rem' }}>📅 Book Your Space</h4>
                </Card.Header>
                <Card.Body style={{ padding: '2rem 1.75rem' }}>
                  {error && (
                    <Alert 
                      variant="danger" 
                      style={{
                        background: 'rgba(254, 242, 242, 0.9)',
                        border: '1px solid rgba(248, 113, 113, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '1.5rem',
                        color: '#dc2626',
                        fontSize: '0.9rem'
                      }}
                    >
                      <strong>Error:</strong> {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Calendar Section */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <Form.Label style={{ 
                        color: '#374151', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        marginBottom: '10px', 
                        display: 'block' 
                      }}>
                        Select Booking Dates *
                      </Form.Label>
                      <div style={{ 
                        padding: '1.5rem', 
                        background: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '12px', 
                        border: '2px solid rgba(209, 213, 219, 0.6)',
                        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)'
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
                    </div>

                    {/* Booking Type */}
                    <Form.Group style={{ marginBottom: '1.5rem' }}>
                      <Form.Label style={{ 
                        color: '#374151', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        marginBottom: '8px', 
                        display: 'block' 
                      }}>
                        Booking Type *
                      </Form.Label>
                      <Form.Select
                        name="bookingType"
                        value={formData.bookingType}
                        onChange={handleInputChange}
                        required
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1.5px solid rgba(209, 213, 219, 0.6)',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          color: '#111827',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          fontFamily: "'Inter', sans-serif",
                          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)'
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

                    {/* Notes */}
                    <Form.Group style={{ marginBottom: '1.5rem' }}>
                      <Form.Label style={{ 
                        color: '#374151', 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        marginBottom: '8px', 
                        display: 'block' 
                      }}>
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
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1.5px solid rgba(209, 213, 219, 0.6)',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          color: '#111827',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          fontFamily: "'Inter', sans-serif",
                          boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                    </Form.Group>

                    {/* ✅ IMPROVED: Your Information Card */}
                    <Card style={{ 
                      background: 'linear-gradient(135deg, rgba(248, 249, 250, 0.95) 0%, rgba(243, 244, 246, 0.9) 100%)', 
                      border: '1px solid rgba(209, 213, 219, 0.4)', 
                      borderRadius: '16px',
                      marginBottom: '2rem',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                      overflow: 'hidden'
                    }}>
                      <Card.Header style={{ 
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', 
                        borderBottom: '1px solid rgba(209, 213, 219, 0.3)', 
                        padding: '1.25rem 1.5rem',
                        borderRadius: '16px 16px 0 0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', 
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem'
                          }}>
                            👤
                          </div>
                          <h6 className="mb-0" style={{ 
                            fontWeight: '700', 
                            fontSize: '1.1rem', 
                            color: '#1f2937',
                            letterSpacing: '0.025em'
                          }}>
                            Your Information
                          </h6>
                        </div>
                      </Card.Header>
                      <Card.Body style={{ padding: '1.75rem 1.5rem' }}>
                        <Row>
                          <Col md={6}>
                            <div style={{ marginBottom: '1.25rem' }}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '10px',
                                border: '1px solid rgba(209, 213, 219, 0.2)'
                              }}>
                                <div style={{ 
                                  width: '28px', 
                                  height: '28px', 
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.85rem',
                                  color: 'white'
                                }}>
                                  👨
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#6b7280', 
                                    fontWeight: '500',
                                    marginBottom: '2px'
                                  }}>
                                    Full Name
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.95rem', 
                                    color: '#1f2937', 
                                    fontWeight: '600' 
                                  }}>
                                    {user?.name || 'Not provided'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '10px',
                                border: '1px solid rgba(209, 213, 219, 0.2)'
                              }}>
                                <div style={{ 
                                  width: '28px', 
                                  height: '28px', 
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.85rem',
                                  color: 'white'
                                }}>
                                  ✉️
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#6b7280', 
                                    fontWeight: '500',
                                    marginBottom: '2px'
                                  }}>
                                    Email Address
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.9rem', 
                                    color: '#1f2937', 
                                    fontWeight: '600',
                                    wordBreak: 'break-all'
                                  }}>
                                    {user?.email || 'Not provided'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          
                          <Col md={6}>
                            <div style={{ marginBottom: '1.25rem' }}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '10px',
                                border: '1px solid rgba(209, 213, 219, 0.2)'
                              }}>
                                <div style={{ 
                                  width: '28px', 
                                  height: '28px', 
                                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.85rem',
                                  color: 'white'
                                }}>
                                  📞
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#6b7280', 
                                    fontWeight: '500',
                                    marginBottom: '2px'
                                  }}>
                                    Phone Number
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.95rem', 
                                    color: '#1f2937', 
                                    fontWeight: '600' 
                                  }}>
                                    {user?.phone || user?.contact || 'Not provided'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '10px',
                                border: '1px solid rgba(209, 213, 219, 0.2)'
                              }}>
                                <div style={{ 
                                  width: '28px', 
                                  height: '28px', 
                                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.85rem',
                                  color: 'white'
                                }}>
                                  📍
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#6b7280', 
                                    fontWeight: '500',
                                    marginBottom: '2px'
                                  }}>
                                    Address
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.9rem', 
                                    color: '#1f2937', 
                                    fontWeight: '600',
                                    lineHeight: '1.4'
                                  }}>
                                    {user?.address || 'Not provided'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        disabled={submitting || !formData.fromDate || !formData.toDate || !formData.bookingType}
                        style={{
                          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '12px 20px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          width: '100%',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 6px 20px rgba(124, 58, 237, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          fontFamily: "'Inter', sans-serif",
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          opacity: (submitting || !formData.fromDate || !formData.toDate || !formData.bookingType) ? '0.7' : '1',
                          cursor: (submitting || !formData.fromDate || !formData.toDate || !formData.bookingType) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span>Creating Booking...</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '1rem' }}>🚀</span>
                            <span>BOOK NOW</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* ✅ IMPROVED: Property Summary Sidebar - Perfect size and design */}
            <Col lg={4}>
              <Card style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '18px',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(124, 58, 237, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                position: 'sticky',
                top: '20px',
                animation: 'cardAppear 0.8s ease-out',
                maxWidth: '420px', // ✅ PERFECT SIZE
                width: '100%'
              }}>
                {/* ✅ Purple header */}
                <Card.Header style={{ 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', 
                  color: 'white', 
                  padding: '1.2rem 1.5rem', 
                  border: 'none',
                  borderRadius: '18px 18px 0 0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ fontSize: '1.2rem' }}>🏠</div>
                    <h6 className="mb-0" style={{ fontWeight: '700', fontSize: '1.05rem' }}>Property Summary</h6>
                  </div>
                </Card.Header>
                <Card.Body style={{ padding: '1.4rem 1.3rem' }}>
                  {/* Property Image */}
                  {property.images && property.images.length > 0 && (
                    <div style={{ 
                      position: 'relative', 
                      overflow: 'hidden', 
                      borderRadius: '12px', 
                      marginBottom: '1.1rem',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
                    }}>
                      <img 
                        src={getImageUrl(property.images[0])} 
                        alt={property.name || property.title || 'Property'}
                        style={{ 
                          width: '100%', 
                          height: '140px', 
                          objectFit: 'cover', 
                          borderRadius: '12px',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.src = '/placeholder-property.jpg';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* ✅ IMPROVED: Property Details */}
                  <div style={{ marginBottom: '1.1rem' }}>
                    <h5 style={{ 
                      color: '#111827', 
                      fontWeight: '700', 
                      marginBottom: '0.7rem', 
                      fontSize: '1.1rem',
                      lineHeight: '1.3' 
                    }}>
                      {property.name || property.title || 'Property'}
                    </h5>
                    
                    <div style={{ 
                      color: '#6b7280', 
                      fontSize: '0.9rem', 
                      marginBottom: '0.6rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <span style={{ minWidth: '16px', fontSize: '0.85rem' }}>📍</span>
                      <span style={{ lineHeight: '1.4' }}>{property.location || property.address?.city || property.address || 'Location not specified'}</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.85rem',
                      color: '#6b7280'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem' }}>📐</span>
                        <span style={{ color: '#374151', fontWeight: '600' }}>{property.size || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem' }}>🏷️</span>
                        <span style={{ color: '#374151', fontWeight: '600' }}>{property.category || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ margin: '1.1rem 0', borderColor: 'rgba(209, 213, 219, 0.4)' }} />

                  {/* ✅ IMPROVED: Total Amount Section */}
                  <div style={{ marginBottom: '1.1rem' }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.7rem'
                    }}>
                      <div style={{ fontSize: '1.1rem' }}>💰</div>
                      <h6 style={{ 
                        color: '#374151', 
                        fontWeight: '700', 
                        fontSize: '0.95rem',
                        margin: 0
                      }}>
                        Total Amount
                      </h6>
                    </div>
                    {totalPrice > 0 ? (
                      <div style={{ 
                        padding: '1rem', 
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(34, 197, 94, 0.2)',
                        textAlign: 'center'
                      }}>
                        <div style={{ 
                          color: '#047857', 
                          fontWeight: '800', 
                          fontSize: '1.35rem',
                          marginBottom: '0.25rem'
                        }}>
                          {formatPrice(totalPrice)}
                        </div>
                        <div style={{ 
                          color: '#059669', 
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          For your selected dates
                        </div>
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '0.95rem', 
                        background: 'rgba(107, 114, 128, 0.08)',
                        borderRadius: '10px',
                        border: '1.5px solid rgba(209, 213, 219, 0.3)',
                        textAlign: 'center',
                        color: '#6b7280',
                        fontSize: '0.85rem'
                      }}>
                        Select dates and booking type to see total price
                      </div>
                    )}
                  </div>

                  <hr style={{ margin: '1.1rem 0', borderColor: 'rgba(209, 213, 219, 0.4)' }} />

                  {/* ✅ IMPROVED: Booking Details Section */}
                  <div style={{ marginBottom: '1.1rem' }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.7rem'
                    }}>
                      <div style={{ fontSize: '1.1rem' }}>📋</div>
                      <h6 style={{ 
                        color: '#374151', 
                        fontWeight: '700', 
                        fontSize: '0.95rem',
                        margin: 0
                      }}>
                        Booking Details
                      </h6>
                    </div>
                    <div style={{ 
                      padding: '0.95rem', 
                      background: 'rgba(248, 249, 250, 0.7)',
                      borderRadius: '10px',
                      border: '1px solid rgba(209, 213, 219, 0.25)'
                    }}>
                      {formData.fromDate ? (
                        <div style={{ 
                          padding: '0.45rem 0', 
                          color: '#374151', 
                          fontSize: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontWeight: '600' }}>Check-in:</span> 
                          <span style={{ color: '#059669', fontWeight: '600' }}>
                            {new Date(formData.fromDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center' }}>
                          Select check-in date
                        </div>
                      )}
                      {formData.toDate ? (
                        <div style={{ 
                          padding: '0.45rem 0', 
                          color: '#374151', 
                          fontSize: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: formData.fromDate ? '1px solid rgba(209, 213, 219, 0.3)' : 'none'
                        }}>
                          <span style={{ fontWeight: '600' }}>Check-out:</span> 
                          <span style={{ color: '#dc2626', fontWeight: '600' }}>
                            {new Date(formData.toDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : formData.fromDate && (
                        <div style={{ 
                          color: '#9ca3af', 
                          fontSize: '0.8rem', 
                          textAlign: 'center',
                          paddingTop: '0.45rem',
                          borderTop: '1px solid rgba(209, 213, 219, 0.3)'
                        }}>
                          Select check-out date
                        </div>
                      )}
                      {formData.bookingType && (
                        <div style={{ 
                          padding: '0.45rem 0', 
                          color: '#374151', 
                          fontSize: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid rgba(209, 213, 219, 0.3)'
                        }}>
                          <span style={{ fontWeight: '600' }}>Type:</span> 
                          <span style={{ 
                            color: '#7c3aed', 
                            fontWeight: '600',
                            background: 'rgba(124, 58, 237, 0.1)',
                            padding: '0.2rem 0.45rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem'
                          }}>
                            {formData.bookingType.charAt(0).toUpperCase() + formData.bookingType.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <Alert 
                    variant="info" 
                    style={{ 
                      border: 'none', 
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)', 
                      borderLeft: '3px solid #3b82f6', 
                      marginBottom: '0',
                      borderRadius: '10px',
                      padding: '0.95rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.1rem', marginTop: '0.1rem' }}>
                        💳
                      </span>
                      <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                        <strong style={{ color: '#1e40af', display: 'block', marginBottom: '0.2rem' }}>
                          Payment Mode: On Spot Only
                        </strong>
                        <span style={{ color: '#3730a3' }}>
                          Payment will be made directly to the property owner upon arrival.
                        </span>
                      </div>
                    </div>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
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
        
        .form-control:focus, .form-select:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
          transform: scale(1.01);
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.35) !important;
        }
        
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookProperty;
