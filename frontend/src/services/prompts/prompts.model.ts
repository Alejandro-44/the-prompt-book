import type { PaginatedResponse } from "../api/api.types";

export type Prompt = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  resultExample: string;
  model: string;
  hashtags: string[];
  pubDate: Date;
  authorId: string;
  authorName: string;
  authorHandle: string;
};

export type PromptSummary = {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  model: string;
  pubDate: Date;
  authorName: string;
  authorHandle: string;
};

export type PromptCreate = {
  title: string;
  description: string;
  prompt: string;
  resultExample: string;
  model: string;
};

export type PromptCreateResponse = {
  message: string;
  id: string;
};

export type PromptUpdate = Partial<PromptCreate>;

export type PromptComment = {
  id: string;
  content: string;
  promptId: string;
  pubDate: Date;
  authorId: string;
  authorName: string;
  authorHandle: string;
};

export type PromptCommentCreate = {
  content: string;
};

export type PaginatedPrompts = PaginatedResponse<PromptSummary>;

export type GetPromptsParams = {
  page?: number;
  limit?: number;
  search?: string;
  hashtags?: string[];
  model?: string;
  author_handle?: string;
};

