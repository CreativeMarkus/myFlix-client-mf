export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div style={{ padding: "20px", border: "1px solid #ccc" }}>
            <img src={movie.image} alt={movie.title} style={{ width: "200px" }} />
            <h2>{movie.title}</h2>
            <p><strong>Description:</strong> {movie.description}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};
