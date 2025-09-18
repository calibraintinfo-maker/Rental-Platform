import React, { useState, useEffect, useCallback } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Enhanced scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 991.98);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Professional menu handling
  const handleMenuToggle = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    closeMenu();
  }, [logout, navigate, closeMenu]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  return (
    <>
      <BootstrapNavbar
        expanded={expanded}
        onToggle={handleMenuToggle}
        expand="lg"
        fixed="top"
        className="professional-navbar"
        style={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(25px) saturate(200%)',
          WebkitBackdropFilter: 'blur(25px) saturate(200%)',
          borderBottom: scrolled 
            ? '1px solid rgba(0, 0, 0, 0.12)' 
            : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: scrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
            : '0 4px 20px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '72px',
          padding: '0',
          zIndex: 1050,
        }}
      >
        <Container fluid className="px-3 px-lg-4">
          <div className="navbar-container">
            
            {/* Premium Logo */}
            <BootstrapNavbar.Brand 
              as={Link} 
              to="/" 
              onClick={closeMenu}
              className="professional-brand"
            >
              <div className="brand-container">
                <div className="brand-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L2 12H5V20H10V14H14V20H19V12H22L12 3Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="brand-text">SpaceLink</span>
              </div>
            </BootstrapNavbar.Brand>
            
            {/* Professional Toggle */}
            <BootstrapNavbar.Toggle 
              aria-controls="professional-navbar-nav" 
              className="professional-toggle"
            >
              <div className="hamburger-lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </BootstrapNavbar.Toggle>
            
            {/* Navigation Content */}
            <BootstrapNavbar.Collapse id="professional-navbar-nav">
              <Nav className="professional-nav">
                
                {/* Navigation Links */}
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  onClick={closeMenu}
                  className={`professional-nav-link ${isActive('/find-property') ? 'active' : ''}`}
                >
                  <span className="nav-text">Find Property</span>
                  {isActive('/find-property') && <div className="active-indicator"></div>}
                </Nav.Link>
                
                {/* Authenticated Content */}
                {isAuthenticated && (
                  <>
                    <Nav.Link 
                      as={Link} 
                      to="/my-bookings"
                      onClick={closeMenu}
                      className={`professional-nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
                    >
                      <span className="nav-text">My Bookings</span>
                      {isActive('/my-bookings') && <div className="active-indicator"></div>}
                    </Nav.Link>
                    
                    {/* Properties Dropdown */}
                    <NavDropdown 
                      title={<span className="dropdown-title">Properties</span>}
                      id="properties-dropdown"
                      className="professional-dropdown"
                      show={isMobile ? undefined : false}
                      onClick={(e) => isMobile && e.stopPropagation()}
                    >
                      <div className="dropdown-header">
                        <h6>Property Management</h6>
                        <p>Manage your property listings</p>
                      </div>
                      <NavDropdown.Item 
                        as={Link} 
                        to="/add-property"
                        onClick={closeMenu}
                        className="professional-dropdown-item"
                      >
                        <div className="dropdown-item-content">
                          <div className="item-icon">📝</div>
                          <div className="item-details">
                            <span className="item-title">Add Property</span>
                            <span className="item-subtitle">List a new property</span>
                          </div>
                        </div>
                      </NavDropdown.Item>
                      <NavDropdown.Item 
                        as={Link} 
                        to="/manage-properties"
                        onClick={closeMenu}
                        className="professional-dropdown-item"
                      >
                        <div className="dropdown-item-content">
                          <div className="item-icon">⚙️</div>
                          <div className="item-details">
                            <span className="item-title">Manage Properties</span>
                            <span className="item-subtitle">Edit existing listings</span>
                          </div>
                        </div>
                      </NavDropdown.Item>
                      <NavDropdown.Item 
                        as={Link} 
                        to="/my-property-status"
                        onClick={closeMenu}
                        className="professional-dropdown-item"
                      >
                        <div className="dropdown-item-content">
                          <div className="item-icon">📊</div>
                          <div className="item-details">
                            <span className="item-title">Property Status</span>
                            <span className="item-subtitle">View analytics & status</span>
                          </div>
                        </div>
                      </NavDropdown.Item>
                    </NavDropdown>

                    {/* Admin Dropdown */}
                    {user?.role === 'admin' && (
                      <NavDropdown 
                        title={<span className="dropdown-title admin-title">Admin</span>}
                        id="admin-dropdown"
                        className="professional-dropdown admin-dropdown"
                        show={isMobile ? undefined : false}
                        onClick={(e) => isMobile && e.stopPropagation()}
                      >
                        <div className="dropdown-header admin-header">
                          <h6>Administration</h6>
                          <p>System management tools</p>
                        </div>
                        <NavDropdown.Item 
                          as={Link} 
                          to="/admin/dashboard"
                          onClick={closeMenu}
                          className="professional-dropdown-item"
                        >
                          <div className="dropdown-item-content">
                            <div className="item-icon">🏢</div>
                            <div className="item-details">
                              <span className="item-title">Dashboard</span>
                              <span className="item-subtitle">System overview</span>
                            </div>
                          </div>
                        </NavDropdown.Item>
                        <NavDropdown.Item 
                          as={Link} 
                          to="/admin/verify-properties"
                          onClick={closeMenu}
                          className="professional-dropdown-item"
                        >
                          <div className="dropdown-item-content">
                            <div className="item-icon">✅</div>
                            <div className="item-details">
                              <span className="item-title">Verify Properties</span>
                              <span className="item-subtitle">Review submissions</span>
                            </div>
                          </div>
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                  </>
                )}
              </Nav>
              
              {/* Authentication Section */}
              <Nav className="professional-auth-section">
                {!isAuthenticated ? (
                  <div className="auth-buttons">
                    <Nav.Link 
                      as={Link} 
                      to="/login" 
                      onClick={closeMenu}
                      className="professional-auth-link login-link"
                    >
                      Sign In
                    </Nav.Link>
                    <Nav.Link 
                      as={Link} 
                      to="/register" 
                      onClick={closeMenu}
                      className="professional-auth-link signup-link"
                    >
                      Get Started
                    </Nav.Link>
                  </div>
                ) : (
                  <NavDropdown
                    title={
                      <div className="profile-trigger">
                        <div className="profile-avatar-professional">
                          <span className="avatar-text">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                          <div className="online-indicator"></div>
                        </div>
                        <div className="profile-info">
                          <span className="profile-name-professional">
                            {user?.name || 'User'}
                          </span>
                          <span className="profile-role">
                            {user?.role || 'Member'}
                          </span>
                        </div>
                      </div>
                    }
                    id="profile-dropdown"
                    align="end"
                    className="professional-dropdown profile-dropdown"
                    show={isMobile ? undefined : false}
                    onClick={(e) => isMobile && e.stopPropagation()}
                  >
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar-large">
                        <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                      <div className="profile-details">
                        <h6>{user?.name || 'User'}</h6>
                        <p>{user?.email || 'user@example.com'}</p>
                        <span className="profile-badge">{user?.role || 'Member'}</span>
                      </div>
                    </div>
                    <NavDropdown.Divider className="professional-divider" />
                    <NavDropdown.Item 
                      as={Link} 
                      to="/profile"
                      onClick={closeMenu}
                      className="professional-dropdown-item"
                    >
                      <div className="dropdown-item-content">
                        <div className="item-icon">👤</div>
                        <div className="item-details">
                          <span className="item-title">Profile</span>
                          <span className="item-subtitle">Manage account</span>
                        </div>
                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-bookings"
                      onClick={closeMenu}
                      className="professional-dropdown-item"
                    >
                      <div className="dropdown-item-content">
                        <div className="item-icon">📋</div>
                        <div className="item-details">
                          <span className="item-title">My Bookings</span>
                          <span className="item-subtitle">View reservations</span>
                        </div>
                      </div>
                    </NavDropdown.Item>
                    <NavDropdown.Divider className="professional-divider" />
                    <NavDropdown.Item 
                      onClick={handleLogout} 
                      className="professional-dropdown-item logout-item-professional"
                    >
                      <div className="dropdown-item-content">
                        <div className="item-icon">🚪</div>
                        <div className="item-details">
                          <span className="item-title">Sign Out</span>
                          <span className="item-subtitle">Logout securely</span>
                        </div>
                      </div>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </BootstrapNavbar.Collapse>
          </div>
        </Container>
      </BootstrapNavbar>

      {/* Professional Styles */}
      <style jsx>{`
        /* ========== CORE NAVBAR STYLES ========== */
        .professional-navbar {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .navbar-container {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
          min-height: 72px !important;
          padding: 8px 0 !important;
        }

        /* ========== PREMIUM BRANDING ========== */
        .professional-brand {
          text-decoration: none !important;
          color: inherit !important;
          transition: transform 0.2s ease !important;
        }

        .professional-brand:hover {
          transform: scale(1.02) !important;
          color: inherit !important;
        }

        .brand-container {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        .brand-icon {
          width: 44px !important;
          height: 44px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25) !important;
          transition: all 0.3s ease !important;
        }

        .brand-icon:hover {
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.35) !important;
          transform: translateY(-1px) !important;
        }

        .brand-text {
          font-size: 1.75rem !important;
          font-weight: 800 !important;
          color: #1e293b !important;
          letter-spacing: -0.025em !important;
        }

        /* ========== PROFESSIONAL TOGGLE ========== */
        .professional-toggle {
          border: none !important;
          background: transparent !important;
          padding: 8px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          position: relative !important;
          z-index: 1051 !important;
        }

        .professional-toggle:focus,
        .professional-toggle:active {
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        }

        .professional-toggle:hover {
          background: rgba(102, 126, 234, 0.05) !important;
        }

        .hamburger-lines {
          width: 24px !important;
          height: 18px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
        }

        .hamburger-lines span {
          display: block !important;
          height: 2px !important;
          width: 100% !important;
          background: #374151 !important;
          border-radius: 1px !important;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
          transform-origin: center !important;
        }

        .professional-toggle[aria-expanded="true"] .hamburger-lines span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px) !important;
        }

        .professional-toggle[aria-expanded="true"] .hamburger-lines span:nth-child(2) {
          opacity: 0 !important;
          transform: scale(0) !important;
        }

        .professional-toggle[aria-expanded="true"] .hamburger-lines span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px) !important;
        }

        /* ========== NAVIGATION LINKS ========== */
        .professional-nav {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          margin-left: auto !important;
          margin-right: 24px !important;
        }

        .professional-nav-link {
          position: relative !important;
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          text-decoration: none !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .professional-nav-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-1px) !important;
        }

        .professional-nav-link.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.12) !important;
        }

        .active-indicator {
          position: absolute !important;
          bottom: -2px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 20px !important;
          height: 2px !important;
          background: #667eea !important;
          border-radius: 1px !important;
        }

        /* ========== DROPDOWN STYLES ========== */
        .professional-dropdown .dropdown-toggle {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          background: transparent !important;
          border: none !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .professional-dropdown .dropdown-toggle:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-1px) !important;
        }

        .professional-dropdown .dropdown-toggle::after {
          border-top: 0.4em solid !important;
          border-right: 0.35em solid transparent !important;
          border-left: 0.35em solid transparent !important;
          border-bottom: 0 !important;
          margin-left: 6px !important;
          transition: transform 0.2s ease !important;
        }

        .professional-dropdown .dropdown-toggle[aria-expanded="true"]::after {
          transform: rotate(180deg) !important;
        }

        .professional-dropdown .dropdown-menu {
          border: none !important;
          border-radius: 16px !important;
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08) !important;
          padding: 8px !important;
          margin-top: 8px !important;
          min-width: 280px !important;
          animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: 1px solid rgba(0, 0, 0, 0.04) !important;
        }

        .dropdown-header {
          padding: 16px 20px 12px 20px !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
          margin-bottom: 8px !important;
        }

        .dropdown-header h6 {
          margin: 0 0 4px 0 !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
        }

        .dropdown-header p {
          margin: 0 !important;
          font-size: 0.85rem !important;
          color: #64748b !important;
        }

        .admin-header {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05)) !important;
          border-radius: 12px !important;
          border: 1px solid rgba(239, 68, 68, 0.1) !important;
        }

        .professional-dropdown-item {
          padding: 0 !important;
          background: transparent !important;
          border: none !important;
          border-radius: 12px !important;
          margin: 2px 0 !important;
          transition: all 0.2s ease !important;
          text-decoration: none !important;
        }

        .professional-dropdown-item:hover {
          background: rgba(102, 126, 234, 0.06) !important;
          transform: translateX(4px) !important;
        }

        .dropdown-item-content {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 12px 16px !important;
          text-decoration: none !important;
        }

        .item-icon {
          width: 36px !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(102, 126, 234, 0.1) !important;
          border-radius: 8px !important;
          font-size: 1.1rem !important;
        }

        .item-details {
          display: flex !important;
          flex-direction: column !important;
          gap: 2px !important;
        }

        .item-title {
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          color: #1e293b !important;
        }

        .item-subtitle {
          font-size: 0.8rem !important;
          color: #64748b !important;
        }

        .professional-divider {
          margin: 8px 0 !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
        }

        /* ========== AUTH SECTION ========== */
        .professional-auth-section {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .auth-buttons {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .professional-auth-link {
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          padding: 10px 16px !important;
          border-radius: 10px !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
        }

        .login-link {
          color: #64748b !important;
        }

        .login-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          transform: translateY(-1px) !important;
        }

        .signup-link {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25) !important;
        }

        .signup-link:hover {
          color: white !important;
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35) !important;
        }

        /* ========== PROFILE SECTION ========== */
        .profile-trigger {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          min-width: 120px !important;
        }

        .profile-avatar-professional {
          position: relative !important;
          width: 40px !important;
          height: 40px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 12px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25) !important;
        }

        .avatar-text {
          color: white !important;
          font-weight: 700 !important;
          font-size: 1rem !important;
        }

        .online-indicator {
          position: absolute !important;
          bottom: 0 !important;
          right: 0 !important;
          width: 12px !important;
          height: 12px !important;
          background: #10b981 !important;
          border: 2px solid white !important;
          border-radius: 50% !important;
        }

        .profile-info {
          display: flex !important;
          flex-direction: column !important;
          gap: 1px !important;
        }

        .profile-name-professional {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          color: #1e293b !important;
          line-height: 1.2 !important;
        }

        .profile-role {
          font-size: 0.75rem !important;
          color: #64748b !important;
          line-height: 1.2 !important;
        }

        .profile-dropdown-header {
          padding: 20px !important;
          text-align: center !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
          margin-bottom: 8px !important;
        }

        .profile-avatar-large {
          width: 60px !important;
          height: 60px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 auto 12px auto !important;
          color: white !important;
          font-weight: 700 !important;
          font-size: 1.5rem !important;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25) !important;
        }

        .profile-details h6 {
          margin: 0 0 4px 0 !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
        }

        .profile-details p {
          margin: 0 0 8px 0 !important;
          font-size: 0.85rem !important;
          color: #64748b !important;
        }

        .profile-badge {
          display: inline-block !important;
          padding: 4px 12px !important;
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          border-radius: 20px !important;
          text-transform: capitalize !important;
        }

        .logout-item-professional:hover {
          background: rgba(239, 68, 68, 0.06) !important;
        }

        .logout-item-professional:hover .item-icon {
          background: rgba(239, 68, 68, 0.1) !important;
        }

        .logout-item-professional:hover .item-title {
          color: #dc2626 !important;
        }

        /* ========== ANIMATIONS ========== */
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ========== RESPONSIVE DESIGN ========== */
        
        /* Large Desktop (1200px+) */
        @media (min-width: 1200px) {
          .brand-text {
            font-size: 1.85rem !important;
          }
          .navbar-container {
            min-height: 76px !important;
          }
        }

        /* Desktop (992px+) */
        @media (min-width: 992px) {
          .profile-info {
            display: flex !important;
          }
        }

        /* Tablet & Mobile (991px and below) */
        @media (max-width: 991.98px) {
          .professional-navbar {
            min-height: 64px !important;
          }

          .navbar-container {
            min-height: 64px !important;
            padding: 4px 0 !important;
          }

          .professional-nav {
            flex-direction: column !important;
            align-items: stretch !important;
            margin: 16px 0 8px 0 !important;
            gap: 4px !important;
            width: 100% !important;
          }

          .professional-nav-link {
            width: 100% !important;
            padding: 16px 20px !important;
            text-align: left !important;
            justify-content: flex-start !important;
            border-radius: 12px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
          }

          .professional-nav-link:hover {
            transform: translateX(4px) !important;
            background: rgba(102, 126, 234, 0.08) !important;
          }

          .professional-dropdown .dropdown-toggle {
            width: 100% !important;
            padding: 16px 20px !important;
            text-align: left !important;
            justify-content: space-between !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
            border-radius: 12px !important;
          }

          .professional-dropdown .dropdown-menu {
            position: static !important;
            float: none !important;
            width: 100% !important;
            margin-top: 0 !important;
            border-radius: 0 0 12px 12px !important;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06) !important;
            background: rgba(248, 250, 252, 0.95) !important;
          }

          .professional-auth-section {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
            gap: 8px !important;
            margin-top: 16px !important;
            padding: 0 20px 20px 20px !important;
          }

          .auth-buttons {
            flex-direction: column !important;
            gap: 8px !important;
          }

          .professional-auth-link {
            width: 100% !important;
            padding: 16px 20px !important;
            text-align: center !important;
            font-size: 1rem !important;
          }

          .profile-trigger {
            width: 100% !important;
            padding: 16px 20px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
            justify-content: space-between !important;
          }

          .profile-info {
            display: flex !important;
          }

          .dropdown-header {
            padding: 12px 16px 8px 16px !important;
          }

          .dropdown-item-content {
            padding: 10px 16px !important;
          }
        }

        /* Mobile Large (576px - 767px) */
        @media (max-width: 767.98px) {
          .brand-text {
            font-size: 1.5rem !important;
          }

          .brand-icon {
            width: 40px !important;
            height: 40px !important;
          }

          .profile-avatar-professional {
            width: 36px !important;
            height: 36px !important;
          }

          .avatar-text {
            font-size: 0.9rem !important;
          }
        }

        /* Small Mobile (575px and below) */
        @media (max-width: 575.98px) {
          .brand-text {
            font-size: 1.3rem !important;
          }

          .brand-icon {
            width: 36px !important;
            height: 36px !important;
          }

          .professional-nav-link,
          .professional-dropdown .dropdown-toggle,
          .professional-auth-link {
            padding: 14px 16px !important;
            font-size: 0.95rem !important;
          }

          .profile-trigger {
            padding: 14px 16px !important;
          }

          .profile-avatar-professional {
            width: 32px !important;
            height: 32px !important;
          }

          .avatar-text {
            font-size: 0.85rem !important;
          }

          .profile-name-professional {
            font-size: 0.85rem !important;
          }

          .profile-role {
            font-size: 0.7rem !important;
          }
        }

        /* Extra Small Mobile (480px and below) */
        @media (max-width: 479.98px) {
          .professional-auth-section {
            padding: 0 16px 16px 16px !important;
          }

          .brand-container {
            gap: 8px !important;
          }

          .brand-text {
            font-size: 1.2rem !important;
          }

          .dropdown-item-content {
            padding: 8px 12px !important;
          }

          .item-details {
            gap: 1px !important;
          }

          .item-title {
            font-size: 0.9rem !important;
          }

          .item-subtitle {
            font-size: 0.75rem !important;
          }
        }

        /* Ultra Small Mobile (375px and below) */
        @media (max-width: 375px) {
          .profile-info {
            display: none !important;
          }

          .profile-trigger {
            justify-content: center !important;
            min-width: auto !important;
          }

          .brand-text {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
