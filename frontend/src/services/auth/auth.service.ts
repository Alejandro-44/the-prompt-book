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
  static async register(data: UserCreateDTO): Promise<User> {
    const response = await httpClient.post<UserDTO>("/auth/register", data);
    return userMapper.toUser(response);
  }

  static async login(data: UserLoginDTO): Promise<Token> {
    const response = await httpClient.post<TokenDTO>("/auth/login", data);
    return authMapper.toToken(response);
  }

  static async logout(): Promise<void> {
    await httpClient.post<void>("/auth/logout");
  }

  static async changePassword(data: UpdatePasswordDTO): Promise<void> {
    await httpClient.post<void>("/auth/change-password", data);
  }
}
