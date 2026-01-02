import { PromptsService, type GetPromptsParams } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function usePrompts(params: GetPromptsParams) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ["prompts", page, params],
    queryFn: () => PromptsService.getAllPrompts({ page, ...params})
  })

  return { 
    prompts: data?.items,
    page: data?.page,
    pages: data?.pages,
    total: data?.total,
    isLoading,
    error,
    setPage,
  };
}
