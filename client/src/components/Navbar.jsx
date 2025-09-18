import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AppNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on component mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://spacelink-a-real-time-unified-rental-at83.onrender.com'}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <Navbar expand="lg" fixed="top" style={{ background: '#fff', minHeight: '70px' }}>
        <Container fluid className="px-4">
          <Navbar.Brand>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b' }}>SpaceLink</span>
            </div>
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        minHeight: '70px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Container fluid className="px-4">
        {/* BRAND */}
        <Navbar.Brand as={Link} to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              🏠
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1e293b' }}>
              SpaceLink
            </span>
          </div>
        </Navbar.Brand>

        {/* DESKTOP NAVIGATION */}
        <div className="d-none d-lg-flex" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: 'auto' }}>
          
          {/* Guest Links */}
          {!isAuthenticated && (
            <Link 
              to="/find-property"
              style={{
                color: isActive('/find-property') ? '#667eea' : '#64748b',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              Find Property
            </Link>
          )}

          {/* Authenticated User Links */}
          {isAuthenticated && user?.role !== 'admin' && (
            <>
              <Link 
                to="/find-property"
                style={{
                  color: isActive('/find-property') ? '#667eea' : '#64748b',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                Find Property
              </Link>

              <Link 
                to="/my-bookings"
                style={{
                  color: isActive('/my-bookings') ? '#667eea' : '#64748b',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                My Bookings
              </Link>

              {/* Property Management Dropdown */}
              <Dropdown>
                <Dropdown.Toggle 
                  variant="link" 
                  style={{ 
                    color: '#64748b', 
                    fontWeight: '600', 
                    textDecoration: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    fontSize: '1rem',
                    padding: '8px 16px'
                  }}
                >
                  Property Management
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ border: 'none', borderRadius: '8px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
                  <Dropdown.Item as={Link} to="/add-property">
                    ➕ Add Property
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/manage-properties">
                    ⚙️ Manage Properties
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-property-status">
                    📊 Property Status
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link 
                to="/admin/dashboard"
                style={{
                  color: isActive('/admin/dashboard') ? '#667eea' : '#64748b',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/verify-properties"
                style={{
                  color: isActive('/admin/verify-properties') ? '#667eea' : '#64748b',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                Verify Properties
              </Link>
            </>
          )}

          {/* Right Section - Auth Buttons or User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isAuthenticated ? (
              <>
                <Button variant="outline-primary" as={Link} to="/login">
                  Login
                </Button>
                <Button as={Link} to="/register" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  border: 'none' 
                }}>
                  Get Started
                </Button>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="link" 
                  style={{ 
                    border: 'none', 
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ color: '#374151', fontWeight: '600' }}>
                    {user?.name || 'User'}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ border: 'none', borderRadius: '8px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
                  <Dropdown.Item as={Link} to="/profile">
                    👤 Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-bookings">
                    📝 My Bookings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} style={{ color: '#dc2626' }}>
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none" />
        
        {/* Mobile Menu */}
        <Navbar.Collapse id="basic-navbar-nav" className="d-lg-none">
          <Nav style={{ paddingTop: '1rem' }}>
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/find-property">Find Property</Nav.Link>
            )}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Nav.Link as={Link} to="/find-property">Find Property</Nav.Link>
                <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/add-property">Add Property</Nav.Link>
                <Nav.Link as={Link} to="/manage-properties">Manage Properties</Nav.Link>
              </>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/verify-properties">Verify Properties</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
