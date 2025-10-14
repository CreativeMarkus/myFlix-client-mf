import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const data = {
      Username: username.trim(),
      Password: password,
    };

    try {
      console.log("Sending login request with:", JSON.stringify(data, null, 2));
      const response = await fetch(
        "https://movieapi1-40cbbcb4b0ea.herokuapp.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.text();
      console.log("Raw response:", responseData);

      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch (e) {
        console.error("Failed to parse response as JSON:", responseData);
        throw new Error("Invalid response format from server");
      }

      if (!response.ok) {
        throw new Error(parsedData.message || `Login failed: ${responseData}`);
      }

      if (!parsedData.user || !parsedData.token) {
        throw new Error("Invalid response format: missing user or token");
      }

      localStorage.setItem("user", JSON.stringify(parsedData.user));
      localStorage.setItem("token", parsedData.token);
      onLoggedIn(parsedData.user, parsedData.token);
    } catch (error) {
      console.error("Login error details:", error);
      setError(error.message);
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