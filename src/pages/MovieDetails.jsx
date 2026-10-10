import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieContext } from '../contexts/MovieContext';
import { getMovieDetails, getMovieVideos } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTableList } from '@fortawesome/free-solid-svg-icons';
import PosterImage from '../components/common/PosterImage';
import styles from '../styles/MovieDetails.module.css';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const { toggleFavourite, toggleWatchlist, isFavourite, isInWatchlist } = useMovieContext();
    const [trailerKey, setTrailerKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMovie = async () => {
            setLoading(true);
            setError(null);
            try {
                const [details, videos] = await Promise.all([
                    getMovieDetails(id),
                    getMovieVideos(id),
                ]);
                setMovie(details);

                const trailer = videos.results.find(
                    (v) => v.site === 'YouTube' && v.type === 'Trailer'
                ) || videos.results.find((v) => v.site === 'YouTube');

                setTrailerKey(trailer ? trailer.key : null);
            } catch (err) {
                setError('Failed to load movie details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    const favourite = movie ? isFavourite(movie.id) : false;
    const watchlisted = movie ? isInWatchlist(movie.id) : false;

    const onFavouriteClick = () => {
        if (movie) toggleFavourite(movie);
    };

    const onWatchlistClick = () => {
        if (movie) toggleWatchlist(movie);
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner" />
            </div>
        );
    }

    if (error || ! movie) {
        return (
            <div className="error-state">
                <p>{error || 'Movie not found.'}</p>
                <Link to="/">Back to Trending</Link>
            </div>
        );
    }

    return (
        <div className={styles['movie-details']}>
            <Link to="/" className={styles['back-link']}>&larr; Back</Link>

            <div className={styles['details-main']}>
                <PosterImage
                    posterPath={movie.poster_path}
                    title={movie.title}
                    className={styles['details-poster']}
                />

                <div className={styles['details-info']}>
                    <h1>{movie.title}</h1>
                    {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

                    <div className={styles['meta-row']}>
                        <span>{movie.release_date?.split('-')[0]}</span>
                        {movie.runtime > 0 && <span>{movie.runtime} min</span>}
                        <span>&#9733; {movie.vote_average?.toFixed(1)} / 10</span>
                    </div>

                    <div className={styles['genre-list']}>
                        {movie.genres?.map((genre) => (
                            <span key={genre.id} className={styles['genre-pill']}>{genre.name}</span>
                        ))}
                    </div>

                    <p className={styles.overview}>{movie.overview}</p>

                    <div className={styles['movie-actions']}>
                        <button
                            type="button"
                            className={`${styles['detail-favourite-btn']} ${favourite ? styles.active : ''}`}
                            onClick={onFavouriteClick}
                            aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <button
                            type="button"
                            className={`${styles['detail-watchlist-btn']} ${watchlisted ? styles.active : ''}`}
                            onClick={onWatchlistClick}
                            aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                        >
                            <FontAwesomeIcon icon={faTableList} />
                        </button>
                        <Link to={`/watch-with/${movie.id}`} className={styles['watch-with-btn']}>
                            Watch With...
                        </Link>
                    </div>
                </div>
            </div>

            {trailerKey && (
                <div className={styles['trailer-section']}>
                    <h2>Trailer</h2>
                    <div className={styles['trailer-embed']}>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}`}
                            title={`${movie.title} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;