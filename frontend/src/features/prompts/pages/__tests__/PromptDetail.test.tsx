import { cleanup, screen, waitFor } from "@testing-library/react";
import { PromptDetail } from "../PromptDetail";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("PromptDetail", () => {
  afterEach(cleanup);

  it("renders prompt details when promptId is valid", async () => {
    renderWithProviders(<PromptDetail />, [
      "/prompts/69398c1d5393462cecf974c9",
    ]);

    await waitFor(() =>
      expect(screen.queryByTestId("prompt-detail-skeleton")).toBeNull(),
    );
  });

    it("renders prompt comments when promptId is valid", async () => {
    renderWithProviders(<PromptDetail />, [
      "/prompts/69398c1d5393462cecf974c9",
    ]);

    await waitFor(() =>
      expect(screen.queryByTestId("prompt-detail-skeleton")).toBeNull(),
    );

    expect(screen.getByText("Comments (3)")).toBeDefined();
    const commentsList = screen.getByRole("list")
    expect(commentsList).toBeDefined();
  });

  it("redirects to 404 when promptId is invalid", async () => {
    const { router } = renderWithProviders(<PromptDetail />, [
      "/prompts/invalid-prompt-id",
    ]);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/404");
    });

    expect(screen.getByText("404")).toBeDefined();
  });
});
