import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { api, handleApiError } from '../utils/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.bookings.getAll();
      
      let bookingsArray = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          bookingsArray = response.data;
        } else if (Array.isArray(response.data.data)) {
          bookingsArray = response.data.data;
        } else if (Array.isArray(response.data.bookings)) {
          bookingsArray = response.data.bookings;
        }
      }

      const processedBookings = bookingsArray.map(booking => ({
        ...booking,
        id: booking.id || booking._id,
        property: booking.property || {},
        checkIn: booking.checkIn || booking.check_in || '2025-09-19',
        checkOut: booking.checkOut || booking.check_out || '2025-09-20',
        status: booking.status || 'pending',
        totalPrice: booking.totalPrice || booking.total_price || 356,
        bookingType: booking.bookingType || booking.booking_type || 'Monthly',
        payment: booking.payment || booking.payment_method || 'On Spot'
      }));

      setBookings(processedBookings);
      setFilteredBookings(processedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = bookings.filter(booking => 
        booking.property?.title?.toLowerCase().includes(query) ||
        booking.property?.address?.toLowerCase().includes(query) ||
        booking.status?.toLowerCase().includes(query)
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchQuery, bookings]);

  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const handleCardClick = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'warning', text: 'PENDING' },
      'confirmed': { bg: 'success', text: 'CONFIRMED' },
      'cancelled': { bg: 'danger', text: 'CANCELLED' },
      'completed': { bg: 'success', text: 'COMPLETED' }
    };
    return statusMap[status.toLowerCase()] || { bg: 'secondary', text: status.toUpperCase() };
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <section className="hero-section">
          <Container>
            <div className="loading-content text-center py-5">
              <Spinner animation="border" className="mb-3" style={{color: '#7c3aed'}} />
              <h3>Loading Bookings...</h3>
              <p>Getting your booking history...</p>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <section className="hero-section">
          <Container>
            <Alert variant="danger" className="text-center my-5">
              <h3>Error Loading Bookings</h3>
              <p>{error}</p>
              <Button onClick={fetchBookings}>Try Again</Button>
            </Alert>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* HERO SECTION */}
      <section className="hero-section">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              <strong>📊 {filteredBookings.length} BOOKINGS FOUND</strong>
            </div>
            <h1 className="hero-title">
              My <span className="booking-text">Bookings</span>
            </h1>
            <p className="hero-subtitle">
              Manage and track all your property bookings in one place.<br />
              View details, check status, and manage your reservations.
            </p>
          </div>
        </Container>
      </section>

      {/* MAIN DASHBOARD */}
      <section className="dashboard-section">
        <Container fluid>
          <Row>
            {/* LEFT SIDEBAR */}
            <Col lg={3} className="sidebar-column">
              {/* Search Section */}
              <div className="search-section">
                <div className="search-header">
                  <span className="search-icon">🔍</span>
                  <span className="search-title">SEARCH BOOKINGS</span>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Search by property, location, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Stats Counter */}
              <div className="counter-box">
                <div className="counter-number">{filteredBookings.length}</div>
                <div className="counter-text">Total Bookings</div>
              </div>
            </Col>

            {/* RIGHT MAIN CONTENT */}
            <Col lg={9} className="main-column">
              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  <h2 className="results-title">{filteredBookings.length} Bookings Found</h2>
                  <p className="results-subtitle">
                    Your booking history • Updated {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* BOOKINGS CARDS */}
              {filteredBookings.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">📋</div>
                  <h3>No Bookings Found</h3>
                  <p>You haven't made any bookings yet, or no bookings match your search.</p>
                  <Link to="/find-property">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              ) : (
                <Row className="bookings-grid">
                  {filteredBookings.map((booking) => {
                    const statusInfo = getStatusBadge(booking.status);
                    return (
                      <Col key={booking.id} xs={12} lg={6} className="booking-col">
                        <div 
                          className="compact-booking-card"
                          onClick={() => handleCardClick(booking.id)}
                        >
                          <Row className="g-0 h-100">
                            {/* LEFT - LARGER IMAGE */}
                            <Col md={5}>
                              <div className="booking-image-container">
                                <img 
                                  src={booking.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&auto=format&q=80"}
                                  alt={booking.property?.title || "Property"}
                                  className="booking-image"
                                />
                                <div className="status-overlay">
                                  <Badge className={`compact-status-badge ${statusInfo.bg}`}>
                                    {statusInfo.text}
                                  </Badge>
                                </div>
                              </div>
                            </Col>

                            {/* RIGHT - COMPACT CONTENT */}
                            <Col md={7}>
                              <div className="compact-booking-content">
                                <div className="content-main">
                                  {/* Property Title & ID */}
                                  <div className="booking-header">
                                    <h3 className="property-name">{booking.property?.title || `Property #${booking.id}`}</h3>
                                    <div className="booking-id">#{booking.id}</div>
                                  </div>

                                  {/* Location */}
                                  <div className="compact-location-badge">
                                    <span className="location-icon">📍</span>
                                    <span className="location-text">{booking.property?.address || "namakkal, tamilnadu"}</span>
                                  </div>

                                  {/* Booking Details */}
                                  <div className="booking-details">
                                    <div className="detail-row">
                                      <div className="detail-item">
                                        <span className="detail-label">CHECK-IN</span>
                                        <span className="detail-value">{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">CHECK-OUT</span>
                                        <span className="detail-value">{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                      </div>
                                    </div>
                                    <div className="detail-row">
                                      <div className="detail-item">
                                        <span className="detail-label">TYPE</span>
                                        <span className="detail-value">{booking.bookingType}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">PAYMENT</span>
                                        <span className="detail-value">{booking.payment}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Price & Action */}
                                <div className="booking-footer">
                                  <div className="price-section">
                                    <span className="price-label">TOTAL PRICE</span>
                                    <div className="total-price">₹{booking.totalPrice}</div>
                                    <div className="booking-date">
                                      Booked on {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                  </div>
                                  
                                  <div 
                                    className="compact-action-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(booking.id);
                                    }}
                                  >
                                    <Button className="compact-view-btn">
                                      👁️ VIEW DETAILS
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .dashboard-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          line-height: 1.5;
          color: #374151;
        }

        /* HERO SECTION */
        .hero-section {
          background: linear-gradient(135deg, #8b5cf6 20%, #7c3aed 45%, #a855f7 70%, #ec4899 100%);
          padding: 3.5rem 0 3rem 0;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 0.5rem 1.2rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.2rem, 4vw, 2.8rem);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .booking-text {
          color: #fbbf24;
          font-weight: 900;
        }

        .hero-subtitle {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.95;
          margin-bottom: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* DASHBOARD SECTION */
        .dashboard-section {
          padding: 2rem 0;
          background: #f8fafc;
        }

        .sidebar-column {
          padding-right: 1.5rem;
        }

        .main-column {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        /* SIDEBAR STYLES */
        .search-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          font-size: 0.875rem;
          text-align: left;
        }

        .search-input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          width: 100%;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          outline: none;
        }

        .counter-box {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }

        .counter-number {
          font-size: 2rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .counter-text {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.9;
        }

        /* RESULTS HEADER */
        .results-header {
          margin-bottom: 2rem;
        }

        .results-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }

        .results-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        /* COMPACT BOOKING CARDS */
        .bookings-grid {
          margin: 0;
        }

        .booking-col {
          margin-bottom: 1.5rem;
        }

        .compact-booking-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          overflow: hidden;
          position: relative;
          height: 280px; /* COMPACT HEIGHT */
        }

        .compact-booking-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.2);
          border-color: rgba(124, 58, 237, 0.3);
        }

        /* LARGER IMAGE SECTION */
        .booking-image-container {
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 16px 0 0 16px;
        }

        .booking-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .compact-booking-card:hover .booking-image {
          transform: scale(1.05);
        }

        .status-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 3;
        }

        .compact-status-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.35rem 0.7rem;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .compact-status-badge.warning {
          background: rgba(251, 191, 36, 0.95);
          color: #92400e;
        }

        .compact-status-badge.success {
          background: rgba(34, 197, 94, 0.95);
          color: white;
        }

        .compact-status-badge.danger {
          background: rgba(239, 68, 68, 0.95);
          color: white;
        }

        /* COMPACT CONTENT SECTION */
        .compact-booking-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }

        .content-main {
          flex: 1;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }

        .property-name {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .booking-id {
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          padding: 0.25rem 0.6rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .compact-location-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.2);
          padding: 0.4rem 0.7rem;
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .location-icon {
          font-size: 0.75rem;
        }

        .location-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6d28d9;
          text-transform: capitalize;
        }

        /* BOOKING DETAILS */
        .booking-details {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .detail-item {
          flex: 1;
        }

        .detail-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .detail-value {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        /* BOOKING FOOTER */
        .booking-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(124, 58, 237, 0.1);
        }

        .price-section {
          flex: 1;
        }

        .price-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .total-price {
          font-size: 1.2rem;
          font-weight: 900;
          color: #059669;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .booking-date {
          font-size: 0.7rem;
          color: #9ca3af;
          font-weight: 500;
        }

        /* COMPACT ACTION BUTTON */
        .compact-action-button {
          pointer-events: all;
        }

        .compact-view-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .compact-view-btn:hover {
          background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
        }

        /* NO RESULTS */
        .no-results {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
        }

        .no-results-icon {
          font-size: 3rem;
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .no-results h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .no-results p {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 992px) {
          .sidebar-column {
            margin-bottom: 2rem;
            padding-right: 0;
          }

          .compact-booking-card {
            height: auto;
            min-height: 200px;
          }

          .booking-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }

        @media (max-width: 768px) {
          .dashboard-section {
            padding: 1rem 0;
          }

          .main-column {
            padding: 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .booking-col {
            margin-bottom: 1.25rem;
          }

          .compact-booking-card {
            height: auto;
          }

          .booking-image-container {
            height: 160px;
            border-radius: 16px 16px 0 0;
          }

          .detail-row {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .hero-section {
            padding: 2.5rem 0 2rem 0;
          }

          .hero-badge {
            padding: 0.4rem 1rem;
            font-size: 0.75rem;
          }

          .search-section {
            padding: 1rem;
          }

          .results-title {
            font-size: 1.5rem;
          }

          .compact-view-btn {
            padding: 0.6rem 1rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
