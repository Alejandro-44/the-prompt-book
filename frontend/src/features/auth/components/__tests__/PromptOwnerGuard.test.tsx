import { cleanup, screen, waitFor } from "@testing-library/react";
import { useUserStore } from "@/features/users/contexts";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";


describe("PromptOwnerGuard", () => {
  beforeEach(() => {
    useUserStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  afterEach(cleanup);

  test("shows loading while fetching prompt", () => {
    useUserStore.setState({
      user: { id: "6939876c7f7a423bcb83fe0e", username: "creative_io" } as any,
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithProviders(null, ["/prompts/69398c1d5393462cecf974c9/edit"]);
    expect(screen.getByRole("status")).toBeDefined();
  });

  test("navigates to home 404 when doesn't find the prompt", async () => {
    useUserStore.setState({
      user: { id: "6939872c7f7a423bcb83fe0b", username: "alex" } as any,
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithProviders(null, ["/prompts/invalid-id/edit"]);
    await waitFor(() => {
      expect(screen.getByText("404")).toBeDefined();
    });
  });

  test("navigates to 403 if user is not the owner", async () => {
    useUserStore.setState({
      user: { id: "6939872c7f7a423bcb83fe0b", username: "alex" } as any,
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithProviders(null, ["/prompts/69398c1d5393462cecf974c9/edit"]);

    await waitFor(() => {
      expect(screen.getByText("403")).toBeDefined();
    });
  });

  test("renders outlet if user is the owner", async () => {
    useUserStore.setState({
      user: { id: "6939876c7f7a423bcb83fe0e", username: "creative_io" } as any,
      isAuthenticated: true,
      isLoading: false,
    });

    renderWithProviders(null, ["/prompts/69398c1d5393462cecf974c9/edit"]);

    await waitFor(() => {
      expect(screen.getByText("Edit Prompt")).toBeDefined();
    });
  });
});
