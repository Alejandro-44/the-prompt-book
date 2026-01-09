import type { PaginatedResponse } from "../api/api.types";

export type PromptDTO = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  result_example: string;
  model: string;
  hashtags: string[];
  pub_date: string;
  author_id: string;
  author_name: string;
  author_handle: string;
};

export type PromptSummaryDTO = {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  model: string;
  pub_date: string;
  author_name: string;
  author_handle: string;
};

export type PromptCreateDTO = {
  title: string;
  description: string;
  prompt: string;
  result_example: string;
  model: string;
};

export type PromptUpdateDTO = Partial<PromptCreateDTO>;

export type PromptCommentDTO = {
  id: string;
  content: string;
  prompt_id: string;
  pub_date: string;
  author_id: string;
  author_name: string;
  author_handle: string;
};

export type PromptCommentCreateDTO = {
  content: string;
};

export type GetPromptsResponse = PaginatedResponse<PromptSummaryDTO>;
