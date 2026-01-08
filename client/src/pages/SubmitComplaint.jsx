import { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/complaints';

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    // Mock getting user location
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`);
                },
                () => {
                    alert("Could not get location. Please enter manually.");
                }
            );
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user ? user.id : 'null';

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('userId', userId);
            if (image) {
                formData.append('image', image);
            }

            await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/feed');
        } catch (err) {
            console.error(err);
            setError('Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-5 min-vh-100">
            <Card className="shadow-lg border-0" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Card.Header className="bg-primary text-white p-4">
                    <h3 className="mb-0">📢 Report an Issue</h3>
                    <p className="mb-0 opacity-75">Help us fix the city, one report at a time.</p>
                </Card.Header>
                <Card.Body className="p-4">
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Short Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Deep Pothole on Main St"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                size="lg"
                            />
                            <Form.Text className="text-muted">Keep it brief. Our AI looks at this first.</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Detailed Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Describe the severity, exact landmark, etc..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Location</Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter address or coordinates"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                                <Button variant="outline-dark" onClick={handleGetLocation}>
                                    📍 Detect
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Attach Photo (Optional)</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                            {preview && (
                                <div className="mt-3">
                                    <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Attach Voice Note (Optional)</Form.Label>
                            <Form.Control type="file" accept="audio/*" />
                            <Form.Text className="text-muted">Speak instead of typing? Upload a recording.</Form.Text>
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="success" size="lg" type="submit" disabled={loading}>
                                {loading ? <><Spinner size="sm" animation="border" /> Analyzing...</> : '🚀 Submit Complaint'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SubmitComplaint;
