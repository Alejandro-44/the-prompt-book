import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { PromptCardDetail } from "../PromptCardDetail";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const writeTextMock = vi.fn().mockResolvedValue(undefined);

describe("PromptCardDetail", () => {
  beforeEach(() => {
    renderWithProviders(
      <PromptCardDetail promptId="69398c1d5393462cecf974c9" />,
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("should render loading skeleton initially", () => {
    expect(screen.getByTestId("prompt-detail-skeleton")).toBeDefined();
  });

  it("should render prompt details", async () => {
    await waitFor(() =>
      expect(screen.queryByTestId("prompt-detail-skeleton")).toBeNull(),
    );
    expect(screen.getByText("creative_io")).toBeDefined();
    expect(screen.getByText("TikTok script idea")).toBeDefined();
    expect(
      screen.getByText(
        "Write a short funny TikTok script about studying with AI.",
      ),
    ).toBeDefined();
    expect(screen.getByText("gpt-3.5")).toBeDefined();
    expect(
      screen.getByText("AI: 'I analyzed your habits... you need coffee.'"),
    ).toBeDefined();

    expect(screen.getByTestId("copy-prompt-button")).toBeDefined();
  });

  it("should redirect to user profile on author name click", async () => {
    await waitFor(() =>
      expect(screen.queryByTestId("prompt-detail-skeleton")).toBeNull(),
    );
    const link = screen.getByTestId("author-link");
    fireEvent.click(link);
    expect(screen.getByText("Author page")).toBeDefined();
  });

  it("should copy prompt to clipboard on button click", async () => {
    await waitFor(() =>
      expect(screen.queryByTestId("prompt-detail-skeleton")).toBeNull(),
    );

    vi.useFakeTimers();

    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
    });

    const copyButton = screen.getByTestId("copy-prompt-button");
    expect(copyButton).toBeDefined();
    expect(copyButton.textContent).toBe("Copy");

    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(copyButton.textContent).toBe("Copied");

    await act(async () => {
      vi.runAllTimers();
    });
    expect(copyButton.textContent).toBe("Copy");

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(
      "Write a short funny TikTok script about studying with AI.",
    );

    vi.useRealTimers();
  });
});
