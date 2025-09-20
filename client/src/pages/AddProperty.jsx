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

  // Clean, Professional SVG Icons Component
  const Icon = ({ name, size = 20, className = "" }) => {
    const icons = {
      home: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      upload: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,5 17,10"/>
          <line x1="12" y1="5" x2="12" y2="15"/>
        </svg>
      ),
      image: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      document: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M14,2 L20,8 L20,20 C20,21.1 19.1,22 18,22 L6,22 C4.9,22 4,21.1 4,20 L4,4 C4,2.9 4.9,2 6,2 L14,2 Z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      layers: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polygon points="12,2 2,7 12,12 22,7 12,2"/>
          <polyline points="2,17 12,22 22,17"/>
          <polyline points="2,12 12,17 22,12"/>
        </svg>
      ),
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      ),
      trendingUp: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
          <polyline points="16,7 22,7 22,13"/>
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '40px'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            
            {/* Header Card - Theme Consistent */}
            <Card className="mb-4" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: 'white',
                    marginRight: '16px'
                  }}>
                    <Icon name="home" size={24} />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ fontWeight: '700', color: '#1e293b', fontSize: '1.4rem' }}>
                      Add New Property
                    </h3>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                      List your premium property and connect with thousands of verified tenants
                    </p>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <Icon name="trendingUp" size={16} />
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Progress</span>
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6' }}>
                    {getFormProgress()}% Complete
                  </span>
                </div>
                <ProgressBar 
                  now={getFormProgress()} 
                  style={{ height: '6px', borderRadius: '3px' }}
                  variant="primary"
                />
              </Card.Body>
            </Card>

            {/* Main Form Card */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}>
              <Card.Body className="p-4">
                
                {/* Alerts */}
                {success && (
                  <Alert variant="success" className="mb-3" style={{ borderRadius: '12px' }}>
                    <Icon name="check" size={16} className="me-2" />
                    {success}
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" className="mb-3" style={{ borderRadius: '12px' }}>
                    <Icon name="x" size={16} className="me-2" />
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  
                  {/* Property Details Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="layers" size={18} />
                      Property Details
                    </h5>
                    
                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            Category *
                          </Form.Label>
                          <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          >
                            <option value="">Select Category</option>
                            {Object.keys(categories).map(category => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            Subtype {formData.category !== 'Event' && '*'}
                          </Form.Label>
                          <Form.Select
                            name="subtype"
                            value={formData.subtype}
                            onChange={handleInputChange}
                            disabled={!formData.category}
                            required={formData.category !== 'Event'}
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          >
                            <option value="">Select Subtype</option>
                            {formData.category && categories[formData.category]?.subtypes.map(subtype => (
                              <option key={subtype} value={subtype}>
                                {subtype}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        Property Title *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter an attractive property title"
                        required
                        style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        Property Description *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your property in detail - amenities, location benefits, unique features..."
                        required
                        style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                      />
                    </Form.Group>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
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
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            Size/Capacity *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            placeholder="e.g., 1000 sq ft, 2 BHK, 50 people"
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Rent Type Section */}
                  <div className="mb-4">
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        Rent Type *
                      </Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {formData.category && categories[formData.category]?.rentTypes.map(type => (
                          <div key={type}>
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
                              style={{ fontSize: '0.9rem' }}
                            />
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  </div>

                  {/* Address Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="mapPin" size={18} />
                      Address Information
                    </h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        Street Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Enter complete street address"
                        style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                      />
                    </Form.Group>
                    
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            City *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            State *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            placeholder="Enter state"
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
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
                            style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Contact Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="phone" size={18} />
                      Contact Information
                    </h5>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        Contact Details *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="Enter phone number or email"
                        required
                        style={{ borderRadius: '12px', border: '2px solid #e5e7eb', padding: '12px' }}
                      />
                    </Form.Group>
                  </div>

                  {/* Images Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="image" size={18} />
                      Upload Property Images *
                    </h5>
                    
                    <div style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '2rem',
                      textAlign: 'center',
                      background: '#f9fafb'
                    }}>
                      <Icon name="upload" size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                      <h6 className="mt-2 mb-2" style={{ fontWeight: '600', color: '#374151' }}>
                        Upload Property Images
                      </h6>
                      <p className="mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
                        Upload up to 5 high-quality images (Max 5MB each)
                      </p>
                      
                      <Form.Control
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={uploadingImages}
                        style={{ borderRadius: '8px' }}
                      />
                      
                      {uploadingImages && (
                        <div className="mt-3">
                          <ProgressBar 
                            now={uploadProgress} 
                            label={`${Math.round(uploadProgress)}%`}
                            style={{ height: '6px' }}
                          />
                          <small className="text-muted mt-2 d-block">Processing images...</small>
                        </div>
                      )}
                    </div>
                    
                    {imagePreviews.length > 0 && (
                      <div className="mt-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 style={{ fontWeight: '600', color: '#374151' }}>
                            Uploaded Images
                          </h6>
                          <Badge bg="primary">
                            {imagePreviews.length}/5 images
                          </Badge>
                        </div>
                        
                        <Row className="g-2">
                          {imagePreviews.map((preview, index) => (
                            <Col key={preview.id} md={4} sm={6}>
                              <div style={{
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                              }}>
                                <img 
                                  src={preview.src} 
                                  alt={`Property Preview ${index + 1}`} 
                                  style={{ 
                                    width: '100%',
                                    height: '120px', 
                                    objectFit: 'cover'
                                  }}
                                />
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 m-2"
                                  onClick={() => removeImage(index)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0
                                  }}
                                >
                                  <Icon name="x" size={12} />
                                </Button>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Verification Documents Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="document" size={18} />
                      Verification Documents
                    </h5>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            Owner Proof * (Aadhar/PAN Card)
                          </Form.Label>
                          <div style={{
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            padding: '1rem',
                            textAlign: 'center',
                            background: '#f9fafb'
                          }}>
                            <Icon name="document" size={24} />
                            <p className="mt-1 mb-2 text-muted" style={{ fontSize: '0.8rem' }}>
                              Upload PDF or Image (Max 5MB)
                            </p>
                            <Form.Control
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleOwnerProofChange}
                              style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                            />
                          </div>
                          {ownerProofPreview && (
                            <div className="mt-2 p-2" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '6px',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}>
                              <div className="d-flex align-items-center gap-2">
                                <Icon name="check" size={14} />
                                <strong style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                                  {ownerProofPreview.name}
                                </strong>
                              </div>
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                            Property Proof * (Bill/Document)
                          </Form.Label>
                          <div style={{
                            border: '2px dashed #d1d5db',
                            borderRadius: '8px',
                            padding: '1rem',
                            textAlign: 'center',
                            background: '#f9fafb'
                          }}>
                            <Icon name="document" size={24} />
                            <p className="mt-1 mb-2 text-muted" style={{ fontSize: '0.8rem' }}>
                              Electricity Bill, Tax Receipt, etc. (Max 5MB)
                            </p>
                            <Form.Control
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handlePropertyProofChange}
                              style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                            />
                          </div>
                          {propertyProofPreview && (
                            <div className="mt-2 p-2" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '6px',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}>
                              <div className="d-flex align-items-center gap-2">
                                <Icon name="check" size={14} />
                                <strong style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                                  {propertyProofPreview.name}
                                </strong>
                              </div>
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingImages}
                      style={{
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '0.75rem 2rem',
                        fontWeight: '600',
                        fontSize: '1rem',
                        minWidth: '160px'
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Adding Property...
                        </>
                      ) : (
                        <>
                          <Icon name="upload" size={18} className="me-2" />
                          Add Property to Platform
                        </>
                      )}
                    </Button>
                    
                    <p className="mt-2 text-muted" style={{ fontSize: '0.8rem' }}>
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
