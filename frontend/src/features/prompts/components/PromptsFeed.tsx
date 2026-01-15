import type { PromptSummary } from "@/services";
import { PromptCard } from "./PromptCard";

type PromptsFeedProps = {
  prompts: PromptSummary[];
}

function PromptsFeed({ prompts }: PromptsFeedProps) {
  return (
    <div className="max-w-2xl">
      {prompts.map((prompt) => <PromptCard className="border-b" prompt={prompt} />)}
    </div>
  )
}

export default PromptsFeed
