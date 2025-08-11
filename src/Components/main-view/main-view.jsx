import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard/MovieCard';

export const MainView = ({ onMovieClick }) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                return response.json();
            })
            .then((data) => setMovies(data))
            .catch((error) => console.error('Error fetching movies:', error));
    }, []);

    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard
                    key={movie._id}
                    movie={movie}
                    onMovieClick={onMovieClick}
                />
            ))}
        </div>
    );
};

MainView.propTypes = {
    onMovieClick: PropTypes.func.isRequired
};
