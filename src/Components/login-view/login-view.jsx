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

        console.log('Attempting login with payload:', data);

        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(async (response) => {
                // Safely read response body as text and try to parse JSON
                const text = await response.text();
                let parsed;
                try {
                    parsed = text ? JSON.parse(text) : {};
                } catch (e) {
                    parsed = text;
                }
                console.log('Login response status:', response.status, 'body:', parsed);

                if (!response.ok) {
                    const message = (parsed && parsed.message) || (typeof parsed === 'string' && parsed) || 'Invalid login credentials';
                    throw new Error(message);
                }

                return parsed;
            })
            .then((data) => {
                console.log('Parsed login data:', data);
                // Accept several possible token field names from different backends
                const tokenValue = data && (data.token || data.accessToken || data.access_token || data.jwt || data.Token);

                if (tokenValue) {
                    localStorage.setItem("token", tokenValue);

                    // Prefer user object returned by server, fall back to username
                    const user = (data && data.user) || { username };
                    localStorage.setItem("user", JSON.stringify(user));

                    onLoggedIn(user, tokenValue);
                } else {
                    setError('Login succeeded but token not found. Check console for response.');
                    console.error('Token not found in login response:', data);
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
