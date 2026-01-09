import { UsersService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks";

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
  } = useQuery({
    queryKey: ["user", userHandle],
    queryFn: () => UsersService.getUser(userHandle!),
    enabled: mode === "public" && !!userHandle,
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
