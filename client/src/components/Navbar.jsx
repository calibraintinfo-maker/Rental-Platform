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
        className="professional-navbar"
        style={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: scrolled 
            ? '1px solid rgba(0, 0, 0, 0.12)' 
            : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '8px 0',
          zIndex: 1050,
        }}
      >
        <Container>
          {/* ✅ PROFESSIONAL BRAND */}
          <BootstrapNavbar.Brand 
            as={Link} 
            to={getBrandLink()} 
            className="brand-link"
          >
            <div className="brand-container">
              <div className="brand-icon">
                <span className="brand-emoji">🏠</span>
              </div>
              <span className="brand-text">SpaceLink</span>
              {user?.role === 'admin' && (
                <Badge bg="warning" className="admin-badge">ADMIN</Badge>
              )}
            </div>
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            {/* ✅ NAVIGATION LINKS */}
            <Nav className="me-auto nav-links">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link 
                  as={Link} 
                  to="/find-property" 
                  className={`nav-link-custom ${isActive('/find-property') ? 'active' : ''}`}
                >
                  Find Property
                </Nav.Link>
              )}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/dashboard" 
                    className={`nav-link-custom ${isActive('/admin/dashboard') ? 'active' : ''}`}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/verify-properties" 
                    className={`nav-link-custom ${isActive('/admin/verify-properties') ? 'active' : ''}`}
                  >
                    Verify Properties
                  </Nav.Link>
                </>
              )}

              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/my-bookings" 
                    className={`nav-link-custom ${isActive('/my-bookings') ? 'active' : ''}`}
                  >
                    My Bookings
                  </Nav.Link>

                  {/* ✅ PROFESSIONAL PROPERTY MANAGEMENT DROPDOWN */}
                  <div className="dropdown-container" ref={propertyDropdownRef}>
                    <button
                      className="dropdown-toggle-btn"
                      onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                      aria-expanded={showPropertyDropdown}
                    >
                      Property Management
                      <svg 
                        className={`dropdown-arrow ${showPropertyDropdown ? 'rotated' : ''}`}
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>

                    {showPropertyDropdown && (
                      <div className="dropdown-menu-custom">
                        <Link to="/add-property" className="dropdown-item-custom">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </div>
                          <div className="item-content">
                            <span className="item-title">Add Property</span>
                            <small className="item-subtitle">List a new property</small>
                          </div>
                        </Link>

                        <Link to="/manage-properties" className="dropdown-item-custom">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                          </div>
                          <div className="item-content">
                            <span className="item-title">Manage Properties</span>
                            <small className="item-subtitle">Edit your listings</small>
                          </div>
                        </Link>

                        <Link to="/my-property-status" className="dropdown-item-custom">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                            </svg>
                          </div>
                          <div className="item-content">
                            <span className="item-title">Property Status</span>
                            <small className="item-subtitle">View analytics</small>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Nav>

            {/* ✅ RIGHT SIDE ACTIONS */}
            <div className="nav-actions">
              {isAuthenticated ? (
                <>
                  {/* ✅ PROFESSIONAL NOTIFICATION BELL */}
                  <Button
                    variant="ghost"
                    className="notification-btn"
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
                      <Badge bg="danger" className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>

                  {/* ✅ PROFESSIONAL PROFILE DROPDOWN */}
                  <div className="profile-container" ref={profileDropdownRef}>
                    <button
                      className="profile-btn"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      aria-expanded={showProfileDropdown}
                    >
                      <div className="profile-avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="profile-name">
                        {user?.name || 'User'}
                      </span>
                      <svg 
                        className={`profile-arrow ${showProfileDropdown ? 'rotated' : ''}`}
                        width="16" 
                        height="16" 
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
                          <div className="profile-details">
                            <div className="profile-name-large">
                              {user?.name || 'User'}
                            </div>
                            <div className="profile-email">
                              {user?.email || 'user@example.com'}
                            </div>
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <Link to="/profile" className="dropdown-item-custom">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <span className="item-title">Profile Settings</span>
                        </Link>

                        <Link to="/my-bookings" className="dropdown-item-custom">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m4-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-4-6V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2m-4 0h4"></path>
                            </svg>
                          </div>
                          <span className="item-title">My Bookings</span>
                        </Link>

                        <div className="dropdown-divider"></div>

                        <button onClick={handleLogout} className="dropdown-item-custom logout-btn">
                          <div className="item-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16,17 21,12 16,7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                          </div>
                          <span className="item-title">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ✅ GUEST ACTIONS */
                <div className="guest-actions">
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                  <Link to="/register" className="register-btn">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      <NotificationSidebar />

      {/* ✅ PROFESSIONAL STYLES */}
      <style jsx>{`
        /* ==============================
           PROFESSIONAL NAVBAR STYLES
           ============================== */
        .professional-navbar {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .brand-link {
          text-decoration: none !important;
          color: inherit !important;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.7rem;
          color: #1e293b;
          transition: transform 0.2s ease;
        }

        .brand-container:hover {
          transform: scale(1.02);
        }

        .brand-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
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
        }

        .admin-badge {
          font-size: 0.6rem;
          font-weight: 600;
          margin-left: 8px;
        }

        /* ==============================
           NAVIGATION LINKS
           ============================== */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link-custom {
          color: #64748b !important;
          font-weight: 600;
          font-size: 1rem;
          padding: 8px 16px !important;
          border-radius: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-link-custom:hover,
        .nav-link-custom.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
        }

        /* ==============================
           DROPDOWN CONTAINERS
           ============================== */
        .dropdown-container,
        .profile-container {
          position: relative;
        }

        .dropdown-toggle-btn,
        .profile-btn {
          background: none;
          border: 2px solid rgba(102, 126, 234, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          color: #667eea;
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .dropdown-toggle-btn:hover,
        .profile-btn:hover {
          background: rgba(102, 126, 234, 0.05);
          border-color: #667eea;
        }

        .dropdown-arrow,
        .profile-arrow {
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.rotated,
        .profile-arrow.rotated {
          transform: rotate(180deg);
        }

        /* ==============================
           DROPDOWN MENUS
           ============================== */
        .dropdown-menu-custom,
        .profile-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          padding: 8px;
          min-width: 280px;
          z-index: 1051;
          backdrop-filter: blur(20px);
        }

        .dropdown-item-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
        }

        .dropdown-item-custom:hover {
          background: rgba(102, 126, 234, 0.05);
          color: #667eea;
          text-decoration: none;
        }

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: #9ca3af;
        }

        .dropdown-item-custom:hover .item-icon {
          color: #667eea;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .item-subtitle {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        /* ==============================
           PROFILE SPECIFIC
           ============================== */
        .profile-avatar {
          width: 32px;
          height: 32px;
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
          border-radius: 8px;
          margin-bottom: 8px;
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

        .dropdown-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 8px 0;
        }

        .logout-btn {
          color: #dc2626 !important;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.05) !important;
        }

        /* ==============================
           NOTIFICATION BUTTON
           ============================== */
        .notification-btn {
          background: none !important;
          border: none !important;
          padding: 8px !important;
          border-radius: 50% !important;
          color: #64748b;
          position: relative;
          transition: all 0.2s ease;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-btn:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea;
          transform: scale(1.05);
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 0.7rem;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
        }

        /* ==============================
           NAV ACTIONS
           ============================== */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: 1px solid rgba(0, 0, 0, 0.08);
        }

        .guest-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .login-btn {
          color: #64748b;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .login-btn:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.08);
          text-decoration: none;
        }

        .register-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
          transition: all 0.2s ease;
        }

        .register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }

        /* ==============================
           RESPONSIVE DESIGN
           ============================== */
        @media (max-width: 991.98px) {
          .nav-links {
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .nav-actions {
            flex-direction: column;
            gap: 0.5rem;
            border-left: none;
            padding-left: 0;
            margin-left: 0;
          }

          .dropdown-menu-custom,
          .profile-dropdown-menu {
            position: static;
            box-shadow: none;
            border: none;
            border-radius: 0;
            min-width: auto;
            margin-top: 8px;
            background: rgba(102, 126, 234, 0.05);
          }

          .dropdown-toggle-btn,
          .profile-btn {
            width: 100%;
            justify-content: space-between;
          }

          .guest-actions {
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }

          .login-btn,
          .register-btn {
            width: 100%;
            text-align: center;
            display: block;
          }
        }

        @media (max-width: 767.98px) {
          .brand-container {
            font-size: 1.4rem;
          }

          .brand-icon {
            padding: 6px;
            border-radius: 10px;
          }

          .brand-emoji {
            font-size: 1.2rem;
          }

          .nav-link-custom {
            font-size: 0.95rem;
            padding: 10px 16px !important;
          }

          .dropdown-toggle-btn,
          .profile-btn {
            font-size: 0.95rem;
            padding: 10px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
