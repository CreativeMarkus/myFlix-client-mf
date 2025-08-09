import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: "Inception",
            description: "A thief who steals corporate secrets through dream-sharing technology.",
            image: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
            genre: "Sci-Fi",
            director: "Christopher Nolan"
        },
        {
            id: 2,
            title: "The Matrix",
            description: "A hacker discovers the reality he lives in is a simulation.",
            image: "https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE7Fp3YkFoM9UoOEb.jpg",
            genre: "Action",
            director: "Lana Wachowski, Lilly Wachowski"
        },
        {
            id: 3,
            title: "Interstellar",
            description: "A team of explorers travel through a wormhole in space.",
            image: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
            genre: "Adventure",
            director: "Christopher Nolan"
        }
    ]);

    const [selectedMovie, setSelectedMovie] = useState(null);

    if (selectedMovie) {
        return (
            <MovieView
                movie={selectedMovie}
                onBackClick={() => setSelectedMovie(null)}
            />
        );
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onMovieClick={(movie) => setSelectedMovie(movie)}
                />
            ))}
        </div>
    );
};
