import { httpClient } from "../api/httpClient";
import type {
  UserCreateDTO,
  UserLoginDTO,
  UpdatePasswordDTO,
  TokenDTO,
} from "./auth.dto";
import type { UserDTO } from "../users/users.dto";

import { authMapper } from "./auth.mapper";
import { userMapper } from "../users/users.mapper";
import type { User } from "../users/users.model";
import type { Token } from "./auth.model";

export class AuthService {
  static async register(data: UserCreateDTO): Promise<{ user: User, status: number }> {
    const response = await httpClient.post<UserDTO>("/auth/register", data);
    return { user: userMapper.toUser(response.data), status: response.status };
  }

  static async login(data: UserLoginDTO): Promise<{ token: Token, status: number }> {
    const response = await httpClient.post<TokenDTO>("/auth/login", data);
    return { token: authMapper.toToken(response.data), status: response.status };
  }

  static async logout(): Promise<{ status: number }> {
    const response = await httpClient.post<void>("/auth/logout");
    return { status: response.status };
  }

  static async changePassword(data: UpdatePasswordDTO): Promise<{ status: number }> {
    const response = await httpClient.post<void>("/auth/change-password", data);
    return { status: response.status };
  }
}
