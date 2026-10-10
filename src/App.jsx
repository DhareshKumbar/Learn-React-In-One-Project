import './styles/App.css';
import Favourites from './pages/Favourites';
import HeroBanner from './components/common/HeroBanner';
import MovieDetails from './pages/MovieDetails';
import Nav from './components/common/Nav';
import Trending from './pages/Trending';
import Watchlist from './pages/Watchlist';
import WatchWith from './pages/WatchWith';
import { getTrendingMovies, searchMovies } from './services/api';
import { MovieProvider } from './contexts/MovieContext';
import { Route, Routes } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from './hooks/useDebounce';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const isSearching = debouncedSearchQuery.trim() !== '';

    // When search term changes, jump back to page 1
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchQuery]);

    const loadTrendingMovies = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = isSearching
                ? await searchMovies(debouncedSearchQuery, page)
                : await getTrendingMovies(page);
            setMovies(data.results);
            setTotalPages(data.total_pages);
        } catch (err) {
            setError(isSearching ? 'Failed to search movies.' : 'Failed to load movies.');
            setMovies([]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchQuery, page, isSearching]);

    useEffect(() => {
        loadTrendingMovies();
    }, [loadTrendingMovies]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    return (
        <MovieProvider>
            <Nav handleClearSearch={handleClearSearch} />
            <HeroBanner />
            <main className="main-content">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Trending
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                handleClearSearch={handleClearSearch}
                                movies={movies}
                                loading={loading}
                                error={error}
                                page={page}
                                totalPages={totalPages}
                                setPage={setPage}
                                isSearching={isSearching}
                                onRetry={loadTrendingMovies}
                            />
                        }
                    />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                    <Route path="/watch-with/:id" element={<WatchWith />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                </Routes>
            </main>
        </MovieProvider>
    );
}

export default App;
