import type { UserCreate, UserLogin } from "@/services";
import { delay, http, HttpResponse } from "msw";
import { users } from "../data/mocks";

export const authHandlers = [
  http.post("http://127.0.0.1:8000/auth/register", async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as UserCreate;
    if (users.some((user) => user.email === body.email)) {
      return HttpResponse.json(
        { detail: "Email already registered" },
        { status: 409 }
      );
    }

    users.push({
      id: "new-user-id",
      username: body.username,
      email: body.email,
      hashed_password: body.password,
      is_active: true,
    });

    return HttpResponse.json({
      id: "new-user-id",
      username: body.username,
      is_active: true,
    }, { status: 201 });
  }),
  http.post("http://127.0.0.1:8000/auth/login", async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as UserLogin;
    if (!users.some((user) => user.email === body.email && user.hashed_password === body.password)) {
      return HttpResponse.json(
        { detail: "Invalid credentials" },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      access_token: "mocked-jwt-token",
      token_type: "bearer",
    });
  }),
  http.post("http://127.0.0.1:8000/auth/logout", async () => {
    await delay(100);
    return HttpResponse.json({}, { status: 204 });
  }),
];
