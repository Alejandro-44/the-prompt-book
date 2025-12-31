import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { usePrompts } from "@/features/prompts/hooks/usePrompts";
import { Pagination } from "@mui/material";
import { useState } from "react";

export function HomePage() {
  const [page, setPage] = useState(1);
  const { prompts, pages } = usePrompts({ page });

  return (
    <>
      <PromptsGrid prompts={prompts} />
      <Pagination count={pages} onChange={(_, page) => setPage(page)} variant="outlined" shape="rounded" />
    </>
  )
}
