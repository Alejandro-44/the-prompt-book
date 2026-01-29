import { render, screen, fireEvent } from "@testing-library/react";
import { UserMenu } from "../UserMenu";
import userEvent from "@testing-library/user-event";

// Mock the hooks
vi.mock("@/features/auth/hooks", () => ({
  useAuth: vi.fn(),
  useLogout: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const { useAuth, useLogout } = await import("@/features/auth/hooks");
const { useNavigate } = await import("react-router");

describe("UserMenu", () => {
  const mockNavigate = vi.fn();
  const mockLogoutMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useLogout as any).mockReturnValue({ mutate: mockLogoutMutate });
  });

  describe("when user is not authenticated", () => {
    beforeEach(() => {
      (useAuth as any).mockReturnValue({ user: null });
    });

    it("renders sign in and sign up buttons", () => {
      render(<UserMenu />);

      expect(screen.getByText("Sign In")).toBeDefined();
      expect(screen.getByText("Sign Up")).toBeDefined();
    });

    it("navigates to /login when sign in button is clicked", () => {
      render(<UserMenu />);

      const signInButton = screen.getByText("Sign In");
      fireEvent.click(signInButton);

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("navigates to /register when sign up button is clicked", () => {
      render(<UserMenu />);

      const signUpButton = screen.getByText("Sign Up");
      fireEvent.click(signUpButton);

      expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
  });

  describe("when user is authenticated", () => {
    const mockUser = { handle: "johndoe" };

    beforeEach(() => {
      (useAuth as any).mockReturnValue({ user: mockUser });
    });

    it("renders user avatar with initials", () => {
      render(<UserMenu />);

      expect(screen.getByText("JO")).toBeDefined();
    });

    it("renders profile and logout menu items", async () => {
      render(<UserMenu />);
      const user = userEvent.setup();

      const avatar = screen.getByText("JO");

      await user.click(avatar)

      expect(screen.getByText("Profile")).toBeDefined();
      expect(screen.getByText("Logout")).toBeDefined();
    });

    it("navigates to /users/me when profile menu item is clicked", async () => {
      render(<UserMenu />);
      const user = userEvent.setup();

      const avatar = screen.getByText("JO");
      await user.click(avatar)

      const profileItem = screen.getByRole("menuitem", { name: /profile/i });
      await user.click(profileItem)

      expect(mockNavigate).toHaveBeenCalledWith("/users/me");
    });

    it("calls logout mutate and navigates to / when logout menu item is clicked", async () => {
      render(<UserMenu />);
      const user = userEvent.setup();

      const avatar = screen.getByText("JO");
      await user.click(avatar)

      const logoutItem = screen.getByText("Logout");
      await user.click(logoutItem)

      expect(mockLogoutMutate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
