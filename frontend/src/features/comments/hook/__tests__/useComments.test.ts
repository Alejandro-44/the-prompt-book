import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useComments } from "../useComments";
import { waitFor } from "@testing-library/react";

const mockPromptId = "abc-123";

describe("useComments", () => {
  it("get the comments from a prompt", async () => {
    const { result } = renderHookWithClient(() =>
      useComments({ promptId: mockPromptId })
    );
    expect(result.current.comments).toBeUndefined();
    await waitFor(() => {
      expect(result.current.comments).toBeDefined();
    });
    expect(result.current.comments).toHaveLength(3);
  });
});
