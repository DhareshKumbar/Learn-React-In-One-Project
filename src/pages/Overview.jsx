import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPopularMovies } from "../services/api";
import html2canvas from "html2canvas";
import "../css/overview.css";

function Overview() {
  const cardRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState(null);
  const { movieId } = useParams();

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        const current_movie = popularMovies.find((movie) => {
          return Number(movie.id) === Number(movieId);
        });
        setMovie(current_movie);

        // If movie found, convert its poster to data URL
        if (current_movie && current_movie.poster_path) {
          convertImageToDataUrl(
            `https://image.tmdb.org/t/p/w500${current_movie.poster_path}`,
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, [movieId]);

  // Function to convert an image URL to a data URL
  const convertImageToDataUrl = (url) => {
    // Create a canvas to draw the image on server-side or use a proxy approach
    const img = new Image();

    // Create a proxy URL if you have one, or use a CORS-enabled proxy service
    // For testing, you could use a service like cors-anywhere (not recommended for production)
    const proxyUrl = url; // Replace with your proxy URL if available

    img.crossOrigin = "anonymous"; // Try with this first
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      try {
        const dataUrl = canvas.toDataURL("image/png");
        setPosterDataUrl(dataUrl);
        console.log("Image converted to data URL successfully");
      } catch (e) {
        console.error("Failed to convert image:", e);
        // Fallback approach - try with a server proxy if available
      }
    };

    img.onerror = (e) => {
      console.error("Error loading image for conversion:", e);
      // You might want to set a placeholder image here
    };

    img.src = proxyUrl;
  };

  const captureCard = async () => {
    if (cardRef.current) {
      try {
        setCapturing(true);

        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: "#121212",
          allowTaint: true,
          useCORS: true,
          scale: window.devicePixelRatio,
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `${movie.title}.png`;
        link.click();
      } catch (err) {
        console.error("Error capturing card:", err);
        alert("Failed to capture card. Please check console for details.");
      } finally {
        setCapturing(false);
      }
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );

  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  return (
    <div className="movie-overview-container">
      <div ref={cardRef} className="movie-overview">
        <div className="movie-photo">
          {posterDataUrl ? (
            // Use the data URL if available
            <img
              src={posterDataUrl}
              alt={movie.title}
              title={movie.title}
              onLoad={() => console.log("Data URL Image Loaded")}
            />
          ) : (
            // Fallback to direct URL if data URL conversion failed
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              title={movie.title}
              onLoad={() => console.log("Original Image Loaded")}
            />
          )}
        </div>
        <div className="overview">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span className="release-date">{movie.release_date}</span>
          </div>
          <div className="movie-stats">
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">
                {movie.vote_average} / 10
                <span className="stat-detail">({movie.vote_count} votes)</span>
              </span>
            </div>
            <div className="stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">
                Popularity: {Math.round(movie.popularity).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="movie-description">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
      {/* <button
        className="download-button"
        onClick={captureCard}
        disabled={capturing}
      >
        {capturing ? "Generating..." : "Download Card"}
      </button> */}
    </div>
  );
}

export default Overview;
