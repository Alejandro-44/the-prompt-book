import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { AuthProvider } from "../AuthProvider";
import { useUserStore } from "@/features/users/contexts/userStore";
import { server } from "@/tests/mocks/server";
import { http, HttpResponse } from "msw";

describe("AuthProvider", () => {
  test("renders children even when user is not authenticated", async () => {
    renderWithProviders(
      <AuthProvider>
        <div>Public content</div>
      </AuthProvider>
    );

    expect(screen.getByText("Public content")).toBeDefined();

    await waitFor(() => {
      expect(useUserStore.getState().user).toBeNull();
    });
  });

  test("hydrates user store when session exists", async () => {
    renderWithProviders(
      <AuthProvider>
        <div>App</div>
      </AuthProvider>
    );

    await waitFor(() => {
      const user = useUserStore.getState().user;
      expect(user).toBeDefined();
      expect(user?.username).toBe("alex");
    });
  });

  test("clears user when /users/me returns error", async () => {
    server.use(
      http.get("http://127.0.0.1:8000/users/me", () =>
        HttpResponse.json({}, { status: 401 })
      )
    );

    renderWithProviders(
      <AuthProvider>
        <div>App</div>
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(useUserStore.getState().user).toBeNull();
    });
  });
});
