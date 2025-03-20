import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import NavBar from "./components/NavBar";
import Overview from "./pages/Overview";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <MovieProvider>
      <ThemeProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="/movie-overview/:movieId/:movieTitle"
              element={<Overview />}
            />
          </Routes>
        </main>
      </ThemeProvider>
    </MovieProvider>
  );
}

export default App;
