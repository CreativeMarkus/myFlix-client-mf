import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginView({ onLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username, Password: password })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user && data.token) {
                    onLoggedIn(data.user, data.token);
                } else {
                    alert('Login failed');
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            <p>No account? <Link to="/signup">Sign up</Link></p>
        </div>
    );
}
