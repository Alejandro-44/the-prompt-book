import { AppPagination } from "@/components/AppPagination";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { usePrompts } from "@/features/prompts/hooks";
import { useSearchParams } from "react-router";
import SearchForm from "../components/SearchForm";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const { prompts, page, pages, setPage } = usePrompts({ search, limit: 12 });
  return (
    <div className="container max-w-6xl grid gap-2">
      <div>
        <SearchForm onSearch={(value: string) => {
          setSearchParams({ search: value})
        }} />
      </div>
      <PromptsGrid prompts={prompts} itemsLimit={12} />
      <AppPagination page={page!} totalPages={pages!} onPageChange={setPage} />
    </div>
  );
}
