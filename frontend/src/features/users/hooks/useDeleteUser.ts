import { useLogout } from "@/features/auth/hooks";
import { UsersService } from "@/services";
import { useMutation } from "@tanstack/react-query";

export function useDeleteUser() {
  const { mutate: logout } = useLogout();
  return useMutation({
    mutationFn: async () => {
      logout();
      await UsersService.deleteMe();
    },
  })
}
