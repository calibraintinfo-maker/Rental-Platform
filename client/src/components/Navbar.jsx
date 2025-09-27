import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import NotificationSidebar from './NotificationSidebar';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { notifications, sidebarOpen, setSidebarOpen } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Professional Bell SVG
  const BellIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );

  // Check if current path matches the link
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Get active link styles - TEXT ONLY HIGHLIGHTING
  const getNavLinkStyle = (path, baseColor = '#6b7280', activeColor = '#6366f1') => ({
    color: isActivePath(path) ? activeColor : baseColor,
    fontWeight: isActivePath(path) ? '600' : '500',
    fontSize: '0.875rem',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    background: 'transparent' // No background highlighting
  });

  return (
    <>
      <BootstrapNavbar 
        expand="lg" 
        sticky="top"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          padding: '0',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1030,
          minHeight: '60px'
        }}
      >
        <Container 
          fluid 
          style={{ 
            maxWidth: '1200px',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* LEFT SIDE - BRAND ONLY */}
          <BootstrapNavbar.Brand 
            as={Link} 
            to={isAuthenticated && user?.role === 'admin' ? '/admin/dashboard' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#111827',
              textDecoration: 'none',
              letterSpacing: '-0.025em',
              transition: 'opacity 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {/* Professional Logo */}
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M3 9.5L12 4l9 5.5v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z"/>
                <polyline points="9,22 9,12 15,12 15,22" fill="rgba(99, 102, 241, 0.1)" stroke="white" strokeWidth="0.5"/>
              </svg>
            </div>
            SpaceLink
          </BootstrapNavbar.Brand>

          {/* SPACER TO PUSH EVERYTHING RIGHT */}
          <div style={{ flex: 1 }}></div>

          {/* Toggle Button */}
          <BootstrapNavbar.Toggle 
            aria-controls="basic-navbar-nav"
            style={{
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              padding: '4px 8px',
              background: 'transparent',
              boxShadow: 'none'
            }}
          />

          <BootstrapNavbar.Collapse id="basic-navbar-nav" style={{ flexGrow: 0 }}>
            {/* RIGHT SIDE - ALL NAVIGATION */}
            <Nav className="align-items-center" style={{ gap: '8px', flexDirection: 'row' }}>
              
              {/* NAVIGATION LINKS - FIXED LOGIC */}
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/dashboard"
                    style={getNavLinkStyle('/admin/dashboard')}
                    onMouseEnter={(e) => {
                      if (!isActivePath('/admin/dashboard')) {
                        e.currentTarget.style.color = '#2563eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActivePath('/admin/dashboard')) {
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/verify-properties"
                    style={getNavLinkStyle('/admin/verify-properties')}
                    onMouseEnter={(e) => {
                      if (!isActivePath('/admin/verify-properties')) {
                        e.currentTarget.style.color = '#16a34a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActivePath('/admin/verify-properties')) {
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    Verify Properties
                  </Nav.Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  {/* ONLY ONE Find Property for regular users */}
                  <Nav.Link 
                    as={Link} 
                    to="/find-property"
                    style={getNavLinkStyle('/find-property')}
                    onMouseEnter={(e) => {
                      if (!isActivePath('/find-property')) {
                        e.currentTarget.style.color = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActivePath('/find-property')) {
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    Find Property
                  </Nav.Link>
                  
                  <Nav.Link 
                    as={Link} 
                    to="/my-bookings"
                    style={getNavLinkStyle('/my-bookings')}
                    onMouseEnter={(e) => {
                      if (!isActivePath('/my-bookings')) {
                        e.currentTarget.style.color = '#2563eb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActivePath('/my-bookings')) {
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    My Bookings
                  </Nav.Link>
                  
                  {/* Clean Properties Dropdown */}
                  <NavDropdown 
                    title="Properties"
                    id="property-dropdown"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      color: (location.pathname.includes('/add-property') || 
                             location.pathname.includes('/manage-properties') || 
                             location.pathname.includes('/my-property-status')) ? '#6366f1' : '#6b7280',
                      fontWeight: (location.pathname.includes('/add-property') || 
                                  location.pathname.includes('/manage-properties') || 
                                  location.pathname.includes('/my-property-status')) ? '600' : '500'
                    }}
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to="/add-property"
                      style={{
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        fontWeight: isActivePath('/add-property') ? '600' : '500',
                        color: isActivePath('/add-property') ? '#6366f1' : '#374151',
                        borderRadius: '6px',
                        margin: '2px 6px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActivePath('/add-property')) {
                          e.currentTarget.style.color = '#111827';
                          e.currentTarget.style.background = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActivePath('/add-property')) {
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/manage-properties"
                      style={{
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        fontWeight: isActivePath('/manage-properties') ? '600' : '500',
                        color: isActivePath('/manage-properties') ? '#6366f1' : '#374151',
                        borderRadius: '6px',
                        margin: '2px 6px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActivePath('/manage-properties')) {
                          e.currentTarget.style.color = '#111827';
                          e.currentTarget.style.background = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActivePath('/manage-properties')) {
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-property-status"
                      style={{
                        padding: '10px 16px',
                        fontSize: '0.875rem',
                        fontWeight: isActivePath('/my-property-status') ? '600' : '500',
                        color: isActivePath('/my-property-status') ? '#6366f1' : '#374151',
                        borderRadius: '6px',
                        margin: '2px 6px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActivePath('/my-property-status')) {
                          e.currentTarget.style.color = '#111827';
                          e.currentTarget.style.background = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActivePath('/my-property-status')) {
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      Property Status
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}

              {/* ONLY show Find Property for non-authenticated users */}
              {!isAuthenticated && (
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  style={getNavLinkStyle('/find-property')}
                  onMouseEnter={(e) => {
                    if (!isActivePath('/find-property')) {
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActivePath('/find-property')) {
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  Find Property
                </Nav.Link>
              )}

              {/* VERTICAL SEPARATOR - Only when authenticated */}
              {isAuthenticated && (
                <div style={{
                  width: '1px',
                  height: '20px',
                  background: 'rgba(0, 0, 0, 0.1)',
                  margin: '0 12px' // Proper spacing
                }} />
              )}
              
              {/* PROFESSIONAL NOTIFICATION BUTTON - Only when authenticated */}
              {isAuthenticated && (
                <Button
                  variant="outline-light"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Notifications"
                  style={{ 
                    border: 'none',
                    background: 'transparent',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#6b7280',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    minWidth: '32px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <Badge
                      style={{
                        position: 'absolute',
                        top: '1px',
                        right: '1px',
                        background: '#ef4444',
                        color: 'white',
                        minWidth: '16px',
                        height: '16px',
                        fontSize: '0.65rem',
                        padding: '0 4px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        border: '1.5px solid white',
                        zIndex: 2
                      }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              )}
              
              {/* PROFILE SECTION OR LOGIN/REGISTER */}
              {isAuthenticated ? (
                <NavDropdown 
                  title={
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      flexShrink: 0,
                      cursor: 'pointer',
                      marginLeft: '16px' // Proper spacing from notification
                    }}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  }
                  id="user-dropdown" 
                  align="end"
                >
                  {/* Clean Dropdown Header */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    margin: '0 0 6px 0',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {user?.name || 'User'}
                  </div>
                  
                  {/* Clean Menu Items */}
                  <NavDropdown.Item 
                    as={Link} 
                    to="/profile"
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      borderRadius: '6px',
                      margin: '2px 6px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    Profile Settings
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider style={{
                    margin: '6px 6px',
                    borderColor: 'rgba(0, 0, 0, 0.06)'
                  }} />
                  
                  <NavDropdown.Item 
                    onClick={handleLogout}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      borderRadius: '6px',
                      margin: '2px 6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  {/* PROPER SPACING FOR LOGIN/GET STARTED */}
                  <Nav.Link 
                    as={Link} 
                    to="/login"
                    style={{
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                      marginRight: '8px' // Proper spacing
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/register"
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      background: '#6366f1',
                      border: 'none',
                      transition: 'all 0.15s ease',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#5856eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#6366f1';
                    }}
                  >
                    Get Started
                  </Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      
      <NotificationSidebar />
      
      {/* Professional CSS */}
      <style jsx>{`
        .dropdown-menu {
          background: white !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          padding: 6px !important;
          margin-top: 8px !important;
          min-width: 180px !important;
        }
        
        .dropdown-toggle::after {
          display: none !important;
        }
        
        .navbar-toggler:focus {
          box-shadow: none !important;
        }
        
        .dropdown-toggle {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            padding-top: 1rem !important;
            border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
            margin-top: 1rem !important;
          }
          
          .navbar-collapse .nav {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 4px !important;
          }
          
          .navbar-collapse .nav-link {
            text-align: left !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
