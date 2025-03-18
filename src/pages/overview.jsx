import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../services/api";
import { useParams } from "react-router-dom";

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
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, [movieId]);

  return (
    <div>
      <div className="movie-overview">
        {movie && <MovieCard movie={movie} />}
        <div className="overview">
          <p>lorem ipsum delor, asit at mus sitant</p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
