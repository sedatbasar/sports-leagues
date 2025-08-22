import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "~/components/SearchBar";
import { SportFilter } from "~/components/SportFilter";
import { LeagueCard } from "~/components/LeagueCard";
import { SeasonBadgeModal } from "~/components/SeasonBadgeModal";
import { fetchAllLeagues } from "~/services/api";
import type { League, Filters } from "~/types";

/**
 * LeaguesList is the main component that manages the application state
 * Handles league data fetching, filtering, and modal interactions
 */
export function LeaguesList() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    sportType: "all",
  });
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch leagues data on component mount
  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const leaguesData = await fetchAllLeagues();
        setLeagues(leaguesData);
      } catch (err) {
        setError(
          "Failed to load leagues. Please refresh the page to try again."
        );
        // eslint-disable-next-line no-console
        console.error("Error loading leagues:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeagues();
  }, []);

  // Get unique sports for the filter dropdown
  const availableSports = useMemo(() => {
    const sports = Array.from(new Set(leagues.map(league => league.strSport)))
      .filter(Boolean)
      .sort();
    return sports;
  }, [leagues]);

  // Filter leagues based on search term and sport type
  const filteredLeagues = useMemo(() => {
    return leagues.filter(league => {
      const matchesSearch =
        !filters.searchTerm ||
        league.strLeague
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        (league.strLeagueAlternate &&
          league.strLeagueAlternate
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()));

      const matchesSport =
        filters.sportType === "all" || league.strSport === filters.sportType;

      return matchesSearch && matchesSport;
    });
  }, [leagues, filters]);

  // Handle search input changes
  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  // Handle sport filter changes
  const handleSportChange = (sportType: string) => {
    setFilters(prev => ({ ...prev, sportType }));
  };

  // Handle league card clicks
  const handleLeagueClick = (league: League) => {
    setSelectedLeague(league);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLeague(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Loading sports leagues...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
        <div className="text-muted-foreground">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sports Leagues</h1>
        <p className="text-muted-foreground">
          Explore sports leagues from around the world
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar
          searchTerm={filters.searchTerm}
          onSearchChange={handleSearchChange}
          placeholder="Search leagues..."
        />
        <SportFilter
          selectedSport={filters.sportType}
          onSportChange={handleSportChange}
          availableSports={availableSports}
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLeagues.length} of {leagues.length} leagues
      </div>

      {/* Leagues grid */}
      {filteredLeagues.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLeagues.map(league => (
            <LeagueCard
              key={league.idLeague}
              league={league}
              onClick={handleLeagueClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            No leagues found matching your criteria.
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filter settings.
          </div>
        </div>
      )}

      {/* Season Badge Modal */}
      <SeasonBadgeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        league={selectedLeague}
      />
    </div>
  );
}
