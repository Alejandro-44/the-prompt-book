import { useAuth } from "@/features/auth/hooks";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentsList } from "@/features/comments/components/CommentsList";
import { useComments } from "@/features/comments/hook/useComments";
import { useCreateComment } from "@/features/comments/hook/useCreateComment";
import type { CommentFormValues } from "@/features/comments/schema/comment.schema";

type PromptCommentsProps = {
  promptId: string;
};

export function PromptComments({ promptId }: PromptCommentsProps) {
  const { user } = useAuth();
  const { comments } = useComments({ promptId });
  const { mutate } = useCreateComment({ promptId });
  const onCommentCreate = (data: CommentFormValues) => {
    mutate(data);
  };

  return (
    <section className="py-6">
      <h3 className="text-lg font-semibold mb-6">
        Comentarios ({comments?.length ?? 0})
      </h3>
      { user && <CommentForm user={user}  onSubmit={onCommentCreate} />}
      <CommentsList comments={comments ?? []} />
    </section>
  );
}
