import { PromptsService, type Prompt } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LikePrompt = {
  promptId: string;
};

export function useLikePrompt({ promptId }: LikePrompt) {
  const queryClient = useQueryClient();
  const queryKey = ["prompt", promptId];

  return useMutation({
    mutationFn: (liked: boolean) =>
      liked
        ? PromptsService.unlikePrompt(promptId)
        : PromptsService.likePrompt(promptId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousPrompt = queryClient.getQueryData<Prompt>(queryKey);

      queryClient.setQueryData<Prompt>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !old.likeByMe,
          likesCount: old.likeByMe ? old.likesCount - 1 : old.likesCount + 1,
        };
      });
      return { previousPrompt };
    },
    onError: (_, __, context) => {
      if (context?.previousPrompt) {
        queryClient.setQueryData(queryKey, context.previousPrompt);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
}
