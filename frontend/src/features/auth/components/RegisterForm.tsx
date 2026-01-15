import { AlertCircleIcon } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { RHFInput } from "@/components/RHFInput";
import type { RegisterFormValues } from "../schemas/register.schema";
import { useRegisterForm, useRegister } from "../hooks";

export const RegisterForm = () => {
  const { mutate, isPending, error } = useRegister();
  const methods = useRegisterForm();
  const onSubmit = methods.handleSubmit((data: RegisterFormValues) => {
    mutate(data);
  });

  const errorMessage = error?.message;

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
        <RHFInput
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Sign Up"}
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
