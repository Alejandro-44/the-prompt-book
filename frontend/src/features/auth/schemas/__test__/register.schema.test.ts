import { describe, it, expect } from "vitest";
import { registerSchema } from "../register.schema";

describe("registerSchema", () => {
  it("successfully validates a valid record", () => {
    const data = {
      username: "john",
      email: "john@example.com",
      password: "12345TEST",
    };

    const result = registerSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("returns an error if the fields are empty", () => {
    const result = registerSchema.safeParse({
      username: "",
      email: "",
      password: "",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;

    expect(errors.username?.[0]).toBe("The username is required");
    expect(errors.email?.[0]).toBe("The email is required");
    expect(errors.password?.[0]).toBe("The password is required");
  });

  it("returns an error if the email is invalid", () => {
    const result = registerSchema.safeParse({
      username: "john",
      email: "not-an-email",
      password: "123456",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;
    expect(errors.email).toContain("Invalid email address");
  });

  it("returns an error if the password is too short", () => {
    const result = registerSchema.safeParse({
      username: "john",
      email: "john@example.com",
      password: "123",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;
    expect(errors.password).toContain(
      "The password must be at least 8 characters long"
    );
  });

  it("returns an error if the password doesn't have numbers", () => {
    const result = registerSchema.safeParse({
      username: "john",
      email: "john@example.com",
      password: "abc",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;
    expect(errors.password).toContain(
      "Must include at least one number"
    );
  });

  it("returns an error if the password doesn't have uppercase characters", () => {
    const result = registerSchema.safeParse({
      username: "john",
      email: "john@example.com",
      password: "abc",
    });

    expect(result.success).toBe(false);

    const errors = (result as any).error.flatten().fieldErrors;
    expect(errors.password).toContain(
      "Must include at least one uppercase character"
    );
  });
});
