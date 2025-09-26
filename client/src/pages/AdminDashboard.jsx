import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && auth.token) {
      fetchMetrics();
    }
  }, [auth.loading, auth.token]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getDashboard();
      setMetrics(res.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  // Animated counters for metrics
  const AnimatedNumber = ({ value }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: value,
      config: { duration: 900 },
    });
    return <animated.span>{number.to(n => Math.floor(n))}</animated.span>;
  };

  // Loading state with professional design
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spinner 
            animation="border" 
            style={{ 
              width: '3rem', 
              height: '3rem', 
              borderWidth: '3px',
              color: '#7c3aed'
            }} 
          />
          <p style={{ 
            marginTop: '1.5rem', 
            color: '#475569', 
            fontSize: '1rem', 
            fontWeight: '600'
          }}>
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state with professional design
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <Alert 
            variant="danger" 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '2rem',
              color: '#dc2626',
              fontSize: '0.95rem',
              fontWeight: '600',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <strong>⚠️ Dashboard Error</strong><br/>{error}
          </Alert>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
      paddingTop: '120px',
      paddingBottom: '2rem',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Background Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.04) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 1
      }} />
      
      <Container style={{ maxWidth: '1400px', position: 'relative', zIndex: 10 }}>
        
        {/* 🔥 PROFESSIONAL HERO SECTION */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          padding: '2rem 2.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)', 
          borderRadius: '20px',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(124, 58, 237, 0.08)',
          maxWidth: '800px',
          margin: '0 auto 2rem auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background elements */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.03) 100%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          
          {/* SpaceLink Brand */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25)',
              animation: 'float 3s ease-in-out infinite'
            }}>
              📊
            </div>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: '1'
              }}>
                Admin Dashboard
              </h1>
              <div style={{
                fontSize: '0.75rem',
                color: '#7c3aed',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '3px'
              }}>
                SpaceLink Control Center
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 USER METRICS */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.375rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>👥</span>
            User Analytics
          </h3>
          
          <Row className="g-4">
            {[
              { label: 'Total Users', value: metrics.users.total, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '👥' },
              { label: 'Property Owners', value: metrics.users.owners, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '🏠' },
              { label: 'Renters', value: metrics.users.renters, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)', icon: '🔑' },
              { label: 'Suspended', value: metrics.users.suspended, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: '🚫' },
            ].map((m, i) => (
              <Col md={3} key={m.label}>
                <animated.div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="h-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Background decoration */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '80px',
                    height: '80px',
                    background: m.bgColor,
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)',
                    opacity: 0.6
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '1rem',
                      opacity: 0.8
                    }}>
                      {m.icon}
                    </div>
                    <h6 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.5rem',
                      lineHeight: '1'
                    }}>
                      {m.label}
                    </h6>
                    <h2 style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: m.color,
                      margin: 0,
                      lineHeight: '1'
                    }}>
                      <AnimatedNumber value={m.value} />
                    </h2>
                  </div>
                </animated.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 🔥 PROPERTY METRICS */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.375rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>🏢</span>
            Property Analytics
          </h3>
          
          <Row className="g-4">
            {[
              { label: 'Total Properties', value: metrics.properties.total, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '🏢' },
              { label: 'Verified', value: metrics.properties.verified, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '✅' },
              { label: 'Pending Review', value: metrics.properties.pending, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: '⏳' },
              { label: 'Rejected', value: metrics.properties.rejected, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: '❌' },
            ].map((m, i) => (
              <Col md={3} key={m.label}>
                <animated.div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="h-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Background decoration */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '80px',
                    height: '80px',
                    background: m.bgColor,
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)',
                    opacity: 0.6
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '1rem',
                      opacity: 0.8
                    }}>
                      {m.icon}
                    </div>
                    <h6 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.5rem',
                      lineHeight: '1'
                    }}>
                      {m.label}
                    </h6>
                    <h2 style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: m.color,
                      margin: 0,
                      lineHeight: '1'
                    }}>
                      <AnimatedNumber value={m.value} />
                    </h2>
                  </div>
                </animated.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 🔥 PROPERTIES BY CATEGORY */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.375rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>📊</span>
            Properties by Category
          </h3>
          
          <Row className="g-3">
            {metrics.properties.byCategory.map((cat, i) => (
              <Col md={2} key={cat._id}>
                <animated.div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <h6 style={{
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#6b7280',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {cat._id}
                  </h6>
                  <h4 style={{
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    color: '#7c3aed',
                    margin: 0
                  }}>
                    <AnimatedNumber value={cat.count} />
                  </h4>
                </animated.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 🔥 BOOKING METRICS */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.375rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>📅</span>
            Booking Analytics
          </h3>
          
          <Row className="g-4">
            {[
              { label: 'Total Bookings', value: metrics.bookings.total, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '📋' },
              { label: 'Ongoing', value: metrics.bookings.ongoing, color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', icon: '⏰' },
              { label: 'Completed', value: metrics.bookings.completed, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: '✅' },
              { label: 'Canceled', value: metrics.bookings.canceled, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', icon: '❌' },
            ].map((m, i) => (
              <Col md={3} key={m.label}>
                <animated.div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="h-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Background decoration */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '80px',
                    height: '80px',
                    background: m.bgColor,
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)',
                    opacity: 0.6
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '1rem',
                      opacity: 0.8
                    }}>
                      {m.icon}
                    </div>
                    <h6 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.5rem',
                      lineHeight: '1'
                    }}>
                      {m.label}
                    </h6>
                    <h2 style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: m.color,
                      margin: 0,
                      lineHeight: '1'
                    }}>
                      <AnimatedNumber value={m.value} />
                    </h2>
                  </div>
                </animated.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 🔥 RECENT ACTIVITY */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.375rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white'
            }}>⚡</span>
            Recent Activity
          </h3>

          <Row className="g-4">
            <Col md={6}>
              <Card style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}>
                <Card.Body style={{ padding: '1.5rem' }}>
                  <h6 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🏢 Recently Added Properties
                  </h6>
                  <div style={{ 
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {metrics.recent.properties.length > 0 ? (
                      metrics.recent.properties.map((p, index) => (
                        <div key={p._id} style={{
                          padding: '0.75rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#374151',
                          border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}>
                          {p.title}
                        </div>
                      ))
                    ) : (
                      <p style={{
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: 0
                      }}>No recent properties</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}>
                <Card.Body style={{ padding: '1.5rem' }}>
                  <h6 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    👤 Recently Registered Users
                  </h6>
                  <div style={{ 
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {metrics.recent.users.length > 0 ? (
                      metrics.recent.users.map((u, index) => (
                        <div key={u._id} style={{
                          padding: '0.75rem',
                          background: '#f0fdf4',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#374151',
                          border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}>
                          {u.name} ({u.email})
                        </div>
                      ))
                    ) : (
                      <p style={{
                        color: '#6b7280',
                        fontStyle: 'italic',
                        margin: 0
                      }}>No recent users</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

      </Container>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
