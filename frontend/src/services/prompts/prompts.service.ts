import { httpClient } from "../api/httpClient";
import type {
  GetCommentsResponse,
  GetPromptsResponse,
  PromptDTO,
} from "./prompts.dto";
import type {
  GetPromptsParams,
  PaginatedComments,
  PaginatedPrompts,
  Prompt,
  PromptCommentCreate,
  PromptCreate,
  PromptCreateResponse,
} from "./prompts.model";
import { promptMapper } from "./prompts.mapper";

export class PromptsService {
  static async getAllPrompts(
    params: GetPromptsParams,
  ): Promise<PaginatedPrompts> {
    const data = await httpClient.get<GetPromptsResponse>("/prompts/", {
      params,
    });
    const processedPrompts = data.items.map(promptMapper.toPromptSummary);
    return {
      items: processedPrompts,
      total: data.total,
      limit: data.limit,
      page: data.page,
      pages: data.pages,
    };
  }

  static async getPromptDetail(id: string): Promise<Prompt> {
    const data = await httpClient.get<PromptDTO>(`/prompts/${id}`);
    return promptMapper.toPrompt(data);
  }

  static async create(prompt: PromptCreate) {
    const promptDTO = promptMapper.toPromptCreateDTO(prompt);
    const data = await httpClient.post<PromptCreateResponse>(
      "/prompts/",
      promptDTO,
    );
    return {
      id: data.id,
      message: data.message,
    };
  }

  static async update(id: string, prompt: Partial<PromptCreate>) {
    const promptDTO = promptMapper.toPartialPromptCreateDTO(prompt);
    await httpClient.patch(`/prompts/${id}`, promptDTO);
  }

  static async delete(id: string) {
    await httpClient.delete(`/prompts/${id}`);
  }

  static async getPromptComments(
    id: string,
    page: number,
  ): Promise<PaginatedComments> {
    const data = await httpClient.get<GetCommentsResponse>(
      `/prompts/${id}/comments`,
      { params: { page } },
    );
    const processedComments = data.items.map(promptMapper.toPromptComment);
    return {
      items: processedComments,
      total: data.total,
      limit: data.limit,
      page: data.page,
      pages: data.pages,
    };
  }

  static async createComment(promptId: string, comment: PromptCommentCreate) {
    await httpClient.post(`/prompts/${promptId}/comments`, comment);
  }

  static async likePrompt(promptId: string) {
    await httpClient.post(`/prompts/${promptId}/like`);
  }

  static async unlikePrompt(promptId: string) {
    await httpClient.delete(`/prompts/${promptId}/like`);
  }
}
