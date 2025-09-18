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
    <>
      <BootstrapNavbar 
        expand="lg" 
        fixed="top"
        className="navbar-responsive"
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
          <div className="navbar-content">
            
            {/* Logo - Responsive */}
            <BootstrapNavbar.Brand 
              as={Link} 
              to="/" 
              className="logo-brand"
            >
              <div className="logo-icon">
                🏠
              </div>
              <span className="logo-text">SpaceLink</span>
            </BootstrapNavbar.Brand>
            
            <BootstrapNavbar.Toggle aria-controls="navbar-nav" className="navbar-toggler-custom" />
            
            <BootstrapNavbar.Collapse id="navbar-nav">
              <Nav className="navbar-nav-custom">
                
                {/* Navigation Links */}
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  className={`nav-link-responsive ${isActive('/find-property') ? 'active' : ''}`}
                >
                  Find Property
                </Nav.Link>
                
                {isAuthenticated && (
                  <>
                    <Nav.Link 
                      as={Link} 
                      to="/my-bookings"
                      className={`nav-link-responsive ${isActive('/my-bookings') ? 'active' : ''}`}
                    >
                      My Bookings
                    </Nav.Link>
                    
                    {/* Properties Dropdown */}
                    <NavDropdown 
                      title="Properties" 
                      id="properties-dropdown"
                      className="dropdown-responsive"
                    >
                      <NavDropdown.Item as={Link} to="/add-property" className="dropdown-item-custom">
                        📝 Add Property
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/manage-properties" className="dropdown-item-custom">
                        ⚙️ Manage Properties
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/my-property-status" className="dropdown-item-custom">
                        📊 Property Status
                      </NavDropdown.Item>
                    </NavDropdown>

                    {/* Admin Links */}
                    {user?.role === 'admin' && (
                      <NavDropdown 
                        title="Admin" 
                        id="admin-dropdown"
                        className="dropdown-responsive admin-dropdown"
                      >
                        <NavDropdown.Item as={Link} to="/admin/dashboard" className="dropdown-item-custom">
                          🏢 Dashboard
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/verify-properties" className="dropdown-item-custom">
                          ✅ Verify Properties
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                  </>
                )}
                
                {/* Auth Section */}
                {!isAuthenticated ? (
                  <div className="auth-buttons">
                    <Link to="/login" className="login-button-responsive">
                      Login
                    </Link>
                    <Link to="/register" className="register-button-responsive">
                      Get Started
                    </Link>
                  </div>
                ) : (
                  /* Profile Dropdown */
                  <NavDropdown
                    title={
                      <div className="profile-title">
                        <div className="profile-avatar-responsive">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="profile-name">{user?.name || 'User'}</span>
                      </div>
                    }
                    id="profile-dropdown"
                    align="end"
                    className="dropdown-responsive profile-dropdown"
                  >
                    <NavDropdown.Header className="dropdown-header-custom">
                      <strong>{user?.name || 'User'}</strong><br />
                      <small className="text-muted">{user?.email || 'user@example.com'}</small>
                    </NavDropdown.Header>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                      👤 Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-bookings" className="dropdown-item-custom">
                      📋 My Bookings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                      onClick={handleLogout} 
                      className="dropdown-item-custom logout-item-responsive"
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

      {/* Comprehensive Responsive Styles */}
      <style jsx>{`
        /* ========== BASE STYLES ========== */
        .navbar-responsive {
          transition: all 0.3s ease !important;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 70px;
        }

        /* ========== LOGO STYLES ========== */
        .logo-brand {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          color: #1e293b !important;
          font-size: 1.6rem !important;
          font-weight: 800 !important;
          text-decoration: none !important;
          transition: transform 0.2s ease !important;
        }

        .logo-brand:hover {
          transform: scale(1.05) !important;
          color: #1e293b !important;
        }

        .logo-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 10px !important;
          padding: 8px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
          font-size: 1.4rem !important;
          width: 40px !important;
          height: 40px !important;
        }

        /* ========== NAVIGATION STYLES ========== */
        .navbar-nav-custom {
          margin-left: auto !important;
          display: flex !important;
          align-items: center !important;
          gap: 1.5rem !important;
        }

        .nav-link-responsive {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          text-decoration: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .nav-link-responsive:hover,
        .nav-link-responsive.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
          transform: translateY(-2px) !important;
        }

        /* ========== DROPDOWN STYLES ========== */
        .dropdown-responsive .dropdown-toggle {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          transition: all 0.2s ease !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          background: transparent !important;
          border: none !important;
        }

        .dropdown-responsive .dropdown-toggle:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
        }

        .dropdown-responsive .dropdown-toggle::after {
          border-top: 0.4em solid !important;
          border-right: 0.35em solid transparent !important;
          border-left: 0.35em solid transparent !important;
          border-bottom: 0 !important;
          vertical-align: 0.1em !important;
          margin-left: 0.5em !important;
          transition: transform 0.2s ease !important;
        }

        .dropdown-responsive .dropdown-toggle[aria-expanded="true"]::after {
          transform: rotate(180deg) !important;
        }

        .dropdown-responsive .dropdown-menu {
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

        .dropdown-item-custom {
          padding: 0.75rem 1.25rem !important;
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          color: #374151 !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
        }

        .dropdown-item-custom:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
          transform: translateX(4px) !important;
        }

        /* ========== AUTH BUTTONS ========== */
        .auth-buttons {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        .login-button-responsive {
          color: #64748b !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .login-button-responsive:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-2px) !important;
        }

        .register-button-responsive {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 10px 20px !important;
          color: white !important;
          font-size: 0.9rem !important;
          font-weight: 700 !important;
          text-decoration: none !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
          transition: all 0.2s ease !important;
        }

        .register-button-responsive:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
          color: white !important;
        }

        /* ========== PROFILE DROPDOWN ========== */
        .profile-title {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .profile-avatar-responsive {
          width: 32px !important;
          height: 32px !important;
          borderRadius: 50% !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          fontSize: 14px !important;
          font-weight: bold !important;
        }

        .profile-name {
          display: none !important;
        }

        .logout-item-responsive:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        /* ========== ANIMATIONS ========== */
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

        /* ========== RESPONSIVE BREAKPOINTS ========== */

        /* Large Desktop (1200px+) */
        @media (min-width: 1200px) {
          .logo-brand {
            font-size: 1.7rem !important;
          }
          
          .profile-name {
            display: inline !important;
          }
        }

        /* Desktop (992px+) */
        @media (min-width: 992px) {
          .profile-name {
            display: inline !important;
          }
        }

        /* Tablet (768px - 991px) */
        @media (max-width: 991.98px) {
          .navbar-nav-custom {
            margin-top: 1rem !important;
            width: 100% !important;
          }

          .nav-link-responsive,
          .dropdown-responsive .dropdown-toggle {
            padding: 12px 16px !important;
            font-size: 0.95rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 0 !important;
            width: 100% !important;
            text-align: left !important;
          }

          .auth-buttons {
            flex-direction: column !important;
            width: 100% !important;
            gap: 8px !important;
            margin-top: 1rem !important;
          }

          .login-button-responsive,
          .register-button-responsive {
            width: 100% !important;
            text-align: center !important;
            padding: 12px !important;
          }

          .dropdown-responsive .dropdown-menu {
            width: 100% !important;
            border-radius: 8px !important;
            margin-top: 0 !important;
          }
        }

        /* Mobile Large (576px - 767px) */
        @media (max-width: 767.98px) {
          .logo-brand {
            font-size: 1.4rem !important;
          }

          .logo-icon {
            width: 36px !important;
            height: 36px !important;
            font-size: 1.2rem !important;
            padding: 6px !important;
          }

          .nav-link-responsive,
          .dropdown-responsive .dropdown-toggle {
            font-size: 0.9rem !important;
            padding: 10px 16px !important;
          }

          .profile-avatar-responsive {
            width: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
          }
        }

        /* Mobile (320px - 575px) */
        @media (max-width: 575.98px) {
          .logo-brand {
            font-size: 1.2rem !important;
          }

          .logo-text {
            display: none !important;
          }

          .logo-icon {
            width: 32px !important;
            height: 32px !important;
            font-size: 1rem !important;
            padding: 4px !important;
          }

          .nav-link-responsive,
          .dropdown-responsive .dropdown-toggle {
            font-size: 0.85rem !important;
            padding: 8px 12px !important;
          }

          .profile-avatar-responsive {
            width: 24px !important;
            height: 24px !important;
            font-size: 11px !important;
          }

          .dropdown-item-custom {
            font-size: 0.85rem !important;
            padding: 0.6rem 1rem !important;
          }
        }

        /* Extra Small Mobile (280px - 319px) */
        @media (max-width: 319.98px) {
          .logo-brand {
            font-size: 1.1rem !important;
          }

          .navbar-nav-custom {
            gap: 0.5rem !important;
          }

          .nav-link-responsive,
          .dropdown-responsive .dropdown-toggle {
            font-size: 0.8rem !important;
            padding: 6px 8px !important;
          }
        }

        /* Custom Navbar Toggle */
        .navbar-toggler-custom {
          border: none !important;
          padding: 4px 8px !important;
        }

        .navbar-toggler-custom:focus {
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;
