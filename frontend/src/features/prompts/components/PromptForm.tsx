import Input from "@/components/Input";
import { Button, Grid, Stack } from "@mui/material";
import { FormProvider } from "react-hook-form";
import { usePromptForm } from "../hooks/usePromptForm";
import type { PromptFormValues } from "../schemas";
import { RHFAutocomplete } from "@/components/RHFAutocomplete";
import type { PromptCreate } from "@/services";
import { useNavigate } from "react-router";
import { MODELS } from "@/constants";

type PromptFormProps = {
  mode: "create" | "edit";
  onSubmit: (data: PromptFormValues) => void;
  isLoading?: boolean;
  defaultValues?: PromptCreate;
  onDelete?: () => void
};

export function PromptForm({
  mode,
  onSubmit,
  isLoading,
  defaultValues,
  onDelete
}: PromptFormProps) {
  const navigate = useNavigate();
  const methods = usePromptForm({ defaultValues });
  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
    if (mode === "create") {
      methods.reset();
    }
  });

  const handleOnDelete = () => {
    if (onDelete) {
      onDelete();
    }
  }

  const handleOnCancel = () => {
    navigate("/");
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Input name="title" label="Title" />
          </Grid>
          <Grid size={12}>
            <Input name="description" label="Description" multiline rows={4} />
          </Grid>
          <Grid size={12}>
            <Input name="prompt" label="Prompt" multiline rows={4} />
          </Grid>
          <Grid size={12}>
            <RHFAutocomplete name="model" label="Model" options={MODELS} />
          </Grid>
          <Grid size={12}>
            <Input name="resultExample" label="Result" multiline rows={4} />
          </Grid>
          <Grid size={12}>
            <Stack direction="row-reverse" spacing={2}>
              <Button variant="contained" type="submit" disabled={isLoading}>
                { mode === "create" ? "Share" : "Save changes"}
              </Button>
              { mode === "edit" ? (
                <Button onClick={handleOnDelete} variant="contained" type="button" disabled={isLoading}>
                  Delete
                </Button>
              ) : null }
              <Button variant="outlined" onClick={handleOnCancel}>Cancel</Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
