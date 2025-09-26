import React, { useCallback } from 'react';
import { Offcanvas, Spinner } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/api';

const NotificationSidebar = () => {
  const {
    notifications,
    loading,
    error,
    sidebarOpen,
    setSidebarOpen,
    markAsRead,
    deleteNotification
  } = useNotification();

  // Prevent auto-refresh with useCallback
  const handleClose = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const handleMarkAsRead = useCallback((id) => {
    markAsRead(id);
  }, [markAsRead]);

  const handleDelete = useCallback((id) => {
    deleteNotification(id);
  }, [deleteNotification]);

  return (
    <Offcanvas 
      show={sidebarOpen} 
      onHide={handleClose} 
      placement="end"
      style={{
        width: '400px',
        maxWidth: '90vw',
        border: 'none',
        boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.12)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#ffffff'
      }}
    >
      {/* Violet Themed Header */}
      <div style={{
        padding: '24px 24px 20px 24px',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              Notifications
            </h3>
            {notifications.length > 0 && (
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '0.875rem',
                opacity: 0.9,
                fontWeight: '500'
              }}>
                {notifications.filter(n => !n.read).length} new updates
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '18px',
              lineHeight: 1,
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        height: 'calc(100vh - 104px)',
        overflowY: 'auto',
        background: '#fafbfc'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Spinner 
                animation="border" 
                style={{
                  width: '20px',
                  height: '20px',
                  borderWidth: '2px',
                  color: 'white'
                }}
              />
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500',
              margin: 0
            }}>
              Loading your notifications...
            </p>
          </div>
        ) : error ? (
          <div style={{
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              marginBottom: '20px'
            }}>
              🔔
            </div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              All caught up!
            </h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              margin: 0,
              maxWidth: '280px',
              lineHeight: '1.5'
            }}>
              You have no new notifications. We'll let you know when something important happens.
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            {notifications.map((n) => (
              <div 
                key={n._id} 
                style={{
                  background: 'white',
                  margin: '0 0 12px 0',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  opacity: n.read ? 0.75 : 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Violet Unread Indicator */}
                {!n.read && (
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '24px',
                    width: '8px',
                    height: '8px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)'
                  }} />
                )}
                
                <div style={{ paddingLeft: !n.read ? '20px' : '0' }}>
                  {/* Message */}
                  <div style={{
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    paddingRight: '12px'
                  }}>
                    {n.message}
                    {!n.read && (
                      <span 
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                          color: 'white',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          marginLeft: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Date */}
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                    fontWeight: '500',
                    marginBottom: '16px'
                  }}>
                    {formatDate(n.createdAt)}
                  </div>
                  
                  {/* Violet Themed Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkAsRead(n._id)}
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                          color: 'white',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
                        }}
                      >
                        ✓ Mark as read
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(n._id)}
                      style={{
                        background: 'white',
                        color: '#6b7280',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fecaca';
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Offcanvas>
  );
};

export default NotificationSidebar;
