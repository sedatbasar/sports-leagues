import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SportFilterProps {
  selectedSport: string;
  onSportChange: (value: string) => void;
  availableSports: string[];
}

/**
 * SportFilter component for filtering leagues by sport type
 * Dynamically generates sport options based on available data
 */
export function SportFilter({
  selectedSport,
  onSportChange,
  availableSports,
}: SportFilterProps) {
  return (
    <Select value={selectedSport} onValueChange={onSportChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by sport" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Sports</SelectItem>
        {availableSports.map(sport => (
          <SelectItem key={sport} value={sport}>
            {sport}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
