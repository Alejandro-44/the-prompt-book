import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { PromptForm } from "../PromptForm";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const mockOnSubmit = vi.fn();
const mockOnDelete = vi.fn();

const mockPrompt = {
  id: "abc-123",
  title: "Generate a marketing headline",
  description: "With this prompt I ",
  prompt:
    "Write a catchy #marketing headline for a #SaaS that helps users automate workflows.",
  resultExample:
    "Automate Everything: The Smartest Way to Scale Your Productivity.",
  model: "gpt-4",
  hashtags: ["marketing", "saas"],
};

describe("PromptForm", () => {
  describe("PromptForm creation mode", () => {
    afterEach(() => {
      cleanup();
    });

    it("renders without crashing", () => {
      renderWithProviders(<PromptForm mode="create" onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/title/i)).toBeDefined();
      expect(screen.getByLabelText(/prompt/i)).toBeDefined();
      expect(screen.getByLabelText(/description/i)).toBeDefined();
      expect(screen.getByLabelText(/result/i)).toBeDefined();
      expect(screen.getByLabelText(/model/i)).toBeDefined();
      expect(screen.getByRole("button", { name: /share/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeDefined();
    });

    it("call onSubmit function when it send a new prompt", async () => {
      renderWithProviders(<PromptForm mode="create" onSubmit={mockOnSubmit} />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/title/i), mockPrompt.title);
      await user.type(
        screen.getByLabelText(/description/i),
        mockPrompt.description
      );
      await user.type(screen.getByLabelText(/prompt/i), mockPrompt.prompt);
      await user.type(
        screen.getByLabelText(/result/i),
        mockPrompt.resultExample
      );

      const hiddenSelect = document.querySelector(
        'select[aria-hidden="true"]'
      ) as HTMLSelectElement;

      fireEvent.change(hiddenSelect, {
        target: { value: "gpt-4" },
      });

      await user.click(screen.getByRole("button", { name: /share/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it("display errors when fields are empty or with wrong format", async () => {
      renderWithProviders(<PromptForm mode="create" onSubmit={mockOnSubmit} />);
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /share/i }));
      const errors = await screen.findAllByRole("alert");
      expect(errors).toHaveLength(5);
      expect(errors[0].textContent).toBe(
        "Title must be at least 3 characters"
      );
      expect(errors[1].textContent).toBe(
        "Description must be at least 10 characters"
      );
      expect(errors[2].textContent).toBe(
        "Prompt must be at least 10 characters"
      );
      expect(errors[3].textContent).toBe("Select a model");
      expect(errors[4].textContent).toBe(
        "Result example must be at least 10 characters"
      );
    });

    it("redirect to home page when cancel button is clicked", async () => {
      renderWithProviders(<PromptForm mode="create" onSubmit={mockOnSubmit} />);
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(window.location.pathname).toBe("/");
    });

    it("disable share button when isLoading paramther is false", async () => {
      renderWithProviders(
        <PromptForm mode="create" onSubmit={mockOnSubmit} isLoading={true} />
      );
      const button = screen.getByRole("button", { name: /share/i });
      expect(button.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("PromptForm edit mode", () => {
    it("renders without crashing", () => {
      renderWithProviders(<PromptForm mode="edit" onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/title/i)).toBeDefined();
      expect(screen.getByLabelText(/description/i)).toBeDefined();
      expect(screen.getByLabelText(/prompt/i)).toBeDefined();
      expect(screen.getByLabelText(/result/i)).toBeDefined();
      expect(screen.getByLabelText(/model/i)).toBeDefined();
      expect(
        screen.getByRole("button", { name: /save changes/i })
      ).toBeDefined();
      expect(screen.getByRole("button", { name: /delete/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeDefined();
    });

    it("render all default values successfully", () => {
      renderWithProviders(
        <PromptForm
          mode="edit"
          onSubmit={vi.fn()}
          isLoading={false}
          defaultValues={mockPrompt}
        />
      );
      expect(screen.getByDisplayValue(mockPrompt.title)).toBeDefined();
      expect(screen.getByDisplayValue(mockPrompt.prompt)).toBeDefined();
      expect(screen.getByDisplayValue(mockPrompt.resultExample)).toBeDefined();
      expect(screen.getByDisplayValue(new RegExp(mockPrompt.model, "i")));
    });

    it("disable action buttons when isLoading paramther is false", async () => {
      renderWithProviders(
        <PromptForm mode="edit" onSubmit={mockOnSubmit} isLoading={true} />
      );
      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton.hasAttribute("disabled")).toBe(true);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton.hasAttribute("disabled")).toBe(true);
    });

    it("call onDelte function when delete button is clicked", async () => {
      renderWithProviders(
        <PromptForm
          mode="edit"
          onSubmit={mockOnSubmit}
          isLoading={false}
          onDelete={mockOnDelete}
        />
      );

      const user = userEvent.setup();
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toBeCalled();
    });
  });
});
