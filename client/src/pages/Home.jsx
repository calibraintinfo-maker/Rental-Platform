import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, formatPrice, getImageUrl } from '../utils/api';
// ✅ REMOVE THIS LINE - Don't import PropertyCard since we define it inline
// import PropertyCard from '../components/PropertyCard'; 

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Fetch real featured properties from API
  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      
      // Try to get featured properties first
      let response;
      try {
        response = await api.properties.getFeatured();
      } catch (error) {
        // Fallback to getting all properties and take first 3
        console.log('Featured endpoint not available, using regular properties');
        response = await api.properties.getAll();
      }
      
      console.log('Featured Properties Response:', response);
      
      // Handle different response structures
      let propertiesArray = [];
      if (Array.isArray(response)) {
        propertiesArray = response;
      } else if (Array.isArray(response?.data)) {
        propertiesArray = response.data;
      } else if (response?.data && typeof response.data === 'object') {
        // Look for any array property
        const dataObj = response.data;
        for (const key in dataObj) {
          if (Array.isArray(dataObj[key])) {
            propertiesArray = dataObj[key];
            break;
          }
        }
      }
      
      // Take only first 3 for featured section
      const featured = propertiesArray.slice(0, 3);
      setFeaturedProperties(featured);
      console.log('Featured properties loaded:', featured);
      
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getSafeRentType = (property) => {
    if (!property?.rentType) return 'rental';
    return Array.isArray(property.rentType) ? property.rentType[0] : property.rentType;
  };

  // ✅ INLINE PropertyCard Component - FIXED ERRORS
  const PropertyCard = ({ property }) => {
    if (!property) return null; // ✅ Add safety check

    const title = property?.title || property?.name || 'Property';
    const location = property?.location || property?.address || 'Location not specified';
    const price = property?.price || property?.rent || 0;
    const image = property?.images?.[0] || property?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    const propertyType = property?.type || property?.propertyType || 'Commercial';
    const area = property?.area || property?.size || property?.sqft || null;
    const description = property?.description || area || 'Premium rental space';
    
    return (
      <div style={{
        height: '100%',
        display: 'flex'
      }}>
        <Card style={{
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          background: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 12px 25px -3px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }}
        >
          {/* FIXED IMAGE SECTION */}
          <div style={{ 
            position: 'relative', 
            height: '240px', 
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img
              src={getImageUrl ? getImageUrl(image) : image}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
            
            {/* STATUS BADGES */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <Badge style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '5px 10px',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}>
                ✓ Available
              </Badge>
              <Badge style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '5px 10px',
                borderRadius: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}>
                ✓ Verified
              </Badge>
            </div>
          </div>

          {/* FIXED CARD BODY */}
          <Card.Body style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0
          }}>
            {/* LOCATION */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ 
                fontSize: '14px',
                filter: 'drop-shadow(0 1px 2px rgba(239, 68, 68, 0.3))'
              }}>📍</span>
              <span style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {location}
              </span>
            </div>

            {/* TITLE */}
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '8px',
              lineHeight: '1.2',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.4em'
            }}>
              {title}
            </h3>

            {/* DESCRIPTION */}
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.4',
              margin: '0 0 16px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8em',
              flex: 0
            }}>
              {description}
            </p>

            {/* PROPERTY TYPE */}
            <div style={{ marginBottom: '20px' }}>
              <Badge style={{
                background: '#3b82f6',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none'
              }}>
                {propertyType}
              </Badge>
            </div>

            {/* AREA INFO */}
            {area && (
              <div style={{
                fontSize: '0.9rem',
                color: '#374151',
                marginBottom: '20px',
                fontWeight: '600',
                padding: '8px 12px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                📐 {area}
              </div>
            )}

            {/* SPACER TO PUSH PRICE TO BOTTOM */}
            <div style={{ flex: 1 }}></div>

            {/* PRICE SECTION */}
            <div style={{
              paddingTop: '20px',
              borderTop: '1px solid #f3f4f6',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                marginBottom: '6px'
              }}>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#10b981',
                  lineHeight: 1
                }}>
                  {formatPrice ? formatPrice(price) : `₹${price}`}
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  fontWeight: '600'
                }}>
                  /monthly
                </span>
              </div>
              
              <p style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                margin: 0,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Available for Monthly
              </p>
            </div>

            {/* BUTTONS */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <Button
                as={Link}
                to={`/property/${property._id || property.id || '#'}`}
                style={{
                  flex: 1,
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Details
              </Button>
              
              <Button
                as={Link}
                to={`/booking/${property._id || property.id || '#'}`}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }}
              >
                Book Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <div className="home-wrapper" style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      lineHeight: 1.6,
      color: '#374151',
      overflowX: 'hidden',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* ✅ FIXED HERO SECTION - Added proper padding for navbar */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 0 60px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7} md={7} className="hero-content-col">
              <div className="hero-content">
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '25px',
                  padding: '6px 20px',
                  marginBottom: '24px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase'
                }}>
                  <span>Leading Rental Platform</span>
                </div>
                
                <h1 style={{
                  fontSize: '4rem',
                  fontWeight: '900',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                  color: 'white',
                  maxWidth: '95%'
                }}>
                  Rent Anything,
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Anywhere</span>
                </h1>
                
                <p style={{
                  fontSize: '1.15rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '90%'
                }}>
                  From properties to vehicles, venues to parking spaces - SpaceLink connects you with 
                  <strong style={{color: 'white'}}> exceptional rentals worldwide</strong>. 
                  Professional service, trusted transactions.
                </p>
                
                <div style={{marginBottom: '40px'}}>
                  <Link to="/find-property" style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#667eea',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{fontSize: '1.2rem'}}>🔍</span>
                    Explore Rentals
                  </Link>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '60px',
                  paddingTop: '30px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'left',
                  maxWidth: '500px'
                }}>
                  {[
                    { number: '10K+', label: 'Items Listed' },
                    { number: '500+', label: 'Cities' },
                    { number: '99%', label: 'Satisfaction' }
                  ].map((stat, index) => (
                    <div key={index}>
                      <div style={{
                        fontSize: '2.2rem',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '8px',
                        lineHeight: 1
                      }}>{stat.number}</div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            
            <Col lg={5} md={5}>
              <div style={{
                position: 'relative',
                maxWidth: '100%',
                margin: '0 auto'
              }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Professional rental platform workspace" 
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* RENTAL CATEGORIES SECTION */}
      <section style={{
        padding: '70px 0',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        <Container>
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.5px',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>RENTAL CATEGORIES</div>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '900',
              color: '#1e293b',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>What Would You Like to Rent?</h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              From real estate to parking spaces, venues to vehicles - find everything you need
            </p>
          </div>
          
          <Row>
            {[
              { 
                icon: '🏠', 
                title: 'Properties', 
                desc: 'Houses, apartments, commercial spaces and office buildings', 
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                link: '/find-property'
              },
              { 
                icon: '🎪', 
                title: 'Event Venues', 
                desc: 'Wedding halls, conference rooms, studios and event spaces', 
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                link: '/find-property'
              },
              { 
                icon: '🌱', 
                title: 'Turf', 
                desc: 'Sports turfs, football fields, cricket grounds and recreational areas', 
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                link: '/find-property'
              },
              { 
                icon: '🚗', 
                title: 'Parking', 
                desc: 'Parking spots, garages, and secure parking spaces for convenience', 
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                link: '/find-property'
              }
            ].map((category, index) => (
              <Col lg={3} md={6} key={index} style={{marginBottom: '2rem'}}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '3.2rem',
                      marginBottom: '20px'
                    }}>
                      <span>{category.icon}</span>
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: '800',
                      color: '#1e293b',
                      marginBottom: '12px'
                    }}>{category.title}</h3>
                    
                    <p style={{
                      color: '#64748b',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      marginBottom: 0,
                      minHeight: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>{category.desc}</p>
                  </div>
                  
                  <div style={{
                    marginTop: '24px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Link 
                      to={category.link}
                      style={{
                        background: category.gradient,
                        color: 'white',
                        padding: '14px 28px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                        transition: 'all 0.3s ease',
                        minWidth: '140px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Explore
                      <span style={{fontSize: '1rem'}}>→</span>
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{
        padding: '60px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container>
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '900',
              color: 'white',
              marginBottom: '16px'
            }}>How It Works</h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Simple steps to find and rent anything you need
            </p>
          </div>
          
          <Row>
            {[
              { 
                step: '01',
                title: 'Search & Discover', 
                desc: 'Browse thousands of verified listings with advanced filters', 
                icon: '🔍'
              },
              { 
                step: '02',
                title: 'Compare & Choose', 
                desc: 'Compare prices, features, and reviews to find perfect match', 
                icon: '⚖️'
              },
              { 
                step: '03',
                title: 'Book & Enjoy', 
                desc: 'Secure booking with instant confirmation and 24/7 support', 
                icon: '✨'
              }
            ].map((item, index) => (
              <Col lg={4} key={index} style={{marginBottom: '2rem'}}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '36px 28px',
                  textAlign: 'center',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '28px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '900'
                  }}>{item.step}</div>
                  
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    fontSize: '2.5rem'
                  }}>
                    <span>{item.icon}</span>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: '#1e293b',
                    marginBottom: '16px'
                  }}>{item.title}</h3>
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    lineHeight: 1.6
                  }}>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ✅ PROFESSIONAL FEATURED PROPERTIES SECTION */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        position: 'relative'
      }}>
        <Container>
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '25px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '24px'
            }}>FEATURED LISTINGS</div>
            <h2 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '20px',
              letterSpacing: '-0.02em'
            }}>Premium Properties</h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Handpicked luxury properties from our expert curation team
            </p>
          </div>
          
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 0'
            }}>
              <div className="spinner-border" role="status" style={{
                color: '#667eea',
                width: '3rem',
                height: '3rem'
              }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{
                marginTop: '20px',
                color: '#6b7280',
                fontSize: '1.1rem'
              }}>Loading featured properties...</p>
            </div>
          ) : (
            <Row className="justify-content-center g-4">
              {featuredProperties.length > 0 ? (
                featuredProperties.map((property, index) => (
                  <Col lg={4} md={6} key={property._id || property.id || index}>
                    <PropertyCard property={property} />
                  </Col>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px'
                }}>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1.1rem',
                    marginBottom: '30px'
                  }}>No featured properties available at the moment</p>
                  <Link to="/find-property" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '14px 32px',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }}>
                    Browse All Properties
                  </Link>
                </div>
              )}
            </Row>
          )}
        </Container>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '60px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center'
      }}>
        <Container>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: '900',
              color: 'white',
              marginBottom: '20px'
            }}>Ready to Start Renting?</h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '32px',
              lineHeight: 1.6
            }}>
              Join thousands of renters and owners making seamless transactions worldwide
            </p>
            <Link to="/find-property" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#667eea',
              padding: '16px 40px',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '1.1rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}>
              Start Your Search
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
