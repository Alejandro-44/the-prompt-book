import { PromptForm } from "../components/PromptForm";
import type { PromptFormValues } from "../schemas";
import { useCreatePrompt } from "../hooks";
import { Card, CardContent } from "@/components/ui/card";

export function CreatePrompt() {
  const { mutate, isPending } = useCreatePrompt();

  const handleCreatePrompt = (data: PromptFormValues) => {
    console.log(data)
    mutate(data);
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardContent className="px-6">
        <PromptForm
          mode="create"
          onSubmit={handleCreatePrompt}
          isLoading={isPending}
        />
      </CardContent>
    </Card>
  );
}
