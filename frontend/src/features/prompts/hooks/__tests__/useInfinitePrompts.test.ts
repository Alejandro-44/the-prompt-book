import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { act, waitFor } from "@testing-library/react";
import { useInfinitePrompts } from "../useInfinitePrompts";

describe("usePrompts", () => {
  it("fetches prompts and returns data", async () => {
    const { result } = renderHookWithClient(() => useInfinitePrompts());
    expect(result.current.isFetching).toBe(true);
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.prompts).toHaveLength(10);
  });

  it("page and appends prompts", async () => {
    const { result } = renderHookWithClient(() => useInfinitePrompts());
    expect(result.current.isFetching).toBe(true);
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.prompts).toHaveLength(10);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    expect(result.current.prompts).toHaveLength(18);
  });


  it("sets hasNextPage to false on last page", async () => {
    const { result } = renderHookWithClient(() => useInfinitePrompts());
    expect(result.current.isFetching).toBe(true);
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    expect(result.current.prompts).toHaveLength(10);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
    
    expect(result.current.hasNextPage).toBe(false);
  });
});
