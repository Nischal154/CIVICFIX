import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
                role: isAdmin ? 'admin' : 'citizen'
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration Failed');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }} className="shadow p-4">
                <h2 className="text-center mb-4">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Register as Government Official (Admin)"
                            checked={isAdmin}
                            onChange={e => setIsAdmin(e.target.checked)}
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">Sign Up</Button>
                </Form>
                <div className="text-center mt-3">
                    <small>Already have an account? <Link to="/login">Login</Link></small>
                </div>
            </Card>
        </Container>
    );
};

export default Register;
