import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../Home";
import { getPopularMovies, searchMovies } from "../../services/api";

jest.mock("../../services/api");

jest.mock("../../components/MovieCard", () => {
  return function MockMovieCard({ movie }) {
    return <div data-testid="movie-card">{movie.title}</div>;
  };
});

const mockMovies = [
  { id: 1, title: "Popular Movie 1" },
  { id: 2, title: "Popular Movie 2" },
];

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading indicator initially", () => {
    getPopularMovies.mockReturnValue(new Promise(() => {})); // never resolves
    render(<Home />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("loads and displays popular movies on mount", async () => {
    getPopularMovies.mockResolvedValue(mockMovies);
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByTestId("movie-card")).toHaveLength(2);
    });
    expect(screen.getByText("Popular Movie 1")).toBeInTheDocument();
  });

  it("shows error message when loading fails", async () => {
    getPopularMovies.mockRejectedValue(new Error("API error"));
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load movies...")).toBeInTheDocument();
    });
  });

  it("renders search form", async () => {
    getPopularMovies.mockResolvedValue(mockMovies);
    render(<Home />);

    expect(
      screen.getByPlaceholderText("Search for movies...")
    ).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("search updates movies with results", async () => {
    getPopularMovies.mockResolvedValue(mockMovies);
    const searchResults = [{ id: 3, title: "Search Result" }];
    searchMovies.mockResolvedValue(searchResults);

    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByTestId("movie-card")).toHaveLength(2);
    });

    await user.type(
      screen.getByPlaceholderText("Search for movies..."),
      "batman"
    );
    await user.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.getByText("Search Result")).toBeInTheDocument();
    });
    expect(searchMovies).toHaveBeenCalledWith("batman");
  });

  it("does not search when query is empty", async () => {
    getPopularMovies.mockResolvedValue(mockMovies);
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByTestId("movie-card")).toHaveLength(2);
    });

    await user.click(screen.getByText("Search"));
    expect(searchMovies).not.toHaveBeenCalled();
  });

  it("shows error when search fails", async () => {
    getPopularMovies.mockResolvedValue(mockMovies);
    searchMovies.mockRejectedValue(new Error("Search error"));

    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getAllByTestId("movie-card")).toHaveLength(2);
    });

    await user.type(
      screen.getByPlaceholderText("Search for movies..."),
      "test"
    );
    await user.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to search movies...")
      ).toBeInTheDocument();
    });
  });
});
