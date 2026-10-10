import styles from '../styles/Selections.module.css';
import MovieCard from '../components/common/MovieCard';
import { useMovieContext } from '../contexts/MovieContext';

function Favourites() {
    const { favourites } = useMovieContext();

    if (favourites.length > 0) {
        return (
            <div className={styles.favourites}>
                <h2>Favourites</h2>
                <div className={styles['movie-grid']}>
                    {favourites.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles['favourites-empty']}>
                <h2>Favourites</h2>
                <p>No favourites yet!</p>
                <p>Click the heart icon to add movies.</p>
            </div>
        );
    }
}

export default Favourites;