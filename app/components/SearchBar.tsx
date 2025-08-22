import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component for filtering leagues by name
 * Uses debounced input to avoid excessive filtering on every keystroke
 */
export function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search leagues...",
}: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
