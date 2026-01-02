import { useUserStore } from "@/features/users/contexts";
import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useAuth, useLogin, useLogout, useMe, useRegister } from "../useAuth";
import { act, waitFor } from "@testing-library/react";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("useAuth", () => {
  describe("useMe", () => {
    it("fetches the current user", async () => {
      const { result } = renderHookWithClient(useMe);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.username).toBe("alex");
    });
  });

  describe("useRegister", () => {
    it("registers a user and redirects to login", async () => {
      const { result } = renderHookWithClient(useRegister);

      await act(async () => {
        result.current.mutate({
          username: "newuser",
          email: "new@user.com",
          password: "123456",
        });
      });

      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith("/login");
      });
    });
  });

  describe("useLogin", () => {
    it("logs in, fetches user, updates store and redirects", async () => {
      const { result } = renderHookWithClient(useLogin);

      await act(async () => {
        result.current.mutate({
          email: "alex@example.com",
          password: "password123",
        });
      });

      await waitFor(() => {
        const user = useUserStore.getState().user;
        expect(user).not.toBeNull();
        expect(user?.username).toBe("alex");
      });

      expect(navigateMock).toHaveBeenCalledWith("/users/me");
    });
  });

  describe("useLogout", () => {
    it("logs out, clears store and redirects home", async () => {
      useUserStore.setState({
        user: { id: "1", username: "johndoe" } as any,
        isAuthenticated: true,
      });

      const { result } = renderHookWithClient(useLogout);

      await act(async () => {
        result.current.mutate();
      });

      await waitFor(() => {
        expect(useUserStore.getState().user).toBeNull();
      });

      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  describe("useAuth", () => {
    it("should return true when there is an authenticaed user", () => {
      useUserStore.setState({
        user: { id: "1", username: "johndoe" } as any,
        isAuthenticated: true,
      });

      const { result } = renderHookWithClient(useAuth);

      expect(result.current.isAuthenticated).toBe(true)
    })
  })
});
