import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { screen } from "@testing-library/react";
import type { PromptComment } from "@/services";
import { Comment } from "../Comment";

const mockComment: PromptComment = {
  id: "1",
  content: "This is a test comment",
  promptId: "prompt-1",
  author: "John Doe",
  pubDate: new Date("2024-01-01"),
};

describe("Comment", () => {
  it("renders the comment with author initials in avatar", () => {
    renderWithProviders(<Comment comment={mockComment} />);

    const avatar = screen.getByText("JO");
    expect(avatar).toBeDefined();
  });

  it("renders the author name", () => {
    renderWithProviders(<Comment comment={mockComment} />);

    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders the comment content", () => {
    renderWithProviders(<Comment comment={mockComment} />);

    expect(screen.getByText("This is a test comment")).toBeDefined();
  });

  it("renders the comment structure correctly", () => {
    renderWithProviders(<Comment comment={mockComment} />);

    const listItem = screen.getByRole("listitem");
    expect(listItem).toBeDefined();

    const card = screen.getByRole("article");
    expect(card).toBeDefined();
  });
});
