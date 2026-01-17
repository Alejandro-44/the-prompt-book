import { PromptTags } from "./PromptTags";
import { Check, CopyIcon } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import { useState } from "react";
import { usePrompt } from "../hooks";
import { useRedirectOn } from "@/features/auth/hooks";
import { PromptCardDetailSkeleton } from "./PromptCardDetailSkeleton";

type Props = {
  promptId: string;
};

export function PromptCardDetail({ promptId }: Props) {
  const { prompt, isLoading, error } = usePrompt({ promptId });
  const [copied, setCopied] = useState(false);
  useRedirectOn({ when: error?.status === 404, to: "/404" });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt?.prompt || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <PromptCardDetailSkeleton />
  }

  return (
    <article className="py-6 space-y-6">
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback>
              {prompt?.authorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/users/${prompt?.authorHandle}`}
              className="hover:underline"
              data-testid="author-link"
            >
              <p className="font-medium">{prompt?.authorName}</p>
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatDate(prompt?.pubDate.toDateString() || "")}
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{prompt?.title}</h1>
        <p className="text-sm text-muted-foreground">{prompt?.description}</p>
        {prompt && <PromptTags hashtags={prompt.hashtags} />}
        <span className="inline-block rounded-md bg-muted px-3 py-1 text-sm font-medium">
          {prompt?.model}
        </span>
      </header>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Prompt</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="copy-prompt-button"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {prompt?.prompt}
          </pre>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Result</h2>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-muted-foreground">{prompt?.resultExample}</p>
        </div>
      </section>
    </article>
  );
}
