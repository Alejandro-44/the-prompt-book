import { PromptsService } from "../prompts.service";

describe("PromptsService", () => {
  it("get all prompts successfully", async () => {
    const prompts = await PromptsService.getAllPrompts();
    expect(prompts).toHaveLength(3);
    expect(prompts[0]).toEqual({
      id: "abc-123",
      title: "Generate a marketing headline",
      model: "gpt-4",
      tags: ["marketing", "copywriting", "saas"],
      authorId: "123-abc",
      authorName: "johndoe",
      pubDate: new Date("2024-01-15T10:30:00Z"),
    });
  });

  it("return prompt details with correct types", async () => {
    const mockPromptId = "abc-123";
    const prompt = await PromptsService.getPromptDetail(mockPromptId);

    expect(prompt).toEqual({
      id: "abc-123",
      title: "Generate a marketing headline",
      prompt:
        "Write a catchy marketing headline for a SaaS that helps users automate workflows.",
      resultExample:
        "Automate Everything: The Smartest Way to Scale Your Productivity.",
      model: "gpt-4",
      tags: ["marketing", "copywriting", "saas"],
      pubDate: new Date("2024-01-15T10:30:00Z"),
      author: {
        id: "123-abc",
        username: "johndoe",
        email: "johndoe@example.com",
      },
    });
  });

  it("returns successful message and id when create a new prompt successfully", async () => {
    const mocksPromptCreate = {
      title: "Integration test",
      prompt: "Write a poem",
      resultExample: "A small poem",
      model: "Claude",
      tags: ["ai", "poem"],
    };

    const response = await PromptsService.create(mocksPromptCreate);

    expect(response).toHaveProperty("message");
    expect(response).toHaveProperty("id", "mockedid789456");
  });

  it("update a prompt successfully", async () => {
    const mockPromptId = "abc-123";
    const promptUpdate = {
      title: "Updated Title",
    };

    await expect(
      PromptsService.update(mockPromptId, promptUpdate)
    ).resolves.toBeUndefined();

    const updatedPrompt = await PromptsService.getPromptDetail(mockPromptId);
    expect(updatedPrompt.title).toBe("Updated Title");
  });

  it("delete a prompt successfully", async () => {
    const mockPromptId = "ghi-789";

    await expect(PromptsService.delete(mockPromptId)).resolves.toBeUndefined();

    await expect(PromptsService.getPromptDetail(mockPromptId)).rejects.toThrow(
      "Prompt not found"
    );
  });

  it("get prompt comments successfully", async () => {
    const mockPromptId = "abc-123";

    const comments = await PromptsService.getPromptComments(mockPromptId);
    const mockAuthors = ["alex", "matt", "jane"];

    expect(comments).toHaveLength(3);
    comments.forEach((comment) => {
      expect(mockAuthors).toContain(comment.author);
    });
  });

  it("create comments successfully", async () => {
    const mockPromptId = "def-456";
    const mockComment = { content: "Hey, that was helpful" };
    await PromptsService.createComment(
      mockPromptId,
      mockComment
    );

    const comments = await PromptsService.getPromptComments(mockPromptId);
    expect(comments).toHaveLength(1);
  });
});
