import React from 'react';
import { Offcanvas, Badge, Button, Spinner } from 'react-bootstrap';
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

  // Simple SVG Icons
  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6"/>
    </svg>
  );

  return (
    <Offcanvas 
      show={sidebarOpen} 
      onHide={() => setSidebarOpen(false)} 
      placement="end"
      style={{
        width: '380px',
        maxWidth: '90vw',
        border: 'none',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Clean Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '60px'
      }}>
        <div>
          <h4 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827'
          }}>
            Notifications
          </h4>
          {notifications.length > 0 && (
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '2px'
            }}>
              {notifications.filter(n => !n.read).length} unread
            </p>
          )}
        </div>
        
        <button
          onClick={() => setSidebarOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '20px',
            lineHeight: 1,
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
        >
          ×
        </button>
      </div>

      {/* Scrollable Body */}
      <div style={{
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        background: '#f9fafb'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <Spinner 
              animation="border" 
              style={{
                width: '28px',
                height: '28px',
                borderWidth: '2px',
                color: '#8b5cf6'
              }}
            />
            <p style={{
              marginTop: '12px',
              color: '#6b7280',
              fontSize: '0.875rem',
              margin: '12px 0 0 0'
            }}>
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div style={{
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              padding: '16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '12px',
              opacity: 0.5
            }}>
              🔔
            </div>
            <h6 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              margin: '0 0 4px 0'
            }}>
              No notifications
            </h6>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: 0
            }}>
              You're all caught up!
            </p>
          </div>
        ) : (
          <div style={{ padding: '12px' }}>
            {notifications.map((n) => (
              <div 
                key={n._id} 
                style={{
                  background: 'white',
                  margin: '0 0 8px 0',
                  padding: '16px',
                  borderRadius: '8px',
                  border: n.read ? '1px solid #f3f4f6' : '1px solid #e5e7eb',
                  position: 'relative',
                  opacity: n.read ? 0.7 : 1
                }}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '20px',
                    width: '6px',
                    height: '6px',
                    background: '#8b5cf6',
                    borderRadius: '50%'
                  }} />
                )}
                
                <div style={{ paddingLeft: !n.read ? '16px' : '0' }}>
                  {/* Message */}
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    lineHeight: '1.4',
                    marginBottom: '6px'
                  }}>
                    {n.message}
                    {!n.read && (
                      <span 
                        style={{
                          background: '#8b5cf6',
                          color: 'white',
                          fontSize: '0.625rem',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          marginLeft: '8px'
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Date */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '12px'
                  }}>
                    {formatDate(n.createdAt)}
                  </div>
                  
                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        style={{
                          background: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#7c3aed'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#8b5cf6'}
                      >
                        <CheckIcon />
                        Mark as read
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(n._id)}
                      style={{
                        background: '#f3f4f6',
                        color: '#6b7280',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.borderColor = '#fecaca';
                        e.currentTarget.style.color = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <TrashIcon />
                      Delete
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
