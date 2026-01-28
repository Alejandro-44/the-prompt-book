import type { PaginatedResponse } from "../api/api.types";

export type Prompt = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  model: string;
  resultExample?: string;
  mediaUrl?: string;
  hashtags: string[];
  pubDate: Date;
  likesCount: number;
  likeByMe: boolean;
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
  likesCount: number;
  pubDate: Date;
  authorName: string;
  authorHandle: string;
};

export type PromptCreate = {
  title: string;
  description: string;
  prompt: string;
  model: string;
  resultExample?: string;
  mediaUrl?: string;
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

export type PaginatedComments = PaginatedResponse<PromptComment>;

export type GetPromptsParams = {
  page?: number;
  limit?: number;
  search?: string;
  hashtags?: string[];
  model?: string;
  author_handle?: string;
  liked_by?: string;
};

