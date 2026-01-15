import { cleanup, screen } from "@testing-library/react";
import { PromptTags } from "../PromptTags";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("PromptTags", () => {
  afterEach(() => {
    cleanup();
  });

  test("should render tags as chips", () => {
    const hashtags = ["marketing", "copywriting", "saas"];
    renderWithProviders(<PromptTags hashtags={hashtags} />);

    hashtags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeDefined();
    });

    const chips = screen.getAllByRole("hashtag");
    expect(chips).toHaveLength(hashtags.length);
  });

  test("should render empty when no tags", () => {
    const hashtags: string[] = [];
    renderWithProviders(<PromptTags hashtags={hashtags} />);

    const chips = screen.queryAllByRole("button");
    expect(chips).toHaveLength(0);
  });
});
