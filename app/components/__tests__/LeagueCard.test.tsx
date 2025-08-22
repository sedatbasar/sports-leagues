import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeagueCard } from "../LeagueCard";
import type { League } from "~/types";

describe("LeagueCard", () => {
  const mockLeague: League = {
    idLeague: "4328",
    strLeague: "Premier League",
    strSport: "Soccer",
    strLeagueAlternate: "English Premier League",
  };

  const defaultProps = {
    league: mockLeague,
    onClick: vi.fn(),
  };

  it("renders league information correctly", () => {
    render(<LeagueCard {...defaultProps} />);

    expect(screen.getByText("Premier League")).toBeInTheDocument();
    expect(screen.getByText("Soccer")).toBeInTheDocument();
    expect(screen.getByText("English Premier League")).toBeInTheDocument();
  });

  it("renders without alternative name", () => {
    const leagueWithoutAlternate: League = {
      ...mockLeague,
      strLeagueAlternate: "",
    };

    render(<LeagueCard {...defaultProps} league={leagueWithoutAlternate} />);

    expect(screen.getByText("Premier League")).toBeInTheDocument();
    expect(screen.getByText("Soccer")).toBeInTheDocument();
    expect(
      screen.queryByText("English Premier League")
    ).not.toBeInTheDocument();
  });

  it("calls onClick when card is clicked", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<LeagueCard {...defaultProps} onClick={mockOnClick} />);

    await user.click(screen.getByRole("button"));

    expect(mockOnClick).toHaveBeenCalledWith(mockLeague);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has proper accessibility attributes", () => {
    render(<LeagueCard {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("cursor-pointer");
  });

  it("has hover effects applied", () => {
    render(<LeagueCard {...defaultProps} />);

    const card = screen.getByRole("button");
    expect(card).toHaveClass(
      "hover:shadow-md",
      "hover:bg-muted/50",
      "transition-shadow"
    );
  });

  it("renders sport as a badge", () => {
    render(<LeagueCard {...defaultProps} />);

    const badge = screen.getByText("Soccer");
    expect(badge).toHaveClass("w-fit"); // Badge itself has w-fit class
  });

  it("handles long league names with proper truncation classes", () => {
    const leagueWithLongName: League = {
      ...mockLeague,
      strLeague:
        "This is a very long league name that should be truncated properly",
    };

    render(<LeagueCard {...defaultProps} league={leagueWithLongName} />);

    const title = screen.getByText(leagueWithLongName.strLeague);
    expect(title).toHaveClass("line-clamp-2");
  });

  it("handles long alternative names with proper truncation", () => {
    const leagueWithLongAlternate: League = {
      ...mockLeague,
      strLeagueAlternate:
        "This is a very long alternative league name that should also be truncated properly",
    };

    render(<LeagueCard {...defaultProps} league={leagueWithLongAlternate} />);

    const alternateText = screen.getByText(
      leagueWithLongAlternate.strLeagueAlternate
    );
    expect(alternateText).toHaveClass("line-clamp-2");
  });

  it("maintains proper card structure", () => {
    render(<LeagueCard {...defaultProps} />);

    // Check for card header and content structure
    const title = screen.getByText("Premier League");
    screen.getByText("Soccer"); // Verify sport is displayed
    const alternate = screen.getByText("English Premier League");

    // Title should be in header
    expect(title.closest('[class*="pb-3"]')).toBeInTheDocument(); // CardHeader with pb-3

    // Alternative text should be in content with pt-0
    expect(alternate.closest('[class*="pt-0"]')).toBeInTheDocument();
  });

  it("handles keyboard interactions", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<LeagueCard {...defaultProps} onClick={mockOnClick} />);

    const card = screen.getByRole("button");
    await user.type(card, "{enter}");

    expect(mockOnClick).toHaveBeenCalledWith(mockLeague);
  });

  it("handles different league data shapes", () => {
    const minimalLeague: League = {
      idLeague: "1",
      strLeague: "Test League",
      strSport: "Test Sport",
      strLeagueAlternate: "",
    };

    render(<LeagueCard league={minimalLeague} onClick={vi.fn()} />);

    expect(screen.getByText("Test League")).toBeInTheDocument();
    expect(screen.getByText("Test Sport")).toBeInTheDocument();
  });
});
