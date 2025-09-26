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

  // Professional SVG Icons
  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );

  const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6"/>
      <path d="M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
    </svg>
  );

  const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  return (
    <Offcanvas 
      show={sidebarOpen} 
      onHide={() => setSidebarOpen(false)} 
      placement="end"
      style={{
        width: '400px',
        maxWidth: '90vw'
      }}
    >
      {/* Professional Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        background: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BellIcon />
            </div>
            <div>
              <h5 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#111827',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Notifications
              </h5>
              {notifications.length > 0 && (
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {notifications.filter(n => !n.read).length} unread
                </p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      </div>

      {/* Professional Body */}
      <div style={{
        padding: '0',
        background: '#f9fafb',
        minHeight: 'calc(100vh - 85px)'
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
            <Spinner 
              animation="border" 
              style={{
                width: '32px',
                height: '32px',
                borderWidth: '3px',
                color: '#6366f1'
              }}
            />
            <p style={{
              marginTop: '16px',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div style={{
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              padding: '20px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: '500'
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
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <BellIcon />
            </div>
            <h6 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              No notifications
            </h6>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div style={{ padding: '12px 0' }}>
            {notifications.map((n, index) => (
              <div 
                key={n._id} 
                style={{
                  background: n.read ? 'transparent' : 'white',
                  margin: '0 12px 8px 12px',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: n.read ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Unread Indicator */}
                {!n.read && (
                  <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '6px',
                    height: '6px',
                    background: '#6366f1',
                    borderRadius: '50%'
                  }} />
                )}
                
                <div style={{
                  paddingLeft: !n.read ? '16px' : '0'
                }}>
                  {/* Message */}
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: n.read ? '500' : '600',
                    color: n.read ? '#6b7280' : '#111827',
                    lineHeight: '1.4',
                    marginBottom: '8px'
                  }}>
                    {n.message}
                    {!n.read && (
                      <Badge 
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          marginLeft: '8px',
                          border: 'none'
                        }}
                      >
                        New
                      </Badge>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontWeight: '500',
                    marginBottom: '12px'
                  }}>
                    {formatDate(n.createdAt)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    {!n.read && (
                      <Button
                        size="sm"
                        onClick={() => markAsRead(n._id)}
                        style={{
                          background: '#f0f9ff',
                          border: '1px solid #e0f2fe',
                          color: '#0369a1',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e0f2fe';
                          e.currentTarget.style.borderColor = '#bae6fd';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f0f9ff';
                          e.currentTarget.style.borderColor = '#e0f2fe';
                        }}
                      >
                        <CheckIcon />
                        Mark as read
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={() => deleteNotification(n._id)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.borderColor = '#fca5a5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }}
                    >
                      <TrashIcon />
                      Delete
                    </Button>
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
