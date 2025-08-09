import PropTypes from "prop-types";

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div onClick={() => onMovieClick(movie)}>
      <h3>{movie.Title}</h3>
      <img src={movie.ImagePath} alt={movie.Title} />
      <p>{movie.Description}</p>
      <p><strong>Genre:</strong> {movie.Genre?.Name}</p>
      <p><strong>Director:</strong> {movie.Director?.Name}</p>
    </div>
  );
};

MovieCard.propTypes = {
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
  onMovieClick: PropTypes.func.isRequired
};
