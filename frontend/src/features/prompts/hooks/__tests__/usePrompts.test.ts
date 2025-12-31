import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { usePrompts } from "../usePrompts";
import { waitFor } from "@testing-library/react";

describe("usePrompts", () => {
  it("should fetch and return prompts successfully in multiple pages", async () => {
    const { result, rerender } = renderHookWithClient(
      ({ page }) => usePrompts({ page }),
      { initialProps: { page: 1 } }
    );

    expect(result.current.prompts).toBeUndefined();
    expect(result.current.page).toBe(2)

    await waitFor(() => {
      expect(result.current.prompts).toBeDefined();
    });

    expect(result.current.prompts).toHaveLength(10);

    rerender({ page: 2 })

    await waitFor(() => {
      expect(result.current.prompts).toBeDefined();
    });

    expect(result.current.prompts).toHaveLength(8);
  });
});
