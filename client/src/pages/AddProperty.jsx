import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    rentType: [],
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    contact: ''
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);
  const [ownerProofPreview, setOwnerProofPreview] = useState(null);
  const [propertyProofPreview, setPropertyProofPreview] = useState(null);

  const categories = {
    'Property Rentals': {
      rentTypes: ['daily', 'weekly', 'monthly', 'yearly'],
      subtypes: ['Villa', 'Apartment', 'House', 'Studio', 'Flat']
    },
    'Commercial': {
      rentTypes: ['monthly', 'yearly'],
      subtypes: ['Office', 'Shop', 'Warehouse', 'Showroom']
    },
    'Event': {
      rentTypes: ['hourly', 'daily'],
      subtypes: ['Banquet Hall', 'Garden', 'Meeting Room']
    },
    'Turf': {
      rentTypes: ['hourly', 'daily'],
      subtypes: ['Football Turf', 'Cricket Ground', 'Multi-Sport', 'Tennis Court']
    },
    'Parking': {
      rentTypes: ['daily', 'monthly'],
      subtypes: ['Car Parking', 'Bike Parking', 'Garage']
    },
    'Land': {
      rentTypes: ['monthly', 'yearly'],
      subtypes: ['Agricultural', 'Commercial Plot', 'Residential Plot']
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (imagePreviews.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);
    setUploadProgress(0);

    const newPreviews = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum 5MB allowed.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push({
          id: Date.now() + i,
          file: file,
          src: event.target.result
        });
        
        setUploadProgress(((i + 1) / files.length) * 100);
        
        if (newPreviews.length === files.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
          setUploadingImages(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleOwnerProofChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setOwnerProofPreview({
        file: file,
        name: file.name
      });
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handlePropertyProofChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setPropertyProofPreview({
        file: file,
        name: file.name
      });
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call would go here
      setTimeout(() => {
        setLoading(false);
        alert('Property added successfully!');
        navigate('/properties');
      }, 2000);
    } catch (error) {
      setLoading(false);
      alert('Error adding property: ' + error.message);
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh',
      lineHeight: 1.5,
      color: '#374151'
    }}>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #8b5cf6 20%, #7c3aed 45%, #a855f7 70%, #ec4899 100%)',
        padding: '4.5rem 0 4rem 0',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
          pointerEvents: 'none'
        }} />
        
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: '0.65rem 1.5rem',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backdropFilter: 'blur(10px)'
          }}>
            <strong>ADD YOUR PREMIUM PROPERTY</strong>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.8rem, 4.8vw, 3.5rem)',
            fontWeight: '900',
            lineHeight: 1.15,
            marginBottom: '1.75rem',
            letterSpacing: '-0.02em'
          }}>
            List Your <span style={{ color: 'white', fontWeight: '900' }}>Property</span>
          </h1>
          
          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.65,
            opacity: 0.95,
            margin: '0 auto',
            maxWidth: '680px'
          }}>
            Join our premium marketplace and connect with verified tenants.<br/>
            Quick listing process with professional verification.
          </p>
        </Container>
      </section>

      {/* MAIN CONTENT */}
      <section style={{ padding: '2rem 0', background: '#f8fafc' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card style={{
                background: 'rgba(255, 255, 255, 0.28)',
                backdropFilter: 'saturate(200%) blur(30px)',
                WebkitBackdropFilter: 'saturate(200%) blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                overflow: 'hidden'
              }}>
                <div style={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)',
                  pointerEvents: 'none'
                }} />

                <Card.Body style={{ padding: '2.5rem' }}>
                  <Form onSubmit={handleSubmit}>
                    
                    {/* BASIC INFORMATION SECTION */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.06), rgba(22, 163, 74, 0.04))',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '16px',
                      border: '1px solid rgba(34, 197, 94, 0.1)'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          borderRadius: '8px',
                          padding: '8px',
                          color: 'white'
                        }}>
                          <span>🏠</span>
                        </div>
                        <h5 style={{ 
                          fontWeight: '700', 
                          color: '#1e293b', 
                          margin: 0,
                          fontSize: '1.1rem'
                        }}>
                          Property Information
                        </h5>
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
                              placeholder="Enter property title"
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
                              {Object.keys(categories).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </Form.Select>
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
                              placeholder="Enter price"
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
                              Description *
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Describe your property"
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

                    {/* RENT TYPE SELECTION */}
                    {formData.category && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(5, 150, 105, 0.04))',
                        borderRadius: '14px',
                        padding: '16px',
                        marginBottom: '16px',
                        border: '1px solid rgba(16, 185, 129, 0.1)'
                      }}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '8px',
                            padding: '8px',
                            color: 'white'
                          }}>
                            <span>⏰</span>
                          </div>
                          <h5 style={{ 
                            fontWeight: '700', 
                            color: '#1e293b', 
                            margin: 0,
                            fontSize: '1.1rem'
                          }}>
                            Rental Options
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
                    )}

                    {/* ADDRESS SECTION */}
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
                          <span>📍</span>
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

                    {/* CONTACT SECTION */}
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
                          <span>📞</span>
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

                    {/* IMAGES SECTION */}
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
                          <span>🖼️</span>
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
                          <span>⬆️</span>
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
                                    ✕
                                  </Button>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </div>

                    {/* VERIFICATION DOCUMENTS SECTION */}
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
                          <span>📄</span>
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
                                <span>📄</span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
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
                              <div style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                              }}>
                                <div className="d-flex align-items-center gap-2">
                                  <span style={{ color: '#16a34a' }}>✓</span>
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
                                <span>📄</span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
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
                              <div style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                              }}>
                                <div className="d-flex align-items-center gap-2">
                                  <span style={{ color: '#16a34a' }}>✓</span>
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

                    {/* SUBMIT BUTTON */}
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
                            <span>⬆️</span>
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
      </section>
    </div>
  );
};

export default AddProperty;
