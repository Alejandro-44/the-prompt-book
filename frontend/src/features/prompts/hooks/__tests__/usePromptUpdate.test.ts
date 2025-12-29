import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { usePromptUpdate } from "../usePromptUpdate";
import { waitFor } from "@testing-library/react";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});


describe("usePromptUpdate", () => {
  it("redirects to /prompts/:promptId on success", async () => {
    const mockPromptId = "abc-123";
    const { result } = renderHookWithClient(() => usePromptUpdate({ promptId: mockPromptId }));

    result.current.mutate({ "title": "Updated title"});
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/prompts/abc-123");
    })  
  });
});
