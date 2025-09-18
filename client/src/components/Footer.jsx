import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>🏠 SpaceLink</h5>
            <p>Your trusted platform for property rentals. Find the perfect space for your needs.</p>
          </Col>
          <Col md={2}>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/find-property" className="text-light">Find Property</a></li>
              <li><a href="/add-property" className="text-light">Add Property</a></li>
              <li><a href="/my-bookings" className="text-light">My Bookings</a></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Categories</h6>
            <ul className="list-unstyled">
              <li><span className="text-light">Property Rentals</span></li>
              <li><span className="text-light">Commercial</span></li>
              <li><span className="text-light">Land</span></li>
              <li><span className="text-light">Parking</span></li>
              <li><span className="text-light">Events</span></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Help & FAQ</a></li>
              <li><a href="#" className="text-light">Contact Us</a></li>
              <li><a href="#" className="text-light">Terms & Conditions</a></li>
            </ul>
          </Col>
          <Col md={2}>
            <h6>Legal</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Privacy Policy</a></li>
              <li><a href="#" className="text-light">Terms of Service</a></li>
              <li><a href="#" className="text-light">Cookie Policy</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="text-light" />
        <Row>
          <Col className="text-center">
            <p>&copy; 2024 SpaceLink. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
