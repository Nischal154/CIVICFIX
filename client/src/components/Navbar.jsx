import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const MyNavbar = () => {
    const navigate = useNavigate();
    // TODO: Check auth state
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container fluid>

                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">CivicFix</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/feed">Public Feed</Nav.Link>
                        {token ? (
                            <>
                                <Nav.Link as={Link} to="/submit">Report Issue</Nav.Link>
                                {user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/dashboard" className="text-danger fw-bold">Gov Dashboard</Nav.Link>
                                )}
                                <Button variant="outline-danger" size="sm" className="ms-2" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="primary" size="sm" className="ms-2">Get Started</Button>
                            </>
                        )}

                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

export default MyNavbar;
