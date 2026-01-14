import { PromptCard } from "./PromptCard";
import type { PromptSummary } from "@/services";

interface PromptsGridProps {
  prompts: PromptSummary[];
  editable?: boolean;
}

const MAX_ITEMS = 12;

export function PromptsGrid({ prompts, editable }: PromptsGridProps) {
  const promptsToRender: Array<PromptSummary | null> = [
    ...prompts,
    ...Array.from(
      { length: MAX_ITEMS - prompts.length },
      () => null
    ),
  ];

  return (
    <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
      {promptsToRender.map((prompt, index) => (
        <div key={index} className="mb-4">
          {prompt ? (
            <PromptCard className="rounded-2xl" prompt={prompt} editable={editable} />
          ) : (
            <div className="h-40 w-full rounded-md" />
          )}
        </div>
      ))}
    </div>
  );
}
