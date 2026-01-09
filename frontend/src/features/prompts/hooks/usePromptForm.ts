import { zodResolver } from "@hookform/resolvers/zod";
import { promptSchema, type PromptFormValues } from "../schemas/prompt.schema";
import { useForm } from "react-hook-form";
import type { PromptCreate } from "@/services";

type PromptFormProps = {
  defaultValues?: PromptCreate;
};

const emptyPrompt: PromptCreate = {
  title: "",
  description: "",
  prompt: "",
  model: "",
  resultExample: "",
};

export function usePromptForm({ defaultValues }: PromptFormProps) {
  return useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    criteriaMode: "all",
    mode: "all",
    defaultValues: defaultValues ?? emptyPrompt,
  });
}
