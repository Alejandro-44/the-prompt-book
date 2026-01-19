import type { PromptSummary } from "@/services";
import { PromptCard } from "./PromptCard";

type PromptsFeedProps = {
  prompts: PromptSummary[];
}

export function PromptsFeed({ prompts }: PromptsFeedProps) {
  return (
    <section data-testid="prompts-feed" className="max-w-2xl grid">
      {prompts.map((prompt) => <PromptCard key={prompt.id} className="border-b" prompt={prompt} />)}
    </section>
  )
}
