import { useAuth } from "@/features/auth/hooks";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentsList } from "@/features/comments/components/CommentsList";
import { useComments } from "@/features/comments/hook/useComments";
import { useCreateComment } from "@/features/comments/hook/useCreateComment";
import type { CommentFormValues } from "@/features/comments/schema/comment.schema";
import { Card, CardContent, Grid, Typography } from "@mui/material";

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
    <section className="space-y-6">
      <h3 className="text-lg font-semibold">
        Comentarios ({comments?.length ?? 0})
      </h3>
      <CommentsList comments={comments ?? []} />
    </section>
  );
}
