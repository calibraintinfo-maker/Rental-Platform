import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api, handleApiError, categories, convertImageToBase64 } from '../utils/api';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    category: '',
    subtype: '',
    title: '',
    description: '',
    price: '',
    size: '',
    rentType: [],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    contact: '',
    images: [],
    ownerProof: null,
    propertyProof: null
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ownerProofPreview, setOwnerProofPreview] = useState(null);
  const [propertyProofPreview, setPropertyProofPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  // Professional SVG Icons Component
  const Icon = ({ name, size = 20 }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      upload: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,5 17,10"/>
          <line x1="12" y1="5" x2="12" y2="15"/>
        </svg>
      ),
      image: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      document: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14,2 L20,8 L20,20 C20,21.1 19.1,22 18,22 L6,22 C4.9,22 4,21.1 4,20 L4,4 C4,2.9 4.9,2 6,2 L14,2 Z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      alert: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <triangle points="7.86 2 16.14 2 22 16.14 2 16.14"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  // Utility to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleOwnerProofChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setError('Owner proof must be an image or PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Owner proof file is too large (max 5MB)');
      return;
    }

    const base64 = await convertFileToBase64(file);
    setFormData({ ...formData, ownerProof: base64 });
    setOwnerProofPreview({ name: file.name, src: base64, type: file.type });
    setError('');
  };

  const handlePropertyProofChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setError('Property proof must be an image or PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Property proof file is too large (max 5MB)');
      return;
    }

    const base64 = await convertFileToBase64(file);
    setFormData({ ...formData, propertyProof: base64 });
    setPropertyProofPreview({ name: file.name, src: base64, type: file.type });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else if (name === 'rentType') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({
        ...formData,
        rentType: selectedOptions
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subtype: '',
        rentType: categories[value]?.rentTypes || []
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    setUploadingImages(true);
    setUploadProgress(0);

    try {
      const newImages = [];
      const newPreviews = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          setUploadingImages(false);
          return;
        }

        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image.`);
          setUploadingImages(false);
          return;
        }

        const base64 = await convertImageToBase64(file);
        newImages.push(base64);
        newPreviews.push({
          id: Date.now() + Math.random(),
          src: base64,
          name: file.name
        });

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setError('');
    } catch (error) {
      setError('Error processing images. Please try again.');
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      images: newImages
    });
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.size.trim()) {
      setError('Size is required');
      return false;
    }
    if (formData.rentType.length === 0) {
      setError('Please select at least one rent type');
      return false;
    }
    if (!formData.address.city.trim() || !formData.address.state.trim() || !formData.address.pincode.trim()) {
      setError('City, state, and pincode are required');
      return false;
    }
    if (!/^\d{6}$/.test(formData.address.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    if (!formData.contact.trim()) {
      setError('Contact information is required');
      return false;
    }
    if (formData.images.length === 0) {
      setError('Please upload at least one property image');
      return false;
    }
    if (!formData.ownerProof) {
      setError('Please upload owner proof (Aadhar or PAN card)');
      return false;
    }
    if (!formData.propertyProof) {
      setError('Please upload property proof (Electricity Bill, Water Bill, Tax Receipt, or Lease Agreement)');
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
      const response = await api.properties.create(formData);
      setSuccess('Property added successfully! Redirecting to manage properties...');
      
      setTimeout(() => {
        navigate('/manage-properties');
      }, 2000);
    } catch (error) {
      console.error('Error adding property:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getFormProgress = () => {
    let progress = 0;
    const fields = [
      formData.category,
      formData.title,
      formData.description,
      formData.price,
      formData.size,
      formData.rentType.length > 0,
      formData.address.city,
      formData.address.state,
      formData.address.pincode,
      formData.contact,
      formData.images.length > 0,
      formData.ownerProof,
      formData.propertyProof
    ];
    
    const completedFields = fields.filter(field => field).length;
    progress = (completedFields / fields.length) * 100;
    return Math.round(progress);
  };

  return (
    <div style={{ 
      background: `
        linear-gradient(135deg, 
          rgba(102, 126, 234, 0.9) 0%, 
          rgba(118, 75, 162, 0.9) 50%,
          rgba(255, 107, 107, 0.9) 100%
        ),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.3) 0%, transparent 50%),
        linear-gradient(45deg, #f0f2ff 0%, #e8f1ff 100%)
      `,
      minHeight: '100vh',
      paddingTop: '60px',
      paddingBottom: '20px',
      position: 'relative'
    }}>
      {/* Floating geometric shapes for depth */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '5%',
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: 'float 8s ease-in-out infinite reverse',
        transform: 'rotate(45deg)'
      }} />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          }
          
          .dropdown-fix {
            position: relative !important;
            z-index: 10 !important;
          }
          
          .dropdown-fix .dropdown-menu {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            max-height: 200px !important;
            overflow-y: auto !important;
            background: white !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
            margin-top: 2px !important;
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }} className="py-2">
        <Row className="justify-content-center">
          <Col lg={7} xl={6}>
            {/* Compact Header Card */}
            <Card className="mb-3 border-0" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body style={{ padding: '1.25rem' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '10px',
                      padding: '8px',
                      color: 'white'
                    }}>
                      <Icon name="home" size={22} />
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ 
                        fontWeight: '700', 
                        color: '#1a202c',
                        fontSize: '1.4rem',
                        letterSpacing: '-0.02em'
                      }}>
                        Add New Property
                      </h4>
                      <p className="mb-0" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        List your property and reach thousands of potential tenants
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#667eea' }}>
                      {getFormProgress()}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Complete</div>
                  </div>
                </div>
                
                <ProgressBar 
                  now={getFormProgress()} 
                  className="mt-2"
                  style={{ 
                    height: '5px', 
                    borderRadius: '3px',
                    background: 'rgba(102, 126, 234, 0.15)' 
                  }}
                />
              </Card.Body>
            </Card>

            {/* Main Form Card - Super Compact */}
            <Card className="border-0" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body style={{ padding: '1.5rem' }}>
                {success && (
                  <Alert variant="success" className="mb-2" style={{ 
                    borderRadius: '8px', 
                    border: 'none',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderLeft: '3px solid #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.85rem'
                  }}>
                    <Icon name="check" size={14} />
                    <strong>{success}</strong>
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-2" style={{ 
                    borderRadius: '8px', 
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderLeft: '3px solid #ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.85rem'
                  }}>
                    <Icon name="alert" size={14} />
                    <strong>{error}</strong>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Property Details Section - Super Compact */}
                  <div className="mb-2">
                    <h6 style={{ 
                      fontWeight: '700', 
                      color: '#1a202c', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '1rem'
                    }}>
                      <Icon name="home" size={16} />
                      Property Details
                    </h6>
                    
                    <Row className="g-2 mb-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Category *
                          </Form.Label>
                          <div className="dropdown-fix">
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              size="sm"
                              style={{
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                padding: '0.4rem 0.6rem',
                                fontSize: '0.85rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                height: '35px'
                              }}
                            >
                              <option value="">Select Category</option>
                              {Object.keys(categories).map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Subtype {formData.category !== 'Event' && '*'}
                          </Form.Label>
                          <div className="dropdown-fix">
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              size="sm"
                              style={{
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                padding: '0.4rem 0.6rem',
                                fontSize: '0.85rem',
                                background: formData.category ? 'rgba(255, 255, 255, 0.9)' : '#f3f4f6',
                                height: '35px'
                              }}
                            >
                              <option value="">Select Subtype</option>
                              {formData.category && categories[formData.category]?.subtypes.map(subtype => (
                                <option key={subtype} value={subtype}>
                                  {subtype}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        Property Title *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter an attractive property title"
                        required
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.85rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '35px'
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        Property Description *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your property in detail - amenities, location benefits, unique features..."
                        required
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.85rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          resize: 'vertical'
                        }}
                      />
                    </Form.Group>

                    <Row className="g-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Price (₹) *
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter monthly/daily rent"
                            min="0"
                            required
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.85rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '35px'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Size/Capacity *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            placeholder="e.g., 1000 sq ft, 2 BHK, 50 people"
                            required
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.85rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '35px'
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Rent Type Section - Compact */}
                  <div className="mb-2">
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                        Rent Type *
                      </Form.Label>
                      <div className="d-flex flex-wrap gap-1">
                        {formData.category && categories[formData.category]?.rentTypes.map(type => (
                          <div key={type} style={{
                            background: formData.rentType.includes(type) ? 'rgba(102, 126, 234, 0.1)' : 'rgba(248, 250, 252, 0.9)',
                            border: formData.rentType.includes(type) ? '1px solid #667eea' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}>
                            <Form.Check
                              type="checkbox"
                              id={`rentType-${type}`}
                              label={type.charAt(0).toUpperCase() + type.slice(1)}
                              value={type}
                              checked={formData.rentType.includes(type)}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newRentTypes = e.target.checked
                                  ? [...formData.rentType, value]
                                  : formData.rentType.filter(t => t !== value);
                                setFormData({
                                  ...formData,
                                  rentType: newRentTypes
                                });
                              }}
                              style={{ fontSize: '0.8rem' }}
                            />
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  </div>

                  {/* Address Section - Compact */}
                  <div className="mb-2">
                    <h6 style={{ 
                      fontWeight: '700', 
                      color: '#1a202c', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '1rem'
                    }}>
                      <Icon name="mapPin" size={16} />
                      Address Information
                    </h6>

                    <Form.Group className="mb-2">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        Street Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Enter complete street address"
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.85rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '35px'
                        }}
                      />
                    </Form.Group>

                    <Row className="g-2">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            City *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                            required
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.85rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '35px'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            State *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            placeholder="Enter state"
                            required
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.85rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '35px'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Pincode *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address.pincode"
                            value={formData.address.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit pincode"
                            maxLength="6"
                            required
                            style={{
                              borderRadius: '6px',
                              border: '1px solid #e5e7eb',
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.85rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '35px'
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Contact Section - Compact */}
                  <div className="mb-2">
                    <h6 style={{ 
                      fontWeight: '700', 
                      color: '#1a202c', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '1rem'
                    }}>
                      <Icon name="phone" size={16} />
                      Contact Information
                    </h6>

                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        Contact Details *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="Enter phone number or email"
                        required
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.85rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '35px'
                        }}
                      />
                    </Form.Group>
                  </div>

                  {/* Images Section - Compact */}
                  <div className="mb-2">
                    <h6 style={{ 
                      fontWeight: '700', 
                      color: '#1a202c', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '1rem'
                    }}>
                      <Icon name="image" size={16} />
                      Property Images *
                    </h6>

                    <div style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '8px',
                      padding: '1rem',
                      textAlign: 'center',
                      background: 'rgba(249, 250, 251, 0.9)'
                    }}>
                      <Icon name="upload" size={28} />
                      <h6 className="mt-1 mb-1" style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        Upload Property Images
                      </h6>
                      <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
                        Upload up to 5 high-quality images (Max 5MB each)
                      </p>
                      
                      <Form.Control
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={uploadingImages}
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          fontSize: '0.8rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '35px'
                        }}
                      />

                      {uploadingImages && (
                        <div className="mt-2">
                          <ProgressBar 
                            now={uploadProgress} 
                            label={`${Math.round(uploadProgress)}%`}
                            style={{ height: '4px' }}
                          />
                          <small className="text-muted mt-1 d-block" style={{ fontSize: '0.75rem' }}>Processing images...</small>
                        </div>
                      )}
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="mt-2">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h6 style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem' }}>
                            Uploaded Images
                          </h6>
                          <Badge 
                            bg="primary" 
                            style={{ 
                              padding: '0.3rem 0.6rem',
                              borderRadius: '5px',
                              fontSize: '0.75rem'
                            }}
                          >
                            {imagePreviews.length}/5 images
                          </Badge>
                        </div>
                        
                        <Row className="g-1">
                          {imagePreviews.map((preview, index) => (
                            <Col key={preview.id} md={4} sm={6}>
                              <div style={{
                                position: 'relative',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                background: 'white',
                                border: '1px solid #e5e7eb'
                              }}>
                                <img 
                                  src={preview.src} 
                                  alt={`Property Preview ${index + 1}`} 
                                  style={{ 
                                    width: '100%',
                                    height: '100px', 
                                    objectFit: 'cover'
                                  }}
                                />
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 m-1"
                                  onClick={() => removeImage(index)}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    fontSize: '0.6rem'
                                  }}
                                >
                                  <Icon name="x" size={10} />
                                </Button>
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                                  color: 'white',
                                  padding: '0.5rem 0.3rem 0.3rem',
                                  fontSize: '0.7rem',
                                  fontWeight: '500'
                                }}>
                                  Image {index + 1}
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Proof Documents Section - PERFECT ALIGNMENT */}
                  <div className="mb-2">
                    <h6 style={{ 
                      fontWeight: '700', 
                      color: '#1a202c', 
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '1rem'
                    }}>
                      <Icon name="document" size={16} />
                      Verification Documents
                    </h6>

                    <Row className="g-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Owner Proof * (Aadhar/PAN Card)
                          </Form.Label>
                          <div style={{
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            textAlign: 'center',
                            background: 'rgba(249, 250, 251, 0.9)',
                            height: '100px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Icon name="document" size={20} />
                            <p className="mt-1 mb-1" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Upload PDF or Image (Max 5MB)
                            </p>
                            <Form.Control
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleOwnerProofChange}
                              style={{
                                borderRadius: '5px',
                                fontSize: '0.75rem',
                                height: '30px'
                              }}
                            />
                          </div>
                          {ownerProofPreview && (
                            <div className="mt-1 p-1" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '5px',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}>
                              <div className="d-flex align-items-center gap-1">
                                <Icon name="check" size={12} />
                                <strong style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                                  {ownerProofPreview.name}
                                </strong>
                              </div>
                              {ownerProofPreview.type.startsWith('image/') && (
                                <img 
                                  src={ownerProofPreview.src} 
                                  alt="Owner Proof Preview" 
                                  style={{ 
                                    maxWidth: '60px', 
                                    maxHeight: '60px', 
                                    marginTop: '4px',
                                    borderRadius: '4px',
                                    border: '1px solid #e5e7eb'
                                  }} 
                                />
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            Property Proof * (Bill/Document)
                          </Form.Label>
                          <div style={{
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            textAlign: 'center',
                            background: 'rgba(249, 250, 251, 0.9)',
                            height: '100px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Icon name="document" size={20} />
                            <p className="mt-1 mb-1" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Electricity Bill, Tax Receipt, etc. (Max 5MB)
                            </p>
                            <Form.Control
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handlePropertyProofChange}
                              style={{
                                borderRadius: '5px',
                                fontSize: '0.75rem',
                                height: '30px'
                              }}
                            />
                          </div>
                          {propertyProofPreview && (
                            <div className="mt-1 p-1" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '5px',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}>
                              <div className="d-flex align-items-center gap-1">
                                <Icon name="check" size={12} />
                                <strong style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                                  {propertyProofPreview.name}
                                </strong>
                              </div>
                              {propertyProofPreview.type.startsWith('image/') && (
                                <img 
                                  src={propertyProofPreview.src} 
                                  alt="Property Proof Preview" 
                                  style={{ 
                                    maxWidth: '60px', 
                                    maxHeight: '60px', 
                                    marginTop: '4px',
                                    borderRadius: '4px',
                                    border: '1px solid #e5e7eb'
                                  }} 
                                />
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center mt-3">
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingImages}
                      style={{
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.6rem 2rem',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        minWidth: '150px',
                        justifyContent: 'center'
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          Adding Property...
                        </>
                      ) : (
                        <>
                          <Icon name="upload" size={16} />
                          Add Property
                        </>
                      )}
                    </Button>
                    
                    <p className="mt-1" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      By submitting, you agree to our terms and conditions
                    </p>
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

export default AddProperty;
