import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample booking data with working images
  const sampleBookings = [
    {
      id: 1,
      propertyTitle: "Luxury Villa in Mumbai",
      bookingDate: "2025-09-25",
      checkIn: "2025-10-01",
      checkOut: "2025-10-03",
      status: "confirmed",
      price: 5000,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format&q=80",
      location: "Mumbai, Maharashtra",
      guestName: "John Doe"
    },
    {
      id: 2,
      propertyTitle: "Modern Apartment in Delhi",
      bookingDate: "2025-09-20",
      checkIn: "2025-09-28",
      checkOut: "2025-09-30",
      status: "pending",
      price: 3500,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format&q=80",
      location: "Delhi, India",
      guestName: "Jane Smith"
    },
    {
      id: 3,
      propertyTitle: "Beach House in Goa",
      bookingDate: "2025-09-15",
      checkIn: "2025-09-22",
      checkOut: "2025-09-25",
      status: "cancelled",
      price: 8000,
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&h=300&fit=crop&auto=format&q=80",
      location: "Goa, India",
      guestName: "Mike Johnson"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookings(sampleBookings);
        setError(null);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleImageError = (e) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format&q=80'
    ];
    e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <section className="py-5 text-white" style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Container className="text-center">
            <h1 className="display-4 fw-bold mb-4">My Bookings</h1>
            <p className="fs-5 opacity-90">Track and manage your property bookings</p>
          </Container>
        </section>
        <Container className="py-5 text-center">
          <Spinner animation="border" style={{ color: '#7c3aed' }} />
          <p className="mt-3 fs-5 fw-semibold">Loading your bookings...</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <section className="py-5 text-white" style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Container className="text-center">
            <h1 className="display-4 fw-bold mb-4">My Bookings</h1>
            <p className="fs-5 opacity-90">Track and manage your property bookings</p>
          </Container>
        </section>
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Error Loading Bookings</Alert.Heading>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section className="py-5 text-white" style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
        minHeight: '320px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float 6s ease-in-out infinite reverse'
        }}></div>
        
        <Container className="position-relative">
          <div className="text-center">
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '8px 20px',
              marginBottom: '20px'
            }}>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'white'
              }}>
                {bookings.length} Active Bookings
              </span>
            </div>
            
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              fontFamily: 'Inter, "Plus Jakarta Sans", system-ui, sans-serif',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              marginBottom: '24px',
              color: 'white'
            }}>
              My Bookings
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Track and manage all your property bookings in one place. 
              View booking details, status updates, and more.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container fluid className="py-5 px-5">
        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 style={{
              fontWeight: '800',
              marginBottom: '8px',
              color: '#111827',
              fontSize: '2.5rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}>
              {bookings.length} Bookings Found
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '0',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '400'
            }}>
              Your complete booking history • Updated {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-5" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '3rem'
          }}>
            <div className="mb-4" style={{ fontSize: '5rem', opacity: '0.6' }}>📋</div>
            <h3 style={{
              fontWeight: '800',
              marginBottom: '16px',
              color: '#111827',
              fontSize: '1.8rem',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              No Bookings Found
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '1.05rem',
              marginBottom: '24px',
              maxWidth: '500px',
              margin: '0 auto 24px auto',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: '1.6'
            }}>
              You haven't made any bookings yet. Start exploring properties to make your first booking.
            </p>
            <Button 
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                border: 'none',
                fontWeight: '700',
                borderRadius: '12px',
                padding: '12px 30px',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
              }}
              size="lg"
              onClick={() => navigate('/find-property')}
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <Row className="row-cols-1 row-cols-md-1 g-4">
            {bookings.map(booking => (
              <Col key={booking.id}>
                <Card className="border-0 shadow-sm" style={{
                  borderRadius: '20px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  minHeight: '240px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                }}>
                  <Row className="g-0 align-items-center">
                    <Col md={4}>
                      <div style={{
                        position: 'relative',
                        height: '240px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={booking.image}
                          alt={booking.propertyTitle + ' Property'}
                          onError={handleImageError}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '20px 0 0 20px'
                          }}
                        />
                        <div className="position-absolute top-0 start-0 p-3">
                          <Badge 
                            bg={getStatusColor(booking.status)} 
                            className="me-2 fw-semibold shadow-sm" 
                            style={{
                              borderRadius: '20px',
                              padding: '8px 14px',
                              fontSize: '0.75rem',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.025em'
                            }}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={8}>
                      <Card.Body className="p-4" style={{
                        minHeight: '240px',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <div className="d-flex align-items-center mb-3">
                          <span className="me-2" style={{ color: '#7c3aed', fontSize: '1.1rem' }}>🏠</span>
                          <span style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {booking.location}
                          </span>
                        </div>
                        
                        <Card.Title style={{
                          color: '#111827',
                          fontSize: '1.5rem',
                          lineHeight: '1.3',
                          fontWeight: '800',
                          marginBottom: '12px',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          letterSpacing: '-0.015em'
                        }}>
                          {booking.propertyTitle}
                        </Card.Title>
                        
                        <p className="mb-3" style={{
                          fontSize: '0.95rem',
                          lineHeight: '1.6',
                          flexGrow: '1',
                          color: '#374151',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontWeight: '400'
                        }}>
                          <strong>Guest:</strong> {booking.guestName}<br/>
                          <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}<br/>
                          <strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}<br/>
                          <strong>Booked:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <div>
                            <div style={{
                              fontSize: '1.6rem',
                              fontWeight: '800',
                              color: '#059669',
                              marginBottom: '4px',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              letterSpacing: '-0.01em'
                            }}>
                              {formatPrice(booking.price)}
                            </div>
                            <small style={{
                              color: '#64748b',
                              fontSize: '0.8rem',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              fontWeight: '500',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Total Amount
                            </small>
                          </div>
                          
                          <div className="d-flex gap-3">
                            <Button 
                              variant="outline-primary" 
                              style={{
                                borderRadius: '12px',
                                padding: '12px 20px',
                                borderWidth: '2px',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                borderColor: '#7c3aed',
                                color: '#7c3aed',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => navigate(`/booking/${booking.id}`)}
                            >
                              View Details
                            </Button>
                            <Button 
                              style={{
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 20px',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                fontFamily: 'Inter, system-ui, sans-serif',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}
                              onClick={() => navigate(`/property/${booking.id}`)}
                            >
                              View Property
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .btn-group .btn:focus {
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3) !important;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #7c3aed !important;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
          }
          
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          
          body {
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 400;
            line-height: 1.6;
            color: #1f2937;
            letter-spacing: 0.005em;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.025em;
            margin-bottom: 0.5em;
            color: #0f172a;
          }
          
          .card-title {
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-weight: 800 !important;
            color: #111827 !important;
            letter-spacing: -0.02em !important;
            line-height: 1.3 !important;
          }
          
          .card-text {
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif !important;
            color: #374151 !important;
            font-weight: 400 !important;
            line-height: 1.6 !important;
          }
          
          .btn {
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif !important;
            font-weight: 700 !important;
            letter-spacing: 0.025em !important;
            transition: all 0.3s ease !important;
            border-radius: 12px !important;
          }
          
          @media (max-width: 768px) {
            .btn-group {
              flex-direction: column !important;
              width: 100% !important;
            }
            .btn-group .btn {
              border-radius: 8px !important;
              margin-bottom: 4px;
            }
            h1 { font-size: 2.5rem !important; }
            h2 { font-size: 2rem !important; }
          }
        `}
      </style>
    </div>
  );
};

export default MyBookings;
