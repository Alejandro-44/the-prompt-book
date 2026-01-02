import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useCreateComment } from "../useCreateComment";
import { act, waitFor } from "@testing-library/react";

describe("useCreateComment", () => {
  it("creates a comment and invalidates comments query", async () => {
    const promptId = "69398c1d5393462cecf974c9";
    const { result, queryClient } = renderHookWithClient(() =>
      useCreateComment({ promptId })
    );

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    act(() => {
      result.current.mutate({ content: "Hola" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["prompt", promptId, "comments"],
    });
  });
});
