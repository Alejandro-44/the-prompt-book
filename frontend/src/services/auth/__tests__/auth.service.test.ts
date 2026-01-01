import { AuthService } from "../auth.service";

describe("AuthService", () => {
  it("should register a user", async () => {
    const newUser = await AuthService.register({
      username: "testuser",
      email: "test@example.com",
      password: "123456",
    });

    expect(newUser).toEqual({
      id: "new-user-id",
      username: "testuser",
      isActive: true,
    });
  });

  it("should fail to register with an existing email and return 409", async () => {
    await expect(
      AuthService.register({
        username: "johndoe",
        email: "johndoe@example.com",  
        password: "securepassword",
      })
    ).rejects.toThrowError();
  });

  it("should login and return a token", async () => {
    const token = await AuthService.login({
      email: "johndoe@example.com",
      password: "password123",
    });

    expect(token).toEqual({
      accessToken: "mocked-jwt-token",
      tokenType: "bearer",
    });
  });
});
