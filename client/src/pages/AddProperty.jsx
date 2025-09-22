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
        {/* ✅ SAME BEAUTIFUL BACKGROUND ANIMATIONS */}
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

        <Container className="main-container">
          <Row className="justify-content-center">
            <Col xxl={8} xl={9} lg={10} md={11} sm={12}>
              
              {/* ✅ PERFECT HEADER CARD - Modern & Clean */}
              <div className="glass-header-card">
                <div className="header-content">
                  <div className="header-left">
                    <div className="header-icon-wrapper">
                      <div className="header-icon">
                        <Icon name="sparkles" size={22} />
                      </div>
                    </div>
                    <div className="header-text">
                      <h1 className="header-title">Add New Property</h1>
                      <p className="header-subtitle">List your premium property and connect with verified tenants</p>
                    </div>
                  </div>
                  <div className="header-right">
                    <div className="progress-card">
                      <div className="progress-header">
                        <span className="progress-label">Form Completion</span>
                        <span className={`progress-percentage ${completeness === 100 ? 'complete' : ''}`}>
                          {completeness}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className={`progress-fill ${completeness === 100 ? 'complete' : ''}`}
                          style={{ width: `${completeness}%` }}
                        />
                      </div>
                      <p className="progress-hint">Complete all fields to submit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ PERFECT MAIN FORM CARD - Glassmorphism & Modern */}
              <div className="glass-form-card">
                
                {/* Alerts Section */}
                {success && (
                  <div className="alert success-alert">
                    <Icon name="check" size={16} />
                    <span>{success}</span>
                  </div>
                )}
                
                {error && (
                  <div className="alert error-alert">
                    <Icon name="alertCircle" size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <Form onSubmit={handleSubmit} className="modern-form">
                  
                  {/* ✅ SECTION 1: Property Details */}
                  <div className="form-section">
                    <div className="section-header">
                      <h3 className="section-title">Property Details</h3>
                      <div className="section-line"></div>
                    </div>
                    
                    <Row className="g-3 mb-3">
                      <Col lg={3} md={6} sm={6}>
                        <div className="input-group">
                          <label className="input-label">Category *</label>
                          <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="modern-input"
                          >
                            <option value="">Select Category</option>
                            {Object.keys(categories).map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </Form.Select>
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6} sm={6}>
                        <div className="input-group">
                          <label className="input-label">Subtype {formData.category !== 'Event' && '*'}</label>
                          <Form.Select
                            name="subtype"
                            value={formData.subtype}
                            onChange={handleInputChange}
                            disabled={!formData.category}
                            required={formData.category !== 'Event'}
                            className="modern-input"
                          >
                            <option value="">Select Subtype</option>
                            {formData.category && categories[formData.category]?.subtypes.map(subtype => (
                              <option key={subtype} value={subtype}>{subtype}</option>
                            ))}
                          </Form.Select>
                        </div>
                      </Col>

                      <Col lg={3} md={6} sm={6}>
                        <div className="input-group">
                          <label className="input-label">Price (₹) *</label>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            min="0"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                      
                      <Col lg={3} md={6} sm={6}>
                        <div className="input-group">
                          <label className="input-label">Size/Capacity *</label>
                          <Form.Control
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleInputChange}
                            placeholder="e.g., 1000 sq ft"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row className="g-3 mb-3">
                      <Col lg={8} md={8}>
                        <div className="input-group">
                          <label className="input-label">Property Title *</label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter an attractive property title"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                      <Col lg={4} md={4}>
                        <div className="input-group">
                          <label className="input-label">Contact *</label>
                          <Form.Control
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Phone/Email"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                    </Row>

                    <div className="input-group mb-3">
                      <label className="input-label">Property Description *</label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your property - amenities, location benefits, unique features..."
                        required
                        className="modern-input modern-textarea"
                      />
                    </div>

                    {/* Rental Options */}
                    <div className="input-group">
                      <label className="input-label">Rental Options *</label>
                      <div className="rental-options">
                        {formData.category && categories[formData.category]?.rentTypes.map(type => (
                          <div 
                            key={type}
                            className={`rental-chip ${formData.rentType.includes(type) ? 'selected' : ''}`}
                            onClick={() => {
                              const value = type;
                              const newRentTypes = formData.rentType.includes(value)
                                ? formData.rentType.filter(t => t !== value)
                                : [...formData.rentType, value];
                              setFormData({ ...formData, rentType: newRentTypes });
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

                  {/* ✅ SECTION 2: Location */}
                  <div className="form-section">
                    <div className="section-header">
                      <h3 className="section-title">Location Details</h3>
                      <div className="section-line"></div>
                    </div>
                    
                    <Row className="g-3">
                      <Col lg={6} md={12}>
                        <div className="input-group">
                          <label className="input-label">Street Address</label>
                          <Form.Control
                            type="text"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                            placeholder="Complete address"
                            className="modern-input"
                          />
                        </div>
                      </Col>
                      <Col lg={2} md={4}>
                        <div className="input-group">
                          <label className="input-label">City *</label>
                          <Form.Control
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                      <Col lg={2} md={4}>
                        <div className="input-group">
                          <label className="input-label">State *</label>
                          <Form.Control
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                      <Col lg={2} md={4}>
                        <div className="input-group">
                          <label className="input-label">Pincode *</label>
                          <Form.Control
                            type="text"
                            name="address.pincode"
                            value={formData.address.pincode}
                            onChange={handleInputChange}
                            placeholder="6-digit"
                            maxLength="6"
                            required
                            className="modern-input"
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* ✅ SECTION 3: Media & Documents */}
                  <div className="form-section">
                    <div className="section-header">
                      <h3 className="section-title">Media & Documents</h3>
                      <div className="section-line"></div>
                    </div>
                    
                    <Row className="g-4">
                      <Col lg={6} md={12}>
                        <div className="upload-section">
                          <label className="input-label">Property Images *</label>
                          
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
                        </div>
                      </Col>
                      
                      <Col lg={6} md={12}>
                        <div className="documents-section">
                          <label className="input-label">Required Documents *</label>
                          
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
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* ✅ SUBMIT SECTION */}
                  <div className="submit-section">
                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={loading || uploadingImages}
                      className="submit-button"
                    >
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
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ✅ PERFECT MODERN STYLING - Glassmorphism + Clean Design */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .property-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #667eea 50%, #764ba2 75%, #667eea 100%);
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 2rem 0;
        }
        
        /* ✅ SAME BEAUTIFUL BACKGROUND ANIMATIONS */
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
            rgba(102, 126, 234, 0.1) 0%, 
            transparent 25%, 
            rgba(118, 75, 162, 0.1) 50%, 
            transparent 75%, 
            rgba(102, 126, 234, 0.1) 100%);
          animation: gradientShift 20s ease-in-out infinite;
        }
        
        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 30s linear infinite;
        }
        
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.3;
        }
        
        .orb-1 {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%);
          top: 10%;
          left: 5%;
          animation: float1 15s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%);
          top: 60%;
          right: 10%;
          animation: float2 18s ease-in-out infinite;
        }
        
        .mouse-follower {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(20px);
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
          background: rgba(255, 255, 255, 0.4);
        }
        
        .particle-1 { 
          width: 3px; 
          height: 3px; 
          animation: particle1 25s linear infinite; 
        }
        .particle-2 { 
          width: 2px; 
          height: 2px; 
          animation: particle2 30s linear infinite; 
        }
        .particle-3 { 
          width: 4px; 
          height: 4px; 
          animation: particle3 28s linear infinite; 
        }
        
        /* Main Container */
        .main-container {
          position: relative;
          z-index: 10;
          max-width: 1200px;
        }
        
        /* ✅ PERFECT HEADER CARD - Modern Glassmorphism */
        .glass-header-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px) saturate(200%);
          -webkit-backdrop-filter: blur(25px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 4px 16px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-header-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.15),
            0 6px 24px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .header-icon-wrapper {
          position: relative;
        }
        
        .header-icon {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 1rem;
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .header-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .header-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        /* Progress Card */
        .progress-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          min-width: 280px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .progress-label {
          font-weight: 600;
          color: white;
          font-size: 0.9rem;
        }
        
        .progress-percentage {
          font-weight: 800;
          font-size: 1.1rem;
          color: #fbbf24;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .progress-percentage.complete { 
          color: #10b981; 
        }
        
        .progress-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
        }
        
        .progress-fill.complete {
          background: linear-gradient(90deg, #34d399, #10b981);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }
        
        .progress-hint {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          margin: 0;
          font-style: italic;
        }
        
        /* ✅ PERFECT FORM CARD - Modern Glassmorphism */
        .glass-form-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.12),
            0 5px 20px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-form-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 15px 60px rgba(0, 0, 0, 0.18),
            0 8px 30px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        
        /* Form Sections */
        .form-section {
          margin-bottom: 2.5rem;
        }
        
        .form-section:last-child {
          margin-bottom: 0;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .section-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), transparent);
        }
        
        /* Input Groups */
        .input-group {
          margin-bottom: 1rem;
        }
        
        .input-label {
          display: block;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .modern-input {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          padding: 0.875rem 1rem !important;
          color: white !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        }
        
        .modern-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          font-weight: 400 !important;
        }
        
        .modern-input:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow: 
            0 0 0 3px rgba(255, 255, 255, 0.1) !important,
            0 4px 16px rgba(0, 0, 0, 0.12) !important;
          transform: translateY(-1px) !important;
        }
        
        .modern-textarea {
          min-height: 100px !important;
          resize: vertical !important;
        }
        
        /* Rental Options */
        .rental-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        
        .rental-chip {
          background: rgba(255, 255, 255, 0.1);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          backdrop-filter: blur(10px);
        }
        
        .rental-chip:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }
        
        .rental-chip.selected {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        
        .rental-checkbox {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          pointer-events: none !important;
          color: white !important;
        }
        
        .rental-checkbox .form-check-input {
          display: none !important;
        }
        
        /* Upload Areas */
        .upload-section,
        .documents-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .upload-area {
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }
        
        .upload-area:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .upload-icon {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .upload-title {
          color: white;
          font-weight: 700;
          margin: 0;
          font-size: 1.1rem;
        }
        
        .upload-text {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 0.9rem;
        }
        
        .upload-input {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          padding: 0.5rem !important;
          color: white !important;
          font-size: 0.85rem !important;
        }
        
        /* Document Upload */
        .document-upload {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .doc-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .doc-input {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          padding: 0.5rem !important;
          color: white !important;
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
          gap: 0.5rem;
          color: #10b981;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* Image Previews */
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
        .alert {
          border-radius: 12px !important;
          padding: 1rem 1.25rem !important;
          margin-bottom: 1.5rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .success-alert {
          background: rgba(16, 185, 129, 0.2) !important;
          border: 1px solid rgba(16, 185, 129, 0.4) !important;
          color: #10b981 !important;
        }
        
        .error-alert {
          background: rgba(239, 68, 68, 0.2) !important;
          border: 1px solid rgba(239, 68, 68, 0.4) !important;
          color: #ef4444 !important;
        }
        
        /* Submit Section */
        .submit-section {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border: none !important;
          border-radius: 16px !important;
          padding: 1rem 2.5rem !important;
          color: white !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
          min-width: 280px;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.75rem !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5) !important;
        }
        
        .submit-button:active {
          transform: translateY(-1px) scale(1) !important;
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }
        
        /* Upload Progress */
        .upload-progress {
          margin-top: 1rem;
        }
        
        .progress-bar {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          height: 6px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-bar .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          transition: width 0.3s ease;
        }
        
        .progress-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* ✅ SAME BEAUTIFUL ANIMATIONS */
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(20px, -20px) rotate(180deg) scale(1.1); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-15px, -25px) rotate(-180deg) scale(0.9); }
        }
        
        @keyframes particle1 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) translateX(80px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes particle2 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) translateX(-60px) rotate(-360deg); opacity: 0; }
        }
        
        @keyframes particle3 {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-10vh) translateX(40px) rotate(180deg); opacity: 0; }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        /* ✅ PERFECT RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .property-container {
            padding: 1rem 0;
          }
          
          .main-container {
            padding: 0 1rem;
          }
          
          .glass-header-card,
          .glass-form-card {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          
          .header-title { 
            font-size: 1.5rem; 
          }
          
          .header-subtitle {
            font-size: 0.9rem;
          }
          
          .progress-card {
            min-width: 100%;
          }
          
          .rental-options { 
            flex-direction: column; 
            gap: 0.5rem;
          }
          
          .preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }
          
          .orb-1 { 
            width: 150px; 
            height: 150px; 
          }
          
          .orb-2 { 
            width: 100px; 
            height: 100px; 
          }
          
          .submit-button {
            min-width: 100%;
            padding: 0.875rem 2rem !important;
            font-size: 1rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .form-section {
            margin-bottom: 2rem;
          }
          
          .upload-area {
            padding: 1.5rem;
          }
          
          .upload-icon {
            width: 50px;
            height: 50px;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </>
  );
};

export default AddProperty;
