import SearchBar from "../../ui/searchbar/SearchBar";
import Button from "../../ui/button/Button";

type ToolbarProps = {
  search: string;
  onSearch: (value: string) => void;

  placeholder?: string;

  actionText?: string;
  onAction?: () => void;
};

function Toolbar({
  search,
  onSearch,
  placeholder = "Search...",
  actionText,
  onAction,
}: ToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="w-full md:max-w-md">
        <SearchBar
          value={search}
          onChange={onSearch}
          placeholder={placeholder}
        />
      </div>

      {actionText && onAction && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}

    </div>
  );
}

export default Toolbar;