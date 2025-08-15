import React, { useEffect, useState } from "react";

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

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Your Profile</h2>
            <div style={{ marginBottom: "10px" }}>
                <strong>Username:</strong> {profile.Username}
            </div>
            <div style={{ marginBottom: "10px" }}>
                <strong>Email:</strong> {profile.Email}
            </div>
            <div style={{ marginBottom: "10px" }}>
                <strong>Birthday:</strong> {profile.Birthday
                    ? new Date(profile.Birthday).toLocaleDateString()
                    : "Not provided"}
            </div>
        </div>
    );
};
