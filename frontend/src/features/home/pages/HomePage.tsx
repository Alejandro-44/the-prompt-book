import { AppPagination } from "@/components/AppPagination";
import PromptsFeed from "@/features/prompts/components/PromptsFeed";
import { usePrompts } from "@/features/prompts/hooks/usePrompts";
export function HomePage() {
  const { prompts, isLoading, error, page, pages, setPage } = usePrompts({
    limit: 10,
  });

  if (!prompts) {
    return <div>Nothing to show</div>;
  }

  return (
    <div>
      <PromptsFeed prompts={prompts} />
      <AppPagination page={page!} totalPages={pages!} onPageChange={setPage} />
    </div>
  );
}
