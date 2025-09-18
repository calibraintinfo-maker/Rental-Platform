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

  // Comprehensive Indian locations
  const indianLocations = [
    "All Locations", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", 
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
    "Coimbatore", "Kochi", "Madurai", "Nashik", "Faridabad", "Ghaziabad",
    "Rajkot", "Meerut", "Kalyan", "Vasai", "Varanasi", "Dhanbad", "Jodhpur",
    "Amritsar", "Raipur", "Allahabad", "Jabalpur", "Gwalior", "Vijayawada",
    "Agra", "Ranchi", "Aurangabad", "Solapur", "Chandigarh", "Mysore"
  ];

  const propertyTypes = [
    "All Categories", 
    "Property Rentals", 
    "Commercial", 
    "Event", 
    "Parking", 
    "Land",
    "Turf"
  ];

  const residentialTypes = ["Villa", "Apartment", "House", "Studio", "Flat"];

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.properties.getAll();
      
      // Handle different response structures
      let propertiesArray = [];
      
      if (Array.isArray(response)) {
        propertiesArray = response;
      } else if (Array.isArray(response?.data)) {
        propertiesArray = response.data;
      } else if (Array.isArray(response?.data?.properties)) {
        propertiesArray = response.data.properties;
      } else if (response?.data && typeof response.data === 'object') {
        const dataObj = response.data;
        for (const key in dataObj) {
          if (Array.isArray(dataObj[key])) {
            propertiesArray = dataObj[key];
            break;
          }
        }
      }
      
      setProperties(propertiesArray);
      setFilteredProperties(propertiesArray);
      
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  // Filter properties based on search and filters
  useEffect(() => {
    if (!Array.isArray(properties)) {
      setFilteredProperties([]);
      return;
    }

    let filtered = properties;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(property => {
        if (!property) return false;
        
        const searchFields = [
          property.title,
          property.description,
          property.address?.city,
          property.address?.state,
          property.address?.street,
          property.category,
          property.subtype
        ].filter(Boolean);
        
        return searchFields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Location filter
    if (filters.location && filters.location !== "All Locations") {
      filtered = filtered.filter(property => {
        if (!property?.address) return false;
        
        const locationFields = [
          property.address.city,
          property.address.state,
          property.address.street
        ].filter(Boolean);
        
        return locationFields.some(field =>
          field.toLowerCase().includes(filters.location.toLowerCase())
        );
      });
    }

    // Property type filter
    if (filters.propertyType && filters.propertyType !== "All Categories") {
      filtered = filtered.filter(property => {
        if (!property) return false;
        return property.category === filters.propertyType ||
               property.subtype === filters.propertyType;
      });
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        if (!property?.price) return false;
        const price = Number(property.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      const minBedrooms = parseInt(filters.bedrooms);
      filtered = filtered.filter(property => {
        if (!property?.subtype) return false;
        
        if (residentialTypes.includes(property.subtype)) {
          return property.bedrooms >= minBedrooms;
        }
        return true;
      });
    }

    setFilteredProperties(filtered);
  }, [searchQuery, filters, properties]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: '', propertyType: '', priceRange: '', bedrooms: '' });
    setSearchQuery('');
  };

  const shouldShowBedroomFilter = () => {
    if (!filters.propertyType || filters.propertyType === "All Categories") return false;
    return filters.propertyType === 'Property Rentals' || 
           residentialTypes.includes(filters.propertyType);
  };

  const getActiveFiltersCount = () => {
    const filterCount = Object.values(filters).filter(f => f && f !== "All Categories").length;
    return filterCount + (searchQuery.trim() ? 1 : 0);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Property Rentals': '🏠',
      'Commercial': '🏢',
      'Land': '🌾',
      'Parking': '🚗',
      'Event': '🎉',
      'Turf': '⚽'
    };
    return icons[category] || '🏷️';
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleBookNow = (propertyId) => {
    navigate(`/book/${propertyId}`);
  };

  // ✅ FIXED: Enhanced image error handling
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  // ✅ FIXED: Get safe property image
  const getPropertyImage = (property) => {
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      return getImageUrl(property.images[0]);
    }
    if (property?.image) {
      return getImageUrl(property.image);
    }
    // Professional fallback image
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  // ✅ FIXED: Enhanced property details with fallbacks
  const renderPropertyDetails = (property) => {
    if (!property) return [];
    
    const details = [];

    // Add bedrooms for residential properties
    if (property.subtype && residentialTypes.includes(property.subtype)) {
      if (property.bedrooms > 0) {
        details.push(
          <Badge key="bedrooms" bg="light" text="dark" className="me-2 mb-2" style={{ fontSize: '0.8rem' }}>
            🛏 {property.bedrooms} BHK
          </Badge>
        );
      }
      if (property.bathrooms > 0) {
        details.push(
          <Badge key="bathrooms" bg="light" text="dark" className="me-2 mb-2" style={{ fontSize: '0.8rem' }}>
            🚿 {property.bathrooms} Bath
          </Badge>
        );
      }
    }

    // Add size/area
    if (property.size) {
      details.push(
        <Badge key="area" bg="light" text="dark" className="me-2 mb-2" style={{ fontSize: '0.8rem' }}>
          📐 {property.size}
        </Badge>
      );
    }

    // Add capacity for event/commercial spaces
    if (property.capacity) {
      details.push(
        <Badge key="capacity" bg="info" className="me-2 mb-2" style={{ fontSize: '0.8rem' }}>
          👥 {property.capacity}
        </Badge>
      );
    }

    return details;
  };

  // ✅ FIXED: Safe rent type handling
  const getSafeRentType = (property) => {
    if (!property?.rentType) return 'monthly';
    return Array.isArray(property.rentType) ? property.rentType[0] : property.rentType;
  };

  const getSafeRentTypes = (property) => {
    if (!property?.rentType) return ['monthly'];
    return Array.isArray(property.rentType) ? property.rentType : [property.rentType];
  };

  // ✅ FIXED: Enhanced property card component
  const PropertyCard = ({ property }) => {
    if (!property) return null;

    return (
      <Card 
        className="h-100 perfect-card shadow-sm border-0"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }}
      >
        {/* ✅ FIXED: Image container with proper aspect ratio */}
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          <img
            src={getPropertyImage(property)}
            alt={property.title || 'Property'}
            onError={handleImageError}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
          
          {/* Status badges */}
          <div className="position-absolute top-0 start-0 p-3">
            <Badge bg="success" className="me-2 fw-semibold shadow-sm" 
                   style={{ 
                     borderRadius: '20px',
                     padding: '6px 12px', 
                     fontSize: '0.75rem',
                     textTransform: 'uppercase',
                     letterSpacing: '0.025em'
                   }}>
              ✓ Available
            </Badge>
            <Badge bg="primary" className="fw-semibold shadow-sm" 
                   style={{ 
                     borderRadius: '20px', 
                     padding: '6px 12px', 
                     fontSize: '0.75rem',
                     textTransform: 'uppercase',
                     letterSpacing: '0.025em'
                   }}>
              🏆 Verified
            </Badge>
          </div>

          {/* Category badge */}
          <div className="position-absolute top-0 end-0 p-3">
            <Badge bg="dark" style={{
              borderRadius: '15px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {getCategoryIcon(property.category)} {property.category || 'Property'}
            </Badge>
          </div>
        </div>

        <Card.Body className="p-4">
          {/* Location */}
          <div className="d-flex align-items-center mb-3">
            <span className="me-2" style={{ color: '#7c3aed', fontSize: '1.1rem' }}>📍</span>
            <span style={{ 
              fontSize: '0.9rem', 
              color: '#6b7280',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {property.address?.city || 'Mumbai'}, {property.address?.state || 'Maharashtra'}
            </span>
          </div>

          {/* ✅ FIXED: Title with fallback */}
          <Card.Title style={{ 
            color: '#1f2937',
            fontSize: '1.25rem',
            lineHeight: '1.3',
            fontWeight: 700,
            marginBottom: '12px',
            fontFamily: "'Inter', sans-serif"
          }}>
            {property.title || `Premium ${property.subtype || property.category || 'Property'} for Rent`}
          </Card.Title>

          {/* ✅ FIXED: Description with fallback */}
          <Card.Text style={{ 
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#6b7280',
            marginBottom: '16px',
            height: '48px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {property.description || 
             `Modern ${property.subtype || property.category || 'property'} with excellent amenities in prime location. Perfect for comfortable living with all necessary facilities nearby.`}
          </Card.Text>

          {/* Property details */}
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {renderPropertyDetails(property)}
            </div>
          </div>

          {/* Price and actions */}
          <div className="perfect-card-actions mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div style={{ 
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#059669',
                  marginBottom: '4px',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {formatPrice(property.price || 15000, getSafeRentType(property))}
                </div>
                <small style={{ 
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Available for {getSafeRentTypes(property).join(', ')} rental
                </small>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <Button
                variant="outline-primary"
                className="flex-1"
                style={{
                  borderRadius: '12px',
                  padding: '10px 16px',
                  borderWidth: '2px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderColor: '#7c3aed',
                  color: '#7c3aed'
                }}
                onClick={() => handleViewDetails(property._id)}
              >
                View Details
              </Button>
              <Button
                className="flex-1"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
                onClick={() => handleBookNow(property._id)}
              >
                📅 Book Now
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <section className="hero-section py-5 text-white">
          <Container className="text-center">
            <h1 className="display-4 fw-bold mb-4">Find Your Perfect Property</h1>
            <p className="fs-5 opacity-90">Discover verified properties from our premium collection across India</p>
          </Container>
        </section>
        <Container className="py-5 text-center">
          <Spinner animation="border" style={{ color: '#7c3aed' }} />
          <p className="mt-3 fs-5 fw-semibold">Loading properties...</p>
        </Container>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-wrapper">
        <section className="hero-section py-5 text-white">
          <Container className="text-center">
            <h1 className="display-4 fw-bold mb-4">Find Your Perfect Property</h1>
            <p className="fs-5 opacity-90">Discover verified properties from our premium collection across India</p>
          </Container>
        </section>
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>⚠️ Error Loading Properties</Alert.Heading>
            <p>{error}</p>
            <Button onClick={fetchProperties} style={{ backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Hero Section */}
      <section className="hero-section py-5 text-white">
        <Container className="text-center">
          <div className="hero-badge mb-3">
            ✨ {filteredProperties.length} Premium Properties Available
          </div>
          <h1 className="hero-title display-3 fw-bold mb-4">
            Find Your Perfect Property
          </h1>
          <p className="hero-subtitle fs-5 opacity-90">
            Discover verified properties from our premium collection across India. 
            From luxury apartments to sports turfs and commercial spaces.
          </p>
        </Container>
      </section>

      {/* Main Layout */}
      <div className="properties-layout">
        
        {/* Sidebar */}
        <div className="sidebar-column">
          
          {/* Dashboard Header */}
          <div className="dashboard-header p-4 border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h5 className="dashboard-title mb-1">
                  <span className="me-2">🎯</span>
                  Smart Property Filters
                </h5>
                <small className="dashboard-subtitle">
                  Find your perfect match
                </small>
              </div>
              <div className="results-badge">
                {filteredProperties.length} found
              </div>
            </div>
          </div>

          <div className="p-4">
            
            {/* Search Input */}
            <div className="mb-4">
              <Form.Label className="filter-label">
                <span className="me-2">🔍</span>
                Search Properties
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by location, type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="perfect-input"
              />
              {searchQuery && (
                <small className="text-muted mt-2 d-block">
                  <span className="fw-semibold">{filteredProperties.length} results</span> for "{searchQuery}"
                </small>
              )}
            </div>

            {/* Location Filter */}
            <div className="mb-4">
              <Form.Label className="filter-label">
                <span className="me-2">📍</span>
                Location
                <span className="ms-auto filter-count">
                  {indianLocations.length - 1} cities
                </span>
              </Form.Label>
              <Form.Select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="perfect-select"
              >
                {indianLocations.map((location, index) => (
                  <option key={index} value={location === "All Locations" ? "" : location}>
                    {location}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Property Type Filter */}
            <div className="mb-4">
              <Form.Label className="filter-label">
                <span className="me-2">🏠</span>
                Property Type
                <span className="ms-auto filter-count">
                  {propertyTypes.length - 1} categories
                </span>
              </Form.Label>
              <Form.Select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="perfect-select"
              >
                {propertyTypes.map((type, index) => (
                  <option key={index} value={type === "All Categories" ? "" : type}>
                    {getCategoryIcon(type)} {type}
                  </option>
                ))}
              </Form.Select>
              
              {filters.propertyType && filters.propertyType !== "All Categories" && (
                <div className="property-type-hint mt-2 p-2 bg-light rounded">
                  <small className="text-muted">
                    {filters.propertyType === 'Property Rentals' && 'Includes: Villa, Apartment, House, Studio, Flat'}
                    {filters.propertyType === 'Commercial' && 'Includes: Office, Shop, Warehouse, Showroom'}
                    {filters.propertyType === 'Event' && 'Includes: Banquet Hall, Garden, Meeting Room'}
                    {filters.propertyType === 'Turf' && 'Includes: Football Turf, Cricket Ground, Multi-Sport, Tennis Court'}
                    {filters.propertyType === 'Parking' && 'Includes: Car Parking, Bike Parking, Garage'}
                    {filters.propertyType === 'Land' && 'Includes: Agricultural, Commercial Plot, Residential Plot'}
                  </small>
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="mb-4">
              <Form.Label className="filter-label">
                <span className="me-2">💰</span>
                Price Range
                <span className="ms-auto filter-count">per month</span>
              </Form.Label>
              <Form.Select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="perfect-select"
              >
                <option value="">All Prices</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-2500">₹1,000 - ₹2,500</option>
                <option value="2500-5000">₹2,500 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000-999999">₹50,000+</option>
              </Form.Select>
            </div>

            {/* Conditional Bedrooms Filter */}
            {shouldShowBedroomFilter() && (
              <div className="mb-4">
                <Form.Label className="filter-label">
                  <span className="me-2">🛏️</span>
                  Bedrooms
                  <span className="ms-auto filter-count">residential only</span>
                </Form.Label>
                <Form.Select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="perfect-select"
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
              variant="outline-secondary"
              className="w-100 mb-4 perfect-button"
              onClick={clearFilters}
              disabled={getActiveFiltersCount() === 0}
            >
              <span className="me-2">✕</span>
              Clear All Filters
              {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
            </Button>

            {/* Active Filters Summary */}
            <div className="filters-summary">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="filters-summary-title">
                  <span className="me-2">⚡</span>
                  Active Filters
                </span>
                <div className="filters-count-badge">
                  {getActiveFiltersCount()}
                </div>
              </div>
              
              <div className="d-flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="filter-tag filter-tag-search">
                    🔍 "{searchQuery.substring(0, 15)}{searchQuery.length > 15 ? '...' : ''}"
                  </div>
                )}
                {filters.location && (
                  <div className="filter-tag filter-tag-location">
                    📍 {filters.location}
                  </div>
                )}
                {filters.propertyType && (
                  <div className="filter-tag filter-tag-type">
                    {getCategoryIcon(filters.propertyType)} {filters.propertyType}
                  </div>
                )}
                {filters.priceRange && (
                  <div className="filter-tag filter-tag-price">
                    💰 ₹{filters.priceRange.replace('-', ' - ')}
                  </div>
                )}
                {filters.bedrooms && (
                  <div className="filter-tag filter-tag-bedrooms">
                    🛏️ {filters.bedrooms}+ BHK
                  </div>
                )}
              </div>
              
              {getActiveFiltersCount() === 0 && (
                <div className="text-center">
                  <p className="text-muted mb-0 no-filters-text">No active filters</p>
                  <small className="text-muted">Use filters above to refine your search</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="properties-content">
          <Container fluid className="py-5 px-5">
            
            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h2 className="results-title">
                  {filteredProperties.length} Properties Found
                </h2>
                <p className="results-subtitle">
                  Browse our premium collection • Updated {new Date().toLocaleDateString()} • All verified listings
                </p>
              </div>
              
              {/* View Toggle Buttons */}
              <div className="btn-group view-toggle-group" role="group">
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
                  onClick={() => setViewMode('grid')}
                  className={`perfect-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  ⊞ GRID VIEW
                </Button>
                
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
                  onClick={() => setViewMode('list')}
                  className={`perfect-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                  ☰ LIST VIEW
                </Button>
              </div>
            </div>

            {/* Properties Grid/List */}
            {filteredProperties.length === 0 ? (
              <div className="no-properties-container">
                <div className="no-properties-icon">
                  {searchQuery ? '🔍' : getActiveFiltersCount() > 0 ? '🎯' : '🏠'}
                </div>
                <h3 className="no-properties-title">
                  {searchQuery ? 'No Search Results' : getActiveFiltersCount() > 0 ? 'No Matching Properties' : 'No Properties Available'}
                </h3>
                <p className="no-properties-text">
                  {searchQuery ? `We couldn't find any properties matching "${searchQuery}". Try adjusting your search terms.` :
                   getActiveFiltersCount() > 0 ? 'No properties match your current filters. Try adjusting or clearing some filters.' :
                   'No properties are currently available. Please check back later.'}
                </p>
                <Button 
                  className="perfect-action-btn"
                  size="lg"
                  onClick={clearFilters}
                >
                  {getActiveFiltersCount() > 0 ? 'Clear All Filters' : 'Refresh Properties'}
                </Button>
              </div>
            ) : (
              <Row className={viewMode === 'grid' ? 'properties-grid' : 'properties-list'}>
                {filteredProperties.map((property) => {
                  if (!property || !property._id) return null;
                  
                  return (
                    <Col key={property._id} className={viewMode === 'grid' ? 'col-12 col-md-6 col-lg-4 mb-4' : 'col-12 mb-3'}>
                      {viewMode === 'list' ? (
                        /* List View */
                        <Card className="list-view-card border-0 shadow-sm">
                          <Row className="g-0 align-items-center">
                            <Col md={4}>
                              <div className="list-image-container">
                                <img
                                  src={getPropertyImage(property)}
                                  alt={property.title || 'Property'}
                                  onError={handleImageError}
                                  className="list-property-image"
                                />
                                
                                <div className="position-absolute top-0 start-0 p-3">
                                  <Badge bg="success" className="me-2 fw-semibold shadow-sm list-badge">
                                    ✓ Available
                                  </Badge>
                                  <Badge bg="primary" className="fw-semibold shadow-sm list-badge">
                                    🏆 Verified
                                  </Badge>
                                </div>
                              </div>
                            </Col>
                            
                            <Col md={8}>
                              <Card.Body className="p-4 list-card-body">
                                <div className="d-flex align-items-center mb-3">
                                  <span className="me-2 list-location-icon">📍</span>
                                  <span className="list-location-text">
                                    {property.address?.city || 'Mumbai'}, {property.address?.state || 'Maharashtra'}
                                  </span>
                                </div>
                                
                                <Card.Title className="list-card-title">
                                  {property.title || `Premium ${property.subtype || property.category || 'Property'} for Rent`}
                                </Card.Title>
                                
                                <p className="list-card-description">
                                  {property.description ? 
                                    property.description.substring(0, 140) + '...' : 
                                    `Modern ${property.subtype || property.category || 'property'} with excellent amenities and prime location. Perfect for comfortable living with all necessary facilities nearby.`
                                  }
                                </p>
                                
                                <div className="mb-3">
                                  <div className="d-flex flex-wrap gap-2">
                                    {renderPropertyDetails(property)}
                                  </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                  <div>
                                    <div className="list-price">
                                      {formatPrice(property.price || 15000, getSafeRentType(property))}
                                    </div>
                                    <small className="list-rent-type">
                                      Available for {getSafeRentTypes(property).join(', ')} rental
                                    </small>
                                  </div>
                                  
                                  <div className="d-flex gap-3">
                                    <Button
                                      variant="outline-primary"
                                      className="perfect-outline-btn"
                                      onClick={() => handleViewDetails(property._id)}
                                    >
                                      View Details
                                    </Button>
                                    <Button
                                      className="perfect-primary-btn"
                                      onClick={() => handleBookNow(property._id)}
                                    >
                                      📅 Book Now
                                    </Button>
                                  </div>
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>
                        </Card>
                      ) : (
                        /* Grid View - Your Property Card */
                        <PropertyCard property={property} />
                      )}
                    </Col>
                  );
                })}
              </Row>
            )}
          </Container>
        </div>
      </div>

      {/* ✅ ALL YOUR ORIGINAL CSS - EXACTLY AS YOU HAD IT */}
      <style>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background-color: #ffffff;
        }

        .hero-section {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
          min-height: 320px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 10%;
          right: 5%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(40px);
          animation: float 8s ease-in-out infinite;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 10%;
          left: 5%;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          filter: blur(30px);
          animation: float 6s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          padding: 8px 20px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: white;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: white;
        }

        .hero-subtitle {
          color: rgba(255, 255, 255, 0.95);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
          font-family: 'Inter', system-ui, sans-serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .properties-layout {
          display: flex;
          min-height: 100vh;
          background-color: #ffffff;
        }

        .sidebar-column {
          width: 400px;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          position: sticky;
          top: 0;
          overflow-y: auto;
          border-right: 1px solid #e2e8f0;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
        }

        .dashboard-header {
          background: linear-gradient(135deg, #6b46c1 0%, #805ad5 100%);
          color: white;
        }

        .dashboard-title {
          margin-bottom: 4px;
          font-weight: 800;
          font-size: 1.3rem;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .dashboard-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .results-badge {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 8px 12px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .filter-label {
          font-weight: 700;
          margin-bottom: 12px;
          font-size: 1.05rem;
          color: #1f2937;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          align-items: center;
        }

        .filter-count {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .perfect-input, .perfect-select {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          padding: 14px 16px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          font-family: 'Inter', system-ui, sans-serif;
          background: white;
        }

        .perfect-input:focus, .perfect-select:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
          outline: none;
        }

        .property-type-hint {
          font-size: 0.8rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .perfect-button {
          border-radius: 12px;
          padding: 12px;
          border-width: 2px;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.95rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .filters-summary {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #cbd5e1;
        }

        .filters-summary-title {
          font-weight: 700;
          color: #1f2937;
          font-size: 1rem;
          font-family: 'Inter', system-ui, sans-serif;
          display: flex;
          align-items: center;
        }

        .filters-count-badge {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          min-width: 30px;
          text-align: center;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .filter-tag {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'Inter', system-ui, sans-serif;
          color: white;
        }

        .filter-tag-search { background: #3b82f6; }
        .filter-tag-location { background: #10b981; }
        .filter-tag-type { background: #f59e0b; }
        .filter-tag-price { background: #ef4444; }
        .filter-tag-bedrooms { background: #8b5cf6; }

        .no-filters-text {
          font-size: 0.85rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .properties-content {
          flex: 1;
          background-color: #ffffff;
        }

        .results-title {
          font-weight: 800;
          margin-bottom: 8px;
          color: #111827;
          font-size: 2.5rem;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: -0.02em;
        }

        .results-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin-bottom: 0;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 400;
        }

        .view-toggle-group {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .perfect-view-btn {
          font-weight: 700;
          padding: 14px 24px;
          font-size: 0.9rem;
          border-radius: 0;
          transition: all 0.3s ease;
          font-family: 'Inter', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .perfect-view-btn.active {
          background-color: #7c3aed;
          border-color: #7c3aed;
          color: white;
        }

        .perfect-view-btn:not(.active) {
          background-color: white;
          border-color: #d1d5db;
          color: #4b5563;
        }

        .perfect-view-btn:not(.active):hover {
          background-color: #f3f4f6;
          color: #1f2937;
        }

        .no-properties-container {
          text-align: center;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          padding: 3rem;
        }

        .no-properties-icon {
          font-size: 5rem;
          opacity: 0.6;
          margin-bottom: 1rem;
        }

        .no-properties-title {
          font-weight: 800;
          margin-bottom: 16px;
          color: #111827;
          font-size: 1.8rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .no-properties-text {
          color: #6b7280;
          font-size: 1.05rem;
          margin-bottom: 24px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1.6;
        }

        .perfect-action-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border: none;
          font-weight: 700;
          border-radius: 12px;
          padding: 12px 30px;
          font-family: 'Inter', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .properties-grid .col-12, .properties-grid .col-md-6, .properties-grid .col-lg-4 {
          display: flex;
        }

        .perfect-card {
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #e5e7eb;
        }

        .perfect-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(124, 58, 237, 0.2);
        }

        .perfect-card-actions {
          margin-top: auto;
        }

        .list-view-card {
          border-radius: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          min-height: 240px;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
        }

        .list-view-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(124, 58, 237, 0.15);
        }

        .list-image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .list-property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px 0 0 20px;
        }

        .list-badge {
          border-radius: 20px;
          padding: 8px 14px;
          font-size: 0.75rem;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .list-card-body {
          min-height: 240px;
          display: flex;
          flex-direction: column;
        }

        .list-location-icon {
          color: #7c3aed;
          font-size: 1.1rem;
        }

        .list-location-text {
          font-size: 0.9rem;
          color: #64748b;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .list-card-title {
          color: #111827;
          font-size: 1.5rem;
          line-height: 1.3;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: -0.015em;
        }

        .list-card-description {
          font-size: 0.95rem;
          line-height: 1.6;
          flex-grow: 1;
          color: #374151;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .list-price {
          font-size: 1.6rem;
          font-weight: 800;
          color: #059669;
          margin-bottom: 4px;
          font-family: 'Inter', system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .list-rent-type {
          color: #64748b;
          font-size: 0.8rem;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .perfect-outline-btn {
          border-radius: 12px;
          padding: 12px 20px;
          border-width: 2px;
          font-weight: 700;
          font-size: 0.8rem;
          border-color: #7c3aed;
          color: #7c3aed;
          font-family: 'Inter', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .perfect-primary-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 700;
          font-size: 0.8rem;
          font-family: 'Inter', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Typography */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          line-height: 1.6;
          color: #1f2937;
          letter-spacing: 0.005em;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin-bottom: 0.5em;
          color: #0f172a;
        }
        
        .card-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-weight: 800 !important;
          color: #111827 !important; 
          letter-spacing: -0.02em !important;
          line-height: 1.3 !important;
        }
        
        .card-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          color: #374151 !important;
          font-weight: 400 !important;
          line-height: 1.6 !important;
        }
        
        .btn {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          font-weight: 700 !important;
          letter-spacing: 0.025em !important;
          transition: all 0.3s ease !important;
          border-radius: 12px !important;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .sidebar-column {
            width: 100%;
            position: relative;
            min-height: auto;
          }

          .properties-layout {
            flex-direction: column;
          }

          .hero-title {
            font-size: 2.5rem !important;
          }

          .results-title {
            font-size: 2rem !important;
          }

          .view-toggle-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          
          .perfect-view-btn {
            border-radius: 8px !important;
            margin-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default FindProperty;
