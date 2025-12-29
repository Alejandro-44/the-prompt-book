import { httpClient } from "../api/httpClient";
import type {
  PromptCommentDTO,
  PromptDTO,
  PromptSummaryDTO,
} from "./prompts.dto";
import type {
  Prompt,
  PromptCommentCreate,
  PromptCreate,
  PromptCreateResponse,
  PromptSummary,
} from "./prompts.model";
import {
  promptCommentMapper,
  promptCreateMapper,
  promptMapper,
  promptSummaryMapper,
  promptUpdateMapper,
} from "./prompts.mapper";

export class PromptsService {
  static async getAllPrompts(): Promise<PromptSummary[]> {
    const data = await httpClient.get<PromptSummaryDTO[]>("/prompts/");
    return data.map(promptSummaryMapper.toPromptSummary);
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
