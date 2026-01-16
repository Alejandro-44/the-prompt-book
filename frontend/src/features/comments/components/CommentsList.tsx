import type { PromptComment } from "@/services";
import { Comment } from "./Comment";

type CommentsListProps = {
  comments: PromptComment[];
};

export function CommentsList({ comments }: CommentsListProps) {
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}><Comment comment={comment} /></li>
      ))}
    </ul>
  );
}
