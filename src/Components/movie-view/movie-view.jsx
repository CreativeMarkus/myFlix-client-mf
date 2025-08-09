import PropTypes from "prop-types";

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <h1>{movie.Title}</h1>
            <img src={movie.ImagePath} alt={movie.Title} />
            <p>{movie.Description}</p>
            <p><strong>Genre:</strong> {movie.Genre?.Name}</p>
            <p><strong>Director:</strong> {movie.Director?.Name}</p>
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};

MovieView.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string,
        ImagePath: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string,
            Description: PropTypes.string
        }),
        Director: PropTypes.shape({
            Name: PropTypes.string,
            Bio: PropTypes.string
        })
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};
