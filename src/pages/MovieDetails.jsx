import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-details">
        <div className="loading">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-details">
        <div className="error-message">
          {error || "Movie not found"}
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      <div className="movie-details-content">
        <div className="movie-poster-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster-large"
          />
          <button
            className={`favorite-btn-large ${isFavorite(movie.id) ? "active" : ""}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite(movie.id) ? "♥" : "♡"} 
            {isFavorite(movie.id) ? " Remove from Favorites" : " Add to Favorites"}
          </button>
        </div>

        <div className="movie-info-section">
          <h1 className="movie-title">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="movie-tagline">"{movie.tagline}"</p>
          )}

          <div className="movie-meta">
            <div className="meta-item">
              <span className="meta-label">Release Date:</span>
              <span className="meta-value">
                {new Date(movie.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {movie.runtime && (
              <div className="meta-item">
                <span className="meta-label">Runtime:</span>
                <span className="meta-value">{formatRuntime(movie.runtime)}</span>
              </div>
            )}

            <div className="meta-item">
              <span className="meta-label">Rating:</span>
              <span className="meta-value">
                {movie.vote_average?.toFixed(1)}/10 ({movie.vote_count} votes)
              </span>
            </div>

            {movie.budget > 0 && (
              <div className="meta-item">
                <span className="meta-label">Budget:</span>
                <span className="meta-value">{formatCurrency(movie.budget)}</span>
              </div>
            )}

            {movie.revenue > 0 && (
              <div className="meta-item">
                <span className="meta-label">Revenue:</span>
                <span className="meta-value">{formatCurrency(movie.revenue)}</span>
              </div>
            )}
          </div>

          <div className="movie-genres">
            <span className="genres-label">Genres:</span>
            <div className="genres-list">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="production-companies">
              <h3>Production Companies</h3>
              <div className="companies-list">
                {movie.production_companies.map((company) => (
                  <span key={company.id} className="company-tag">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;

