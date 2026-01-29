import type { PrivateUser } from "@/services";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";
import { UserForm } from "../UserForm";
import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUser: PrivateUser = {
  id: "1",
  username: "john",
  handle: "john",
  email: "john@test.com",
  isActive: true,
};

const onSubmit = vi.fn();
const onCancel = vi.fn();
const onDelete = vi.fn();

describe("UserForm", () => {
  afterEach(() => {
    cleanup;
    cleanup();
    vi.clearAllMocks();
  });

  it("renders form with default user values", () => {
    renderWithProviders(
      <UserForm
        user={mockUser}
        handleSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={false}
        error={null}
      />,
    );
    expect(screen.getByDisplayValue("john")).toBeDefined();
    expect(screen.getByDisplayValue("john@test.com")).toBeDefined();
  });

  it("submits updated user data", async () => {
    renderWithProviders(
      <UserForm
        user={mockUser}
        handleSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={false}
        error={null}
      />,
    );
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/username/i));
    await user.type(screen.getByLabelText(/username/i), "jane");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        username: "jane",
        email: "john@test.com",
      });
    });
  });

  it("does not submit if form is invalid", async () => {
    renderWithProviders(
      <UserForm
        user={mockUser}
        handleSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={false}
        error={null}
      />,
    );
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "not-an-email");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("calls onCancel when cancel button is clicked", async () => {
    renderWithProviders(
      <UserForm
        user={mockUser}
        handleSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={false}
        error={null}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("disables buttons and shows loading when pending", () => {
    renderWithProviders(
      <UserForm
        user={mockUser}
        handleSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={true}
        error={null}
      />,
    );

    const actionButtons = screen.getAllByRole("button", { name: /loading/i });

    actionButtons.forEach((button) =>
      expect(button).toHaveProperty("disabled", true),
    );
  });

  it("renders error alert when error is present", () => {
    renderWithProviders(
      <UserForm
        user={mockUser}
        handleSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={true}
        error={new Error("Something went wrong")}
      />,
    );

    expect(screen.getByText("Something went wrong")).toBeDefined();
  });
});
