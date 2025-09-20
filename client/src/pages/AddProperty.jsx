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
      paddingTop: '120px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ANIMATED GRID BACKGROUND - EXACTLY LIKE LOGIN */}
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
          top: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 90, 213, 0.1), transparent)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '15%',
          left: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent)',
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
            50% { transform: translateY(-20px) scale(1.05); }
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            
            {/* RICH HEADER CARD */}
            <Card className="mb-4" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '16px',
                    padding: '16px',
                    color: 'white',
                    marginRight: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `
                        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%),
                        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)
                      `
                    }} />
                    <Icon name="sparkles" size={28} style={{ position: 'relative', zIndex: 1 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="mb-2" style={{ 
                      fontWeight: '800', 
                      color: '#1e293b', 
                      fontSize: '1.8rem',
                      background: 'linear-gradient(135deg, #1e293b, #475569)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Add New Property
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                      List your premium property and connect with thousands of verified tenants across India
                    </p>
                  </div>
                </div>
                
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="trendingUp" size={20} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '1rem', color: '#475569', fontWeight: '600' }}>Form Progress</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Icon name="sparkles" size={16} style={{ color: '#f59e0b' }} />
                      <span style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '800',
                        color: '#3b82f6'
                      }}>
                        {getFormProgress()}% Complete
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    padding: '6px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}>
                    <div 
                      style={{
                        height: '12px',
                        background: `linear-gradient(90deg, 
                          ${getFormProgress() > 25 ? '#10b981' : '#e5e7eb'} 25%, 
                          ${getFormProgress() > 50 ? '#3b82f6' : '#e5e7eb'} 50%, 
                          ${getFormProgress() > 75 ? '#8b5cf6' : '#e5e7eb'} 75%, 
                          ${getFormProgress() > 90 ? '#f59e0b' : '#e5e7eb'} 100%)`,
                        borderRadius: '8px',
                        width: `${getFormProgress()}%`,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                      }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* RICH MAIN FORM CARD */}
            <Card style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px'
            }}>
              <Card.Body className="p-5">
                
                {/* Enhanced Alerts */}
                {success && (
                  <Alert variant="success" className="mb-4" style={{ 
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                    color: '#065f46',
                    padding: '20px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        background: '#10b981',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon name="check" size={18} style={{ color: 'white' }} />
                      </div>
                      <div>{success}</div>
                    </div>
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger" className="mb-4" style={{ 
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                    color: '#991b1b',
                    padding: '20px 24px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)'
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        background: '#ef4444',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon name="x" size={18} style={{ color: 'white' }} />
                      </div>
                      <div>{error}</div>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  
                  {/* ENHANCED PROPERTY DETAILS SECTION */}
                  <div className="mb-5">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05))',
                      borderRadius: '20px',
                      padding: '24px',
                      marginBottom: '32px',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientFlow 3s ease-in-out infinite'
                      }} />
                      
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          borderRadius: '12px',
                          padding: '12px',
                          color: 'white'
                        }}>
                          <Icon name="layers" size={20} />
                        </div>
                        <h4 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.3rem'
                        }}>
                          Property Details
                        </h4>
                      </div>
                      
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                              Category *
                            </Form.Label>
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              style={{ 
                                borderRadius: '12px', 
                                border: '2px solid #e5e7eb', 
                                padding: '14px 16px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
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
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                              Subtype {formData.category !== 'Event' && '*'}
                            </Form.Label>
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              style={{ 
                                borderRadius: '12px', 
                                border: '2px solid #e5e7eb', 
                                padding: '14px 16px',
                                fontSize: '1rem',
                                background: formData.category ? 'rgba(255, 255, 255, 0.9)' : '#f9fafb',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => {
                                if (formData.category) {
                                  e.target.style.borderColor = '#6366f1';
                                  e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                                }
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
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
                    
                    <Row className="g-4">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                            Property Title *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter an attractive, descriptive property title"
                            required
                            style={{ 
                              borderRadius: '12px', 
                              border: '2px solid #e5e7eb', 
                              padding: '14px 16px',
                              fontSize: '1rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#6366f1';
                              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                            Property Description *
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your property in detail - amenities, location benefits, unique features, nearby facilities..."
                            required
                            style={{ 
                              borderRadius: '12px', 
                              border: '2px solid #e5e7eb', 
                              padding: '14px 16px',
                              fontSize: '1rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              transition: 'all 0.2s ease',
                              resize: 'vertical',
                              minHeight: '120px'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#6366f1';
                              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                            Price (₹) *
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter monthly/daily rent amount"
                            min="0"
                            required
                            style={{ 
                              borderRadius: '12px', 
                              border: '2px solid #e5e7eb', 
                              padding: '14px 16px',
                              fontSize: '1rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#6366f1';
                              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                            Size/Capacity *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            placeholder="e.g., 1000 sq ft, 2 BHK, 50 people capacity"
                            required
                            style={{ 
                              borderRadius: '12px', 
                              border: '2px solid #e5e7eb', 
                              padding: '14px 16px',
                              fontSize: '1rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#6366f1';
                              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* ENHANCED RENT TYPE SECTION */}
                  <div className="mb-5">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05))',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid rgba(16, 185, 129, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #10b981, #059669, #10b981)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientFlow 3s ease-in-out infinite'
                      }} />
                      
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '12px',
                          padding: '12px',
                          color: 'white'
                        }}>
                          <Icon name="sparkles" size={20} />
                        </div>
                        <h4 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.3rem'
                        }}>
                          Rental Options *
                        </h4>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-3">
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
                              borderRadius: '16px',
                              padding: '16px 24px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(10px)',
                              userSelect: 'none',
                              boxShadow: formData.rentType.includes(type) 
                                ? '0 8px 24px rgba(16, 185, 129, 0.15)'
                                : '0 4px 12px rgba(0, 0, 0, 0.05)'
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
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0px)';
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
                                fontSize: '1rem', 
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

                  {/* Continue with similar enhanced styling for other sections... */}
                  {/* ADDRESS SECTION */}
                  <div className="mb-5">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.05))',
                      borderRadius: '20px',
                      padding: '24px',
                      marginBottom: '24px',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #3b82f6, #2563eb, #3b82f6)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientFlow 3s ease-in-out infinite'
                      }} />
                      
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          borderRadius: '12px',
                          padding: '12px',
                          color: 'white'
                        }}>
                          <Icon name="mapPin" size={20} />
                        </div>
                        <h4 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.3rem'
                        }}>
                          Location Information
                        </h4>
                      </div>
                      
                      <Form.Group className="mb-4">
                        <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                          Street Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          placeholder="Enter complete street address with landmarks"
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #e5e7eb', 
                            padding: '14px 16px',
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </Form.Group>
                      
                      <Row className="g-4">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                              City *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              placeholder="Enter city name"
                              required
                              style={{ 
                                borderRadius: '12px', 
                                border: '2px solid #e5e7eb', 
                                padding: '14px 16px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                              State *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleInputChange}
                              placeholder="Enter state name"
                              required
                              style={{ 
                                borderRadius: '12px', 
                                border: '2px solid #e5e7eb', 
                                padding: '14px 16px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
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
                                borderRadius: '12px', 
                                border: '2px solid #e5e7eb', 
                                padding: '14px 16px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                transition: 'all 0.2s ease'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* CONTACT SECTION */}
                  <div className="mb-5">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.08), rgba(239, 68, 68, 0.05))',
                      borderRadius: '20px',
                      padding: '24px',
                      marginBottom: '24px',
                      border: '1px solid rgba(245, 101, 101, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #f56565, #ef4444, #f56565)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientFlow 3s ease-in-out infinite'
                      }} />
                      
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                          background: 'linear-gradient(135deg, #f56565, #ef4444)',
                          borderRadius: '12px',
                          padding: '12px',
                          color: 'white'
                        }}>
                          <Icon name="phone" size={20} />
                        </div>
                        <h4 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.3rem'
                        }}>
                          Contact Information
                        </h4>
                      </div>
                      
                      <Form.Group>
                        <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '8px' }}>
                          Contact Details *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          placeholder="Enter phone number or email address"
                          required
                          style={{ 
                            borderRadius: '12px', 
                            border: '2px solid #e5e7eb', 
                            padding: '14px 16px',
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            transition: 'all 0.2s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#f56565';
                            e.target.style.boxShadow = '0 0 0 4px rgba(245, 101, 101, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* ENHANCED IMAGES SECTION */}
                  <div className="mb-5">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(219, 39, 119, 0.05))',
                      borderRadius: '20px',
                      padding: '24px',
                      marginBottom: '24px',
                      border: '1px solid rgba(236, 72, 153, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #ec4899, #db2777, #ec4899)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientFlow 3s ease-in-out infinite'
                      }} />
                      
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          borderRadius: '12px',
                          padding: '12px',
                          color: 'white'
                        }}>
                          <Icon name="image" size={20} />
                        </div>
                        <h4 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.3rem'
                        }}>
                          Property Gallery *
                        </h4>
                      </div>
                      
                      <div style={{
                        border: '3px dashed rgba(236, 72, 153, 0.3)',
                        borderRadius: '20px',
                        padding: '40px',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'rgba(236, 72, 153, 0.5)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 16px 32px rgba(236, 72, 153, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'rgba(236, 72, 153, 0.3)';
                        e.target.style.transform = 'translateY(0px)';
                        e.target.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          borderRadius: '50%',
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 24px',
                          boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3)'
                        }}>
                          <Icon name="upload" size={32} style={{ color: 'white' }} />
                        </div>
                        
                        <h5 style={{ 
                          fontWeight: '800', 
                          color: '#1e293b', 
                          marginBottom: '16px',
                          fontSize: '1.4rem'
                        }}>
                          Upload Premium Property Images
                        </h5>
                        
                        <p style={{ 
                          color: '#64748b', 
                          fontSize: '1.1rem', 
                          marginBottom: '32px',
                          lineHeight: '1.6'
                        }}>
                          Upload up to 5 high-quality images (Max 5MB each)<br/>
                          <span style={{ fontSize: '1rem', color: '#ec4899', fontWeight: '600' }}>
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
                            borderRadius: '12px',
                            border: '2px solid rgba(236, 72, 153, 0.2)',
                            padding: '16px',
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.9)',
                            cursor: 'pointer'
                          }}
                        />
                        
                        {uploadingImages && (
                          <div className="mt-4">
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '12px',
                              padding: '12px',
                              marginBottom: '16px'
                            }}>
                              <div 
                                style={{
                                  height: '8px',
                                  background: 'linear-gradient(90deg, #ec4899, #db2777)',
                                  borderRadius: '4px',
                                  width: `${uploadProgress}%`,
                                  transition: 'width 0.3s ease'
                                }}
                              />
                            </div>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <Spinner size="sm" style={{ color: '#ec4899' }} />
                              <span style={{ color: '#64748b', fontWeight: '600' }}>
                                Processing images... {Math.round(uploadProgress)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {imagePreviews.length > 0 && (
                        <div className="mt-4">
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <h6 style={{ 
                              fontWeight: '700', 
                              color: '#1e293b', 
                              fontSize: '1.2rem',
                              margin: 0
                            }}>
                              Uploaded Images
                            </h6>
                            <Badge 
                              style={{
                                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                fontWeight: '700'
                              }}
                            >
                              {imagePreviews.length}/5 images
                            </Badge>
                          </div>
                          
                          <Row className="g-3">
                            {imagePreviews.map((preview, index) => (
                              <Col key={preview.id} md={4} sm={6}>
                                <div style={{
                                  position: 'relative',
                                  borderRadius: '16px',
                                  overflow: 'hidden',
                                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-4px)';
                                  e.target.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0px)';
                                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                                }}
                                >
                                  <img 
                                    src={preview.src} 
                                    alt={`Property Preview ${index + 1}`} 
                                    style={{ 
                                      width: '100%',
                                      height: '140px', 
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="position-absolute top-0 end-0 m-2"
                                    onClick={() => removeImage(index)}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: 0,
                                      background: 'rgba(239, 68, 68, 0.9)',
                                      border: 'none',
                                      backdropFilter: 'blur(10px)'
                                    }}
                                  >
                                    <Icon name="x" size={14} />
                                  </Button>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ENHANCED VERIFICATION DOCUMENTS SECTION */}
                  <div className="mb-5">
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.05))',
                      borderRadius: '20px',
                      padding: '24px',
                      marginBottom: '24px',
                      border: '1px solid rgba(245, 158, 11, 0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #f59e0b, #d97706, #f59e0b)',
                        backgroundSize: '200% 100%',
                        animation: 'gradientFlow 3s ease-in-out infinite'
                      }} />
                      
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          borderRadius: '12px',
                          padding: '12px',
                          color: 'white'
                        }}>
                          <Icon name="document" size={20} />
                        </div>
                        <h4 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.3rem'
                        }}>
                          Verification Documents
                        </h4>
                      </div>
                      
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '12px' }}>
                              Owner Proof * (Aadhar/PAN Card)
                            </Form.Label>
                            <div style={{
                              border: '3px dashed rgba(245, 158, 11, 0.3)',
                              borderRadius: '16px',
                              padding: '24px',
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                              e.target.style.transform = 'translateY(0px)';
                            }}
                            >
                              <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                color: 'white'
                              }}>
                                <Icon name="document" size={20} />
                              </div>
                              <p className="mb-3" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                                Upload PDF or Image (Max 5MB)
                              </p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleOwnerProofChange}
                                style={{ 
                                  borderRadius: '8px', 
                                  fontSize: '0.9rem',
                                  border: '2px solid rgba(245, 158, 11, 0.2)',
                                  background: 'rgba(255, 255, 255, 0.9)'
                                }}
                              />
                            </div>
                            {ownerProofPreview && (
                              <div className="mt-3 p-3" style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                                borderRadius: '12px',
                                border: '2px solid rgba(34, 197, 94, 0.2)'
                              }}>
                                <div className="d-flex align-items-center gap-3">
                                  <div style={{
                                    background: '#22c55e',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                  }}>
                                    <Icon name="check" size={16} />
                                  </div>
                                  <strong style={{ fontSize: '0.9rem', color: '#16a34a' }}>
                                    {ownerProofPreview.name}
                                  </strong>
                                </div>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ fontWeight: '700', color: '#374151', fontSize: '0.95rem', marginBottom: '12px' }}>
                              Property Proof * (Bill/Document)
                            </Form.Label>
                            <div style={{
                              border: '3px dashed rgba(245, 158, 11, 0.3)',
                              borderRadius: '16px',
                              padding: '24px',
                              textAlign: 'center',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = 'rgba(245, 158, 11, 0.5)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                              e.target.style.transform = 'translateY(0px)';
                            }}
                            >
                              <div style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                color: 'white'
                              }}>
                                <Icon name="document" size={20} />
                              </div>
                              <p className="mb-3" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                                Electricity Bill, Tax Receipt, etc. (Max 5MB)
                              </p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handlePropertyProofChange}
                                style={{ 
                                  borderRadius: '8px', 
                                  fontSize: '0.9rem',
                                  border: '2px solid rgba(245, 158, 11, 0.2)',
                                  background: 'rgba(255, 255, 255, 0.9)'
                                }}
                              />
                            </div>
                            {propertyProofPreview && (
                              <div className="mt-3 p-3" style={{
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                                borderRadius: '12px',
                                border: '2px solid rgba(34, 197, 94, 0.2)'
                              }}>
                                <div className="d-flex align-items-center gap-3">
                                  <div style={{
                                    background: '#22c55e',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                  }}>
                                    <Icon name="check" size={16} />
                                  </div>
                                  <strong style={{ fontSize: '0.9rem', color: '#16a34a' }}>
                                    {propertyProofPreview.name}
                                  </strong>
                                </div>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <style>
                    {`
                      @keyframes gradientFlow {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                      }
                    `}
                  </style>

                  {/* ULTRA-PREMIUM SUBMIT BUTTON */}
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingImages}
                      style={{
                        background: loading 
                          ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
                        backgroundSize: '200% 200%',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '18px 48px',
                        fontWeight: '800',
                        fontSize: '1.1rem',
                        minWidth: '200px',
                        color: 'white',
                        boxShadow: loading 
                          ? '0 8px 32px rgba(156, 163, 175, 0.3)'
                          : '0 16px 48px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: loading ? 'none' : 'gradientShift 3s ease infinite',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && !uploadingImages) {
                          e.target.style.transform = 'translateY(-4px) scale(1.05)';
                          e.target.style.boxShadow = '0 24px 64px rgba(102, 126, 234, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading && !uploadingImages) {
                          e.target.style.transform = 'translateY(0px) scale(1)';
                          e.target.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.4)';
                        }
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: loading ? '0%' : '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.6s ease'
                      }} />
                      
                      {loading ? (
                        <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
                          <Spinner animation="border" size="sm" />
                          <span>Adding Property...</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
                          <Icon name="upload" size={20} />
                          <span>Add Property to Platform</span>
                        </div>
                      )}
                    </Button>
                    
                    <div style={{
                      marginTop: '24px',
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.03))',
                      borderRadius: '16px',
                      border: '1px solid rgba(99, 102, 241, 0.1)'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem',
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        🔒 By submitting, you agree to our{' '}
                        <span style={{ color: '#6366f1', fontWeight: '600' }}>terms and conditions</span>
                        <br/>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
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
