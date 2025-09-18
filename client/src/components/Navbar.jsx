import React, { useState, useEffect, useRef } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
        className="spacelink-navbar-final"
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
          padding: '12px 0',
          zIndex: 1050
        }}
      >
        <Container fluid className="px-4">
          <div className="navbar-wrapper-final">
            
            {/* BRAND */}
            <BootstrapNavbar.Brand as={Link} to={getBrandLink()} className="brand-final">
              <div className="brand-content-final">
                <div className="brand-icon-final">
                  <span className="brand-emoji-final">🏠</span>
                </div>
                <span className="brand-text-final">SpaceLink</span>
                {user?.role === 'admin' && (
                  <Badge bg="warning" className="admin-badge-final">ADMIN</Badge>
                )}
              </div>
            </BootstrapNavbar.Brand>

            {/* DESKTOP NAVIGATION */}
            <div className="nav-links-final d-none d-lg-flex">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Link 
                  to="/find-property" 
                  className={`nav-item-final ${isActive('/find-property') ? 'active' : ''}`}
                >
                  Find Property
                </Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`nav-item-final ${isActive('/admin/dashboard') ? 'active' : ''}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/verify-properties" 
                    className={`nav-item-final ${isActive('/admin/verify-properties') ? 'active' : ''}`}
                  >
                    Verify Properties
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Link 
                    to="/my-bookings" 
                    className={`nav-item-final ${isActive('/my-bookings') ? 'active' : ''}`}
                  >
                    My Bookings
                  </Link>
                  
                  {/* PROPERTY MANAGEMENT DROPDOWN */}
                  <Dropdown className="dropdown-final">
                    <Dropdown.Toggle 
                      variant="link" 
                      className="dropdown-toggle-final"
                      id="property-dropdown"
                    >
                      Property Management
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-final">
                      <Dropdown.Item 
                        as={Link} 
                        to="/add-property" 
                        className="dropdown-item-final"
                      >
                        <div className="item-icon-final">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </div>
                        <div className="item-content-final">
                          <span className="item-title-final">Add Property</span>
                          <small className="item-subtitle-final">List a new property</small>
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item 
                        as={Link} 
                        to="/manage-properties" 
                        className="dropdown-item-final"
                      >
                        <div className="item-icon-final">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                        </div>
                        <div className="item-content-final">
                          <span className="item-title-final">Manage Properties</span>
                          <small className="item-subtitle-final">Edit your listings</small>
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item 
                        as={Link} 
                        to="/my-property-status" 
                        className="dropdown-item-final"
                      >
                        <div className="item-icon-final">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                          </svg>
                        </div>
                        <div className="item-content-final">
                          <span className="item-title-final">Property Status</span>
                          <small className="item-subtitle-final">View analytics</small>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="navbar-actions-final">
              {isAuthenticated ? (
                <div className="auth-actions-final">
                  {/* NOTIFICATION BUTTON */}
                  <button
                    className="notification-btn-final"
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
                      <Badge bg="danger" className="notification-badge-final">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </button>

                  {/* PROFILE DROPDOWN */}
                  <Dropdown className="profile-dropdown-final" align="end">
                    <Dropdown.Toggle 
                      variant="link" 
                      className="profile-toggle-final"
                      id="profile-dropdown"
                    >
                      <div className="profile-avatar-final">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="profile-name-final d-none d-md-inline">
                        {user?.name || 'User'}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="profile-menu-final">
                      <div className="profile-header-final">
                        <div className="profile-avatar-large-final">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="profile-info-final">
                          <div className="profile-name-large-final">
                            {user?.name || 'User'}
                          </div>
                          <div className="profile-email-final">
                            {user?.email || 'user@example.com'}
                          </div>
                        </div>
                      </div>
                      
                      <Dropdown.Divider />
                      
                      <Dropdown.Item 
                        as={Link} 
                        to="/profile" 
                        className="dropdown-item-final"
                      >
                        <div className="item-icon-final">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <span className="item-title-final">Profile Settings</span>
                      </Dropdown.Item>
                      
                      <Dropdown.Item 
                        as={Link} 
                        to="/my-bookings" 
                        className="dropdown-item-final"
                      >
                        <div className="item-icon-final">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m4-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-4-6V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2m-4 0h4"></path>
                          </svg>
                        </div>
                        <span className="item-title-final">My Bookings</span>
                      </Dropdown.Item>
                      
                      <Dropdown.Divider />
                      
                      <Dropdown.Item 
                        onClick={handleLogout} 
                        className="dropdown-item-final logout-item-final"
                      >
                        <div className="item-icon-final">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                        </div>
                        <span className="item-title-final">Logout</span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="guest-actions-final">
                  <Link to="/login" className="login-btn-final">
                    Login
                  </Link>
                  <Link to="/register" className="register-btn-final">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <BootstrapNavbar.Toggle 
              aria-controls="basic-navbar-nav" 
              className="d-lg-none mobile-toggle-final"
            />
          </div>

          {/* MOBILE MENU */}
          <BootstrapNavbar.Collapse id="basic-navbar-nav" className="d-lg-none">
            <Nav className="mobile-nav-final">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link as={Link} to="/find-property" className="mobile-nav-item-final">
                  Find Property
                </Nav.Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" className="mobile-nav-item-final">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/verify-properties" className="mobile-nav-item-final">
                    Verify Properties
                  </Nav.Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Nav.Link as={Link} to="/my-bookings" className="mobile-nav-item-final">
                    My Bookings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/add-property" className="mobile-nav-item-final">
                    Add Property
                  </Nav.Link>
                  <Nav.Link as={Link} to="/manage-properties" className="mobile-nav-item-final">
                    Manage Properties
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-property-status" className="mobile-nav-item-final">
                    Property Status
                  </Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      <NotificationSidebar />

      <style jsx>{`
        .spacelink-navbar-final {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .navbar-wrapper-final {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 50px;
        }

        /* BRAND */
        .brand-final {
          text-decoration: none !important;
          color: inherit !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .brand-content-final {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1.7rem;
          color: #1e293b;
          transition: transform 0.2s ease;
        }

        .brand-content-final:hover {
          transform: scale(1.02);
        }

        .brand-icon-final {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 10px;
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-emoji-final {
          font-size: 1.4rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .brand-text-final {
          letter-spacing: -0.02em;
          color: #1e293b;
        }

        .admin-badge-final {
          font-size: 0.6rem;
          font-weight: 600;
          margin-left: 8px;
        }

        /* NAVIGATION */
        .nav-links-final {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-left: 3rem;
        }

        .nav-item-final {
          color: #64748b !important;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 16px !important;
          text-decoration: none;
          position: relative;
          transition: all 0.2s ease;
          border-radius: 8px;
          white-space: nowrap;
        }

        .nav-item-final:hover,
        .nav-item-final.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
          text-decoration: none;
        }

        /* DROPDOWNS */
        .dropdown-final .dropdown-toggle,
        .profile-dropdown-final .dropdown-toggle {
          background: none !important;
          border: none !important;
          color: #64748b !important;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 16px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          text-decoration: none !important;
          box-shadow: none !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .dropdown-toggle-final:hover,
        .profile-toggle-final:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
        }

        .dropdown-toggle-final::after,
        .profile-toggle-final::after {
          margin-left: 8px !important;
        }

        .dropdown-menu-final,
        .profile-menu-final {
          border: none !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
          padding: 12px !important;
          min-width: 280px !important;
          margin-top: 8px !important;
        }

        .dropdown-item-final {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 12px 16px !important;
          border-radius: 12px !important;
          color: #374151 !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          border: none !important;
          background: none !important;
          width: 100% !important;
        }

        .dropdown-item-final:hover {
          background: rgba(102, 126, 234, 0.08) !important;
          color: #667eea !important;
          text-decoration: none !important;
        }

        .item-icon-final {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: #9ca3af;
        }

        .dropdown-item-final:hover .item-icon-final {
          color: #667eea;
        }

        .item-content-final {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-title-final {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .item-subtitle-final {
          color: #9ca3af;
          font-size: 0.8rem;
        }

        /* PROFILE */
        .profile-toggle-final {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          padding: 8px 12px !important;
          border-radius: 12px !important;
        }

        .profile-avatar-final {
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

        .profile-name-final {
          font-weight: 500;
          font-size: 0.95rem;
          color: #374151;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-header-final {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(116, 75, 162, 0.05) 100%);
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .profile-avatar-large-final {
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

        .profile-name-large-final {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .profile-email-final {
          color: #64748b;
          font-size: 0.8rem;
        }

        .logout-item-final {
          color: #dc2626 !important;
        }

        .logout-item-final:hover {
          background: rgba(220, 38, 38, 0.08) !important;
        }

        /* ACTIONS */
        .navbar-actions-final {
          display: flex;
          align-items: center;
          margin-left: auto;
        }

        .auth-actions-final {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-btn-final {
          background: none;
          border: none;
          padding: 10px;
          border-radius: 12px;
          color: #64748b;
          position: relative;
          transition: all 0.2s ease;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .notification-btn-final:hover {
          background: rgba(102, 126, 234, 0.08);
          color: #667eea;
          transform: scale(1.02);
        }

        .notification-badge-final {
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

        .guest-actions-final {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .login-btn-final {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .login-btn-final:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.08);
          text-decoration: none;
        }

        .register-btn-final {
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

        .register-btn-final:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
          color: white;
          text-decoration: none;
        }

        /* MOBILE */
        .mobile-toggle-final {
          border: none !important;
          padding: 8px !important;
        }

        .mobile-nav-final {
          padding-top: 1rem;
        }

        .mobile-nav-item-final {
          color: #64748b !important;
          font-weight: 500;
          padding: 12px 0 !important;
          border-radius: 10px;
          margin: 4px 0;
          transition: all 0.2s ease;
        }

        .mobile-nav-item-final:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
        }

        /* RESPONSIVE */
        @media (max-width: 991.98px) {
          .brand-content-final {
            font-size: 1.5rem;
          }
          
          .brand-icon-final {
            padding: 8px;
            border-radius: 12px;
          }
          
          .brand-emoji-final {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 767.98px) {
          .navbar-actions-final {
            gap: 8px;
          }
          
          .guest-actions-final {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          
          .login-btn-final,
          .register-btn-final {
            text-align: center;
            width: 100%;
            font-size: 0.9rem;
          }
          
          .profile-name-final {
            display: none;
          }
        }

        @media (max-width: 575.98px) {
          .brand-content-final {
            font-size: 1.3rem;
          }
          
          .brand-text-final {
            display: none;
          }
          
          .navbar-actions-final .guest-actions-final {
            min-width: 120px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
