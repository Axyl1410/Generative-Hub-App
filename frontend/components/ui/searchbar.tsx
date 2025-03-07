import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type SearchBarProps = {
  className?: string;
  [key: string]: unknown;
};

const SearchBar: React.FC<SearchBarProps> = ({ className, ...props }) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="text"
        id="search"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;
