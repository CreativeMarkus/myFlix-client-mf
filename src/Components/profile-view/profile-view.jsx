import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";

export const ProfileView = ({ user, token, setUser }) => {
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

    if (loading) {
        return (
            <Container className="py-5 d-flex justify-content-center">
                <Spinner animation="border" role="status" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-4">
                <Alert variant="danger" className="mb-0">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
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
        </Container>
    );
};
