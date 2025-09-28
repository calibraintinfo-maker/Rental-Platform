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
    <>
      {/* ✅ FIXED: HERO SECTION OUTSIDE MAIN CONTAINER */}
      <div className="dashboard-hero-section">
        <Container>
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-icon">
                <i className="bi bi-bar-chart-line"></i>
              </div>
              <div className="hero-text">
                <h1 className="hero-title">📊 Admin Dashboard</h1>
                <p className="hero-subtitle">Real-time insights and analytics for your platform</p>
              </div>
            </div>
            <div className="hero-right">
              <div className="status-pill">
                <span className="status-label">SYSTEM STATUS</span>
                <span className="status-value">Online</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ✅ MAIN DASHBOARD CONTENT */}
      <div className="premium-admin-dashboard">
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

          {/* ✅ RECENT ACTIVITY SECTION - PERFECT SIZE & LAYOUT */}
          <div className="metrics-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className="bi bi-activity section-icon"></i>
                Recent Activity
              </h3>
              <div className="section-line"></div>
            </div>
            <Row className="activity-row g-4">
              <Col md={6}>
                <div className="activity-card">
                  <div className="activity-card-header">
                    <div className="activity-icon buildings-icon">
                      <i className="bi bi-buildings"></i>
                    </div>
                    <h6 className="activity-title">Recently Added Properties</h6>
                  </div>
                  <div className="activity-items-list">
                    {metrics.recent.properties.map((property, index) => (
                      <div key={property._id} className="activity-list-item">
                        <div className="activity-item-content">
                          <span className="activity-item-name">{property.title}</span>
                          <span className="activity-item-meta">Just added</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="activity-card">
                  <div className="activity-card-header">
                    <div className="activity-icon users-icon">
                      <i className="bi bi-people"></i>
                    </div>
                    <h6 className="activity-title">Recently Registered Users</h6>
                  </div>
                  <div className="activity-items-list">
                    {metrics.recent.users.map((user, index) => (
                      <div key={user._id} className="activity-list-item">
                        <div className="activity-item-content">
                          <span className="activity-item-name">{user.name}</span>
                          <span className="activity-item-meta">({user.email})</span>
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

      {/* ✅ TOP 1% AGENCY STYLING - PERFECT SIZES */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ✅ HERO SECTION - COMPLETELY SEPARATE */}
        .dashboard-hero-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 24px 0;
          border-bottom: 1px solid #e2e8f0;
          margin-top: 0;
          position: relative;
        }

        .hero-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hero-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .hero-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

        .hero-title {
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .hero-subtitle {
          color: #64748b;
          font-size: 16px;
          font-weight: 500;
          margin: 4px 0 0 0;
          line-height: 1.4;
        }

        .hero-right {
          display: flex;
          align-items: center;
        }

        .status-pill {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          border: 1px solid rgba(139, 92, 246, 0.1);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .status-label {
          color: #64748b;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-value {
          color: #10b981;
          font-size: 14px;
          font-weight: 700;
        }

        /* ✅ MAIN DASHBOARD */
        .premium-admin-dashboard {
          min-height: 100vh;
          background: #fafbff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
        }

        .dashboard-container {
          padding: 48px 20px 80px;
          max-width: 1400px;
        }

        /* ✅ SECTION STYLING */
        .metrics-section {
          margin-bottom: 48px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          position: relative;
        }

        .section-title {
          color: #0f172a;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: -0.02em;
        }

        .section-icon {
          font-size: 20px;
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
          gap: 24px;
        }

        /* ✅ PREMIUM METRIC CARDS - PERFECT SIZE */
        .premium-metric-card {
          position: relative;
          padding: 28px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 6px -2px rgba(0, 0, 0, 0.03);
        }

        .premium-metric-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: #d1d5db;
          box-shadow: 
            0 12px 28px rgba(0, 0, 0, 0.08),
            0 6px 12px rgba(0, 0, 0, 0.06);
        }

        .metric-icon-container {
          position: relative;
          margin-bottom: 20px;
        }

        .metric-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
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
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 900;
          margin: 0 0 12px 0;
          font-feature-settings: 'tnum';
          letter-spacing: -0.03em;
          line-height: 1;
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
          color: #64748b;
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
          padding: 24px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .premium-category-card:hover {
          transform: translateY(-2px);
          border-color: #d1d5db;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.06),
            0 2px 4px -1px rgba(0, 0, 0, 0.04);
        }

        .category-label {
          color: #64748b;
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
          border-radius: 0 0 12px 12px;
        }

        /* ✅ ACTIVITY CARDS - PERFECT SIZE */
        .activity-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 6px -2px rgba(0, 0, 0, 0.03);
          height: 100%;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .activity-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 16px rgba(0, 0, 0, 0.06),
            0 3px 8px rgba(0, 0, 0, 0.04);
        }

        .activity-card-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .buildings-icon {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
        }

        .users-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .activity-title {
          color: #0f172a;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .activity-items-list {
          display: flex;
          flex-direction: column;
        }

        .activity-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #f8fafc;
          transition: all 0.2s ease;
        }

        .activity-list-item:hover {
          background: #f8fafc;
        }

        .activity-list-item:last-child {
          border-bottom: none;
        }

        .activity-item-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .activity-item-name {
          color: #0f172a;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
        }

        .activity-item-meta {
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
        }

        /* ✅ RESPONSIVE DESIGN */
        @media (max-width: 992px) {
          .hero-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .hero-left {
            flex-direction: column;
            gap: 16px;
          }

          .hero-title {
            font-size: 24px;
          }

          .section-title {
            font-size: 20px;
          }

          .premium-metric-card {
            padding: 24px;
          }

          .metric-value {
            font-size: 28px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-hero-section {
            padding: 20px 0;
          }

          .hero-title {
            font-size: 22px;
          }

          .hero-subtitle {
            font-size: 14px;
          }

          .dashboard-container {
            padding: 32px 16px 60px;
          }

          .section-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .section-line {
            width: 100%;
          }

          .activity-card-header {
            padding: 16px 20px 12px;
          }

          .activity-list-item {
            padding: 12px 20px;
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
    </>
  );
};

export default AdminDashboard;
