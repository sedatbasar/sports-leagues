import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaguesList } from "../LeaguesList";
import * as apiService from "~/services/api";
import type { League } from "~/types";

// Mock the API service
vi.mock("~/services/api");

describe("LeaguesList", () => {
  const mockLeagues: League[] = [
    {
      idLeague: "1",
      strLeague: "Premier League",
      strSport: "Soccer",
      strLeagueAlternate: "English Premier League",
    },
    {
      idLeague: "2",
      strLeague: "NBA",
      strSport: "Basketball",
      strLeagueAlternate: "National Basketball Association",
    },
    {
      idLeague: "3",
      strLeague: "La Liga",
      strSport: "Soccer",
      strLeagueAlternate: "Spanish La Liga",
    },
    {
      idLeague: "4",
      strLeague: "Formula 1",
      strSport: "Motorsport",
      strLeagueAlternate: "F1",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiService.fetchAllLeagues).mockResolvedValue(mockLeagues);
    vi.mocked(apiService.fetchSeasonBadges).mockResolvedValue([]);
    // Suppress console.error during tests (expected errors)
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    render(<LeaguesList />);

    expect(screen.getByText("Loading sports leagues...")).toBeInTheDocument();
  });

  it("displays leagues after successful load", async () => {
    render(<LeaguesList />);

    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
      expect(screen.getByText("NBA")).toBeInTheDocument();
      expect(screen.getByText("La Liga")).toBeInTheDocument();
      expect(screen.getByText("Formula 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Showing 4 of 4 leagues")).toBeInTheDocument();
  });

  it("displays error message when API fails", async () => {
    vi.mocked(apiService.fetchAllLeagues).mockRejectedValue(
      new Error("API Error")
    );

    render(<LeaguesList />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Failed to load leagues. Please refresh the page to try again."
        )
      ).toBeInTheDocument();
    });
  });

  it("filters leagues by search term", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Search for "NBA"
    const searchInput = screen.getByPlaceholderText("Search leagues...");
    await user.type(searchInput, "NBA");

    // Should only show NBA
    expect(screen.getByText("NBA")).toBeInTheDocument();
    expect(screen.queryByText("Premier League")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 4 leagues")).toBeInTheDocument();
  });

  it("filters leagues by sport type", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Filter by Soccer
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Soccer" }));

    // Should show only Soccer leagues
    expect(screen.getByText("Premier League")).toBeInTheDocument();
    expect(screen.getByText("La Liga")).toBeInTheDocument();
    expect(screen.queryByText("NBA")).not.toBeInTheDocument();
    expect(screen.queryByText("Formula 1")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 4 leagues")).toBeInTheDocument();
  });

  it("combines search and sport filters", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Filter by Soccer
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Soccer" }));

    // Then search for "Liga"
    const searchInput = screen.getByPlaceholderText("Search leagues...");
    await user.type(searchInput, "Liga");

    // Should only show La Liga
    expect(screen.getByText("La Liga")).toBeInTheDocument();
    expect(screen.queryByText("Premier League")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 4 leagues")).toBeInTheDocument();
  });

  it("shows no results message when filters match nothing", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText("Search leagues...");
    await user.type(searchInput, "Nonexistent League");

    expect(
      screen.getByText("No leagues found matching your criteria.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search or filter settings.")
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 0 of 4 leagues")).toBeInTheDocument();
  });

  it("generates available sports correctly", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Open sport filter dropdown
    await user.click(screen.getByRole("combobox"));

    // Should show unique sports
    expect(screen.getByRole("option", { name: "Soccer" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Basketball" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Motorsport" })
    ).toBeInTheDocument();
  });

  it("opens season badge modal when league is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(apiService.fetchSeasonBadges).mockResolvedValue([
      {
        idSeason: "1",
        strSeason: "2023-24",
        strBadge: "https://example.com/badge.png",
        idLeague: "1",
      },
    ]);

    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Click on Premier League card
    await user.click(screen.getByText("Premier League"));

    // Modal should open
    await waitFor(() => {
      expect(
        screen.getByText("Premier League - Season Badges")
      ).toBeInTheDocument();
    });

    expect(apiService.fetchSeasonBadges).toHaveBeenCalledWith("1");
  });

  it("searches in alternative league names", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Search for part of alternative name
    const searchInput = screen.getByPlaceholderText("Search leagues...");
    await user.type(searchInput, "English");

    // Should find Premier League by its alternative name
    expect(screen.getByText("Premier League")).toBeInTheDocument();
    expect(screen.queryByText("NBA")).not.toBeInTheDocument();
  });

  it("handles case-insensitive search", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Search with different case
    const searchInput = screen.getByPlaceholderText("Search leagues...");
    await user.type(searchInput, "premier");

    expect(screen.getByText("Premier League")).toBeInTheDocument();
  });

  it("resets to all sports filter", async () => {
    const user = userEvent.setup();
    render(<LeaguesList />);

    // Wait for leagues to load
    await waitFor(() => {
      expect(screen.getByText("Premier League")).toBeInTheDocument();
    });

    // Filter by Soccer first
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Soccer" }));

    expect(screen.getByText("Showing 2 of 4 leagues")).toBeInTheDocument();

    // Reset to All Sports
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "All Sports" }));

    expect(screen.getByText("Showing 4 of 4 leagues")).toBeInTheDocument();
  });

  it("displays proper header and description", async () => {
    render(<LeaguesList />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Sports Leagues")).toBeInTheDocument();
    });

    expect(screen.getByText("Sports Leagues")).toBeInTheDocument();
    expect(
      screen.getByText("Explore sports leagues from around the world")
    ).toBeInTheDocument();
  });
});
