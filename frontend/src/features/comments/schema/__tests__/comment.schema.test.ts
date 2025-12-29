import { commentSchema } from "../comment.schema";

describe("commentSchema", () => {
  it("successfully validates a valid comment", () => {
    const data = {
      content: "This is a valid comment",
    };

    const result = commentSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("returns an error if content is empty", () => {
    const result = commentSchema.safeParse({
      content: "",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.content?.[0]).toBe("The comment should have at least one character");
  });

  it("returns an error if content is missing", () => {
    const result = commentSchema.safeParse({});

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.content?.[0]).toBe("The comment must be a valid string");
  });
});
