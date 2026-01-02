import type { PaginatedResponse } from "../api/api.types";

export type PromptDTO = {
  id: string;
  title: string;
  prompt: string;
  result_example: string;
  model: string;
  tags: string[];
  pub_date: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
};

export type PromptSummaryDTO = {
  id: string;
  title: string;
  tags: string[];
  model: string;
  pub_date: string;
  author_id: string;
  author_name: string;
};

export type PromptCreateDTO = {
  title: string;
  prompt: string;
  result_example: string;
  model: string;
  tags: string[];
}

export type PromptUpdateDTO = Partial<PromptCreateDTO>;

export type PromptCommentDTO = {
  id: string;
  content: string;
  prompt_id: string;
  author: string;
  pub_date: Date;
}

export type PromptCommentCreateDTO = {
  content: string;
}

export type GetPromptsResponse = PaginatedResponse<PromptSummaryDTO>
