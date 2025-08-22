import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchAllLeagues, fetchSeasonBadges, clearCache } from "../api";
import type { AllLeaguesResponse, SeasonBadgeResponse } from "~/types";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API Service", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Clear API cache before each test
    clearCache();
    // Suppress console.error during tests (expected errors)
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchAllLeagues", () => {
    it("should fetch leagues successfully", async () => {
      const mockResponse: AllLeaguesResponse = {
        leagues: [
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
          },
          {
            idLeague: "2",
            strLeague: "NBA",
            strSport: "Basketball",
            strLeagueAlternate: "National Basketball Association",
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchAllLeagues();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
      );
      expect(result).toEqual(mockResponse.leagues);
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchAllLeagues()).rejects.toThrow(
        "Failed to fetch leagues: 500"
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchAllLeagues()).rejects.toThrow("Network error");
    });

    it("should handle missing leagues in response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await fetchAllLeagues();
      expect(result).toEqual([]);
    });

    it("should cache responses", async () => {
      const mockResponse: AllLeaguesResponse = {
        leagues: [
          {
            idLeague: "1",
            strLeague: "Premier League",
            strSport: "Soccer",
            strLeagueAlternate: "EPL",
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // First call
      const result1 = await fetchAllLeagues();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await fetchAllLeagues();
      expect(mockFetch).toHaveBeenCalledTimes(1); // Still 1, not called again
      expect(result1).toEqual(result2);
    });
  });

  describe("fetchSeasonBadges", () => {
    it("should fetch season badges successfully", async () => {
      const leagueId = "4328";
      const mockResponse: SeasonBadgeResponse = {
        seasons: [
          {
            idSeason: "1",
            strSeason: "2023-24",
            strBadge: "https://example.com/badge1.png",
            idLeague: leagueId,
          },
          {
            idSeason: "2",
            strSeason: "2022-23",
            strBadge: "https://example.com/badge2.png",
            idLeague: leagueId,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await fetchSeasonBadges(leagueId);

      expect(mockFetch).toHaveBeenCalledWith(
        `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=${leagueId}`
      );
      expect(result).toEqual(mockResponse.seasons);
    });

    it("should handle API errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchSeasonBadges("123")).rejects.toThrow(
        "Failed to fetch season badges: 404"
      );
    });

    it("should handle missing seasons in response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await fetchSeasonBadges("123");
      expect(result).toEqual([]);
    });

    it("should cache responses per league ID", async () => {
      const leagueId = "4328";
      const mockResponse: SeasonBadgeResponse = {
        seasons: [
          {
            idSeason: "1",
            strSeason: "2023-24",
            strBadge: "https://example.com/badge.png",
            idLeague: leagueId,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // First call
      const result1 = await fetchSeasonBadges(leagueId);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call with same ID should use cache
      const result2 = await fetchSeasonBadges(leagueId);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);

      // Call with different ID should make new request
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ seasons: [] }),
      });

      await fetchSeasonBadges("9999");
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
