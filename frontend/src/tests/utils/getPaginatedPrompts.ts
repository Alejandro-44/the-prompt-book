import type { GetPromptsParams } from "@/services";
import type { PromptSummaryDTO } from "@/services/prompts/prompts.dto";

export function getPaginatedPrompts(
  promptsSummaryMocks: PromptSummaryDTO[],
  { page = 1, limit = 10, user_id, model, tags }: GetPromptsParams
) {
  const filtered = promptsSummaryMocks.filter((prompt) => {
    let isValid = true;
    if (user_id) {
      isValid &&= prompt.author_id === user_id;
    }
    if (model) {
      isValid &&= prompt.model === model;
    }
    if (tags) {
      isValid &&= prompt.tags.some((promptTags) => tags.includes(promptTags));
    }

    return isValid;
  });

  const skip = (page - 1) * limit;
  const items = filtered.slice(skip, skip+limit) || [];

  return {
    items,
    total: filtered.length,
    pages: Math.ceil(filtered.length / limit),
    page,
    limit,
  };
}
