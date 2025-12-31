import { PromptsService, type GetPromptsParams } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function usePrompts(params: GetPromptsParams) {
  const { data, isPending, error } = useQuery({
    queryKey: ["prompts", params],
    queryFn: () => PromptsService.getAllPrompts(params)
  })

  return { 
    prompts: data?.items,
    page: data?.page,
    pages: data?.pages,
    isLoaging: isPending,
    error: error
  };
}
