import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Configure Axios base URL
// TODO: Move to global config
const API_URL = 'http://localhost:5000/api/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login Failed');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }} className="shadow p-4">
                <h2 className="text-center mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Login</Button>
                </Form>
                <div className="text-center mt-3">
                    <small>Don't have an account? <Link to="/register">Register</Link></small>
                </div>
            </Card>
        </Container>
    );
};

export default Login;
