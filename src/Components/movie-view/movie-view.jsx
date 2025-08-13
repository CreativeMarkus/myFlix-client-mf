import React, { useState, useEffect } from "react";
import LoginView from "../login-view/login-view";
import SignupView from "../signup-view/signup-view";
import { MovieCard } from "../movie-card/movie-card";

export default function MainView() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    const [user, setUser] = useState(storedUser || null);
    const [token, setToken] = useState(storedToken || null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!token) return;

        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error(err));
    }, [token]);

    if (!user) {
        return (
            <>
                <h2>Login</h2>
                <LoginView
                    onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                    }}
                />

                <h2>Sign Up</h2>
                <SignupView />
            </>
        );
    }

    return (
        <div>
            <h1>Movies</h1>
            <button
                onClick={() => {
                    setUser(null);
                    setToken(null);
                    localStorage.clear();
                }}
            >
                Logout
            </button>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
