import { UsersService } from "../users.service";

describe("UsersService", () => {
  it("should get the current logged user", async () => {
    const { data } = await UsersService.getMe();
    expect(data).toEqual({
      id: "6939872c7f7a423bcb83fe0b",
      username: "alex",
      handle: "alex",
      isActive: true,
    });
  });

  it("should delete the current logged user", async () => {
    await expect(UsersService.deleteMe()).resolves.toEqual({ status: 204 });
  });

  it("should get the current user's prompts", async () => {
    const { data, status } = await UsersService.getMyPrompts({ page: 1 });

    expect(status).toBe(200);
    expect(data.items).toHaveLength(4);
    expect(data.total).toBe(4);
  });

  it("should get a user by ID", async () => {
    const { data, status } = await UsersService.getUserById(
      "6939872c7f7a423bcb83fe0b"
    );
    expect(status).toBe(200);
    expect(data).toEqual({
      id: "6939872c7f7a423bcb83fe0b",
      username: "alex",
      handle: "alex",
      isActive: true,
    });
  });

  it("should get a user's prompts by user ID", async () => {
    const { data } = await UsersService.getUserPrompts(
      "alex",
      { page: 1 }
    );
    expect(data.items).toHaveLength(4);
    expect(data.total).toBe(4);
  });
});
