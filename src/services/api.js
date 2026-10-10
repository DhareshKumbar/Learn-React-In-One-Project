const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch trending films
export const getTrendingMovies = async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    if (! response.ok) throw new Error('Failed to get trending movies');
    
    return response.json();
}

// Search all of TMDB for specific film
export const searchMovies = async (query, page = 1) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
    if (! response.ok) throw new Error('Failed to search movies');
    
    return response.json();
};

// Fetch film info (release date, genres, etc)
export const getMovieDetails = async (id) => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    if (! response.ok) throw new Error('Failed to fetch movie details');
    
    return response.json();
};

// Fetch film trailer
export const getMovieVideos = async (id) => {
    const response = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
    if (! response.ok) throw new Error('Failed to fetch movie videos');
    
    return response.json();
};

// Fetch similar films
export const getSimilarMovies = async (id, page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&page=${page}`);
    if (! response.ok) throw new Error('Failed to fetch similar movies');

    return response.json();
};

// Fetch similar films more specifically by genre (inclusive of first two listed)
// Tighter search used for Watch With page
export const getMoviesByGenre = async (genreIds, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc&vote_count.gte=100&vote_average.gte=6&page=${page}`
    );

    if (! response.ok) throw new Error('Failed to fetch similar movies');

    return response.json();
};