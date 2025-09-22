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

  // ✅ COLORFUL ICONS COMPONENT - SAME AS ADDPROPERTY
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      clock: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      checkCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" strokeWidth="2" className={className}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      ),
      xCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      alertCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#EAB308" stroke="#EAB308" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <path d="M12 16h.01"/>
        </svg>
      ),
      messageSquare: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#3B82F6" stroke="#3B82F6" strokeWidth="2" className={className}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      calendar: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#6B7280" stroke="#6B7280" strokeWidth="2" className={className}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      tag: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#8B5A2B" stroke="#8B5A2B" strokeWidth="2" className={className}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5" className={className}>
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
        <div className="property-container loading-container">
          {/* ✅ SAME BACKGROUND ANIMATIONS */}
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div className="particles">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.8}s`
                  }}
                />
              ))}
            </div>
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div className="loading-card">
              <div className="loading-icon">
                <Icon name="sparkles" size={32} />
              </div>
              <Spinner 
                animation="border" 
                className="loading-spinner"
              />
              <h4 className="loading-title">Loading Properties...</h4>
              <p className="loading-subtitle">Fetching your property status updates</p>
            </div>
          </div>
        </div>

        {/* ✅ SAME ANIMATIONS STYLESHEET */}
        <style>{getAnimationStyles()}</style>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="property-container">
          {/* ✅ SAME BACKGROUND ANIMATIONS */}
          <div className="background-animation">
            <div className="gradient-overlay"></div>
            <div className="grid-overlay"></div>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="floating-orb orb-4"></div>
            <div className="particles">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className={`particle particle-${index % 4 + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.8}s`
                  }}
                />
              ))}
            </div>
            <div className="geometric-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          <Container style={{ position: 'relative', zIndex: 2 }}>
            <Row className="justify-content-center">
              <Col lg={6}>
                <div className="error-card">
                  <div className="error-icon">
                    <Icon name="alertCircle" size={32} />
                  </div>
                  <div className="error-content">
                    <h5 className="error-title">Error Loading Properties</h5>
                    <p className="error-message">{error}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <style>{getAnimationStyles()}</style>
      </>
    );
  }

  const stats = getStatsData();

  return (
    <>
      <div className="property-container">
        
        {/* ✅ SAME BACKGROUND ANIMATIONS */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="particles">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.8}s`
                }}
              />
            ))}
          </div>
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          
          {/* Header Card */}
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Card className="profile-card header-card">
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
                <Card className="profile-card main-card">
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
                          className="profile-card property-card"
                          style={{
                            border: `2px solid ${getStatusBorderColor(property.verificationStatus)}`
                          }}
                        >
                          {/* Status Indicator Strip */}
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
                            
                            {/* Status-specific content */}
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

      {/* ✅ SAME ANIMATIONS STYLESHEET */}
      <style>{getAnimationStyles()}</style>
    </>
  );
};

// ✅ EXTRACTED ANIMATION STYLES FUNCTION
const getAnimationStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .property-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding-top: 100px;
    padding-bottom: 60px;
  }
  
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Background animations */
  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(124, 58, 237, 0.04) 0%, 
      transparent 25%, 
      rgba(59, 130, 246, 0.03) 50%, 
      transparent 75%, 
      rgba(16, 185, 129, 0.04) 100%);
    animation: gradientShift 15s ease-in-out infinite;
  }
  
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124, 58, 237, 0.08) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 25s linear infinite;
  }
  
  .floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.6;
  }
  
  .orb-1 {
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%);
    top: 8%;
    left: 10%;
    animation: float1 12s ease-in-out infinite;
  }
  
  .orb-2 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
    top: 60%;
    right: 12%;
    animation: float2 15s ease-in-out infinite;
  }
  
  .orb-3 {
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
    bottom: 15%;
    left: 15%;
    animation: float3 18s ease-in-out infinite;
  }
  
  .orb-4 {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.03) 40%, transparent 70%);
    top: 30%;
    left: 70%;
    animation: float4 20s ease-in-out infinite;
  }
  
  .particles {
    position: absolute;
    width: 100%;
    height: calc(100% - 80px);
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.4);
  }
  
  .particle-1 { 
    width: 4px; 
    height: 4px; 
    animation: particle1 20s linear infinite; 
  }
  .particle-2 { 
    width: 3px; 
    height: 3px; 
    background: rgba(59, 130, 246, 0.4);
    animation: particle2 25s linear infinite; 
  }
  .particle-3 { 
    width: 5px; 
    height: 5px; 
    background: rgba(16, 185, 129, 0.4);
    animation: particle3 22s linear infinite; 
  }
  .particle-4 { 
    width: 2px; 
    height: 2px; 
    background: rgba(245, 101, 101, 0.4);
    animation: particle4 18s linear infinite; 
  }
  
  .geometric-shapes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .shape {
    position: absolute;
    opacity: 0.1;
  }
  
  .shape-1 {
    width: 50px;
    height: 50px;
    border: 2px solid #7c3aed;
    top: 20%;
    right: 20%;
    animation: rotate 30s linear infinite;
  }
  
  .shape-2 {
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 30px solid #3b82f6;
    top: 70%;
    left: 80%;
    animation: float1 25s ease-in-out infinite;
  }
  
  .shape-3 {
    width: 30px;
    height: 30px;
    background: #10b981;
    border-radius: 50%;
    bottom: 30%;
    right: 30%;
    animation: pulse 8s ease-in-out infinite;
  }
  
  /* Card styling */
  .profile-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.1),
      0 8px 25px rgba(124, 58, 237, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    position: relative;
    animation: cardAppear 0.8s ease-out;
    transition: all 0.3s ease;
    margin-bottom: 24px;
  }
  
  .profile-card:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.15),
      0 10px 30px rgba(124, 58, 237, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }
  
  .profile-icon {
    background: linear-gradient(135deg, #667eea, #764ba2);
    borderRadius: 16px;
    padding: 12px;
    color: white;
    border-radius: 16px;
    margin-right: 16px;
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
  .loading-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  
  .loading-icon {
    margin-bottom: 16px;
  }
  
  .loading-spinner {
    color: #667eea !important;
    width: 50px !important;
    height: 50px !important;
    border-width: 4px !important;
    margin: 16px auto !important;
  }
  
  .loading-title {
    margin-top: 20px;
    color: #1e293b;
    font-weight: 700;
    font-size: 1.5rem;
  }
  
  .loading-subtitle {
    color: #64748b;
    margin: 8px 0 0 0;
  }
  
  /* Error states */
  .error-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }
  
  .error-icon {
    flex-shrink: 0;
  }
  
  .error-title {
    color: #991b1b;
    margin-bottom: 4px;
    font-weight: 700;
  }
  
  .error-message {
    color: #991b1b;
    margin: 0;
  }
  
  /* Empty state */
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
  
  /* Animations */
  @keyframes gradientShift {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(20px, -20px) rotate(90deg) scale(1.05); }
    50% { transform: translate(-15px, -30px) rotate(180deg) scale(0.95); }
    75% { transform: translate(-25px, 15px) rotate(270deg) scale(1.02); }
  }
  
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    30% { transform: translate(-30px, -15px) rotate(108deg) scale(1.08); }
    70% { transform: translate(15px, -25px) rotate(252deg) scale(0.92); }
  }
  
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
    20% { transform: translate(15px, -12px) scale(1.06) rotate(72deg); }
    40% { transform: translate(-12px, -20px) scale(0.94) rotate(144deg); }
    60% { transform: translate(-20px, 8px) scale(1.03) rotate(216deg); }
    80% { transform: translate(12px, 16px) scale(0.97) rotate(288deg); }
  }
  
  @keyframes float4 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(12px, -15px) scale(1.1); }
    66% { transform: translate(-15px, 12px) scale(0.9); }
  }
  
  @keyframes particle1 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translateY(-10vh) translateX(80px) rotate(360deg); opacity: 0; }
  }
  
  @keyframes particle2 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-10vh) translateX(-60px) rotate(-360deg); opacity: 0; }
  }
  
  @keyframes particle3 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.7; }
    90% { opacity: 0.7; }
    100% { transform: translateY(-10vh) translateX(50px) rotate(180deg); opacity: 0; }
  }
  
  @keyframes particle4 {
    0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.5; }
    90% { opacity: 0.5; }
    100% { transform: translateY(-10vh) translateX(-30px) rotate(-180deg); opacity: 0; }
  }
  
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.2); opacity: 0.2; }
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
  
  /* Responsive */
  @media (max-width: 768px) {
    .profile-title { font-size: 1.5rem; }
    .orb-1 { width: 200px; height: 200px; }
    .orb-2 { width: 150px; height: 150px; }
    .orb-3 { width: 120px; height: 120px; }
    .orb-4 { width: 100px; height: 100px; }
  }
`;

export default MyPropertyStatus;
