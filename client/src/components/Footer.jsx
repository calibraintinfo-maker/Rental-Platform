import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer style={{
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      padding: '24px 0 16px 0',
      marginTop: 'auto',
      fontSize: '14px'
    }}>
      <Container>
        <Row>
          <Col lg={3} md={6} className="mb-3">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                borderRadius: '6px',
                padding: '4px'
              }}>
                <span style={{ fontSize: '14px', color: 'white' }}>🏠</span>
              </div>
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>SpaceLink</span>
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '13px',
              lineHeight: '1.5',
              margin: '0 0 16px 0',
              maxWidth: '240px'
            }}>
              Your trusted global rental platform helping clients worldwide.
            </p>
            
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Stay Updated</p>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px', maxWidth: '240px' }}>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: 'white'
                  }}
                  required
                />
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-3">
            <h6 style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Quick Links</h6>
            {[
              { name: 'Find Property', path: '/find-property' },
              { name: 'List Property', path: '/add-property' },
              { name: 'My Bookings', path: '/my-bookings' },
              { name: 'Profile', path: '/profile' }
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: '6px' }}>
                <Link 
                  to={item.path}
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7c3aed';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </Col>
          
          <Col lg={2} md={6} className="mb-3">
            <h6 style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Categories</h6>
            {['Properties', 'Event Venues', 'Vehicles', 'Parking'].map((item, index) => (
              <div key={index} style={{ marginBottom: '6px' }}>
                <Link 
                  to="/find-property"
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7c3aed';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {item}
                </Link>
              </div>
            ))}
          </Col>
          
          <Col lg={2} md={6} className="mb-3">
            <h6 style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Support</h6>
            {[
              { name: 'Help Center', path: '/help' },
              { name: 'Contact Us', path: '/contact' },
              { name: 'About Us', path: '/about' },
              { name: 'Blog', path: '/blog' }
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: '6px' }}>
                <Link 
                  to={item.path}
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7c3aed';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </Col>
          
          <Col lg={3} md={6} className="mb-3">
            <h6 style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#374151',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Legal</h6>
            {[
              { name: 'Privacy Policy', path: '/privacy' },
              { name: 'Terms of Service', path: '/terms' },
              { name: 'Cookie Policy', path: '/cookies' },
              { name: 'Disclaimer', path: '/disclaimer' }
            ].map((item, index) => (
              <div key={index} style={{ marginBottom: '6px' }}>
                <Link 
                  to={item.path}
                  style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 400,
                    transition: 'all 0.2s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7c3aed';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </Col>
        </Row>
        
        <div style={{ 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: '12px', 
          marginTop: '16px',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '12px', 
            margin: 0,
            fontWeight: 400
          }}>
            © 2025 SpaceLink. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;