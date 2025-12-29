import { PromptsService, type PromptCommentCreate } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateCommentHook = {
  promptId: string;
};

export function useCreateComment({ promptId }: CreateCommentHook) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (comment: PromptCommentCreate) =>
      PromptsService.createComment(promptId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["prompt", promptId, "comments"]
      })
    }
  });
}
