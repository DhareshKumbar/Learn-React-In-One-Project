import {createContext, useState, useContext, useEffect, useMemo} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")

        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    // useMemo keeps the same object reference until favorites changes.
    // Without it, a new object is created every render, and since { a: 1 } !== { a: 1 } (referential equality),
    // React would re-render every consumer of this context even when favorites hasn't changed.
    const value = useMemo(() => ({
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }), [favorites])

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}