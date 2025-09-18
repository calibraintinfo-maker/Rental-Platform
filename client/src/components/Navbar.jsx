import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
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

  // ✅ ENHANCED: Scroll effect for professional glassmorphism
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

  // ✅ ENHANCED: Unread notification count
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  // ✅ PROFESSIONAL: Dynamic brand link based on user role
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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
          height: '75px',
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
          padding: '0'
        }}
      >
        <Container>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '75px'
          }}>
            
            {/* ✅ ENHANCED: Professional Logo with Role-Based Link */}
            <BootstrapNavbar.Brand 
              as={Link} 
              to={getBrandLink()}
              style={{
                color: '#1e293b',
                fontSize: '1.7rem',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}>
                <span style={{ fontSize: '1.4rem' }}>🏠</span>
              </div>
              SpaceLink
              {user?.role === 'admin' && (
                <Badge 
                  bg="warning" 
                  style={{ 
                    fontSize: '0.6rem', 
                    marginLeft: '4px',
                    fontWeight: '600'
                  }}
                >
                  ADMIN
                </Badge>
              )}
            </BootstrapNavbar.Brand>
            
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
            
            <BootstrapNavbar.Collapse id="basic-navbar-nav">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                marginLeft: 'auto'
              }}>
                
                {/* ✅ ENHANCED: Role-Based Navigation Links */}
                <Nav style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2rem',
                  marginRight: '1rem'
                }}>
                  {/* Public/User Navigation */}
                  {(!isAuthenticated || user?.role !== 'admin') && (
                    <Nav.Link 
                      as={Link} 
                      to="/find-property"
                      style={{
                        color: isActive('/find-property') ? '#667eea' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        padding: '8px 16px',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#667eea';
                        e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = isActive('/find-property') ? '#667eea' : '#64748b';
                        e.target.style.background = 'transparent';
                      }}
                    >
                      Find Property
                    </Nav.Link>
                  )}

                  {/* Admin Navigation */}
                  {isAuthenticated && user?.role === 'admin' && (
                    <>
                      <Nav.Link 
                        as={Link} 
                        to="/admin/dashboard"
                        style={{
                          color: isActive('/admin/dashboard') ? '#667eea' : '#64748b',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          padding: '8px 16px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#667eea';
                          e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = isActive('/admin/dashboard') ? '#667eea' : '#64748b';
                          e.target.style.background = 'transparent';
                        }}
                      >
                        Dashboard
                      </Nav.Link>
                      
                      <Nav.Link 
                        as={Link} 
                        to="/admin/verify-properties"
                        style={{
                          color: isActive('/admin/verify-properties') ? '#667eea' : '#64748b',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          padding: '8px 16px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#667eea';
                          e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = isActive('/admin/verify-properties') ? '#667eea' : '#64748b';
                          e.target.style.background = 'transparent';
                        }}
                      >
                        Verify Properties
                      </Nav.Link>
                    </>
                  )}

                  {/* User-Specific Navigation */}
                  {isAuthenticated && user?.role !== 'admin' && (
                    <>
                      <Nav.Link 
                        as={Link} 
                        to="/my-bookings"
                        style={{
                          color: isActive('/my-bookings') ? '#667eea' : '#64748b',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          padding: '8px 16px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#667eea';
                          e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = isActive('/my-bookings') ? '#667eea' : '#64748b';
                          e.target.style.background = 'transparent';
                        }}
                      >
                        My Bookings
                      </Nav.Link>
                      
                      {/* ✅ ENHANCED: Professional Property Management Dropdown */}
                      <NavDropdown 
                        title="Property Management" 
                        id="property-dropdown"
                        style={{
                          fontWeight: 600,
                          fontSize: '0.95rem'
                        }}
                      >
                        <NavDropdown.Item 
                          as={Link} 
                          to="/add-property"
                          style={{
                            padding: '12px 20px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            borderRadius: '8px',
                            margin: '4px 8px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ marginRight: '8px' }}>➕</span>
                          Add Property
                        </NavDropdown.Item>
                        
                        <NavDropdown.Item 
                          as={Link} 
                          to="/manage-properties"
                          style={{
                            padding: '12px 20px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            borderRadius: '8px',
                            margin: '4px 8px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ marginRight: '8px' }}>⚙️</span>
                          Manage Properties
                        </NavDropdown.Item>
                        
                        <NavDropdown.Item 
                          as={Link} 
                          to="/my-property-status"
                          style={{
                            padding: '12px 20px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            borderRadius: '8px',
                            margin: '4px 8px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ marginRight: '8px' }}>📊</span>
                          Property Status
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  )}
                </Nav>
                
                {/* ✅ ENHANCED: Notification Bell with Professional Design */}
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Notifications"
                    style={{
                      position: 'relative',
                      background: 'transparent',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '12px',
                      fontSize: '1.3rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span role="img" aria-label="bell">🔔</span>
                    {unreadCount > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          minWidth: '20px',
                          height: '20px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                          border: '2px solid white'
                        }}
                      >
                        {unreadCount > 999 ? '999+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                )}
                
                {/* ✅ ENHANCED: Authentication Section */}
                {isAuthenticated ? (
                  <NavDropdown 
                    title={
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontWeight: 600
                      }}>
                        <span style={{ 
                          fontSize: '1.1rem',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                        }}>
                          👤
                        </span>
                        {user?.name || 'User'}
                      </span>
                    } 
                    id="user-dropdown" 
                    align="end"
                    style={{ marginLeft: '12px' }}
                  >
                    <NavDropdown.Item 
                      as={Link} 
                      to="/profile"
                      style={{
                        padding: '12px 20px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        margin: '4px 8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ marginRight: '8px' }}>👤</span>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                      onClick={handleLogout}
                      style={{
                        padding: '12px 20px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        margin: '4px 8px',
                        transition: 'all 0.2s ease',
                        color: '#dc2626'
                      }}
                    >
                      <span style={{ marginRight: '8px' }}>🚪</span>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px' 
                  }}>
                    <Link 
                      to="/login" 
                      style={{
                        color: '#64748b',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#667eea';
                        e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#64748b';
                        e.target.style.background = 'transparent';
                      }}
                    >
                      Login
                    </Link>
                    
                    <Link 
                      to="/register" 
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </BootstrapNavbar.Collapse>
          </div>
        </Container>
      </BootstrapNavbar>
      
      {/* ✅ ENHANCED: Notification Sidebar */}
      <NotificationSidebar />
    </>
  );
};

export default Navbar;
