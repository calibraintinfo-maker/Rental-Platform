import React, { useState, useEffect } from 'react';
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
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* ANIMATED GRID BACKGROUND - Same as Login Page */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 1,
      }} />

      {/* Floating Orbs - Reduced and More Subtle */}
      <div style={{
        position: 'fixed',
        top: '15%',
        right: '8%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(128, 90, 213, 0.06), transparent)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06), transparent)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 1,
      }} />

      <style>
        {`
          @keyframes gridMove {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(25px) translateY(0); }
            50% { transform: translateX(25px) translateY(25px); }
            75% { transform: translateX(0) translateY(25px); }
            100% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.02); }
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col xl={6} lg={8} md={10}>  {/* REDUCED CARD SIZE */}
            
            {/* Header Card - Smaller */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '20px'  // Reduced margin
            }}>
              <Card.Body className="p-3">  {/* Reduced padding */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '14px',  // Slightly smaller
                    padding: '10px',      // Reduced padding
                    color: 'white'
                  }}>
                    <Icon name="user" size={20} />  {/* Smaller icon */}
                  </div>
                  <div>
                    <h2 style={{ 
                      fontWeight: '800', 
                      color: '#1e293b', 
                      margin: 0,
                      fontSize: '1.6rem',  // Smaller font
                      background: 'linear-gradient(135deg, #1e293b, #475569)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Profile Information
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>  {/* Smaller text */}
                      Manage your personal information and settings
                    </p>
                  </div>
                </div>

                {/* Profile Completeness - Compact */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.04))',
                  borderRadius: '12px',
                  padding: '14px',  // Reduced padding
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>Profile Completeness</span>
                    <span style={{ 
                      fontWeight: '800', 
                      fontSize: '1rem',  // Smaller
                      color: completeness === 100 ? '#10b981' : '#f59e0b'
                    }}>
                      {completeness}%
                    </span>
                  </div>
                  <div style={{
                    background: '#e2e8f0',
                    borderRadius: '8px',  // Smaller radius
                    height: '6px',        // Thinner
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        width: `${completeness}%`,
                        height: '100%',
                        background: completeness === 100 
                          ? 'linear-gradient(90deg, #34d399, #10b981)' 
                          : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  {completeness < 100 && (
                    <p style={{ 
                      margin: '6px 0 0 0',  // Reduced margin
                      color: '#64748b',
                      fontSize: '0.8rem',   // Smaller
                      fontWeight: '500'
                    }}>
                      <Icon name="alertCircle" size={12} style={{ marginRight: '4px', color: '#f59e0b' }} />
                      Complete profile to start booking properties
                    </p>
                  )}
                  {completeness === 100 && (
                    <p style={{ 
                      margin: '6px 0 0 0', 
                      color: '#10b981',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      <Icon name="check" size={12} style={{ marginRight: '4px' }} />
                      Profile complete! You can now book properties
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Main Form Card - Smaller */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body className="p-3">  {/* Reduced padding */}
                
                {/* Alerts - Compact */}
                {success && (
                  <Alert 
                    variant="success" 
                    style={{
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                      marginBottom: '20px',  // Reduced margin
                      padding: '12px'        // Reduced padding
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="check" size={16} style={{ color: '#10b981' }} />
                      <span style={{ color: '#065f46', fontWeight: '600', fontSize: '0.9rem' }}>{success}</span>
                    </div>
                  </Alert>
                )}
                
                {error && (
                  <Alert 
                    variant="danger" 
                    style={{
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                      marginBottom: '20px',
                      padding: '12px'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="alertCircle" size={16} style={{ color: '#ef4444' }} />
                      <span style={{ color: '#991b1b', fontWeight: '600', fontSize: '0.9rem' }}>{error}</span>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  
                  {/* Personal Information Section - Compact */}
                  <div style={{ marginBottom: '24px' }}>  {/* Reduced margin */}
                    <h5 style={{
                      color: '#1e293b',
                      fontWeight: '700',
                      marginBottom: '16px',  // Reduced margin
                      paddingBottom: '6px',  // Reduced padding
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '1rem'       // Smaller font
                    }}>
                      Personal Information
                    </h5>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <Icon name="user" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                            Full Name *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            style={{
                              borderRadius: '10px',  // Smaller radius
                              border: '2px solid #e2e8f0',
                              padding: '10px 14px',  // Reduced padding
                              fontSize: '0.9rem',    // Smaller font
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e2e8f0';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <Icon name="mail" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                            Email Address
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={user?.email || ''}
                            disabled
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #f1f5f9',
                              padding: '10px 14px',
                              fontSize: '0.9rem',
                              background: '#f8fafc',
                              color: '#64748b'
                            }}
                          />
                          <Form.Text style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '500' }}>
                            Email cannot be changed for security reasons
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Contact Information Section - Compact */}
                  <div style={{ marginBottom: '24px' }}>
                    <h5 style={{
                      color: '#1e293b',
                      fontWeight: '700',
                      marginBottom: '16px',
                      paddingBottom: '6px',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '1rem'
                    }}>
                      Contact Information
                    </h5>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <Icon name="phone" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                            Contact Number *
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit mobile number"
                            maxLength="10"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #e2e8f0',
                              padding: '10px 14px',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e2e8f0';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <Icon name="mapPin" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                            Pincode *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit pincode"
                            maxLength="6"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #e2e8f0',
                              padding: '10px 14px',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e2e8f0';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Address Information Section - Compact */}
                  <div style={{ marginBottom: '24px' }}>
                    <h5 style={{
                      color: '#1e293b',
                      fontWeight: '700',
                      marginBottom: '16px',
                      paddingBottom: '6px',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '1rem'
                    }}>
                      Address Information
                    </h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                        <Icon name="home" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                        Address *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}  {/* Reduced rows */}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your complete address"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          padding: '10px 14px',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease',
                          resize: 'vertical'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <Icon name="mapPin" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                            City *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter your city"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #e2e8f0',
                              padding: '10px 14px',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e2e8f0';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>
                            <Icon name="mapPin" size={14} style={{ marginRight: '4px', color: '#64748b' }} />
                            State *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter your state"
                            style={{
                              borderRadius: '10px',
                              border: '2px solid #e2e8f0',
                              padding: '10px 14px',
                              fontSize: '0.9rem',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#3b82f6';
                              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e2e8f0';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Submit Button - Compact */}
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={loading}
                      style={{
                        background: loading 
                          ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                          : 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        borderRadius: '10px',  // Smaller radius
                        fontWeight: '700',
                        fontSize: '0.95rem',   // Smaller font
                        padding: '12px 28px',  // Reduced padding
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
                        }
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <Icon name="edit" size={16} />
                        <span>{loading ? 'Updating Profile...' : 'Update Profile'}</span>
                      </div>
                    </Button>
                  </div>

                  {/* Footer Note - Compact */}
                  <div style={{
                    marginTop: '20px',  // Reduced margin
                    padding: '12px',    // Reduced padding
                    background: 'rgba(59, 130, 246, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    textAlign: 'center'
                  }}>
                    <small style={{ 
                      color: '#64748b',
                      fontSize: '0.8rem',   // Smaller font
                      fontWeight: '500',
                      lineHeight: '1.4'
                    }}>
                      <Icon name="alertCircle" size={12} style={{ marginRight: '4px', color: '#3b82f6' }} />
                      Fields marked with * are required. Complete all fields to enable property booking.
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
