import { promptSchema } from "../prompt.schema";

describe("promptSchema", () => {
  it("successfully validates a valid record", () => {
    const data = {
      title: "Test Prompt",
      description: "this is a prompt description",
      prompt: "This is a test prompt with at least 10 characters",
      resultExample: "This is a result example with at least 10 characters",
      model: "gpt-4",
    };

    const result = promptSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  describe("title validation", () => {
    it("returns an error if title is less than 3 characters", () => {
      const result = promptSchema.safeParse({
        title: "Hi",
        description: "this is a prompt description",
        prompt: "This is a test prompt with at least 10 characters",
        resultExample: "This is a result example with at least 10 characters",
        model: "gpt-4",
      });

      expect(result.success).toBe(false);

      const errors = (result as any).error.flatten().fieldErrors;

      expect(errors.title?.[0]).toBe("Title must be at least 3 characters");
    });

    it("returns an error if title is more than 100 characters", () => {
      const longTitle = "a".repeat(101);
      const result = promptSchema.safeParse({
        title: longTitle,
        description: "this is a prompt description",
        prompt: "This is a test prompt with at least 10 characters",
        resultExample: "This is a result example with at least 10 characters",
        model: "gpt-4",
      });

      expect(result.success).toBe(false);

      const errors = (result as any).error.flatten().fieldErrors;

      expect(errors.title?.[0]).toBe("Maximum 100 characters");
    });
  });

  it("returns an error if description is less than 10 characters", () => {
    const result = promptSchema.safeParse({
      title: "Test Prompt",
      description: "Short",
      prompt: "This prompt has more than 10 characters",
      resultExample: "This is a result example with at least 10 characters",
      model: "gpt-4",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.description?.[0]).toBe(
      "Description must be at least 10 characters",
    );
  });

  it("returns an error if prompt is less than 10 characters", () => {
    const result = promptSchema.safeParse({
      title: "Test Prompt",
      description: "this is a prompt description",
      prompt: "Short",
      resultExample: "This is a result example with at least 10 characters",
      model: "gpt-4",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.prompt?.[0]).toBe("Prompt must be at least 10 characters");
  });

  it("returns an error if resultExample is less than 10 characters", () => {
    const result = promptSchema.safeParse({
      title: "Test Prompt",
      prompt: "This is a test prompt with at least 10 characters",
      resultExample: "Short",
      model: "gpt-4",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.resultExample?.[0]).toBe(
      "Result example must be at least 10 characters",
    );
  });

  it("returns an error if model is empty", () => {
    const result = promptSchema.safeParse({
      title: "Test Prompt",
      description: "This is a prompt description",
      prompt: "This is a test prompt with at least 10 characters",
      resultExample: "This is a result example with at least 10 characters",
      model: "",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.model?.[0]).toBe("Select a model");
  });

  it("should fail when both resultExample and mediaUrl are empty", () => {
    const result = promptSchema.safeParse({
      title: "Test Prompt",
      description: "This is a prompt description",
      prompt: "This prompt has more than 10 characters",
      model: "gpt-4",
      resultExample: "",
      mediaUrl: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toContain("resultExample");
      expect(paths).toContain("mediaUrl");
    }
  });
});
