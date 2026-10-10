import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const response = await getPopularMovies(1);
        setMovies(response.results);
        setTotalPages(response.total_pages);
        setCurrentPage(1);
        setIsSearchMode(false);
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
    if (!searchQuery.trim()) return
    if (loading) return

    setLoading(true)
    try {
        const response = await searchMovies(searchQuery, 1)
        setMovies(response.results)
        setTotalPages(response.total_pages)
        setCurrentPage(1)
        setIsSearchMode(true)
        setError(null)
    } catch (err) {
        console.log(err)
        setError("Failed to search movies...")
    } finally {
        setLoading(false)
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || currentPage >= totalPages) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      let response;
      
      if (isSearchMode) {
        response = await searchMovies(searchQuery, nextPage);
      } else {
        response = await getPopularMovies(nextPage);
      }
      
      setMovies(prevMovies => [...prevMovies, ...response.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.log(err);
      setError("Failed to load more movies...");
    } finally {
      setLoadingMore(false);
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
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
          
          {currentPage < totalPages ? (
            <div className="load-more-container">
              <button 
                onClick={handleLoadMore} 
                disabled={loadingMore}
                className="load-more-button"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          ) : movies.length > 0 && (
            <div className="load-more-container">
              <p className="no-more-movies">No more movies to load</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
