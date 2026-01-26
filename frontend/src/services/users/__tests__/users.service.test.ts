import { UsersService } from "../users.service";

describe("UsersService", () => {
  it("should get the current logged user", async () => {
    const data = await UsersService.getMe();
    expect(data).toEqual({
      id: "6939872c7f7a423bcb83fe0b",
      username: "alex",
      handle: "alex",
      isActive: true,
    });
  });

  it("should delete the current logged user", async () => {
    await expect(UsersService.deleteMe()).resolves.toBeUndefined()
  });

  it("should get the current user's prompts", async () => {
    const data = await UsersService.getMyPrompts({ page: 1 });

    expect(data.items).toHaveLength(4);
    expect(data.total).toBe(4);
  });

  it("should get a user by ID", async () => {
    const data = await UsersService.getUser(
      "alex"
    );

    expect(data).toEqual({
      id: "6939872c7f7a423bcb83fe0b",
      username: "alex",
      handle: "alex",
      isActive: true,
    });
  });

  it("should get a user's prompts by user ID", async () => {
    const data = await UsersService.getUserPrompts(
      "alex",
      { page: 1 }
    );
    expect(data.items).toHaveLength(4);
    expect(data.total).toBe(4);
  });

  it("should call update user successfully", async () => {
    const mockUserId = "6939872c7f7a423bcb83fe0b"
    await UsersService.update(
      mockUserId,
      {
        username: "alex doe"
      }
    )

    const user = await UsersService.getUser("alex")
    expect(user.username).toBe("alex doe")
  })
});
