export const MovieCard = ({ movie, onMovieClick }) => {
    return (
        <div
            onClick={() => {
                onMovieClick(movie);
            }}
            style={{
                cursor: "pointer",
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9"
            }}
        >
            <h3>{movie.title}</h3>
        </div>
    );
};
