import './movie-view.scss';

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <img src={movie.ImagePath} alt={movie.Title} className="w-100" />
            <h2>{movie.Title}</h2>
            <p>{movie.Description}</p>
            <button onClick={onBackClick} className="back-button" style={{ cursor: 'pointer' }}>
                Back
            </button>
        </div>
    );
};