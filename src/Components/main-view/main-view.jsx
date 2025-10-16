import React, { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MovieCard from "../movie-card/movie-card";

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
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="my-4">
            <Navbar bg="light" expand="md" className="mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">myFlix</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                        </Nav>
                        <div className="d-flex gap-2">
                            <Button variant="outline-danger" onClick={onLogout}>Sign Out</Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Row className="g-4">
                {movies.map((movie) => (
                    <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
                        <MovieCard movie={movie} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MainView;