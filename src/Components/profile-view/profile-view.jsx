import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Button, Form } from "react-bootstrap";
import MovieCard from "../movie-card/movie-card";

export const ProfileView = ({ user, token, setUser, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [birthdayInput, setBirthdayInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const [movies, setMovies] = useState([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [moviesError, setMoviesError] = useState("");

    useEffect(() => {
        if (!user || !token) return;
        setLoading(true);
        setError("");
        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(user.Username)}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 404) throw new Error("Profile not found.");
                if (!res.ok) throw new Error("Failed to load profile.");
                return res.json();
            })
            .then((data) => {
                setProfile(data);
                setUsernameInput(data?.Username || "");
                setEmailInput(data?.Email || "");
                const b = data?.Birthday ? new Date(data.Birthday) : null;
                const yyyy = b ? b.getFullYear() : "";
                const mm = b ? String(b.getMonth() + 1).padStart(2, "0") : "";
                const dd = b ? String(b.getDate()).padStart(2, "0") : "";
                setBirthdayInput(b ? `${yyyy}-${mm}-${dd}` : "");
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user, token]);

    useEffect(() => {
        if (!token) return;
        setMoviesLoading(true);
        setMoviesError("");
        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load movies.");
                return res.json();
            })
            .then((data) => setMovies(data))
            .catch((err) => setMoviesError(err.message || "Failed to load movies."))
            .finally(() => setMoviesLoading(false));
    }, [token]);

    const favoriteMovies = useMemo(() => {
        return movies.filter((m) => profile?.FavoriteMovies?.includes(m._id));
    }, [movies, profile]);

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!profile) return;
        setSuccessMsg("");
        setError("");
        setSaving(true);

        const payload = {
            Username: usernameInput,
            Email: emailInput,
            Birthday: birthdayInput
        };
        if (passwordInput) payload.Password = passwordInput;

        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(profile.Username)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) return res.text().then((t) => { throw new Error(t || "Update failed"); });
                return res.json();
            })
            .then((updated) => {
                setProfile(updated);
                setUser(updated);
                localStorage.setItem("user", JSON.stringify(updated));
                setPasswordInput("");
                setSuccessMsg("Profile updated successfully.");
            })
            .catch((err) => setError(err.message || "Update failed"))
            .finally(() => setSaving(false));
    };

    const handleDelete = () => {
        if (!profile) return;
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(profile.Username)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete account.");
                onLogout();
            })
            .catch((err) => setError(err.message || "Failed to delete account."));
    };

    return (
        <>
            <Container className="py-4">
                {loading && (
                    <div className="py-5 d-flex justify-content-center">
                        <Spinner animation="border" role="status" />
                    </div>
                )}

                {!loading && error && (
                    <Alert variant="danger" className="mb-4">{error}</Alert>
                )}

                {!loading && !error && (
                    <Row className="g-4">
                        <Col xs={12} lg={5}>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="mb-3">Your Profile</Card.Title>
                                    <Form onSubmit={handleUpdate}>
                                        <Form.Group className="mb-3" controlId="profileUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={usernameInput}
                                                onChange={(e) => setUsernameInput(e.target.value)}
                                                minLength={3}
                                                required
                                                disabled={saving}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="profilePassword">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={passwordInput}
                                                onChange={(e) => setPasswordInput(e.target.value)}
                                                minLength={6}
                                                placeholder="Leave blank to keep current password"
                                                disabled={saving}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="profileEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={emailInput}
                                                onChange={(e) => setEmailInput(e.target.value)}
                                                required
                                                disabled={saving}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="profileBirthday">
                                            <Form.Label>Birthday</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={birthdayInput}
                                                onChange={(e) => setBirthdayInput(e.target.value)}
                                                required
                                                disabled={saving}
                                            />
                                        </Form.Group>

                                        <div className="d-flex gap-2">
                                            <Button type="submit" variant="primary" disabled={saving}>
                                                Save Changes
                                            </Button>
                                            <Button variant="outline-danger" onClick={handleDelete} disabled={saving}>
                                                Delete Account
                                            </Button>
                                        </div>

                                        {successMsg && <Alert variant="success" className="mt-3 mb-0">{successMsg}</Alert>}
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={12} lg={7}>
                            <Card>
                                <Card.Body>
                                    <Card.Title className="mb-3">Favorite Movies</Card.Title>

                                    {moviesLoading && (
                                        <div className="py-4 d-flex justify-content-center">
                                            <Spinner animation="border" role="status" />
                                        </div>
                                    )}

                                    {!moviesLoading && moviesError && (
                                        <Alert variant="danger" className="mb-0">{moviesError}</Alert>
                                    )}

                                    {!moviesLoading && !moviesError && favoriteMovies.length === 0 && (
                                        <Alert variant="secondary" className="mb-0">No favorites yet.</Alert>
                                    )}

                                    {!moviesLoading && !moviesError && favoriteMovies.length > 0 && (
                                        <Row className="g-4">
                                            {favoriteMovies.map((m) => (
                                                <Col key={m._id} xs={12} sm={6}>
                                                    <MovieCard movie={m} />
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
};
