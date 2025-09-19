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
      ),
      sparkle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z"/>
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
        linear-gradient(135deg, #667eea 0%, #764ba2 100%),
        linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.1) 75%)
      `,
      backgroundSize: '100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 0 0, 10px 0, 10px -10px, 0px 10px',
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ✨ ANIMATED BACKGROUND ELEMENTS */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
          radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 150px 150px, 80px 80px, 120px 120px',
        animation: 'backgroundMove 20s linear infinite'
      }} />

      {/* 🌟 FLOATING SPARKLE ELEMENTS */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        color: 'rgba(255, 255, 255, 0.3)',
        animation: 'sparkleFloat 6s ease-in-out infinite'
      }}>
        <Icon name="sparkle" size={24} />
      </div>
      
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '20%',
        color: 'rgba(255, 255, 255, 0.2)',
        animation: 'sparkleFloat 8s ease-in-out infinite reverse'
      }}>
        <Icon name="sparkle" size={32} />
      </div>

      <div style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        color: 'rgba(255, 255, 255, 0.25)',
        animation: 'sparkleFloat 7s ease-in-out infinite'
      }}>
        <Icon name="sparkle" size={20} />
      </div>

      {/* 💫 GEOMETRIC FLOATING SHAPES */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '5%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(10px)',
        animation: 'floatBounce 10s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: '60%',
        right: '8%',
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
        backdropFilter: 'blur(8px)',
        transform: 'rotate(45deg)',
        animation: 'floatBounce 12s ease-in-out infinite reverse'
      }} />

      <div style={{
        position: 'absolute',
        top: '80%',
        left: '20%',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
        backdropFilter: 'blur(6px)',
        transform: 'rotate(15deg)',
        animation: 'floatBounce 8s ease-in-out infinite'
      }} />

      <style>
        {`
          @keyframes backgroundMove {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(-20px) translateY(-10px); }
            50% { transform: translateX(-40px) translateY(-20px); }
            75% { transform: translateX(-20px) translateY(-10px); }
            100% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes sparkleFloat {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
              opacity: 0.3; 
            }
            25% { 
              transform: translateY(-15px) rotate(90deg); 
              opacity: 0.6; 
            }
            50% { 
              transform: translateY(-25px) rotate(180deg); 
              opacity: 0.4; 
            }
            75% { 
              transform: translateY(-10px) rotate(270deg); 
              opacity: 0.7; 
            }
          }
          
          @keyframes floatBounce {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) scale(1); 
            }
            25% { 
              transform: translateY(-20px) translateX(10px) scale(1.05); 
            }
            50% { 
              transform: translateY(-35px) translateX(-5px) scale(0.95); 
            }
            75% { 
              transform: translateY(-15px) translateX(-10px) scale(1.02); 
            }
          }
          
          .form-control:focus, .form-select:focus {
            border-color: rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25) !important;
            background: rgba(255, 255, 255, 0.95) !important;
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

          .glass-card {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1) !important;
          }

          .glass-card-header {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
          }
        `}
      </style>

      <Container style={{ position: 'relative', zIndex: 2 }} className="py-3">
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            {/* ✨ STUNNING HEADER CARD with Glass Effect */}
            <Card className="mb-4 border-0 glass-card-header" style={{
              borderRadius: '20px',
              transform: 'translateY(-10px)'
            }}>
              <Card.Body style={{ padding: '2rem' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '16px',
                      padding: '12px',
                      color: 'white',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}>
                      <Icon name="home" size={28} />
                    </div>
                    <div>
                      <h2 className="mb-2" style={{ 
                        fontWeight: '800', 
                        color: '#1a202c',
                        fontSize: '1.8rem',
                        letterSpacing: '-0.025em',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ✨ Add New Property
                      </h2>
                      <p className="mb-0" style={{ 
                        fontSize: '1rem', 
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        🚀 List your property and reach thousands of potential tenants
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '900', 
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {getFormProgress()}%
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#64748b',
                      fontWeight: '600'
                    }}>
                      Complete
                    </div>
                  </div>
                </div>
                
                <ProgressBar 
                  now={getFormProgress()} 
                  className="mt-3"
                  style={{ 
                    height: '8px', 
                    borderRadius: '4px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    overflow: 'hidden'
                  }}
                />
              </Card.Body>
            </Card>

            {/* 🎨 MAIN FORM CARD with Stunning Glass Effect */}
            <Card className="border-0 glass-card" style={{
              borderRadius: '20px',
              transform: 'translateY(0px)',
              transition: 'all 0.3s ease'
            }}>
              <Card.Body style={{ padding: '2.5rem' }}>
                {success && (
                  <Alert variant="success" className="mb-4" style={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderLeft: '4px solid #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '1rem 1.25rem',
                    fontSize: '0.95rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{
                      background: '#22c55e',
                      borderRadius: '50%',
                      padding: '4px',
                      color: 'white'
                    }}>
                      <Icon name="check" size={16} />
                    </div>
                    <strong>{success}</strong>
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4" style={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderLeft: '4px solid #ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '1rem 1.25rem',
                    fontSize: '0.95rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{
                      background: '#ef4444',
                      borderRadius: '50%',
                      padding: '4px',
                      color: 'white'
                    }}>
                      <Icon name="alert" size={16} />
                    </div>
                    <strong>{error}</strong>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Property Details Section */}
                  <div className="mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.2rem'
                    }}>
                      <Icon name="home" size={20} />
                      🏠 Property Details
                    </h5>
                    
                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            Category *
                          </Form.Label>
                          <div className="dropdown-fix">
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              style={{
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '0.75rem 0.9rem',
                                fontSize: '0.95rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                height: '45px',
                                backdropFilter: 'blur(5px)'
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
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            Subtype {formData.category !== 'Event' && '*'}
                          </Form.Label>
                          <div className="dropdown-fix">
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              style={{
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '0.75rem 0.9rem',
                                fontSize: '0.95rem',
                                background: formData.category ? 'rgba(255, 255, 255, 0.9)' : 'rgba(248, 250, 252, 0.8)',
                                height: '45px',
                                backdropFilter: 'blur(5px)'
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

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '0.75rem 0.9rem',
                          fontSize: '0.95rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '45px',
                          backdropFilter: 'blur(5px)'
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                        style={{
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '0.75rem 0.9rem',
                          fontSize: '0.95rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          resize: 'vertical',
                          backdropFilter: 'blur(5px)'
                        }}
                      />
                    </Form.Group>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            💰 Price (₹) *
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
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              padding: '0.75rem 0.9rem',
                              fontSize: '0.95rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '45px',
                              backdropFilter: 'blur(5px)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            📐 Size/Capacity *
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
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              padding: '0.75rem 0.9rem',
                              fontSize: '0.95rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '45px',
                              backdropFilter: 'blur(5px)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Rent Type Section */}
                  <div className="mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151', marginBottom: '1rem', fontSize: '0.95rem' }}>
                        🏷️ Rent Type *
                      </Form.Label>
                      <div className="d-flex flex-wrap gap-3">
                        {formData.category && categories[formData.category]?.rentTypes.map(type => (
                          <div key={type} style={{
                            background: formData.rentType.includes(type) 
                              ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                              : 'rgba(255, 255, 255, 0.8)',
                            color: formData.rentType.includes(type) ? 'white' : '#374151',
                            border: formData.rentType.includes(type) ? 'none' : '2px solid rgba(255, 255, 255, 0.5)',
                            borderRadius: '10px',
                            padding: '0.6rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            fontWeight: '600'
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
                              style={{ fontSize: '0.9rem' }}
                            />
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  </div>

                  {/* Address Section */}
                  <div className="mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.2rem'
                    }}>
                      <Icon name="mapPin" size={20} />
                      📍 Address Information
                    </h5>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '0.75rem 0.9rem',
                          fontSize: '0.95rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '45px',
                          backdropFilter: 'blur(5px)'
                        }}
                      />
                    </Form.Group>

                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              padding: '0.75rem 0.9rem',
                              fontSize: '0.95rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '45px',
                              backdropFilter: 'blur(5px)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              padding: '0.75rem 0.9rem',
                              fontSize: '0.95rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '45px',
                              backdropFilter: 'blur(5px)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              padding: '0.75rem 0.9rem',
                              fontSize: '0.95rem',
                              background: 'rgba(255, 255, 255, 0.9)',
                              height: '45px',
                              backdropFilter: 'blur(5px)'
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Contact Section */}
                  <div className="mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.2rem'
                    }}>
                      <Icon name="phone" size={20} />
                      📞 Contact Information
                    </h5>

                    <Form.Group>
                      <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
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
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '0.75rem 0.9rem',
                          fontSize: '0.95rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '45px',
                          backdropFilter: 'blur(5px)'
                        }}
                      />
                    </Form.Group>
                  </div>

                  {/* Images Section */}
                  <div className="mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.2rem'
                    }}>
                      <Icon name="image" size={20} />
                      📸 Property Images *
                    </h5>

                    <div style={{
                      border: '2px dashed rgba(255, 255, 255, 0.5)',
                      borderRadius: '12px',
                      padding: '2rem',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Icon name="upload" size={36} />
                      <h6 className="mt-3 mb-2" style={{ fontWeight: '600', color: '#374151', fontSize: '1.1rem' }}>
                        Upload Property Images
                      </h6>
                      <p style={{ color: '#6b7280', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                        Upload up to 5 high-quality images (Max 5MB each)
                      </p>
                      
                      <Form.Control
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={uploadingImages}
                        style={{
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          fontSize: '0.95rem',
                          background: 'rgba(255, 255, 255, 0.9)',
                          height: '45px',
                          backdropFilter: 'blur(5px)'
                        }}
                      />

                      {uploadingImages && (
                        <div className="mt-3">
                          <ProgressBar 
                            now={uploadProgress} 
                            label={`${Math.round(uploadProgress)}%`}
                            style={{ height: '8px', borderRadius: '4px' }}
                          />
                          <small className="text-muted mt-2 d-block" style={{ fontSize: '0.85rem' }}>Processing images...</small>
                        </div>
                      )}
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="mt-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h6 style={{ fontWeight: '600', color: '#374151', fontSize: '1rem' }}>
                            📷 Uploaded Images
                          </h6>
                          <Badge 
                            style={{ 
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              border: 'none'
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
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                background: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(10px)'
                              }}>
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
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    fontSize: '0.75rem',
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    border: 'none'
                                  }}
                                >
                                  <Icon name="x" size={14} />
                                </Button>
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                                  color: 'white',
                                  padding: '0.75rem 0.5rem 0.5rem',
                                  fontSize: '0.8rem',
                                  fontWeight: '600'
                                }}>
                                  📷 Image {index + 1}
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Verification Documents Section */}
                  <div className="mb-4" style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <h5 style={{ 
                      fontWeight: '700', 
                      color: '#1e293b', 
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '1.2rem'
                    }}>
                      <Icon name="document" size={20} />
                      📋 Verification Documents
                    </h5>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            🆔 Owner Proof * (Aadhar/PAN Card)
                          </Form.Label>
                          <div style={{
                            border: '2px dashed rgba(255, 255, 255, 0.5)',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.6)',
                            height: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <Icon name="document" size={28} />
                            <p className="mt-2 mb-2" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              Upload PDF or Image (Max 5MB)
                            </p>
                            <Form.Control
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleOwnerProofChange}
                              style={{
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                height: '38px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                              }}
                            />
                          </div>
                          {ownerProofPreview && (
                            <div className="mt-2 p-2" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '8px',
                              border: '1px solid rgba(34, 197, 94, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}>
                              <div className="d-flex align-items-center gap-2">
                                <Icon name="check" size={16} />
                                <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>
                                  {ownerProofPreview.name}
                                </strong>
                              </div>
                              {ownerProofPreview.type.startsWith('image/') && (
                                <img 
                                  src={ownerProofPreview.src} 
                                  alt="Owner Proof Preview" 
                                  style={{ 
                                    maxWidth: '100px', 
                                    maxHeight: '100px', 
                                    marginTop: '8px',
                                    borderRadius: '6px',
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
                          <Form.Label style={{ fontWeight: '600', color: '#374151', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            🏠 Property Proof * (Bill/Document)
                          </Form.Label>
                          <div style={{
                            border: '2px dashed rgba(255, 255, 255, 0.5)',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.6)',
                            height: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                          }}>
                            <Icon name="document" size={28} />
                            <p className="mt-2 mb-2" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              Electricity Bill, Tax Receipt, etc. (Max 5MB)
                            </p>
                            <Form.Control
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handlePropertyProofChange}
                              style={{
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                height: '38px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                              }}
                            />
                          </div>
                          {propertyProofPreview && (
                            <div className="mt-2 p-2" style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '8px',
                              border: '1px solid rgba(34, 197, 94, 0.2)',
                              backdropFilter: 'blur(10px)'
                            }}>
                              <div className="d-flex align-items-center gap-2">
                                <Icon name="check" size={16} />
                                <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>
                                  {propertyProofPreview.name}
                                </strong>
                              </div>
                              {propertyProofPreview.type.startsWith('image/') && (
                                <img 
                                  src={propertyProofPreview.src} 
                                  alt="Property Proof Preview" 
                                  style={{ 
                                    maxWidth: '100px', 
                                    maxHeight: '100px', 
                                    marginTop: '8px',
                                    borderRadius: '6px',
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

                  {/* ✨ STUNNING SUBMIT BUTTON SECTION */}
                  <div className="text-center mt-5" style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingImages}
                      style={{
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '14px',
                        padding: '1rem 3rem',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        boxShadow: loading ? 'none' : '0 8px 30px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        minWidth: '200px',
                        justifyContent: 'center',
                        transform: loading ? 'scale(0.98)' : 'scale(1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          Adding Property...
                        </>
                      ) : (
                        <>
                          <Icon name="upload" size={20} />
                          🚀 Add Property
                        </>
                      )}
                    </Button>
                    
                    <p className="mt-3" style={{ 
                      fontSize: '0.9rem', 
                      color: '#64748b',
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.5)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '10px',
                      display: 'inline-block',
                      backdropFilter: 'blur(5px)'
                    }}>
                      🔒 By submitting, you agree to our terms and conditions
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
