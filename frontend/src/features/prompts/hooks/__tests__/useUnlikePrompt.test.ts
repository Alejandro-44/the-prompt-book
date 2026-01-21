import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useUnlikePrompt } from "../useUnlikePrompt";
import { act, waitFor } from "@testing-library/react";

describe("useLikePrompt", () => {
  it("like a prompt sucessfully", async () => {
    const mockPromptId = "69398c1d5393462cecf974c8";

    const { result, queryClient } = renderHookWithClient(() =>
      useUnlikePrompt({ promptId: mockPromptId }),
    );

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["prompt", mockPromptId],
    });
  });
});
