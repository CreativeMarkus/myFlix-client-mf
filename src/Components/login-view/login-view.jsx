import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { username: username, password: password };
        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    const user = { username: username };
                    localStorage.setItem("user", JSON.stringify(user));
                    onLoggedIn(user, data.token);
                } else {
                    alert("Invalid login credentials");
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                alert("Login failed due to network/server error");
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            <p>
                Do not have an account?{" "}
                <Link to="/signup">Sign up here</Link>
            </p>
        </>
    );
};

export default LoginView;
