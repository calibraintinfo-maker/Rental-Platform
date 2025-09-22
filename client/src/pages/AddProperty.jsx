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
      sparkles: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
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

  // ✅ YOUR EXACT ORIGINAL FUNCTIONS - All kept intact
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
        {/* Background Elements */}
        <div className="background-animation">
          <div className="gradient-overlay"></div>
          <div className="grid-overlay"></div>
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div 
            className="mouse-follower"
            style={{
              transform: `translate(${mousePosition.x}%, ${mousePosition.y}%)`
            }}
          ></div>
          <div className="particles">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`particle particle-${index % 3 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${index * 1}s`
                }}
              />
            ))}
          </div>
        </div>

        <Container fluid className="main-container">
          <Row className="justify-content-center">
            <Col xl={10} lg={11} md={12}>
              
              {/* ✅ SUPER COMPACT: Header Section - Now inline */}
              <div className="page-header">
                <div className="header-content">
                  <div className="header-info">
                    <div className="header-icon">
                      <Icon name="sparkles" size={18} />
                    </div>
                    <div className="header-text">
                      <h2 className="page-title">Add New Property</h2>
                      <p className="page-subtitle">List your premium property and connect with verified tenants</p>
                    </div>
                  </div>
                  <div className="header-progress">
                    <div className="progress-info">
                      <span className="progress-label">Progress</span>
                      <span className={`progress-percentage ${completeness === 100 ? 'complete' : 'incomplete'}`}>
                        {completeness}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className={`progress-fill ${completeness === 100 ? 'complete' : 'incomplete'}`}
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ SUPER COMPACT: Main Form Card - No wasted space */}
              <Card className="form-card">
                <Card.Body className="form-body">
                  
                  {/* Alerts */}
                  {success && (
                    <Alert variant="success" className="form-alert success-alert">
                      <Icon name="check" size={14} />
                      <span>{success}</span>
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert variant="danger" className="form-alert error-alert">
                      <Icon name="alertCircle" size={14} />
                      <span>{error}</span>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} className="property-form">
                    
                    {/* ✅ COMPACT: Property Details - Single tight section */}
                    <div className="form-section">
                      <h6 className="section-title">Property Details</h6>
                      
                      <Row className="form-row">
                        <Col lg={3} md={6} sm={6}>
                          <div className="field-group">
                            <label className="field-label">Category *</label>
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              className="field-input"
                            >
                              <option value="">Select</option>
                              {Object.keys(categories).map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </Col>
                        
                        <Col lg={3} md={6} sm={6}>
                          <div className="field-group">
                            <label className="field-label">Subtype {formData.category !== 'Event' && '*'}</label>
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              className="field-input"
                            >
                              <option value="">Select</option>
                              {formData.category && categories[formData.category]?.subtypes.map(subtype => (
                                <option key={subtype} value={subtype}>
                                  {subtype}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </Col>

                        <Col lg={3} md={6} sm={6}>
                          <div className="field-group">
                            <label className="field-label">Price (₹) *</label>
                            <Form.Control
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              placeholder="Enter price"
                              min="0"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                        
                        <Col lg={3} md={6} sm={6}>
                          <div className="field-group">
                            <label className="field-label">Size/Capacity *</label>
                            <Form.Control
                              type="text"
                              name="size"
                              value={formData.size}
                              onChange={handleInputChange}
                              placeholder="e.g., 1000 sq ft"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row className="form-row">
                        <Col lg={8} md={8}>
                          <div className="field-group">
                            <label className="field-label">Property Title *</label>
                            <Form.Control
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter an attractive property title"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                        <Col lg={4} md={4}>
                          <div className="field-group">
                            <label className="field-label">Contact *</label>
                            <Form.Control
                              type="text"
                              name="contact"
                              value={formData.contact}
                              onChange={handleInputChange}
                              placeholder="Phone/Email"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                      </Row>

                      <div className="field-group">
                        <label className="field-label">Property Description *</label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your property - amenities, location benefits, unique features..."
                          required
                          className="field-input textarea-input"
                        />
                      </div>

                      {/* Rental Options - Compact inline */}
                      <div className="field-group">
                        <label className="field-label">Rental Options *</label>
                        <div className="rental-options">
                          {formData.category && categories[formData.category]?.rentTypes.map(type => (
                            <div 
                              key={type}
                              className={`rental-option ${formData.rentType.includes(type) ? 'selected' : ''}`}
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
                                onChange={() => {}}
                                className="rental-checkbox"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ✅ COMPACT: Address Section */}
                    <div className="form-section">
                      <h6 className="section-title">Location</h6>
                      
                      <Row className="form-row">
                        <Col lg={6} md={12}>
                          <div className="field-group">
                            <label className="field-label">Street Address</label>
                            <Form.Control
                              type="text"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleInputChange}
                              placeholder="Complete address"
                              className="field-input"
                            />
                          </div>
                        </Col>
                        <Col lg={2} md={4}>
                          <div className="field-group">
                            <label className="field-label">City *</label>
                            <Form.Control
                              type="text"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              placeholder="City"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                        <Col lg={2} md={4}>
                          <div className="field-group">
                            <label className="field-label">State *</label>
                            <Form.Control
                              type="text"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleInputChange}
                              placeholder="State"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                        <Col lg={2} md={4}>
                          <div className="field-group">
                            <label className="field-label">Pincode *</label>
                            <Form.Control
                              type="text"
                              name="address.pincode"
                              value={formData.address.pincode}
                              onChange={handleInputChange}
                              placeholder="6-digit"
                              maxLength="6"
                              required
                              className="field-input"
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* ✅ COMPACT: Upload Sections - Side by side */}
                    <Row className="form-row">
                      <Col lg={6} md={12}>
                        <div className="form-section">
                          <h6 className="section-title">Property Images *</h6>
                          
                          <div className="upload-zone">
                            <div className="upload-icon-small">
                              <Icon name="upload" size={16} />
                            </div>
                            <p className="upload-text">Upload Images (Max 5)</p>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              disabled={uploadingImages}
                              className="upload-input"
                            />
                            
                            {uploadingImages && (
                              <div className="upload-progress">
                                <div className="progress-track">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                                <span className="progress-text">{Math.round(uploadProgress)}%</span>
                              </div>
                            )}
                          </div>
                          
                          {imagePreviews.length > 0 && (
                            <div className="image-previews">
                              <div className="preview-header">
                                <Badge className="image-count">{imagePreviews.length}/5</Badge>
                              </div>
                              <div className="preview-grid">
                                {imagePreviews.map((preview, index) => (
                                  <div key={preview.id} className="preview-item">
                                    <img 
                                      src={preview.src} 
                                      alt={`Preview ${index + 1}`} 
                                      className="preview-img"
                                    />
                                    <button
                                      type="button"
                                      className="remove-btn"
                                      onClick={() => removeImage(index)}
                                    >
                                      <Icon name="x" size={8} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                      
                      <Col lg={6} md={12}>
                        <div className="form-section">
                          <h6 className="section-title">Documents *</h6>
                          
                          <div className="field-group">
                            <label className="field-label">Owner Proof (Aadhar/PAN) *</label>
                            <div className="doc-upload">
                              <div className="doc-icon">
                                <Icon name="document" size={14} />
                              </div>
                              <p className="doc-text">PDF/Image (Max 5MB)</p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleOwnerProofChange}
                                className="doc-input"
                              />
                            </div>
                            {ownerProofPreview && (
                              <div className="doc-preview">
                                <Icon name="check" size={10} />
                                <span>{ownerProofPreview.name}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="field-group">
                            <label className="field-label">Property Proof (Bill/Document) *</label>
                            <div className="doc-upload">
                              <div className="doc-icon">
                                <Icon name="document" size={14} />
                              </div>
                              <p className="doc-text">Electricity/Water Bill etc. (Max 5MB)</p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handlePropertyProofChange}
                                className="doc-input"
                              />
                            </div>
                            {propertyProofPreview && (
                              <div className="doc-preview">
                                <Icon name="check" size={10} />
                                <span>{propertyProofPreview.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* ✅ COMPACT: Submit Button */}
                    <div className="submit-section">
                      <Button 
                        type="submit" 
                        size="lg"
                        disabled={loading || uploadingImages}
                        className="submit-btn"
                      >
                        {loading ? (
                          <div className="btn-content">
                            <Spinner animation="border" size="sm" />
                            <span>Adding Property...</span>
                          </div>
                        ) : (
                          <div className="btn-content">
                            <Icon name="upload" size={16} />
                            <span>Add Property to Platform</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ SUPER COMPACT CSS - No wasted space */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .property-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 12px 0;
        }
        
        /* Minimal Background Animations */
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
            rgba(124, 58, 237, 0.03) 0%, 
            transparent 25%, 
            rgba(59, 130, 246, 0.02) 50%, 
            transparent 75%, 
            rgba(16, 185, 129, 0.03) 100%);
          animation: gradientShift 20s ease-in-out infinite;
        }
        
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(124, 58, 237, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 30s linear infinite;
        }
        
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(25px);
          opacity: 0.4;
        }
        
        .orb-1 {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.03) 40%, transparent 70%);
          top: 10%;
          left: 8%;
          animation: float1 15s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.03) 40%, transparent 70%);
          top: 70%;
          right: 10%;
          animation: float2 18s ease-in-out infinite;
        }
        
        .mouse-follower {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(12px);
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
          background: rgba(124, 58, 237, 0.3);
        }
        
        .particle-1 { 
          width: 2px; 
          height: 2px; 
          animation: particle1 25s linear infinite; 
        }
        .particle-2 { 
          width: 1.5px; 
          height: 1.5px; 
          background: rgba(59, 130, 246, 0.3);
          animation: particle2 30s linear infinite; 
        }
        .particle-3 { 
          width: 3px; 
          height: 3px; 
          background: rgba(16, 185, 129, 0.3);
          animation: particle3 28s linear infinite; 
        }
        
        /* Main Container */
        .main-container {
          position: relative;
          z-index: 10;
          padding: 0 12px;
        }
        
        /* ✅ SUPER COMPACT PAGE HEADER */
        .page-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.06),
            0 2px 8px rgba(124, 58, 237, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        
        .header-content {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        
        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 8px;
          padding: 6px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-text {
          flex: 1;
        }
        
        .page-title {
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .page-subtitle {
          margin: 0;
          color: #64748b;
          font-size: 0.8rem;
        }
        
        .header-progress {
          min-width: 180px;
        }
        
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .progress-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.75rem;
        }
        
        .progress-percentage {
          font-weight: 800;
          font-size: 0.85rem;
        }
        
        .progress-percentage.complete { color: #10b981; }
        .progress-percentage.incomplete { color: #f59e0b; }
        
        .progress-track {
          background: #e2e8f0;
          border-radius: 6px;
          height: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 6px;
          transition: all 0.3s ease;
        }
        
        .progress-fill.complete {
          background: linear-gradient(90deg, #34d399, #10b981);
        }
        
        .progress-fill.incomplete {
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
        }
        
        /* ✅ COMPACT FORM CARD - No empty space */
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          box-shadow: 
            0 6px 30px rgba(0, 0, 0, 0.08),
            0 3px 12px rgba(124, 58, 237, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }
        
        .form-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 40px rgba(0, 0, 0, 0.12),
            0 4px 16px rgba(124, 58, 237, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .form-body {
          padding: 20px !important;
        }
        
        /* ✅ COMPACT FORM SECTIONS */
        .form-section {
          margin-bottom: 18px;
        }
        
        .section-title {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.9rem;
        }
        
        .form-row {
          margin-bottom: 12px;
        }
        
        .field-group {
          margin-bottom: 12px;
        }
        
        .field-label {
          color: #374151;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 4px;
          display: block;
        }
        
        .field-input {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(209, 213, 219, 0.6) !important;
          border-radius: 6px !important;
          padding: 8px 10px !important;
          color: #111827 !important;
          font-size: 0.8rem !important;
          transition: all 0.3s ease !important;
          font-family: 'Inter', sans-serif !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        }
        
        .field-input::placeholder {
          color: #9ca3af !important;
          font-size: 0.75rem !important;
        }
        
        .field-input:focus {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1) !important;
          transform: scale(1.005);
        }
        
        .textarea-input {
          min-height: 80px !important;
          resize: vertical !important;
        }
        
        /* ✅ COMPACT RENTAL OPTIONS */
        .rental-options {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .rental-option {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(156, 163, 175, 0.3);
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        
        .rental-option.selected {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
          border-color: rgba(16, 185, 129, 0.4);
        }
        
        .rental-checkbox {
          font-size: 0.75rem !important;
          font-weight: 600 !important;
          pointer-events: none !important;
        }
        
        /* ✅ COMPACT UPLOAD ZONES */
        .upload-zone {
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 8px;
          padding: 14px;
          text-align: center;
          background: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }
        
        .upload-icon-small {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          color: white;
        }
        
        .upload-text {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          font-size: 0.8rem;
        }
        
        .upload-input {
          border-radius: 4px !important;
          border: 1px solid rgba(124, 58, 237, 0.2) !important;
          padding: 6px !important;
          font-size: 0.75rem !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }
        
        .upload-progress {
          margin-top: 10px;
        }
        
        .progress-text {
          color: #64748b;
          font-size: 0.75rem;
          margin-top: 4px;
          display: block;
        }
        
        /* ✅ COMPACT IMAGE PREVIEWS */
        .image-previews {
          margin-top: 12px;
        }
        
        .preview-header {
          margin-bottom: 8px;
        }
        
        .image-count {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.65rem;
        }
        
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 6px;
        }
        
        .preview-item {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .preview-img {
          width: 100%;
          height: 60px;
          object-fit: cover;
        }
        
        .remove-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
        }
        
        .remove-btn:hover {
          background: #dc2626;
        }
        
        /* ✅ COMPACT DOCUMENT UPLOAD */
        .doc-upload {
          border: 1px dashed rgba(124, 58, 237, 0.3);
          border-radius: 6px;
          padding: 10px;
          text-align: center;
          background: rgba(255, 255, 255, 0.6);
        }
        
        .doc-icon {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 6px;
          color: white;
        }
        
        .doc-text {
          font-size: 0.7rem;
          color: #64748b;
          margin-bottom: 8px;
        }
        
        .doc-input {
          border-radius: 4px !important;
          font-size: 0.7rem !important;
          padding: 4px !important;
        }
        
        .doc-preview {
          margin-top: 6px;
          padding: 4px 8px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(34, 197, 94, 0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          color: #16a34a;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        /* ✅ COMPACT ALERTS */
        .form-alert {
          border-radius: 6px !important;
          font-weight: 600 !important;
          margin-bottom: 12px !important;
          padding: 8px 12px !important;
          font-size: 0.8rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        
        .success-alert {
          background: rgba(16, 185, 129, 0.1) !important;
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          color: #065f46 !important;
        }
        
        .error-alert {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          color: #991b1b !important;
        }
        
        /* ✅ COMPACT SUBMIT SECTION */
        .submit-section {
          text-align: center;
          margin-top: 20px;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 10px 24px !important;
          color: white !important;
          font-size: 0.9rem !important;
          font-weight: 700 !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 3px 12px rgba(124, 58, 237, 0.25) !important;
          min-width: 200px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
          transform: translateY(-1px) scale(1.02) !important;
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35) !important;
        }
        
        .submit-btn:active {
          transform: translateY(0) scale(1) !important;
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        
        /* Animations */
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(15px, -15px) rotate(180deg) scale(1.05); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-10px, -20px) rotate(-180deg) scale(0.95); }
        }
        
        @keyframes particle1 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) translateX(60px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes particle2 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(-40px) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes particle3 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) translateX(30px) rotate(180deg); opacity: 0; }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .property-container {
            padding: 8px 0;
          }
          
          .main-container {
            padding: 0 8px;
          }
          
          .header-content {
            flex-direction: column;
            gap: 10px;
            padding: 10px 12px;
          }
          
          .header-progress {
            min-width: 100%;
          }
          
          .page-title { 
            font-size: 1.1rem; 
          }
          
          .form-body {
            padding: 15px !important;
          }
          
          .rental-options { 
            flex-direction: column; 
            gap: 4px;
          }
          
          .preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          }
          
          .preview-img {
            height: 50px;
          }
          
          .orb-1 { 
            width: 80px; 
            height: 80px; 
          }
          
          .orb-2 { 
            width: 60px; 
            height: 60px; 
          }
        }
      `}</style>
    </>
  );
};

export default AddProperty;
