import PropTypes from "prop-types";

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
        <div onClick={() => onMovieClick(movie)}>
            <h3>{movie.Title}</h3>
            <img src={movie.ImagePath} alt={movie.Title} />
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired,
        Description: PropTypes.string,
        Genre: PropTypes.shape({
            Name: PropTypes.string,
            Description: PropTypes.string
        }),
        Director: PropTypes.shape({
            Name: PropTypes.string,
            Bio: PropTypes.string
        })
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired
};
