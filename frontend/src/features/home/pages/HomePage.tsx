import { Button } from "@/components/ui/button";
import { PromptsFeed } from "@/features/prompts/components/PromptsFeed";
import { PromptsFeedSkeleton } from "@/features/prompts/components/PromptsFeedSkeleton";
import { useInfinitePrompts } from "@/features/prompts/hooks";

export function HomePage() {
  const { prompts, isFetching, hasNextPage, fetchNextPage } =
    useInfinitePrompts();

  return (
    <div className="grid justify-items-center gap-6">
      {isFetching && <PromptsFeedSkeleton />}
      {!isFetching && prompts && <PromptsFeed prompts={prompts} />}
      {hasNextPage && (
        <Button disabled={isFetching} onClick={() => fetchNextPage()}>
          {isFetching ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}
