import styles from '../styles/Trending.module.css';
import MovieCard from '../components/common/MovieCard';
import Pagination from '../components/common/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Trending({
    searchQuery,
    setSearchQuery,
    handleClearSearch,
    movies,
    loading,
    error,
    page,
    totalPages,
    setPage,
}) {
    return (
        <div className={styles['trending-movies']}>
            <div className={styles['trending-header']}>
                <h2>{searchQuery ? '' : 'Trending'}</h2>
                <form onSubmit={(e) => e.preventDefault()} className={styles['search-form']}>
                    <div className={styles['search-wrapper']}>
                        <input
                            type="text"
                            className={styles['search-input']}
                            placeholder="Search for a movie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button type="button" className={styles['clear-button']} onClick={handleClearSearch} aria-label="Clear search">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                    {loading && <span className={styles['search-spinner']} aria-hidden="true" />}
                </form>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : movies.length > 0 ? (
                <>
                    <div className={styles['movie-grid']}>
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                </>
            ) : (
                <div className={styles['no-results']}>No movies found.</div>
            )}
        </div>
    );
}

export default Trending;