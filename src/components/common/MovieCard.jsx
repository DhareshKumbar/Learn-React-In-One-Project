import styles from '../../styles/MovieCard.module.css';
import PosterImage from './PosterImage';
import { Link, useNavigate } from 'react-router-dom';
import { useMovieContext } from '../../contexts/MovieContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTableList } from '@fortawesome/free-solid-svg-icons';

function MovieCard({movie}) {
    const navigate = useNavigate();
    const {
        addToFavourites,
        removeFromFavourites,
        isFavourite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
    } = useMovieContext();

    const favourite = isFavourite(movie.id);
    const watchlisted = isInWatchlist(movie.id);

    function onFavouriteClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (favourite) removeFromFavourites(movie.id);
        else addToFavourites(movie);
    }

    function onWatchlistClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (watchlisted) removeFromWatchlist(movie.id);
        else addToWatchlist(movie);
    }

    function onWatchWithClick(e) {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/watch-with/${movie.id}`);
    }

    return (
        <div className={styles['movie-card']}>
            <Link to={`/movie/${movie.id}`} className={styles['movie-poster']}>
                <PosterImage posterPath={movie.poster_path} title={movie.title} />
                <div className={styles['movie-overlay']}>
                    <button
                        type="button"
                        className={`${styles['favourite-btn']} ${favourite ? styles.active : ''}`}
                        onClick={onFavouriteClick}
                        aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
                    >
                        <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <button
                        type="button"
                        className={`${styles['watchlist-btn']} ${watchlisted ? styles.active : ''}`}
                        onClick={onWatchlistClick}
                        aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                        <FontAwesomeIcon icon={faTableList} />
                    </button>
                    <button
                        type="button"
                        className={styles['watch-with-btn']}
                        onClick={onWatchWithClick}
                    >
                        Watch With...
                    </button>
                </div>
            </Link>
            <div className={styles['movie-info']}>
                <h3>{movie.title}</h3>
                <p>{movie.release_date?.split('-')[0]}</p>
            </div>
        </div>
    );
}

export default MovieCard;