import {
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { RegisterForm } from "../RegisterForm";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

describe("Register Form", () => {
  beforeEach(() => {
    renderWithProviders(<RegisterForm />);
  });

  afterEach(cleanup);

  it("allows a new user to be registered successfuly and navigates to login page", async () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "newUser" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345Test" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login page/i)).toBeDefined();
    });
  });

  it("displays an error message if registration fails", async () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "failuser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345Test" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already registered/i)).toBeDefined();
    });
  });

  it("display validation errors when data is incomplete or has wrong format", async () => {

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(await screen.findByText(/The username is required/i)).toBeDefined();
    expect(await screen.findByText(/The email is required/i)).toBeDefined();
    expect(await screen.findByText(/The password is required/i)).toBeDefined();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "no-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(await screen.findByText(/The email is required/i)).toBeDefined();
  });

  it("display loading message when click on register button", async () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "loadingUser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "loading@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345Test" },
    });

    
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(await screen.findByText("Loading...")).toBeDefined();

    await waitFor(() =>
      expect(screen.getByText(/Login page/i)).toBeDefined()
    );
  });
});
