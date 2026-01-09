import { httpClient } from "../api/httpClient";
import type { UserDTO } from "./users.dto";
import type { User } from "./users.model";
import { userMapper } from "./users.mapper";
import type { GetPromptsParams, PaginatedPrompts } from "../prompts/prompts.model";
import type { GetPromptsResponse } from "../prompts/prompts.dto";
import { promptSummaryMapper } from "../prompts/prompts.mapper";

export class UsersService {
  static async getMe(): Promise<{ data: User, status: number }> {
    const response = await httpClient.get<UserDTO>("/users/me");
    const { data } = response;
    return { data: userMapper.toUser(data), status: response.status };
  }

  static async deleteMe(): Promise<{ status: number }> {
    const response = await httpClient.delete("/users/me");
    return { status: response.status };
  }

  static async getMyPrompts(params: GetPromptsParams): Promise<{ data: PaginatedPrompts, status: number }> {
    const response = await httpClient.get<GetPromptsResponse>("/users/me/prompts/", { params });
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

  static async getUserById(userId: string): Promise<{ data: User, status: number }> {
    const response = await httpClient.get<UserDTO>(`/users/${userId}`);
    const { data } = response;
    return { data: userMapper.toUser(data), status: response.status };
  }

  static async getUserPrompts(user_handle: string, params: GetPromptsParams): Promise<{ data: PaginatedPrompts, status: number }> {
    const { data, status } = await httpClient.get<GetPromptsResponse>(`/users/${user_handle}/prompts/`, { params });
    const processedPrompts = data.items.map(promptSummaryMapper.toPromptSummary);
    return {
      data: {
        items: processedPrompts,
        total: data.total,
        limit: data.limit,
        page: data.page,
        pages: data.pages
      },
      status
    }
  }
}
