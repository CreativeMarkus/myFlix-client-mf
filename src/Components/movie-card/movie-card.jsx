import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './movie-card.scss';

export const MovieCard = ({ movie }) => {
  const isRemote = movie.ImagePath.startsWith("http");
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={isRemote ? movie.ImagePath : `/images/${movie.ImagePath}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/300x450?text=No+Image";
        }}
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Description}</Card.Text>
        <Button as={Link} to={`/movies/${movie._id}`} variant="primary">
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;