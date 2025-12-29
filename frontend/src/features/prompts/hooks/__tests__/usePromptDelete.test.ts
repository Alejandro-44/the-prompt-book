import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { waitFor } from "@testing-library/react";
import { usePromptDelete } from "../usePromptDelete";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});


describe("usePromptDelete", () => {
  it("redirects to /users/me on success", async () => {
    const mockPromptId = "abc-123";
    const { result } = renderHookWithClient(() => usePromptDelete({ promptId: mockPromptId }));

    result.current.mutate();
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/users/me");
    })  
  });
});
