import MovieCard from "../components/MovieCard";
import { useState, useEffect, useContext } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";
import { Link } from "react-router-dom";
import { MovieContext } from "../contexts/MovieContext";

function Home() {
  const { /* searchResults, */ setSearchResults, searchQuery, setSearchQuery } =
    useContext(MovieContext);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setSearchResults(movies);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies &&
            movies.map((movie) => {
              return (
                <Link
                  key={movie.id}
                  to={`/movie-overview/${movie.id}/${movie.title}`}
                >
                  <MovieCard movie={movie} key={movie.id} />
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default Home;
