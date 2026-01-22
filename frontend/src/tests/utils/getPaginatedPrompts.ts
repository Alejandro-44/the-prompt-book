import type { GetPromptsParams } from "@/services";
import type { PromptSummaryDTO } from "@/services/prompts/prompts.dto";

export function getPaginatedPrompts(
  promptsSummaryMocks: PromptSummaryDTO[],
  { page = 1, limit = 10, author_handle, model, hashtags, liked_by, search }: GetPromptsParams
) {
  const filtered = promptsSummaryMocks.filter((prompt) => {
    let isValid = true;
    if (author_handle) {
      isValid &&= prompt.author_handle === author_handle;
    }
    if (model) {
      isValid &&= prompt.model === model;
    }
    if (hashtags) {
      isValid &&= prompt.hashtags.some((promptTags) => hashtags.includes(promptTags));
    }

    if (liked_by) {
      isValid &&= prompt.id === "69398c1d5393462cecf974c9"
    }

    if (search) {
      const regex = new RegExp(search, "i")
      isValid &&= regex.test(prompt.title) || regex.test(prompt.description)  
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
