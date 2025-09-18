import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { api, handleApiError } from '../utils/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await api.properties.getFeatured();
      setFeaturedProperties(response.data);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Welcome to SpaceLink
              </h1>
              <p className="lead mb-4">
                Your trusted platform for finding and renting properties. 
                From residential apartments to commercial spaces, parking, and event venues.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button as={Link} to="/find-property" variant="light" size="lg">
                  🔍 Find Property
                </Button>
                <Button as={Link} to="/add-property" variant="outline-light" size="lg">
                  ➕ Add Your Property
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Properties */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3">Featured Properties</h2>
              <p className="lead text-muted">
                Discover our handpicked selection of premium properties
              </p>
            </Col>
          </Row>

          {loading ? (
            <Row>
              <Col className="text-center">
                <div className="loader">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </Col>
            </Row>
          ) : error ? (
            <Row>
              <Col className="text-center">
                <div className="alert alert-danger">{error}</div>
              </Col>
            </Row>
          ) : (
            <>
              <Row className="g-4">
                {featuredProperties.slice(0, 6).map((property) => (
                  <Col key={property._id} lg={4} md={6}>
                    <PropertyCard property={property} showOwner={true} />
                  </Col>
                ))}
              </Row>

              <Row className="mt-5">
                <Col className="text-center">
                  <Button as={Link} to="/find-property" variant="primary" size="lg">
                    🔍 Explore More Properties
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3">Property Categories</h2>
              <p className="lead text-muted">
                Find the perfect space for your specific needs
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={2} md={4} sm={6}>
              <Card 
                className="category-card text-center h-100 border-0" 
                as={Link}
                to="/find-property?category=Property Rentals"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card.Body>
                  <div className="feature-icon">🏠</div>
                  <h5>Property Rentals</h5>
                  <p className="text-muted">Apartments, Flats, Houses</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <Card 
                className="category-card text-center h-100 border-0"
                as={Link}
                to="/find-property?category=Commercial"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card.Body>
                  <div className="feature-icon">🏢</div>
                  <h5>Commercial</h5>
                  <p className="text-muted">Offices, Shops, Warehouses</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <Card 
                className="category-card text-center h-100 border-0"
                as={Link}
                to="/find-property?category=Land"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card.Body>
                  <div className="feature-icon">🌾</div>
                  <h5>Land</h5>
                  <p className="text-muted">Agricultural, Commercial Plots</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <Card 
                className="category-card text-center h-100 border-0"
                as={Link}
                to="/find-property?category=Parking"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card.Body>
                  <div className="feature-icon">🚗</div>
                  <h5>Parking</h5>
                  <p className="text-muted">Car, Bike, Garage Spaces</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <Card 
                className="category-card text-center h-100 border-0"
                as={Link}
                to="/find-property?category=Event"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card.Body>
                  <div className="feature-icon">🎉</div>
                  <h5>Events</h5>
                  <p className="text-muted">Banquet, Gardens, Halls</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6}>
              <Card 
                className="category-card text-center h-100 border-0"
                as={Link}
                to="/manage-properties"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card.Body>
                  <div className="feature-icon">🔧</div>
                  <h5>Manage</h5>
                  <p className="text-muted">Add & Manage Properties</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3">Why Choose SpaceLink?</h2>
              <p className="lead text-muted">
                Experience the future of property rentals
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="text-center h-100 border-0">
                <Card.Body>
                  <div className="feature-icon">⚡</div>
                  <h4>Real-Time Filtering</h4>
                  <p className="text-muted">
                    Find properties instantly with our advanced filtering system. 
                    Search by category, price, location, and availability.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 border-0">
                <Card.Body>
                  <div className="feature-icon">🛠️</div>
                  <h4>Owner Tools</h4>
                  <p className="text-muted">
                    Comprehensive property management tools for owners. 
                    Add, edit, disable properties and track bookings easily.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 border-0">
                <Card.Body>
                  <div className="feature-icon">🔒</div>
                  <h4>Secure Access</h4>
                  <p className="text-muted">
                    Protected routes and secure authentication ensure your data 
                    and transactions are always safe and private.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
