import React, { useState, useEffect } from "react";
import { MovieList } from "../movie-list/movie-list";
import { Container, Row, Col } from "react-bootstrap";

const MainView = ({ token, onLogout }) => {
    console.log("MainView rendered. Token:", token);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect triggered. Token:", token);
        if (!token) return;
        setLoading(true);
        fetch("https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                setMovies(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setLoading(false);
            });
    }, [token]); // Only runs when token changes

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h1>Movies</h1>
                <button className="btn btn-outline-danger" onClick={onLogout}>
                    Sign Out
                </button>
            </div>
            <Row>
                <Col>
                    <MovieList movies={movies} />
                </Col>
            </Row>
        </Container>
    );
};

export default MainView;