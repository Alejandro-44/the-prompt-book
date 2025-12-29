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
    <Card sx={{ maxWidth: "md", mx: "auto", mt: 4 }} component="section">
      <CardContent sx={{ p: 3 }}>
        <Grid container>
          <Grid size={12}>
            <Typography component="h2" variant="h6" fontWeight={600}>
              Comments
            </Typography>
          </Grid>
          {user && (
            <Grid sx={{ my: 2 }} size={12}>
              <CommentForm user={user} onSubmit={onCommentCreate} />
            </Grid>
          )}
          <Grid size={12}>
            <CommentsList comments={comments || []} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
