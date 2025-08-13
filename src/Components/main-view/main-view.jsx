import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import PropTypes from 'prop-types';

export default function MainView({ token }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error(err));
    }, [token]);

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
    token: PropTypes.string.isRequired
};
