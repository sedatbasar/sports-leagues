import type {
  AllLeaguesResponse,
  SeasonBadgeResponse,
  League,
  Season,
} from "~/types";

// Simple in-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Export cache clearing function for testing
export function clearCache() {
  cache.clear();
}

// Generic cache helper function
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch all sports leagues from TheSportsDB API
 * Implements caching to avoid repeated API calls
 */
export async function fetchAllLeagues(): Promise<League[]> {
  const cacheKey = "all_leagues";

  // Check cache first
  const cachedData = getCachedData<League[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch leagues: ${response.status}`);
    }

    const data: AllLeaguesResponse = await response.json();
    const leagues = data.leagues || [];

    // Cache the result
    setCachedData(cacheKey, leagues);

    return leagues;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching leagues:", error);
    throw error;
  }
}

/**
 * Fetch season badges for a specific league
 * Implements caching to avoid repeated API calls
 */
export async function fetchSeasonBadges(leagueId: string): Promise<Season[]> {
  const cacheKey = `season_badges_${leagueId}`;

  // Check cache first
  const cachedData = getCachedData<Season[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=${leagueId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch season badges: ${response.status}`);
    }

    const data: SeasonBadgeResponse = await response.json();
    const seasons = data.seasons || [];

    // Cache the result
    setCachedData(cacheKey, seasons);

    return seasons;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching season badges:", error);
    throw error;
  }
}
