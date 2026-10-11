import MovieCard from "../components/MovieCard";
import { useState } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";
import { useQuery } from "react-query";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [pageError, setPageError] = useState(null);
    const {
        isLoading: isLoadingPopular,
        error: errorPopular,
        data: popularMovies,
    } = useQuery("popularMovies", getPopularMovies);
    const {
        isLoading: isLoadingSearch,
        error: errorSearch,
        data: searchResults,
        refetch: refetchSearch,
    } = useQuery(
        ["searchMovies", searchQuery],
        () => searchMovies(searchQuery),
        {
            enabled: false,
        },
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            return;
        }
        refetchSearch();
    };

    let movies = [];
    let isLoading = isLoadingPopular;
    let error = errorPopular;

    if (searchQuery.trim()) {
        isLoading = isLoadingSearch;
        error = errorSearch;
        movies = searchResults || [];
    } else {
        movies = popularMovies || [];
    }
    // The error state is set using the useState hook.
    if (errorSearch) {
        setPageError("Failed to search movies...");
    }

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

            {pageError && <div className="error-message">{pageError}</div>}

            {isLoading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            movie={movie}
                            key={movie.id}
                            showYearOnly={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
