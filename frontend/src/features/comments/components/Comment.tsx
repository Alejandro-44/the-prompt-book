import type { PromptComment } from "@/services";
import {
  Avatar,
  Card,
  CardContent,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

type CommentProps = {
  comment: PromptComment;
};

export function Comment({ comment }: CommentProps) {
  return (
    <ListItem sx={{ p: 0 }}>
      <Card
        component="article"
        variant="outlined"
        sx={{ width: "100%", py: 2, borderRadius: 0, border: "none" }}
      >
        <CardContent sx={{ "&:last-child": { p: 0 } }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar>{comment.authorName.slice(0, 2).toUpperCase()}</Avatar>
            <Stack spacing={0}>
              <Typography component="h1" variant="body1" fontWeight={600}>
                {comment.authorName}
              </Typography>
              <Typography variant="body2">{comment.content}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </ListItem>
  );
}
