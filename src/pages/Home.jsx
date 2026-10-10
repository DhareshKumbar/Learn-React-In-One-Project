import MovieCard from "../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const formRef = useRef(null);

  const debouncedQuery = useDebounce(searchQuery, 500);

  // Fetch suggestions when the debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const results = await searchMovies(debouncedQuery);
        setSuggestions(results.slice(0, 8));
        setShowSuggestions(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Click-outside listener to close the dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const submitSearch = async (query) => {
    if (!query.trim()) return;
    if (loading) return;

    setShowSuggestions(false);
    setLoading(true);
    try {
      const searchResults = await searchMovies(query);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  const handleSelectSuggestion = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    submitSearch(title);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex].title);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form" ref={formRef}>
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button">
          Search
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((movie, index) => (
              <li
                key={movie.id}
                className={`suggestion-item${index === selectedIndex ? " selected" : ""}`}
                onMouseDown={() => handleSelectSuggestion(movie.title)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {movie.title}
                {movie.release_date && (
                  <span className="suggestion-year">
                    ({movie.release_date.split("-")[0]})
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </form>

        {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
