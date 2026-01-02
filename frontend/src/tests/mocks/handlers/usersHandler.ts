import { http, HttpResponse } from "msw";
import { promptSummaryMocks, users } from "../data/mocks";
import { getPaginatedPrompts } from "@/tests/utils/getPaginatedPrompts";

export const userHandlers = [
  http.get("http://127.0.0.1:8000/users/me", async () => {
    return HttpResponse.json(users[1]);
  }),
  http.get("http://127.0.0.1:8000/users/me/prompts", async ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const model = url.searchParams.get("model") ?? undefined;
    let tags: string[] | undefined = url.searchParams.getAll("tags");
    tags = tags.length > 0 ? tags : undefined;
    const user_id = "6939872c7f7a423bcb83fe0b";
    const response = getPaginatedPrompts(promptSummaryMocks, {
      page,
      limit,
      user_id,
      model,
      tags,
    });
    return HttpResponse.json(response);
  }),
  http.delete("http://127.0.0.1:8000/users/me", async () => {
    return HttpResponse.json({}, { status: 204 });
  }),
  http.get<{ id: string }>(
    "http://127.0.0.1:8000/users/:id",
    async ({ params }) => {
      return HttpResponse.json(users.find((user) => user.id === params.id));
    }
  ),
  http.get<{ id: string }>(
    "http://127.0.0.1:8000/users/:id/prompts",
    async ({ request, params }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);
      const limit = Number(url.searchParams.get("limit") || 10);
      const model = url.searchParams.get("model") ?? undefined;
      let tags: string[] | undefined = url.searchParams.getAll("tags");
      tags = tags.length > 0 ? tags : undefined;
      const user_id = params.id;
      const response = getPaginatedPrompts(promptSummaryMocks, {
        page,
        limit,
        user_id,
        model,
        tags,
      });
      return HttpResponse.json(response);
    }
  ),
];
