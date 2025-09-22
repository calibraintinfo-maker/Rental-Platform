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
              
              {/* ✅ PROPER HEADER CARD - Clean and Visible */}
              <Card className="header-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="header-icon">
                          <Icon name="sparkles" size={24} />
                        </div>
                        <div>
                          <h2 className="header-title">Add New Property</h2>
                          <p className="header-subtitle">List your premium property and connect with verified tenants</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="progress-section">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="progress-label">Form Completion</span>
                          <span className={`progress-percentage ${completeness === 100 ? 'complete' : ''}`}>
                            {completeness}%
                          </span>
                        </div>
                        <div className="progress-bar-container">
                          <div 
                            className={`progress-bar-fill ${completeness === 100 ? 'complete' : ''}`}
                            style={{ width: `${completeness}%` }}
                          />
                        </div>
                        <p className="progress-helper">Complete all fields to submit your property listing</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* ✅ MAIN FORM CARD - Properly Structured */}
              <Card className="form-card">
                <Card.Body>
                  
                  {/* Alerts */}
                  {success && (
                    <Alert variant="success" className="form-alert success-alert">
                      <Icon name="check" size={16} />
                      <span>{success}</span>
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert variant="danger" className="form-alert error-alert">
                      <Icon name="alertCircle" size={16} />
                      <span>{error}</span>
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit} className="property-form">
                    
                    {/* ✅ SECTION 1: Property Details */}
                    <div className="form-section">
                      <h5 className="section-title">Property Details</h5>
                      
                      <Row className="g-3">
                        <Col lg={3} md={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">Category *</Form.Label>
                            <Form.Select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              className="form-input"
                            >
                              <option value="">Select</option>
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
                            <Form.Label className="form-label">Subtype {formData.category !== 'Event' && '*'}</Form.Label>
                            <Form.Select
                              name="subtype"
                              value={formData.subtype}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              required={formData.category !== 'Event'}
                              className="form-input"
                            >
                              <option value="">Select</option>
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
                            <Form.Label className="form-label">Price (₹) *</Form.Label>
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
                            <Form.Label className="form-label">Size/Capacity *</Form.Label>
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
                            <Form.Label className="form-label">Property Title *</Form.Label>
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
                            <Form.Label className="form-label">Contact *</Form.Label>
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

                      <Form.Group className="form-group">
                        <Form.Label className="form-label">Property Description *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your property - amenities, location benefits, unique features..."
                          required
                          className="form-input textarea-input"
                        />
                      </Form.Group>

                      {/* Rental Options */}
                      <div className="form-group">
                        <Form.Label className="form-label">Rental Options *</Form.Label>
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

                    {/* ✅ SECTION 2: Location */}
                    <div className="form-section">
                      <h5 className="section-title">Location</h5>
                      
                      <Row className="g-3">
                        <Col lg={6} md={12}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">Street Address</Form.Label>
                            <Form.Control
                              type="text"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleInputChange}
                              placeholder="Complete address"
                              className="form-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={2} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">City *</Form.Label>
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
                        <Col lg={2} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">State *</Form.Label>
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
                        <Col lg={2} md={4}>
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">Pincode *</Form.Label>
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

                    {/* ✅ SECTION 3: Property Images & Documents */}
                    <Row className="g-4">
                      <Col lg={6} md={12}>
                        <div className="form-section">
                          <h5 className="section-title">Property Images *</h5>
                          
                          <div className="upload-zone">
                            <div className="upload-icon">
                              <Icon name="upload" size={24} />
                            </div>
                            <h6 className="upload-title">Upload Property Images</h6>
                            <p className="upload-description">Maximum 5 images, up to 5MB each</p>
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
                                <div className="progress-container">
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
                                <Badge bg="primary" className="image-count">{imagePreviews.length}/5 images</Badge>
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
                        <div className="form-section">
                          <h5 className="section-title">Documents *</h5>
                          
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">Owner Proof (Aadhar/PAN) *</Form.Label>
                            <div className="doc-upload">
                              <div className="doc-icon">
                                <Icon name="document" size={20} />
                              </div>
                              <p className="doc-text">Upload PDF or Image (Max 5MB)</p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleOwnerProofChange}
                                className="doc-input"
                              />
                            </div>
                            {ownerProofPreview && (
                              <div className="doc-preview">
                                <Icon name="check" size={14} />
                                <span>{ownerProofPreview.name}</span>
                              </div>
                            )}
                          </Form.Group>
                          
                          <Form.Group className="form-group">
                            <Form.Label className="form-label">Property Proof (Utility Bill/Document) *</Form.Label>
                            <div className="doc-upload">
                              <div className="doc-icon">
                                <Icon name="document" size={20} />
                              </div>
                              <p className="doc-text">Electricity/Water Bill, Tax Receipt, etc. (Max 5MB)</p>
                              <Form.Control
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handlePropertyProofChange}
                                className="doc-input"
                              />
                            </div>
                            {propertyProofPreview && (
                              <div className="doc-preview">
                                <Icon name="check" size={14} />
                                <span>{propertyProofPreview.name}</span>
                              </div>
                            )}
                          </Form.Group>
                        </div>
                      </Col>
                    </Row>

                    {/* ✅ SUBMIT BUTTON */}
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
                            <Icon name="upload" size={18} />
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

      {/* ✅ PERFECT CSS - Professional and Clean */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .property-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 20px 0;
        }
        
        /* Background Animations */
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
          filter: blur(30px);
          opacity: 0.4;
        }
        
        .orb-1 {
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.03) 40%, transparent 70%);
          top: 10%;
          left: 8%;
          animation: float1 15s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.03) 40%, transparent 70%);
          top: 70%;
          right: 10%;
          animation: float2 18s ease-in-out infinite;
        }
        
        .mouse-follower {
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(15px);
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
          padding: 0 20px;
        }
        
        /* ✅ HEADER CARD - Clean and Professional */
        .header-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          margin-bottom: 20px;
          box-shadow: 
            0 6px 25px rgba(0, 0, 0, 0.08),
            0 3px 10px rgba(124, 58, 237, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }
        
        .header-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 35px rgba(0, 0, 0, 0.12),
            0 4px 14px rgba(124, 58, 237, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .header-card .card-body {
          padding: 24px !important;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          padding: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .header-title {
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          font-size: 1.75rem;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .header-subtitle {
          margin: 4px 0 0 0;
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
        }
        
        /* Progress Section */
        .progress-section {
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .progress-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }
        
        .progress-percentage {
          font-weight: 800;
          font-size: 1rem;
          color: #f59e0b;
        }
        
        .progress-percentage.complete { 
          color: #10b981; 
        }
        
        .progress-bar-container {
          background: #e2e8f0;
          border-radius: 8px;
          height: 6px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-bar-fill {
          height: 100%;
          border-radius: 8px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          transition: all 0.4s ease;
        }
        
        .progress-bar-fill.complete {
          background: linear-gradient(90deg, #34d399, #10b981);
        }
        
        .progress-helper {
          color: #64748b;
          font-size: 0.8rem;
          margin: 0;
          font-style: italic;
        }
        
        /* ✅ FORM CARD - Properly Structured */
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          box-shadow: 
            0 8px 30px rgba(0, 0, 0, 0.1),
            0 4px 15px rgba(124, 58, 237, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }
        
        .form-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.15),
            0 6px 20px rgba(124, 58, 237, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        
        .form-card .card-body {
          padding: 32px !important;
        }
        
        /* Form Sections */
        .form-section {
          margin-bottom: 32px;
        }
        
        .section-title {
          color: #1e293b;
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 3px solid #e2e8f0;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 2px;
        }
        
        /* Form Groups */
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          color: #374151;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }
        
        .form-input {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(209, 213, 219, 0.6) !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          color: #111827 !important;
          font-size: 0.9rem !important;
          transition: all 0.3s ease !important;
          font-family: 'Inter', sans-serif !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
        }
        
        .form-input::placeholder {
          color: #9ca3af !important;
          font-size: 0.85rem !important;
        }
        
        .form-input:focus {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1) !important;
          transform: scale(1.002);
        }
        
        .textarea-input {
          min-height: 100px !important;
          resize: vertical !important;
        }
        
        /* Rental Options */
        .rental-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .rental-option {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(156, 163, 175, 0.3);
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
        }
        
        .rental-option:hover {
          background: rgba(124, 58, 237, 0.05);
          border-color: rgba(124, 58, 237, 0.3);
          transform: translateY(-1px);
        }
        
        .rental-option.selected {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
        }
        
        .rental-checkbox {
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          pointer-events: none !important;
        }
        
        /* Upload Zones */
        .upload-zone {
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          background: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        
        .upload-zone:hover {
          border-color: rgba(124, 58, 237, 0.5);
          background: rgba(124, 58, 237, 0.02);
        }
        
        .upload-icon {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: white;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }
        
        .upload-title {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
          font-size: 1.1rem;
        }
        
        .upload-description {
          color: #64748b;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }
        
        .upload-input {
          border-radius: 6px !important;
          border: 2px solid rgba(124, 58, 237, 0.2) !important;
          padding: 8px !important;
          font-size: 0.85rem !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }
        
        .upload-progress {
          margin-top: 16px;
        }
        
        .progress-container {
          background: #e2e8f0;
          border-radius: 6px;
          height: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 6px;
          background: linear-gradient(90deg, #34d399, #10b981);
          transition: all 0.3s ease;
        }
        
        .progress-text {
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        /* Image Previews */
        .image-previews {
          margin-top: 20px;
        }
        
        .preview-header {
          margin-bottom: 12px;
        }
        
        .image-count {
          font-size: 0.8rem;
          padding: 4px 10px;
        }
        
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
        }
        
        .preview-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        
        .preview-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .preview-img {
          width: 100%;
          height: 80px;
          object-fit: cover;
        }
        
        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4444;
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .remove-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }
        
        /* Document Upload */
        .doc-upload {
          border: 2px dashed rgba(124, 58, 237, 0.3);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }
        
        .doc-upload:hover {
          border-color: rgba(124, 58, 237, 0.5);
          background: rgba(124, 58, 237, 0.02);
        }
        
        .doc-icon {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          color: white;
        }
        
        .doc-text {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 12px;
        }
        
        .doc-input {
          border-radius: 6px !important;
          font-size: 0.8rem !important;
          padding: 6px !important;
        }
        
        .doc-preview {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(34, 197, 94, 0.2);
          display: flex;
          align-items: center;
          gap: 8px;
          color: #16a34a;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        /* Alerts */
        .form-alert {
          border-radius: 8px !important;
          font-weight: 600 !important;
          margin-bottom: 20px !important;
          padding: 12px 16px !important;
          font-size: 0.9rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
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
        
        /* Submit Section */
        .submit-section {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #f1f5f9;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 16px 32px !important;
          color: white !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3) !important;
          min-width: 250px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 100%) !important;
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4) !important;
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
          gap: 8px;
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
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .property-container {
            padding: 16px 0;
          }
          
          .main-container {
            padding: 0 16px;
          }
          
          .header-card .card-body,
          .form-card .card-body {
            padding: 20px !important;
          }
          
          .header-title { 
            font-size: 1.4rem; 
          }
          
          .header-subtitle {
            font-size: 0.9rem;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
          
          .rental-options { 
            flex-direction: column; 
            gap: 8px;
          }
          
          .preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          }
          
          .preview-img {
            height: 60px;
          }
          
          .orb-1 { 
            width: 100px; 
            height: 100px; 
          }
          
          .orb-2 { 
            width: 80px; 
            height: 80px; 
          }
          
          .submit-btn {
            min-width: 200px;
            padding: 14px 24px !important;
            font-size: 0.9rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .progress-section {
            margin-top: 16px;
          }
          
          .form-section {
            margin-bottom: 24px;
          }
          
          .upload-zone {
            padding: 16px;
          }
          
          .upload-icon {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default AddProperty;
