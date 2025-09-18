import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AppNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status on every route change
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(user);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <Navbar expand="lg" fixed="top" style={{ backgroundColor: 'white', minHeight: '70px' }}>
        <Container fluid>
          <Navbar.Brand>SpaceLink</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      style={{ 
        backgroundColor: 'white', 
        minHeight: '70px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <Container fluid>
        {/* BRAND */}
        <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: '8px', 
            padding: '8px 12px', 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            🏠
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#212529' }}>
            SpaceLink
          </span>
        </Navbar.Brand>

        {/* DESKTOP MENU */}
        <div className="d-none d-lg-flex" style={{ marginLeft: 'auto', alignItems: 'center', gap: '30px' }}>
          
          {/* NAVIGATION LINKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <Link 
              to="/find-property" 
              style={{ 
                textDecoration: 'none', 
                color: isActive('/find-property') ? '#3b82f6' : '#6b7280', 
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Find Property
            </Link>

            {/* USER AUTHENTICATED MENU */}
            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link 
                  to="/my-bookings" 
                  style={{ 
                    textDecoration: 'none', 
                    color: isActive('/my-bookings') ? '#3b82f6' : '#6b7280', 
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  My Bookings
                </Link>

                <Dropdown>
                  <Dropdown.Toggle 
                    variant="link" 
                    style={{ 
                      color: '#6b7280', 
                      textDecoration: 'none', 
                      fontWeight: 600, 
                      border: 'none',
                      boxShadow: 'none',
                      fontSize: '1rem'
                    }}
                    id="property-dropdown"
                  >
                    Property Management ▼
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
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

            {/* ADMIN AUTHENTICATED MENU */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  style={{ 
                    textDecoration: 'none', 
                    color: isActive('/admin/dashboard') ? '#3b82f6' : '#6b7280', 
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/verify-properties" 
                  style={{ 
                    textDecoration: 'none', 
                    color: isActive('/admin/verify-properties') ? '#3b82f6' : '#6b7280', 
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  Verify Properties
                </Link>
              </>
            )}
          </div>

          {/* AUTH BUTTONS / USER MENU */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!isAuthenticated ? (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  size="sm"
                  style={{ textDecoration: 'none' }}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  size="sm"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    border: 'none',
                    textDecoration: 'none'
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="light" 
                  id="user-dropdown" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '8px 12px',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontWeight: 600 }}>
                    {user?.name || 'User'}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    👤 Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-bookings">
                    📝 My Bookings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    onClick={handleLogout}
                    style={{ color: '#dc2626' }}
                  >
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="d-lg-none" />
        
        {/* MOBILE MENU */}
        <Navbar.Collapse id="responsive-navbar-nav" className="d-lg-none">
          <Nav style={{ padding: '20px 0', gap: '10px' }}>
            <Nav.Link as={Link} to="/find-property">
              Find Property
            </Nav.Link>
            
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Get Started
                </Nav.Link>
              </>
            )}

            {isAuthenticated && user?.role !== 'admin' && (
              <>
                <Nav.Link as={Link} to="/my-bookings">
                  My Bookings
                </Nav.Link>
                <Nav.Link as={Link} to="/add-property">
                  Add Property
                </Nav.Link>
                <Nav.Link as={Link} to="/manage-properties">
                  Manage Properties
                </Nav.Link>
                <Nav.Link as={Link} to="/my-property-status">
                  Property Status
                </Nav.Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/verify-properties">
                  Verify Properties
                </Nav.Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ color: '#dc2626' }}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
