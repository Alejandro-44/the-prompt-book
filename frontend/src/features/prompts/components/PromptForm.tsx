import { RHFInput } from "@/components/RHFInput";
import { FormProvider } from "react-hook-form";
import { usePromptForm } from "../hooks/usePromptForm";
import type { PromptFormValues } from "../schemas";
import type { PromptCreate } from "@/services";
import { useNavigate } from "react-router";
import { MODELS } from "@/constants";
import { Button } from "@/components/ui/button";
import { RHFTextArea } from "@/components/RHFTextarea";
import { RHFSelect } from "@/components/RHFSelect";

type PromptFormProps = {
  mode: "create" | "edit";
  onSubmit: (data: PromptFormValues) => void;
  isLoading?: boolean;
  defaultValues?: PromptCreate;
  onDelete?: () => void;
};

export function PromptForm({
  mode,
  onSubmit,
  isLoading,
  defaultValues,
  onDelete,
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
  };

  const handleOnCancel = () => {
    navigate("/");
  };

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <RHFInput name="title" label="Title" />
        <RHFTextArea name="description" label="Description" />
        <RHFTextArea name="prompt" label="Prompt" />
        <RHFSelect name="model" label="Model" options={MODELS} placeholder="Select a model" />
        <RHFTextArea name="resultExample" label="Result" />
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleOnCancel}>
            Cancel
          </Button>
          {mode === "edit" ? (
            <Button
              variant="destructive"
              onClick={handleOnDelete}
              type="button"
              disabled={isLoading}
            >
              Delete
            </Button>
          ) : null}
          <Button type="submit" disabled={isLoading}>
            {mode === "create" ? "Share" : "Save changes"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
