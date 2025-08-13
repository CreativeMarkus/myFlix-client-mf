import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupView() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username, Password: password, Email: email })
        })
            .then((res) => {
                if (res.ok) {
                    alert('Signup successful! Please log in.');
                    navigate('/login');
                } else {
                    alert('Signup failed');
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Signup</button>
            </form>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    );
}
