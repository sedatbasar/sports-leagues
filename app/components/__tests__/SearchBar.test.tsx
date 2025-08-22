import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  const defaultProps = {
    searchTerm: "",
    onSearchChange: vi.fn(),
  };

  it("renders with default placeholder", () => {
    render(<SearchBar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search leagues...")
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<SearchBar {...defaultProps} placeholder="Custom placeholder" />);

    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  it("displays the current search term", () => {
    render(<SearchBar {...defaultProps} searchTerm="Premier League" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Premier League");
  });

  it("calls onSearchChange when user types", async () => {
    const mockOnSearchChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar {...defaultProps} onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Test");

    // Each character typed should call the change handler
    expect(mockOnSearchChange).toHaveBeenCalled();
    expect(mockOnSearchChange).toHaveBeenCalledTimes(4); // T, e, s, t
  });

  it("calls onSearchChange when input is cleared", async () => {
    const mockOnSearchChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar searchTerm="Test" onSearchChange={mockOnSearchChange} />);

    const input = screen.getByRole("textbox");
    await user.clear(input);

    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });

  it("renders search icon", () => {
    render(<SearchBar {...defaultProps} />);

    // Check for the search icon (lucide-react Search component)
    const searchIcon = screen
      .getByRole("textbox")
      .parentElement?.querySelector("svg");
    expect(searchIcon).toBeInTheDocument();
  });

  it("has correct CSS classes for styling", () => {
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("pl-10"); // Left padding for search icon

    const container = input.closest("div");
    expect(container).toHaveClass("relative", "flex-1", "max-w-sm");
  });

  it("maintains focus when typing", async () => {
    const user = userEvent.setup();

    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox");
    await user.click(input);

    expect(input).toHaveFocus();

    await user.type(input, "Soccer");
    expect(input).toHaveFocus();
  });
});
