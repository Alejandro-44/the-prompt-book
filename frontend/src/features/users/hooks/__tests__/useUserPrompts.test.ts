import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useUserPrompts } from "../useUserPrompts";
import { waitFor } from "@testing-library/react";

describe("useUserPrompts", () => {
  it("fetches and returns current user's prompts when mode is 'me'", async () => {
    const { result } = renderHookWithClient(() =>
      useUserPrompts({ mode: "me" })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prompts).toHaveLength(4);
    expect(result.current.total).toBe(4);
    expect(result.current.page).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it("fetches and returns user's prompts when mode is 'public' and userId is provided", async () => {
    const { result } = renderHookWithClient(() =>
      useUserPrompts({ mode: "public", userId: "693987497f7a423bcb83fe0c" })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prompts).toHaveLength(4);
    expect(result.current.total).toBe(4);
    expect(result.current.page).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it("returns empty prompts when mode is 'public' and userId has no prompts", async () => {
    const { result } = renderHookWithClient(() =>
      useUserPrompts({ mode: "public", userId: "456-def" })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prompts).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it("does not fetch when mode is 'public' and userId is not provided", () => {
    const { result } = renderHookWithClient(() =>
      useUserPrompts({ mode: "public" })
    );

    expect(result.current.prompts).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
