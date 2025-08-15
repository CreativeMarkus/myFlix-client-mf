import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function MovieView() {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                setMovie(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [movieId, token]);

    if (loading) return <div>Loading...</div>;
    if (!movie) return <div>Movie not found</div>;

    return (
        <div>
            <h1>{movie.Title}</h1>
            <img src={movie.ImagePath} alt={movie.Title} style={{ maxWidth: '300px' }} />
            <p><strong>Description:</strong> {movie.Description}</p>
            <p><strong>Genre:</strong> {movie.Genre?.Name}</p>
            <p><strong>Director:</strong> {movie.Director?.Name}</p>
            <Link to="/">Back to Movies</Link>
        </div>
    );
}