import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <BootstrapNavbar 
      expand="lg" 
      fixed="top"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: scrolled 
          ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
          : '0 2px 10px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        height: '70px',
        padding: '0',
        zIndex: 1050,
      }}
    >
      <Container>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '70px'
        }}>
          
          {/* Enhanced Logo */}
          <BootstrapNavbar.Brand 
            as={Link} 
            to="/" 
            style={{
              color: '#1e293b',
              fontSize: '1.6rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              animation: 'pulse 2s infinite'
            }}>
              <span style={{ fontSize: '1.4rem' }}>🏠</span>
            </div>
            SpaceLink
          </BootstrapNavbar.Brand>
          
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center" style={{ gap: '1.5rem' }}>
              
              {/* Navigation Links with Hover Effects */}
              <Nav.Link 
                as={Link} 
                to="/find-property"
                style={{
                  color: isActive('/find-property') ? '#667eea' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#667eea';
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isActive('/find-property') ? '#667eea' : '#64748b';
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Find Property
              </Nav.Link>
              
              {isAuthenticated && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/my-bookings"
                    style={{
                      color: isActive('/my-bookings') ? '#667eea' : '#64748b',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#667eea';
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = isActive('/my-bookings') ? '#667eea' : '#64748b';
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    My Bookings
                  </Nav.Link>
                  
                  <NavDropdown 
                    title="Properties" 
                    id="property-dropdown"
                    style={{
                      color: '#64748b',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to="/add-property"
                      style={{ 
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      📝 Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/manage-properties"
                      style={{ 
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ⚙️ Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-property-status"
                      style={{ 
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      📊 Property Status
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Admin Links */}
                  {user?.role === 'admin' && (
                    <NavDropdown 
                      title="Admin" 
                      id="admin-dropdown"
                      style={{
                        color: '#dc2626',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        🏢 Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/verify-properties">
                        ✅ Verify Properties
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              )}
              
              {/* Auth Section */}
              {!isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link 
                    to="/login" 
                    style={{
                      color: '#64748b',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#667eea';
                      e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#64748b';
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Login
                  </Link>
                  
                  <Link 
                    to="/register" 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 20px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <NavDropdown
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="d-none d-md-inline">{user?.name || 'User'}</span>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>
                    <strong>{user?.name || 'User'}</strong><br />
                    <small className="text-muted">{user?.email || 'user@example.com'}</small>
                  </NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile">
                    👤 Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-bookings">
                    📋 My Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item 
                    onClick={handleLogout} 
                    className="text-danger"
                    style={{ fontWeight: 500 }}
                  >
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </div>
      </Container>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .navbar-nav .nav-link:hover {
          transform: translateY(-2px);
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 0.5rem 0;
          margin-top: 0.5rem;
        }
        
        .dropdown-item {
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(4px);
        }
      `}</style>
    </BootstrapNavbar>
  );
};

export default Navbar;
