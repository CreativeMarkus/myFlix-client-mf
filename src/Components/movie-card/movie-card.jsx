import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const MovieCard = ({ movie }) => {
  const isRemote = typeof movie.ImagePath === "string" && movie.ImagePath.startsWith("http");
  const favIncludes = (arr, id) => Array.isArray(arr) && arr.some(x => String(x) === String(id));
  // favorite state derived from localStorage; updates after API calls
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [isFavorite, setIsFavorite] = useState(favIncludes(storedUser?.FavoriteMovies, movie._id));
  const [busy, setBusy] = useState(false);

  // keep in sync when other parts of the app update the user (e.g., MovieView/ProfileView)
  useEffect(() => {
    const handler = (e) => {
      const updated = e.detail || JSON.parse(localStorage.getItem('user'));
      setIsFavorite(favIncludes(updated?.FavoriteMovies, movie._id));
    };
    window.addEventListener('userUpdated', handler);
    return () => window.removeEventListener('userUpdated', handler);
  }, [movie._id]);

  const fetchUpdatedUser = async (username, token) => {
    const resUser = await fetch(
      `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    );
    if (!resUser.ok) throw new Error('Failed to refresh user after favorite update');
    return resUser.json();
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    const username = JSON.parse(localStorage.getItem('user'))?.Username;
    if (!token || !username) return;
    setBusy(true);
    const method = isFavorite ? 'DELETE' : 'POST';
    try {
      const res = await fetch(
        `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}/movies/${movie._id}`,
        { method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'Favorite update failed');
      }
      const updatedUser = await fetchUpdatedUser(username, token);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      setIsFavorite(favIncludes(updatedUser.FavoriteMovies, movie._id));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

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

        <Button
          variant={isFavorite ? "outline-danger" : "outline-primary"}
          onClick={toggleFavorite}
          disabled={busy}
          className="mb-2 w-100"
        >
          {busy ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              Updating...
            </>
          ) : (
            isFavorite ? "Remove Favorite" : "Add to Favorites"
          )}
        </Button>

        <Button as={Link} to={`/movies/${movie._id}`} variant="primary" className="mt-auto w-100">
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;