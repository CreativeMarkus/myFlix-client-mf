import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

const SignupView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        const data = { Username: username, Password: password, Email: email, Birthday: birthday };

        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(text || "Signup failed");
                    });
                }
                return response.json();
            })
            .then(() => {
                setSuccess("Signup successful! You can now log in.");
                setUsername("");
                setPassword("");
                setEmail("");
                setBirthday("");
            })
            .catch((error) => {
                console.error("Signup error:", error);
                setError(error.message || "Signup failed due to a network error.");
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Sign Up</Card.Title>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="signupUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        minLength={3}
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="signupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="signupEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="signupBirthday">
                                    <Form.Label>Birthday</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="success" className="w-100" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Signing Up...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                Already have an account? <Link to="/login">Login here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignupView;