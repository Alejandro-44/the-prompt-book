import { PromptsService } from "@/services";
import { useQuery } from "@tanstack/react-query";

type CommentsHookProps = {
  promptId: string;
}

export function useComments({ promptId }: CommentsHookProps) {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["prompt", promptId, "comments"],
    queryFn: () => PromptsService.getPromptComments(promptId)
  })

  return {
    comments,
    isLoading,
    error
  }
}
