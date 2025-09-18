import React from 'react';
import { Offcanvas, ListGroup, Badge, Button, Spinner } from 'react-bootstrap';
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

  return (
    <Offcanvas show={sidebarOpen} onHide={() => setSidebarOpen(false)} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notifications</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-muted text-center py-4">No notifications</div>
        ) : (
          <ListGroup variant="flush">
            {notifications.map(n => (
              <ListGroup.Item key={n._id} className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold">
                    {n.message}
                    {!n.read && <Badge bg="warning" className="ms-2">New</Badge>}
                  </div>
                  <small className="text-muted">{formatDate(n.createdAt)}</small>
                </div>
                <div className="d-flex flex-column align-items-end ms-2">
                  {!n.read && (
                    <Button size="sm" variant="outline-success" className="mb-1" onClick={() => markAsRead(n._id)}>
                      Mark as read
                    </Button>
                  )}
                  <Button size="sm" variant="outline-danger" onClick={() => deleteNotification(n._id)}>
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default NotificationSidebar;
