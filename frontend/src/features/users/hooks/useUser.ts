import { UsersService, type User } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks";
import type { ApiError } from "@/services/api/api.types";

type UseUserParams = {
  mode: "me" | "public";
  userHandle?: string;
};

export function useUser({ mode, userHandle }: UseUserParams) {
  const { user: authUser, isLoading: authLoading } = useAuth();

  const {
    data: publicUser,
    isLoading: publicLoading,
    error: publicError,
  } = useQuery<User, ApiError>({
    queryKey: ["user", userHandle],
    queryFn: () => UsersService.getUser(userHandle!),
    enabled: mode === "public" && !!userHandle,
    retry: false,
  });

  const isLoading = mode === "me" ? authLoading : publicLoading;
  const error = mode === "me" ? null : publicError;
  const user = mode === "me" ? authUser : publicUser;

  return {
    user,
    isLoading,
    error,
  };
}
