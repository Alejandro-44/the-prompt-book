import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { useUpdateUser, useDeleteUser } from "../../hooks";
import { useUserStore } from "../../contexts";

vi.mock("../../hooks", () => ({
  useUpdateUser: vi.fn(),
  useDeleteUser: vi.fn(),
}));

vi.mock("../../contexts", () => ({
  useUserStore: vi.fn(),
}));

describe("UserEditDialog", () => {
  const mutateMock = vi.fn();
  const deleteMock = vi.fn();

  beforeEach(async () => {
    vi.resetModules(); // 🔑 MUY IMPORTANTE
    vi.clearAllMocks();

    vi.doMock("../UserForm", () => ({
      UserForm: ({ handleSubmit, onCancel, onDelete }: any) => (
        <div>
          <button onClick={() => handleSubmit({ name: "John" })}>submit</button>
          <button onClick={onCancel}>cancel</button>
          <button onClick={onDelete}>delete</button>
        </div>
      ),
    }));

    (useUserStore as any).mockReturnValue({
      user: { id: "1", username: "john" },
    });

    (useUpdateUser as any).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });

    (useDeleteUser as any).mockReturnValue({
      mutate: deleteMock,
    });
  });

  it("opens dialog on click", async () => {
    const { UserEditDialog } = await import("../UserEditDialog");

    renderWithProviders(<UserEditDialog />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    expect(screen.getByText(/Make changes to your profile here/)).toBeDefined();
  });

  it("submits form and closes dialog", async () => {
    const { UserEditDialog } = await import("../UserEditDialog");

    renderWithProviders(<UserEditDialog />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    await user.click(screen.getByRole("button", { name: "submit" }));

    expect(mutateMock).toHaveBeenCalledWith({ name: "John" });
    expect(screen.queryByText(/Make changes to your profile here/)).toBeNull();
  });

  it("closes dialog on cancel", async () => {
    const { UserEditDialog } = await import("../UserEditDialog");
    renderWithProviders(<UserEditDialog />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    await user.click(screen.getByRole("button", { name: "cancel" }));

    expect(screen.queryByText(/Make changes to your profile here/)).toBeNull();
  });

  it("calls delete user and closes dialog", async () => {
    const { UserEditDialog } = await import("../UserEditDialog");
    renderWithProviders(<UserEditDialog />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    await user.click(screen.getByRole("button", { name: "delete" }));

    expect(deleteMock).toHaveBeenCalled();
    expect(screen.queryByText(/Make changes to your profile here/)).toBeNull();
  });
});
