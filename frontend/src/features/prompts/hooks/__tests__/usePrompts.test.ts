import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { usePrompts } from "../usePrompts";
import { waitFor } from "@testing-library/react";
import { act } from "react";

describe("usePrompts", () => {
  it("fetches prompts and returns data", async () => {
    const { result } = renderHookWithClient(() => usePrompts({ limit: 10 }));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prompts).toHaveLength(10);
    expect(result.current.page).toBe(1);
    expect(result.current.pages).toBe(2);
    expect(result.current.total).toBe(18);
  });

  it("fetches new data when page changes", async () => {
    const { result } = renderHookWithClient(usePrompts);

    await waitFor(() => {
      expect(result.current.prompts).toHaveLength(10);
    });

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.prompts).toHaveLength(8);
    expect(result.current.page).toBe(2);
    expect(result.current.pages).toBe(2);
    expect(result.current.total).toBe(18);
  });
});
