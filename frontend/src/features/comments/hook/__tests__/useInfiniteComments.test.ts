import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useInfiniteComments } from "../useInfiniteComments";
import { waitFor } from "@testing-library/react";

const mockPromptId = "69398c1d5393462cecf974c9";

describe("useComments", () => {
  it("get the comments from a prompt", async () => {
    const { result } = renderHookWithClient(() =>
      useInfiniteComments({ promptId: mockPromptId })
    );
    expect(result.current.comments).toBeUndefined();
    await waitFor(() => {
      expect(result.current.comments).toBeDefined();
    });
    expect(result.current.comments).toHaveLength(3);
  });
});
