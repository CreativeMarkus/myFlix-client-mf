import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { LoginView } from '../login-view/login-view';
import PropTypes from 'prop-types';

export default function MainView() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!token) return;

        fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error(err));
    }, [token]);

    // Show login if not logged in
    if (!user) {
        return (
            <LoginView
                onLoggedIn={(user, token) => {
                    setUser(user);
                    setToken(token);
                }}
            />
        );
    }

    return (
        <div>
            <h1>Movies</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

MainView.propTypes = {
    token: PropTypes.string
};
