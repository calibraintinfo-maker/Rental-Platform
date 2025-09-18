import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { api, handleApiError, categories } from '../utils/api';

const FindProperty = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    fromDate: searchParams.get('fromDate') || '',
    toDate: searchParams.get('toDate') || ''
  });

  useEffect(() => {
    fetchProperties();
  }, [pagination.page]);

  // Handle URL parameter changes
  useEffect(() => {
    const newFilters = {
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      fromDate: searchParams.get('fromDate') || '',
      toDate: searchParams.get('toDate') || ''
    };
    
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchParams]);

  // Fetch properties when filters change
  useEffect(() => {
    if (Object.values(filters).some(value => value !== '')) {
      fetchProperties();
    }
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await api.properties.getAll(queryParams);
      setProperties(response.data.properties);
      setPagination(response.data.pagination);
      setError('');
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    
    setFilters(newFilters);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      }
    });
    setSearchParams(newSearchParams);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProperties();
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      state: '',
      fromDate: '',
      toDate: ''
    };
    
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({}); // Clear URL parameters
  };

  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({ ...prev, page: pageNumber }));
  };

  return (
    <Container className="py-4">
      {/* Header Section */}
      {filters.category && (
        <Row className="mb-4">
          <Col>
            <Card className="bg-primary text-white">
              <Card.Body className="text-center">
                <h3 className="mb-2">
                  {filters.category === 'Property Rentals' && '🏠'}
                  {filters.category === 'Commercial' && '🏢'}
                  {filters.category === 'Land' && '🌾'}
                  {filters.category === 'Parking' && '🚗'}
                  {filters.category === 'Event' && '🎉'}
                  {' '}{filters.category}
                </h3>
                <p className="mb-0">
                  {filters.category === 'Property Rentals' && 'Apartments, Flats, Houses'}
                  {filters.category === 'Commercial' && 'Offices, Shops, Warehouses'}
                  {filters.category === 'Land' && 'Agricultural, Commercial Plots'}
                  {filters.category === 'Parking' && 'Car, Bike, Garage Spaces'}
                  {filters.category === 'Event' && 'Banquet, Gardens, Halls'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={3}>
          {/* Filter Sidebar */}
          <Card className="filter-sidebar mb-4">
            <Card.Header>
              <h5 className="mb-0">🔍 Filter Properties</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleFilterSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Category 
                    {filters.category && (
                      <span className="badge bg-primary ms-2">
                        {filters.category}
                      </span>
                    )}
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {Object.keys(categories).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Min Price"
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Max Price"
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder="City"
                    className="mb-2"
                  />
                  <Form.Control
                    type="text"
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                    placeholder="State"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Availability</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    className="mb-2"
                  />
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                  />
                  <Form.Text className="text-muted">
                    Select date range to check availability
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary">
                    Apply Filters
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline-secondary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Find Properties</h2>
              <p className="text-muted mb-0">
                {pagination.total > 0 && `${pagination.total} properties found`}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading properties...</p>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              {properties.length > 0 ? (
                <>
                  <Row className="g-4 mb-4">
                    {properties.map((property) => (
                      <Col key={property._id} lg={4} md={6}>
                        <PropertyCard property={property} showOwner={true} />
                      </Col>
                    ))}
                  </Row>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="d-flex justify-content-center">
                      <Pagination>
                        <Pagination.First 
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.page === 1}
                        />
                        <Pagination.Prev 
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        />
                        
                        {[...Array(pagination.pages)].map((_, index) => {
                          const pageNumber = index + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.pages ||
                            (pageNumber >= pagination.page - 2 && pageNumber <= pagination.page + 2)
                          ) {
                            return (
                              <Pagination.Item
                                key={pageNumber}
                                active={pageNumber === pagination.page}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </Pagination.Item>
                            );
                          }
                          return null;
                        })}
                        
                        <Pagination.Next 
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                        />
                        <Pagination.Last 
                          onClick={() => handlePageChange(pagination.pages)}
                          disabled={pagination.page === pagination.pages}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <Card className="text-center py-5">
                  <Card.Body>
                    <h4>No Properties Found</h4>
                    <p className="text-muted">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button variant="primary" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FindProperty;
