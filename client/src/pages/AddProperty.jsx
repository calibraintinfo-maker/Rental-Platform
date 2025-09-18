import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
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
  images: [], // Changed from single image to multiple images
  ownerProof: null, // PDF or image
  propertyProof: null // PDF or image
  });
  const [imagePreviews, setImagePreviews] = useState([]); // Changed to array for multiple previews
  const [ownerProofPreview, setOwnerProofPreview] = useState(null);
  const [propertyProofPreview, setPropertyProofPreview] = useState(null);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

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

    // Reset subtype when category changes
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

    // Limit to maximum 5 images
    if (formData.images.length + files.length > 5) {
      setError('You can upload maximum 5 images');
      return;
    }

    try {
      const newImages = [];
      const newPreviews = [];

      for (const file of files) {
        // Check file size (max 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image.`);
          return;
        }

        const base64 = await convertImageToBase64(file);
        newImages.push(base64);
        newPreviews.push({
          id: Date.now() + Math.random(),
          src: base64,
          name: file.name
        });
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Error processing images. Please try again.');
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
      setSuccess('Property added successfully!');
      
      // Redirect to manage properties after 2 seconds
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

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">🏠 Add New Property</h4>
            </Card.Header>
            <Card.Body>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
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
                    <Form.Group className="mb-3">
                      <Form.Label>Subtype {formData.category !== 'Event' && '*'}</Form.Label>
                      <Form.Select
                        name="subtype"
                        value={formData.subtype}
                        onChange={handleInputChange}
                        disabled={!formData.category}
                        required={formData.category !== 'Event'}
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
                  <Form.Label>Property Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter property title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property in detail"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹) *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Size *</Form.Label>
                      <Form.Control
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="e.g., 1000 sq ft, 2 BHK"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Rent Type *</Form.Label>
                  <div>
                    {formData.category && categories[formData.category]?.rentTypes.map(type => (
                      <Form.Check
                        key={type}
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
                      />
                    ))}
                  </div>
                </Form.Group>

                <h5 className="mb-3">Address Information</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                        maxLength="6"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Contact Information *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Enter contact number or email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Property Images * (Maximum 5 images)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Upload multiple property images. Maximum file size: 5MB per image.
                  </Form.Text>
                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <h6>Image Previews:</h6>
                      <Row className="g-3">
                        {imagePreviews.map((preview, index) => (
                          <Col key={preview.id} md={4} sm={6}>
                            <div className="image-preview-container position-relative">
                              <img 
                                src={preview.src} 
                                alt={`Property Preview ${index + 1}`} 
                                className="image-preview w-100"
                                style={{ 
                                  height: '200px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px',
                                  border: '2px solid #dee2e6'
                                }}
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1"
                                onClick={() => removeImage(index)}
                                style={{ zIndex: 10 }}
                              >
                                ✕
                              </Button>
                              <div className="mt-1">
                                <small className="text-muted">
                                  Image {index + 1} of {imagePreviews.length}
                                </small>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <div className="mt-2 text-info">
                        <small>
                          📸 {imagePreviews.length}/5 images uploaded
                          {imagePreviews.length < 5 && ' • You can upload more images'}
                        </small>
                      </div>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Owner Proof * (Aadhar Card or PAN Card, PDF/Image)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleOwnerProofChange}
                  />
                  {ownerProofPreview && (
                    <div className="mt-2">
                      <strong>Uploaded:</strong> {ownerProofPreview.name}
                      {ownerProofPreview.type.startsWith('image/') ? (
                        <img src={ownerProofPreview.src} alt="Owner Proof Preview" style={{ maxWidth: '120px', maxHeight: '120px', marginLeft: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                      ) : (
                        <span className="ms-2 text-muted">[PDF]</span>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Property Proof * (Electricity Bill, Water Bill, Tax Receipt, Lease Agreement - PDF/Image)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handlePropertyProofChange}
                  />
                  {propertyProofPreview && (
                    <div className="mt-2">
                      <strong>Uploaded:</strong> {propertyProofPreview.name}
                      {propertyProofPreview.type.startsWith('image/') ? (
                        <img src={propertyProofPreview.src} alt="Property Proof Preview" style={{ maxWidth: '120px', maxHeight: '120px', marginLeft: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                      ) : (
                        <span className="ms-2 text-muted">[PDF]</span>
                      )}
                    </div>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Adding Property...' : 'Add Property'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProperty;
