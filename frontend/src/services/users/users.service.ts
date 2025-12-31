import { httpClient } from "../api/httpClient";
import type { UserDTO } from "./users.dto";
import type { User } from "./users.model";
import { userMapper } from "./users.mapper";
import type { GetPromptsParams, PaginatedPrompts } from "../prompts/prompts.model";
import type { GetPromptsResponse } from "../prompts/prompts.dto";
import { promptSummaryMapper } from "../prompts/prompts.mapper";

export class UsersService {
  static async getMe(): Promise<User> {
    const data = await httpClient.get<UserDTO>("/users/me");
    return userMapper.toUser(data);
  }

  static async deleteMe(): Promise<void> {
    await httpClient.delete("/users/me");
  }

  static async getMyPrompts(params: GetPromptsParams): Promise<PaginatedPrompts> {
    const data = await httpClient.get<GetPromptsResponse>("/users/me/prompts/", { params });
    const processedPrompts = data.items.map(promptSummaryMapper.toPromptSummary);
    return {
      items: processedPrompts,
      total: data.total,
      limit: data.limit,
      page: data.page,
      pages: data.pages
    }
  }

  static async getUserById(userId: string): Promise<User> {
    const data = await httpClient.get<UserDTO>(`/users/${userId}`);
    return userMapper.toUser(data);
  }

  static async getUserPrompts(userId: string, params: GetPromptsParams): Promise<PaginatedPrompts> {
    const data = await httpClient.get<GetPromptsResponse>(`/users/${userId}/prompts/`, { params });
    const processedPrompts = data.items.map(promptSummaryMapper.toPromptSummary);
    return {
      items: processedPrompts,
      total: data.total,
      limit: data.limit,
      page: data.page,
      pages: data.pages
    }
  }
}
