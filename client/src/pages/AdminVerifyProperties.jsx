import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminVerifyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState('verified');
  const [verifyNote, setVerifyNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // For fullscreen preview
  const [fullscreenDoc, setFullscreenDoc] = useState({ show: false, src: '', type: '', title: '' });
  // Auth context
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && auth.token) {
      fetchPending();
    }
  }, [auth.loading, auth.token]);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getPendingProperties();
      setProperties(res.data.data);
    } catch (err) {
      setError('Failed to fetch pending properties');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (property) => {
    setSelected(property);
    setShowModal(true);
    setVerifyStatus('verified');
    setVerifyNote('');
  };

  const handleVerify = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.admin.verifyProperty(selected._id, verifyStatus, verifyNote);
      setShowModal(false);
      fetchPending();
    } catch {
      alert('Failed to update property status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Property Verification</h2>
      <Row>
        {properties.map(p => (
          <Col md={6} key={p._id} className="mb-4">
            <Card>
              <Card.Body>
                <h5>{p.title}</h5>
                <p><strong>Owner:</strong> {p.ownerId?.name} ({p.ownerId?.email})</p>
                <p><strong>Category:</strong> {p.category}</p>
                <p><strong>Address:</strong> {p.address.street}, {p.address.city}, {p.address.state} - {p.address.pincode}</p>
                <Button variant="info" onClick={() => openModal(p)}>Review & Verify</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Verify Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              {/* Status badge */}
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-warning text-dark px-3 py-2 me-2" style={{ fontSize: 16, borderRadius: 8, letterSpacing: 1 }}>
                  <i className="bi bi-hourglass-split me-1" /> Pending Verification
                </span>
                <h4 className="mb-0" style={{ fontWeight: 700 }}>{selected.title}</h4>
              </div>
              <Row>
                <Col md={7}>
                  <Card className="mb-4 shadow-sm border-0 rounded-4">
                    <Card.Body>
                      <h6 className="text-primary mb-3"><i className="bi bi-house-door me-2" />Property Details</h6>
                      <div className="mb-2"><strong>Description:</strong> {selected.description}</div>
                      <div className="mb-2"><strong>Category:</strong> {selected.category}</div>
                      {selected.subtype && <div className="mb-2"><strong>Subtype:</strong> {selected.subtype}</div>}
                      <div className="mb-2"><strong>Price:</strong> <span className="text-success">₹{selected.price}</span></div>
                      <div className="mb-2"><strong>Size:</strong> {selected.size}</div>
                      <div className="mb-2"><strong>Rent Types:</strong> {selected.rentType && selected.rentType.join(', ')}</div>
                    </Card.Body>
                  </Card>
                  <Card className="mb-4 shadow-sm border-0 rounded-4">
                    <Card.Body>
                      <h6 className="text-primary mb-3"><i className="bi bi-geo-alt me-2" />Address</h6>
                      <div className="mb-2">{selected.address?.street}</div>
                      <div className="mb-2">{selected.address?.city}, {selected.address?.state} - {selected.address?.pincode}</div>
                      <div className="mb-2"><strong>Contact:</strong> {selected.contact}</div>
                    </Card.Body>
                  </Card>
                  <Card className="mb-4 shadow-sm border-0 rounded-4">
                    <Card.Body>
                      <h6 className="text-primary mb-3"><i className="bi bi-person-circle me-2" />Owner Details</h6>
                      <div className="mb-2"><strong>Name:</strong> {selected.ownerId?.name}</div>
                      <div className="mb-2"><strong>Email:</strong> {selected.ownerId?.email}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={5}>
                  <Card className="mb-4 shadow-sm border-0 rounded-4">
                    <Card.Body>
                      <h6 className="text-primary mb-3"><i className="bi bi-images me-2" />Property Images</h6>
                      <Row className="g-2">
                        {selected.images && selected.images.map((img, idx) => (
                          <Col key={idx} xs={6} className="mb-2">
                            <div style={{ position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                              <img
                                src={img}
                                alt={`Property ${idx + 1}`}
                                style={{ width: '100%', height: '90px', objectFit: 'cover', transition: 'transform 0.2s', border: '1px solid #eee', borderRadius: '8px' }}
                                onClick={() => setFullscreenDoc({ show: true, src: img, type: 'image', title: `Property Image ${idx + 1}` })}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                              />
                              <span style={{ position: 'absolute', bottom: 6, right: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 12, padding: '2px 8px', borderRadius: '12px' }}>View</span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                  <Card className="mb-4 shadow-sm border-0 rounded-4">
                    <Card.Body>
                      <h6 className="text-primary mb-3"><i className="bi bi-file-earmark-text me-2" />Proof Documents</h6>
                      <Row>
                        <Col xs={12} className="mb-3">
                          <strong>Owner Proof:</strong><br />
                          {selected.ownerProof && selected.ownerProof.startsWith('data:application/pdf') ? (
                            <>
                              <iframe
                                src={selected.ownerProof}
                                title="Owner Proof PDF"
                                style={{ width: '100%', height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
                              />
                              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'pdf', title: 'Owner Proof' })}>
                                View Fullscreen
                              </Button>
                            </>
                          ) : selected.ownerProof ? (
                            <>
                              <img src={selected.ownerProof} alt="Owner Proof" style={{ maxWidth: '100%', maxHeight: '100px', border: '1px solid #ccc', borderRadius: '6px' }} />
                              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.ownerProof, type: 'image', title: 'Owner Proof' })}>
                                View Fullscreen
                              </Button>
                            </>
                          ) : 'Not uploaded'}
                        </Col>
                        <Col xs={12}>
                          <strong>Property Proof:</strong><br />
                          {selected.propertyProof && selected.propertyProof.startsWith('data:application/pdf') ? (
                            <>
                              <iframe
                                src={selected.propertyProof}
                                title="Property Proof PDF"
                                style={{ width: '100%', height: '100px', border: '1px solid #ccc', borderRadius: '6px' }}
                              />
                              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'pdf', title: 'Property Proof' })}>
                                View Fullscreen
                              </Button>
                            </>
                          ) : selected.propertyProof ? (
                            <>
                              <img src={selected.propertyProof} alt="Property Proof" style={{ maxWidth: '100%', maxHeight: '100px', border: '1px solid #ccc', borderRadius: '6px' }} />
                              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setFullscreenDoc({ show: true, src: selected.propertyProof, type: 'image', title: 'Property Proof' })}>
                                View Fullscreen
                              </Button>
                            </>
                          ) : 'Not uploaded'}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {/* Modern Fullscreen Modal for Document/Image Preview */}
              {/* Modern Fullscreen Modal for Document/Image Preview */}
              <Modal
                show={fullscreenDoc.show}
                onHide={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
                size={fullscreenDoc.type === 'image' ? undefined : 'xl'}
                centered
                contentClassName={fullscreenDoc.type === 'image' ? 'bg-dark p-0 border-0' : ''}
                dialogClassName={fullscreenDoc.type === 'image' ? 'modal-fullscreen' : ''}
                backdropClassName={fullscreenDoc.type === 'image' ? 'bg-dark' : ''}
              >
                {fullscreenDoc.type === 'image' ? (
                  <>
                    <Button
                      variant="light"
                      onClick={() => setFullscreenDoc({ show: false, src: '', type: '', title: '' })}
                      style={{
                        position: 'absolute',
                        top: 24,
                        right: 36,
                        zIndex: 1051,
                        fontSize: 32,
                        fontWeight: 700,
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        padding: '0 16px',
                        lineHeight: '40px',
                        background: '#fff',
                        border: 'none',
                        opacity: 0.95
                      }}
                      aria-label="Close"
                    >
                      &times;
                    </Button>
                    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.98)' }}>
                      <img
                        src={fullscreenDoc.src}
                        alt="Document Preview"
                        style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Modal.Header closeButton>
                      <Modal.Title>{fullscreenDoc.title} - Fullscreen Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                      {fullscreenDoc.type === 'pdf' ? (
                        <iframe
                          src={fullscreenDoc.src}
                          title="PDF Preview"
                          style={{ width: '100%', height: '75vh', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}
                        />
                      ) : null}
                    </Modal.Body>
                  </>
                )}
              </Modal>
              <div className="mt-4 p-4 bg-light rounded-4 shadow-sm border">
                <Form>
                  <Row className="align-items-end">
                    <Col md={5} className="mb-3">
                      <Form.Label className="fw-bold">Status</Form.Label>
                      <Form.Select value={verifyStatus} onChange={e => setVerifyStatus(e.target.value)} size="lg">
                        <option value="verified">Verified ✅</option>
                        <option value="rejected">Rejected ❌</option>
                      </Form.Select>
                    </Col>
                    <Col md={5} className="mb-3">
                      <Form.Label className="fw-bold">Note (optional)</Form.Label>
                      <Form.Control as="textarea" rows={2} value={verifyNote} onChange={e => setVerifyNote(e.target.value)} size="lg" placeholder="Add a note for the owner..." />
                    </Col>
                    <Col md={2} className="mb-3 d-grid">
                      <Button variant="primary" size="lg" onClick={handleVerify} disabled={submitting} className="fw-bold">
                        {submitting ? 'Saving...' : 'Save'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleVerify} disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminVerifyProperties;
