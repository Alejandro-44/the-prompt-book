import { PromptsService } from "../prompts.service";

describe("PromptsService", () => {
  it("get all prompts successfully", async () => {
    const { data, status } = await PromptsService.getAllPrompts({
      page: 1,
      limit: 10,
    });

    expect(status).toBe(200);
    expect(data).toHaveProperty("items");
    expect(data).toHaveProperty("total");
    expect(data).toHaveProperty("page");
    expect(data).toHaveProperty("limit");
    expect(data).toHaveProperty("pages");

    expect(data.items).toHaveLength(10);
    expect(data.total).toBe(18);
    expect(data.pages).toBe(2);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(10);
  });

  it("return prompt details with correct types", async () => {
    const mockPromptId = "69398c1d5393462cecf974c9";
    const { data, status } = await PromptsService.getPromptDetail(mockPromptId);

    expect(status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("prompt");
    expect(data).toHaveProperty("resultExample");
    expect(data).toHaveProperty("authorId");
    expect(data).toHaveProperty("authorName");
    expect(data).toHaveProperty("authorHandle");
  });

  it("returns successful message and id when create a new prompt successfully", async () => {
    const mocksPromptCreate = {
      title: "Integration test",
      description: "This is a test description #ai #poem",
      prompt: "Write a poem",
      resultExample: "A small poem",
      model: "Claude",
    };

    const { data, status } = await PromptsService.create(mocksPromptCreate);

    expect(status).toBe(201);
    expect(data).toHaveProperty("message");
    expect(data).toHaveProperty("id", "mockedid789456");
  });

  it("update a prompt successfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c9";
    const promptUpdate = {
      title: "Updated Title",
    };

    await expect(
      PromptsService.update(mockPromptId, promptUpdate)
    ).resolves.toEqual({ status: 204 });

    const { data } = await PromptsService.getPromptDetail(mockPromptId);
    expect(data.title).toBe("Updated Title");
  });

  it("delete a prompt successfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c7";

    await expect(PromptsService.delete(mockPromptId)).resolves.toEqual({
      status: 204,
    });

    await expect(
      PromptsService.getPromptDetail(mockPromptId)
    ).rejects.toMatchObject({ status: 404 });
  });

  it("get prompt comments successfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c9";

    const { data, status } = await PromptsService.getPromptComments(
      mockPromptId
    );
    const mockAuthors = ["alex", "matt_coder", "luna_writer"];

    expect(status).toBe(200);
    expect(data).toHaveLength(3);
    data.forEach((comment) => {
      expect(mockAuthors).toContain(comment.authorHandle);
    });
  });

  it("create comments successfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c8";
    const mockComment = { content: "Hey, that was helpful" };
    await PromptsService.createComment(mockPromptId, mockComment);

    const { data } = await PromptsService.getPromptComments(mockPromptId);
    expect(data).toHaveLength(1);
  });
});
