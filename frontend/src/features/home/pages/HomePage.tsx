import { AppPagination } from "@/components/AppPagination";
import PromptsFeed from "@/features/prompts/components/PromptsFeed";
import { PromptsFeedSkeleton } from "@/features/prompts/components/PromptsFeedSkeleton";
import { usePrompts } from "@/features/prompts/hooks/usePrompts";
export function HomePage() {
  const { prompts, isLoading, page, pages, setPage } = usePrompts({
    limit: 10,
  });

  if (!prompts) {
    return <div>Nothing to show</div>;
  }

  if (isLoading) {
    return <PromptsFeedSkeleton />
  }

  return (
    <div>
      <PromptsFeed prompts={prompts} />
      <AppPagination page={page} totalPages={pages} onPageChange={setPage} />
    </div>
  );
}
