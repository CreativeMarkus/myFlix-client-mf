import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: "Inception",
            description: "A thief who steals corporate secrets through dream-sharing technology.",
            image: "https://tinyurl.com/2f3nkz8m",
            genre: "Sci-Fi",
            director: "Christopher Nolan"
        },
        {
            id: 2,
            title: "The Matrix",
            description: "A hacker discovers the reality he lives in is a simulation.",
            image: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg",
            genre: "Action",
            director: "Lana & Lilly Wachowski"
        },
        {
            id: 3,
            title: "Interstellar",
            description: "A team travels through a wormhole in search of a new home for humanity.",
            image: "https://img.moviepostershop.com/interstellar-movie-poster-2014-1020771202.jpg",
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
