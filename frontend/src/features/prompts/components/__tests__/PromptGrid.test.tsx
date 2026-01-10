import { cleanup, screen } from "@testing-library/react";
import { PromptsGrid } from "../PromptsGrid";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mockPrompts = [
  {
    id: "69398c1d5393462cecf974c9",
    title: "TikTok script idea",
    description:
      "Prompt for generating short and humorous scripts designed for TikTok content.",
    hashtags: ['tiktok' ,'scripts'],
    model: "gpt-3.5",
    pubDate: new Date("2024-02-23T12:05:00"),
    authorName: "creative_io",
    authorHandle: "creative_io",
  },
  {
    id: "69398c1d5393462cecf974c8",
    title: "Code documentation generator",
    description:
      "Technical prompt for generating code documentation using the JSDoc standard.",
    hashtags: ["javascript"],
    model: "gpt-4o",
    pubDate: new Date("2024-02-22T09:12:00"),
    authorName: "creative_io",
    authorHandle: "creative_io",
  },
  {
    id: "69398c1d5393462cecf974c7",
    title: "Rewrite text professionally",
    description:
      "Prompt for rewriting text using a formal and professional tone.",
    hashtags: [],
    model: "gpt-4o",
    pubDate: new Date("2024-02-21T17:40:00"),
    authorName: "creative_io",
    authorHandle: "creative_io",
  },
]

describe("PromptsGrid", () => {
  beforeEach(() => {
    renderWithProviders(<PromptsGrid prompts={mockPrompts} />);
  });
  afterEach(() => {
    cleanup();
  });

  test("render PromptCard components when prompts are loaded", async () => {
    mockPrompts.forEach((prompt) => {
      expect(screen.getByText(prompt.title)).toBeDefined();
    });

    const promptCards = screen.getAllByTestId("prompt-card");
    expect(promptCards).toHaveLength(mockPrompts.length);
  });
});
