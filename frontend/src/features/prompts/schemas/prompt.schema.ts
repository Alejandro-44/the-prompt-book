import * as z from "zod";

export const promptSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Maximum 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    prompt: z.string().min(10, "Prompt must be at least 10 characters"),
    model: z.string().min(1, "Select a model"),
    resultExample: z
      .string()
      .min(10, "Result example must be at least 10 characters")
      .optional()
      .or(z.literal("")),
    mediaUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasResultExample =
      typeof data.resultExample === "string" &&
      data.resultExample.trim() !== "";

    const hasMediaUrl =
      typeof data.mediaUrl === "string" && data.mediaUrl.trim() !== "";

    if (!hasResultExample && !hasMediaUrl) {
      ctx.addIssue({
        path: ["resultExample"],
        message: "You must provide a result example or a media URL",
        code: "custom",
      });

      ctx.addIssue({
        path: ["mediaUrl"],
        message: "You must provide a media URL or a result example",
        code: "custom",
      });
    }
  });

export type PromptFormValues = z.infer<typeof promptSchema>;
