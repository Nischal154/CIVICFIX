import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container className="text-center py-5 mt-4">
            <Row className="justify-content-center mb-5">
                <Col md={8}>
                    <h1 className="display-4 fw-bold mb-3">Fix Your City, <span className="text-primary">Together</span></h1>
                    <p className="lead text-muted mb-4">
                        CivicFix empowers citizens to report infrastructure issues directly to the government.
                        AI-powered routing ensures your voice reaches the right department instantly.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button as={Link} to="/submit" variant="primary" size="lg">Report an Issue</Button>
                        <Button as={Link} to="/feed" variant="outline-secondary" size="lg">View Public Feed</Button>
                    </div>
                </Col>
            </Row>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm p-3">
                        <Card.Body>
                            <div className="display-6 text-primary mb-3">📸</div>
                            <Card.Title>Snap & Report</Card.Title>
                            <Card.Text>Take a photo, add a short title, and let our AI handle the rest. We auto-detect location and category.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm p-3">
                        <Card.Body>
                            <div className="display-6 text-success mb-3">🤖</div>
                            <Card.Title>AI Routing</Card.Title>
                            <Card.Text>Our Gemini AI analyzes your report to prioritize emergencies (fire, gas) and route directly to authorities.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm p-3">
                        <Card.Body>
                            <div className="display-6 text-info mb-3">📊</div>
                            <Card.Title>Transparent Progress</Card.Title>
                            <Card.Text>Track status in real-time. Upvote community issues to increase priority on the public dashboard.</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
