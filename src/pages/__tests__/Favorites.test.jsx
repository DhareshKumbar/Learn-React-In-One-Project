import { render, screen } from "@testing-library/react";
import Favorites from "../Favorites";
import { useMovieContext } from "../../contexts/MovieContext";

jest.mock("../../contexts/MovieContext", () => ({
  useMovieContext: jest.fn(),
}));

jest.mock("../../components/MovieCard", () => {
  return function MockMovieCard({ movie }) {
    return <div data-testid="movie-card">{movie.title}</div>;
  };
});

const mockFavorites = [
  { id: 1, title: "Favorite 1" },
  { id: 2, title: "Favorite 2" },
];

describe("Favorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 'Your Favorites' heading with non-empty favorites", () => {
    useMovieContext.mockReturnValue({ favorites: mockFavorites });
    render(<Favorites />);
    expect(screen.getByText("Your Favorites")).toBeInTheDocument();
  });

  it("renders a MovieCard per favorite", () => {
    useMovieContext.mockReturnValue({ favorites: mockFavorites });
    render(<Favorites />);
    expect(screen.getAllByTestId("movie-card")).toHaveLength(2);
  });

  it("with empty array still shows 'Your Favorites' (truthiness bug)", () => {
    useMovieContext.mockReturnValue({ favorites: [] });
    render(<Favorites />);
    // BUG: `if (favorites)` is always truthy — empty array [] is truthy in JS
    // So the empty state message "No Favorite Movies Yet" is unreachable
    expect(screen.getByText("Your Favorites")).toBeInTheDocument();
    expect(
      screen.queryByText("No Favorite Movies Yet")
    ).not.toBeInTheDocument();
  });

  it("with null favorites shows empty state message", () => {
    useMovieContext.mockReturnValue({ favorites: null });
    render(<Favorites />);
    expect(screen.getByText("No Favorite Movies Yet")).toBeInTheDocument();
  });
});
