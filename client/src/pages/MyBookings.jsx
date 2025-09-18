import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import Modal from 'react-bootstrap/Modal';
import { api, handleApiError } from '../utils/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.bookings.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // List of all statuses to show
  const statusSections = [
    { key: 'pending', label: '🟡 Pending Bookings', color: 'warning' },
    { key: 'approved', label: '🟢 Approved Bookings', color: 'success' },
    { key: 'active', label: '🟢 Active Bookings', color: 'success' },
    { key: 'rejected', label: '🔴 Rejected Bookings', color: 'danger' },
    { key: 'ended', label: '⚫ Ended Bookings', color: 'secondary' },
    { key: 'expired', label: '🔴 Expired Bookings', color: 'danger' },
    { key: 'cancelled', label: '⚫ Cancelled Bookings', color: 'secondary' },
  ];

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your bookings...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>📋 My Bookings</h2>
              <p className="text-muted mb-0">
                Manage and track all your property bookings
              </p>
            </div>
            <Button as={Link} to="/find-property" variant="primary">
              🔍 Find More Properties
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {bookings.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <div className="mb-4">
                  <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                </div>
                <h4>No Bookings Yet</h4>
                <p className="text-muted mb-4">
                  You haven't made any bookings yet. Start exploring properties to make your first booking!
                </p>
                <Button as={Link} to="/find-property" variant="primary" size="lg">
                  🔍 Browse Properties
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <>
              {statusSections.map(section => (
                getBookingsByStatus(section.key).length > 0 && (
                  <div className="mb-5" key={section.key}>
                    <h4 className={`mb-3 text-${section.color}`}>
                      {section.label} ({getBookingsByStatus(section.key).length})
                    </h4>
                    {getBookingsByStatus(section.key).map((booking) => (
                      <div key={booking._id}>
                        <BookingCard booking={booking} />
                        <div className="mb-3 text-end">
                            <Button
                              size="sm"
                              variant="info"
                              as={Link}
                              to={`/booking/${booking._id}`}
                            >
                            View Detail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ))}
              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">📊 Booking Summary</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="text-center">
                    <Col md={3}>
                      <div className="mb-2">
                        <h3 className="text-primary">{bookings.length}</h3>
                        <p className="text-muted mb-0">Total Bookings</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <h3 className="text-success">{getBookingsByStatus('active').length}</h3>
                        <p className="text-muted mb-0">Active</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <h3 className="text-danger">{getBookingsByStatus('expired').length}</h3>
                        <p className="text-muted mb-0">Expired</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-2">
                        <h3 className="text-secondary">{getBookingsByStatus('cancelled').length}</h3>
                        <p className="text-muted mb-0">Cancelled</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyBookings;
