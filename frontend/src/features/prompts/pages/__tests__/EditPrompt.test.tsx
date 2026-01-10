import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { EditPrompt } from "../EditPrompt";
import { screen } from "@testing-library/react";
import { vi } from "vitest";

const mockPrompt = {
  id: "abc-123",
  title: "Generate a marketing headline",
  prompt: "Write a catchy marketing headline for a SaaS that helps users automate workflows.",
  resultExample: "Automate Everything: The Smartest Way to Scale Your Productivity.",
  model: "gpt-4",
  tags: ["marketing", "copywriting", "saas"],
  pub_date: "2024-01-15T10:30:00Z",
  author: {
    id: "123-abc",
    username: "johndoe",
    email: "johndoe@example.com",
  },
};

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useOutletContext: () => ({ prompt: mockPrompt }),
  };
});

vi.mock("@/utils", () => ({
  getPromptChanges: vi.fn(() => ({ title: "Changed Title" })),
}));

describe("EditPrompt", () => {
  it("renders the PromptForm in edit mode with default values", () => {
    renderWithProviders(<EditPrompt />);

    expect(screen.getByLabelText(/title/i)).toBeDefined();
    expect(screen.getByLabelText(/description/i)).toBeDefined();
    expect(screen.getByLabelText(/prompt/i)).toBeDefined();
    expect(screen.getByLabelText(/result/i)).toBeDefined();
    expect(screen.getByLabelText(/model/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /delete/i })).toBeDefined();
  });

  it("displays default values from the prompt", () => {
    renderWithProviders(<EditPrompt />);

    expect(screen.getByDisplayValue(mockPrompt.title)).toBeDefined();
    expect(screen.getByDisplayValue(mockPrompt.prompt)).toBeDefined();
    expect(screen.getByDisplayValue(mockPrompt.resultExample)).toBeDefined();
  });
});
