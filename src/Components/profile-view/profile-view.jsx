import React, { useState, useEffect } from 'react';

export const ProfileView = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('user');

        if (!token || !username) {
            setLoading(false);
            return;
        }

        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!user) {
        return <div>No user data found. Please log in.</div>;
    }

    return (
        <div className="profile-view">
            <h2>Profile</h2>
            <p><strong>Username:</strong> {user.Username}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>Birthday:</strong> {user.Birthday ? new Date(user.Birthday).toLocaleDateString() : 'N/A'}</p>
        </div>
    );
};
