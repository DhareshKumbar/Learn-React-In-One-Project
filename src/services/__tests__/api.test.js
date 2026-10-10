import { getPopularMovies, searchMovies } from "../api";

describe("API Service", () => {
  const mockResults = [
    { id: 1, title: "Movie 1" },
    { id: 2, title: "Movie 2" },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ results: mockResults }),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getPopularMovies", () => {
    it("returns results on success", async () => {
      const result = await getPopularMovies();
      expect(result).toEqual(mockResults);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/movie/popular")
      );
    });

    it("propagates fetch errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));
      await expect(getPopularMovies()).rejects.toThrow("Network error");
    });
  });

  describe("searchMovies", () => {
    it("passes query and returns results", async () => {
      const result = await searchMovies("batman");
      expect(result).toEqual(mockResults);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("query=batman")
      );
    });

    it("encodes special characters in query", async () => {
      await searchMovies("the dark knight & more");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("query=the%20dark%20knight%20%26%20more")
      );
    });

    it("propagates fetch errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Search failed"));
      await expect(searchMovies("test")).rejects.toThrow("Search failed");
    });
  });
});
