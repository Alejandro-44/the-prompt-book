export type User = {
  id: string;
  username: string;
  handle: string;
  isActive: boolean;
};

export type UserUpdate = Partial<User & { email: string }>;
