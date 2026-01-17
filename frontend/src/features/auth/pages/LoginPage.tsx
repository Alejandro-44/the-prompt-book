import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "../components/LoginForm";
import { Link } from "react-router";

export function LoginPage() {
  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardDescription className="px-6">
          <LoginForm />
        </CardDescription>
        <CardAction className="px-6">
          <p className="text-center">
            Don&apos;t have an account? <Link className="underline hover:text-accent-foreground/75" to="/register">Sign up</Link>
          </p>
        </CardAction>
      </Card>
    </div>
  );
}
