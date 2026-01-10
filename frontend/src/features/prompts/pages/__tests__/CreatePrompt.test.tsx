import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { CreatePrompt } from "../CreatePrompt";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

const mockMutate = vi.fn();
const mockIsPending = false;

vi.mock("../../hooks/usePromptCreate", () => ({
  useCreatePrompt: () => ({
    mutate: mockMutate,
    isPending: mockIsPending,
  }),
}));

describe("CreatePrompt", () => {
  it("renders the PromptForm in create mode", () => {
    renderWithProviders(<CreatePrompt />);

    expect(screen.getByLabelText(/title/i)).toBeDefined();
    expect(screen.getByLabelText(/description/i)).toBeDefined();
    expect(screen.getByLabelText(/prompt/i)).toBeDefined();
    expect(screen.getByLabelText(/result/i)).toBeDefined();
    expect(screen.getByLabelText(/model/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /share/i })).toBeDefined();
  });
});
