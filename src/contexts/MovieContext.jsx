import {createContext, useContext, useEffect, useState } from 'react';

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({children}) => {
    const [favourites, setFavourites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const storedFavourites = localStorage.getItem('favourites');
        const storedWatchlist = localStorage.getItem('watchlist');

        if (storedFavourites) setFavourites(JSON.parse(storedFavourites));
        if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
    }, []);

    useEffect(() => {
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }, [favourites]);

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    // Add film to Favourites
    const addToFavourites = (movie) => {
        setFavourites((prev) =>
            prev.some((item) => item.id === movie.id) ? prev : [...prev, movie]
        );
    };

    // Remove film from Favourites
    const removeFromFavourites = (movieId) => {
        setFavourites((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    // Check if film is in Favourites
    const isFavourite = (movieId) => {
        return favourites.some((movie) => movie.id === movieId);
    };

    // If film is in Favourites, remove it or vice-versa
    const toggleFavourite = (movie) => {
        if (isFavourite(movie.id)) {
            removeFromFavourites(movie.id);
        } else {
            addToFavourites(movie);
        }
    };

    // Add film to Watchlist
    const addToWatchlist = (movie) => {
        setWatchlist((prev) =>
            prev.some((item) => item.id === movie.id) ? prev : [...prev, movie]
        );
    };

    // Remove film from Watchlist
    const removeFromWatchlist = (movieId) => {
        setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    // Check if film is in Watchlist
    const isInWatchlist = (movieId) => {
        return watchlist.some((movie) => movie.id === movieId);
    };

    // If film is in Watchlist, remove it or vice-versa
    const toggleWatchlist = (movie) => {
        if (isInWatchlist(movie.id)) {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
    };

    const value = {
        favourites,
        watchlist,
        addToFavourites,
        removeFromFavourites,
        isFavourite,
        toggleFavourite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
    }

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
}