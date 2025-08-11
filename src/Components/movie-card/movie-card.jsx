import React from 'react';
import PropTypes from 'prop-types';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div onClick={() => onMovieClick(movie)}>
      <h2>{movie.Title}</h2>
      {movie.ImagePath && (
        <img src={movie.ImagePath} alt={movie.Title} style={{ width: '200px' }} />
      )}
      <p>{movie.Description}</p>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Description: PropTypes.string
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};
