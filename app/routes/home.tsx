import type { Route } from "./+types/home";
import { LeaguesList } from "~/components/LeaguesList";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Sports Leagues - Sporty Group" },
    {
      name: "description",
      content: "Explore sports leagues from around the world",
    },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LeaguesList />
    </div>
  );
}
