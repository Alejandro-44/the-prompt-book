import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function useLoginForm() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    criteriaMode: "all",
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    }
  });
}
