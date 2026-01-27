import { AppPagination } from "@/components/AppPagination";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { usePrompts } from "@/features/prompts/hooks";
import { useSearchParams } from "react-router";
import SearchForm from "../components/SearchForm";
import { Frown } from "lucide-react";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const { prompts, page, pages, setPage } = usePrompts({ search, limit: 12 });
  return (
    <div className="container max-w-6xl grid gap-2">
      <section className="my-6">
        <div className="max-w-2xl mx-auto">
          <SearchForm onSearch={(value: string) => {
            setSearchParams({ search: value})
          }} />
        </div>
      </section>

      {prompts.length === 0 && (
        <div className="py-16 text-center animate-fade-in">
          <div className="mx-auto size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Frown className="size-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            No prompts found
          </h3>
        </div>
      )}
      {prompts.length > 0 && (
        <>
          <PromptsGrid prompts={prompts} itemsLimit={12} />
          <AppPagination page={page!} totalPages={pages!} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
