import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/complaints';

const Dashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check admin logic (simplified)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            // navigate('/login'); // Commented out for easier testing in MVP
        }
    }, [navigate]);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(API_URL);
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
            // Optimistic update locally
            setComplaints(complaints.map(c =>
                c._id === id ? { ...c, status: newStatus } : c
            ));
            alert(`Status updated to ${newStatus}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;

    // Calculate Analytics
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const emergencies = complaints.filter(c => c.isEmergency).length;

    // Group by Dept
    const getDeptCount = (dept) => complaints.filter(c => c.aiAnalysis.department?.includes(dept)).length;

    return (
        <Container className="py-5 mt-4">
            <h2 className="mb-4 fw-bold">🏛️ Government Dashboard</h2>

            {/* Stats Cards */}
            <Row className="mb-4 g-3">
                <Col md={3}>
                    <Card className="bg-primary text-white text-center p-3 shadow-sm border-0">
                        <h3>{total}</h3>
                        <div>Total Reports</div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-warning text-dark text-center p-3 shadow-sm border-0">
                        <h3>{pending}</h3>
                        <div>Pending Attention</div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-success text-white text-center p-3 shadow-sm border-0">
                        <h3>{resolved}</h3>
                        <div>Resolved</div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-danger text-white text-center p-3 shadow-sm border-0">
                        <h3>{emergencies}</h3>
                        <div>🚨 Emergencies</div>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="p-3 shadow-sm border-0 h-100">
                        <Card.Title>Department Workload</Card.Title>
                        <hr />
                        {['Electricity', 'Water', 'Roads', 'Waste'].map(dept => (// emergency removed
                            <div key={dept} className="d-flex justify-content-between mb-2">
                                <span>{dept}</span>
                                <Badge bg="secondary">{getDeptCount(dept)}</Badge>
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="p-3 shadow-sm border-0 h-100">
                        <Card.Title>Recent AI Actions</Card.Title>
                        <hr />
                        <ul className="list-unstyled small text-muted">
                            {complaints.slice(0, 5).map(c => (
                                <li key={c._id} className="mb-2">
                                    ✅ Routed <strong>{c.title}</strong> to <span className="text-primary">{c.aiAnalysis.department}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white fw-bold">All Complaints</Card.Header>
                <Table responsive hover className="mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Title</th>
                            <th>Department</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map(c => (
                            <tr key={c._id} className={c.isEmergency ? 'table-danger' : ''}>
                                <td>{c.category}</td>
                                <td><Badge bg={c.aiAnalysis.priority === 'Emergency' ? 'danger' : 'info'}>{c.priority}</Badge></td>
                                <td>{c.title}</td>
                                <td>{c.aiAnalysis.department}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={c.status}
                                        onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
};

export default Dashboard;
