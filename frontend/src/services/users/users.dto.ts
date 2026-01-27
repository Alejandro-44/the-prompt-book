export type UserDTO = {
  id: string;
  username: string;
  handle: string;
  is_active: boolean;
};

export type PrivateUserDTO = {
  id: string;
  username: string;
  email: string;
  handle: string;
  is_active: boolean;
}

export type UserUpdateDTO = Partial<PrivateUserDTO>;
