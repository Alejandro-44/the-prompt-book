import { PromptsService, type Prompt } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LikePrompt = {
  promptId: string;
};

export function useLikePrompt({ promptId }: LikePrompt) {
  const queryClient = useQueryClient();
  const queryKey = ["prompt", promptId];

  return useMutation({
    mutationFn: (likeByMe: boolean) => {
      return likeByMe
        ? PromptsService.unlikePrompt(promptId)
        : PromptsService.likePrompt(promptId);
    },

    onMutate: async (likeByMe: boolean) => {
      await queryClient.cancelQueries({ queryKey });

      const previousPrompt =
        queryClient.getQueryData<Prompt>(queryKey);

      queryClient.setQueryData<Prompt>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          likeByMe: !likeByMe,
          likesCount: likeByMe
            ? old.likesCount - 1
            : old.likesCount + 1,
        };
      });

      return { previousPrompt };
    },

    onError: (_error, _vars, context) => {
      if (context?.previousPrompt) {
        queryClient.setQueryData(queryKey, context.previousPrompt);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
