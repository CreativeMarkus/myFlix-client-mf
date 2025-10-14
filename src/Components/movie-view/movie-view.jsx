import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    const isRemote = movie.ImagePath.startsWith("http");

    return (
        <div className="movie-view">
            <div>
                <img
                    src={isRemote ? movie.ImagePath : `/images/${movie.ImagePath}`}
                    className="movie-poster"
                    alt={movie.Title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/300x450?text=No+Image";
                    }}
                />
            </div>
            <div>
                <h2>{movie.Title}</h2>
                <p>{movie.Description}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default MovieView;