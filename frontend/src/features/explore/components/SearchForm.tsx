import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchFormProps = {
  onSearch: (value: string) => void;
};

export default function SearchForm({ onSearch }: SearchFormProps) {
  return (
    <form
      role="form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchValue = formData.get("search") as string;
        onSearch(searchValue);
      }}
      className="relative group w-full"
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="search"
        type="search"
        placeholder="Search prompts..."
        className="w-full pl-10"
      />
    </form>
  );
}
