import React from "react";
import NavBar from "../components/NavBar";
import MovieCard from "../components/MovieCard";
function Overview() {
  return (
    <div>
      <NavBar />
      <div className="movie-overview">
        <MovieCard />
        <div className="overview">
          <p>lorem ipsum delor, asit at mus sitant</p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
