import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "../components/RegisterForm";
import { Link } from "react-router";

export function RegisterPage() {
  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <RegisterForm />
        </CardContent>
        <CardAction className="px-6">
          <p className="text-center">
            If you have an account already, you can go to{" "}
            <Link className="underline hover:text-accent-foreground/75"  to="/login">Sign In</Link>
          </p>
        </CardAction>
      </Card>
    </div>
  );
}
