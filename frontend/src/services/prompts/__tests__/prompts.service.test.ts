import { PromptsService } from "../prompts.service";

describe("PromptsService", () => {
  it("get all prompts successfully", async () => {
    const response = await PromptsService.getAllPrompts({ page: 1, limit: 10});
    
    expect(response).toHaveProperty("items");
    expect(response).toHaveProperty("total");
    expect(response).toHaveProperty("page");
    expect(response).toHaveProperty("limit");
    expect(response).toHaveProperty("pages");

    expect(response.items).toHaveLength(10);
    expect(response.total).toBe(18);
    expect(response.pages).toBe(2);
    expect(response.page).toBe(1);
    expect(response.limit).toBe(10);
  });

  it("return prompt details with correct types", async () => {
    const mockPromptId = "69398c1d5393462cecf974c9";
    const prompt = await PromptsService.getPromptDetail(mockPromptId);

    expect(prompt).toHaveProperty("id");
    expect(prompt).toHaveProperty("title");
    expect(prompt).toHaveProperty("prompt");
    expect(prompt).toHaveProperty("resultExample");
    expect(prompt).toHaveProperty("author");
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
    const mockPromptId = "69398c1d5393462cecf974c9";
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
    const mockPromptId = "69398c1d5393462cecf974c7";

    await expect(PromptsService.delete(mockPromptId)).resolves.toBeUndefined();

    await expect(PromptsService.getPromptDetail(mockPromptId)).rejects.toThrow(
      "Prompt not found"
    );
  });

  it("get prompt comments successfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c9";

    const comments = await PromptsService.getPromptComments(mockPromptId);
    const mockAuthors = ["alex", "matt", "jane"];

    expect(comments).toHaveLength(3);
    comments.forEach((comment) => {
      expect(mockAuthors).toContain(comment.author);
    });
  });

  it("create comments successfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c8";
    const mockComment = { content: "Hey, that was helpful" };
    await PromptsService.createComment(
      mockPromptId,
      mockComment
    );

    const comments = await PromptsService.getPromptComments(mockPromptId);
    expect(comments).toHaveLength(1);
  });
});
