import {
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { LoginForm } from "../LoginForm";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("Login Form", () => {

  beforeEach(() => {
    renderWithProviders(<LoginForm />);
  });

  afterEach(cleanup);

  it("Render the form successfuly", () => {
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeDefined();
  });

  it("display errors when fields are empty or with wrong format", async () => {
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText(/The email is required/i)).toBeDefined();
    expect(await screen.findByText(/The password is required/i)).toBeDefined();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "no-email" },
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    expect(await screen.findByText(/Invalid email address/i)).toBeDefined();
  });

  it("Display loading state while submitting", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText(/Loading/i)).toBeDefined();

    await waitFor(() => expect(screen.queryByText(/Loaging/i)).toBeNull());
  });
});
