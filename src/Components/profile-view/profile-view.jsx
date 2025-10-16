import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const ProfileView = ({ user, token, setUser, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || !token) return;
        setLoading(true);
        setError("");
        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${user.Username}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load profile.");
                return res.json();
            })
            .then((data) => setProfile(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user, token]);

    return (
        <>
            <Navbar
                bg="secondary-subtle"
                variant="light"
                data-bs-theme="light"
                expand="md"
                className="mb-4 w-100 py-2"
            >
                <Navbar.Brand as={Link} to="/" className="px-3">myFlix</Navbar.Brand>
                <Navbar.Toggle aria-controls="profile-navbar" />
                <Navbar.Collapse id="profile-navbar" className="px-3">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Movies</Nav.Link>
                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    </Nav>
                    <div className="d-flex gap-2">
                        <Button variant="outline-dark" onClick={onLogout}>Logout</Button>
                    </div>
                </Navbar.Collapse>
            </Navbar>

            <Container className="py-4">
                {loading && (
                    <div className="py-5 d-flex justify-content-center">
                        <Spinner animation="border" role="status" />
                    </div>
                )}

                {!loading && error && (
                    <Alert variant="danger" className="mb-0">{error}</Alert>
                )}

                {!loading && !error && (
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="mb-3">Your Profile</Card.Title>
                                    <div className="mb-2">
                                        <strong>Username:</strong> {profile?.Username}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Email:</strong> {profile?.Email}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Birthday:</strong>{" "}
                                        {profile?.Birthday
                                            ? new Date(profile.Birthday).toLocaleDateString()
                                            : "Not provided"}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
};
