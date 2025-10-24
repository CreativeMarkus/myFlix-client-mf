import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Button, Spinner, Form, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const ProfileView = ({ user, token, setUser }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const resolveAuth = useCallback(() => {
        const tkn = token ?? localStorage.getItem("token");
        let storedUser = null;
        try { storedUser = JSON.parse(localStorage.getItem("user")); } catch { }
        let username = storedUser?.Username ?? user?.Username ?? null;
        if (!username && tkn) {
            try {
                const payload = JSON.parse(atob(tkn.split(".")[1] || ""));
                username = payload?.sub ?? null;
            } catch { }
        }
        return { tkn, username, storedUser };
    }, [token, user]);

    const fetchUpdatedUser = async (username, tkn) => {
        const url = `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`;
        const resUser = await fetch(url, {
            headers: { Authorization: `Bearer ${tkn}`, Accept: 'application/json' }
        });
        if (!resUser.ok) throw new Error(`Failed to refresh user (${resUser.status})`);
        return resUser.json();
    };

    const loadProfile = useCallback(async () => {
        const { tkn, username, storedUser } = resolveAuth();
        if (!tkn) {
            setError("Missing auth token.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError("");
        console.log('Fetching profile for user:', storedUser || user);
        console.log('Username:', username);
        console.log('Full URL:', `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username || "")}`);
        if (!username) {
            setError("Username is missing; cannot fetch profile.");
            setLoading(false);
            return;
        }
        try {
            const data = await fetchUpdatedUser(username, tkn);
            const userObj = data.user ?? data;
            setProfile(userObj);
            setNewUsername(userObj.Username || "");
            setNewEmail(userObj.Email || "");
        } catch (e) {
            setError(e.message || "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }, [resolveAuth, user]);

    useEffect(() => { loadProfile(); }, [loadProfile]);

    const removeFavorite = async (movieId) => {
        const { tkn, username } = resolveAuth();
        if (!tkn || !username || !movieId) {
            console.error("Missing auth or movie id", { hasToken: !!tkn, username, movieId });
            return;
        }
        setRemovingId(String(movieId));
        try {
            const res = await fetch(
                `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}/favorites/${movieId}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${tkn}`, Accept: "application/json" } }
            );
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `Failed to remove favorite (${res.status})`);
            }
            const updated = await fetchUpdatedUser(username, tkn);
            const userObj = updated.user ?? updated;
            localStorage.setItem("user", JSON.stringify(userObj));
            window.dispatchEvent(new CustomEvent("userUpdated", { detail: userObj }));
            setProfile(userObj);
            setMessage({ type: "success", text: "Favorite removed." });
        } catch (e) {
            console.error(e);
            setMessage({ type: "danger", text: `Could not remove favorite: ${e.message}` });
        } finally {
            setRemovingId(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { tkn, username } = resolveAuth();
        if (!tkn || !username) {
            setMessage({ type: "danger", text: "Missing authentication." });
            return;
        }
        const body = {};
        if (newUsername && newUsername !== profile?.Username) body.Username = newUsername;
        if (newEmail && newEmail !== profile?.Email) body.Email = newEmail;
        if (newPassword) body.Password = newPassword;

        if (Object.keys(body).length === 0) {
            setMessage({ type: "info", text: "No changes to save." });
            return;
        }

        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch(
                `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${tkn}`,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );
            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch { data = text; }
            if (!res.ok) {
                const msg = (data && data.message) ? data.message : `Update failed (${res.status})`;
                throw new Error(msg);
            }

            const updatedUser = (data && data.user) ? data.user : (data && data.Username ? data : null);
            const newToken = data && data.token ? data.token : null;

            if (updatedUser) {
                localStorage.setItem("user", JSON.stringify(updatedUser));
                if (newToken) localStorage.setItem("token", newToken);
                window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }));
                setProfile(updatedUser);
                setMessage({ type: "success", text: "Profile updated." });
            } else {
                const refreshed = await fetchUpdatedUser(body.Username ?? username, tkn);
                const userObj = refreshed.user ?? refreshed;
                localStorage.setItem("user", JSON.stringify(userObj));
                window.dispatchEvent(new CustomEvent("userUpdated", { detail: userObj }));
                setProfile(userObj);
                setMessage({ type: "success", text: "Profile updated." });
            }
            if (newUsername && !newToken) {
                setMessage({ type: "warning", text: "Username changed. Please log in again." });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "danger", text: err.message || "Update failed." });
        } finally {
            setSaving(false);
            setNewPassword("");
        }
    };

    const handleDeregister = async () => {
        const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirm) return;
        const { tkn, username } = resolveAuth();
        if (!tkn || !username) {
            setMessage({ type: "danger", text: "Missing authentication." });
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(
                `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${tkn}`, Accept: "application/json" } }
            );
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(txt || `Delete failed (${res.status})`);
            }

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.dispatchEvent(new CustomEvent("userUpdated", { detail: null }));
            if (setUser) setUser(null);
            navigate("/");
        } catch (err) {
            console.error(err);
            setMessage({ type: "danger", text: err.message || "Account deletion failed." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4"><Spinner animation="border" /> Loading profile...</div>;
    if (error) return <div className="p-4 text-danger">{error}</div>;

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Body className="p-4">
                    <h2 className="mb-3">Your Profile</h2>

                    {message && <Alert variant={message.type}>{message.text}</Alert>}

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-2"><strong>Username:</strong> {profile?.Username}</div>
                            <div className="mb-2"><strong>Email:</strong> {profile?.Email}</div>
                            <div className="mb-2"><strong>Birthday:</strong> {profile?.Birthday ? new Date(profile.Birthday).toLocaleDateString() : "Not provided"}</div>
                        </Col>

                        <Col md={6}>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-2" controlId="formUsername">
                                    <Form.Label>Change Username</Form.Label>
                                    <Form.Control value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-2" controlId="formEmail">
                                    <Form.Label>Change Email</Form.Label>
                                    <Form.Control type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Change Password</Form.Label>
                                    <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="primary" disabled={saving}>
                                        {saving ? (<><Spinner as="span" animation="border" size="sm" className="me-2" />Saving...</>) : "Save changes"}
                                    </Button>
                                    <Button variant="outline-danger" onClick={handleDeregister} disabled={saving}>
                                        Delete account
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>

                    <hr />

                    <div>
                        <strong>Favorite Movies:</strong>
                        {profile?.FavoriteMovies?.length ? (
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {profile.FavoriteMovies.map((movie) => {
                                    const id = movie?._id ?? movie;
                                    return (
                                        <li key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                {movie?.ImagePath ? (
                                                    <img src={movie.ImagePath} alt={movie?.Title || "Movie"} style={{ width: "80px", height: "120px", objectFit: "cover", borderRadius: "8px", marginRight: "15px" }} />
                                                ) : null}
                                                <div>
                                                    <strong>{movie?.Title || id}</strong><br />
                                                    Genre: {movie?.Genre?.Name || "N/A"}<br />
                                                    Director: {movie?.Director?.Name || "N/A"}
                                                </div>
                                            </div>

                                            <Button variant="outline-danger" size="sm" onClick={() => removeFavorite(id)} disabled={removingId === String(id)}>
                                                {removingId === String(id) ? (<><Spinner as="span" animation="border" size="sm" className="me-2" />Removing...</>) : "Remove"}
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No favorite movies added yet.</p>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};
