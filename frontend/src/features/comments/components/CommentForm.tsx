import { RHFInput } from "@/components/RHFInput";
import { FormProvider, useForm } from "react-hook-form";
import {
  commentSchema,
  type CommentFormValues,
} from "../schema/comment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@/services";
import { SendHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type CommentFormProps = {
  user: User;
  onSubmit: (data: CommentFormValues) => void;
};

export function CommentForm({ user, onSubmit }: CommentFormProps) {
  const methods = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
    methods.reset();
  });

  return (
    <FormProvider {...methods}>
      <form className="flex items-center gap-4" onSubmit={handleSubmit}>
          <Avatar>
            <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <RHFInput
            name="content"
            label=""
            placeholder="Add your comment..."
          />
          <Button type="submit"><SendHorizontal /></Button>
      </form>
    </FormProvider>
  );
}
