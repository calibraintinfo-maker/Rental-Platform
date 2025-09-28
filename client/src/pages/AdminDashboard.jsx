import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useSpring, animated, useTrail, useChain, useSpringRef } from '@react-spring/web';
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

  if (loading) return (
    <div className="premium-loading-container">
      <div className="premium-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">Loading Dashboard...</p>
      <style jsx>{`
        .premium-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 24px;
          background: #fafbff;
        }
        .premium-spinner {
          position: relative;
          width: 80px;
          height: 80px;
        }
        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid transparent;
          border-top: 4px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }
        .spinner-ring:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 10px;
          left: 10px;
          border-top-color: #06b6d4;
          animation-delay: -0.3s;
        }
        .spinner-ring:nth-child(3) {
          width: 40px;
          height: 40px;
          top: 20px;
          left: 20px;
          border-top-color: #10b981;
          animation-delay: -0.6s;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-text {
          color: #64748b;
          font-weight: 600;
          font-size: 18px;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );

  if (error) return (
    <div className="premium-error-container">
      <div className="error-icon">⚠️</div>
      <h3>Oops! Something went wrong</h3>
      <p>{error}</p>
      <style jsx>{`
        .premium-error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          text-align: center;
          gap: 16px;
          font-family: 'Inter', sans-serif;
          background: #fafbff;
        }
        .error-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        h3 {
          color: #ef4444;
          margin: 0;
          font-weight: 700;
        }
        p {
          color: #64748b;
          margin: 0;
        }
      `}</style>
    </div>
  );
  
  if (!metrics) return null;

  // ✅ ENHANCED ANIMATED COUNTER
  const AnimatedNumber = ({ value, duration = 1200 }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: value,
      config: { duration },
    });
    return <animated.span>{number.to(n => Math.floor(n).toLocaleString())}</animated.span>;
  };

  // ✅ PREMIUM METRIC CARD COMPONENT
  const MetricCard = ({ metric, index }) => {
    const cardSpring = useSpring({
      from: { 
        opacity: 0, 
        transform: 'translateY(40px) scale(0.9)',
        filter: 'blur(8px)'
      },
      to: { 
        opacity: 1, 
        transform: 'translateY(0px) scale(1)',
        filter: 'blur(0px)'
      },
      delay: index * 100,
      config: { tension: 200, friction: 20 }
    });

    return (
      <Col md={3} key={metric.label}>
        <animated.div style={cardSpring}>
          <div className={`premium-metric-card metric-${metric.color}`}>
            <div className="metric-icon-container">
              <div className={`metric-icon text-${metric.color}`}>
                <i className={`bi ${metric.icon}`} />
              </div>
              <div className="icon-glow"></div>
            </div>
            <div className="metric-content">
              <h6 className="metric-label">{metric.label}</h6>
              <h2 className={`metric-value text-${metric.color}`}>
                <AnimatedNumber value={metric.value} />
              </h2>
              <div className="metric-trend">
                <span className="trend-indicator">↗</span>
                <span className="trend-text">Active</span>
              </div>
            </div>
            <div className="card-sparkle"></div>
          </div>
        </animated.div>
      </Col>
    );
  };

  // ✅ CATEGORY CARD COMPONENT  
  const CategoryCard = ({ category, index }) => {
    const spring = useSpring({
      from: { opacity: 0, transform: 'scale(0.8)' },
      to: { opacity: 1, transform: 'scale(1)' },
      delay: index * 80,
    });

    return (
      <Col md={2} key={category._id}>
        <animated.div style={spring}>
          <div className="premium-category-card">
            <div className="category-content">
              <h6 className="category-label">{category._id}</h6>
              <h3 className="category-count">
                <AnimatedNumber value={category.count} duration={800} />
              </h3>
            </div>
            <div className="category-gradient"></div>
          </div>
        </animated.div>
      </Col>
    );
  };

  // User metrics data
  const userMetrics = [
    { label: 'Total Users', value: metrics.users.total, color: 'primary', icon: 'bi-people-fill' },
    { label: 'Property Owners', value: metrics.users.owners, color: 'success', icon: 'bi-person-badge' },
    { label: 'Active Renters', value: metrics.users.renters, color: 'info', icon: 'bi-person-check' },
    { label: 'Suspended', value: metrics.users.suspended, color: 'danger', icon: 'bi-person-x' },
  ];

  const propertyMetrics = [
    { label: 'Total Properties', value: metrics.properties.total, color: 'primary', icon: 'bi-buildings' },
    { label: 'Verified', value: metrics.properties.verified, color: 'success', icon: 'bi-patch-check-fill' },
    { label: 'Under Review', value: metrics.properties.pending, color: 'warning', icon: 'bi-hourglass-split' },
    { label: 'Rejected', value: metrics.properties.rejected, color: 'danger', icon: 'bi-x-circle-fill' },
  ];

  const bookingMetrics = [
    { label: 'Total Bookings', value: metrics.bookings.total, color: 'primary', icon: 'bi-calendar-check-fill' },
    { label: 'Active Bookings', value: metrics.bookings.ongoing, color: 'info', icon: 'bi-clock-history' },
    { label: 'Completed', value: metrics.bookings.completed, color: 'success', icon: 'bi-check-circle-fill' },
    { label: 'Canceled', value: metrics.bookings.canceled, color: 'danger', icon: 'bi-x-octagon-fill' },
  ];

  return (
    <div className="premium-admin-dashboard">
      {/* ✅ FIXED: PAGE LAYOUT STRUCTURE */}
      <div className="page-container">
        {/* Navbar space is automatically handled by the layout */}
        
        {/* ✅ HERO SECTION - BELOW NAVBAR */}
        <div className="dashboard-hero">
          <Container>
            <div className="hero-content">
              <div className="hero-left">
                <div className="hero-icon">
                  <i className="bi bi-speedometer2"></i>
                  <div className="hero-icon-glow"></div>
                </div>
                <div className="hero-text">
                  <h1 className="hero-title">📊 Admin Dashboard</h1>
                  <p className="hero-subtitle">Real-time insights and analytics for your platform</p>
                </div>
              </div>
              <div className="hero-right">
                <div className="status-indicators">
                  <div className="status-pill">
                    <span className="status-label">Last Updated</span>
                    <span className="status-value">Now</span>
                    <div className="live-dot"></div>
                  </div>
                  <div className="status-pill">
                    <span className="status-label">System Status</span>
                    <span className="status-value status-online">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* ✅ MAIN CONTENT */}
        <Container className="dashboard-container">
          {/* ✅ USER METRICS SECTION */}
          <div className="metrics-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className="bi bi-people section-icon"></i>
                User Analytics
              </h3>
              <div className="section-line"></div>
            </div>
            <Row className="metrics-row">
              {userMetrics.map((metric, index) => (
                <MetricCard key={metric.label} metric={metric} index={index} />
              ))}
            </Row>
          </div>

          {/* ✅ PROPERTY METRICS SECTION */}
          <div className="metrics-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className="bi bi-building section-icon"></i>
                Property Analytics
              </h3>
              <div className="section-line"></div>
            </div>
            <Row className="metrics-row">
              {propertyMetrics.map((metric, index) => (
                <MetricCard key={metric.label} metric={metric} index={index} />
              ))}
            </Row>
          </div>

          {/* ✅ PROPERTY CATEGORIES */}
          <div className="metrics-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className="bi bi-grid-3x3-gap section-icon"></i>
                Property Categories
              </h3>
              <div className="section-line"></div>
            </div>
            <Row className="category-row">
              {metrics.properties.byCategory.map((category, index) => (
                <CategoryCard key={category._id} category={category} index={index} />
              ))}
            </Row>
          </div>

          {/* ✅ BOOKING METRICS SECTION */}
          <div className="metrics-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className="bi bi-calendar-check section-icon"></i>
                Booking Analytics
              </h3>
              <div className="section-line"></div>
            </div>
            <Row className="metrics-row">
              {bookingMetrics.map((metric, index) => (
                <MetricCard key={metric.label} metric={metric} index={index} />
              ))}
            </Row>
          </div>

          {/* ✅ RECENT ACTIVITY SECTION */}
          <div className="metrics-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className="bi bi-activity section-icon"></i>
                Recent Activity
              </h3>
              <div className="section-line"></div>
            </div>
            <Row className="activity-row">
              <Col md={6}>
                <div className="premium-activity-card">
                  <div className="activity-header">
                    <div className="activity-icon">
                      <i className="bi bi-building-add"></i>
                    </div>
                    <h6>Latest Properties</h6>
                  </div>
                  <div className="activity-list">
                    {metrics.recent.properties.map(property => (
                      <div key={property._id} className="activity-item">
                        <div className="activity-dot"></div>
                        <div className="activity-text">
                          <span className="activity-name">{property.title}</span>
                          <span className="activity-time">Just added</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="premium-activity-card">
                  <div className="activity-header">
                    <div className="activity-icon">
                      <i className="bi bi-person-plus"></i>
                    </div>
                    <h6>New Registrations</h6>
                  </div>
                  <div className="activity-list">
                    {metrics.recent.users.map(user => (
                      <div key={user._id} className="activity-item">
                        <div className="activity-dot"></div>
                        <div className="activity-text">
                          <span className="activity-name">{user.name}</span>
                          <span className="activity-email">{user.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* ✅ TOP 1% AGENCY STYLING - PERFECT LAYOUT */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .premium-admin-dashboard {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #fafbff;
          min-height: 100vh;
        }

        .page-container {
          padding-top: 0; /* No extra padding - respects navbar space */
        }

        /* ✅ HERO SECTION - BELOW NAVBAR */}
        .dashboard-hero {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 48px 0;
          position: relative;
          overflow: hidden;
        }

        .dashboard-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .hero-icon {
          position: relative;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          box-shadow: 
            0 20px 40px rgba(139, 92, 246, 0.3),
            0 8px 16px rgba(139, 92, 246, 0.2);
        }

        .hero-icon-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 24px;
          opacity: 0.3;
          filter: blur(12px);
          z-index: -1;
        }

        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hero-title {
          color: #0f172a;
          font-size: 42px;
          font-weight: 900;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        .hero-subtitle {
          color: #64748b;
          font-size: 18px;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
        }

        .hero-right {
          display: flex;
          align-items: center;
        }

        .status-indicators {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
        }

        .status-pill {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 50px;
          border: 1px solid rgba(139, 92, 246, 0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.04),
            0 1px 3px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .status-pill:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.06),
            0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .status-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 700;
        }

        .status-online {
          color: #10b981 !important;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .dashboard-container {
          padding: 56px 20px 80px;
          max-width: 1400px;
        }

        /* ✅ SECTION STYLING */
        .metrics-section {
          margin-bottom: 56px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 36px;
          position: relative;
        }

        .section-title {
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: -0.02em;
        }

        .section-icon {
          font-size: 22px;
          color: #8b5cf6;
        }

        .section-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(139, 92, 246, 0.3) 0%, 
            rgba(139, 92, 246, 0.1) 50%,
            transparent 100%
          );
          border-radius: 2px;
        }

        .metrics-row, .category-row, .activity-row {
          gap: 28px;
        }

        /* ✅ PREMIUM METRIC CARDS */
        .premium-metric-card {
          position: relative;
          padding: 36px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 6px -2px rgba(0, 0, 0, 0.03);
        }

        .premium-metric-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #d1d5db;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 8px 16px rgba(0, 0, 0, 0.06);
        }

        .metric-icon-container {
          position: relative;
          margin-bottom: 24px;
        }

        .metric-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .premium-metric-card:hover .metric-icon {
          transform: scale(1.1);
        }

        .metric-primary .metric-icon {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #3b82f6;
        }

        .metric-success .metric-icon {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          color: #10b981;
        }

        .metric-info .metric-icon {
          background: linear-gradient(135deg, #cffafe, #a7f3d0);
          color: #06b6d4;
        }

        .metric-warning .metric-icon {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #f59e0b;
        }

        .metric-danger .metric-icon {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #ef4444;
        }

        .metric-content {
          position: relative;
          z-index: 2;
        }

        .metric-label {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 40px;
          font-weight: 900;
          margin: 0 0 16px 0;
          font-feature-settings: 'tnum';
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .trend-indicator {
          color: #10b981;
          font-size: 18px;
          font-weight: 700;
        }

        .trend-text {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-sparkle {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 6px;
          height: 6px;
          background: #8b5cf6;
          border-radius: 50%;
          animation: sparkle 3s infinite;
          opacity: 0.6;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        /* ✅ CATEGORY CARDS */
        .premium-category-card {
          position: relative;
          padding: 28px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .premium-category-card:hover {
          transform: translateY(-4px);
          border-color: #d1d5db;
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.06),
            0 4px 8px rgba(0, 0, 0, 0.04);
        }

        .category-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .category-count {
          color: #8b5cf6;
          font-size: 32px;
          font-weight: 900;
          margin: 0;
          font-feature-settings: 'tnum';
          letter-spacing: -0.02em;
        }

        .category-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          border-radius: 0 0 16px 16px;
        }

        /* ✅ ACTIVITY CARDS */
        .premium-activity-card {
          padding: 36px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          height: 100%;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 6px -2px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }

        .premium-activity-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.06),
            0 4px 8px rgba(0, 0, 0, 0.04);
        }

        .activity-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .activity-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .activity-header h6 {
          color: #0f172a;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .activity-item:hover {
          background: #f1f5f9;
          border-color: #e2e8f0;
          transform: translateX(8px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .activity-dot {
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .activity-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .activity-name {
          color: #0f172a;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
        }

        .activity-time, .activity-email {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }

        /* ✅ RESPONSIVE DESIGN */
        @media (max-width: 992px) {
          .hero-content {
            flex-direction: column;
            gap: 32px;
            text-align: center;
          }

          .hero-left {
            flex-direction: column;
            gap: 20px;
          }

          .hero-title {
            font-size: 36px;
          }

          .section-title {
            font-size: 24px;
          }

          .premium-metric-card {
            padding: 28px;
          }

          .metric-value {
            font-size: 32px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-hero {
            padding: 32px 0;
          }

          .hero-title {
            font-size: 28px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .dashboard-container {
            padding: 40px 20px 60px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .section-line {
            width: 100%;
          }
        }

        /* ✅ ANIMATIONS */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* ✅ BOOTSTRAP COLOR OVERRIDES */
        .text-primary { color: #3b82f6 !important; }
        .text-success { color: #10b981 !important; }
        .text-info { color: #06b6d4 !important; }
        .text-warning { color: #f59e0b !important; }
        .text-danger { color: #ef4444 !important; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
