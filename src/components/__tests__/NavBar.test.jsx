import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../NavBar";

function renderNavBar() {
  return render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
}

describe("NavBar", () => {
  it("renders brand link 'Movie App'", () => {
    renderNavBar();
    expect(screen.getByText("Movie App")).toBeInTheDocument();
  });

  it("renders Home link with href '/'", () => {
    renderNavBar();
    const homeLink = screen.getByText("Home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders Favorites link with href '/favorites'", () => {
    renderNavBar();
    const favLink = screen.getByText("Favorites");
    expect(favLink).toBeInTheDocument();
    expect(favLink.closest("a")).toHaveAttribute("href", "/favorites");
  });
});
