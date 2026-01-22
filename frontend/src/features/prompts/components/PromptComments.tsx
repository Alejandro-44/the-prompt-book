import { useAuth } from "@/features/auth/hooks";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentsList } from "@/features/comments/components/CommentsList";
import { useInfiniteComments } from "@/features/comments/hook/useInfiniteComments";
import { useCreateComment } from "@/features/comments/hook/useCreateComment";
import type { CommentFormValues } from "@/features/comments/schema/comment.schema";
import { PromptCommentsSkeleton } from "./PromptCommentsSkeleton";
import { Button } from "@/components/ui/button";

type PromptCommentsProps = {
  promptId: string;
};

export function PromptComments({ promptId }: PromptCommentsProps) {
  const { user } = useAuth();
  const { comments, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteComments({ promptId });
  const { mutate } = useCreateComment({ promptId });
  const onCommentCreate = (data: CommentFormValues) => {
    mutate(data);
  };

  if (isFetching) {
    return <PromptCommentsSkeleton />;
  }

  return (
    <section className="py-6">
      <h3 className="text-lg font-semibold mb-6">
        Comments ({comments?.length ?? 0})
      </h3>
      {user && <CommentForm user={user} onSubmit={onCommentCreate} />}
      <CommentsList comments={comments ?? []} />
      {hasNextPage && (
        <Button disabled={isFetching} onClick={() => fetchNextPage()}>
          {isFetching ? "Loading..." : "Load more"}
        </Button>
      )}
    </section>
  );
}
