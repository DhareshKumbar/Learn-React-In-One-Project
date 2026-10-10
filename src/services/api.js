const API_KEY = "113d04ae"; // your OMDb API key
const BASE_URL = "https://www.omdbapi.com/";

// Default fetch (OMDb doesn’t have a "popular" endpoint, so we use a keyword)
export const getPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}?s=avengers&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      console.error("Error:", data.Error);
      return [];
    }
  } catch (error) {
    console.error("Network Error:", error);
    return [];
  }
};

// Search by title
export const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
    );
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      console.error("Error:", data.Error);
      return [];
    }
  } catch (error) {
    console.error("Network Error:", error);
    return [];
  }
};
