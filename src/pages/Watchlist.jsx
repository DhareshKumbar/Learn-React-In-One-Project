import styles from '../styles/Selections.module.css';
import MovieCard from '../components/common/MovieCard';
import { useMovieContext } from '../contexts/MovieContext';

function Watchlist() {
    const { watchlist } = useMovieContext();

    if (watchlist.length > 0) {
        return (
            <div className={styles.watchlist}>
                <h2>Watchlist</h2>
                <div className={styles['movie-grid']}>
                    {watchlist.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles['watchlist-empty']}>
                <h2>Watchlist</h2>
                <p>No movies in your watchlist yet!</p>
                <p>Click the list icon to add movies.</p>
            </div>
        );
    }
}

export default Watchlist;