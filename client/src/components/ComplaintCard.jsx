import { Card, Badge, Button } from 'react-bootstrap';

const ComplaintCard = ({ complaint, onUpvote }) => {
    // Helper to pick color based on priority
    const getPriorityColor = (p) => {
        switch (p) {
            case 'Emergency': return 'danger';
            case 'High': return 'warning';
            case 'Medium': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <Card className="mb-3 border-0 shadow-sm hover-shadow">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <Badge bg={getPriorityColor(complaint.priority)} className="mb-2 me-2">
                            {complaint.priority}
                        </Badge>
                        <Badge bg="light" text="dark" className="border mb-2 me-2">
                            {complaint.category}
                        </Badge>
                        <Badge bg="dark" className="mb-2">
                            🏛️ {complaint.aiAnalysis.department || 'Unassigned'}
                        </Badge>
                        <Card.Title className="fw-bold mb-1">{complaint.title}</Card.Title>
                        <Card.Text className="text-muted small mb-2">
                            📍 {complaint.location} • {new Date(complaint.createdAt).toLocaleDateString()}
                        </Card.Text>
                    </div>
                    {complaint.isEmergency && <Badge bg="danger" className="p-2">🚨 EMERGENCY</Badge>}
                </div>

                {complaint.imageUrl && (
                    <div className="mb-3 mt-2">
                        <Card.Img
                            variant="top"
                            src={complaint.imageUrl}
                            style={{ height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </div>
                )}

                <Card.Text className="mt-3">
                    {complaint.description}
                </Card.Text>

                {complaint.aiAnalysis && (
                    <div className="alert alert-light border p-2 small text-muted">
                        <strong>🤖 AI Analysis:</strong> Assigned to {complaint.department}.
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <Button variant="outline-primary" size="sm" onClick={() => onUpvote(complaint._id)}>
                        👍 Upvote ({complaint.upvotes ? complaint.upvotes.length : 0})
                    </Button>
                    <span className={`fw-bold text-${complaint.status === 'Resolved' ? 'success' : 'warning'}`}>
                        Status: {complaint.status}
                    </span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ComplaintCard;
