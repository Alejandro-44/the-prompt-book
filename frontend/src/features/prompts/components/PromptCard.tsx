import type { PromptSummary } from "@/services";
import { Link, useNavigate } from "react-router";
import { Heart, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PromptTags } from "./PromptTags";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";

type Props = {
  prompt: PromptSummary;
  editable?: boolean;
  className?: string;
};

export function PromptCard({
  prompt,
  editable = false,
  className = "",
}: Props) {
  const navigate = useNavigate();
  return (
    <article
      className={`relative bg-card group p-4 h-full ${className}`}
      data-testid="prompt-card"
    >
      {editable && (
        <Button
          className="absolute z-10 lg:opacity-0 lg:group-hover:opacity-100 rounded-full size-10 top-2 right-2 cursor-pointer"
          data-testid="edit-button"
          onClick={() => navigate(`/prompts/${prompt.id}/edit`)}
        >
          <Pencil />
        </Button>
      )}
      <Link to={`/prompts/${prompt.id}`} data-testid="prompt-link">
        <div className="flex h-full items-start gap-4">
          <Avatar className="size-10">
            <AvatarFallback>
              {prompt.authorHandle.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 flex flex-col space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {prompt.authorName}
              </span>
              <span>·</span>
              <span>{formatDate(prompt.pubDate.toDateString())}</span>
              <span>·</span>
              <span className="bg-muted px-1.5 py-0.5 text-xs font-medium">
                {prompt.model}
              </span>
            </div>

            <h1 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {prompt.title}
            </h1>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {prompt.description}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground gap-1.5">
                <Heart className="size-4" />
                <span>{prompt.likesCount}</span>
              </div>
              <PromptTags hashtags={prompt.hashtags} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
