import { cleanup, fireEvent, screen } from "@testing-library/react";
import { PromptCard } from "../PromptCard";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

const mockPrompt = {
  id: "abc-123",
  title: "Code documentation generator",
  description:
    "Technical prompt for generating code documentation using the JSDoc standard. #JavaScript",
  prompt: "Document the following function in JSDoc format: {{code}}",
  resultExample: "/** Calculates total price... */",
  model: "gpt-4o",
  hashtags: ["javascript"],
  pubDate: new Date("2024-02-22T09:12:00"),
  likesCount: 30,
  authorId: "6939876c7f7a423bcb83fe0e",
  authorName: "creative_io",
  authorHandle: "creative_io",
};

describe("PromptCard", () => {
  afterEach(() => {
    cleanup();
  });
  it("render PromptCard component", () => {
    renderWithProviders(<PromptCard prompt={mockPrompt} />);
    expect(screen.getByText(/Code documentation generator/)).toBeDefined();
    expect(screen.getByText(/gpt-4o/)).toBeDefined();
    expect(screen.getByText(/creative_io/)).toBeDefined();
  });
  it("display all tags", () => {
    renderWithProviders(<PromptCard prompt={mockPrompt} />);
    mockPrompt.hashtags.forEach((hashtag) => {
      expect(screen.findByText(new RegExp(hashtag, "i"))).toBeDefined();
    });
  });
  it("navigate to prompt detail page on click", () => {
    const { router } = renderWithProviders(<PromptCard prompt={mockPrompt} />);
    const link = screen.getByTestId("prompt-link");
    fireEvent.click(link);
    expect(router.state.location.pathname).toBe("/prompts/abc-123");
  });
  it("navigate to prompt edit page when click edit button", () => {
    const { router } = renderWithProviders(
      <PromptCard prompt={mockPrompt} editable={true} />
    );
    const link = screen.getByTestId("edit-button");
    fireEvent.click(link);
    expect(router.state.location.pathname).toBe("/prompts/abc-123/edit");
  });
});
