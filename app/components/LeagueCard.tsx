import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { League } from "~/types";

interface LeagueCardProps {
  league: League;
  onClick: (league: League) => void;
}

/**
 * LeagueCard component displays individual league information
 * Handles click events to trigger season badge lookup
 */
export function LeagueCard({ league, onClick }: LeagueCardProps) {
  const handleClick = () => {
    onClick(league);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-muted/50"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {league.strLeague}
        </CardTitle>
        <Badge variant="secondary" className="w-fit">
          {league.strSport}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        {league.strLeagueAlternate && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {league.strLeagueAlternate}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
