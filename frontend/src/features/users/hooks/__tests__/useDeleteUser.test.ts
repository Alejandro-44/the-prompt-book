import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useDeleteUser } from "../useDeleteUser";
import { UsersService } from "@/services";
import { act } from "@testing-library/react";

vi.mock("@/services", () => ({
  UsersService: {
    deleteMe: vi.fn(),
  },
}));

const mockLogout = vi.fn();
vi.mock("@/features/auth/hooks", () => ({
  useLogout: () => ({
    mutate: mockLogout,
  }),
}));

describe("useDeleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call logout and then UsersService.deleteMe on mutation", async () => {
    const { result } = renderHookWithClient(() => useDeleteUser());

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(UsersService.deleteMe).toHaveBeenCalled();
  });
});
