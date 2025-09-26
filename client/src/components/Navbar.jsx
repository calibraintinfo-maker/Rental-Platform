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

  return (
    <>
      <BootstrapNavbar 
        expand="lg" 
        sticky="top"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '0.75rem 0',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1030
        }}
      >
        <Container>
          {/* PROFESSIONAL BRAND */}
          <BootstrapNavbar.Brand 
            as={Link} 
            to={isAuthenticated && user?.role === 'admin' ? '/admin/dashboard' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#1f2937',
              textDecoration: 'none',
              letterSpacing: '-0.025em',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.color = '#7c3aed';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = '#1f2937';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: '12px',
                opacity: 0.6,
                filter: 'blur(8px)',
                zIndex: -1
              }} />
              🏠
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SpaceLink
            </span>
          </BootstrapNavbar.Brand>

          {/* Modern Toggle Button */}
          <BootstrapNavbar.Toggle 
            aria-controls="basic-navbar-nav"
            style={{
              border: 'none',
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              background: 'rgba(124, 58, 237, 0.1)',
              transition: 'all 0.3s ease'
            }}
          />

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ gap: '0.5rem' }}>
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link 
                  as={Link} 
                  to="/find-property"
                  style={{
                    color: '#4b5563',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                    e.currentTarget.style.color = '#7c3aed';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#4b5563';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔍 Find Property
                </Nav.Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/dashboard"
                    style={{
                      color: '#4b5563',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                      e.currentTarget.style.color = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    📊 Dashboard
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/admin/verify-properties"
                    style={{
                      color: '#4b5563',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                      e.currentTarget.style.color = '#10b981';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ✅ Verify Properties
                  </Nav.Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/my-bookings"
                    style={{
                      color: '#4b5563',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                      e.currentTarget.style.color = '#06b6d4';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    📅 My Bookings
                  </Nav.Link>
                  
                  {/* Professional Dropdown */}
                  <NavDropdown 
                    title={
                      <span style={{
                        color: '#4b5563',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}>
                        🏢 Property Management
                      </span>
                    }
                    id="property-dropdown"
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to="/add-property"
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        margin: '0.25rem 0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                        e.currentTarget.style.color = '#10b981';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      ➕ Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/manage-properties"
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        margin: '0.25rem 0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.color = '#3b82f6';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      ⚙️ Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/my-property-status"
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        margin: '0.25rem 0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                        e.currentTarget.style.color = '#f59e0b';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      📈 Property Status
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
            
            <Nav className="align-items-center" style={{ gap: '0.75rem' }}>
              {isAuthenticated && (
                <Button
                  variant="outline-light"
                  className="position-relative"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Notifications"
                  style={{ 
                    border: 'none', 
                    background: 'rgba(124, 58, 237, 0.1)',
                    borderRadius: '12px',
                    padding: '0.625rem',
                    fontSize: '1.25rem',
                    color: '#7c3aed',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124, 58, 237, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔔
                  {unreadCount > 0 && (
                    <Badge
                      style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        minWidth: unreadCount > 99 ? '24px' : '20px',
                        height: unreadCount > 99 ? '20px' : '18px',
                        fontSize: unreadCount > 99 ? '0.7rem' : '0.75rem',
                        padding: '0 4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        border: '2px solid rgba(255, 255, 255, 0.95)',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                        zIndex: 2,
                        animation: 'pulse 2s infinite'
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
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 1rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      color: '#10b981',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}>
                      👤 {user?.name || 'User'}
                    </span>
                  }
                  id="user-dropdown" 
                  align="end"
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    👤 {user?.name || 'User'}
                  </div>
                  
                  <NavDropdown.Item 
                    as={Link} 
                    to="/profile"
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      margin: '0.25rem 0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#374151',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                      e.currentTarget.style.color = '#7c3aed';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    👤 Profile
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider style={{
                    margin: '0.5rem 0.75rem',
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  }} />
                  
                  <NavDropdown.Item 
                    onClick={handleLogout}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      margin: '0.25rem 0.5rem',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#374151',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = '#ef4444';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/login"
                    style={{
                      color: '#4b5563',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      padding: '0.625rem 1.25rem',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
                      e.currentTarget.style.color = '#7c3aed';
                      e.currentTarget.style.borderColor = '#7c3aed';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                      e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/register"
                    style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      padding: '0.625rem 1.25rem',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      textDecoration: 'none',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                    }}
                  >
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      
      <NotificationSidebar />
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .dropdown-menu {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          padding: 0.5rem !important;
        }
        
        .navbar-toggler:focus {
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;
