import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api, handleApiError, formatPrice, getImageUrl, categories, convertImageToBase64 } from '../utils/api';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editImagePreviews, setEditImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.properties.getUserProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDisableProperty = async (propertyId) => {
    try {
      await api.properties.disable(propertyId);
      setSuccess('Property disabled successfully');
      fetchProperties();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEnableProperty = async (propertyId) => {
    try {
      await api.properties.enable(propertyId);
      setSuccess('Property enabled successfully');
      fetchProperties();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const viewPropertyBookings = async (property) => {
    try {
      setSelectedProperty(property);
      const response = await api.properties.getPropertyBookings(property._id);
  setBookings(response.data);
  setShowBookingsModal(true);
  const openBookingDetailModal = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailModal(true);
  };

  const handleOwnerBookingAction = async (action, bookingId) => {
    try {
      if (action === 'approve') {
        await api.bookings.approve(bookingId);
        setSuccess('Booking approved');
      } else if (action === 'reject') {
        await api.bookings.reject(bookingId);
        setSuccess('Booking rejected');
      } else if (action === 'end') {
        await api.bookings.end(bookingId);
        setSuccess('Booking ended');
      }
      // Refresh bookings and details
      if (selectedProperty) viewPropertyBookings(selectedProperty);
      if (selectedBooking) setSelectedBooking(null);
      setShowBookingDetailModal(false);
    } catch (error) {
      setError(handleApiError(error));
    }
  };
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setEditFormData({
      category: property.category,
      subtype: property.subtype || '',
      title: property.title,
      description: property.description,
      price: property.price,
      size: property.size,
      rentType: property.rentType,
      address: {
        street: property.address.street || '',
        city: property.address.city,
        state: property.address.state,
        pincode: property.address.pincode
      },
      contact: property.contact,
      images: property.images || (property.image ? [property.image] : [])
    });
    
    // Set existing images as previews
    const existingPreviews = (property.images || (property.image ? [property.image] : [])).map((img, index) => ({
      id: `existing-${index}`,
      src: img,
      name: `Image ${index + 1}`,
      isExisting: true
    }));
    setEditImagePreviews(existingPreviews);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setEditFormData({
        ...editFormData,
        address: {
          ...editFormData.address,
          [addressField]: value
        }
      });
    } else if (name === 'rentType') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setEditFormData({
        ...editFormData,
        rentType: selectedOptions
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }

    // Reset subtype when category changes
    if (name === 'category') {
      setEditFormData(prev => ({
        ...prev,
        category: value,
        subtype: '',
        rentType: categories[value]?.rentTypes || []
      }));
    }
  };

  const handleEditImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to maximum 5 images total
    if (editFormData.images.length + files.length > 5) {
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
          name: file.name,
          isExisting: false
        });
      }

      setEditFormData({
        ...editFormData,
        images: [...editFormData.images, ...newImages]
      });
      setEditImagePreviews([...editImagePreviews, ...newPreviews]);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Error processing images. Please try again.');
    }
  };

  const removeEditImage = (index) => {
    const newImages = editFormData.images.filter((_, i) => i !== index);
    const newPreviews = editImagePreviews.filter((_, i) => i !== index);
    
    setEditFormData({
      ...editFormData,
      images: newImages
    });
    setEditImagePreviews(newPreviews);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError('');

    // Validation
    if (!editFormData.category || !editFormData.title || !editFormData.description || 
        !editFormData.price || !editFormData.size || editFormData.rentType.length === 0 ||
        !editFormData.address.city || !editFormData.address.state || !editFormData.address.pincode ||
        !editFormData.contact || editFormData.images.length === 0) {
      setError('All fields are required');
      setEditLoading(false);
      return;
    }

    try {
      await api.properties.update(selectedProperty._id, editFormData);
      setSuccess('Property updated successfully!');
      setShowEditModal(false);
      fetchProperties();
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusBadge = (property) => {
    if (property.isDisabled) {
      return <Badge bg="danger">Disabled</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your properties...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>🏠 Manage Properties</h2>
              <p className="text-muted mb-0">
                Manage all your listed properties and view bookings
              </p>
            </div>
            <Button as={Link} to="/add-property" variant="primary">
              ➕ Add New Property
            </Button>
          </div>

          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

          {properties.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <div className="mb-4">
                  <i className="bi bi-house-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                </div>
                <h4>No Properties Listed</h4>
                <p className="text-muted mb-4">
                  You haven't added any properties yet. Start by adding your first property!
                </p>
                <Button as={Link} to="/add-property" variant="primary" size="lg">
                  ➕ Add Your First Property
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {properties.map((property) => (
                <Col key={property._id} lg={6} xl={4}>
                  <Card className="h-100">
                    <Card.Img 
                      variant="top" 
                      src={getImageUrl(property.images && property.images.length > 0 ? property.images[0] : property.image)} 
                      className="property-image"
                      alt={property.title}
                    />
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="primary" className="me-2">{property.category}</Badge>
                        {property.subtype && (
                          <Badge bg="secondary" className="me-2">{property.subtype}</Badge>
                        )}
                        {getStatusBadge(property)}
                        {property.images && property.images.length > 1 && (
                          <Badge bg="info" className="ms-1">📸 {property.images.length}</Badge>
                        )}
                      </div>
                      
                      <Card.Title className="h5">{property.title}</Card.Title>
                      
                      <Card.Text className="text-muted mb-2">
                        📍 {property.address.city}, {property.address.state}
                      </Card.Text>
                      
                      <Card.Text className="text-truncate" style={{ maxHeight: '3rem' }}>
                        {property.description}
                      </Card.Text>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="price-badge">
                            {formatPrice(property.price, property.rentType[0])}
                          </span>
                          <small className="text-muted">📐 {property.size}</small>
                        </div>
                        
                        <small className="text-muted d-block mb-3">
                          Added on {formatDate(property.createdAt)}
                        </small>
                        
                        <div className="d-grid gap-2">
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="flex-fill"
                              onClick={() => viewPropertyBookings(property)}
                            >
                              📋 View Bookings
                            </Button>
                            <Button 
                              as={Link} 
                              to={`/property/${property._id}`}
                              variant="outline-secondary" 
                              size="sm"
                              className="flex-fill"
                            >
                              👁️ View Details
                            </Button>
                          </div>
                          
                          <div className="d-flex gap-2">
                            {property.isDisabled ? (
                              <Button 
                                variant="success" 
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleEnableProperty(property._id)}
                              >
                                ✅ Enable
                              </Button>
                            ) : (
                              <Button 
                                variant="warning" 
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleDisableProperty(property._id)}
                              >
                                🚫 Disable
                              </Button>
                            )}
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="flex-fill"
                              onClick={() => openEditModal(property)}
                            >
                              ✏️ Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Property Summary */}
          {properties.length > 0 && (
            <Card className="mt-4">
              <Card.Header>
                <h5 className="mb-0">📊 Properties Summary</h5>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col md={3}>
                    <div className="mb-2">
                      <h3 className="text-primary">{properties.length}</h3>
                      <p className="text-muted mb-0">Total Properties</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-2">
                      <h3 className="text-success">
                        {properties.filter(p => !p.isDisabled).length}
                      </h3>
                      <p className="text-muted mb-0">Active</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-2">
                      <h3 className="text-danger">
                        {properties.filter(p => p.isDisabled).length}
                      </h3>
                      <p className="text-muted mb-0">Disabled</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-2">
                      <h3 className="text-info">
                        {new Set(properties.map(p => p.category)).size}
                      </h3>
                      <p className="text-muted mb-0">Categories</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Bookings Modal */}
      <Modal 
        show={showBookingsModal} 
        onHide={() => setShowBookingsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            📋 Bookings for {selectedProperty?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookings.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No bookings yet for this property.</p>
            </div>
          ) : (
            <div>
              {bookings.map((booking) => (
                <Card key={booking._id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">👤 {booking.userId?.name}</h6>
                      <Badge bg={
                        booking.status === 'pending' ? 'warning'
                        : booking.status === 'approved' ? 'success'
                        : booking.status === 'rejected' ? 'danger'
                        : booking.status === 'ended' ? 'secondary'
                        : 'info'
                      }>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Row>
                      <Col sm={6}>
                        <small className="text-muted">From: {formatDate(booking.fromDate)}</small>
                      </Col>
                      <Col sm={6}>
                        <small className="text-muted">To: {formatDate(booking.toDate)}</small>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm={6}>
                        <small className="text-muted">
                          Contact: {booking.userId?.contact || booking.userId?.email}
                        </small>
                      </Col>
                      <Col sm={6}>
                        <small className="text-muted">
                          Total: ₹{booking.totalPrice?.toLocaleString()}
                        </small>
                      </Col>
                    </Row>
                    {booking.notes && (
                      <div className="mt-2">
                        <small className="text-muted">Notes: {booking.notes}</small>
                      </div>
                    )}
                    <div className="mt-3 d-flex gap-2">
                      <Button
                        size="sm"
                        variant="info"
                        as={Link}
                        to={`/owner-booking/${booking._id}`}
                      >
                        View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
      {/* Booking Detail Modal */}
      <Modal show={showBookingDetailModal} onHide={() => setShowBookingDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>👤 Booking & User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking ? (
            <>
              <h5>User Information</h5>
              <p><strong>Name:</strong> {selectedBooking.userId?.name}</p>
              <p><strong>Email:</strong> {selectedBooking.userId?.email}</p>
              <p><strong>Contact:</strong> {selectedBooking.userId?.contact}</p>
              <p><strong>Age:</strong> {selectedBooking.userId?.age || 'N/A'}</p>
              <hr />
              <h5>Booking Information</h5>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>From:</strong> {formatDate(selectedBooking.fromDate)}</p>
              <p><strong>To:</strong> {formatDate(selectedBooking.toDate)}</p>
              <p><strong>Total Price:</strong> ₹{selectedBooking.totalPrice?.toLocaleString()}</p>
              <p><strong>Notes:</strong> {selectedBooking.notes || 'None'}</p>
              <div className="mt-3 d-flex gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button size="sm" variant="success" onClick={() => handleOwnerBookingAction('approve', selectedBooking._id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleOwnerBookingAction('reject', selectedBooking._id)}>Reject</Button>
                  </>
                )}
                {(selectedBooking.status === 'active' || selectedBooking.status === 'approved') && (
                  <Button size="sm" variant="secondary" onClick={() => handleOwnerBookingAction('end', selectedBooking._id)}>End Booking</Button>
                )}
              </div>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </>
          ) : (
            <p>No booking selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Property Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={editFormData.category || ''}
                    onChange={handleEditInputChange}
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
                  <Form.Label>Subtype {editFormData.category !== 'Event' && '*'}</Form.Label>
                  <Form.Select
                    name="subtype"
                    value={editFormData.subtype || ''}
                    onChange={handleEditInputChange}
                    disabled={!editFormData.category}
                    required={editFormData.category !== 'Event'}
                  >
                    <option value="">Select Subtype</option>
                    {editFormData.category && categories[editFormData.category]?.subtypes.map(subtype => (
                      <option key={subtype} value={subtype}>
                        {subtype}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editFormData.title || ''}
                onChange={handleEditInputChange}
                placeholder="Enter property title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editFormData.description || ''}
                onChange={handleEditInputChange}
                placeholder="Describe your property"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editFormData.price || ''}
                    onChange={handleEditInputChange}
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
                    value={editFormData.size || ''}
                    onChange={handleEditInputChange}
                    placeholder="e.g., 1000 sq ft, 2 BHK"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Rent Type *</Form.Label>
              <div>
                {editFormData.category && categories[editFormData.category]?.rentTypes.map(type => (
                  <Form.Check
                    key={type}
                    type="checkbox"
                    id={`edit-rentType-${type}`}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    value={type}
                    checked={editFormData.rentType?.includes(type) || false}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newRentTypes = e.target.checked
                        ? [...(editFormData.rentType || []), value]
                        : (editFormData.rentType || []).filter(t => t !== value);
                      setEditFormData({
                        ...editFormData,
                        rentType: newRentTypes
                      });
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            <h6 className="mb-3">Address Information</h6>
            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                name="address.street"
                value={editFormData.address?.street || ''}
                onChange={handleEditInputChange}
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
                    value={editFormData.address?.city || ''}
                    onChange={handleEditInputChange}
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
                    value={editFormData.address?.state || ''}
                    onChange={handleEditInputChange}
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
                    value={editFormData.address?.pincode || ''}
                    onChange={handleEditInputChange}
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
                value={editFormData.contact || ''}
                onChange={handleEditInputChange}
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
                onChange={handleEditImageChange}
              />
              <Form.Text className="text-muted">
                Add more images or replace existing ones. Maximum file size: 5MB per image.
              </Form.Text>
              
              {editImagePreviews.length > 0 && (
                <div className="mt-3">
                  <h6>Current Images:</h6>
                  <Row className="g-2">
                    {editImagePreviews.map((preview, index) => (
                      <Col key={preview.id} md={4} sm={6}>
                        <div className="position-relative">
                          <img 
                            src={getImageUrl(preview.src)} 
                            alt={`Property Preview ${index + 1}`} 
                            className="w-100"
                            style={{ 
                              height: '120px', 
                              objectFit: 'cover', 
                              borderRadius: '8px',
                              border: '2px solid #dee2e6'
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeEditImage(index)}
                            style={{ zIndex: 10 }}
                          >
                            ✕
                          </Button>
                          <div className="mt-1">
                            <small className="text-muted">
                              {preview.isExisting ? 'Current' : 'New'} • {index + 1}/{editImagePreviews.length}
                            </small>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div className="mt-2 text-info">
                    <small>
                      📸 {editImagePreviews.length}/5 images
                      {editImagePreviews.length < 5 && ' • You can upload more images'}
                    </small>
                  </div>
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSubmit}
            disabled={editLoading}
          >
            {editLoading ? 'Updating...' : 'Update Property'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProperties;
