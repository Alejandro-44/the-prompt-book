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
    let hashtags: string[] | undefined = url.searchParams.getAll("hashtags");
    hashtags = hashtags.length > 0 ? hashtags : undefined;
    const author_handle = "alex";
    const response = getPaginatedPrompts(promptSummaryMocks, {
      page,
      limit,
      author_handle,
      model,
      hashtags,
    });
    return HttpResponse.json(response, );
  }),
  http.delete("http://127.0.0.1:8000/users/me", async () => {
    return HttpResponse.json({}, { status: 204 });
  }),
  http.get<{ user_handle: string }>(
    "http://127.0.0.1:8000/users/:user_handle",
    async ({ params }) => {
      return HttpResponse.json(users.find((user) => user.handle === params.user_handle));
    }
  ),
  http.get<{ user_handle: string }>(
    "http://127.0.0.1:8000/users/:user_handle/prompts",
    async ({ request, params }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") || 1);
      const limit = Number(url.searchParams.get("limit") || 10);
      const model = url.searchParams.get("model") ?? undefined;
      let hashtags: string[] | undefined = url.searchParams.getAll("hashtags");
      hashtags = hashtags.length > 0 ? hashtags : undefined;
      const user_handle = params.user_handle;
      const response = getPaginatedPrompts(promptSummaryMocks, {
        page,
        limit,
        author_handle: user_handle,
        model,
        hashtags,
      });
      return HttpResponse.json(response);
    }
  ),
];
