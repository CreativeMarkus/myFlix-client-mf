import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie }) => {
  const isRemote = typeof movie.ImagePath === "string" && movie.ImagePath.startsWith("http");

  return (
    <Card className="h-100 text-center mb-4">
      {movie.ImagePath && (
        <Card.Img
          variant="top"
          src={isRemote ? movie.ImagePath : `/images/${movie.ImagePath}`}
          className="img-fluid"
          alt={movie.Title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x450?text=No+Image";
          }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="card-title">{movie.Title}</Card.Title>
        <Card.Text className="text-muted mb-3">{movie.Description}</Card.Text>
        <Button as={Link} to={`/movies/${movie._id}`} variant="primary" className="mt-auto w-100">
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;