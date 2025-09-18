import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
    setExpanded(false); // Close menu after logout
  };

  const closeMenu = () => {
    setExpanded(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <BootstrapNavbar 
        expand="lg" 
        fixed="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
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
              onClick={closeMenu}
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
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}>
                <span style={{ fontSize: '1.4rem' }}>🏠</span>
              </div>
              SpaceLink
            </BootstrapNavbar.Brand>
            
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
            
            <BootstrapNavbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center responsive-nav">
                
                {/* Navigation Links */}
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  onClick={closeMenu}
                  className="navbar-nav-link"
                  style={{
                    color: isActive('/find-property') ? '#667eea' : '#64748b',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Find Property
                </Nav.Link>
                
                {isAuthenticated && (
                  <>
                    <Nav.Link 
                      as={Link} 
                      to="/my-bookings"
                      onClick={closeMenu}
                      className="navbar-nav-link"
                      style={{
                        color: isActive('/my-bookings') ? '#667eea' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      My Bookings
                    </Nav.Link>
                    
                    {/* Properties Dropdown */}
                    <NavDropdown 
                      title="Properties" 
                      id="property-dropdown"
                      className="custom-navbar-dropdown"
                    >
                      <NavDropdown.Item as={Link} to="/add-property" onClick={closeMenu}>
                        📝 Add Property
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/manage-properties" onClick={closeMenu}>
                        ⚙️ Manage Properties
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/my-property-status" onClick={closeMenu}>
                        📊 Property Status
                      </NavDropdown.Item>
                    </NavDropdown>

                    {/* Admin Links */}
                    {user?.role === 'admin' && (
                      <NavDropdown 
                        title="Admin" 
                        id="admin-dropdown"
                        className="custom-navbar-dropdown admin-dropdown"
                      >
                        <NavDropdown.Item as={Link} to="/admin/dashboard" onClick={closeMenu}>
                          🏢 Dashboard
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/verify-properties" onClick={closeMenu}>
                          ✅ Verify Properties
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                  </>
                )}
                
                {/* Auth Section */}
                {!isAuthenticated ? (
                  <div className="auth-buttons">
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      className="login-link"
                      style={{
                        color: '#64748b',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Login
                    </Link>
                    
                    <Link 
                      to="/register" 
                      onClick={closeMenu}
                      className="register-button"
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
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  /* Profile Dropdown */
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
                        <span className="profile-name">{user?.name || 'User'}</span>
                      </div>
                    }
                    id="user-dropdown"
                    align="end"
                    className="custom-navbar-dropdown profile-dropdown"
                  >
                    <NavDropdown.Header>
                      <strong>{user?.name || 'User'}</strong><br />
                      <small className="text-muted">{user?.email || 'user@example.com'}</small>
                    </NavDropdown.Header>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/profile" onClick={closeMenu}>
                      👤 Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-bookings" onClick={closeMenu}>
                      📋 My Bookings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                      onClick={handleLogout} 
                      className="logout-item"
                    >
                      🚪 Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </BootstrapNavbar.Collapse>
          </div>
        </Container>
      </BootstrapNavbar>
      
      {/* 🎯 PERFECT RESPONSIVE STYLES */}
      <style jsx>{`
        /* ======= NAVBAR FIXES ======= */
        .custom-navbar-dropdown .dropdown-toggle::after {
          border-top: 0.4em solid;
          border-right: 0.35em solid transparent;
          border-left: 0.35em solid transparent;
          border-bottom: 0;
          vertical-align: 0.1em;
          margin-left: 0.5em;
          transition: transform 0.2s ease;
        }

        .custom-navbar-dropdown .dropdown-toggle[aria-expanded="true"]::after {
          transform: rotate(180deg);
        }

        .custom-navbar-dropdown .dropdown-menu {
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          padding: 0.5rem 0 !important;
          margin-top: 0.5rem !important;
          min-width: 200px !important;
          background: white !important;
          backdrop-filter: blur(20px) !important;
        }

        .custom-navbar-dropdown .dropdown-item {
          padding: 0.75rem 1.25rem !important;
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          color: #374151 !important;
          transition: all 0.2s ease !important;
        }

        .custom-navbar-dropdown .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
          transform: translateX(4px) !important;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        .custom-navbar-dropdown .dropdown-toggle {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          transition: all 0.2s ease !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          background: transparent !important;
          border: none !important;
        }

        .custom-navbar-dropdown .dropdown-toggle:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
        }

        .navbar-nav-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
          transform: translateY(-2px) !important;
        }

        .login-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-2px) !important;
        }

        .register-button:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        }

        /* ========== 📱 MOBILE RESPONSIVE DESIGN ========== */
        
        /* Large screens (992px+) - Desktop */
        @media (min-width: 992px) {
          .responsive-nav {
            gap: 1.5rem !important;
          }
          .profile-name {
            display: inline !important;
          }
        }

        /* Mobile/Tablet (991px and below) */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background-color: rgba(255, 255, 255, 0.98) !important;
            padding: 1.5rem !important;
            margin-top: 0.5rem !important;
            border-radius: 15px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
          }

          .responsive-nav {
            flex-direction: column !important;
            gap: 0 !important;
            width: 100% !important;
            align-items: stretch !important;
          }

          .navbar-nav-link {
            width: 100% !important;
            text-align: left !important;
            padding: 12px 16px !important;
            font-size: 1rem !important;
            margin-bottom: 8px !important;
            border-radius: 10px !important;
          }

          .custom-navbar-dropdown .dropdown-toggle {
            width: 100% !important;
            text-align: left !important;
            padding: 12px 16px !important;
            font-size: 1rem !important;
            margin-bottom: 8px !important;
            border-radius: 10px !important;
            justify-content: space-between !important;
            display: flex !important;
            align-items: center !important;
          }

          .custom-navbar-dropdown .dropdown-menu {
            width: 100% !important;
            border-radius: 10px !important;
            margin-top: 0 !important;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06) !important;
            background: rgba(248, 250, 252, 0.9) !important;
          }

          .auth-buttons {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            width: 100% !important;
            margin-top: 15px !important;
          }

          .login-link,
          .register-button {
            width: 100% !important;
            text-align: center !important;
            padding: 12px 20px !important;
            font-size: 1rem !important;
            border-radius: 10px !important;
          }

          .profile-dropdown .dropdown-toggle {
            padding: 12px 16px !important;
            border-radius: 10px !important;
            margin-bottom: 8px !important;
            justify-content: space-between !important;
          }

          .profile-name {
            display: inline !important;
          }
        }

        /* Small mobile (575px and below) */
        @media (max-width: 575.98px) {
          .navbar-brand {
            font-size: 1.4rem !important;
          }

          .navbar-brand div {
            width: 36px !important;
            height: 36px !important;
            padding: 6px !important;
          }

          .navbar-brand span {
            font-size: 1.2rem !important;
          }

          .navbar-collapse {
            padding: 1rem !important;
          }

          .navbar-nav-link,
          .custom-navbar-dropdown .dropdown-toggle {
            font-size: 0.95rem !important;
            padding: 10px 14px !important;
          }
        }

        /* Extra small mobile (320px - 479px) */
        @media (max-width: 479.98px) {
          .navbar-brand {
            font-size: 1.2rem !important;
          }

          .navbar-brand div {
            width: 32px !important;
            height: 32px !important;
            padding: 4px !important;
          }
        }

        /* Hide profile name on very small screens */
        @media (max-width: 350px) {
          .profile-name {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
