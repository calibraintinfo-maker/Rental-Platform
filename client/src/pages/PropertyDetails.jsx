import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const res = await api.properties.getPropertyById(id);
      setProperty(res.data);
    } catch (err) {
      setError('Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  };

  // Professional SVG Icons (same as MyPropertyStatus)
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      users: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      bed: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M2 4v16"/>
          <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
          <path d="M2 17h20"/>
          <path d="M6 8v9"/>
        </svg>
      ),
      bath: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
          <line x1="10" y1="5" x2="8" y2="7"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="7" y1="19" x2="7" y2="21"/>
          <line x1="17" y1="19" x2="17" y2="21"/>
        </svg>
      ),
      maximize: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
        </svg>
      ),
      dollarSign: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      checkCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      xCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      messageSquare: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      arrowLeft: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12,19 5,12 12,5"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      tag: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <Icon name="checkCircle" size={20} style={{ color: '#10b981' }} />;
      case 'rejected':
        return <Icon name="xCircle" size={20} style={{ color: '#ef4444' }} />;
      case 'pending':
      default:
        return <Icon name="clock" size={20} style={{ color: '#f59e0b' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'verified':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))';
      case 'rejected':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))';
      case 'pending':
      default:
        return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'verified':
        return 'rgba(16, 185, 129, 0.2)';
      case 'rejected':
        return 'rgba(239, 68, 68, 0.2)';
      case 'pending':
      default:
        return 'rgba(245, 158, 11, 0.2)';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        paddingTop: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Animated Grid Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 1,
        }} />
        
        <style>
          {`
            @keyframes gridMove {
              0% { transform: translateX(0) translateY(0); }
              25% { transform: translateX(25px) translateY(0); }
              50% { transform: translateX(25px) translateY(25px); }
              75% { transform: translateX(0) translateY(25px); }
              100% { transform: translateX(0) translateY(0); }
            }
          `}
        </style>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <Spinner 
              animation="border" 
              style={{ 
                color: '#667eea',
                width: '50px',
                height: '50px',
                borderWidth: '4px'
              }} 
            />
            <h4 style={{ 
              marginTop: '20px', 
              color: '#1e293b',
              fontWeight: '700'
            }}>
              Loading Property Details...
            </h4>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '40px'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <Alert 
                variant="danger" 
                style={{
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                  padding: '24px'
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <Icon name="xCircle" size={24} style={{ color: '#ef4444' }} />
                  <div>
                    <h5 style={{ color: '#991b1b', marginBottom: '4px' }}>Error Loading Property</h5>
                    <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
                  </div>
                </div>
              </Alert>
              <div className="text-center mt-3">
                <Button
                  onClick={() => navigate(-1)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  <Icon name="arrowLeft" size={16} className="me-2" />
                  Go Back
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const latestLog = property.verificationLog && property.verificationLog.length > 0
    ? property.verificationLog[property.verificationLog.length - 1]
    : null;

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Animated Grid Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 1,
      }} />

      {/* Floating Orbs */}
      <div style={{
        position: 'fixed',
        top: '15%',
        right: '8%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '10%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 1,
      }} />

      <style>
        {`
          @keyframes gridMove {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(25px) translateY(0); }
            50% { transform: translateX(25px) translateY(25px); }
            75% { transform: translateX(0) translateY(25px); }
            100% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.02); }
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Back Button & Header */}
        <Row className="justify-content-center mb-4">
          <Col lg={10}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <Button
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#64748b',
                  fontWeight: '600',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Icon name="arrowLeft" size={16} />
              </Button>
              <div style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '16px',
                padding: '12px',
                color: 'white'
              }}>
                <Icon name="home" size={24} />
              </div>
              <div>
                <h2 style={{ 
                  fontWeight: '800', 
                  color: '#1e293b', 
                  margin: 0,
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #1e293b, #475569)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Property Details
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                  Complete information about this property
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Main Property Card */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: `2px solid ${getStatusBorderColor(property.verificationStatus)}`,
              padding: '4px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Status Indicator Strip */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: getStatusGradient(property.verificationStatus)
              }} />
              
              <Card.Body className="p-5">
                {/* Header with Title and Status */}
                <div className="d-flex align-items-start justify-content-between mb-4">
                  <div style={{ flex: 1 }}>
                    <h1 style={{ 
                      fontWeight: '800', 
                      color: '#1e293b', 
                      fontSize: '2rem',
                      marginBottom: '12px',
                      lineHeight: '1.2'
                    }}>
                      {property.title}
                    </h1>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <Icon name="mapPin" size={16} style={{ color: '#64748b' }} />
                        <span style={{ 
                          fontSize: '1rem', 
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {property.location || 'Location not specified'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Icon name="tag" size={16} style={{ color: '#64748b' }} />
                        <span style={{ 
                          fontSize: '1rem', 
                          color: '#64748b',
                          fontWeight: '600'
                        }}>
                          {property.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center gap-3">
                    {getStatusIcon(property.verificationStatus)}
                    <Badge 
                      bg={getStatusColor(property.verificationStatus)} 
                      style={{
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {property.verificationStatus}
                    </Badge>
                  </div>
                </div>

                {/* Property Details Grid */}
                <Row className="g-4 mb-5">
                  {/* Price */}
                  <Col md={6} lg={3}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      height: '100%'
                    }}>
                      <Icon name="dollarSign" size={24} style={{ color: '#3b82f6', marginBottom: '8px' }} />
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6', marginBottom: '4px' }}>
                        ₹{property.rent || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                        {property.rentType || 'monthly'}
                      </div>
                    </div>
                  </Col>

                  {/* Size */}
                  <Col md={6} lg={3}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      height: '100%'
                    }}>
                      <Icon name="maximize" size={24} style={{ color: '#10b981', marginBottom: '8px' }} />
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>
                        {property.size || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                        sq ft
                      </div>
                    </div>
                  </Col>

                  {/* Bedrooms */}
                  {property.bedrooms && (
                    <Col md={6} lg={3}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid rgba(245, 158, 11, 0.1)',
                        height: '100%'
                      }}>
                        <Icon name="bed" size={24} style={{ color: '#f59e0b', marginBottom: '8px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginBottom: '4px' }}>
                          {property.bedrooms}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Bedrooms
                        </div>
                      </div>
                    </Col>
                  )}

                  {/* Bathrooms */}
                  {property.bathrooms && (
                    <Col md={6} lg={3}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        height: '100%'
                      }}>
                        <Icon name="bath" size={24} style={{ color: '#8b5cf6', marginBottom: '8px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6', marginBottom: '4px' }}>
                          {property.bathrooms}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                          Bathrooms
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>

                {/* Description */}
                {property.description && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.05))',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(107, 114, 128, 0.1)',
                    marginBottom: '24px'
                  }}>
                    <h4 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '16px',
                      fontSize: '1.2rem'
                    }}>
                      Description
                    </h4>
                    <p style={{ 
                      color: '#374151', 
                      lineHeight: '1.6',
                      margin: 0,
                      fontSize: '1rem'
                    }}>
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                {property.contactNumber && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(34, 197, 94, 0.1)',
                    marginBottom: '24px'
                  }}>
                    <h4 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '16px',
                      fontSize: '1.2rem'
                    }}>
                      Contact Information
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="phone" size={18} style={{ color: '#22c55e' }} />
                      <span style={{ 
                        color: '#374151', 
                        fontSize: '1.1rem',
                        fontWeight: '600'
                      }}>
                        {property.contactNumber}
                      </span>
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                <div style={{
                  background: getStatusGradient(property.verificationStatus),
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${getStatusBorderColor(property.verificationStatus)}`
                }}>
                  <h4 style={{ 
                    fontWeight: '700', 
                    color: '#1e293b', 
                    marginBottom: '16px',
                    fontSize: '1.2rem'
                  }}>
                    Verification Status
                  </h4>
                  
                  {latestLog ? (
                    <>
                      <div className="d-flex align-items-start gap-3 mb-3">
                        <Icon name="messageSquare" size={18} style={{ 
                          color: property.verificationStatus === 'verified' ? '#10b981' : 
                                 property.verificationStatus === 'rejected' ? '#ef4444' : '#f59e0b',
                          marginTop: '2px'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '6px'
                          }}>
                            Admin Remark:
                          </div>
                          <div style={{ 
                            fontSize: '1rem', 
                            color: '#1e293b',
                            lineHeight: '1.5',
                            fontStyle: latestLog.note ? 'normal' : 'italic'
                          }}>
                            {latestLog.note || 'No specific remarks provided'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2">
                        <Icon name="calendar" size={16} style={{ 
                          color: property.verificationStatus === 'verified' ? '#10b981' : 
                                 property.verificationStatus === 'rejected' ? '#ef4444' : '#f59e0b'
                        }} />
                        <span style={{ 
                          fontSize: '0.9rem', 
                          color: '#64748b',
                          fontWeight: '600'
                        }}>
                          Last Updated: {new Date(latestLog.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center gap-3">
                      <Icon name="clock" size={18} style={{ color: '#f59e0b' }} />
                      <div>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          Awaiting Review
                        </div>
                        <div style={{ 
                          fontSize: '0.9rem', 
                          color: '#64748b',
                          fontStyle: 'italic'
                        }}>
                          This property is currently in the review queue
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Property Info */}
                {(property.createdAt || property.updatedAt) && (
                  <Row className="g-3 mt-4">
                    {property.createdAt && (
                      <Col md={6}>
                        <div style={{
                          background: 'rgba(107, 114, 128, 0.05)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(107, 114, 128, 0.1)'
                        }}>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                            Listed On
                          </div>
                          <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>
                            {new Date(property.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </Col>
                    )}
                    
                    {property.updatedAt && (
                      <Col md={6}>
                        <div style={{
                          background: 'rgba(107, 114, 128, 0.05)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(107, 114, 128, 0.1)'
                        }}>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                            Last Modified
                          </div>
                          <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>
                            {new Date(property.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PropertyDetails;
