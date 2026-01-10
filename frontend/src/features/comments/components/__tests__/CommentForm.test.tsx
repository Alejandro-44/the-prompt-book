import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { CommentForm } from "../CommentForm";
import type { User } from "@/services";

const mockUser: User = {
  id: "1",
  username: "johndoe",
  handle: "johndoe",
  isActive: true,
};

const mockOnSubmit = vi.fn();

describe("CommentForm", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders the form with user avatar, input, and submit button", () => {
    renderWithProviders(
      <CommentForm user={mockUser} onSubmit={mockOnSubmit} />
    );

    expect(screen.getByText("JO")).toBeDefined();
    expect(screen.getByPlaceholderText("Add your comment...")).toBeDefined();
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("calls onSubmit with form data and resets form on submit", async () => {
    renderWithProviders(
      <CommentForm user={mockUser} onSubmit={mockOnSubmit} />
    );

    const input = screen.getByPlaceholderText("Add your comment...");
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "This is a test comment" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: "This is a test comment",
      });
    });

    expect((input as HTMLInputElement).value).toBe("");
  });

  it("does not submit if content is empty", async () => {
    renderWithProviders(
      <CommentForm user={mockUser} onSubmit={mockOnSubmit} />
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
