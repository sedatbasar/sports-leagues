import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { SeasonBadgeImage } from "~/components/SeasonBadgeImage";
import { fetchSeasonBadges } from "~/services/api";
import type { League, Season } from "~/types";

interface SeasonBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  league: League | null;
}

/**
 * SeasonBadgeModal component displays season badge information
 * Fetches and displays season badges for the selected league
 */
export function SeasonBadgeModal({
  isOpen,
  onClose,
  league,
}: SeasonBadgeModalProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!league || !isOpen) return;

    const loadSeasonBadges = async () => {
      setLoading(true);
      setError(null);

      try {
        const seasonData = await fetchSeasonBadges(league.idLeague);
        setSeasons(seasonData);
      } catch (err) {
        setError("Failed to load season badges. Please try again.");
        // eslint-disable-next-line no-console
        console.error("Error loading season badges:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSeasonBadges();
  }, [league, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setSeasons([]);
      setError(null);
    }
  };

  if (!league) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {league.strLeague} - Season Badges
          </DialogTitle>
          <Badge variant="outline" className="w-fit">
            {league.strSport}
          </Badge>
        </DialogHeader>

        <div className="mt-4 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading season badges...</span>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-center py-8">{error}</div>
          )}

          {!loading && !error && seasons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No season badges found for this league.
            </div>
          )}

          {!loading && !error && seasons.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {seasons.map(season => (
                <div key={season.idSeason} className="text-center">
                  <div className="bg-muted rounded-lg p-4 mb-2">
                    {season.strBadge ? (
                      <SeasonBadgeImage
                        src={season.strBadge}
                        alt={`${season.strSeason} badge`}
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center text-muted-foreground">
                        No badge available
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium">{season.strSeason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
