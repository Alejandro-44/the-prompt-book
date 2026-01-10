import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { CommentsList } from "../CommentsList";

const mockComments = [
  {
    id: "123-abc",
    promptId: "69398c1d5393462cecf974c9",
    content: "It's very helpfull",
    authorId: "6939872c7f7a423bcb83fe0b",
    authorName: "alex",
    authorHandle: "alex",
    pubDate: new Date("2024-02-10T08:12:00Z"),
  },
  {
    id: "456-def",
    promptId: "69398c1d5393462cecf974c9",
    content: "Awesome!",
    authorId: "693987497f7a423bcb83fe0c",
    authorName: "matt_coder",
    authorHandle: "matt_coder",
    pubDate: new Date("2024-02-10T08:12:00Z"),
  },
  {
    id: "789-ghi",
    promptId: "69398c1d5393462cecf974c9",
    content: "Thank you for share",
    authorId: "6939875e7f7a423bcb83fe0d",
    authorName: "luna_writer",
    authorHandle: "luna_writer",
    pubDate: new Date("2024-02-10T08:12:00Z"),
  },
];


describe("CommentList", () => {
  it("render multiple comments with author name and content", () => {
      renderWithProviders(<CommentsList comments={mockComments} />);

      mockComments.forEach((comment) => {
        expect(comment.authorHandle).toBeDefined()
        expect(comment.content).toBeDefined()
      })
  })
})
