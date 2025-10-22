// Resolves username in this order:
// 1. localStorage.user (parsed).Username
// 2. JWT payload's sub
// 3. props.user?.Username

import React, { useEffect, useState, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap"; // added

export const ProfileView = ({ user, token, setUser }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null); // added

    // Helper to resolve token + username
    const resolveAuth = useCallback(() => {
        const tkn = token ?? localStorage.getItem("token");
        let storedUser = null;
        try { storedUser = JSON.parse(localStorage.getItem("user")); } catch { }
        let username = storedUser?.Username ?? user?.Username ?? null;
        if (!username && tkn) {
            try {
                const payload = JSON.parse(atob(tkn.split(".")[1]));
                username = payload?.sub ?? null;
            } catch { }
        }
        return { tkn, username };
    }, [token, user]);

    const fetchUpdatedUser = async (username, tkn) => {
        const res = await fetch(
            `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`,
            { headers: { Authorization: `Bearer ${tkn}`, Accept: "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to refresh user");
        return res.json();
    };

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
                throw new Error(msg || "Failed to remove favorite");
            }

            // Refresh user, persist, and update UI
            const updated = await fetchUpdatedUser(username, tkn);
            localStorage.setItem("user", JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("userUpdated", { detail: updated }));
            setProfile(updated.user || updated);
        } catch (e) {
            console.error(e);
            alert("Could not remove favorite.");
        } finally {
            setRemovingId(null);
        }
    };

    useEffect(() => {
        const { tkn, username } = resolveAuth();
        if (!tkn) return;
        setLoading(true);
        setError("");

        console.log("Fetching profile for user:", user);
        console.log("Resolved Username:", username);
        console.log(
            "Full URL:",
            `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username || "")}`
        );

        if (!username) {
            setError("Username is missing; cannot fetch profile.");
            setLoading(false);
            return;
        }

        fetch(
            `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`,
            { headers: { Authorization: `Bearer ${tkn}`, Accept: "application/json" } }
        )
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load profile.");
                return res.json();
            })
            .then((data) => setProfile(data.user || data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [resolveAuth, user]);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Your Profile</h2>

            <div style={{ marginBottom: "10px" }}>
                <strong>Username:</strong> {profile?.Username}
            </div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Email:</strong> {profile?.Email}
            </div>

            <div style={{ marginBottom: "10px" }}>
                <strong>Birthday:</strong>{" "}
                {profile?.Birthday
                    ? new Date(profile.Birthday).toLocaleDateString()
                    : "Not provided"}
            </div>

            <hr style={{ margin: "20px 0" }} />

            <div>
                <strong>Favorite Movies:</strong>
                {profile?.FavoriteMovies?.length ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {profile.FavoriteMovies.map((movie) => {
                            const id = movie?._id ?? movie; // supports id or full object
                            return (
                                <li
                                    key={id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {movie?.ImagePath ? (
                                            <img
                                                src={movie.ImagePath}
                                                alt={movie?.Title || "Movie"}
                                                style={{
                                                    width: "80px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    marginRight: "15px",
                                                }}
                                            />
                                        ) : null}
                                        <div>
                                            <strong>{movie?.Title || id}</strong> <br />
                                            Genre: {movie?.Genre?.Name || "N/A"} <br />
                                            Director: {movie?.Director?.Name || "N/A"}
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeFavorite(id)}
                                        disabled={removingId === String(id)}
                                    >
                                        {removingId === String(id) ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                Removing...
                                            </>
                                        ) : (
                                            "Remove"
                                        )}
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No favorite movies added yet.</p>
                )}
            </div>
        </div>
    );
};
