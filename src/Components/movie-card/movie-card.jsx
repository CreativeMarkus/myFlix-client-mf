import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie }) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: 10, padding: 10, width: 200 }}>
      <img src={movie.ImagePath} alt={movie.Title} style={{ width: '100%' }} />
      <h3>{movie.Title}</h3>
      <p>{movie.Description.substring(0, 100)}...</p>
      <Link to={`/movies/${movie._id}`}>View Details</Link>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string
  }).isRequired
};
