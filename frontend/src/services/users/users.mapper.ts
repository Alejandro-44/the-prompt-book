import type { PrivateUserDTO, UserDTO, UserUpdateDTO } from "./users.dto";
import type { PrivateUser, User, UserUpdate } from "./users.model";

export const userMapper = {
  toUser: (dto: UserDTO): User => ({
    id: dto.id,
    username: dto.username,
    handle: dto.handle,
    isActive: dto.is_active,
  }),
  toPrivateUser: (dto: PrivateUserDTO): PrivateUser => ({
    id: dto.id,
    username: dto.username,
    email: dto.email,
    handle: dto.handle,
    isActive: dto.is_active
  }),
  toUpdateUserDTO: (model: UserUpdate) => {
    const dto: UserUpdateDTO = {};
    if (model.username !== undefined) {
      dto.username = model.username;
    }
    if (model.handle !== undefined) {
      dto.handle = model.handle;
    }
    if (model.email !== undefined) {
      dto.email = model.email;
    }
    return dto;
  },
};
