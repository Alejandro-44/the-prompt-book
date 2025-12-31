import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useCreatePrompt } from "../usePromptCreate";
import { waitFor } from "@testing-library/react";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("usePromptCreate", () => {
  it("should navigate to new prompt detail on successful", async () => {
    const mockPrompt = {
      title: "Write a perfect essay",
      prompt: "Write a essay...",
      resultExample: "A prefect essay...",
      model: "gpt-5",
      tags: ["ai", "poem"],
    };

    const { result } = renderHookWithClient(useCreatePrompt);

    result.current.mutate(mockPrompt);
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/prompts/mockedid789456");
    })
  });
});
