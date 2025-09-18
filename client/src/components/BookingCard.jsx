import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { formatDate, formatPrice, getImageUrl } from '../utils/api';

const BookingCard = ({ booking }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'approved':
        return 'status-badge status-approved';
      case 'active':
        return 'status-badge status-active';
      case 'rejected':
        return 'status-badge status-rejected';
      case 'ended':
        return 'status-badge status-ended';
      case 'expired':
        return 'status-badge status-expired';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col md={3}>
            <img 
              src={getImageUrl(booking.propertyId?.image)} 
              alt={booking.propertyId?.title}
              className="img-fluid rounded"
              style={{ height: '120px', objectFit: 'cover', width: '100%' }}
            />
          </Col>
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="mb-0">{booking.propertyId?.title}</h5>
              <span className={getStatusBadgeClass(booking.status)}>
                {booking.status.toUpperCase()}
              </span>
            </div>
            
            <p className="text-muted mb-2">
              📍 {booking.propertyId?.address?.city}, {booking.propertyId?.address?.state}
            </p>
            
            <Row className="mb-2">
              <Col sm={6}>
                <strong>Check-in:</strong> {formatDate(booking.fromDate)}
              </Col>
              <Col sm={6}>
                <strong>Check-out:</strong> {formatDate(booking.toDate)}
              </Col>
            </Row>
            
            <Row className="mb-2">
              <Col sm={6}>
                <strong>Booking Type:</strong> {booking.bookingType}
              </Col>
              <Col sm={6}>
                <strong>Total Price:</strong> ₹{booking.totalPrice?.toLocaleString()}
              </Col>
            </Row>
            
            <Row>
              <Col sm={6}>
                <strong>Payment:</strong> {booking.paymentMode}
              </Col>
              <Col sm={6}>
                <strong>Booked on:</strong> {formatDate(booking.createdAt)}
              </Col>
            </Row>
            
            {booking.notes && (
              <div className="mt-2">
                <strong>Notes:</strong> {booking.notes}
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BookingCard;
