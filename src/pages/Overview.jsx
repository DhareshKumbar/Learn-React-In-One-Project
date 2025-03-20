import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getPopularMovies, searchMovies } from "../services/api";
import "../css/overview.css";
import { MovieContext } from "../contexts/MovieContext";

function Overview() {
  const { searchResults, searchQuery, arrayChecker } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();

  useEffect(() => {
    // console.log(typeof searchResults);
    if (arrayChecker) {
      const loadPopularMovies = async () => {
        try {
          const popularMovies = await getPopularMovies();
          const current_movie = popularMovies.find((movie) => {
            return Number(movie.id) === Number(movieId);
          });
          setMovie(current_movie);
        } catch (err) {
          console.error(err);
          setError("Failed to load movie details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      loadPopularMovies();
    } else {
      const getEarchedMovies = async () => {
        try {
          const searchResults = await searchMovies(searchQuery);
          const current_movie = searchResults.find((movie) => {
            return Number(movie.id) === Number(movieId);
          });
          setMovie(current_movie);
        } catch (err) {
          console.error(err);
          setError("Failed to load movie details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      getEarchedMovies();
    }
  }, [movieId, searchQuery, searchResults]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );

  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <div className="movie-overview-container">
      <div className="movie-overview">
        <div className="movie-photo">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            title={movie.title}
            onLoad={() => console.log("Original Image Loaded")}
          />
        </div>
        <div className="overview">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span className="release-date">{movie.release_date}</span>
          </div>
          <div className="movie-stats">
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">
                {movie.vote_average} / 10
                <span className="stat-detail">({movie.vote_count} votes)</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">
                Popularity: {Math.round(movie.popularity).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="movie-description">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
