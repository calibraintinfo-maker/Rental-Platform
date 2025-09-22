import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { api } from '../utils/api';

const statusColor = {
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
};

const MyPropertyStatus = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const res = await api.properties.getUserProperties({ all: true });
      setProperties(res.data);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Professional SVG Icons
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      checkCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      ),
      xCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      alertCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <path d="M12 16h.01"/>
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

  // Sort: pending first, then rejected, then verified
  const sortedProperties = [...properties].sort((a, b) => {
    const order = { pending: 0, rejected: 1, verified: 2 };
    return (order[a.verificationStatus] ?? 3) - (order[b.verificationStatus] ?? 3);
  });

  const getStatsData = () => {
    const stats = {
      total: properties.length,
      pending: properties.filter(p => p.verificationStatus === 'pending').length,
      verified: properties.filter(p => p.verificationStatus === 'verified').length,
      rejected: properties.filter(p => p.verificationStatus === 'rejected').length
    };
    return stats;
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
              Loading Properties...
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
                  <Icon name="alertCircle" size={24} style={{ color: '#ef4444' }} />
                  <div>
                    <h5 style={{ color: '#991b1b', marginBottom: '4px' }}>Error Loading Properties</h5>
                    <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const stats = getStatsData();

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
        
        {/* Premium Header - NO REFRESH BUTTON */}
        <Row className="justify-content-center mb-4">
          <Col lg={8}>
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
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
                        My Properties Status
                      </h2>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                        Track verification status of all your listed properties
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Stats Row */}
                <Row className="g-3">
                  <Col md={3}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3b82f6' }}>
                        {stats.total}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                        Total Properties
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px solid rgba(245, 158, 11, 0.1)'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b' }}>
                        {stats.pending}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                        Pending Review
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>
                        {stats.verified}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                        Verified
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                      border: '1px solid rgba(239, 68, 68, 0.1)'
                    }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ef4444' }}>
                        {stats.rejected}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                        Rejected
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Properties Grid */}
        <Row className="justify-content-center">
          <Col lg={8}>
            {sortedProperties.length === 0 ? (
              <Card style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px'
              }}>
                <Card.Body className="p-5 text-center">
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05))',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#3b82f6'
                  }}>
                    <Icon name="home" size={32} />
                  </div>
                  <h4 style={{ color: '#1e293b', fontWeight: '700', marginBottom: '8px' }}>
                    No Properties Found
                  </h4>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    You haven't listed any properties yet. Start by adding your first property!
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <Row className="g-4">
                {sortedProperties.map(property => {
                  const latestLog = property.verificationLog && property.verificationLog.length > 0
                    ? property.verificationLog[property.verificationLog.length - 1]
                    : null;

                  return (
                    <Col md={6} key={property._id}>
                      <Card style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        border: `2px solid ${getStatusBorderColor(property.verificationStatus)}`,
                        padding: '4px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
                      }}
                      >
                        {/* Status Indicator Strip */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: getStatusGradient(property.verificationStatus)
                        }} />
                        
                        <Card.Body className="p-4">
                          <div className="d-flex align-items-start justify-content-between mb-3">
                            <div style={{ flex: 1 }}>
                              <h5 style={{ 
                                fontWeight: '700', 
                                color: '#1e293b', 
                                fontSize: '1.2rem',
                                marginBottom: '8px',
                                lineHeight: '1.3'
                              }}>
                                {property.title}
                              </h5>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <Icon name="tag" size={14} style={{ color: '#64748b' }} />
                                <span style={{ 
                                  fontSize: '0.9rem', 
                                  color: '#64748b',
                                  fontWeight: '600'
                                }}>
                                  {property.category}
                                </span>
                              </div>
                            </div>
                            
                            <div className="d-flex align-items-center gap-2">
                              {getStatusIcon(property.verificationStatus)}
                              <Badge 
                                bg={statusColor[property.verificationStatus]} 
                                style={{
                                  borderRadius: '12px',
                                  padding: '6px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                {property.verificationStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Status-specific content */}
                          <div style={{
                            background: getStatusGradient(property.verificationStatus),
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${getStatusBorderColor(property.verificationStatus)}`
                          }}>
                            {latestLog ? (
                              <>
                                <div className="d-flex align-items-start gap-3 mb-3">
                                  <Icon name="messageSquare" size={16} style={{ 
                                    color: property.verificationStatus === 'verified' ? '#10b981' : 
                                           property.verificationStatus === 'rejected' ? '#ef4444' : '#f59e0b',
                                    marginTop: '2px'
                                  }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ 
                                      fontSize: '0.85rem', 
                                      fontWeight: '600',
                                      color: '#374151',
                                      marginBottom: '4px'
                                    }}>
                                      Admin Remark:
                                    </div>
                                    <div style={{ 
                                      fontSize: '0.9rem', 
                                      color: '#1e293b',
                                      lineHeight: '1.4',
                                      fontStyle: latestLog.note ? 'normal' : 'italic'
                                    }}>
                                      {latestLog.note || 'No specific remarks provided'}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="d-flex align-items-center gap-2">
                                  <Icon name="calendar" size={14} style={{ 
                                    color: property.verificationStatus === 'verified' ? '#10b981' : 
                                           property.verificationStatus === 'rejected' ? '#ef4444' : '#f59e0b'
                                  }} />
                                  <span style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#64748b',
                                    fontWeight: '600'
                                  }}>
                                    Updated: {new Date(latestLog.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="d-flex align-items-center gap-3">
                                <Icon name="clock" size={16} style={{ color: '#f59e0b' }} />
                                <div>
                                  <div style={{ 
                                    fontSize: '0.85rem', 
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '2px'
                                  }}>
                                    Awaiting Review
                                  </div>
                                  <div style={{ 
                                    fontSize: '0.8rem', 
                                    color: '#64748b',
                                    fontStyle: 'italic'
                                  }}>
                                    Your property is in the review queue
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPropertyStatus;
