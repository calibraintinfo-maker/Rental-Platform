import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { api, handleApiError, validatePhone } from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        contact: user.contact || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (formData.contact && !validatePhone(formData.contact)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    if (formData.pincode && (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode))) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.user.updateProfile(formData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompleteness = () => {
    const requiredFields = ['name', 'contact', 'address', 'city', 'state', 'pincode'];
    const filledFields = requiredFields.filter(field => formData[field]?.trim());
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  // Professional SVG Icons Component
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      user: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      mail: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      edit: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      alertCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <path d="M12 16h.01"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  const completeness = getProfileCompleteness();

  return (
    <>
      <div 
        ref={containerRef}
        className="profile-container"
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
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 0.8}s`
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

        <Container style={{ position: 'relative', zIndex: 10 }}>
          <Row className="justify-content-center">
            <Col xl={8} lg={10} md={12}>
              
              {/* Header Card */}
              <Card className="profile-card header-card">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="profile-icon">
                      <Icon name="user" size={24} />
                    </div>
                    <div>
                      <h2 className="profile-title">
                        Profile Information
                      </h2>
                      <p className="profile-subtitle">
                        Manage your personal information and account settings
                      </p>
                    </div>
                  </div>

                  {/* Profile Completeness */}
                  <div className="completeness-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="completeness-label">Profile Completeness</span>
                      <span className={`completeness-percentage ${completeness === 100 ? 'complete' : 'incomplete'}`}>
                        {completeness}%
                      </span>
                    </div>
                    <div className="progress-container">
                      <div 
                        className={`progress-bar ${completeness === 100 ? 'complete' : 'incomplete'}`}
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                    {completeness < 100 && (
                      <p className="completeness-message incomplete">
                        <Icon name="alertCircle" size={14} style={{ marginRight: '6px' }} />
                        Complete your profile to start booking properties
                      </p>
                    )}
                    {completeness === 100 && (
                      <p className="completeness-message complete">
                        <Icon name="check" size={14} style={{ marginRight: '6px' }} />
                        Profile complete! You can now book properties
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>

              {/* Main Form Card */}
              <Card className="profile-card main-card">
                <Card.Body className="p-4">
                  
                  {/* Alerts */}
                  {success && (
                    <Alert variant="success" className="success-alert">
                      <div className="d-flex align-items-center gap-2">
                        <Icon name="check" size={18} />
                        <span><strong>Success:</strong> {success}</span>
                      </div>
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert variant="danger" className="error-alert">
                      <div className="d-flex align-items-center gap-2">
                        <Icon name="alertCircle" size={18} />
                        <span><strong>Error:</strong> {error}</span>
                      </div>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} className="profile-form">
                    
                    {/* Personal Information Section */}
                    <div className="form-section">
                      <h5 className="section-title">Personal Information</h5>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="user" size={16} style={{ marginRight: '6px' }} />
                              Full Name *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="form-input"
                              required
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mail" size={16} style={{ marginRight: '6px' }} />
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              value={user?.email || ''}
                              disabled
                              className="form-input disabled"
                            />
                            <Form.Text className="form-help">
                              Email cannot be changed for security reasons
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Contact Information Section */}
                    <div className="form-section">
                      <h5 className="section-title">Contact Information</h5>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="phone" size={16} style={{ marginRight: '6px' }} />
                              Contact Number *
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="contact"
                              value={formData.contact}
                              onChange={handleInputChange}
                              placeholder="Enter 10-digit mobile number"
                              maxLength="10"
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mapPin" size={16} style={{ marginRight: '6px' }} />
                              Pincode *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              placeholder="Enter 6-digit pincode"
                              maxLength="6"
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Address Information Section */}
                    <div className="form-section">
                      <h5 className="section-title">Address Information</h5>
                      
                      <Form.Group className="form-group mb-3">
                        <Form.Label className="form-label">
                          <Icon name="home" size={16} style={{ marginRight: '6px' }} />
                          Address *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your complete address"
                          className="form-input"
                        />
                      </Form.Group>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mapPin" size={16} style={{ marginRight: '6px' }} />
                              City *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Enter your city"
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mapPin" size={16} style={{ marginRight: '6px' }} />
                              State *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="Enter your state"
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        size="lg"
                        disabled={loading}
                        className="submit-button"
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <Icon name="edit" size={18} />
                          <span>{loading ? 'Updating Profile...' : 'Update Profile'}</span>
                        </div>
                      </Button>
                    </div>

                    {/* ✅ PERFECT FIX: Footer Note with Perfect Icon Alignment */}
                    <div className="form-footer">
                      <small>
                        <Icon name="alertCircle" size={14} style={{ 
                          color: '#3b82f6', 
                          marginRight: '6px',
                          marginTop: '-1px', // Perfect vertical centering
                          flexShrink: 0 
                        }} />
                        Fields marked with * are required. Complete all fields to enable property booking and access all platform features.
                      </small>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ PROFESSIONAL: Complete CSS with Perfect Icon Alignment */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .profile-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-top: 100px;
          padding-bottom: 60px;
        }
        
        /* ✅ BEAUTIFUL: Professional Background Animations - Same as Login */
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
          height: calc(100% - 80px); /* Stop before footer */
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
        
        /* ✅ PROFESSIONAL: Profile Cards */
        .profile-card {
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
          animation: cardAppear 0.8s ease-out;
          transition: all 0.3s ease;
          margin-bottom: 24px;
        }
        
        .profile-card:hover {
          transform: translateY(-6px);
          box-shadow: 
            0 25px 70px rgba(0, 0, 0, 0.15),
            0 10px 30px rgba(124, 58, 237, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .profile-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          borderRadius: 16px;
          padding: 12px;
          color: white;
          border-radius: 16px;
        }
        
        .profile-title {
          font-weight: 800;
          color: #1e293b;
          margin: 0;
          font-size: 1.8rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .profile-subtitle {
          margin: 0;
          color: #64748b;
          font-size: 1rem;
        }
        
        /* ✅ PROFESSIONAL: Completeness Card */
        .completeness-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.04));
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .completeness-label {
          font-weight: 600;
          color: #1e293b;
        }
        
        .completeness-percentage {
          font-weight: 800;
          font-size: 1.1rem;
        }
        
        .completeness-percentage.complete { color: #10b981; }
        .completeness-percentage.incomplete { color: #f59e0b; }
        
        .progress-container {
          background: #e2e8f0;
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .progress-bar.complete {
          background: linear-gradient(90deg, #34d399, #10b981);
        }
        
        .progress-bar.incomplete {
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
        }
        
        .completeness-message {
          margin: 8px 0 0 0;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        
        .completeness-message.complete { color: #10b981; font-weight: 600; }
        .completeness-message.incomplete { color: #64748b; }
        
        /* ✅ PROFESSIONAL: Form Sections */
        .form-section {
          margin-bottom: 32px;
        }
        
        .section-title {
          color: #1e293b;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-label {
          color: #374151;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        .form-input {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(209, 213, 219, 0.6) !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          color: #111827 !important;
          font-size: 0.9rem !important;
          transition: all 0.3s ease !important;
          font-family: 'Inter', sans-serif !important;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05) !important;
        }
        
        .form-input.disabled {
          background: #f8fafc !important;
          color: #64748b !important;
          border-color: #f1f5f9 !important;
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
        
        .form-help {
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        /* ✅ PROFESSIONAL: Submit Button */
        .submit-button {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 14px 32px !important;
          color: white !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.25) !important;
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
        
        /* ✅ PROFESSIONAL: Alerts */
        .success-alert {
          background: rgba(16, 185, 129, 0.1) !important;
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          border-radius: 12px !important;
          color: #065f46 !important;
          font-weight: 600 !important;
          margin-bottom: 24px !important;
        }
        
        .error-alert {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          border-radius: 12px !important;
          color: #991b1b !important;
          font-weight: 600 !important;
          margin-bottom: 24px !important;
        }
        
        /* ✅ PERFECT: Form Footer with Perfect Icon Alignment */
        .form-footer {
          margin-top: 24px;
          padding: 16px;
          background: rgba(59, 130, 246, 0.04);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.1);
          text-align: center;
        }
        
        .form-footer small {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
          line-height: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px; /* Perfect spacing */
        }
        
        /* ✅ PERFECT FIX: Icon alignment in footer */
        .form-footer small svg {
          flex-shrink: 0;
          margin-top: -0.5px; /* Fine-tune vertical alignment */
        }
        
        /* ✅ BEAUTIFUL: Animation Keyframes - Same as Login */
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
          .profile-title { font-size: 1.5rem; }
          .orb-1 { width: 200px; height: 200px; }
          .orb-2 { width: 150px; height: 150px; }
          .orb-3 { width: 120px; height: 120px; }
          .orb-4 { width: 100px; height: 100px; }
        }
      `}</style>
    </>
  );
};

export default Profile;
