export const MovieCard = ({ movie, onMovieClick }) => {
    return (
        <div
            onClick={() => onMovieClick(movie)}
            style={{ cursor: "pointer", marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}
        >
            <h3>{movie.title}</h3>
        </div>
    );
};
