import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { api, handleApiError } from '../utils/api';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError(handleApiError(err));
    } finally {
      setLoading(false);
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
              <h5>Property Information</h5>
              <p><strong>Title:</strong> {booking.propertyId?.title}</p>
              <p><strong>Category:</strong> {booking.propertyId?.category}</p>
              <p><strong>Address:</strong> {booking.propertyId?.address?.city}, {booking.propertyId?.address?.state}</p>
            </Col>
            <Col md={6}>
              <h5>Booking Information</h5>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Type:</strong> {booking.bookingType}</p>
              <p><strong>From:</strong> {new Date(booking.fromDate).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(booking.toDate).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice?.toLocaleString()}</p>
              <p><strong>Notes:</strong> {booking.notes || 'None'}</p>
            </Col>
          </Row>
          <hr />
          <h5>Owner Information</h5>
          <p><strong>Name:</strong> {booking.propertyId?.ownerId?.name || booking.propertyId?.ownerId}</p>
          <p><strong>Email:</strong> {booking.propertyId?.ownerId?.email || 'N/A'}</p>
          <p><strong>Contact:</strong> {booking.propertyId?.ownerId?.contact || 'N/A'}</p>
          <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mt-3">Back</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetails;
