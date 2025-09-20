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
  const Icon = ({ name, size = 18, className = "" }) => {
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

  // All other functions remain the same...
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
      paddingTop: '100px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ANIMATED GRID BACKGROUND */}
      <div
        style={{
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
        }}
      />

      {/* FLOATING ORBS */}
      <div
        style={{
          position: 'fixed',
          top: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: 1,
        }}
      />

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

          @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col lg={7} xl={6}>
            
            {/* COMPACT HEADER CARD */}
            <Card className="mb-3" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: 'white',
                    marginRight: '12px'
                  }}>
                    <Icon name="sparkles" size={20} />
                  </div>
                  <div>
                    <h4 className="mb-1" style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      fontSize: '1.3rem'
                    }}>
                      Add New Property
                    </h4>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                      List your premium property and connect with verified tenants
                    </p>
                  </div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="trendingUp" size={16} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Progress</span>
                    </div>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: '700',
                      color: '#3b82f6'
                    }}>
                      {getFormProgress()}% Complete
                    </span>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '8px',
                    padding: '3px',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.06)'
                  }}>
                    <div 
                      style={{
                        height: '6px',
                        background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
                        borderRadius: '4px',
                        width: `${getFormProgress()}%`,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 1px 4px rgba(59, 130, 246, 0.3)'
                      }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* COMPACT MAIN FORM CARD */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Card.Body className="p-4">
                
                {/* Compact Alerts */}
                {success && (
                  <Alert variant="success" className="mb-3" style={{ 
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                    color: '#065f46',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        background: '#10b981',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon name="check" size={12} style={{ color: 'white' }} />
                      </div>
                      <div>{success}</div>
                    </div>
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" className="mb-3" style={{ 
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                    color: '#991b1b',
                    padding: '12px 16px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        background: '#ef4444',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon name="x" size={12} style={{ color: 'white' }} />
                      </div>
                      <div>{error}</div>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  
                  {/* COMPACT PROPERTY DETAILS SECTION */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(139, 92, 246, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '20px',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      position: 'relative'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <Icon name="layers" size={16} />
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Property Details
                        </h5>
                      </div>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                              Category *
                            </Form.Label>
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              style={{ 
                                borderRadius: '10px', 
                                border: '2px solid #e5e7eb', 
                                padding: '10px 12px',
                                fontSize: '0.9rem',
                                background: 'rgba(255, 255, 255, 0.9)'
                              }}
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
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                              Subtype {formData.category !== 'Event' && '*'}
                            </Form.Label>
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              style={{ 
                                borderRadius: '10px', 
                                border: '2px solid #e5e7eb', 
                                padding: '10px 12px',
                                fontSize: '0.9rem',
                                background: formData.category ? 'rgba(255, 255, 255, 0.9)' : '#f9fafb'
                              }}
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
                    </div>
                    
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
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
                              borderRadius: '10px', 
                              border: '2px solid #e5e7eb', 
                              padding: '10px 12px',
                              fontSize: '0.9rem',
                              background: 'rgba(255, 255, 255, 0.9)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                            Property Description *
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your property - amenities, location benefits, unique features..."
                            required
                            style={{ 
                              borderRadius: '10px', 
                              border: '2px solid #e5e7eb', 
                              padding: '10px 12px',
                              fontSize: '0.9rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              resize: 'vertical'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                            Price (₹) *
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Monthly/daily rent"
                            min="0"
                            required
                            style={{ 
                              borderRadius: '10px', 
                              border: '2px solid #e5e7eb', 
                              padding: '10px 12px',
                              fontSize: '0.9rem',
                              background: 'rgba(255, 255, 255, 0.9)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
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
                              borderRadius: '10px', 
                              border: '2px solid #e5e7eb', 
                              padding: '10px 12px',
                              fontSize: '0.9rem',
                              background: 'rgba(255, 255, 255, 0.9)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* COMPACT RENT TYPE SECTION */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(5, 150, 105, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      border: '1px solid rgba(16, 185, 129, 0.1)'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <Icon name="sparkles" size={16} />
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Rental Options *
                        </h5>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-2">
                        {formData.category && categories[formData.category]?.rentTypes.map(type => (
                          <div 
                            key={type}
                            style={{
                              background: formData.rentType.includes(type) 
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))'
                                : 'rgba(255, 255, 255, 0.8)',
                              border: formData.rentType.includes(type) 
                                ? '2px solid rgba(16, 185, 129, 0.4)'
                                : '2px solid rgba(156, 163, 175, 0.3)',
                              borderRadius: '12px',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              userSelect: 'none'
                            }}
                            onClick={() => {
                              const value = type;
                              const newRentTypes = formData.rentType.includes(value)
                                ? formData.rentType.filter(t => t !== value)
                                : [...formData.rentType, value];
                              setFormData({
                                ...formData,
                                rentType: newRentTypes
                              });
                            }}
                          >
                            <Form.Check
                              type="checkbox"
                              id={`rentType-${type}`}
                              label={type.charAt(0).toUpperCase() + type.slice(1)}
                              value={type}
                              checked={formData.rentType.includes(type)}
                              onChange={() => {}} // Controlled by div onClick
                              style={{ 
                                fontSize: '0.85rem', 
                                fontWeight: '600',
                                pointerEvents: 'none',
                                color: formData.rentType.includes(type) ? '#065f46' : '#374151'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* COMPACT ADDRESS SECTION */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(37, 99, 235, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.1)'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <Icon name="mapPin" size={16} />
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Location Information
                        </h5>
                      </div>
                      
                      <Form.Group className="mb-3">
                        <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                          Street Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          placeholder="Enter complete street address"
                          style={{ 
                            borderRadius: '10px', 
                            border: '2px solid #e5e7eb', 
                            padding: '10px 12px',
                            fontSize: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.9)'
                          }}
                        />
                      </Form.Group>
                      
                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                              City *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              required
                              style={{ 
                                borderRadius: '10px', 
                                border: '2px solid #e5e7eb', 
                                padding: '10px 12px',
                                fontSize: '0.9rem',
                                background: 'rgba(255, 255, 255, 0.9)'
                              }}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                              State *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleInputChange}
                              placeholder="State"
                              required
                              style={{ 
                                borderRadius: '10px', 
                                border: '2px solid #e5e7eb', 
                                padding: '10px 12px',
                                fontSize: '0.9rem',
                                background: 'rgba(255, 255, 255, 0.9)'
                              }}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
                              Pincode *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleInputChange}
                              placeholder="6-digit"
                              maxLength="6"
                              required
                              style={{ 
                                borderRadius: '10px', 
                                border: '2px solid #e5e7eb', 
                                padding: '10px 12px',
                                fontSize: '0.9rem',
                                background: 'rgba(255, 255, 255, 0.9)'
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* COMPACT CONTACT SECTION */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.06), rgba(239, 68, 68, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid rgba(245, 101, 101, 0.1)'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #f56565, #ef4444)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <Icon name="phone" size={16} />
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Contact Information
                        </h5>
                      </div>
                      
                      <Form.Group>
                        <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '6px' }}>
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
                            borderRadius: '10px', 
                            border: '2px solid #e5e7eb', 
                            padding: '10px 12px',
                            fontSize: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.9)'
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* COMPACT IMAGES SECTION */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.06), rgba(219, 39, 119, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid rgba(236, 72, 153, 0.1)'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <Icon name="image" size={16} />
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Property Gallery *
                        </h5>
                      </div>
                      
                      <div style={{
                        border: '2px dashed rgba(236, 72, 153, 0.3)',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px',
                          color: 'white'
                        }}>
                          <Icon name="upload" size={20} />
                        </div>
                        
                        <h6 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          marginBottom: '8px',
                          fontSize: '1rem'
                        }}>
                          Upload Premium Property Images
                        </h6>
                        
                        <p style={{ 
                          color: '#64748b', 
                          fontSize: '0.8rem', 
                          marginBottom: '16px'
                        }}>
                          Upload up to 5 high-quality images (Max 5MB each)<br/>
                          <span style={{ color: '#ec4899', fontWeight: '600' }}>
                            First image will be used as cover photo
                          </span>
                        </p>
                        
                        <Form.Control
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          disabled={uploadingImages}
                          style={{ 
                            borderRadius: '8px',
                            border: '2px solid rgba(236, 72, 153, 0.2)',
                            padding: '8px',
                            fontSize: '0.85rem',
                            background: 'rgba(255, 255, 255, 0.9)'
                          }}
                        />
                        
                        {uploadingImages && (
                          <div className="mt-3">
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '8px',
                              padding: '6px',
                              marginBottom: '8px'
                            }}>
                              <div 
                                style={{
                                  height: '4px',
                                  background: 'linear-gradient(90deg, #ec4899, #db2777)',
                                  borderRadius: '2px',
                                  width: `${uploadProgress}%`,
                                  transition: 'width 0.3s ease'
                                }}
                              />
                            </div>
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                              Processing... {Math.round(uploadProgress)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {imagePreviews.length > 0 && (
                        <div className="mt-3">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <h6 style={{ 
                              fontWeight: '600', 
                              color: '#1e293b', 
                              fontSize: '0.95rem',
                              margin: 0
                            }}>
                              Uploaded Images
                            </h6>
                            <Badge 
                              style={{
                                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem'
                              }}
                            >
                              {imagePreviews.length}/5
                            </Badge>
                          </div>
                          
                          <Row className="g-2">
                            {imagePreviews.map((preview, index) => (
                              <Col key={preview.id} md={4} sm={6}>
                                <div style={{
                                  position: 'relative',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}>
                                  <img 
                                    src={preview.src} 
                                    alt={`Preview ${index + 1}`} 
                                    style={{ 
                                      width: '100%',
                                      height: '80px', 
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
                                      fontSize: '0.7rem'
                                    }}
                                  >
                                    <Icon name="x" size={10} />
                                  </Button>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* COMPACT VERIFICATION DOCUMENTS SECTION */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(217, 119, 6, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid rgba(245, 158, 11, 0.1)'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <Icon name="document" size={16} />
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Verification Documents
                        </h5>
                      </div>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '8px' }}>
                              Owner Proof * (Aadhar/PAN)
                            </Form.Label>
                            <div style={{
                              border: '2px dashed rgba(245, 158, 11, 0.3)',
                              borderRadius: '10px',
                              padding: '16px',
                              textAlign: 'center',
                              background: 'rgba(255, 255, 255, 0.6)'
                            }}>
                              <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 8px',
                                color: 'white'
                              }}>
                                <Icon name="document" size={14} />
                              </div>
                              <p className="mb-2" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                PDF or Image (Max 5MB)
                              </p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleOwnerProofChange}
                                style={{ 
                                  borderRadius: '6px', 
                                  fontSize: '0.75rem',
                                  padding: '6px'
                                }}
                              />
                            </div>
                            {ownerProofPreview && (
                              <div className="mt-2 p-2" style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                              }}>
                                <div className="d-flex align-items-center gap-2">
                                  <Icon name="check" size={12} style={{ color: '#16a34a' }} />
                                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
                                    {ownerProofPreview.name}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '8px' }}>
                              Property Proof * (Bill/Document)
                            </Form.Label>
                            <div style={{
                              border: '2px dashed rgba(245, 158, 11, 0.3)',
                              borderRadius: '10px',
                              padding: '16px',
                              textAlign: 'center',
                              background: 'rgba(255, 255, 255, 0.6)'
                            }}>
                              <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 8px',
                                color: 'white'
                              }}>
                                <Icon name="document" size={14} />
                              </div>
                              <p className="mb-2" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Electricity Bill, etc. (Max 5MB)
                              </p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handlePropertyProofChange}
                                style={{ 
                                  borderRadius: '6px', 
                                  fontSize: '0.75rem',
                                  padding: '6px'
                                }}
                              />
                            </div>
                            {propertyProofPreview && (
                              <div className="mt-2 p-2" style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                              }}>
                                <div className="d-flex align-items-center gap-2">
                                  <Icon name="check" size={12} style={{ color: '#16a34a' }} />
                                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>
                                    {propertyProofPreview.name}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* COMPACT SUBMIT BUTTON */}
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingImages}
                      style={{
                        background: loading 
                          ? '#9ca3af' 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '12px 32px',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        minWidth: '180px',
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <div className="d-flex align-items-center gap-2">
                          <Spinner animation="border" size="sm" />
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <Icon name="upload" size={16} />
                          <span>Add Property to Platform</span>
                        </div>
                      )}
                    </Button>
                    
                    <div style={{
                      marginTop: '16px',
                      padding: '12px 16px',
                      background: 'rgba(99, 102, 241, 0.05)',
                      borderRadius: '10px',
                      border: '1px solid rgba(99, 102, 241, 0.1)'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem',
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        🔒 By submitting, you agree to our{' '}
                        <span style={{ color: '#6366f1', fontWeight: '600' }}>terms and conditions</span>
                        <br/>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Your information is secure and encrypted
                        </span>
                      </p>
                    </div>
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
