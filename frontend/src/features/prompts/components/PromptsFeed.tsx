import type { PromptSummary } from "@/services";
import { PromptCard } from "./PromptCard";

type PromptsFeedProps = {
  prompts: PromptSummary[];
}

function PromptsFeed({ prompts }: PromptsFeedProps) {
  return (
    <div className="max-w-2xl grid">
      {prompts.map((prompt) => <PromptCard key={prompt.id} className="border-b" prompt={prompt} />)}
    </div>
  )
}

export default PromptsFeed
