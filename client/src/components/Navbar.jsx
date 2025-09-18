import React, { useState, useEffect, useRef } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import NotificationSidebar from './NotificationSidebar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, sidebarOpen, setSidebarOpen } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Dropdown states
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Refs for click outside detection
  const propertyDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(event.target)) {
        setShowPropertyDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const getBrandLink = () => {
    if (isAuthenticated && user?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/';
  };

  return (
    <>
      <BootstrapNavbar
        expand="lg"
        fixed="top"
        className="professional-spacelink-navbar"
        style={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: scrolled 
            ? '1px solid rgba(0, 0, 0, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: scrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '0',
          zIndex: 1050,
          height: '70px'
        }}
      >
        <Container fluid className="px-4">
          <div className="d-flex align-items-center justify-content-between w-100">
            {/* ✅ BRAND SECTION */}
            <BootstrapNavbar.Brand 
              as={Link} 
              to={getBrandLink()} 
              className="spacelink-brand"
            >
              <div className="brand-wrapper">
                <div className="brand-icon">
                  <span className="brand-emoji">🏠</span>
                </div>
                <span className="brand-text">SpaceLink</span>
                {user?.role === 'admin' && (
                  <Badge bg="warning" className="admin-badge">ADMIN</Badge>
                )}
              </div>
            </BootstrapNavbar.Brand>

            {/* ✅ NAVIGATION LINKS - DESKTOP */}
            <div className="navbar-nav-wrapper d-none d-lg-flex">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Link 
                  to="/find-property" 
                  className={`nav-link-professional ${isActive('/find-property') ? 'active' : ''}`}
                >
                  Find Property
                </Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`nav-link-professional ${isActive('/admin/dashboard') ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/verify-properties" 
                    className={`nav-link-professional ${isActive('/admin/verify-properties') ? 'active' : ''}`}
                  >
                    Verify Properties
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Link 
                    to="/my-bookings" 
                    className={`nav-link-professional ${isActive('/my-bookings') ? 'active' : ''}`}
                  >
                    My Bookings
                  </Link>
                  
                  {/* ✅ PROPERTY MANAGEMENT DROPDOWN */}
                  <div className="dropdown-wrapper" ref={propertyDropdownRef}>
                    <button
                      className="nav-dropdown-button"
                      onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                      aria-expanded={showPropertyDropdown}
                    >
                      Property Management
                      <svg 
                        className={`dropdown-arrow ${showPropertyDropdown ? 'rotated' : ''}`}
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    
                    {showPropertyDropdown && (
                      <div className="dropdown-menu-professional">
                        <Link to="/add-property" className="dropdown-item-professional">
                          <div className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </div>
                          <div className="dropdown-content">
                            <span className="dropdown-title">Add Property</span>
                            <small className="dropdown-subtitle">List a new property</small>
                          </div>
                        </Link>
                        
                        <Link to="/manage-properties" className="dropdown-item-professional">
                          <div className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                          </div>
                          <div className="dropdown-content">
                            <span className="dropdown-title">Manage Properties</span>
                            <small className="dropdown-subtitle">Edit your listings</small>
                          </div>
                        </Link>
                        
                        <Link to="/my-property-status" className="dropdown-item-professional">
                          <div className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                            </svg>
                          </div>
                          <div className="dropdown-content">
                            <span className="dropdown-title">Property Status</span>
                            <small className="dropdown-subtitle">View analytics</small>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ✅ RIGHT ACTIONS */}
            <div className="navbar-actions d-flex align-items-center">
              {isAuthenticated ? (
                <>
                  {/* ✅ NOTIFICATION BUTTON */}
                  <Button
                    variant="link"
                    className="notification-button"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Notifications"
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    {unreadCount > 0 && (
                      <Badge bg="danger" className="notification-count">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>

                  {/* ✅ PROFILE DROPDOWN */}
                  <div className="profile-dropdown-wrapper" ref={profileDropdownRef}>
                    <button
                      className="profile-button"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      aria-expanded={showProfileDropdown}
                    >
                      <div className="profile-avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="profile-name d-none d-md-block">
                        {user?.name || 'User'}
                      </span>
                      <svg 
                        className={`profile-arrow d-none d-md-block ${showProfileDropdown ? 'rotated' : ''}`}
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>

                    {showProfileDropdown && (
                      <div className="profile-dropdown-menu">
                        <div className="profile-header">
                          <div className="profile-avatar-large">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="profile-info">
                            <div className="profile-name-large">
                              {user?.name || 'User'}
                            </div>
                            <div className="profile-email">
                              {user?.email || 'user@example.com'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="profile-divider"></div>
                        
                        <Link to="/profile" className="dropdown-item-professional">
                          <div className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <span className="dropdown-title">Profile Settings</span>
                        </Link>
                        
                        <Link to="/my-bookings" className="dropdown-item-professional">
                          <div className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m4-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-4-6V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2m-4 0h4"></path>
                            </svg>
                          </div>
                          <span className="dropdown-title">My Bookings</span>
                        </Link>
                        
                        <div className="profile-divider"></div>
                        
                        <button onClick={handleLogout} className="dropdown-item-professional logout-item">
                          <div className="dropdown-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16,17 21,12 16,7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                          </div>
                          <span className="dropdown-title">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ✅ GUEST ACTIONS */
                <div className="guest-actions d-flex align-items-center">
                  <Link to="/login" className="login-button">
                    Login
                  </Link>
                  <Link to="/register" className="register-button">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* ✅ MOBILE TOGGLE */}
            <BootstrapNavbar.Toggle 
              aria-controls="basic-navbar-nav" 
              className="d-lg-none ms-2"
            />
          </div>

          {/* ✅ MOBILE MENU */}
          <BootstrapNavbar.Collapse id="basic-navbar-nav" className="d-lg-none">
            <Nav className="mt-3">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link as={Link} to="/find-property" className="mobile-nav-link">
                  Find Property
                </Nav.Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" className="mobile-nav-link">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/verify-properties" className="mobile-nav-link">
                    Verify Properties
                  </Nav.Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Nav.Link as={Link} to="/my-bookings" className="mobile-nav-link">
                    My Bookings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/add-property" className="mobile-nav-link">
                    Add Property
                  </Nav.Link>
                  <Nav.Link as={Link} to="/manage-properties" className="mobile-nav-link">
                    Manage Properties
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-property-status" className="mobile-nav-link">
                    Property Status
                  </Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      <NotificationSidebar />

      {/* ✅ PROFESSIONAL STYLES */}
      <style jsx>{`
        /* ================================
           PROFESSIONAL SPACELINK NAVBAR
           ================================ */
        .professional-spacelink-navbar {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ================================
           BRAND SECTION
           ================================ */
        .spacelink-brand {
          text-decoration: none !important;
          color: inherit !important;
          margin-right: 0 !important;
        }

        .brand-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1.75rem;
          color: #1e293b;
          transition: transform 0.2s ease;
        }

        .brand-wrapper:hover {
          transform: scale(1.02);
        }

        .brand-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 10px;
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-emoji {
          font-size: 1.4rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .brand-text {
          letter-spacing: -0.02em;
          color: #1e293b;
        }

        .admin-badge {
          font-size: 0.6rem;
          font-weight: 600;
          margin-left: 8px;
        }

        /* ================================
           NAVIGATION LINKS
           ================================ */
        .navbar-nav-wrapper {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-left: 2rem;
        }

        .nav-link-professional {
          color: #64748b !important;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 16px !important;
          border-radius: 10px;
          transition: all 0.2s ease;
          text-decoration: none;
          position: relative;
          white-space: nowrap;
        }

        .nav-link-professional:hover,
        .nav-link-professional.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          text-decoration: none;
        }

        .nav-link-professional.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 16px;
          right: 16px;
          height: 2px;
          background: #667eea;
          border-radius: 1px;
        }

        /* ================================
           DROPDOWN COMPONENTS
           ================================ */
        .dropdown-wrapper,
        .profile-dropdown-wrapper {
          position: relative;
        }

        .nav-dropdown-button {
          background: none;
          border: none;
          color: #64748b;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-dropdown-button:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.08);
        }

        .dropdown-arrow,
        .profile-arrow {
          transition: transform 0.2s ease;
          color: #9ca3af;
        }

        .dropdown-arrow.rotated,
        .profile-arrow.rotated {
          transform: rotate(180deg);
        }

        .dropdown-menu-professional,
        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          padding: 12px;
          min-width: 280px;
          z-index: 1051;
          backdrop-filter: blur(20px);
        }

        .dropdown-item-professional {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .dropdown-item-professional:hover {
          background: rgba(102, 126, 234, 0.06);
          color: #667eea;
          text-decoration: none;
        }

        .dropdown-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .dropdown-item-professional:hover .dropdown-icon {
          color: #667eea;
        }

        .dropdown-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dropdown-title {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .dropdown-subtitle {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        /* ================================
           PROFILE SECTION
           ================================ */
        .profile-button {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
        }

        .profile-button:hover {
          background: rgba(102, 126, 234, 0.06);
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .profile-name {
          font-weight: 500;
          font-size: 0.95rem;
          color: #374151;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(116, 75, 162, 0.05) 100%);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .profile-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .profile-name-large {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .profile-email {
          color: #64748b;
          font-size: 0.8rem;
        }

        .profile-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.08);
          margin: 8px 0;
        }

        .logout-item {
          color: #dc2626 !important;
        }

        .logout-item:hover {
          background: rgba(220, 38, 38, 0.06) !important;
        }

        /* ================================
           NOTIFICATION BUTTON
           ================================ */
        .notification-button {
          background: none !important;
          border: none !important;
          padding: 10px !important;
          border-radius: 12px !important;
          color: #64748b;
          position: relative;
          transition: all 0.2s ease;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }

        .notification-button:hover {
          background: rgba(102, 126, 234, 0.08) !important;
          color: #667eea;
          transform: scale(1.02);
        }

        .notification-count {
          position: absolute;
          top: 4px;
          right: 4px;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
        }

        /* ================================
           NAVBAR ACTIONS
           ================================ */
        .navbar-actions {
          margin-left: auto;
          gap: 12px;
        }

        .guest-actions {
          gap: 16px;
        }

        .login-button {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .login-button:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.08);
          text-decoration: none;
        }

        .register-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .register-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
          color: white;
          text-decoration: none;
        }

        /* ================================
           MOBILE STYLES
           ================================ */
        .mobile-nav-link {
          color: #64748b !important;
          font-weight: 500;
          padding: 12px 20px !important;
          border-radius: 10px;
          margin: 4px 0;
          transition: all 0.2s ease;
        }

        .mobile-nav-link:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
        }

        /* ================================
           RESPONSIVE DESIGN
           ================================ */
        @media (max-width: 991.98px) {
          .brand-wrapper {
            font-size: 1.5rem;
          }
          
          .brand-icon {
            padding: 8px;
            border-radius: 12px;
          }
          
          .brand-emoji {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 767.98px) {
          .navbar-actions {
            gap: 8px;
          }
          
          .guest-actions {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          
          .login-button,
          .register-button {
            text-align: center;
            width: 100%;
            font-size: 0.9rem;
          }
          
          .profile-name {
            display: none;
          }
        }

        @media (max-width: 575.98px) {
          .brand-wrapper {
            font-size: 1.3rem;
          }
          
          .brand-text {
            display: none;
          }
          
          .navbar-actions .guest-actions {
            min-width: 120px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
