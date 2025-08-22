import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SeasonBadgeImage } from "../SeasonBadgeImage";

describe("SeasonBadgeImage", () => {
  const defaultProps = {
    src: "https://example.com/badge.png",
    alt: "Season badge",
  };

  it("shows loading state initially", () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    // Should show loading spinner
    expect(screen.getByRole("img")).toHaveClass("opacity-0");

    // Should show loading animation
    const loadingDiv = screen
      .getByRole("img")
      .closest("div")
      ?.querySelector('[class*="animate-spin"]');
    expect(loadingDiv).toBeInTheDocument();
  });

  it("shows image when loaded successfully", async () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    const img = screen.getByRole("img");

    // Simulate image load
    fireEvent.load(img);

    await waitFor(() => {
      expect(img).toHaveClass("opacity-100");
      expect(img).not.toHaveClass("opacity-0");
    });

    // Loading animation should be gone
    expect(
      screen
        .queryByRole("img")
        ?.closest("div")
        ?.querySelector('[class*="animate-spin"]')
    ).not.toBeInTheDocument();
  });

  it("shows error state when image fails to load", async () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    const img = screen.getByRole("img");

    // Simulate image error
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText("Badge not available")).toBeInTheDocument();
    });

    // Image should not be visible
    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    // Loading animation should be gone
    const container = screen
      .getByText("Badge not available")
      .closest("div")?.parentElement;
    expect(
      container?.querySelector('[class*="animate-spin"]')
    ).not.toBeInTheDocument();
  });

  it("applies custom className correctly", () => {
    const customClass = "custom-test-class";
    render(<SeasonBadgeImage {...defaultProps} className={customClass} />);

    const container = screen.getByRole("img").closest("div");
    expect(container).toHaveClass(customClass);
  });

  it("has correct default styling", () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    const img = screen.getByRole("img");
    expect(img).toHaveClass(
      "w-full",
      "h-32",
      "object-contain",
      "mx-auto",
      "rounded",
      "transition-opacity",
      "duration-200"
    );
  });

  it("has proper alt text", () => {
    const altText = "Premier League 2023-24 badge";
    render(<SeasonBadgeImage {...defaultProps} alt={altText} />);

    expect(screen.getByAltText(altText)).toBeInTheDocument();
  });

  it("loads with correct src attribute", () => {
    const src = "https://example.com/test-badge.png";
    render(<SeasonBadgeImage {...defaultProps} src={src} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", src);
  });

  it("shows loading animation with correct styling", () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    const loadingContainer = screen
      .getByRole("img")
      .closest("div")
      ?.querySelector('[class*="animate-pulse"]');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveClass(
      "w-full",
      "h-32",
      "bg-muted/50",
      "rounded",
      "animate-pulse"
    );

    const spinner = loadingContainer?.querySelector('[class*="animate-spin"]');
    expect(spinner).toHaveClass(
      "animate-spin",
      "rounded-full",
      "h-6",
      "w-6",
      "border-b-2",
      "border-primary"
    );
  });

  it("error state has correct styling", async () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    const img = screen.getByRole("img");
    fireEvent.error(img);

    await waitFor(() => {
      const errorContainer = screen.getByText("Badge not available")
        .parentElement?.parentElement;
      expect(errorContainer).toHaveClass(
        "w-full",
        "h-32",
        "flex",
        "items-center",
        "justify-center",
        "text-muted-foreground",
        "bg-muted/30",
        "rounded"
      );
    });
  });

  it("handles multiple state transitions correctly", async () => {
    const { rerender } = render(<SeasonBadgeImage {...defaultProps} />);

    // Initial loading state
    expect(screen.getByRole("img")).toHaveClass("opacity-0");

    // Simulate successful load
    fireEvent.load(screen.getByRole("img"));

    await waitFor(() => {
      expect(screen.getByRole("img")).toHaveClass("opacity-100");
    });

    // Change src to trigger new loading state (component will reset to loading)
    rerender(
      <SeasonBadgeImage
        src="https://example.com/new-badge.png"
        alt="New badge"
      />
    );

    // New image should start in loading state
    expect(screen.getByRole("img")).toHaveClass("opacity-0");
  });

  it("maintains aspect ratio with object-contain", () => {
    render(<SeasonBadgeImage {...defaultProps} />);

    const img = screen.getByRole("img");
    expect(img).toHaveClass("object-contain");
    expect(img).toHaveClass("h-32"); // Fixed height
    expect(img).toHaveClass("w-full"); // Full width of container
  });
});
