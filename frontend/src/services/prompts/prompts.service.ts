import { httpClient } from "../api/httpClient";
import type {
  GetPromptsResponse,
  PromptCommentDTO,
  PromptDTO,
} from "./prompts.dto";
import type {
  GetPromptsParams,
  PaginatedPrompts,
  Prompt,
  PromptCommentCreate,
  PromptCreate,
  PromptCreateResponse,
} from "./prompts.model";
import {
  promptCommentMapper,
  promptCreateMapper,
  promptMapper,
  promptSummaryMapper,
  promptUpdateMapper,
} from "./prompts.mapper";

export class PromptsService {
  static async getAllPrompts(params: GetPromptsParams): Promise<PaginatedPrompts> {
    const data = await httpClient.get<GetPromptsResponse>("/prompts/", { params });
    const processedPrompts = data.items.map(promptSummaryMapper.toPromptSummary);
    return {
      items: processedPrompts,
      total: data.total,
      limit: data.limit,
      page: data.page,
      pages: data.pages
    }
  }

  static async getPromptDetail(id: string): Promise<Prompt> {
    const data = await httpClient.get<PromptDTO>(`/prompts/${id}`);
    return promptMapper.toPrompt(data);
  }

  static async create(prompt: PromptCreate) {
    const promptDTO = promptCreateMapper.toPromptCreateDTO(prompt);
    const data = await httpClient.post<PromptCreateResponse>(
      "/prompts/",
      promptDTO
    );
    return {
      id: data.id,
      message: data.message,
    };
  }

  static async update(id: string, prompt: Partial<PromptCreate>) {
    const promptDTO = promptUpdateMapper.toPartialPromptCreateDTO(prompt);
    await httpClient.patch(`/prompts/${id}`, promptDTO);
  }

  static async delete(id: string) {
    await httpClient.delete(`/prompts/${id}`);
  }

  static async getPromptComments(id: string) {
    const data = await httpClient.get<PromptCommentDTO[]>(
      `/prompts/${id}/comments`
    );
    return data.map(promptCommentMapper.toPromptComment);
  }

  static async createComment(id: string, comment: PromptCommentCreate) {
    await httpClient.post(
      `/prompts/${id}/comments`,
      comment
    );
  }
}
