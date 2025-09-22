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

  // ✅ PERFECT ICONS WITH BEAUTIFUL COLORS (EXACTLY LIKE REFERENCE)
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
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
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
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      dollarSign: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" className={className}>
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      maximize: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" className={className}>
          <polyline points="15,3 21,3 21,9"/>
          <polyline points="9,21 3,21 3,15"/>
          <line x1="21" y1="3" x2="14" y2="10"/>
          <line x1="3" y1="21" x2="10" y2="14"/>
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
      star: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" className={className}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
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
      alertCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <path d="M12 16h.01"/>
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
        <div className="property-container">
          {/* ✅ EXACT SAME ANIMATED BACKGROUND AS REFERENCE */}
          <div className="animated-background">
            <div className="gradient-overlay"></div>
            <div className="grid-pattern"></div>
            <div className="floating-elements">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>

          <Container className="content-layer">
            <div className="loading-display">
              <div className="loading-card">
                <Icon name="sparkles" size={40} />
                <div className="spinner"></div>
                <h4>Loading Properties...</h4>
                <p>Please wait while we fetch the information</p>
              </div>
            </div>
          </Container>
        </div>

        <style>{getPerfectStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-container">
          <div className="animated-background">
            <div className="gradient-overlay"></div>
            <div className="grid-pattern"></div>
            <div className="floating-elements">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
          </div>

          <Container className="content-layer">
            <div className="error-display">
              <div className="error-card">
                <Icon name="alertTriangle" size={40} />
                <h4>Error Loading Properties</h4>
                <p>{error}</p>
              </div>
            </div>
          </Container>
        </div>

        <style>{getPerfectStyles()}</style>
      </>
    );
  }

  const stats = getStatsData();

  return (
    <>
      <div className="property-container">
        
        {/* ✅ EXACT SAME ANIMATED BACKGROUND AS REFERENCE */}
        <div className="animated-background">
          <div className="gradient-overlay"></div>
          <div className="grid-pattern"></div>
          <div className="floating-elements">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>

        {/* ✅ CONTENT LAYER */}
        <Container className="content-layer">
          
          {/* Header Card */}
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Card className="glass-card header-card">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="profile-icon">
                      <Icon name="home" size={24} />
                    </div>
                    <div>
                      <h2 className="profile-title">My Properties Status</h2>
                      <p className="profile-subtitle">
                        Track verification status of all your listed properties
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="stat-card total">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total Properties</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="stat-card pending">
                        <div className="stat-number">{stats.pending}</div>
                        <div className="stat-label">Pending Review</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="stat-card verified">
                        <div className="stat-number">{stats.verified}</div>
                        <div className="stat-label">Verified</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="stat-card rejected">
                        <div className="stat-number">{stats.rejected}</div>
                        <div className="stat-label">Rejected</div>
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
                <Card className="glass-card main-card">
                  <Card.Body className="p-5 text-center">
                    <div className="empty-state-icon">
                      <Icon name="home" size={32} />
                    </div>
                    <h4 className="empty-state-title">No Properties Found</h4>
                    <p className="empty-state-subtitle">
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
                        <Card 
                          className="glass-card property-card"
                          style={{
                            border: `2px solid ${getStatusBorderColor(property.verificationStatus)}`
                          }}
                        >
                          <div 
                            className="status-strip"
                            style={{ background: getStatusGradient(property.verificationStatus) }}
                          />
                          
                          <Card.Body className="p-4">
                            <div className="d-flex align-items-start justify-content-between mb-3">
                              <div style={{ flex: 1 }}>
                                <h5 className="property-title">{property.title}</h5>
                                <div className="property-category">
                                  <Icon name="tag" size={14} />
                                  <span>{property.category}</span>
                                </div>
                              </div>
                              
                              <div className="property-status">
                                {getStatusIcon(property.verificationStatus)}
                                <Badge 
                                  bg={statusColor[property.verificationStatus]} 
                                  className="status-badge"
                                >
                                  {property.verificationStatus}
                                </Badge>
                              </div>
                            </div>
                            
                            <div 
                              className="status-content"
                              style={{
                                background: getStatusGradient(property.verificationStatus),
                                border: `1px solid ${getStatusBorderColor(property.verificationStatus)}`
                              }}
                            >
                              {latestLog ? (
                                <>
                                  <div className="status-message">
                                    <Icon name="messageSquare" size={16} />
                                    <div>
                                      <div className="message-label">Admin Remark:</div>
                                      <div className="message-text">
                                        {latestLog.note || 'No specific remarks provided'}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="status-date">
                                    <Icon name="calendar" size={14} />
                                    <span>
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
                                <div className="status-message">
                                  <Icon name="clock" size={16} />
                                  <div>
                                    <div className="message-label">Awaiting Review</div>
                                    <div className="message-text">
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

      <style>{getPerfectStyles()}</style>
    </>
  );
};

// ✅ EXACT SAME STYLES AS REFERENCE PROPERTYDETAILS
const getPerfectStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .property-container {
    min-height: 100vh;
    position: relative;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding-top: 100px;
    padding-bottom: 60px;
  }
  
  /* ✅ PERFECT ANIMATED BACKGROUND */
  .animated-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      #f8fafc 0%, 
      #e2e8f0 20%, 
      #cbd5e1 40%, 
      #94a3b8 60%, 
      #64748b 80%, 
      #475569 100%);
    animation: gradientShift 20s ease-in-out infinite;
  }
  
  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridFloat 30s linear infinite;
  }
  
  .floating-elements {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.7;
  }
  
  .orb-1 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%);
    top: 10%;
    left: 10%;
    animation: float1 15s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
    top: 60%;
    right: 15%;
    animation: float2 18s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
    bottom: 20%;
    left: 20%;
    animation: float3 22s ease-in-out infinite;
  }
  
  /* ✅ CONTENT LAYER */
  .content-layer {
    position: relative;
    z-index: 2;
  }
  
  /* ✅ GLASS MORPHISM CARDS */
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 8px 25px -8px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: cardSlideIn 0.8s ease-out;
  }
  
  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 35px 60px -12px rgba(0, 0, 0, 0.3),
      0 12px 35px -8px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
  
  .profile-icon {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 16px;
    padding: 12px;
    color: white;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-title {
    font-weight: 800;
    color: #1e293b;
    margin: 0;
    font-size: 1.8rem;
    background: linear-gradient(135deg, #1e293b, #475569);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .profile-subtitle {
    margin: 0;
    color: #64748b;
    font-size: 1rem;
  }
  
  /* Stats cards */
  .stat-card {
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    border: 1px solid;
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
  }
  
  .stat-card.total {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
    border-color: rgba(59, 130, 246, 0.1);
  }
  
  .stat-card.pending {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05));
    border-color: rgba(245, 158, 11, 0.1);
  }
  
  .stat-card.verified {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
    border-color: rgba(16, 185, 129, 0.1);
  }
  
  .stat-card.rejected {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
    border-color: rgba(239, 68, 68, 0.1);
  }
  
  .stat-number {
    font-size: 1.8rem;
    font-weight: 800;
    color: #3b82f6;
  }
  
  .stat-card.pending .stat-number { color: #f59e0b; }
  .stat-card.verified .stat-number { color: #10b981; }
  .stat-card.rejected .stat-number { color: #ef4444; }
  
  .stat-label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
  }
  
  /* Property cards */
  .property-card {
    overflow: hidden;
  }
  
  .status-strip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  
  .property-title {
    font-weight: 700;
    color: #1e293b;
    font-size: 1.2rem;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .property-category {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }
  
  .property-category span {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
  }
  
  .property-status {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-badge {
    border-radius: 12px;
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .status-content {
    border-radius: 12px;
    padding: 16px;
  }
  
  .status-message {
    display: flex;
    align-items: start;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .message-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }
  
  .message-text {
    font-size: 0.9rem;
    color: #1e293b;
    line-height: 1.4;
  }
  
  .status-date {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-date span {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 600;
  }
  
  /* Loading states */
  .loading-display,
  .error-display {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  }
  
  .loading-card,
  .error-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    animation: cardSlideIn 0.8s ease-out;
  }
  
  .loading-card h4,
  .error-card h4 {
    margin: 20px 0 10px 0;
    color: #1e293b;
    font-weight: 700;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f1f5f9;
    border-left: 3px solid #7c3aed;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  
  .empty-state-icon {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05));
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    color: #3b82f6;
  }
  
  .empty-state-title {
    color: #1e293b;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  .empty-state-subtitle {
    color: #64748b;
    margin: 0;
  }
  
  /* ✅ ANIMATIONS */
  @keyframes gradientShift {
    0%, 100% { 
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 20%, #cbd5e1 40%, #94a3b8 60%, #64748b 80%, #475569 100%);
    }
    50% { 
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 20%, #94a3b8 40%, #64748b 60%, #475569 80%, #334155 100%);
    }
  }
  
  @keyframes gridFloat {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.1); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-25px, -20px) scale(1.05); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -25px) scale(1.08); }
  }
  
  @keyframes cardSlideIn {
    from { 
      opacity: 0; 
      transform: translateY(30px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* ✅ RESPONSIVE */
  @media (max-width: 991.98px) {
    .property-title { font-size: 1.1rem; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
  }
  
  @media (max-width: 767.98px) {
    .property-container { padding-top: 80px; }
    .profile-title { font-size: 1.5rem; }
  }
`;

export default MyPropertyStatus;
