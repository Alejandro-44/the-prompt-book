import { AlertCircleIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { RHFInput } from "@/components/RHFInput";
import { userSchema, type UserFormValues } from "../schema/";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PrivateUser } from "@/services";

type UseFormProps = {
  user: PrivateUser;
  handleSubmit: (data: UserFormValues) => void;
  onDelete: () => void;
  isPending: boolean;
  error: Error | null;
};

export function UserForm({
  user,
  handleSubmit,
  onDelete,
  isPending,
  error,
}: UseFormProps) {
  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: user!,
  });
  const onSubmit = methods.handleSubmit((data: UserFormValues) => {
    handleSubmit(data);
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <RHFInput name="username" label="Username" placeholder="Username" />
        <RHFInput
          type="email"
          name="email"
          label="Email"
          placeholder="youremail@example.com"
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="destructive"
            type="button"
            disabled={isPending}
            onClick={onDelete}
          >
            {isPending ? "Loading..." : "Delete"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Save"}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{error.message}</AlertTitle>
          </Alert>
        )}
      </form>
    </FormProvider>
  );
}
