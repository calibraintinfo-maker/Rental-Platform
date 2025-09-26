import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, formatPrice, getImageUrl } from '../utils/api';
import PropertyCard from '../components/PropertyCard'; // ✅ Add this import

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

  return (
    <div className="home-wrapper">
      {/* ✅ FIXED HERO SECTION - Added proper padding for navbar */}
      <section className="hero-section">
        <div className="hero-background-elements">
          <div className="hero-float-1"></div>
        </div>
        
        <Container>
          <Row className="align-items-center">
            <Col lg={7} md={7} className="hero-content-col">
              <div className="hero-content">
                <div className="hero-badge">
                  <span>Leading Rental Platform</span>
                </div>
                
                <h1 className="hero-title">
                  Rent Anything,
                  <br />
                  <span className="hero-title-gradient">Anywhere</span>
                </h1>
                
                <p className="hero-description">
                  From properties to vehicles, venues to parking spaces - SpaceLink connects you with 
                  <strong> exceptional rentals worldwide</strong>. 
                  Professional service, trusted transactions.
                </p>
                
                <div className="hero-cta">
                  <Link to="/find-property" className="hero-cta-button">
                    <span>🔍</span>
                    Explore Rentals
                  </Link>
                </div>
                
                <div className="hero-stats">
                  {[
                    { number: '10K+', label: 'Items Listed' },
                    { number: '500+', label: 'Cities' },
                    { number: '99%', label: 'Satisfaction' }
                  ].map((stat, index) => (
                    <div key={index} className="hero-stat">
                      <div className="hero-stat-number">{stat.number}</div>
                      <div className="hero-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            
            <Col lg={5} md={5} className="hero-image-col">
              <div className="hero-image-container">
                <div className="hero-main-image">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Professional rental platform workspace" 
                    className="hero-image"
                  />
                </div>
                
                <div className="hero-floating-card hero-card-1">
                  <div className="hero-card-icon premium">
                    <span>🏆</span>
                  </div>
                  <div className="hero-card-content">
                    <div className="hero-card-title">Premium Quality</div>
                    <div className="hero-card-subtitle">Verified & Trusted</div>
                  </div>
                </div>
                
                <div className="hero-floating-card hero-card-2">
                  <div className="hero-card-icon instant">
                    <span>⚡</span>
                  </div>
                  <div className="hero-card-content">
                    <div className="hero-card-title">Instant Booking</div>
                    <div className="hero-card-subtitle">Book in Seconds</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* RENTAL CATEGORIES SECTION */}
      <section className="rental-categories-section">
        <div className="section-background-elements">
          <div className="bg-element-1"></div>
          <div className="bg-element-2"></div>
        </div>
        
        <Container>
          <div className="section-header">
            <div className="section-badge">RENTAL CATEGORIES</div>
            <h2 className="section-title">What Would You Like to Rent?</h2>
            <p className="section-description">
              From real estate to parking spaces, venues to vehicles - find everything you need
            </p>
          </div>
          
          <Row className="rental-categories-row">
            {[
              { 
                icon: '🏠', 
                title: 'Properties', 
                desc: 'Houses, apartments, commercial spaces and office buildings', 
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                bgColor: 'rgba(102, 126, 234, 0.1)',
                link: '/find-property'
              },
              { 
                icon: '🎪', 
                title: 'Event Venues', 
                desc: 'Wedding halls, conference rooms, studios and event spaces', 
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                bgColor: 'rgba(240, 147, 251, 0.1)',
                link: '/find-property'
              },
              { 
                icon: '🌱', 
                title: 'Turf', 
                desc: 'Sports turfs, football fields, cricket grounds and recreational areas', 
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                bgColor: 'rgba(79, 172, 254, 0.1)',
                link: '/find-property'
              },
              { 
                icon: '🚗', 
                title: 'Parking', 
                desc: 'Parking spots, garages, and secure parking spaces for convenience', 
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                bgColor: 'rgba(67, 233, 123, 0.1)',
                link: '/find-property'
              }
            ].map((category, index) => (
              <Col lg={3} md={6} className="rental-category-col" key={index}>
                <div className="rental-category-card">
                  <div 
                    className="category-bg-element" 
                    style={{ background: category.bgColor }}
                  ></div>
                  
                  <div 
                    className="category-border" 
                    style={{ background: category.gradient }}
                  ></div>
                  
                  <div className="category-content">
                    <div className="category-icon">
                      <span>{category.icon}</span>
                    </div>
                    
                    <h3 className="category-title">{category.title}</h3>
                    
                    <p className="category-description">{category.desc}</p>
                  </div>
                  
                  <div className="category-button-container">
                    <Link 
                      to={category.link}
                      className="category-explore-button"
                      style={{ background: category.gradient }}
                    >
                      Explore
                      <span className="button-arrow">→</span>
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title-white">How It Works</h2>
            <p className="section-description-white">
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
              <Col lg={4} key={index} className="how-it-works-col">
                <div className="how-it-works-card">
                  <div className="step-number">{item.step}</div>
                  
                  <div className="step-icon">
                    <span>{item.icon}</span>
                  </div>
                  
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-description">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ✅ PROFESSIONAL FEATURED PROPERTIES SECTION */}
      <section className="featured-properties-section">
        <Container>
          <div className="section-header">
            <div className="section-badge">FEATURED LISTINGS</div>
            <h2 className="section-title">Premium Properties</h2>
            <p className="section-description">
              Handpicked luxury properties from our expert curation team
            </p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Loading featured properties...</p>
            </div>
          ) : (
            <Row className="justify-content-center g-4">
              {featuredProperties.length > 0 ? (
                featuredProperties.map((property, index) => (
                  <Col lg={4} md={6} className="featured-property-col" key={property._id || index}>
                    <PropertyCard property={property} />
                  </Col>
                ))
              ) : (
                <div className="no-properties">
                  <p>No featured properties available at the moment</p>
                  <Link to="/find-property" className="browse-all-button">
                    Browse All Properties
                  </Link>
                </div>
              )}
            </Row>
          )}
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Renting?</h2>
            <p className="cta-description">
              Join thousands of renters and owners making seamless transactions worldwide
            </p>
            <Link to="/find-property" className="cta-button">
              Start Your Search
            </Link>
          </div>
        </Container>
      </section>

      {/* ✅ UPDATED CSS WITH NAVBAR FIX */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        .home-wrapper {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #374151;
          overflow-x: hidden;
        }
        
        /* ===============================
           ✅ HERO SECTION - FIXED NAVBAR OVERLAP
           =============================== */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 60px 0; /* ✅ KEY FIX: Added 120px top padding for navbar */
          position: relative;
          overflow: hidden;
        }
        
        .hero-background-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .hero-float-1 {
          position: absolute;
          top: 15%;
          right: 10%;
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          border-radius: 50%;
          filter: blur(50px);
          animation: float 10s ease-in-out infinite;
        }
        
        .hero-content-col {
          margin-bottom: 2rem;
        }
        
        .hero-content {
          max-width: 100%;
          padding-right: 2rem;
        }
        
        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 6px 20px;
          margin-bottom: 24px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        
        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
          color: white;
          max-width: 95%;
        }
        
        .hero-title-gradient {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-description {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 90%;
        }
        
        .hero-description strong {
          color: white;
        }
        
        .hero-cta {
          margin-bottom: 40px;
        }
        
        .hero-cta-button {
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        
        .hero-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          color: #667eea;
          text-decoration: none;
        }
        
        .hero-cta-button span {
          font-size: 1.2rem;
        }
        
        .hero-stats {
          display: flex;
          justify-content: flex-start;
          gap: 60px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          text-align: left;
          max-width: 500px;
        }
        
        .hero-stat-number {
          font-size: 2.2rem;
          font-weight: 900;
          color: white;
          margin-bottom: 8px;
          line-height: 1;
        }
        
        .hero-stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .hero-image-col {
          position: relative;
        }
        
        .hero-image-container {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
        }
        
        .hero-main-image {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }
        
        .hero-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }
        
        .hero-floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .hero-card-1 {
          top: 20px;
          right: 20px;
          animation: float 6s ease-in-out infinite;
        }
        
        .hero-card-2 {
          bottom: 20px;
          left: 20px;
          animation: float 6s ease-in-out infinite 3s;
        }
        
        .hero-card-icon {
          border-radius: 8px;
          padding: 6px;
          font-size: 12px;
          color: white;
        }
        
        .hero-card-icon.premium {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hero-card-icon.instant {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .hero-card-title {
          font-weight: 700;
          color: #1e293b;
          font-size: 0.8rem;
        }
        
        .hero-card-subtitle {
          font-size: 0.7rem;
          color: #64748b;
        }
        
        /* ===============================
           RENTAL CATEGORIES - PERFECT ALIGNMENT
           =============================== */
        .rental-categories-section {
          padding: 70px 0;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          position: relative;
        }
        
        .section-background-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .bg-element-1 {
          position: absolute;
          top: 20%;
          left: 5%;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(116, 75, 162, 0.1) 100%);
          border-radius: 50%;
          filter: blur(30px);
        }
        
        .bg-element-2 {
          position: absolute;
          bottom: 20%;
          right: 5%;
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%);
          border-radius: 50%;
          filter: blur(40px);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 6px 16px;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        
        .section-title {
          font-size: 2.8rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 16px;
          line-height: 1.2;
        }
        
        .section-description {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        /* ✅ PERFECT BUTTON ALIGNMENT */
        .rental-categories-row {
          display: flex;
          align-items: stretch;
        }
        
        .rental-category-col {
          display: flex;
          margin-bottom: 2rem;
        }
        
        .rental-category-card {
          background: white;
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        
        .rental-category-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .category-bg-element {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          filter: blur(20px);
        }
        
        .category-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        
        .category-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .category-icon {
          font-size: 3.2rem;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }
        
        .category-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 12px;
        }
        
        .category-description {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 0;
          min-height: 60px;
          display: flex;
          align-items: center;
          text-align: center;
        }
        
        /* ✅ PERFECTLY ALIGNED BUTTONS */
        .category-button-container {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }
        
        .category-explore-button {
          color: white;
          padding: 14px 28px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          min-width: 140px;
          white-space: nowrap;
        }
        
        .category-explore-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          text-decoration: none;
          color: white;
        }
        
        .button-arrow {
          font-size: 1rem;
        }
        
        /* ===============================
           HOW IT WORKS SECTION
           =============================== */
        .how-it-works-section {
          padding: 60px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        
        .section-title-white {
          font-size: 2.8rem;
          font-weight: 900;
          color: white;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .section-description-white {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }
        
        .how-it-works-col {
          margin-bottom: 2rem;
        }
        
        .how-it-works-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 36px 28px;
          text-align: center;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        
        .how-it-works-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
        }
        
        .step-number {
          position: absolute;
          top: -12px;
          left: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 900;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .step-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          font-size: 2.5rem;
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.3);
        }
        
        .step-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 16px;
        }
        
        .step-description {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        /* ===============================
           ✅ PROFESSIONAL FEATURED PROPERTIES SECTION
           =============================== */
        .featured-properties-section {
          padding: 100px 0;
          background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
          position: relative;
        }
        .featured-properties-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
        }
        .featured-properties-section .section-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }
        .featured-properties-section .section-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .featured-properties-section .section-description {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .loading-container {
          text-align: center;
          padding: 60px 0;
        }
        .spinner-border {
          color: #667eea;
          width: 3rem;
          height: 3rem;
        }
        .loading-text {
          margin-top: 20px;
          color: #6b7280;
          font-size: 1.1rem;
        }
        .no-properties {
          text-align: center;
          padding: 60px 20px;
        }
        .no-properties p {
          color: #6b7280;
          font-size: 1.1rem;
          margin-bottom: 30px;
        }
        .browse-all-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          border-radius: 16px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }
        .browse-all-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          color: white;
          text-decoration: none;
        }
        
        /* ===============================
           CTA SECTION
           =============================== */
        .cta-section {
          padding: 60px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          text-align: center;
        }
        
        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .cta-title {
          font-size: 2.8rem;
          font-weight: 900;
          color: white;
          margin-bottom: 20px;
        }
        
        .cta-description {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 32px;
          line-height: 1.6;
        }
        
        .cta-button {
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
          padding: 16px 40px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
          color: #667eea;
          text-decoration: none;
        }
        
        /* ===============================
           ANIMATIONS
           =============================== */
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-15px); 
          }
        }
        
        /* ===============================
           RESPONSIVE BREAKPOINTS
           =============================== */
        
        /* Large Desktop */
        @media (min-width: 1200px) {
          .hero-title {
            font-size: 4.5rem;
          }
          
          .section-title {
            font-size: 3rem;
          }
          
          .featured-properties-section .section-title {
            font-size: 3.75rem;
          }
        }
        
        /* Desktop */
        @media (max-width: 1199px) {
          .hero-content {
            padding-right: 1rem;
          }
          
          .hero-stats {
            gap: 40px;
          }
        }
        
        /* Tablet */
        @media (max-width: 991px) {
          .hero-section {
            padding: 100px 0 40px 0; /* ✅ Reduced top padding for tablets */
            min-height: auto;
          }
          
          .hero-content-col {
            margin-bottom: 3rem;
          }
          
          .hero-content {
            padding-right: 0;
            text-align: center;
          }
          
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-stats {
            justify-content: center;
            gap: 30px;
          }
          
          .rental-categories-row {
            flex-direction: column;
          }
          
          .rental-category-col {
            margin-bottom: 2rem;
          }
          
          .category-explore-button {
            width: 100%;
            min-width: auto;
          }
          
          .section-title {
            font-size: 2.5rem;
          }
          
          .section-title-white {
            font-size: 2.5rem;
          }
          
          .cta-title {
            font-size: 2.5rem;
          }
          
          .featured-properties-section {
            padding: 80px 0;
          }
          .featured-properties-section .section-title {
            font-size: 3rem;
          }
        }
        
        /* Mobile Large */
        @media (max-width: 768px) {
          .hero-section {
            padding: 90px 0 30px 0; /* ✅ Adjusted for mobile */
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-description {
            font-size: 1rem;
            max-width: 100%;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 20px;
            text-align: center;
            max-width: 100%;
          }
          
          .hero-image {
            height: 300px;
          }
          
          .rental-categories-section {
            padding: 50px 0;
          }
          
          .section-title {
            font-size: 2.2rem;
          }
          
          .section-title-white {
            font-size: 2.2rem;
          }
          
          .cta-title {
            font-size: 2.2rem;
          }
          
          .category-icon {
            font-size: 2.5rem;
          }
          
          .category-title {
            font-size: 1.3rem;
          }
          
          .category-description {
            font-size: 0.9rem;
            min-height: auto;
          }
          
          .how-it-works-section {
            padding: 50px 0;
          }
          
          .featured-properties-section {
            padding: 60px 0;
          }
          .featured-properties-section .section-title {
            font-size: 2.5rem;
          }
          .featured-properties-section .section-header {
            margin-bottom: 50px;
          }
        }
        
        /* Mobile Small */
        @media (max-width: 576px) {
          .hero-section {
            padding: 80px 0 20px 0; /* ✅ Further adjusted for small mobile */
          }
          
          .hero-badge {
            padding: 5px 15px;
            font-size: 0.65rem;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-description {
            font-size: 0.9rem;
          }
          
          .hero-cta-button {
            padding: 14px 24px;
            font-size: 1rem;
          }
          
          .rental-categories-section {
            padding: 40px 0;
          }
          
          .rental-category-card {
            padding: 24px 20px;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .section-title-white {
            font-size: 1.8rem;
          }
          
          .cta-title {
            font-size: 1.8rem;
          }
          
          .section-description {
            font-size: 1rem;
          }
          
          .category-icon {
            font-size: 2rem;
            margin-bottom: 15px;
          }
          
          .category-title {
            font-size: 1.2rem;
            margin-bottom: 10px;
          }
          
          .category-description {
            font-size: 0.85rem;
          }
          
          .category-explore-button {
            padding: 12px 20px;
            font-size: 0.85rem;
          }
          
          .how-it-works-card {
            padding: 24px 20px;
            min-height: auto;
          }
          
          .step-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
          
          .step-title {
            font-size: 1.3rem;
          }
          
          .hero-floating-card {
            display: none;
          }
          .featured-properties-section {
            padding: 50px 0;
          }
          .featured-properties-section .section-title {
            font-size: 2rem;
          }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 480px) {
          .hero-section {
            padding: 75px 0 15px 0; /* ✅ Minimal padding for extra small screens */
          }
          
          .hero-title {
            font-size: 1.8rem;
          }
          
          .section-title,
          .section-title-white,
          .cta-title {
            font-size: 1.6rem;
          }
          
          .category-explore-button {
            padding: 10px 18px;
            font-size: 0.8rem;
          }
          .featured-properties-section .section-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
