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

  const completeness = getProfileCompleteness();

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">👤 Profile Information</h4>
            </Card.Header>
            <Card.Body>
              {/* Profile Completeness */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Profile Completeness</span>
                  <span className="fw-bold">{completeness}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${completeness}%` }}
                    aria-valuenow={completeness} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                {completeness < 100 && (
                  <small className="text-muted">
                    Complete your profile to start booking properties
                  </small>
                )}
              </div>

              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-light"
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode *</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter 6-digit pincode"
                        maxLength="6"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter your state"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Updating Profile...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>

              <div className="mt-4 pt-3 border-top">
                <small className="text-muted">
                  * Required fields. Complete all fields to enable property booking.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
