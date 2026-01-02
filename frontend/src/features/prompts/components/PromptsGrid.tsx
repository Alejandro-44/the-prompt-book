import { Box, Grid } from "@mui/material";
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
    <Grid role="grid" sx={{ mt: 2 }} container spacing={2}>
      {promptsToRender.map((prompt, index) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={prompt?.id ?? `placeholder-${index}`}>
           {prompt ? (
            <PromptCard prompt={prompt} editable={editable} />
          ) : (
            <Box
              sx={{
                height: 147.75,         
                visibility: 'hidden',
              }}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
