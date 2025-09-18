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
      setScrolled(window.pageYOffset > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false); // Close mobile menu after logout
  };

  const isActive = (path) => location.pathname === path;

  const closeNavbar = () => {
    setExpanded(false);
  };

  return (
    <>
      <BootstrapNavbar
        expand="lg"
        fixed="top"
        expanded={expanded}
        onToggle={(expanded) => setExpanded(expanded)}
        className="custom-navbar"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
            : '0 2px 10px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          minHeight: '70px',
          padding: '0.5rem 0',
          zIndex: 1050,
        }}
      >
        <Container>
          {/* Logo */}
          <BootstrapNavbar.Brand 
            as={Link} 
            to="/" 
            onClick={closeNavbar}
            className="brand-logo"
          >
            <div className="logo-container">
              <div className="logo-icon">🏠</div>
              <span className="logo-text">SpaceLink</span>
            </div>
          </BootstrapNavbar.Brand>
          
          {/* Mobile Toggle Button */}
          <BootstrapNavbar.Toggle 
            aria-controls="navbar-nav" 
            className="custom-toggler"
          />
          
          {/* Collapsible Content */}
          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="ms-auto custom-nav">
              
              {/* Find Property Link */}
              <Nav.Link 
                as={Link} 
                to="/find-property"
                onClick={closeNavbar}
                className={`custom-nav-link ${isActive('/find-property') ? 'active' : ''}`}
              >
                Find Property
              </Nav.Link>
              
              {/* Authenticated User Navigation */}
              {isAuthenticated && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/my-bookings"
                    onClick={closeNavbar}
                    className={`custom-nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
                  >
                    My Bookings
                  </Nav.Link>
                  
                  {/* Properties Dropdown */}
                  <NavDropdown 
                    title="Properties" 
                    id="properties-dropdown"
                    className="custom-dropdown"
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to="/add-property"
                      onClick={closeNavbar}
                      className="custom-dropdown-item"
                    >
                      📝 Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/manage-properties"
                      onClick={closeNavbar}
                      className="custom-dropdown-item"
                    >
                      ⚙️ Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-property-status"
                      onClick={closeNavbar}
                      className="custom-dropdown-item"
                    >
                      📊 Property Status
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Admin Dropdown */}
                  {user?.role === 'admin' && (
                    <NavDropdown 
                      title="Admin" 
                      id="admin-dropdown"
                      className="custom-dropdown admin-dropdown"
                    >
                      <NavDropdown.Item 
                        as={Link} 
                        to="/admin/dashboard"
                        onClick={closeNavbar}
                        className="custom-dropdown-item"
                      >
                        🏢 Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item 
                        as={Link} 
                        to="/admin/verify-properties"
                        onClick={closeNavbar}
                        className="custom-dropdown-item"
                      >
                        ✅ Verify Properties
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              )}
              
              {/* Authentication Section */}
              {!isAuthenticated ? (
                <div className="auth-section">
                  <Link 
                    to="/login" 
                    className="login-btn"
                    onClick={closeNavbar}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="register-btn"
                    onClick={closeNavbar}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                /* Profile Dropdown */
                <NavDropdown
                  title={
                    <div className="profile-section">
                      <div className="profile-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="profile-name">
                        {user?.name || 'User'}
                      </span>
                    </div>
                  }
                  id="profile-dropdown"
                  align="end"
                  className="custom-dropdown profile-dropdown"
                >
                  <NavDropdown.Header className="profile-header">
                    <strong>{user?.name || 'User'}</strong><br />
                    <small className="text-muted">{user?.email || 'user@example.com'}</small>
                  </NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item 
                    as={Link} 
                    to="/profile"
                    onClick={closeNavbar}
                    className="custom-dropdown-item"
                  >
                    👤 Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to="/my-bookings"
                    onClick={closeNavbar}
                    className="custom-dropdown-item"
                  >
                    📋 My Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item 
                    onClick={handleLogout} 
                    className="custom-dropdown-item logout-item"
                  >
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Comprehensive Responsive Styles */}
      <style jsx>{`
        /* ========== BASE NAVBAR STYLES ========== */
        .custom-navbar {
          transition: all 0.3s ease !important;
        }

        .brand-logo {
          text-decoration: none !important;
          color: inherit !important;
        }

        .brand-logo:hover {
          color: inherit !important;
        }

        .logo-container {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
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
          color: white !important;
        }

        .logo-text {
          color: #1e293b !important;
          font-size: 1.6rem !important;
          font-weight: 800 !important;
        }

        /* ========== MOBILE TOGGLE BUTTON ========== */
        .custom-toggler {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 4px 8px !important;
        }

        .custom-toggler:focus {
          box-shadow: none !important;
        }

        .custom-toggler .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
        }

        /* ========== NAVIGATION LINKS ========== */
        .custom-nav {
          align-items: center !important;
          gap: 1rem !important;
        }

        .custom-nav-link {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          text-decoration: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
        }

        .custom-nav-link:hover,
        .custom-nav-link.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
          transform: translateY(-2px) !important;
        }

        /* ========== DROPDOWN STYLES ========== */
        .custom-dropdown .dropdown-toggle {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          transition: all 0.2s ease !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          background: transparent !important;
          border: none !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .custom-dropdown .dropdown-toggle:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
        }

        .custom-dropdown .dropdown-toggle::after {
          border-top: 0.4em solid !important;
          border-right: 0.35em solid transparent !important;
          border-left: 0.35em solid transparent !important;
          border-bottom: 0 !important;
          vertical-align: 0.1em !important;
          margin-left: 0.5em !important;
          transition: transform 0.2s ease !important;
        }

        .custom-dropdown .dropdown-toggle[aria-expanded="true"]::after {
          transform: rotate(180deg) !important;
        }

        .custom-dropdown .dropdown-menu {
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

        .custom-dropdown-item {
          padding: 0.75rem 1.25rem !important;
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          color: #374151 !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          text-decoration: none !important;
        }

        .custom-dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
          transform: translateX(4px) !important;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        /* ========== PROFILE DROPDOWN ========== */
        .profile-section {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .profile-avatar {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: bold !important;
        }

        .profile-name {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
        }

        .profile-header {
          padding: 0.75rem 1.25rem 0.5rem 1.25rem !important;
          color: #6b7280 !important;
          font-size: 0.85rem !important;
        }

        /* ========== AUTH BUTTONS ========== */
        .auth-section {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        .login-btn {
          color: #64748b !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .login-btn:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-2px) !important;
        }

        .register-btn {
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

        .register-btn:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
          color: white !important;
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

        /* Large screens (1200px+) */
        @media (min-width: 1200px) {
          .logo-text {
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

        /* Tablet and Mobile (991px and below) */
        @media (max-width: 991.98px) {
          .custom-nav {
            margin-top: 1rem !important;
            width: 100% !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0 !important;
          }

          .custom-nav-link {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 0 !important;
            width: 100% !important;
            text-align: left !important;
          }

          .custom-dropdown .dropdown-toggle {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 0 !important;
            width: 100% !important;
            text-align: left !important;
            justify-content: space-between !important;
          }

          .custom-dropdown .dropdown-menu {
            width: 100% !important;
            border-radius: 0 !important;
            margin-top: 0 !important;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            background: rgba(248, 249, 250, 0.9) !important;
          }

          .auth-section {
            flex-direction: column !important;
            width: 100% !important;
            gap: 8px !important;
            margin-top: 1rem !important;
            padding: 0 16px !important;
          }

          .login-btn,
          .register-btn {
            width: 100% !important;
            text-align: center !important;
            padding: 12px !important;
            font-size: 1rem !important;
          }

          .profile-section {
            padding: 12px 16px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            justify-content: space-between !important;
            width: 100% !important;
          }

          .profile-name {
            display: inline !important;
          }
        }

        /* Mobile Large (576px - 767px) */
        @media (max-width: 767.98px) {
          .logo-text {
            font-size: 1.4rem !important;
          }

          .logo-icon {
            width: 36px !important;
            height: 36px !important;
            font-size: 1.2rem !important;
            padding: 6px !important;
          }

          .profile-avatar {
            width: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
          }
        }

        /* Small Mobile (575px and below) */
        @media (max-width: 575.98px) {
          .logo-text {
            font-size: 1.2rem !important;
          }

          .logo-icon {
            width: 32px !important;
            height: 32px !important;
            font-size: 1rem !important;
            padding: 4px !important;
          }

          .profile-avatar {
            width: 24px !important;
            height: 24px !important;
            font-size: 11px !important;
          }

          .custom-dropdown-item {
            font-size: 0.9rem !important;
            padding: 0.6rem 1rem !important;
          }
        }

        /* Extra Small Mobile (320px - 479px) */
        @media (max-width: 479.98px) {
          .logo-container {
            gap: 8px !important;
          }

          .logo-text {
            font-size: 1.1rem !important;
          }

          .custom-nav-link,
          .custom-dropdown .dropdown-toggle {
            font-size: 0.95rem !important;
            padding: 10px 12px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
