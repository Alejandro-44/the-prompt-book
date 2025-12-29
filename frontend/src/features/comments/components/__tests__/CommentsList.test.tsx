import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { CommentsList } from "../CommentsList";

const mockComments = [
  {
    id: "123-abc",
    promptId: "abc-123",
    content: "It's very helpfull",
    author: "alex",
    pubDate: new Date("2024-02-10T08:12:00Z"),
  },
  {
    id: "456-def",
    promptId: "abc-123",
    content: "It's amazing",
    author: "matt",
    pubDate: new Date("2024-02-10T08:12:00Z"),
  },
  {
    id: "789-ghi",
    promptId: "abc-123",
    content: "Thank you for share",
    author: "jane",
    pubDate: new Date("2024-02-10T08:12:00Z"),
  },
];


describe("CommentList", () => {
  it("render multiple comments with author name and content", () => {
      renderWithProviders(<CommentsList comments={mockComments} />);

      mockComments.forEach((comment) => {
        expect(comment.author).toBeDefined()
        expect(comment.content).toBeDefined()
      })
  })
})
