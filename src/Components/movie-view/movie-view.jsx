import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import './movie-view.scss';

export const MovieView = ({ token }) => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!movieId) return;
        setLoading(true);

        fetch(`https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(movieData => {
                setMovie(movieData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching movie:', error);
                setLoading(false);
            });
    }, [movieId, token]);

    const handleBackClick = () => navigate(-1);

    if (loading) {
        return (
            <Container className="py-5 d-flex justify-content-center">
                <Spinner animation="border" role="status" />
            </Container>
        );
    }

    if (!movie) {
        return (
            <Container className="py-5">
                <Alert variant="warning" className="mb-0">Movie not found</Alert>
            </Container>
        );
    }

    const isRemote = typeof movie.ImagePath === "string" && movie.ImagePath.startsWith("http");

    return (
        <Container className="my-4">
            <Row className="g-4">
                <Col xs={12} md={4}>
                    <img
                        src={isRemote ? movie.ImagePath : `/images/${movie.ImagePath}`}
                        alt={movie.Title}
                        className="img-fluid rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/300x450?text=No+Image";
                        }}
                    />
                </Col>
                <Col xs={12} md={8}>
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>{movie.Title}</Card.Title>
                            <Card.Text className="mb-3">{movie.Description}</Card.Text>
                            <Button variant="primary" onClick={handleBackClick} className="mt-auto">
                                Back
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MovieView;