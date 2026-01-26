export type UserDTO = {
  id: string;
  username: string;
  handle: string;
  is_active: boolean;
};

export type UserUpdateDTO = Partial<UserDTO & { email: string }>;
