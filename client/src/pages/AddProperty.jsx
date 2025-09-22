import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api, handleApiError, categories, convertImageToBase64 } from '../utils/api';

const AddProperty = () => {
  const navigate = useNavigate();
  
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

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

  // ✅ COLORFUL ICONS COMPONENT - EXACTLY LIKE YOUR SCREENSHOT
  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      // 🏢 BUILDING ICONS - BROWN COLOR
      building: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#8B5A2B" stroke="#8B5A2B" strokeWidth="1.5" className={className}>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6Z"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v8h4"/>
          <path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/>
          <path d="M10 6h4"/>
          <path d="M10 10h4"/>
          <path d="M10 14h4"/>
          <path d="M10 18h4"/>
        </svg>
      ),
      // 📊 LAYERS ICONS - PURPLE COLOR
      layers: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#7C3AED" stroke="#7C3AED" strokeWidth="1.5" className={className}>
          <polygon points="12,2 2,7 12,12 22,7 12,2"/>
          <polyline points="2,17 12,22 22,17"/>
          <polyline points="2,12 12,17 22,12"/>
        </svg>
      ),
      // 💰 DOLLAR ICONS - GREEN COLOR
      dollarSign: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#059669" stroke="#059669" strokeWidth="1.5" className={className}>
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      // 📏 MAXIMIZE ICONS - BLUE COLOR
      maximize: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0EA5E9" stroke="#0EA5E9" strokeWidth="1.5" className={className}>
          <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
        </svg>
      ),
      // ✏️ EDIT ICONS - ORANGE COLOR
      edit3: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F97316" stroke="#F97316" strokeWidth="1.5" className={className}>
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>
        </svg>
      ),
      // 📞 PHONE ICONS - PINK COLOR
      phone: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#EC4899" stroke="#EC4899" strokeWidth="1.5" className={className}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      // 📄 FILE TEXT ICONS - TEAL COLOR
      fileText: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0D9488" stroke="#0D9488" strokeWidth="1.5" className={className}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      // 📍 MAP PIN ICONS - RED COLOR
      mapPin: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#DC2626" stroke="#DC2626" strokeWidth="1.5" className={className}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      // 🧭 NAVIGATION ICONS - INDIGO COLOR
      navigation: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#4F46E5" stroke="#4F46E5" strokeWidth="1.5" className={className}>
          <polygon points="3,11 22,2 13,21 11,13 3,11"/>
        </svg>
      ),
      // ⬆️ UPLOAD ICONS - GREEN COLOR
      upload: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" strokeWidth="1.5" className={className}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,5 17,10"/>
          <line x1="12" y1="5" x2="12" y2="15"/>
        </svg>
      ),
      // 🖼️ IMAGE ICONS - CYAN COLOR
      image: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0891B2" stroke="#0891B2" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      ),
      // 📋 DOCUMENT ICONS - AMBER COLOR
      document: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1.5" className={className}>
          <path d="M14,2 L20,8 L20,20 C20,21.1 19.1,22 18,22 L6,22 C4.9,22 4,21.1 4,20 L4,4 C4,2.9 4.9,2 6,2 L14,2 Z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      ),
      // ✅ CHECK ICONS - GREEN COLOR
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#10B981" stroke="white" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      // ❌ X ICONS - RED COLOR
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2" className={className}>
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ),
      // ✨ SPARKLES ICONS - GOLD COLOR
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
      ),
      // ⚠️ ALERT ICONS - YELLOW COLOR
      alertCircle: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#EAB308" stroke="#EAB308" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <path d="M12 16h.01"/>
        </svg>
      )
    };
    return icons[name] || null;
  };

  // ✅ ALL YOUR EXACT ORIGINAL FUNCTIONS - UNCHANGED
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

  const completeness = getFormProgress();

  return (
    <>
      <div 
        ref={containerRef}
        className="property-container"
      >
        {/* Background animations */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
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
                      <Icon name="sparkles" size={24} />
                    </div>
                    <div>
                      <h2 className="profile-title">Add New Property</h2>
                      <p className="profile-subtitle">
                        List your premium property and connect with verified tenants
                      </p>
                    </div>
                  </div>

                  <div className="completeness-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="completeness-label">Form Completion</span>
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
                        <Icon name="alertCircle" size={14} />
                        Complete all fields to submit your property listing
                      </p>
                    )}
                    {completeness === 100 && (
                      <p className="completeness-message complete">
                        <Icon name="check" size={14} />
                        Form complete! Ready to submit your property
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>

              {/* Main Form Card */}
              <Card className="profile-card main-card">
                <Card.Body className="p-4">
                  
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
                    
                    {/* Property Details Section */}
                    <div className="form-section">
                      <h5 className="section-title">Property Details</h5>
                      
                      <Row className="g-3">
                        <Col lg={3} md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="building" size={16} />
                              Category *
                            </Form.Label>
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              className="form-input"
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
                        
                        <Col lg={3} md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="layers" size={16} />
                              Subtype {formData.category !== 'Event' && '*'}
                            </Form.Label>
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              className="form-input"
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

                        <Col lg={3} md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="dollarSign" size={16} />
                              Price (₹) *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              placeholder="Enter price"
                              min="0"
                              required
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col lg={3} md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="maximize" size={16} />
                              Size/Capacity *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="size"
                              value={formData.size}
                              onChange={handleInputChange}
                              placeholder="e.g., 1000 sq ft"
                              required
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="g-3">
                        <Col lg={8} md={8}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="edit3" size={16} />
                              Property Title *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter an attractive property title"
                              required
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="phone" size={16} />
                              Contact *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="contact"
                              value={formData.contact}
                              onChange={handleInputChange}
                              placeholder="Phone/Email"
                              required
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="form-group mb-3">
                        <Form.Label className="form-label">
                          <Icon name="fileText" size={16} />
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
                          className="form-input"
                        />
                      </Form.Group>

                      {/* ✅ FIXED RENTAL OPTIONS WITH VISIBLE CHECKBOXES */}
                      {formData.category && categories[formData.category]?.rentTypes && (
                        <Form.Group className="form-group">
                          <Form.Label className="form-label">
                            <Icon name="layers" size={16} />
                            Rental Options *
                          </Form.Label>
                          <div className="rental-options">
                            {categories[formData.category].rentTypes.map(type => (
                              <div 
                                key={type}
                                className={`rental-chip ${formData.rentType.includes(type) ? 'selected' : ''}`}
                                onClick={() => {
                                  const newRentTypes = formData.rentType.includes(type)
                                    ? formData.rentType.filter(t => t !== type)
                                    : [...formData.rentType, type];
                                  setFormData({ ...formData, rentType: newRentTypes });
                                }}
                              >
                                {/* ✅ VISIBLE CHECKBOX ICON */}
                                <div className="rental-checkbox-icon">
                                  {formData.rentType.includes(type) ? (
                                    <Icon name="check" size={14} />
                                  ) : (
                                    <div className="empty-checkbox"></div>
                                  )}
                                </div>
                                <span className="rental-text">
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Form.Group>
                      )}
                    </div>

                    {/* Address Section */}
                    <div className="form-section">
                      <h5 className="section-title">Address Information</h5>
                      
                      <Form.Group className="form-group mb-3">
                        <Form.Label className="form-label">
                          <Icon name="navigation" size={16} />
                          Street Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          placeholder="Complete address"
                          className="form-input"
                        />
                      </Form.Group>

                      <Row className="g-3">
                        <Col lg={4} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mapPin" size={16} />
                              City *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              required
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mapPin" size={16} />
                              State *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleInputChange}
                              placeholder="State"
                              required
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={4} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="mapPin" size={16} />
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
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Media & Documents Section */}
                    <div className="form-section">
                      <h5 className="section-title">Media & Documents</h5>
                      
                      <Row className="g-4">
                        <Col lg={6} md={12}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="image" size={16} />
                              Property Images *
                            </Form.Label>
                            
                            <div className="upload-area">
                              <div className="upload-content">
                                <div className="upload-icon">
                                  <Icon name="upload" size={24} />
                                </div>
                                <h6 className="upload-title">Upload Images</h6>
                                <p className="upload-text">Max 5 images, up to 5MB each</p>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageChange}
                                  disabled={uploadingImages}
                                  className="upload-input"
                                />
                              </div>
                              
                              {uploadingImages && (
                                <div className="upload-progress">
                                  <div className="progress-bar">
                                    <div 
                                      className="progress-fill"
                                      style={{ width: `${uploadProgress}%` }}
                                    />
                                  </div>
                                  <span className="progress-text">Uploading... {Math.round(uploadProgress)}%</span>
                                </div>
                              )}
                            </div>
                            
                            {imagePreviews.length > 0 && (
                              <div className="image-previews">
                                <div className="preview-header">
                                  <Badge bg="primary" className="image-count">{imagePreviews.length}/5</Badge>
                                </div>
                                <div className="preview-grid">
                                  {imagePreviews.map((preview, index) => (
                                    <div key={preview.id} className="preview-item">
                                      <img src={preview.src} alt={`Preview ${index + 1}`} className="preview-image" />
                                      <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removeImage(index)}
                                      >
                                        <Icon name="x" size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        
                        <Col lg={6} md={12}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">
                              <Icon name="document" size={16} />
                              Required Documents *
                            </Form.Label>
                            
                            <div className="document-upload">
                              <div className="doc-header">
                                <Icon name="document" size={18} />
                                <span>Owner Proof (Aadhar/PAN)</span>
                              </div>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleOwnerProofChange}
                                className="doc-input"
                              />
                              {ownerProofPreview && (
                                <div className="doc-preview">
                                  <Icon name="check" size={14} />
                                  <span>{ownerProofPreview.name}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="document-upload">
                              <div className="doc-header">
                                <Icon name="document" size={18} />
                                <span>Property Proof (Utility Bill/Document)</span>
                              </div>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handlePropertyProofChange}
                                className="doc-input"
                              />
                              {propertyProofPreview && (
                                <div className="doc-preview">
                                  <Icon name="check" size={14} />
                                  <span>{propertyProofPreview.name}</span>
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        size="lg"
                        disabled={loading || uploadingImages}
                        className="submit-button"
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" />
                              <span>Adding Property...</span>
                            </>
                          ) : (
                            <>
                              <Icon name="upload" size={18} />
                              <span>Add Property to Platform</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </div>

                    {/* Footer */}
                    <div className="form-footer">
                      <small>
                        <Icon name="alertCircle" size={14} />
                        Fields marked with * are required. Complete all fields to submit your property listing and access all platform features.
                      </small>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ COMPLETE STYLING WITH COLORFUL ICONS AND FIXED CHECKBOXES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .property-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-top: 100px;
          padding-bottom: 60px;
        }
        
        /* Background animations */
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
          height: calc(100% - 80px);
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
        
        /* Card styling */
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
        
        /* Completeness card */
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
          gap: 6px;
        }
        
        .completeness-message.complete { color: #10b981; font-weight: 600; }
        .completeness-message.incomplete { color: #64748b; }
        
        /* Form sections */
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
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
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
        
        /* ✅ UPDATED RENTAL OPTIONS WITH VISIBLE CHECKBOXES */
        .rental-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .rental-chip {
          background: rgba(124, 58, 237, 0.1);
          border: 1.5px solid rgba(124, 58, 237, 0.2);
          border-radius: 25px;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .rental-chip:hover {
          background: rgba(124, 58, 237, 0.15);
          border-color: rgba(124, 58, 237, 0.4);
          transform: translateY(-2px);
        }
        
        .rental-chip.selected {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        
        /* ✅ VISIBLE CHECKBOX STYLING */
        .rental-checkbox-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.9);
          border: 1.5px solid rgba(124, 58, 237, 0.3);
          transition: all 0.3s ease;
        }
        
        .rental-chip.selected .rental-checkbox-icon {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }
        
        .empty-checkbox {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          background: transparent;
        }
        
        .rental-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .rental-chip.selected .rental-text {
          color: #10b981;
          font-weight: 700;
        }
        
        /* Upload areas */
        .upload-area {
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
          background: rgba(124, 58, 237, 0.02);
        }
        
        .upload-area:hover {
          border-color: rgba(124, 58, 237, 0.5);
          background: rgba(124, 58, 237, 0.05);
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .upload-icon {
          background: rgba(124, 58, 237, 0.2);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c3aed;
        }
        
        .upload-title {
          color: #1e293b;
          font-weight: 700;
          margin: 0;
          font-size: 1.1rem;
        }
        
        .upload-text {
          color: #64748b;
          margin: 0;
          font-size: 0.9rem;
        }
        
        .upload-input {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(209, 213, 219, 0.6) !important;
          border-radius: 8px !important;
          padding: 0.5rem !important;
          color: #111827 !important;
          font-size: 0.85rem !important;
        }
        
        /* Document upload */
        .document-upload {
          background: rgba(124, 58, 237, 0.05);
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .doc-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.75rem;
          color: #1e293b;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .doc-input {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(209, 213, 219, 0.6) !important;
          border-radius: 8px !important;
          padding: 0.5rem !important;
          color: #111827 !important;
          font-size: 0.85rem !important;
        }
        
        .doc-preview {
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* Image previews */
        .image-previews {
          margin-top: 1rem;
        }
        
        .preview-header {
          margin-bottom: 0.75rem;
        }
        
        .image-count {
          font-size: 0.8rem;
          padding: 0.25rem 0.75rem;
        }
        
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 0.75rem;
        }
        
        .preview-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .preview-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-button {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.9);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover {
          background: #dc2626;
          transform: scale(1.1);
        }
        
        /* Alerts */
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
        
        /* Submit button */
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
        
        /* Form footer */
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
          gap: 6px;
        }
        
        /* Upload progress */
        .upload-progress {
          margin-top: 1rem;
        }
        
        .progress-bar {
          background: rgba(209, 213, 219, 0.4);
          border-radius: 8px;
          height: 6px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          transition: width 0.3s ease;
        }
        
        .progress-text {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* Animations */
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
        
        /* Responsive */
        @media (max-width: 768px) {
          .profile-title { font-size: 1.5rem; }
          .orb-1 { width: 200px; height: 200px; }
          .orb-2 { width: 150px; height: 150px; }
          .orb-3 { width: 120px; height: 120px; }
          .orb-4 { width: 100px; height: 100px; }
          
          .rental-options { 
            flex-direction: column; 
            gap: 0.5rem;
          }
          
          .preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }
        }
      `}</style>
    </>
  );
};

export default AddProperty;
