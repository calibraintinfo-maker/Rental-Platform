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

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!metrics) return null;

  // Animated counters for metrics
  const AnimatedNumber = ({ value }) => {
    const { number } = useSpring({
      from: { number: 0 },
      number: value,
      config: { duration: 900 },
    });
    return <animated.span>{number.to(n => Math.floor(n))}</animated.span>;
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold" style={{ letterSpacing: 1 }}>📊 Admin Dashboard</h2>
      {/* User Metrics */}
      <Row className="mb-4 g-4">
        {[
          { label: 'Total Users', value: metrics.users.total, color: 'primary', icon: 'bi-people-fill' },
          { label: 'Owners', value: metrics.users.owners, color: 'success', icon: 'bi-person-badge' },
          { label: 'Renters', value: metrics.users.renters, color: 'info', icon: 'bi-person' },
          { label: 'Suspended', value: metrics.users.suspended, color: 'danger', icon: 'bi-person-x' },
        ].map((m, i) => (
          <Col md={3} key={m.label}>
            <animated.div style={{
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              borderRadius: 18,
              background: '#fff',
              padding: '1.5rem',
              transition: 'transform 0.2s',
              willChange: 'transform',
              cursor: 'pointer',
            }}
              className={`h-100 border-start border-4 border-${m.color} animate__animated animate__fadeInUp animate__faster`}
            >
              <div className={`mb-2 text-${m.color}`}><i className={`bi ${m.icon} fs-3`} /></div>
              <h5 className="fw-bold">{m.label}</h5>
              <h2 className={`text-${m.color} fw-bold`}><AnimatedNumber value={m.value} /></h2>
            </animated.div>
          </Col>
        ))}
      </Row>
      {/* Property Metrics */}
      <Row className="mb-4 g-4">
        {[
          { label: 'Total Properties', value: metrics.properties.total, color: 'primary', icon: 'bi-building' },
          { label: 'Verified', value: metrics.properties.verified, color: 'success', icon: 'bi-patch-check' },
          { label: 'Pending', value: metrics.properties.pending, color: 'warning', icon: 'bi-hourglass-split' },
          { label: 'Rejected', value: metrics.properties.rejected, color: 'danger', icon: 'bi-x-circle' },
        ].map((m, i) => (
          <Col md={3} key={m.label}>
            <animated.div style={{
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              borderRadius: 18,
              background: '#fff',
              padding: '1.5rem',
              transition: 'transform 0.2s',
              willChange: 'transform',
              cursor: 'pointer',
            }}
              className={`h-100 border-start border-4 border-${m.color} animate__animated animate__fadeInUp animate__faster`}
            >
              <div className={`mb-2 text-${m.color}`}><i className={`bi ${m.icon} fs-3`} /></div>
              <h5 className="fw-bold">{m.label}</h5>
              <h2 className={`text-${m.color} fw-bold`}><AnimatedNumber value={m.value} /></h2>
            </animated.div>
          </Col>
        ))}
      </Row>
      {/* Properties by Category */}
      <Row className="mb-4 g-3">
        {metrics.properties.byCategory.map((cat, i) => (
          <Col md={2} key={cat._id}>
            <animated.div style={{
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              borderRadius: 14,
              background: '#f8f9fa',
              padding: '1rem',
              textAlign: 'center',
              transition: 'transform 0.2s',
              willChange: 'transform',
            }}
              className="animate__animated animate__fadeIn animate__faster"
            >
              <h6 className="fw-bold mb-1">{cat._id}</h6>
              <h4 className="text-primary mb-0"><AnimatedNumber value={cat.count} /></h4>
            </animated.div>
          </Col>
        ))}
      </Row>
      {/* Booking Metrics */}
      <Row className="mb-4 g-4">
        {[
          { label: 'Total Bookings', value: metrics.bookings.total, color: 'primary', icon: 'bi-calendar-check' },
          { label: 'Ongoing', value: metrics.bookings.ongoing, color: 'info', icon: 'bi-clock-history' },
          { label: 'Completed', value: metrics.bookings.completed, color: 'success', icon: 'bi-check-circle' },
          { label: 'Canceled', value: metrics.bookings.canceled, color: 'danger', icon: 'bi-x-octagon' },
        ].map((m, i) => (
          <Col md={3} key={m.label}>
            <animated.div style={{
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              borderRadius: 18,
              background: '#fff',
              padding: '1.5rem',
              transition: 'transform 0.2s',
              willChange: 'transform',
              cursor: 'pointer',
            }}
              className={`h-100 border-start border-4 border-${m.color} animate__animated animate__fadeInUp animate__faster`}
            >
              <div className={`mb-2 text-${m.color}`}><i className={`bi ${m.icon} fs-3`} /></div>
              <h5 className="fw-bold">{m.label}</h5>
              <h2 className={`text-${m.color} fw-bold`}><AnimatedNumber value={m.value} /></h2>
            </animated.div>
          </Col>
        ))}
      </Row>
      {/* Recent Activity */}
      <h4 className="mt-4 mb-3 fw-bold">Recent Activity</h4>
      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4 animate__animated animate__fadeIn animate__faster">
            <Card.Body>
              <h6 className="fw-bold mb-3 text-primary"><i className="bi bi-building me-2" />Recently Added Properties</h6>
              <ul className="mb-0 ps-3">
                {metrics.recent.properties.map(p => <li key={p._id}>{p.title}</li>)}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4 animate__animated animate__fadeIn animate__faster">
            <Card.Body>
              <h6 className="fw-bold mb-3 text-primary"><i className="bi bi-person-plus me-2" />Recently Registered Users</h6>
              <ul className="mb-0 ps-3">
                {metrics.recent.users.map(u => <li key={u._id}>{u.name} ({u.email})</li>)}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
