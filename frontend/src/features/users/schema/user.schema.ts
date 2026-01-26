import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "The username is required"),
  email: z.email({
    error: (issue) => {
      const { input } = issue
      if (typeof input === "string") {
        if (input.length === 0) {
          return "The email is required"
        }
      } else {
        return "Email must be a string"
      }

      return issue.message
    }
  }),
});

export type UserFormValues = z.infer<typeof userSchema>;
