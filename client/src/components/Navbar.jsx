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

  // Professional SVG Icons
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="21 21l-4.35-4.35"/>
    </svg>
  );

  const DashboardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="9 11l3 3L22 4"/>
      <path d="21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const BuildingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18"/>
      <path d="M5 21V7l8-4v18"/>
      <path d="M19 21V11l-6-4"/>
    </svg>
  );

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );

  const TrendingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
      <polyline points="17,6 23,6 23,12"/>
    </svg>
  );

  const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );

  const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16,17 21,12 16,7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
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
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 20px rgba(0, 0, 0, 0.04)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          padding: '0.75rem 0',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1030,
          minHeight: '64px'
        }}
      >
        <Container fluid style={{ maxWidth: '1200px' }}>
          {/* 🔥 ENTERPRISE-GRADE BRAND */}
          <BootstrapNavbar.Brand 
            as={Link} 
            to={isAuthenticated && user?.role === 'admin' ? '/admin/dashboard' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.375rem',
              fontWeight: '700',
              color: '#111827',
              textDecoration: 'none',
              letterSpacing: '-0.025em',
              transition: 'all 0.2s ease',
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
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M3 9.5L12 4l9 5.5v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z"/>
                <polyline points="9,22 9,12 15,12 15,22" fill="rgba(99, 102, 241, 0.1)" stroke="white" strokeWidth="0.5"/>
              </svg>
            </div>
            SpaceLink
          </BootstrapNavbar.Brand>

          {/* Enterprise Toggle Button */}
          <BootstrapNavbar.Toggle 
            aria-controls="basic-navbar-nav"
            style={{
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '6px',
              padding: '4px 8px',
              background: 'transparent',
              boxShadow: 'none'
            }}
          />

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ gap: '4px', marginLeft: '32px' }}>
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  style={{
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid transparent'
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
                  <SearchIcon />
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
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
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
                    <DashboardIcon />
                    Dashboard
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/verify-properties"
                    style={{
                      color: '#6b7280',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
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
                    <CheckIcon />
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
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
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
                    <CalendarIcon />
                    My Bookings
                  </Nav.Link>
                  
                  {/* Enterprise Dropdown */}
                  <NavDropdown 
                    title={
                      <span style={{
                        color: '#6b7280',
                        fontWeight: '500',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <BuildingIcon />
                        Properties
                      </span>
                    }
                    id="property-dropdown"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px'
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0fdf4';
                        e.currentTarget.style.color = '#16a34a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      <PlusIcon />
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      <SettingsIcon />
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef3c7';
                        e.currentTarget.style.color = '#d97706';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                      }}
                    >
                      <TrendingIcon />
                      Property Status
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
            
            <Nav className="align-items-center" style={{ gap: '8px' }}>
              {isAuthenticated && (
                <Button
                  variant="outline-light"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Notifications"
                  style={{ 
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    background: 'transparent',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#6b7280',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
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
                        minWidth: unreadCount > 99 ? '20px' : '18px',
                        height: unreadCount > 99 ? '18px' : '16px',
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
                      {unreadCount > 999 ? '999+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              )}
              
              {isAuthenticated ? (
                <NavDropdown 
                  title={
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      background: 'transparent',
                      transition: 'all 0.15s ease',
                      minWidth: '120px'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span style={{
                        color: '#374151',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
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
                    <UserIcon />
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
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
                    <LogoutIcon />
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
                      transition: 'all 0.15s ease'
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
                      transition: 'all 0.15s ease'
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
      
      {/* Enterprise CSS */}
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
        }
        
        .navbar-toggler:focus {
          box-shadow: none !important;
        }
        
        .navbar-nav .nav-link {
          margin: 0 2px !important;
        }
        
        .navbar-collapse {
          border-top: none !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;
