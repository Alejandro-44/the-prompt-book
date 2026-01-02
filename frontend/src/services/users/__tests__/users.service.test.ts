import { UsersService } from "../users.service";

describe("UsersService", () => {
  it("should get the current logged user", async () => {
    const user = await UsersService.getMe();
    expect(user).toEqual({
      id: "6939872c7f7a423bcb83fe0b",
      username: "alex",
      isActive: true,
    });
  });

  it("should delete the current logged user", async () => {
    await expect(UsersService.deleteMe()).resolves.toBeUndefined();
  });

  it("should get the current user's prompts", async () => {
    const response = await UsersService.getMyPrompts({ page: 1 });
    
    expect(response.items).toHaveLength(4);
    expect(response.total).toBe(4)
  });

  it("should get a user by ID", async () => {
    const user = await UsersService.getUserById("6939872c7f7a423bcb83fe0b");
    expect(user).toEqual({
      id: "6939872c7f7a423bcb83fe0b",
      username: "alex",
      isActive: true,
    });
  });
  it("should get a user's prompts by user ID", async () => {
    const response = await UsersService.getUserPrompts("6939872c7f7a423bcb83fe0b", { page: 1 });
    expect(response.items).toHaveLength(4);
    expect(response.total).toBe(4)
  });
});
