import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import MovieCard from "../movie-card/movie-card";

const MainView = ({ token, onLogout }) => {
    console.log("MainView rendered. Token:", token);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    const filteredMovies = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return movies;
        return movies.filter((m) => {
            const title = (m.Title || m.title || "").toString().toLowerCase();
            const genre = (m.Genre?.Name || m.genre?.name || "").toString().toLowerCase();
            const director = (m.Director?.Name || m.director?.name || "").toString().toLowerCase();
            return title.includes(q) || genre.includes(q) || director.includes(q);
        });
    }, [movies, query]);

    useEffect(() => {
        console.log("useEffect triggered. Token:", token);
        if (!token) return;
        setLoading(true);
        setError("");
        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to load movies.");
                return response.json();
            })
            .then((data) => {
                setMovies(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setError(error.message || "Failed to load movies.");
                setLoading(false);
            });
    }, [token]);

    return (
        <>
            <Container className="my-4">
                {loading && (
                    <div className="py-5 d-flex justify-content-center">
                        <Spinner animation="border" role="status" />
                    </div>
                )}

                {!loading && error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                {!loading && !error && (
                    <>
                        <Row className="mb-3">
                            <Col xs={12} sm={8} md={6} lg={4}>
                                <InputGroup>
                                    <Form.Control
                                        type="search"
                                        placeholder="Filter by title, genre, or director"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        aria-label="Filter movies"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>

                        <Row className="g-4">
                            {filteredMovies.map((movie) => (
                                <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
                                    <MovieCard movie={movie} />
                                </Col>
                            ))}
                        </Row>

                        {filteredMovies.length === 0 && (
                            <div className="text-muted mt-3">No movies match “{query}”.</div>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default MainView;