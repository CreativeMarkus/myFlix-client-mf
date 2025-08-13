import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function MovieView({ token }) {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMovie(data))
            .catch(err => console.error(err));
    }, [movieId, token]);

    if (!movie) return <p>Loading movie...</p>;

    return (
        <div>
            <img src={movie.ImagePath} alt={movie.Title} style={{ width: '300px' }} />
            <h2>{movie.Title}</h2>
            <p>{movie.Description}</p>
            <Link to="/">Back to Movies</Link>
        </div>
    );
}
