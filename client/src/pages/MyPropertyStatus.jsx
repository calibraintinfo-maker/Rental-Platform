import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    setError('');
    
    try {
      // Check if user is authenticated first
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to view your properties');
        setLoading(false);
        return;
      }

      const res = await api.properties.getUserProperties({ all: true });
      
      if (res && res.data) {
        setProperties(res.data);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.response?.status === 404) {
        setError('Properties endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.message?.includes('Network Error')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch properties');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ PERFECT ICONS 
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      arrowLeft: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12,19 5,12 12,5"/>
        </svg>
      ),
      refresh: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <polyline points="23,4 23,10 17,10"/>
          <polyline points="1,20 1,14 7,14"/>
          <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"/>
        </svg>
      ),
      login: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className={className}>
          <path d="M15,3H19A2,2,0,0,1,21,5V19a2,2,0,0,1-2,2H15"/>
          <polyline points="10,17 15,12 10,7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      tag: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className={className}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      alertTriangle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className={className}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <path d="M12 17h.01"/>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      checkCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      ),
      xCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      messageSquare: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <Icon name="checkCircle" size={20} />;
      case 'rejected':
        return <Icon name="xCircle" size={20} />;
      case 'pending':
      default:
        return <Icon name="clock" size={20} />;
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
      <>
        <div style={containerStyle}>
          <Container className="py-4">
            <div className="text-center">
              <div style={loadingStyle}>
                <Icon name="sparkles" size={40} />
                <div className="spinner-border text-primary" role="status" style={{ margin: '20px 0' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4>Loading Properties...</h4>
                <p className="text-muted">Please wait while we fetch your property information</p>
              </div>
            </div>
          </Container>
        </div>
        <style>{getStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div style={containerStyle}>
          <Container className="py-4">
            <div className="text-center">
              <div style={errorStyle}>
                <Icon name="alertTriangle" size={40} className="text-warning mb-3" />
                <h4>Unable to Load Properties</h4>
                <p className="text-muted mb-4">{error}</p>
                
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  {error.includes('log in') || error.includes('Authentication') ? (
                    <Button as={Link} to="/login" variant="primary">
                      <Icon name="login" size={16} className="me-2" />
                      Go to Login
                    </Button>
                  ) : (
                    <Button onClick={fetchAllProperties} variant="success">
                      <Icon name="refresh" size={16} className="me-2" />
                      Try Again
                    </Button>
                  )}
                  
                  <Button as={Link} to="/dashboard" variant="outline-secondary">
                    <Icon name="arrowLeft" size={16} className="me-2" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
        <style>{getStyles()}</style>
      </>
    );
  }

  const stats = getStatsData();

  return (
    <>
      <div style={containerStyle}>
        {/* ✅ EXACT PROPERTYDETAILS LAYOUT */}
        <Container className="py-4" style={{ maxWidth: '1200px' }}>
          
          {/* Back Navigation */}
          <div className="mb-4">
            <Button as={Link} to="/dashboard" variant="outline-secondary" size="sm">
              <Icon name="arrowLeft" size={16} className="me-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* ✅ MAIN CONTENT - EXACT SAME LAYOUT AS PROPERTYDETAILS */}
          <Row className="g-4">
            
            {/* ✅ LEFT SIDE - PROPERTY CARDS (Same width as PropertyDetails) */}
            <Col lg={8}>
              
              {/* Header Card */}
              <Card className="mb-4" style={cardStyle}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div style={iconStyle}>
                      <Icon name="home" size={24} />
                    </div>
                    <div className="ms-3">
                      <h1 className="mb-2" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b' }}>
                        My Properties Status
                      </h1>
                      <p className="text-muted mb-0">
                        📍 Track verification status of all your listed properties
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Properties List */}
              {sortedProperties.length === 0 ? (
                <Card style={cardStyle}>
                  <Card.Body className="p-5 text-center">
                    <div className="mb-4">
                      <Icon name="home" size={48} className="text-muted" />
                    </div>
                    <h4 className="mb-3">No Properties Found</h4>
                    <p className="text-muted mb-4">
                      You haven't listed any properties yet. Start by adding your first property!
                    </p>
                    <Button as={Link} to="/add-property" variant="primary" size="lg">
                      Add Your First Property
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <>
                  {sortedProperties.map(property => {
                    const latestLog = property.verificationLog && property.verificationLog.length > 0
                      ? property.verificationLog[property.verificationLog.length - 1]
                      : null;

                    return (
                      <Card className="mb-4" key={property._id} style={cardStyle}>
                        <Card.Body className="p-4">
                          
                          {/* Property Header */}
                          <div className="mb-3">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                              <Badge bg="primary" className="px-2 py-1">
                                {property.category}
                              </Badge>
                              {property.subtype && (
                                <Badge bg="secondary" className="px-2 py-1">
                                  {property.subtype}
                                </Badge>
                              )}
                              <Badge 
                                bg={statusColor[property.verificationStatus]} 
                                className="d-flex align-items-center gap-1 px-2 py-1"
                              >
                                {getStatusIcon(property.verificationStatus)}
                                <span className="ms-1">{property.verificationStatus}</span>
                              </Badge>
                            </div>

                            <h3 className="mb-3" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                              {property.title}
                            </h3>

                            <div className="mb-4">
                              <h4 className="text-primary mb-2" style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                                ₹{property.price}/<small style={{ fontSize: '1rem', color: '#6b7280' }}>
                                  {property.rentType?.[0] || 'month'}
                                </small>
                              </h4>
                              <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                                📍 {property.address?.street && `${property.address.street}, `}
                                {property.address?.city}, {property.address?.state} - {property.address?.pincode}
                              </p>
                            </div>
                          </div>

                          {/* Property Details Grid */}
                          <Row className="mb-4">
                            <Col md={6}>
                              <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                  <strong className="me-2" style={{ color: '#374151' }}>📐 Size:</strong>
                                  <span style={{ color: '#6b7280' }}>{property.size}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <strong className="me-2" style={{ color: '#374151' }}>🏷️ Category:</strong>
                                  <span style={{ color: '#6b7280' }}>{property.category}</span>
                                </div>
                                {property.subtype && (
                                  <div className="d-flex align-items-center mb-2">
                                    <strong className="me-2" style={{ color: '#374151' }}>🏷️ Type:</strong>
                                    <span style={{ color: '#6b7280' }}>{property.subtype}</span>
                                  </div>
                                )}
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                  <strong className="me-2" style={{ color: '#374151' }}>📞 Contact:</strong>
                                  <span style={{ color: '#6b7280' }}>{property.contact}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <strong className="me-2" style={{ color: '#374151' }}>💰 Rent Types:</strong>
                                  <span style={{ color: '#6b7280' }}>{property.rentType?.join(', ') || 'N/A'}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <strong className="me-2" style={{ color: '#374151' }}>📅 Added:</strong>
                                  <span style={{ color: '#6b7280' }}>{new Date(property.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </Col>
                          </Row>

                          {/* Status Information */}
                          <div className="mb-4">
                            <h5 className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>
                              📝 Verification Status
                            </h5>
                            <div 
                              className="p-3 rounded-3"
                              style={{
                                background: getStatusGradient(property.verificationStatus),
                                border: `1px solid ${getStatusBorderColor(property.verificationStatus)}`
                              }}
                            >
                              {latestLog ? (
                                <>
                                  <div className="d-flex align-items-start mb-3">
                                    <Icon name="messageSquare" size={16} className="me-2 mt-1" />
                                    <div style={{ flex: 1 }}>
                                      <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Admin Remark:</strong>
                                      <p className="mb-0 mt-1" style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: 1.5 }}>
                                        {latestLog.note || 'No specific remarks provided'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="d-flex align-items-center">
                                    <Icon name="calendar" size={14} className="me-2" />
                                    <small style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                      Updated: {new Date(latestLog.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </small>
                                  </div>
                                </>
                              ) : (
                                <div className="d-flex align-items-start">
                                  <Icon name="clock" size={16} className="me-2 mt-1" />
                                  <div>
                                    <strong style={{ color: '#374151', fontSize: '0.9rem' }}>Awaiting Review</strong>
                                    <p className="mb-0 mt-1" style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                                      Your property is in the review queue
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {property.description && (
                            <div className="mb-3">
                              <h5 className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>
                                📝 Description
                              </h5>
                              <p style={{ color: '#6b7280', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                {property.description}
                              </p>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
                </>
              )}
            </Col>

            {/* ✅ RIGHT SIDE - STATS CARD (Same position as PropertyDetails booking card) */}
            <Col lg={4}>
              <Card className="sticky-top" style={{ ...cardStyle, top: '20px' }}>
                <Card.Header style={cardHeaderStyle}>
                  <h5 className="mb-0" style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>
                    📊 Properties Overview
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  
                  {/* Main Stats */}
                  <div className="text-center mb-4 pb-4 border-bottom">
                    <h3 className="text-primary mb-2" style={{ fontSize: '2rem', fontWeight: '700' }}>
                      {stats.total} Properties
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      Total properties listed
                    </p>
                  </div>

                  {/* Individual Stats */}
                  <div className="d-grid gap-3 mb-4">
                    <div className="stat-item d-flex justify-content-between align-items-center p-3 rounded-3" 
                         style={getStatItemStyle('pending')}>
                      <div className="d-flex align-items-center">
                        <Icon name="clock" size={18} className="me-2" />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Pending Review</span>
                      </div>
                      <Badge bg="warning" className="px-2 py-1">{stats.pending}</Badge>
                    </div>
                    
                    <div className="stat-item d-flex justify-content-between align-items-center p-3 rounded-3"
                         style={getStatItemStyle('verified')}>
                      <div className="d-flex align-items-center">
                        <Icon name="checkCircle" size={18} className="me-2" />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Verified</span>
                      </div>
                      <Badge bg="success" className="px-2 py-1">{stats.verified}</Badge>
                    </div>
                    
                    <div className="stat-item d-flex justify-content-between align-items-center p-3 rounded-3"
                         style={getStatItemStyle('rejected')}>
                      <div className="d-flex align-items-center">
                        <Icon name="xCircle" size={18} className="me-2" />
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Rejected</span>
                      </div>
                      <Badge bg="danger" className="px-2 py-1">{stats.rejected}</Badge>
                    </div>
                  </div>

                  {/* ✅ PROPERTY FEATURES SECTION - PROPERLY CONTAINED */}
                  <div className="pt-3 border-top">
                    <h6 className="mb-3" style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                      ⭐ Property Features
                    </h6>
                    
                    <div className="feature-list">
                      {[
                        'Property Rentals Space',
                        '1000 Area',
                        'monthly/yearly Rental',
                        'Direct Owner Contact'
                      ].map((feature, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <Icon name="check" size={14} className="text-success me-2 flex-shrink-0" />
                          <span style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.4 }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Notice */}
                  <div className="mt-4 pt-3 border-top text-center">
                    <small style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      ⚠️ Keep your property information updated for faster verification
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{getStyles()}</style>
    </>
  );
};

// ✅ INLINE STYLES FOR PERFECT CONTROL
const containerStyle = {
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
  minHeight: '100vh'
};

const cardStyle = {
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  backgroundColor: 'white'
};

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
  borderRadius: '12px 12px 0 0',
  padding: '1rem 1.25rem'
};

const iconStyle = {
  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
  borderRadius: '12px',
  padding: '8px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '60px 20px'
};

const errorStyle = {
  padding: '60px 20px'
};

const getStatItemStyle = (type) => {
  const styles = {
    pending: {
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.04))',
      border: '1px solid rgba(245, 158, 11, 0.15)',
      transition: 'all 0.2s ease'
    },
    verified: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.04))',
      border: '1px solid rgba(16, 185, 129, 0.15)',
      transition: 'all 0.2s ease'
    },
    rejected: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.04))',
      border: '1px solid rgba(239, 68, 68, 0.15)',
      transition: 'all 0.2s ease'
    }
  };
  return styles[type];
};

// ✅ MINIMAL STYLES FOR PERFECT CONTROL
const getStyles = () => `
  /* Hover effects */
  .stat-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  /* Card hover effects */
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  /* Button styling */
  .btn {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  /* Badge styling */
  .badge {
    border-radius: 6px;
    font-weight: 500;
  }

  /* Feature list spacing */
  .feature-list {
    max-width: 100%;
    overflow-wrap: break-word;
  }

  /* Sticky positioning fix */
  @media (min-width: 992px) {
    .sticky-top {
      position: sticky !important;
      top: 20px !important;
    }
  }

  @media (max-width: 991.98px) {
    .sticky-top {
      position: relative !important;
      top: 0 !important;
    }
  }

  /* Responsive text sizing */
  @media (max-width: 768px) {
    .container {
      padding: 1rem 0.5rem;
    }
    
    .card-body {
      padding: 1rem !important;
    }
  }
`;

export default MyPropertyStatus;
