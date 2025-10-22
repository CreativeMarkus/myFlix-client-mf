import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://movieapi1-40cbbcb4b0ea.herokuapp.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ Username: username, Password: password }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data?.token || !data?.user) throw new Error(data?.message || "Login failed");

      // Persist auth
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      onLoggedIn(data.user, data.token);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>

      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-light shadow-sm"
      >
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-3"
          disabled={loading}
        >
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
        </Button>
      </Form>

      <p className="text-center mt-3">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default LoginView;