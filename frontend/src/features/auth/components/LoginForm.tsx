import { FormProvider } from "react-hook-form";
import { AlertCircleIcon } from "lucide-react";

import { useLoginForm } from "../hooks/useLoginForm";
import { useLogin } from "../hooks/useAuth";
import type { LoginFormValues } from "../schemas/login.schema";
import { RHFInput } from "@/components/RHFInput";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

export const LoginForm = () => {
  const { mutate, isPending, error } = useLogin();
  const methods = useLoginForm();

  const onSubmit = methods.handleSubmit((data: LoginFormValues) => {
    mutate(data);
    methods.reset();
  });

  const errorMessage = error?.message;

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <RHFInput
          name="email"
          type="email"
          label="Email"
          placeholder="youremail@example.com"
        />
        <RHFInput
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
        />
        <Button className="cursor-pointer" type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Sign In"}
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        )}
      </form>
    </FormProvider>
  );
};
