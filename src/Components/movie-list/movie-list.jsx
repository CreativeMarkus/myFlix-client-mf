import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import './movie-list.scss';

export const MovieList = ({ movies }) => {
    return (
        <Row className="g-4 movie-list">
            {movies.map((movie) => (
                <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
                    <MovieCard movie={movie} />
                </Col>
            ))}
        </Row>
    );
};

export default MovieList;
