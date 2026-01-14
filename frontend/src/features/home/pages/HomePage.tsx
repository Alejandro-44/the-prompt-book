import { AppPagination } from "@/components/AppPagination";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { usePrompts } from "@/features/prompts/hooks/usePrompts";
export function HomePage() {
  const { prompts, isLoading, error, page, pages, setPage } = usePrompts({
    limit: 12,
  });

  if (!prompts) {
    return <div>Nothing to show</div>;
  }

  return (
    <div>
      <PromptsGrid prompts={prompts} />
      <AppPagination page={page!} totalPages={pages!} onPageChange={setPage} />
    </div>
  );
}
