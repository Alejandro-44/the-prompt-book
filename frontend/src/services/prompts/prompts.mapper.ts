import type { PromptCommentDTO, PromptCreateDTO, PromptDTO, PromptSummaryDTO } from "./prompts.dto";
import type { Prompt, PromptComment, PromptCreate, PromptSummary } from "./prompts.model";

export const promptMapper = {
  toPrompt: (dto: PromptDTO): Prompt => ({
    id: dto.id,
    title: dto.title,
    prompt: dto.prompt,
    resultExample: dto.result_example,
    model: dto.model,
    tags: dto.tags,
    pubDate: new Date(dto.pub_date),
    author: {
      id: dto.author.id,
      username: dto.author.username,
      email: dto.author.email,
    },
  }),
};

export const promptSummaryMapper = {
  toPromptSummary: (dto: PromptSummaryDTO): PromptSummary => ({
    id: dto.id,
    title: dto.title,
    tags: dto.tags,
    model: dto.model,
    pubDate: new Date(dto.pub_date),
    authorId: dto.author_id,
    authorName: dto.author_name,
  }),
};

export const promptCreateMapper = {
  toPromptCreateDTO: (model: PromptCreate): PromptCreateDTO => ({
    title: model.title,
    prompt: model.prompt,
    result_example: model.resultExample,
    model: model.model,
    tags: model.tags,
  }),
}

export const promptUpdateMapper = {
  toPartialPromptCreateDTO: (model: Partial<PromptCreate>): Partial<PromptCreateDTO> => {
    const dto: Partial<PromptCreateDTO> = {};
    if (model.title !== undefined) {
      dto.title = model.title;
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
    if (model.tags !== undefined) {
      dto.tags = model.tags;
    }
    return dto;
  },
}

export const promptCommentMapper = {
  toPromptComment: (dto: PromptCommentDTO): PromptComment => ({
    id: dto.id,
    content: dto.content,
    promptId: dto.prompt_id,
    author: dto.author,
    pubDate: dto.pub_date
  })
}
