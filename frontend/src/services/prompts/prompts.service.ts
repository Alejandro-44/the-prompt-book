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
  PromptComment,
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
  static async getAllPrompts(params: GetPromptsParams): Promise<{ data: PaginatedPrompts, status: number }> {
    const response = await httpClient.get<GetPromptsResponse>("/prompts/", { params });
    const { data } = response;
    const processedPrompts = data.items.map(promptSummaryMapper.toPromptSummary);
    return {
      data: {
        items: processedPrompts,
        total: data.total,
        limit: data.limit,
        page: data.page,
        pages: data.pages
      },
      status: response.status
    }
  }

  static async getPromptDetail(id: string): Promise<{ data: Prompt, status: number }> {
    const response = await httpClient.get<PromptDTO>(`/prompts/${id}`);
    const { data } = response;
    return { data: promptMapper.toPrompt(data), status: response.status };
  }

  static async create(prompt: PromptCreate): Promise<{ data: { id: string, message: string }, status: number }> {
    const promptDTO = promptCreateMapper.toPromptCreateDTO(prompt);
    const response = await httpClient.post<PromptCreateResponse>(
      "/prompts/",
      promptDTO
    );
    const { data } = response;
    return {
      data: {
        id: data.id,
        message: data.message,
      },
      status: response.status
    };
  }

  static async update(id: string, prompt: Partial<PromptCreate>): Promise<{ status: number }> {
    const promptDTO = promptUpdateMapper.toPartialPromptCreateDTO(prompt);
    const response = await httpClient.patch(`/prompts/${id}`, promptDTO);
    return { status: response.status };
  }

  static async delete(id: string): Promise<{ status: number }> {
    const response = await httpClient.delete(`/prompts/${id}`);
    return { status: response.status };
  }

  static async getPromptComments(id: string): Promise<{ data: PromptComment[], status: number }> {
    const response = await httpClient.get<PromptCommentDTO[]>(
      `/prompts/${id}/comments`
    );
    const { data } = response;
    return { data: data.map(promptCommentMapper.toPromptComment), status: response.status };
  }

  static async createComment(id: string, comment: PromptCommentCreate): Promise<{ status: number }> {
    const response = await httpClient.post(
      `/prompts/${id}/comments`,
      comment
    );
    return { status: response.status };
  }
}
