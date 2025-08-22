// Types for the Sports Leagues API
export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
}

// API Response from all_leagues endpoint
export interface AllLeaguesResponse {
  leagues: League[];
}

// Types for Season Badge API
export interface Season {
  idSeason: string;
  strSeason: string;
  strBadge: string;
  idLeague: string;
}

// API Response from search_all_seasons endpoint
export interface SeasonBadgeResponse {
  seasons: Season[];
}

// Filter types for the UI
export interface Filters {
  searchTerm: string;
  sportType: string;
}
