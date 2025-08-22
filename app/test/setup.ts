import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch globally for tests
global.fetch = vi.fn();

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: vi.fn(),
}));

// Mock ResizeObserver class
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(
    _callback: (
      entries: ResizeObserverEntry[],
      observer: ResizeObserver
    ) => void
  ) {
    // Callback is not used in tests
  }
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

// Mock PointerCapture APIs for Radix UI components
Object.defineProperty(global.Element.prototype, "hasPointerCapture", {
  value: vi.fn(() => false),
  writable: true,
});

Object.defineProperty(global.Element.prototype, "setPointerCapture", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(global.Element.prototype, "releasePointerCapture", {
  value: vi.fn(),
  writable: true,
});

// Mock scrollIntoView
Object.defineProperty(global.Element.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true,
});

// Mock getBoundingClientRect
Object.defineProperty(global.Element.prototype, "getBoundingClientRect", {
  value: vi.fn(() => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  })),
  writable: true,
});

// Mock getComputedStyle
global.getComputedStyle = vi.fn(() => ({
  getPropertyValue: vi.fn(() => ""),
})) as unknown as typeof getComputedStyle;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
