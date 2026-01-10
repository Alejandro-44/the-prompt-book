import { loginSchema } from "./login.schema";

describe("loginSchema", () => {
  it("successfully validates a valid record", () => {
    const data = {
      email: "john@example.com",
      password: "12345TEST",
    };

    const result = loginSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("returns an error if the fields are empty", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.email?.[0]).toBe("The email is required");
    expect(errors.password?.[0]).toBe("The password is required");
  });
});
