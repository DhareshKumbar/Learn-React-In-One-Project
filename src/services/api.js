const API_KEY = "f757dc85";
const BASE_URL = "https://www.omdbapi.com/";

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/api_key=${API_KEY}&s==${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};
