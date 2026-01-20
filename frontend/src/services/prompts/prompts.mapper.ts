import type { PromptCommentDTO, PromptCreateDTO, PromptDTO, PromptSummaryDTO } from "./prompts.dto";
import type { Prompt, PromptComment, PromptCreate, PromptSummary } from "./prompts.model";

export const promptMapper = {
  toPrompt: (dto: PromptDTO): Prompt => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    prompt: dto.prompt,
    resultExample: dto.result_example,
    model: dto.model,
    hashtags: dto.hashtags,
    pubDate: new Date(dto.pub_date),
    likesCount: dto.likes_count,
    authorId: dto.author_id,
    authorName: dto.author_name,
    authorHandle: dto.author_handle,
  }),
};

export const promptSummaryMapper = {
  toPromptSummary: (dto: PromptSummaryDTO): PromptSummary => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    hashtags: dto.hashtags,
    model: dto.model,
    pubDate: new Date(dto.pub_date),
    likesCount: dto.likes_count,
    authorName: dto.author_name,
    authorHandle: dto.author_handle,
  }),
};

export const promptCreateMapper = {
  toPromptCreateDTO: (model: PromptCreate): PromptCreateDTO => ({
    title: model.title,
    description: model.description,
    prompt: model.prompt,
    result_example: model.resultExample,
    model: model.model
  }),
};

export const promptUpdateMapper = {
  toPartialPromptCreateDTO: (model: Partial<PromptCreate>): Partial<PromptCreateDTO> => {
    const dto: Partial<PromptCreateDTO> = {};
    if (model.title !== undefined) {
      dto.title = model.title;
    }
    if (model.description !== undefined) {
      dto.description = model.description;
    }
    if (model.prompt !== undefined) {
      dto.prompt = model.prompt;
    }
    if (model.resultExample !== undefined) {
      dto.result_example = model.resultExample;
    }
    if (model.model !== undefined) {
      dto.model = model.model;
    }
    return dto;
  },
};

export const promptCommentMapper = {
  toPromptComment: (dto: PromptCommentDTO): PromptComment => ({
    id: dto.id,
    content: dto.content,
    promptId: dto.prompt_id,
    pubDate: new Date(dto.pub_date),
    authorId: dto.author_id,
    authorName: dto.author_name,
    authorHandle: dto.author_handle,
  }),
};
