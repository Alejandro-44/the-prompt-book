import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useUpdateUser } from "../useUpdateUser";
import { UsersService } from "@/services";
import { act } from "@testing-library/react";
import type { PrivateUser, UserUpdate } from "@/services";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/services", () => ({
  UsersService: {
    update: vi.fn(),
  },
}));

vi.mock("@/services", () => ({
  UsersService: {
    update: vi.fn(),
  },
}));

describe("useUpdateUser", () => {
  const mockUser: PrivateUser = {
    id: "user-1",
    username: "testuser",
    email: "test@example.com",
    handle: "testuser",
    isActive: true,
  };

  const mockUserData: UserUpdate = {
    username: "Updated Name",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call UsersService.update with correct arguments on mutation", async () => {
    const { result } = renderHookWithClient(() =>
      useUpdateUser({ user: mockUser })
    );

    await act(async () => {
      await result.current.mutateAsync(mockUserData);
    });

    expect(UsersService.update)
  });

  it("should invalidate queries and navigate on success", async () => {
    const { result, queryClient } = renderHookWithClient(() =>
      useUpdateUser({ user: mockUser })
    );

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    
    await act(async () => {
      await result.current.mutateAsync(mockUserData);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["auth", "me"],
    });

    expect(mockNavigate).toHaveBeenCalledWith("/users/me");
  });
});
