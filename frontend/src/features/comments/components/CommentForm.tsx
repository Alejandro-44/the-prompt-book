import Input from "@/components/Input";
import { FormProvider, useForm } from "react-hook-form";
import {
  commentSchema,
  type CommentFormValues,
} from "../schema/comment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Stack } from "@mui/material";
import type { User } from "@/services";
import { SendHorizontal } from "lucide-react";

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
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 16 }}>
            {user?.username.slice(0, 2).toUpperCase()}
          </Avatar>
          <Input
            variant="standard"
            name="content"
            label=""
            placeholder="Add your comment..."
          />
          <Button variant="text" type="submit"><SendHorizontal /></Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
