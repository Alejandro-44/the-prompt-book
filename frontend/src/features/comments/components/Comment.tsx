import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PromptComment } from "@/services";
type CommentProps = {
  comment: PromptComment;
};

export function Comment({ comment }: CommentProps) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">
          {comment.authorName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{comment.authorName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {comment.pubDate.toDateString()}
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground">{comment.content}</p>
      </div>
    </div>
  );
}
