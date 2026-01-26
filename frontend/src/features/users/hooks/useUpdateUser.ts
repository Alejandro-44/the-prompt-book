import { UsersService, type PrivateUser, type UserUpdate } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

type UseUpdateUser = {
  user: PrivateUser;
};

export function useUpdateUser({ user }: UseUpdateUser) {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData: UserUpdate) =>
      UsersService.update(user.id, userData),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["user", user.handle],
      });
      navigate("/users/me");
    },
  });
}
