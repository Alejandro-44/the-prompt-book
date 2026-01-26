export type User = {
  id: string;
  username: string;
  handle: string;
  isActive: boolean;
};

export type PrivateUser = {
  id: string;
  username: string;
  email: string;
  handle: string;
  isActive: boolean;
}

export type UserUpdate = Partial<PrivateUser>;

