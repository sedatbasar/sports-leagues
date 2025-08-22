import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SportFilter } from "../SportFilter";

describe("SportFilter", () => {
  const defaultProps = {
    selectedSport: "all",
    onSportChange: vi.fn(),
    availableSports: ["Soccer", "Basketball", "Motorsport", "Tennis"],
  };

  it("renders with default placeholder when no sport is selected", () => {
    render(<SportFilter {...defaultProps} selectedSport="" />);

    expect(screen.getByText("Filter by sport")).toBeInTheDocument();
  });

  it("displays selected sport value", () => {
    render(<SportFilter {...defaultProps} selectedSport="Soccer" />);

    expect(screen.getByText("Soccer")).toBeInTheDocument();
  });

  it('renders "All Sports" option and available sports', async () => {
    const user = userEvent.setup();
    render(<SportFilter {...defaultProps} />);

    // Click to open dropdown
    await user.click(screen.getByRole("combobox"));

    // Check for "All Sports" option
    expect(
      screen.getByRole("option", { name: "All Sports" })
    ).toBeInTheDocument();

    // Check for all available sports
    expect(screen.getByRole("option", { name: "Soccer" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Basketball" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Motorsport" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Tennis" })).toBeInTheDocument();
  });

  it("calls onSportChange when a sport is selected", async () => {
    const mockOnSportChange = vi.fn();
    const user = userEvent.setup();

    render(<SportFilter {...defaultProps} onSportChange={mockOnSportChange} />);

    // Open dropdown and select Soccer
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Soccer" }));

    expect(mockOnSportChange).toHaveBeenCalledWith("Soccer");
  });

  it('calls onSportChange with "all" when All Sports is selected', async () => {
    const mockOnSportChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SportFilter
        {...defaultProps}
        selectedSport="Soccer"
        onSportChange={mockOnSportChange}
      />
    );

    // Open dropdown and select All Sports
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "All Sports" }));

    expect(mockOnSportChange).toHaveBeenCalledWith("all");
  });

  it("handles empty available sports array", async () => {
    const user = userEvent.setup();
    render(<SportFilter {...defaultProps} availableSports={[]} />);

    await user.click(screen.getByRole("combobox"));

    // Should still show "All Sports" option
    expect(
      screen.getByRole("option", { name: "All Sports" })
    ).toBeInTheDocument();

    // Should not show any other options
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
  });

  it("has correct styling classes", () => {
    render(<SportFilter {...defaultProps} />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveClass("w-48"); // Width styling from component
  });

  it("shows current selection correctly", () => {
    render(<SportFilter {...defaultProps} selectedSport="Basketball" />);

    // The selected value should be displayed
    expect(screen.getByText("Basketball")).toBeInTheDocument();
  });

  it("maintains alphabetical order of sports", async () => {
    const unorderedSports = ["Zebra Sport", "Alpha Sport", "Beta Sport"];
    const user = userEvent.setup();

    render(<SportFilter {...defaultProps} availableSports={unorderedSports} />);

    await user.click(screen.getByRole("combobox"));

    const options = screen.getAllByRole("option");

    // First should be "All Sports"
    expect(options[0]).toHaveTextContent("All Sports");

    // Rest should be in the order provided (component doesn't sort)
    expect(options[1]).toHaveTextContent("Zebra Sport");
    expect(options[2]).toHaveTextContent("Alpha Sport");
    expect(options[3]).toHaveTextContent("Beta Sport");
  });
});
