import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieCard from "../MovieCard";
import { useMovieContext } from "../../contexts/MovieContext";

jest.mock("../../contexts/MovieContext", () => ({
  useMovieContext: jest.fn(),
}));

const mockMovie = {
  id: 1,
  title: "Test Movie",
  release_date: "2024-06-15",
  poster_path: "/test-poster.jpg",
};

const defaultContext = {
  isFavorite: jest.fn(() => false),
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
};

function renderMovieCard(movie = mockMovie, contextOverrides = {}) {
  useMovieContext.mockReturnValue({ ...defaultContext, ...contextOverrides });
  return render(<MovieCard movie={movie} />);
}

describe("MovieCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders movie title and release year", () => {
    renderMovieCard();
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders poster image with correct src and alt", () => {
    renderMovieCard();
    const img = screen.getByAltText("Test Movie");
    expect(img).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/test-poster.jpg"
    );
  });

  it("handles missing release_date gracefully", () => {
    renderMovieCard({ ...mockMovie, release_date: undefined });
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("shows 'active' class on favorite button when favorited", () => {
    renderMovieCard(mockMovie, { isFavorite: jest.fn(() => true) });
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("active");
  });

  it("has no 'active' class when not favorited", () => {
    renderMovieCard();
    const btn = screen.getByRole("button");
    expect(btn).not.toHaveClass("active");
  });

  it("calls addToFavorites when clicking heart on non-favorite", async () => {
    const addToFavorites = jest.fn();
    renderMovieCard(mockMovie, { addToFavorites });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));
    expect(addToFavorites).toHaveBeenCalledWith(mockMovie);
  });

  it("calls removeFromFavorites when clicking heart on favorite", async () => {
    const removeFromFavorites = jest.fn();
    renderMovieCard(mockMovie, {
      isFavorite: jest.fn(() => true),
      removeFromFavorites,
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button"));
    expect(removeFromFavorites).toHaveBeenCalledWith(mockMovie.id);
  });
});
