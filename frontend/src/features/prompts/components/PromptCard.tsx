import type { PromptSummary } from "@/services";
import { Link, useNavigate } from "react-router";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PromptTags } from "./PromptTags";
import { Button } from "@/components/ui/button";

type Props = {
  prompt: PromptSummary;
  editable?: boolean;
  className?: string;
};

export function PromptCard({ prompt, editable = false, className = "" }: Props) {
  const navigate = useNavigate();
  return (
    <Link to={`/prompts/${prompt.id}`}>
      <article className={`relative group bg-card p-4` + className}>
        {editable && (
          <Button
            className="absolute opacity-0 group-hover:opacity-100 rounded-full size-10 top-2 right-2"
            onClick={() => {
              navigate(`/prompts/${prompt.id}/edit`);
            }}
          >
            <Pencil />
          </Button>
        )}
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {prompt.authorHandle.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {prompt.authorName}
              </span>
              <span>·</span>
              <span>{prompt.pubDate.toDateString()}</span>
              <span>·</span>
              <span className="bg-muted px-1.5 py-0.5 text-xs font-medium">
                {prompt.model}
              </span>
            </div>

            <h1 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {prompt.title}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {prompt.description}
            </p>

            <PromptTags hashtags={prompt.hashtags} />
          </div>
        </div>
      </article>
    </Link>
  );
}
