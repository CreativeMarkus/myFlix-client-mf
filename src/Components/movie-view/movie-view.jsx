import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import './movie-view.scss';

export const MovieView = ({ token }) => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isFavorite, setIsFavorite] = useState(false);
    const [busy, setBusy] = useState(false);

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

    const favIncludes = (arr, id) => Array.isArray(arr) && arr.some(x => String(x) === String(id));

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user'));
        setIsFavorite(favIncludes(stored?.FavoriteMovies, movie?._id));
    }, [movie]);

    useEffect(() => {
        const handler = (e) => {
            const updated = e.detail;
            if (updated && movie?._id) {
                setIsFavorite(favIncludes(updated.FavoriteMovies, movie._id));
            }
        };
        window.addEventListener('userUpdated', handler);
        return () => window.removeEventListener('userUpdated', handler);
    }, [movie?._id]);

    const fetchUpdatedUser = async (username, tkn) => {
        const url = `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`;
        const resUser = await fetch(url, {
            headers: { Authorization: `Bearer ${tkn}`, Accept: 'application/json' }
        });
        if (!resUser.ok) throw new Error('Failed to refresh user after favorite update');
        return resUser.json();
    };

    const getUsername = () => {
        try { return JSON.parse(localStorage.getItem('user'))?.Username || null; } catch { return null; }
    };

    const toggleFavorite = async () => {
        const tkn = localStorage.getItem('token');
        const username = getUsername();
        if (!tkn || !username || !movie?._id) return;

        setBusy(true);
        const method = isFavorite ? 'DELETE' : 'POST';
        try {
            const url = `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}/favorites/${movie._id}`;
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${tkn}`, Accept: 'application/json' }
            });
            if (!res.ok) {
                const msg = await res.text().catch(() => '');
                throw new Error(msg || 'Favorite update failed');
            }
            const updatedUser = await fetchUpdatedUser(username, tkn);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
            setIsFavorite(favIncludes(updatedUser.FavoriteMovies, movie._id));
        } catch (e) {
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

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
                    <Card className="h-100">
                        <Card.Img
                            variant="top"
                            src={isRemote ? movie.ImagePath : `/images/${movie.ImagePath}`}
                            alt={movie.Title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/300x450?text=No+Image";
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={8}>
                    <Card className="h-100">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>{movie.Title}</Card.Title>
                            <Card.Text className="mb-3">{movie.Description}</Card.Text>
                            <div className="d-flex flex-column flex-sm-row gap-2 mt-auto">
                                <Button
                                    variant={isFavorite ? "outline-danger" : "outline-primary"}
                                    onClick={toggleFavorite}
                                    disabled={busy}
                                >
                                    {busy ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        isFavorite ? "Remove Favorite" : "Add to Favorites"
                                    )}
                                </Button>
                                <Button variant="primary" onClick={handleBackClick}>
                                    Back
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MovieView;
