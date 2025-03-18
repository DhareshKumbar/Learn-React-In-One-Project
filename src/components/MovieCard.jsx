import "../css/MovieCard.css";
import { MovieContext } from "../contexts/MovieContext";
import LazyLoad from "react-lazyload";
import propTypes from "prop-types";
import { useContext } from "react";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } =
    useContext(MovieContext);
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <LazyLoad width={500}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        </LazyLoad>
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>Title: {movie.title}</h3>
        <p>Release date: {movie.release_date}</p>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: propTypes.object.isRequired,
};

export default MovieCard;
