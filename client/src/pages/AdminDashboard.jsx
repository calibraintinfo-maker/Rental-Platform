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
      <Container className="dashboard-container">
        {/* ✅ PREMIUM HEADER */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="bi bi-speedometer2"></i>
              <div className="header-icon-glow"></div>
            </div>
            <div className="header-text">
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="dashboard-subtitle">Real-time insights and analytics</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">Now</span>
              <div className="live-indicator"></div>
            </div>
          </div>
        </div>

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

      {/* ✅ TOP 1% AGENCY STYLING */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .premium-admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #f093fb 50%, 
            #f5576c 75%, 
            #4facfe 100%
          );
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }

        .premium-admin-dashboard::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-container {
          position: relative;
          z-index: 2;
          padding: 40px 20px;
        }

        /* ✅ PREMIUM HEADER */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          padding: 32px 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px) saturate(150%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(139, 92, 246, 0.8), 
            rgba(59, 130, 246, 0.8), 
            transparent
          );
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          position: relative;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 28px;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
        }

        .header-icon-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 22px;
          opacity: 0.6;
          filter: blur(8px);
          z-index: -1;
        }

        .dashboard-title {
          color: white;
          font-size: 36px;
          font-weight: 900;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 500;
          margin: 0;
          margin-top: 4px;
        }

        .header-stats {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-pill {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          color: white;
          font-size: 14px;
          font-weight: 700;
        }

        .live-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        /* ✅ SECTION STYLING */
        .metrics-section {
          margin-bottom: 48px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          position: relative;
        }

        .section-title {
          color: white;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .section-icon {
          font-size: 20px;
          color: #8b5cf6;
        }

        .section-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(139, 92, 246, 0.8) 0%, 
            transparent 100%
          );
          border-radius: 2px;
        }

        .metrics-row, .category-row, .activity-row {
          gap: 24px;
        }

        /* ✅ PREMIUM METRIC CARDS */
        .premium-metric-card {
          position: relative;
          padding: 32px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(30px) saturate(150%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .premium-metric-card:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .metric-icon-container {
          position: relative;
          margin-bottom: 20px;
        }

        .metric-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 2;
        }

        .icon-glow {
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          opacity: 0.6;
          filter: blur(8px);
          z-index: 1;
        }

        .metric-primary .icon-glow { background: #3b82f6; }
        .metric-success .icon-glow { background: #10b981; }
        .metric-info .icon-glow { background: #06b6d4; }
        .metric-warning .icon-glow { background: #f59e0b; }
        .metric-danger .icon-glow { background: #ef4444; }

        .metric-content {
          position: relative;
          z-index: 2;
        }

        .metric-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 900;
          margin: 0 0 12px 0;
          font-feature-settings: 'tnum';
          letter-spacing: -0.02em;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trend-indicator {
          color: #10b981;
          font-size: 16px;
          font-weight: 700;
        }

        .trend-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-sparkle {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: sparkle 3s infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        /* ✅ CATEGORY CARDS */
        .premium-category-card {
          position: relative;
          padding: 24px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          text-align: center;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .premium-category-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .category-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 8px 0;
        }

        .category-count {
          color: #8b5cf6;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          font-feature-settings: 'tnum';
        }

        .category-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          border-radius: 0 0 16px 16px;
        }

        /* ✅ ACTIVITY CARDS */
        .premium-activity-card {
          padding: 32px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(30px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          height: 100%;
        }

        .activity-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }

        .activity-header h6 {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .activity-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .activity-name {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .activity-time, .activity-email {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 500;
        }

        /* ✅ RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 24px;
            padding: 24px;
            text-align: center;
          }

          .dashboard-title {
            font-size: 28px;
          }

          .premium-metric-card {
            padding: 24px;
          }

          .metric-value {
            font-size: 24px;
          }

          .section-title {
            font-size: 20px;
          }
        }

        /* ✅ ANIMATIONS */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* ✅ GLASSMORPHISM EFFECTS */
        .premium-metric-card,
        .premium-category-card,
        .premium-activity-card {
          position: relative;
        }

        .premium-metric-card::before,
        .premium-category-card::before,
        .premium-activity-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          );
          border-radius: inherit;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
