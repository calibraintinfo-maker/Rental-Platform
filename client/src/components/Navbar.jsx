import React, { useState, useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => {
    setExpanded(false);
  };

  return (
    <>
      <BootstrapNavbar 
        expand="lg" 
        fixed="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        className="custom-navbar"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
            : '0 2px 10px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          height: '70px',
          padding: '0',
          zIndex: 1050,
        }}
      >
        <Container>
          <BootstrapNavbar.Brand 
            as={Link} 
            to="/" 
            onClick={closeMenu}
            className="brand"
          >
            <div className="logo-icon">🏠</div>
            <span className="logo-text">SpaceLink</span>
          </BootstrapNavbar.Brand>
          
          <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
          
          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/find-property"
                onClick={closeMenu}
                className={isActive('/find-property') ? 'active' : ''}
              >
                Find Property
              </Nav.Link>
              
              {isAuthenticated && (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/my-bookings"
                    onClick={closeMenu}
                    className={isActive('/my-bookings') ? 'active' : ''}
                  >
                    My Bookings
                  </Nav.Link>
                  
                  <NavDropdown title="Properties" id="properties-dropdown">
                    <NavDropdown.Item as={Link} to="/add-property" onClick={closeMenu}>
                      📝 Add Property
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/manage-properties" onClick={closeMenu}>
                      ⚙️ Manage Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-property-status" onClick={closeMenu}>
                      📊 Property Status
                    </NavDropdown.Item>
                  </NavDropdown>

                  {user?.role === 'admin' && (
                    <NavDropdown title="Admin" id="admin-dropdown" className="admin-dropdown">
                      <NavDropdown.Item as={Link} to="/admin/dashboard" onClick={closeMenu}>
                        🏢 Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/verify-properties" onClick={closeMenu}>
                        ✅ Verify Properties
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              )}
            </Nav>
            
            <Nav className="ms-auto">
              {!isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/login" onClick={closeMenu} className="login-btn">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" onClick={closeMenu} className="signup-btn">
                    Get Started
                  </Nav.Link>
                </>
              ) : (
                <NavDropdown
                  title={
                    <div className="profile-section">
                      <div className="profile-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="profile-name">{user?.name || 'User'}</span>
                    </div>
                  }
                  id="profile-dropdown"
                  align="end"
                >
                  <NavDropdown.Header>
                    <strong>{user?.name || 'User'}</strong><br />
                    <small className="text-muted">{user?.email || 'user@example.com'}</small>
                  </NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile" onClick={closeMenu}>
                    👤 Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-bookings" onClick={closeMenu}>
                    📋 My Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="logout-item">
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Clean Responsive Styles */}
      <style jsx>{`
        .custom-navbar {
          transition: all 0.3s ease !important;
        }

        /* Brand Styling */
        .brand {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          color: #1e293b !important;
          font-size: 1.6rem !important;
          font-weight: 800 !important;
          text-decoration: none !important;
        }

        .brand:hover {
          color: #1e293b !important;
        }

        .logo-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 10px !important;
          padding: 8px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
          font-size: 1.4rem !important;
          width: 40px !important;
          height: 40px !important;
          color: white !important;
        }

        .logo-text {
          color: #1e293b !important;
        }

        /* Navigation Links */
        .navbar-nav .nav-link {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          margin: 0 4px !important;
        }

        .navbar-nav .nav-link:hover,
        .navbar-nav .nav-link.active {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.1) !important;
          transform: translateY(-2px) !important;
        }

        /* Dropdowns */
        .dropdown-toggle {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
        }

        .dropdown-toggle::after {
          transition: transform 0.2s ease !important;
        }

        .dropdown-toggle[aria-expanded="true"]::after {
          transform: rotate(180deg) !important;
        }

        .dropdown-menu {
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          padding: 0.5rem 0 !important;
          margin-top: 0.5rem !important;
          backdrop-filter: blur(20px) !important;
        }

        .dropdown-item {
          padding: 0.75rem 1.25rem !important;
          font-size: 0.9rem !important;
          font-weight: 500 !important;
          transition: all 0.2s ease !important;
        }

        .dropdown-item:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #667eea !important;
        }

        /* Auth Buttons */
        .login-btn {
          color: #64748b !important;
          font-weight: 600 !important;
        }

        .login-btn:hover {
          color: #667eea !important;
          background: rgba(102, 126, 234, 0.08) !important;
        }

        .signup-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: none !important;
          border-radius: 10px !important;
          color: white !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
        }

        .signup-btn:hover {
          color: white !important;
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        }

        /* Profile Section */
        .profile-section {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .profile-avatar {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: bold !important;
        }

        .profile-name {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          color: #1e293b !important;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        /* RESPONSIVE BREAKPOINTS */
        
        /* Large Desktop (1200px+) */
        @media (min-width: 1200px) {
          .logo-text {
            font-size: 1.7rem !important;
          }
          
          .profile-name {
            display: inline !important;
          }
        }

        /* Desktop (992px+) */
        @media (min-width: 992px) {
          .profile-name {
            display: inline !important;
          }
        }

        /* Tablet and Mobile (991px and below) */
        @media (max-width: 991.98px) {
          .navbar-nav {
            margin-top: 1rem !important;
            width: 100% !important;
          }

          .navbar-nav .nav-link {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            border-radius: 0 !important;
            width: 100% !important;
            text-align: left !important;
            margin: 0 !important;
          }

          .dropdown-toggle {
            padding: 12px 16px !important;
            font-size: 1rem !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            width: 100% !important;
            text-align: left !important;
          }

          .dropdown-menu {
            width: 100% !important;
            border-radius: 0 !important;
            margin-top: 0 !important;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            background: rgba(248, 249, 250, 0.9) !important;
          }

          .login-btn,
          .signup-btn {
            width: 100% !important;
            text-align: center !important;
            padding: 12px !important;
            margin: 4px 0 !important;
            font-size: 1rem !important;
          }

          .profile-section {
            padding: 12px 16px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
            justify-content: space-between !important;
            width: 100% !important;
          }

          .profile-name {
            display: inline !important;
          }
        }

        /* Mobile Large (576px - 767px) */
        @media (max-width: 767.98px) {
          .brand {
            font-size: 1.4rem !important;
          }

          .logo-icon {
            width: 36px !important;
            height: 36px !important;
            font-size: 1.2rem !important;
            padding: 6px !important;
          }

          .profile-avatar {
            width: 28px !important;
            height: 28px !important;
            font-size: 12px !important;
          }
        }

        /* Small Mobile (575px and below) */
        @media (max-width: 575.98px) {
          .brand {
            font-size: 1.2rem !important;
          }

          .logo-icon {
            width: 32px !important;
            height: 32px !important;
            font-size: 1rem !important;
            padding: 4px !important;
          }

          .profile-avatar {
            width: 24px !important;
            height: 24px !important;
            font-size: 11px !important;
          }

          .dropdown-item {
            font-size: 0.85rem !important;
            padding: 0.6rem 1rem !important;
          }
        }

        /* Extra Small Mobile (320px - 479px) */
        @media (max-width: 479.98px) {
          .brand {
            font-size: 1.1rem !important;
          }

          .navbar-nav .nav-link,
          .dropdown-toggle {
            font-size: 0.95rem !important;
            padding: 10px 12px !important;
          }
        }

        /* Hide profile name on very small screens */
        @media (max-width: 375px) {
          .profile-name {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
