import {
  PromptsService,
  type GetPromptsParams,
  type PaginatedPrompts,
} from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function usePrompts(params: GetPromptsParams) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery<PaginatedPrompts>({
    queryKey: ["prompts", page, params],
    queryFn: () => PromptsService.getAllPrompts({ page, ...params }),
  });

  return {
    prompts: data?.items || [],
    page: data?.page || 0,
    pages: data?.pages || 0,
    total: data?.total || 0,
    isLoading,
    error,
    setPage,
  };
}
