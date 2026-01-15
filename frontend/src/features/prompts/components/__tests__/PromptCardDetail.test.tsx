import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { PromptCardDetail } from "../PromptCardDetail";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("PromptCardDetail", () => {
  beforeEach(() => {
    renderWithProviders(<PromptCardDetail promptId="69398c1d5393462cecf974c9" />);
  });

  afterEach(() => {
    cleanup();
  });

  test("should render prompt details", async () => {

    await waitFor(() => {
      expect(screen.getByText("gpt-3.5")).toBeDefined();
    });

    expect(screen.getByText("TikTok script idea")).toBeDefined();
    expect(screen.getByText("creative_io")).toBeDefined();
    expect(screen.getByText("Write a short funny TikTok script about studying with AI.")).toBeDefined();
    expect(screen.getByText("AI: 'I analyzed your habits... you need coffee.'")).toBeDefined();

    const hashtags = ["tiktok", "scripts"];
    hashtags.forEach((hashtag) => {
      expect(screen.getByText(hashtag)).toBeDefined();
    });

    expect(screen.getByTestId("copy-prompt-button")).toBeDefined();
  });

  test("should redirect to user profile on author name click", async () => {
    const link = screen.getByTestId("author-link");
    fireEvent.click(link);
    expect(screen.getByText("Author page")).toBeDefined();
  })
});
