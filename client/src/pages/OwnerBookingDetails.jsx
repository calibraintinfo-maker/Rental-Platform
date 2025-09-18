import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { api, handleApiError, formatDate } from '../utils/api';

const OwnerBookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line
  }, [bookingId]);

  const fetchBooking = async () => {
    setLoading(true);
    setError('');
    try {
  const response = await api.bookings.getById(bookingId);
      setBooking(response.data);
    } catch (err) {
      // Log error details for debugging
      console.error('Booking fetch error:', err);
      // Show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(handleApiError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerAction = async (action) => {
    setError('');
    setSuccess('');
    try {
      if (action === 'approve') {
        await api.bookings.approve(bookingId);
        setSuccess('Booking approved');
      } else if (action === 'reject') {
        await api.bookings.reject(bookingId);
        setSuccess('Booking rejected');
      } else if (action === 'end') {
        await api.bookings.end(bookingId);
        setSuccess('Booking ended');
      }
      fetchBooking();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading booking details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Booking not found.</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4>Booking Details</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>User Information</h5>
              <p><strong>Name:</strong> {booking.userId?.name}</p>
              <p><strong>Email:</strong> {booking.userId?.email}</p>
              <p><strong>Contact:</strong> {booking.userId?.contact}</p>
              <p><strong>Age:</strong> {booking.userId?.age || 'N/A'}</p>
            </Col>
            <Col md={6}>
              <h5>Booking Information</h5>
              <p><strong>Status:</strong> <Badge bg={
                booking.status === 'pending' ? 'warning'
                : booking.status === 'approved' ? 'success'
                : booking.status === 'rejected' ? 'danger'
                : booking.status === 'ended' ? 'secondary'
                : 'info'
              }>{booking.status.toUpperCase()}</Badge></p>
              <p><strong>From:</strong> {formatDate(booking.fromDate)}</p>
              <p><strong>To:</strong> {formatDate(booking.toDate)}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice?.toLocaleString()}</p>
              <p><strong>Notes:</strong> {booking.notes || 'None'}</p>
            </Col>
          </Row>
          <div className="mt-4 d-flex gap-2">
            {booking.status === 'pending' && (
              <>
                <Button variant="success" onClick={() => handleOwnerAction('approve')}>Approve</Button>
                <Button variant="danger" onClick={() => handleOwnerAction('reject')}>Reject</Button>
              </>
            )}
            {['approved', 'active'].includes(booking.status) && (
              <Button variant="secondary" onClick={() => handleOwnerAction('end')}>End Booking</Button>
            )}
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>Back</Button>
          </div>
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OwnerBookingDetails;
