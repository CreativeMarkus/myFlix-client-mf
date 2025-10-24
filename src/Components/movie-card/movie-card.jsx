import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // ⬅️ ADDED: Required for propTypes to work

export const MovieCard = ({ movie }) => {
  const isRemote = typeof movie.ImagePath === "string" && movie.ImagePath.startsWith("http");
  const favIncludes = (arr, id) => Array.isArray(arr) && arr.some(x => String(x) === String(id));

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [isFavorite, setIsFavorite] = useState(favIncludes(storedUser?.FavoriteMovies, movie._id));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const updated = e.detail || JSON.parse(localStorage.getItem('user'));
      setIsFavorite(favIncludes(updated?.FavoriteMovies, movie._id));
    };
    window.addEventListener('userUpdated', handler);
    return () => window.removeEventListener('userUpdated', handler);
  }, [movie._id]);

  const fetchUpdatedUser = async (username, token) => {
    const url = `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}`;
    console.log('[fav] refresh user GET', url);
    const resUser = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    });
    if (!resUser.ok) throw new Error(`Failed to refresh user (${resUser.status})`);
    return resUser.json();
  };

  const getAuth = () => {
    const tkn = localStorage.getItem('token');
    let username = null;
    try { username = JSON.parse(localStorage.getItem('user'))?.Username || null; } catch { }
    if (!username && tkn) {
      try {
        const payload = JSON.parse(atob(tkn.split('.')[1] || ''));
        username = payload?.sub ?? null;
      } catch { }
    }
    return { tkn, username };
  };

  const toggleFavorite = async () => {
    const { tkn, username } = getAuth();
    if (!tkn || !username || !movie?._id) {
      console.error('[fav] Missing token/username/movieId', { hasToken: !!tkn, username, movieId: movie?._id });
      return;
    }
    if (busy) return;
    setBusy(true);
    const method = isFavorite ? 'DELETE' : 'POST';
    const url = `https://movieapi1-40cbbcb4b0ea.herokuapp.com/users/${encodeURIComponent(username)}/favorites/${movie._id}`;
    console.log(`[fav] ${method} ${url}`);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${tkn}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: method === 'POST' ? '{}' : undefined
      });
      const text = await res.text().catch(() => '');
      console.log('[fav] status:', res.status, 'body:', text);
      if (!res.ok) throw new Error(text || `Favorite update failed (${res.status})`);
      const updatedUser = await fetchUpdatedUser(username, tkn);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      setIsFavorite(favIncludes(updatedUser.FavoriteMovies, movie._id));
    } catch (e) {
      console.error('[fav] error:', e);
      alert(`Favorite action failed: ${e.message}`);
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

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string
  }).isRequired
};

export default MovieCard;