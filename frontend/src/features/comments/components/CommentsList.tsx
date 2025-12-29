import type { PromptComment } from "@/services";
import { List } from "@mui/material";
import { Comment } from "./Comment";

type CommentsListProps = {
  comments: PromptComment[];
};

export function CommentsList({ comments }: CommentsListProps) {
  return (
    <List
      sx={{
        p: 0,
        "& > li:not(:last-child)": {
          borderBottom: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </List>
  );
}
