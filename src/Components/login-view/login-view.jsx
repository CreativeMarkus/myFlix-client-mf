import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const data = { Username: username, Password: password };

        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(err.message || "Invalid login credentials");
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    const user = { username: username };
                    localStorage.setItem("user", JSON.stringify(user));
                    onLoggedIn(user, data.token);
                } else {
                    setError("Invalid login credentials");
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                setError(error.message || "Login failed due to network/server error");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Login</h2>

            <form
                onSubmit={handleSubmit}
                className="p-4 border rounded bg-light shadow-sm"
            >
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
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
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                            ></span>
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <p className="text-center mt-3">
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
};

export default LoginView;
