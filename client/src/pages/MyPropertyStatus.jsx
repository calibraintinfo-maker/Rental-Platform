import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { api } from '../utils/api';

const statusColor = {
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
};

const MyPropertyStatus = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    setLoading(true);
    try {
      const res = await api.properties.getUserProperties({ all: true });
      setProperties(res.data);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Sort: pending first, then rejected, then verified
  const sortedProperties = [...properties].sort((a, b) => {
    const order = { pending: 0, rejected: 1, verified: 2 };
    return (order[a.verificationStatus] ?? 3) - (order[b.verificationStatus] ?? 3);
  });
  return (
    <Container className="py-4">
      <h2 className="mb-4">My Property Status</h2>
      <Row>
        {sortedProperties.length === 0 && <Col><Alert variant="info">No properties found.</Alert></Col>}
        {sortedProperties.map(property => {
          const latestLog = property.verificationLog && property.verificationLog.length > 0
            ? property.verificationLog[property.verificationLog.length - 1]
            : null;
          return (
            <Col md={6} key={property._id} className="mb-4">
              <Card border={property.verificationStatus === 'pending' ? 'warning' : property.verificationStatus === 'rejected' ? 'danger' : 'success'}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="mb-0 me-2">{property.title}</h5>
                    {property.verificationStatus === 'pending' && <Badge bg="warning" text="dark" className="ms-1">Pending</Badge>}
                    {property.verificationStatus === 'verified' && <Badge bg="success" className="ms-1">Verified</Badge>}
                    {property.verificationStatus === 'rejected' && <Badge bg="danger" className="ms-1">Rejected</Badge>}
                  </div>
                  <p><strong>Category:</strong> {property.category}</p>
                  {latestLog && (
                    <>
                      <p><strong>Admin Remark:</strong> {latestLog.note || '—'}</p>
                      <p><strong>Updated:</strong> {new Date(latestLog.date).toLocaleString()}</p>
                    </>
                  )}
                  {!latestLog && <p><strong>Admin Remark:</strong> —</p>}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default MyPropertyStatus;
