import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";

export default function MainView({ token }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError("");

        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch movies.");
                return response.json();
            })
            .then((data) => setMovies(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            {/* Navigation bar */}
            <nav>
                <Link to="/">Movies</Link>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <h2>Movies</h2>

            {loading && <p>Loading movies...</p>}
            {error && <p>{error}</p>}

            <div className="movie-list">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </>
    );
}
