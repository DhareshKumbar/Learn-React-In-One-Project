import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getMoviesByGenre } from '../services/api';
import PosterImage from '../components/common/PosterImage';
import MovieCard from '../components/common/MovieCard';
import styles from '../styles/WatchWith.module.css';

// Picks a random movie from the list, excluding current id so
// that "Choose Another" never re-picks the movie it just showed
function getRandomMovie(list, excludeId) {
    const pool = excludeId ? list.filter((m) => m.id !== excludeId) : list;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

function WatchWith() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [pick, setPick] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPairing = async () => {
            setLoading(true);
            setError(null);
            try {
                const details = await getMovieDetails(id);
                setMovie(details);

                // Use the film's primary genre (TMDB orders genres by relevance)
                const primaryGenreId = details.genres?.[0]?.id;

                const discovered = primaryGenreId
                    ? await getMoviesByGenre([primaryGenreId])
                    : { results: [] };

                const withPosters = discovered.results.filter(
                    (m) => m.poster_path && m.id !== details.id
                );
                setSimilarMovies(withPosters);
                setPick(getRandomMovie(withPosters));
            } catch (err) {
                setError('Failed to load a pairing for this movie.');
            } finally {
                setLoading(false);
            }
        };

        loadPairing();
    }, [id]);

    const handleChooseAnother = () => {
        setPick((current) => getRandomMovie(similarMovies, current?.id));
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
        <div className={styles['watch-with']}>
            <Link to={`/movie/${movie.id}`} className={styles['back-link']}>&larr; Back to {movie.title}</Link>

            <h1 className={styles['watch-with-title']}>
                Watch <span>{movie.title}</span> With...
            </h1>

            <div className={styles.pairing}>
                <div className={styles['pairing-slot']}>
                    <PosterImage
                        posterPath={movie.poster_path}
                        title={movie.title}
                        className={styles['pairing-poster']}
                    />
                    <p className={styles['pairing-label']}>{movie.title} ({movie.release_date?.split('-')[0]})</p>
                </div>

                <div className={styles['pairing-vs']}>+</div>

                <div className={styles['pairing-slot']}>
                    {pick ? (
                        <Link to={`/movie/${pick.id}`}>
                            <PosterImage
                                posterPath={pick.poster_path}
                                title={pick.title}
                                className={styles['pairing-poster']}
                            />
                        </Link>
                    ) : (
                        <div className={`${styles['pairing-poster']} poster-placeholder`}>
                            <span>No similar movies found</span>
                        </div>
                    )}
                    <p className={styles['pairing-label']}>{pick ? pick.title : '—'} ({pick?.release_date?.split('-')[0]})</p>
                </div>
            </div>

            {pick && (
                <button type="button" className={styles['choose-another-btn']} onClick={handleChooseAnother}>
                    Choose Another
                </button>
            )}

            {similarMovies.length > 0 && (
                <div className={styles['similar-section']}>
                    <h2>Similar Movies</h2>
                    <div className={styles['movie-grid']}>
                        {similarMovies
                            .filter((m) => m.id !== pick?.id)
                            .slice(0, 12)
                            .map((m) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WatchWith;
