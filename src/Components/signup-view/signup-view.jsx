import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

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
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength="3"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Birthday</label>
                    <input
                        type="date"
                        className="form-control"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <button type="submit" className="btn btn-success w-100">Sign Up</button>
            </form>

            <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default SignupView;