import { UsersService, type GetPromptsParams, type PaginatedPrompts } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseUserPromptsParams extends GetPromptsParams {
  mode: "me" | "public";
  userId?: GetPromptsParams["user_id"];
};

export function useUserPrompts({ mode, userId, limit, tags, model, search }: UseUserPromptsParams) {
  const [page, setPage] = useState(1)
  const isMe = mode === "me";
  const { data, isLoading, error } = useQuery<PaginatedPrompts>({
    queryKey: isMe
      ? ["users", "me", "prompts", page, limit, tags]
      : ["users", userId, "prompts", page, limit],
    queryFn: () =>
      isMe
        ?  UsersService.getMyPrompts({ page, tags, model, search })
        : UsersService.getUserPrompts(userId!, { page, tags, model, search }),
    enabled: isMe || !!userId,
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
