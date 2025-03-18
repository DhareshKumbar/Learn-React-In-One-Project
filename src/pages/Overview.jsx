import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/api";
import { useParams } from "react-router-dom";
import "../css/overview.css";

function Overview() {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();

  useEffect(() => {
    const loadPopularMovies = async () => {
      console.log("movieId:", movieId); // Debug movieId

      try {
        const popularMovies = await getPopularMovies();
        console.log("popularMovies:", popularMovies); // Debug the fetched movies

        const current_movie = popularMovies.find((movie) => {
          return Number(movie.id) === Number(movieId);
        });
        setMovie(current_movie);
        console.log(current_movie);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, [movieId]);

  if (loading) return <div>loading... </div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="movie-overview">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
          alt={movie?.title}
          title={movie?.title}
        />
      </div>
      <div className="overview">
        <h2>{movie?.title}</h2>
        <p>
          {movie?.overview}
          <br />
          <small>{movie?.release_date}</small>
        </p>
      </div>
    </div>
  );
}

export default Overview;
