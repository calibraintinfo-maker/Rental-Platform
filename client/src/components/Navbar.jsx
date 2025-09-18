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
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <BootstrapNavbar.Brand as={Link} to={isAuthenticated && user?.role === 'admin' ? '/admin/dashboard' : '/'}>
            🏠 SpaceLink
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {(!isAuthenticated || user?.role !== 'admin') && (
                <Nav.Link as={Link} to="/find-property">
                  Find Property
                </Nav.Link>
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
              {isAuthenticated && user?.role !== 'admin' && (
                <>
                  <Nav.Link as={Link} to="/my-bookings">
                    My Bookings
                  </Nav.Link>
                  <NavDropdown title="Property Management" id="property-dropdown">
                    <NavDropdown.Item as={Link} to="/add-property">
                      Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manage-properties">
                      Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-property-status">
                      My Property Status
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
            <Nav className="align-items-center">
              {isAuthenticated && (
                <Button
                  variant="outline-light"
                  className="position-relative me-3"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Notifications"
                  style={{ border: 'none', background: 'none', fontSize: '1.5rem' }}
                >
                  <span role="img" aria-label="bell">🔔</span>
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        minWidth: unreadCount > 99 ? 22 : 18,
                        height: unreadCount > 99 ? 18 : 16,
                        fontSize: unreadCount > 99 ? '0.75rem' : '0.85rem',
                        padding: '0 4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                      }}
                    >
                      {unreadCount > 999 ? '999+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              )}
              {isAuthenticated ? (
                <NavDropdown title={`👤 ${user?.name || 'User'}`} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      <NotificationSidebar />
    </>
  );
};

export default Navbar;
