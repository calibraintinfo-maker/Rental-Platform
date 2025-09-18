import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api, handleApiError, formatPrice, getImageUrl } from '../utils/api';

const FindProperty = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  const indianLocations = [
    "All Locations", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur",
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
    "Coimbatore", "Kochi", "Madurai", "Nashik", "Faridabad", "Ghaziabad", "Rajkot",
    "Meerut", "Kalyan", "Vasai", "Varanasi", "Dhanbad", "Jodhpur", "Amritsar",
    "Raipur", "Allahabad", "Jabalpur", "Gwalior", "Vijayawada", "Namakkal"
  ];

  const propertyTypes = [
    "All Categories", "Property Rentals", "Commercial", "Event", "Parking", "Land", "Turf"
  ];

  const residentialTypes = ["Villa", "Apartment", "House", "Studio", "Flat"];

  const getValidImages = (property) => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      const validImages = property.images.filter(img => 
        img && typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image'))
      );
      if (validImages.length > 0) return validImages;
    }
    
    if (property.image && typeof property.image === 'string' && property.image.trim()) {
      return [property.image];
    }
    
    const premiumImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&auto=format&q=80'
    ];
    
    return [premiumImages[Math.floor(Math.random() * premiumImages.length)]];
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.properties.getAll();
      let propertiesArray = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          propertiesArray = response.data;
        } else if (Array.isArray(response.data.data)) {
          propertiesArray = response.data.data;
        } else if (Array.isArray(response.data.properties)) {
          propertiesArray = response.data.properties;
        }
      }
      
      const validProperties = propertiesArray.filter(property => 
        property && (property._id || property.id)
      ).map(property => ({
        ...property,
        _id: property._id || property.id,
        title: property.title || (property.category === 'Land' ? 'land' : 'House'),
        description: property.description || (property.category === 'Land' ? 'good place to agriculture' : 'Spaces house 3bhk'),
        price: Number(property.price) || 0,
        category: property.category || 'Land',
        subtype: property.subtype || property.category || 'Land',
        address: {
          city: property.address?.city || 'NAMAKKAL',
          state: property.address?.state || 'TAMIL NADU',
          street: property.address?.street || ''
        },
        images: getValidImages(property),
        size: property.size || (property.category === 'Land' ? '10000' : '1200'),
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        rentType: property.rentType || (property.category === 'Land' ? ['yearly'] : ['monthly'])
      }));
      
      setProperties(validProperties);
      setFilteredProperties(validProperties);
      
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const applyFilters = useCallback(() => {
    if (!Array.isArray(properties)) return;
    
    let filtered = [...properties];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => {
        const searchFields = [
          property.title,
          property.description,
          property.address?.city,
          property.address?.state,
          property.category,
          property.subtype
        ].filter(Boolean);
        
        return searchFields.some(field => 
          field.toLowerCase().includes(query)
        );
      });
    }
    
    if (filters.location && filters.location !== "All Locations") {
      filtered = filtered.filter(property => {
        const locationText = `${property.address.city} ${property.address.state}`.toLowerCase();
        return locationText.includes(filters.location.toLowerCase());
      });
    }
    
    if (filters.propertyType && filters.propertyType !== "All Categories") {
      filtered = filtered.filter(property =>
        property.category === filters.propertyType || 
        property.subtype === filters.propertyType
      );
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        const price = Number(property.price) || 0;
        return price >= min && (max ? price <= max : true);
      });
    }
    
    if (filters.bedrooms) {
      const minBedrooms = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => {
        if (residentialTypes.includes(property.subtype)) {
          return (property.bedrooms || 0) >= minBedrooms;
        }
        return true;
      });
    }
    
    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters]);

  useEffect(() => {
    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: '', propertyType: '', priceRange: '', bedrooms: '' });
    setSearchQuery('');
  };

  const shouldShowBedroomFilter = () => {
    return filters.propertyType === 'Property Rentals' || 
           residentialTypes.includes(filters.propertyType);
  };

  const getActiveFiltersCount = () => {
    const filterCount = Object.values(filters).filter(f => f && f !== "All Categories").length;
    return filterCount + (searchQuery.trim() ? 1 : 0);
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleBookNow = (propertyId) => {
    navigate(`/book/${propertyId}`);
  };

  const handleCardClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleImageError = (e) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop&auto=format&q=80'
    ];
    e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  const getFormattedPrice = (property) => {
    const price = Number(property.price) || 0;
    if (price === 0) return 'Price on Request';
    
    const rentTypes = Array.isArray(property.rentType) ? property.rentType : ['monthly'];
    const rentType = rentTypes[0] || 'monthly';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (rentType === 'yearly') {
      return `${formatter.format(price)}/yearly`;
    } else {
      return `${formatter.format(price)}/monthly`;
    }
  };

  const getSafeRentTypes = (property) => {
    const rentTypes = Array.isArray(property.rentType) ? property.rentType : ['monthly'];
    return rentTypes.map(type => type.toUpperCase()).join(', ');
  };

  const getPropertyStatus = (property) => {
    const statuses = ['Active', 'Sold', 'Pending'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <section className="hero-section">
          <Container>
            <div className="loading-content text-center py-5">
              <Spinner animation="border" className="mb-3" style={{color: '#7c3aed'}} />
              <h3>Loading Properties</h3>
              <p>Connecting to your backend...</p>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <section className="hero-section">
          <Container>
            <Alert variant="danger" className="text-center my-5">
              <h3>Connection Error</h3>
              <p>{error}</p>
              <Button onClick={fetchProperties}>Retry Connection</Button>
            </Alert>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* HERO SECTION - PERFECT AS IS */}
      <section className="hero-section">
        <Container>
          <div className="hero-content">
            <div className="hero-badge">
              ⭐ <strong>{filteredProperties.length} PREMIUM PROPERTIES AVAILABLE</strong>
            </div>
            <h1 className="hero-title">
              Find Your Perfect <span className="property-text">Property</span>
            </h1>
            <p className="hero-subtitle">
              Discover verified properties from our premium collection<br />
              across India. From luxury apartments to sports turfs and<br />
              commercial spaces.
            </p>
          </div>
        </Container>
      </section>

      {/* DASHBOARD SECTION */}
      <section className="dashboard-section">
        <Container fluid>
          <Row>
            {/* LEFT SIDEBAR - PERFECT AS IS */}
            <Col lg={3} className="sidebar-column">
              <div className="search-section">
                <div className="search-header">
                  <span className="search-icon">🔍</span>
                  <span className="search-title">SEARCH PROPERTIES</span>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Search by location, type, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filters-section">
                <div className="filters-header">
                  <span className="filters-icon">✨</span>
                  <span className="filters-title">SMART FILTERS</span>
                </div>

                {/* Location Filter */}
                <div className="filter-group">
                  <div className="filter-header">
                    <span className="filter-icon">📍</span>
                    <span className="filter-label">LOCATION</span>
                    <span className="filter-count">{indianLocations.length - 1} cities</span>
                  </div>
                  <Form.Select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="filter-select"
                  >
                    {indianLocations.map((location, index) => (
                      <option key={index} value={location === "All Locations" ? "" : location}>
                        {location}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                {/* Property Type Filter */}
                <div className="filter-group">
                  <div className="filter-header">
                    <span className="filter-icon">🏠</span>
                    <span className="filter-label">PROPERTY TYPE</span>
                    <span className="filter-count">6 categories</span>
                  </div>
                  <Form.Select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="filter-select"
                  >
                    {propertyTypes.map((type, index) => (
                      <option key={index} value={type === "All Categories" ? "" : type}>
                        {type}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                {/* Price Range Filter */}
                <div className="filter-group">
                  <div className="filter-header">
                    <span className="filter-icon">💰</span>
                    <span className="filter-label">PRICE RANGE</span>
                    <span className="filter-count">per month</span>
                  </div>
                  <Form.Select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Prices</option>
                    <option value="0-1000">Rs.0 - Rs.1,000</option>
                    <option value="1000-2500">Rs.1,000 - Rs.2,500</option>
                    <option value="2500-5000">Rs.2,500 - Rs.5,000</option>
                    <option value="5000-10000">Rs.5,000 - Rs.10,000</option>
                    <option value="10000-25000">Rs.10,000 - Rs.25,000</option>
                    <option value="25000-50000">Rs.25,000 - Rs.50,000</option>
                    <option value="50000-999999">Rs.50,000+</option>
                  </Form.Select>
                </div>

                {/* Bedrooms Filter */}
                {shouldShowBedroomFilter() && (
                  <div className="filter-group">
                    <div className="filter-header">
                      <span className="filter-icon">🛏️</span>
                      <span className="filter-label">BEDROOMS</span>
                      <span className="filter-count">residential only</span>
                    </div>
                    <Form.Select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Any Bedrooms</option>
                      <option value="1">1+ BHK</option>
                      <option value="2">2+ BHK</option>
                      <option value="3">3+ BHK</option>
                      <option value="4">4+ BHK</option>
                      <option value="5">5+ BHK</option>
                    </Form.Select>
                  </div>
                )}

                {/* Clear Filters Button */}
                <Button
                  onClick={clearFilters}
                  disabled={getActiveFiltersCount() === 0}
                  className="clear-filters-btn"
                >
                  ✕ Clear All Filters
                </Button>

                {/* Available Counter Box */}
                <div className="counter-box">
                  <div className="counter-number">{filteredProperties.length}</div>
                  <div className="counter-text">Available</div>
                </div>
              </div>
            </Col>

            {/* RIGHT MAIN CONTENT - PERFECT AS IS */}
            <Col lg={9} className="main-column">
              {/* Results Header */}
              <div className="results-header">
                <div className="results-info">
                  <h2 className="results-title">{filteredProperties.length} Properties Found</h2>
                  <p className="results-subtitle">
                    Browse our premium collection • Updated {new Date().toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'})} • All verified listings
                  </p>
                </div>
                <div className="view-controls">
                  <Button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    ⊞ GRID VIEW
                  </Button>
                  <Button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    ☰ LIST VIEW
                  </Button>
                </div>
              </div>

              {/* PROPERTY CARDS WITH PERFECT BUTTON SIZES */}
              {filteredProperties.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No Properties Found</h3>
                  <p>Try adjusting your search criteria or clear filters to see more properties.</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              ) : (
                <Row className={viewMode === 'grid' ? 'properties-grid' : 'properties-list'}>
                  {filteredProperties.map((property) => {
                    if (!property?._id) return null;
                    
                    const status = getPropertyStatus(property);
                    
                    return (
                      <Col 
                        key={property._id} 
                        xs={12} 
                        md={viewMode === 'list' ? 12 : 6}
                        lg={viewMode === 'list' ? 12 : 4}
                        className="property-col"
                      >
                        {viewMode === 'list' ? (
                          <div 
                            className="clickable-property-card list-card"
                            onClick={() => handleCardClick(property._id)}
                          >
                            <Row className="g-0 h-100">
                              <Col md={5}>
                                <div className="card-image-container">
                                  <img
                                    src={property.images?.[0]}
                                    alt={property.title}
                                    onError={handleImageError}
                                    className="card-image"
                                  />
                                  <div className="status-overlay">
                                    <Badge className={`status-badge ${status.toLowerCase()}`}>
                                      {status.toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </Col>
                              <Col md={7} className="d-flex">
                                <div className="clickable-property-content">
                                  <div className="content-main">
                                    <div className="property-header">
                                      <h3 className="property-name">{property.title}</h3>
                                      <div className="professional-price-tag">
                                        <span className="price-amount">{getFormattedPrice(property)}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="professional-location-badge">
                                      <span className="location-icon">📍</span>
                                      <span className="location-text">{property.address?.city}, {property.address?.state}</span>
                                    </div>
                                    
                                    <div className="property-features">
                                      {property.bedrooms > 0 && (
                                        <div className="professional-feature-item">
                                          <span className="feature-icon">🛏</span>
                                          <span className="feature-text">{property.bedrooms} Beds</span>
                                        </div>
                                      )}
                                      {property.bathrooms > 0 && (
                                        <div className="professional-feature-item">
                                          <span className="feature-icon">🚿</span>
                                          <span className="feature-text">{property.bathrooms} Baths</span>
                                        </div>
                                      )}
                                      <div className="professional-feature-item">
                                        <span className="feature-icon">📏</span>
                                        <span className="feature-text">{property.size} sq ft</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="perfect-card-actions" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      onClick={() => handleViewDetails(property._id)}
                                      className="perfect-btn secondary"
                                    >
                                      View
                                    </Button>
                                    <Button
                                      onClick={() => handleBookNow(property._id)}
                                      className="perfect-btn primary"
                                    >
                                      Book
                                    </Button>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <div 
                            className="clickable-property-card grid-card"
                            onClick={() => handleCardClick(property._id)}
                          >
                            <div className="card-image-container">
                              <img
                                src={property.images?.[0]}
                                alt={property.title}
                                onError={handleImageError}
                                className="card-image"
                              />
                              <div className="status-overlay">
                                <Badge className={`status-badge ${status.toLowerCase()}`}>
                                  {status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="clickable-property-content">
                              <div className="content-main">
                                <div className="property-header">
                                  <h3 className="property-name">{property.title}</h3>
                                  <div className="professional-price-tag">
                                    <span className="price-amount">{getFormattedPrice(property)}</span>
                                  </div>
                                </div>
                                
                                <div className="professional-location-badge">
                                  <span className="location-icon">📍</span>
                                  <span className="location-text">{property.address?.city}, {property.address?.state}</span>
                                </div>
                                
                                <div className="property-features">
                                  {property.bedrooms > 0 && (
                                    <div className="professional-feature-item">
                                      <span className="feature-icon">🛏</span>
                                      <span className="feature-text">{property.bedrooms} Beds</span>
                                    </div>
                                  )}
                                  {property.bathrooms > 0 && (
                                    <div className="professional-feature-item">
                                      <span className="feature-icon">🚿</span>
                                      <span className="feature-text">{property.bathrooms} Baths</span>
                                    </div>
                                  )}
                                  <div className="professional-feature-item">
                                    <span className="feature-icon">📏</span>
                                    <span className="feature-text">{property.size} sq ft</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="perfect-card-actions" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  onClick={() => handleViewDetails(property._id)}
                                  className="perfect-btn secondary"
                                >
                                  View Details
                                </Button>
                                <Button
                                  onClick={() => handleBookNow(property._id)}
                                  className="perfect-btn primary"
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Col>
                    );
                  })}
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* COMPLETE CSS WITH PERFECT LIST VIEW BUTTON SIZES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        .dashboard-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          line-height: 1.5;
          color: #374151;
        }
        
        /* HERO SECTION - RIGHT-SHIFTED GRADIENT + INCREASED SIZE */
        .hero-section {
          background: linear-gradient(135deg, #8b5cf6 20%, #7c3aed 45%, #a855f7 70%, #ec4899 100%);
          padding: 4.5rem 0 4rem 0;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%);
          pointer-events: none;
        }
        
        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        
        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 0.65rem 1.5rem;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(10px);
        }
        
        .hero-title {
          font-size: clamp(2.8rem, 4.8vw, 3.5rem);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 1.75rem;
          letter-spacing: -0.02em;
        }
        
        .property-text {
          color: white;
          font-weight: 900;
        }
        
        .hero-subtitle {
          font-size: 1.15rem;
          line-height: 1.65;
          opacity: 0.95;
          margin-bottom: 0;
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
        
        /* DASHBOARD SECTION */
        .dashboard-section {
          padding: 2rem 0;
          background: #f8fafc;
        }
        
        .sidebar-column {
          padding-right: 1.5rem;
        }
        
        .main-column {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }
        
        /* SIDEBAR STYLES */
        .search-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .search-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          font-size: 0.875rem;
          text-align: left;
        }
        
        .search-input {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          width: 100%;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          outline: none;
        }
        
        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .filters-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 700;
          color: #374151;
          text-transform: uppercase;
          font-size: 0.875rem;
          text-align: left;
        }
        
        .filter-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }
        
        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          text-align: left;
        }
        
        .filter-icon {
          font-size: 0.875rem;
          margin-right: 0.25rem;
        }
        
        .filter-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          text-align: left;
        }
        
        .filter-count {
          font-size: 0.7rem;
          color: #9ca3af;
        }
        
        .filter-select {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.875rem;
          width: 100%;
          background: white;
          transition: all 0.2s ease;
        }
        
        .filter-select:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          outline: none;
        }
        
        .clear-filters-btn {
          width: 100%;
          background: #e0e7ff;
          border: 1px solid #c7d2fe;
          color: #5b21b6;
          border-radius: 8px;
          padding: 0.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
        }
        
        .clear-filters-btn:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #dc2626;
        }
        
        .clear-filters-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .counter-box {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }
        
        .counter-number {
          font-size: 2rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        
        .counter-text {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.9;
        }
        
        /* RESULTS HEADER */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .results-title {
          font-size: 1.875rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }
        
        .results-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }
        
        .view-controls {
          display: flex;
          gap: 0.5rem;
        }
        
        /* ✅ FIX: View Toggle Buttons - Fixed Hover State */
        .view-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          transition: all 0.2s ease;
        }
        
        .view-btn.active {
          background: #7c3aed;
          border-color: #7c3aed;
          color: white;
        }
        
        .view-btn:hover:not(.active) {
          background: #e5e7eb;
          border-color: #9ca3af;
          color: #374151;
        }
        
        /* CLICKABLE PROPERTY CARDS */
        .properties-grid, .properties-list {
          margin: 0;
        }
        
        .property-col {
          margin-bottom: 1.75rem;
        }
        
        .clickable-property-card {
          background: rgba(255, 255, 255, 0.28);
          backdrop-filter: saturate(200%) blur(30px);
          -webkit-backdrop-filter: saturate(200%) blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }
        
        .clickable-property-card:hover {
          transform: translateY(-8px) scale(1.025);
          box-shadow: 0 20px 60px rgba(124, 58, 237, 0.25);
          background: rgba(255, 255, 255, 0.35);
          border-color: rgba(255, 255, 255, 0.45);
        }
        
        .clickable-property-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          pointer-events: none;
        }
        
        /* GRID CARDS - PERFECT PROPORTIONS */
        .grid-card {
          height: 360px;
          display: flex;
          flex-direction: column;
        }
        
        .grid-card .card-image-container {
          height: 200px;
          position: relative;
          overflow: hidden;
          border-radius: 24px 24px 0 0;
        }
        
        .grid-card .clickable-property-content {
          flex: 1;
          padding: 1.25rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        /* LIST CARDS - IMPROVED LAYOUT */
        .list-card {
          height: 250px;
        }
        
        .list-card .card-image-container {
          height: 100%;
          position: relative;
          overflow: hidden;
          border-radius: 24px 0 0 24px;
        }
        
        .list-card .clickable-property-content {
          padding: 2rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .clickable-property-card:hover .card-image {
          transform: scale(1.1);
        }
        
        .status-overlay {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 3;
        }
        
        .status-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.45rem 0.9rem;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
        }
        
        .status-badge.active {
          background: rgba(34, 197, 94, 0.9);
          color: white;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }
        
        .status-badge.sold {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        
        .status-badge.pending {
          background: rgba(59, 130, 246, 0.9);
          color: white;
          border: 1px solid rgba(59, 130, 246, 0.4);
        }
        
        /* CONTENT STYLING */
        .content-main {
          flex: 1;
        }
        
        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }
        
        .property-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          text-transform: capitalize;
          line-height: 1.3;
          flex: 1;
        }
        
        /* PRICE TAG */
        .professional-price-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.4rem 0.9rem;
          border-radius: 14px;
          font-size: 0.9rem;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .price-amount {
          letter-spacing: -0.02em;
        }
        
        /* LOCATION BADGE */
        .professional-location-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(124, 58, 237, 0.12);
          border: 1px solid rgba(124, 58, 237, 0.25);
          padding: 0.5rem 0.9rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          backdrop-filter: blur(10px);
        }
        
        .location-icon {
          font-size: 0.8rem;
          color: #7c3aed;
        }
        
        .location-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #6d28d9;
          text-transform: capitalize;
        }
        
        /* PROPERTY FEATURES */
        .property-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
        }
        
        .professional-feature-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(124, 58, 237, 0.12);
          backdrop-filter: blur(15px);
          padding: 0.3rem 0.7rem;
          border-radius: 10px;
          border: 1px solid rgba(124, 58, 237, 0.2);
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
        }
        
        .feature-icon {
          font-size: 0.75rem;
          opacity: 0.8;
          color: #7c3aed;
        }
        
        .feature-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6d28d9;
        }
        
        /* ✅ PERFECT LIST VIEW BUTTON SIZES */
        .perfect-card-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
        }
        
        .perfect-btn {
          flex: 1;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          text-transform: uppercase;
          letter-spacing: 0.025em;
          padding: 0.45rem 0.85rem;
          pointer-events: all;
        }
        
        .perfect-btn.secondary {
          background: rgba(255, 255, 255, 0.4);
          color: #7c3aed;
          border: 1px solid rgba(124, 58, 237, 0.4);
        }
        
        .perfect-btn.secondary:hover {
          background: rgba(124, 58, 237, 0.2);
          border-color: rgba(124, 58, 237, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.25);
        }
        
        .perfect-btn.primary {
          background: rgba(124, 58, 237, 0.9);
          color: white;
          border: 1px solid rgba(124, 58, 237, 0.7);
        }
        
        .perfect-btn.primary:hover {
          background: rgba(124, 58, 237, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
        }
        
        /* NO RESULTS */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
        }
        
        .no-results-icon {
          font-size: 4rem;
          opacity: 0.5;
          margin-bottom: 1.5rem;
        }
        
        .no-results h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }
        
        .no-results p {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        
        /* RESPONSIVE DESIGN */
        @media (max-width: 992px) {
          .sidebar-column {
            margin-bottom: 2rem;
            padding-right: 0;
          }
          
          .results-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .view-controls {
            width: 100%;
          }
          
          .view-btn {
            flex: 1;
          }
          
          .list-card {
            height: auto;
            min-height: 200px;
          }
          
          .list-card .perfect-card-actions {
            flex-direction: column;
            gap: 0.6rem;
          }
          
          .list-card .perfect-btn {
            padding: 0.5rem 0.9rem;
            font-size: 0.75rem;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-section {
            padding: 1rem 0;
          }
          
          .main-column {
            padding: 1rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .perfect-card-actions {
            flex-direction: column;
            gap: 0.6rem;
          }
          
          .grid-card {
            height: auto;
          }
          
          .grid-card .card-image-container {
            height: 180px;
          }
          
          .property-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }
        }
        
        @media (max-width: 576px) {
          .hero-section {
            padding: 3.5rem 0 3rem 0;
          }
          
          .hero-badge {
            padding: 0.5rem 1.2rem;
            font-size: 0.8rem;
          }
          
          .search-section, .filters-section {
            padding: 1rem;
          }
          
          .results-title {
            font-size: 1.5rem;
          }
          
          .property-col {
            margin-bottom: 1.25rem;
          }
          
          .professional-price-tag {
            font-size: 0.85rem;
            padding: 0.35rem 0.8rem;
          }
          
          .professional-location-badge {
            padding: 0.45rem 0.8rem;
          }
          
          .perfect-btn {
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FindProperty;