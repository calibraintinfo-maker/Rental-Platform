import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import NotificationSidebar from './NotificationSidebar';

const AppNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, sidebarOpen, setSidebarOpen } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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
    return isAuthenticated && user?.role === 'admin' ? '/admin/dashboard' : '/';
  };

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          minHeight: '60px',
          padding: '8px 0'
        }}
      >
        <Container fluid className="px-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            
            {/* BRAND - COMPACT */}
            <Navbar.Brand as={Link} to={getBrandLink()} style={{ textDecoration: 'none', margin: 0, padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  padding: '8px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🏠</span>
                </div>
                <span>SpaceLink</span>
                {user?.role === 'admin' && (
                  <Badge bg="warning" style={{ fontSize: '0.6rem', marginLeft: '6px' }}>ADMIN</Badge>
                )}
              </div>
            </Navbar.Brand>

            {/* DESKTOP NAV - COMPACT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '2rem' }} className="d-none d-lg-flex">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Link 
                  to="/find-property" 
                  style={{
                    color: isActive('/find-property') ? '#667eea' : '#64748b',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: isActive('/find-property') ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/find-property')) {
                      e.target.style.color = '#667eea';
                      e.target.style.background = 'rgba(102, 126, 234, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/find-property')) {
                      e.target.style.color = '#64748b';
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  Find Property
                </Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    style={{
                      color: isActive('/admin/dashboard') ? '#667eea' : '#64748b',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/verify-properties"
                    style={{
                      color: isActive('/admin/verify-properties') ? '#667eea' : '#64748b',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Verify Properties
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Link 
                    to="/my-bookings"
                    style={{
                      color: isActive('/my-bookings') ? '#667eea' : '#64748b',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    My Bookings
                  </Link>
                  
                  {/* WORKING DROPDOWN */}
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      style={{
                        color: '#64748b',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        boxShadow: 'none'
                      }}
                    >
                      Property Management
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '8px', minWidth: '250px' }}>
                      <Dropdown.Item 
                        as={Link} 
                        to="/add-property"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          padding: '10px 12px', 
                          borderRadius: '8px',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span>➕</span>
                        <div>
                          <div style={{ fontWeight: '500' }}>Add Property</div>
                          <small style={{ color: '#9ca3af' }}>List a new property</small>
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item 
                        as={Link} 
                        to="/manage-properties"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          padding: '10px 12px', 
                          borderRadius: '8px',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span>⚙️</span>
                        <div>
                          <div style={{ fontWeight: '500' }}>Manage Properties</div>
                          <small style={{ color: '#9ca3af' }}>Edit your listings</small>
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item 
                        as={Link} 
                        to="/my-property-status"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          padding: '10px 12px', 
                          borderRadius: '8px',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span>📊</span>
                        <div>
                          <div style={{ fontWeight: '500' }}>Property Status</div>
                          <small style={{ color: '#9ca3af' }}>View analytics</small>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </div>

            {/* RIGHT ACTIONS - COMPACT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              {isAuthenticated ? (
                <>
                  {/* NOTIFICATION */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      color: '#64748b',
                      cursor: 'pointer',
                      position: 'relative',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    🔔
                    {unreadCount > 0 && (
                      <Badge 
                        bg="danger" 
                        style={{ 
                          position: 'absolute', 
                          top: '2px', 
                          right: '2px', 
                          fontSize: '0.6rem',
                          minWidth: '16px',
                          height: '16px'
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </button>

                  {/* PROFILE DROPDOWN */}
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="link"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#374151',
                        textDecoration: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }} className="d-none d-md-inline">
                        {user?.name || 'User'}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: '8px', minWidth: '220px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '12px', 
                        background: 'rgba(102, 126, 234, 0.05)', 
                        borderRadius: '8px', 
                        marginBottom: '8px' 
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600'
                        }}>
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>
                            {user?.name || 'User'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {user?.email || 'user@example.com'}
                          </div>
                        </div>
                      </div>
                      
                      <Dropdown.Item as={Link} to="/profile" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>
                        👤 Profile Settings
                      </Dropdown.Item>
                      
                      <Dropdown.Item as={Link} to="/my-bookings" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>
                        📝 My Bookings
                      </Dropdown.Item>
                      
                      <Dropdown.Divider />
                      
                      <Dropdown.Item onClick={handleLogout} style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem', color: '#dc2626' }}>
                        🚪 Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#64748b', 
                      fontSize: '0.9rem', 
                      fontWeight: '600', 
                      textDecoration: 'none', 
                      padding: '6px 12px',
                      borderRadius: '6px'
                    }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      fontWeight: '600', 
                      fontSize: '0.9rem', 
                      textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.25)'
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none" />
          </div>

          {/* MOBILE MENU */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-lg-none">
            <Nav style={{ paddingTop: '1rem' }}>
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link as={Link} to="/find-property" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                  Find Property
                </Nav.Link>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin/dashboard" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/verify-properties" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                    Verify Properties
                  </Nav.Link>
                </>
              )}
              
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Nav.Link as={Link} to="/my-bookings" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                    My Bookings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/add-property" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                    Add Property
                  </Nav.Link>
                  <Nav.Link as={Link} to="/manage-properties" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                    Manage Properties
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-property-status" style={{ color: '#64748b', fontWeight: '500', padding: '8px 0' }}>
                    Property Status
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <NotificationSidebar />
    </>
  );
};

export default AppNavbar;
