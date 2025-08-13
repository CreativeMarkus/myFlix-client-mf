import React, { useState, useEffect } from 'react';

export default function ProfileView({ user, token, setUser }) {
    const [username, setUsername] = useState(user.Username);
    const [email, setEmail] = useState(user.Email);

    const updateProfile = (e) => {
        e.preventDefault();
        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${user.Username}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Username: username, Email: email })
        })
            .then(res => res.json())
            .then(updatedUser => {
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Profile updated!');
            })
            .catch(err => console.error(err));
    };

    const deleteProfile = () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${user.Username}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    localStorage.clear();
                    window.location.href = '/signup';
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div>
            <h2>Profile</h2>
            <form onSubmit={updateProfile}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Update Profile</button>
            </form>
            <button onClick={deleteProfile} style={{ color: 'red' }}>Delete Account</button>
        </div>
    );
}
