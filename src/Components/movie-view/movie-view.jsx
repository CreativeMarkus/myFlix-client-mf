import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
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
    }, [movieId, token]); // Only runs when movieId or token changes

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) return <div>Loading...</div>;
    if (!movie) return <div>Movie not found</div>;

    return (
        <div className="movie-view">
            <Card>
                <Card.Img
                    variant="top"
                    src={`/images/${movie.ImagePath}`}
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                />
                <Card.Body>
                    <Card.Title>{movie.Title}</Card.Title>
                    <Card.Text>{movie.Description}</Card.Text>
                    <button
                        onClick={handleBackClick}
                        className="btn btn-primary"
                    >
                        Back
                    </button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MovieView;