import React, { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = { Username: username, Password: password };

        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) throw new Error("Login failed");
                return response.json();
            })
            .then((data) => {
                if (data.user && data.token) {
                    // store in localStorage
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("token", data.token);

                    // pass back to MainView
                    onLoggedIn(data.user, data.token);
                } else {
                    alert("Invalid username or password");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Login failed (network/server error)");
            });
    };

    return (
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
            <button type="submit">Submit</button>
        </form>
    );
};
