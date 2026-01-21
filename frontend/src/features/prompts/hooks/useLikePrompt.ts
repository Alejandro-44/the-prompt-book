import { PromptsService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LikePrompt = {
  promptId: string
}

export function useLikePrompt({ promptId }: LikePrompt) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => PromptsService.likePrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prompt", promptId]
      })
    }
  })
}
