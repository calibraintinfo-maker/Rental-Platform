import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // ✅ SCROLL TO TOP ON COMPONENT LOAD
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/find-property');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="login-container"
      >
        {/* ✅ PROFESSIONAL: Beautiful Light Theme Background */}
        <div className="background-animation">
          {/* Animated gradient overlay */}
          <div className="gradient-overlay"></div>
          
          {/* Moving grid pattern */}
          <div className="grid-overlay"></div>
          
          {/* Floating orbs */}
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          
          {/* Interactive mouse follower */}
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
          
          {/* Floating particles */}
          <div className="particles">
            {[...Array(18)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.9}s`
                }}
              />
            ))}
          </div>
          
          {/* Geometric shapes */}
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col xs={11} sm={7} md={5} lg={4} xl={4}>
              
              {/* ✅ COMPACT: Professional Login Card */}
              <Card className="login-card">
                <Card.Body className="card-body">
                  
                  {/* Header Section */}
                  <div className="header-section">
                    <div className="brand-logo">
                      <span className="logo-icon">🏠</span>
                      <span className="brand-name">SpaceLink</span>
                    </div>
                    <h2 className="welcome-title">Welcome Back</h2>
                    <p className="welcome-subtitle">
                      Sign in to your account to continue exploring properties
                    </p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="danger" className="error-alert">
                      <strong>Error:</strong> {error}
                    </Alert>
                  )}

                  {/* Login Form */}
                  <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Group className="form-group">
                      <Form.Label className="form-label">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="form-input"
                        required
                        autoComplete="email"
                      />
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label className="form-label">Password</Form.Label>
                      <div className="password-container">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="form-input password-input"
                          required
                          autoComplete="current-password"
                        />
                        {/* ✅ PROFESSIONAL: SVG Eye Icon */}
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span className="button-icon">🚀</span>
                          <span>SIGN IN TO SPACELINK</span>
                        </>
                      )}
                    </Button>
                  </Form>

                  {/* Footer */}
                  <div className="login-footer">
                    <p className="signup-text">
                      Don&apos;t have an account?{' '}
                      <Link to="/register" className="signup-link">
                        Create one here
                      </Link>
                    </p>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ COMPACT: Professional Light Theme Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* ✅ BEAUTIFUL: Professional Background Animations */
        .background-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, 
            rgba(124, 58, 237, 0.04) 0%, 
            transparent 25%, 
            rgba(59, 130, 246, 0.03) 50%, 
            transparent 75%, 
            rgba(16, 185, 129, 0.04) 100%);
          animation: gradientShift 15s ease-in-out infinite;
        }
        
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(124, 58, 237, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.08) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 25s linear infinite;
        }
        
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(30px);
          opacity: 0.6;
        }
        
        .orb-1 {
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.05) 40%, transparent 70%);
          top: 8%;
          left: 10%;
          animation: float1 12s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 40%, transparent 70%);
          top: 60%;
          right: 12%;
          animation: float2 15s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 160px;
          height: 160px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%);
          bottom: 15%;
          left: 15%;
          animation: float3 18s ease-in-out infinite;
        }
        
        .orb-4 {
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.03) 40%, transparent 70%);
          top: 30%;
          left: 70%;
          animation: float4 20s ease-in-out infinite;
        }
        
        .mouse-follower {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(15px);
          transition: transform 0.3s ease-out;
          pointer-events: none;
        }
        
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.4);
        }
        
        .particle-1 { 
          width: 4px; 
          height: 4px; 
          animation: particle1 20s linear infinite; 
        }
        .particle-2 { 
          width: 3px; 
          height: 3px; 
          background: rgba(59, 130, 246, 0.4);
          animation: particle2 25s linear infinite; 
        }
        .particle-3 { 
          width: 5px; 
          height: 5px; 
          background: rgba(16, 185, 129, 0.4);
          animation: particle3 22s linear infinite; 
        }
        .particle-4 { 
          width: 2px; 
          height: 2px; 
          background: rgba(245, 101, 101, 0.4);
          animation: particle4 18s linear infinite; 
        }
        
        .geometric-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .shape {
          position: absolute;
          opacity: 0.1;
        }
        
        .shape-1 {
          width: 50px;
          height: 50px;
          border: 2px solid #7c3aed;
          top: 20%;
          right: 20%;
          animation: rotate 30s linear infinite;
        }
        
        .shape-2 {
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 30px solid #3b82f6;
          top: 70%;
          left: 80%;
          animation: float1 25s ease-in-out infinite;
        }
        
        .shape-3 {
          width: 30px;
          height: 30px;
          background: #10b981;
          border-radius: 50%;
          bottom: 30%;
          right: 30%;
          animation: pulse 8s ease-in-out infinite;
        }
        
        /* ✅ COMPACT: Perfect Login Card */
        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.1),
            0 8px 25px rgba(124, 58, 237, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          position: relative;
          z-index: 10;
          animation: cardAppear 0.8s ease-out;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
        }
        
        .login-card:hover {
          transform: translateY(-6px);
          box-shadow: 
            0 25px 70px rgba(0, 0, 0, 0.15),
            0 10px 30px rgba(124, 58, 237, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .card-body {
          padding: 2rem 1.75rem;
          color: #1f2937;
        }
        
        /* ✅ COMPACT: Header Section */
        .header-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 1rem;
        }
        
        .logo-icon {
          font-size: 1.6rem;
          filter: drop-shadow(0 2px 6px rgba(124, 58, 237, 0.3));
        }
        
        .brand-name {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        
        .welcome-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: #111827;
          letter-spacing: -0.02em;
        }
        
        .welcome-subtitle {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
        }
        
        /* ✅ COMPACT: Form Styling */
        .login-form {
          margin-bottom: 1.25rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-label {
          color: #374151;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }
        
        .form-input {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(209, 213, 219, 0.6) !important;
          border-radius: 10px !important;
          padding: 12px 16px !important;
          color: #111827 !important;
          font-size: 0.9rem !important;
          transition: all 0.3s ease !important;
          font-family: 'Inter', sans-serif !important;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05) !important;
        }
        
        .form-input::placeholder {
          color: #9ca3af !important;
          font-size: 0.85rem !important;
        }
        
        .form-input:focus {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
          transform: scale(1.01);
        }
        
        /* ✅ PROFESSIONAL: Password Field */
        .password-container {
          position: relative;
        }
        
        .password-input {
          padding-right: 45px !important;
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 5px;
          border-radius: 5px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .password-toggle:hover {
          color: #374151;
          background: rgba(124, 58, 237, 0.1);
          transform: translateY(-50%) scale(1.05);
        }
        
        .password-toggle svg {
          width: 18px;
          height: 18px;
        }
        
        /* ✅ COMPACT: Submit Button */
        .submit-button {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 12px 20px !important;
          color: white !important;
          font-size: 0.85rem !important;
          font-weight: 700 !important;
          width: 100% !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          font-family: 'Inter', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.25rem !important;
        }
        
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.35) !important;
        }
        
        .submit-button:active {
          transform: translateY(0) scale(1) !important;
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .button-icon {
          font-size: 1rem;
        }
        
        /* ✅ COMPACT: Error Alert */
        .error-alert {
          background: rgba(254, 242, 242, 0.9) !important;
          border: 1px solid rgba(248, 113, 113, 0.3) !important;
          border-radius: 8px !important;
          padding: 10px 12px !important;
          margin-bottom: 1.25rem !important;
          color: #dc2626 !important;
          font-size: 0.8rem !important;
        }
        
        /* ✅ COMPACT: Footer */
        .login-footer {
          text-align: center;
        }
        
        .signup-text {
          color: #6b7280;
          font-size: 0.8rem;
          margin: 0;
        }
        
        .signup-link {
          color: #7c3aed !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }
        
        .signup-link:hover {
          color: #6b21a8 !important;
          text-shadow: 0 0 6px rgba(124, 58, 237, 0.3) !important;
        }
        
        /* ✅ BEAUTIFUL: Animation Keyframes */
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(20px, -20px) rotate(90deg) scale(1.05); }
          50% { transform: translate(-15px, -30px) rotate(180deg) scale(0.95); }
          75% { transform: translate(-25px, 15px) rotate(270deg) scale(1.02); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          30% { transform: translate(-30px, -15px) rotate(108deg) scale(1.08); }
          70% { transform: translate(15px, -25px) rotate(252deg) scale(0.92); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          20% { transform: translate(15px, -12px) scale(1.06) rotate(72deg); }
          40% { transform: translate(-12px, -20px) scale(0.94) rotate(144deg); }
          60% { transform: translate(-20px, 8px) scale(1.03) rotate(216deg); }
          80% { transform: translate(12px, 16px) scale(0.97) rotate(288deg); }
        }
        
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(12px, -15px) scale(1.1); }
          66% { transform: translate(-15px, 12px) scale(0.9); }
        }
        
        @keyframes particle1 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(80px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes particle2 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) translateX(-60px) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes particle3 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-10vh) translateX(50px) rotate(180deg); opacity: 0; }
        }
        
        @keyframes particle4 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) translateX(-30px) rotate(-180deg); opacity: 0; }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        
        @keyframes cardAppear {
          from { 
            opacity: 0; 
            transform: translateY(25px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        /* ✅ RESPONSIVE: Mobile Optimizations */
        @media (max-width: 768px) {
          .login-card {
            max-width: 340px;
          }
          
          .card-body {
            padding: 1.75rem 1.5rem;
          }
          
          .welcome-title {
            font-size: 1.3rem;
          }
          
          .brand-name {
            font-size: 1.3rem;
          }
          
          .orb-1 { width: 200px; height: 200px; }
          .orb-2 { width: 150px; height: 150px; }
          .orb-3 { width: 120px; height: 120px; }
          .orb-4 { width: 100px; height: 100px; }
        }
        
        @media (max-width: 576px) {
          .login-card {
            max-width: 320px;
          }
          
          .card-body {
            padding: 1.5rem 1.25rem;
          }
          
          .welcome-title {
            font-size: 1.2rem;
          }
          
          .brand-name {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
};

export default Login;
