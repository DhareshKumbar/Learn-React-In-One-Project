const API_KEY = import.meta.env.VITE_API_KEY; // https://www.themoviedb.org/settings/api
const BASE_URL = "https://api.themoviedb.org/3";
const REGION = "US";

export const getPopularMovies = async () => {
    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&region=${REGION}&primary_release_year=2025`,
        // `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
    );
    const data = await response.json();
    console.log("Popular Movies Data:", data.results); // Log the data here
    return data.results;
};

export const searchMovies = async (query) => {
    if (!query.trim()) return [];
    const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            query,
        )}`,
    );
    const data = await response.json();
    return data.results;
};
