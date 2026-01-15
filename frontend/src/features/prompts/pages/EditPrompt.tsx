import { PromptForm } from "../components/PromptForm";
import type { PromptFormValues } from "../schemas";
import type { Prompt, PromptCreate } from "@/services";
import { useOutletContext, useParams } from "react-router";
import { getPromptChanges } from "@/utils";
import { usePromptDelete, usePromptUpdate } from "../hooks";
import { Card, CardContent } from "@/components/ui/card";

export function EditPrompt() {
  const { promptId } = useParams();
  const { prompt } = useOutletContext<{ prompt: Prompt }>();
  const { mutate: updatePrompt, isPending: isUpdatePending } = usePromptUpdate({ promptId: promptId || "" });
  const { mutate: deletePrompt, isPending: isDeletePending } = usePromptDelete({ promptId: promptId || "" });

  const handleUpdatePrompt = (data: PromptFormValues) => {
    const originalPrompt: PromptCreate = {
      title: prompt.title,
      description: prompt.description,
      prompt: prompt.prompt,
      model: prompt.model,
      resultExample: prompt.resultExample,
    };
    const changes = getPromptChanges(originalPrompt, data);
    updatePrompt(changes);
  };

  const handleDeletePrompt = () => {
    deletePrompt();
  }

  return (
    <Card className="w-full">
      <CardContent className="px-6">
        <PromptForm
          mode="edit"
          onSubmit={handleUpdatePrompt}
          defaultValues={prompt}
          isLoading={isUpdatePending || isDeletePending}
          onDelete={handleDeletePrompt}
        />
      </CardContent>
    </Card>
  );
}
