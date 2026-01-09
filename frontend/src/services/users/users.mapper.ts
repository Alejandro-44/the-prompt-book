import type { UserDTO } from "./users.dto";
import type { User } from "./users.model";

export const userMapper = {
  toUser: (dto: UserDTO): User => ({
    id: dto.id,
    username: dto.username,
    handle: dto.handle,
    isActive: dto.is_active,
  }),
};
