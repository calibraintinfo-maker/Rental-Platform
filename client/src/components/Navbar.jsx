import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import NotificationSidebar from './NotificationSidebar';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { notifications, sidebarOpen, setSidebarOpen } = useNotification();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Simple Bell SVG (only for notification)
  const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );

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
          minHeight: '60px' // Fixed height
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
          {/* CLEAN PROFESSIONAL BRAND */}
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
              userSelect: 'none',
              marginRight: '40px' // Consistent spacing
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

          <BootstrapNavbar.Collapse id="basic-navbar-nav" style={{ height: 'auto' }}>
            {/* LEFT NAVIGATION */}
            <Nav className="me-auto" style={{ gap: '0px', alignItems: 'center' }}>
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  style={{
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Find Property
                </Nav.Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/dashboard"
                    style={{
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.color = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/verify-properties"
                    style={{
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0fdf4';
                      e.currentTarget.style.color = '#16a34a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }}
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
                    style={{
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f9ff';
                      e.currentTarget.style.color = '#0ea5e9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    My Bookings
                  </Nav.Link>
                  
                  {/* Clean Dropdown */}
                  <NavDropdown 
                    title="Properties"
                    id="property-dropdown"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem'
                    }}
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to="/add-property"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        borderRadius: '4px',
                        margin: '2px 6px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
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
                      Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/manage-properties"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        borderRadius: '4px',
                        margin: '2px 6px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
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
                      Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-property-status"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        borderRadius: '4px',
                        margin: '2px 6px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
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
                      Property Status
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
            
            {/* RIGHT NAVIGATION - CONSISTENT LAYOUT */}
            <Nav className="align-items-center" style={{ gap: '12px' }}>
              {/* NOTIFICATION BUTTON - Only when authenticated */}
              {isAuthenticated && (
                <Button
                  variant="outline-light"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Notifications"
                  style={{ 
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    background: 'transparent',
                    borderRadius: '6px',
                    padding: '0',
                    color: '#6b7280',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    minWidth: '36px' // Prevent shrinking
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <Badge
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: '#ef4444',
                        color: 'white',
                        minWidth: '16px',
                        height: '16px',
                        fontSize: '0.6rem',
                        padding: '0 3px',
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
              
              {/* USER SECTION */}
              {isAuthenticated ? (
                <NavDropdown 
                  title={
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      background: 'transparent',
                      transition: 'all 0.15s ease',
                      height: '36px',
                      minWidth: '120px'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span style={{
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        maxWidth: '80px'
                      }}>
                        {user?.name || 'User'}
                      </span>
                    </div>
                  }
                  id="user-dropdown" 
                  align="end"
                >
                  <div style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    margin: '0 0 4px 0',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Account
                  </div>
                  
                  <NavDropdown.Item 
                    as={Link} 
                    to="/profile"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      borderRadius: '4px',
                      margin: '2px 6px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
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
                    margin: '4px 6px',
                    borderColor: 'rgba(0, 0, 0, 0.06)'
                  }} />
                  
                  <NavDropdown.Item 
                    onClick={handleLogout}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      borderRadius: '4px',
                      margin: '2px 6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
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
                  <Nav.Link 
                    as={Link} 
                    to="/login"
                    style={{
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    Sign In
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
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          padding: 4px !important;
          margin-top: 4px !important;
          min-width: 200px !important;
        }
        
        .dropdown-toggle::after {
          margin-left: 8px !important;
          border-top: 0.3em solid !important;
          border-right: 0.3em solid transparent !important;
          border-bottom: 0 !important;
          border-left: 0.3em solid transparent !important;
          opacity: 0.6 !important;
        }
        
        .navbar-toggler:focus {
          box-shadow: none !important;
        }
        
        .navbar-nav .nav-link {
          margin: 0 !important;
        }
        
        .navbar-collapse {
          border-top: none !important;
        }
        
        .dropdown-toggle {
          background: transparent !important;
          border: none !important;
          color: #6b7280 !important;
          font-weight: 500 !important;
          font-size: 0.875rem !important;
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            padding-top: 1rem !important;
            border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
            margin-top: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
