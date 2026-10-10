import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MovieProvider, useMovieContext } from "../MovieContext";

function TestConsumer() {
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } =
    useMovieContext();

  return (
    <div>
      <span data-testid="count">{favorites.length}</span>
      <span data-testid="is-fav-1">{String(isFavorite(1))}</span>
      <button
        onClick={() => addToFavorites({ id: 1, title: "Test Movie" })}
      >
        Add
      </button>
      <button onClick={() => removeFromFavorites(1)}>Remove</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <MovieProvider>
      <TestConsumer />
    </MovieProvider>
  );
}

describe("MovieContext", () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("provides default empty favorites", () => {
    renderWithProvider();
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("loads favorites from localStorage on mount", () => {
    Storage.prototype.getItem.mockReturnValue(
      JSON.stringify([{ id: 1, title: "Saved Movie" }])
    );
    renderWithProvider();
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("addToFavorites adds movie and persists to localStorage", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add"));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      "favorites",
      expect.stringContaining("Test Movie")
    );
  });

  it("removeFromFavorites removes movie by id", async () => {
    Storage.prototype.getItem.mockReturnValue(
      JSON.stringify([{ id: 1, title: "Test Movie" }])
    );
    const user = userEvent.setup();
    renderWithProvider();

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    await user.click(screen.getByText("Remove"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("isFavorite returns false for non-existent movie", () => {
    renderWithProvider();
    expect(screen.getByTestId("is-fav-1")).toHaveTextContent("false");
  });

  it("isFavorite returns true for existing favorite", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Add"));
    expect(screen.getByTestId("is-fav-1")).toHaveTextContent("true");
  });
});
