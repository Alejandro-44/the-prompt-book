import { useNavigate } from "react-router";

export function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-6xl font-bold mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
      <p className="text-base mb-4">
        You do not have permission to access this page.
      </p>
      <p className="text-base mb-4">
        Login with your account to continue or create a new account if you don't have one.
      </p>
      <div className="grid gap-y-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
