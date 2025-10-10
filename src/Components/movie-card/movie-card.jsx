import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie }) => {
  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ border: '1px solid #ccc', margin: 10, padding: 10, width: 200 }}>
      <img
        src={movie.ImagePath || 'placeholder-image-url'}
        alt={movie.Title || 'Movie'}
        style={{ width: '100%' }}
      />
      <h3>{movie.Title || 'Untitled'}</h3>
      <p>{movie.Description ? movie.Description.substring(0, 100) + '...' : 'No description available'}</p>
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
