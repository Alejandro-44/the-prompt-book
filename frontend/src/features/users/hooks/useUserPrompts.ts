import { UsersService, type GetPromptsParams, type PaginatedPrompts } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseUserPromptsParams extends GetPromptsParams {
  mode: "me" | "public";
  userHandle?: GetPromptsParams["author_handle"];
};

export function useUserPrompts({ mode, userHandle, limit, hashtags, model, search }: UseUserPromptsParams) {
  const [page, setPage] = useState(1)
  const isMe = mode === "me";
  const { data, isLoading, error } = useQuery<PaginatedPrompts>({
    queryKey: isMe
      ? ["users", "me", "prompts", page, limit]
      : ["users", userHandle, "prompts", page, limit],
    queryFn: () =>
      isMe
        ? UsersService.getMyPrompts({ page, hashtags, model, search })
        : UsersService.getUserPrompts(userHandle!, { page, hashtags, model, search }),
    enabled: isMe || !!userHandle,
  });

  return {
    prompts: data?.items,
    total: data?.total,
    page: data?.page,
    pages: data?.pages,
    isLoading,
    error,
    setPage,
  };
}
