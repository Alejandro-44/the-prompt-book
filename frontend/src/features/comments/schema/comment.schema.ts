import * as z from "zod";

export const commentSchema = z.object({
  content: z.string("The comment must be a valid string").min(1, "The comment should have at least one character")
})

export type CommentFormValues = z.infer<typeof commentSchema>
