import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await api.properties.getPropertyById(id);
        setProperty(response.data);
      } catch (err) {
        setError('Failed to fetch property details');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return { bg: 'rgba(22, 163, 74, 0.1)', text: '#059669', border: '#10b981' };
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: '#f59e0b' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: '#ef4444' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#9ca3af' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Animated Grid Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 1,
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'fixed',
          top: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }} />
        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: 1,
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          zIndex: 2,
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #805ad5',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#4a5568', fontSize: '18px', fontWeight: '500' }}>
            Loading property details...
          </p>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes gridMove {
              0% { transform: translateX(0) translateY(0); }
              25% { transform: translateX(25px) translateY(0); }
              50% { transform: translateX(25px) translateY(25px); }
              75% { transform: translateX(0) translateY(25px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.02); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Animated Grid Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 1,
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'fixed',
          top: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }} />
        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: 1,
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          zIndex: 2,
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Error Loading Property</h2>
          <p style={{ color: '#4a5568', marginBottom: '30px' }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Go Back
          </button>
        </div>

        <style>
          {`
            @keyframes gridMove {
              0% { transform: translateX(0) translateY(0); }
              25% { transform: translateX(25px) translateY(0); }
              50% { transform: translateX(25px) translateY(25px); }
              75% { transform: translateX(0) translateY(25px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.02); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Animated Grid Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 1,
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'fixed',
          top: '15%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1,
        }} />
        <div style={{
          position: 'fixed',
          bottom: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: 1,
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          zIndex: 2,
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏠</div>
          <h2 style={{ color: '#4a5568', marginBottom: '30px' }}>Property Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Go Back
          </button>
        </div>

        <style>
          {`
            @keyframes gridMove {
              0% { transform: translateX(0) translateY(0); }
              25% { transform: translateX(25px) translateY(0); }
              50% { transform: translateX(25px) translateY(25px); }
              75% { transform: translateX(0) translateY(25px); }
              100% { transform: translateX(0) translateY(0); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.02); }
            }
          `}
        </style>
      </div>
    );
  }

  const statusColors = getStatusColor(property.verification_status);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(90deg, rgba(128, 90, 213, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(128, 90, 213, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 1,
      }} />

      {/* Floating Orbs */}
      <div style={{
        position: 'fixed',
        top: '15%',
        right: '8%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(128, 90, 213, 0.08), transparent)',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '10%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)',
        animation: 'float 10s ease-in-out infinite reverse',
        zIndex: 1,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginRight: '20px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ← Back
            </button>
            <div style={{
              background: `linear-gradient(135deg, ${statusColors.bg}, ${statusColors.bg})`,
              color: statusColors.text,
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              border: `1px solid ${statusColors.border}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {property.verification_status || 'Pending'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)',
              color: 'white',
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginRight: '20px',
              boxShadow: '0 10px 25px rgba(128, 90, 213, 0.3)'
            }}>
              🏠
            </div>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2d3748',
                margin: '0 0 5px 0'
              }}>
                {property.property_type || 'Property'} Details
              </h1>
              <p style={{
                color: '#718096',
                fontSize: '16px',
                margin: '0'
              }}>
                Property ID: {property.property_id || id}
              </p>
            </div>
          </div>
        </div>

        {/* Property Information Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Basic Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px', fontSize: '24px' }}>📋</span>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Property Type</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.property_type || 'Not specified'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Category</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.category || 'Not specified'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Location</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.location || 'Not specified'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Address</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.address || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px', fontSize: '24px' }}>🏘️</span>
              Property Details
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Price</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.price ? `₹${Number(property.price).toLocaleString()}` : 'Not specified'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Area</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.area ? `${property.area} sq ft` : 'Not specified'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Bedrooms</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.bedrooms || 'Not specified'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#718096', fontWeight: '500' }}>Bathrooms</label>
                <p style={{ fontSize: '16px', color: '#2d3748', margin: '5px 0', fontWeight: '600' }}>
                  {property.bathrooms || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {property.description && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '10px', fontSize: '24px' }}>📝</span>
              Description
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4a5568',
              lineHeight: '1.6',
              margin: '0'
            }}>
              {property.description}
            </p>
          </div>
        )}

        {/* Admin Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '10px', fontSize: '24px' }}>🔧</span>
            Admin Information
          </h3>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '20px', marginRight: '10px' }}>💬</span>
              <strong style={{ color: '#2d3748' }}>Admin Remark:</strong>
            </div>
            <p style={{
              color: '#4a5568',
              fontSize: '16px',
              margin: '0',
              fontStyle: 'italic'
            }}>
              {property.admin_remark || 'No specific remarks provided'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#718096',
            fontSize: '14px'
          }}>
            <span style={{ fontSize: '16px', marginRight: '8px' }}>📅</span>
            <strong>Updated:</strong>
            <span style={{ marginLeft: '8px' }}>
              {formatDate(property.updated_at)}
            </span>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes gridMove {
            0% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(25px) translateY(0); }
            50% { transform: translateX(25px) translateY(25px); }
            75% { transform: translateX(0) translateY(25px); }
            100% { transform: translateX(0) translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.02); }
          }

          @media (max-width: 768px) {
            .property-details-container {
              padding: 20px !important;
            }
            
            .property-details-grid {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            
            .property-details-card {
              padding: 20px !important;
            }
            
            .property-details-header h1 {
              font-size: 24px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PropertyDetails;
