import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { usePrompts } from "@/features/prompts/hooks/usePrompts";
import { Grid, Pagination } from "@mui/material";

export function HomePage() {
  const { prompts, isLoading, error, pages, setPage } = usePrompts({ limit: 12 });

  if (!prompts) {
    return <div>Nothing to show</div>
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      <PromptsGrid prompts={prompts} />
      <Pagination count={pages} onChange={(_, page) => setPage(page)} variant="outlined" shape="rounded" />
    </Grid>
  )
}
