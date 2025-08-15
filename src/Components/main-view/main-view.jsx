
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
            headers: { Authorization: `Bearer ${token}` },
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
        <div>
            {/* Navigation bar */}
            <nav style={{ marginBottom: "20px" }}>
                <Link to="/" style={{ marginRight: "10px" }}>Movies</Link>
                <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <h1>Movies</h1>
            {loading && <p>Loading movies...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
