import type { PromptCreate } from "@/services";


export function getPromptChanges(
  original: PromptCreate,
  current: PromptCreate
): Partial<PromptCreate> {
  const changes: Partial<PromptCreate> = {};

  if (original.title !== current.title) {
    changes.title = current.title;
  }

  if (original.description !== current.description) {
    changes.description = current.description;
  }

  if (original.prompt !== current.prompt) {
    changes.prompt = current.prompt;
  }

  if (original.resultExample !== current.resultExample) {
    changes.resultExample = current.resultExample;
  }

  if (original.mediaUrl !== current.mediaUrl) {
    changes.mediaUrl = current.mediaUrl;
  }

  if (original.model !== current.model) {
    changes.model = current.model;
  }

  return changes;
}
