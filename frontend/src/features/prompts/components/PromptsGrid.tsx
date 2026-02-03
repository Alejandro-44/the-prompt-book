import { PromptCard } from "./PromptCard";
import type { PromptSummary } from "@/services";

interface PromptsGridProps {
  prompts: PromptSummary[];
  editable?: boolean;
  itemsLimit?: number;
}


export function PromptsGrid({ prompts, editable, itemsLimit=9 }: PromptsGridProps) {
  const promptsToRender: Array<PromptSummary | null> = [
    ...prompts,
    ...Array.from(
      { length: itemsLimit - prompts.length },
      () => null
    ),
  ];

  return (
    <section data-testid="prompts-grid" className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {promptsToRender.map((prompt, index) => (
        prompt ? (
          <PromptCard key={prompt.id} prompt={prompt} editable={editable} />
        ) : (
          <div data-testid="prompt-card-empty" key={index} className="h-40 w-full rounded-md" />
        )
      ))}
    </section>
  );
}
