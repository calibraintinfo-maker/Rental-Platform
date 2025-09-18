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
    setExpanded(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setExpanded(false);
  };

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
              <Nav className="ms-auto align-items-center" style={{ gap: '1.5rem' }}>
                
                {/* Navigation Links with Hover Effects */}
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
                    
                    {/* Properties Dropdown - Fixed */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  /* Profile Dropdown - Fixed */
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
      
      {/* Custom CSS Styles - PERFECTLY RESPONSIVE */}
      <style jsx>{`
        /* ======= NAVBAR DROPDOWN FIXES ======= */
        
        /* Fix dropdown toggle arrows */
        .custom-navbar-dropdown .dropdown-toggle::after {
          border-top: 0.4em solid;
          border-right: 0.35em solid transparent;
          border-left: 0.35em solid transparent;
          border-bottom: 0;
          vertical-align: 0.1em;
          margin-left: 0.5em;
          transition: transform 0.2s ease;
        }
        /* Rotate arrow when dropdown is open */
        .custom-navbar-dropdown .dropdown-toggle[aria-expanded="true"]::after {
          transform: rotate(180deg);
        }
        /* Style the dropdown menu containers */
        .custom-navbar-dropdown .dropdown-menu {
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          padding: 0.5rem 0 !important;
          margin-top: 0.5rem !important;
          min-width: 200px !important;
          background: white !important;
          backdrop-filter: blur(20px) !important;
          animation: dropdownFadeIn 0.2s ease-out !important;
        }
        /* Style dropdown items */
        .custom-navbar-dropdown .dropdown-item {
          padding: 0.75rem 1.25rem !important;
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          color: #374151 !important;
          transition: all 0.2s ease !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
        }
        /* Dropdown item hover effects */
        .custom-navbar-dropdown .dropdown-item:hover,
        .custom-navbar-dropdown .dropdown-item:focus {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
          transform: translateX(4px) !important;
        }
        /* Logout item special styling */
        .logout-item:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }
        /* Dropdown dividers */
        .custom-navbar-dropdown .dropdown-divider {
          border-color: #e5e7eb !important;
          margin: 0.5rem 0 !important;
        }
        /* Dropdown headers */
        .custom-navbar-dropdown .dropdown-header {
          padding: 0.75rem 1.25rem 0.5rem 1.25rem !important;
          color: #6b7280 !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
        }
        /* Properties dropdown specific styling */
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
        /* Admin dropdown styling */
        .admin-dropdown .dropdown-toggle {
          color: #dc2626 !important;
        }
        /* Profile dropdown specific styling */
        .profile-dropdown .dropdown-toggle {
          background: transparent !important;
          border: none !important;
          padding: 0.5rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
        }
        .profile-dropdown .dropdown-toggle:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          border-radius: 8px !important;
        }
        /* Active dropdown toggle styling */
        .custom-navbar-dropdown .dropdown-toggle.show {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
        }
        /* Navigation links hover effects */
        .navbar-nav-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        /* Login link hover */
        .login-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-2px) !important;
        }
        /* Register button hover */
        .register-button:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        }
        /* Smooth animations */
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Logo pulse animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* ========== PERFECT RESPONSIVE DESIGN ========== */

        /* Large Desktop (1200px+) */
        @media (min-width: 1200px) {
          .navbar-brand {
            font-size: 1.7rem !important;
          }
        }

        /* Desktop (992px+) */
        @media (min-width: 992px) {
          .d-md-inline {
            display: inline !important;
          }
        }

        /* Tablet and Mobile (991px and below) */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background-color: rgba(255, 255, 255, 0.98) !important;
            padding: 1rem !important;
            margin-top: 0.5rem !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(20px) !important;
          }

          .navbar-nav {
            gap: 0 !important;
            width: 100% !important;
          }

          .navbar-nav-link {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 8px !important;
            width: 100% !important;
            text-align: left !important;
            margin-bottom: 8px !important;
          }

          .custom-navbar-dropdown .dropdown-toggle {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            width: 100% !important;
            text-align: left !important;
            border-radius: 8px !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important;
          }

          .custom-navbar-dropdown .dropdown-menu {
            width: 100% !important;
            border-radius: 8px !important;
            margin-top: 0 !important;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06) !important;
            background: rgba(248, 250, 252, 0.9) !important;
          }

          .auth-section {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
            margin-top: 16px !important;
          }

          .login-link,
          .register-button {
            width: 100% !important;
            text-align: center !important;
            padding: 12px !important;
            font-size: 1rem !important;
            margin-bottom: 8px !important;
          }

          .profile-dropdown .dropdown-toggle {
            padding: 12px 16px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            justify-content: space-between !important;
            width: 100% !important;
            margin-bottom: 8px !important;
          }

          .d-md-inline {
            display: inline !important;
          }
        }

        /* Mobile Large (576px - 767px) */
        @media (max-width: 767.98px) {
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

          .profile-dropdown .dropdown-toggle div {
            width: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
          }
        }

        /* Small Mobile (575px and below) */
        @media (max-width: 575.98px) {
          .navbar-brand {
            font-size: 1.2rem !important;
          }

          .navbar-brand div {
            width: 32px !important;
            height: 32px !important;
            padding: 4px !important;
          }

          .navbar-brand span {
            font-size: 1rem !important;
          }

          .profile-dropdown .dropdown-toggle div {
            width: 24px !important;
            height: 24px !important;
            font-size: 11px !important;
          }

          .dropdown-item {
            font-size: 0.85rem !important;
            padding: 0.6rem 1rem !important;
          }
        }

        /* Extra Small Mobile (479px and below) */
        @media (max-width: 479.98px) {
          .navbar-brand {
            font-size: 1.1rem !important;
          }

          .navbar-nav-link,
          .custom-navbar-dropdown .dropdown-toggle {
            font-size: 0.95rem !important;
            padding: 10px 12px !important;
          }
        }

        /* Hide profile name on very small screens */
        @media (max-width: 375px) {
          .d-md-inline {
            display: none !important;
          }
        }

        /* Icon spacing in dropdown items */
        .custom-navbar-dropdown .dropdown-item {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;
