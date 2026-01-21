import { PromptsService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UnikePrompt = {
  promptId: string
}

export function useUnlikePrompt({ promptId }: UnikePrompt) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => PromptsService.unlikePrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prompt", promptId]
      })
    }
  })
}
