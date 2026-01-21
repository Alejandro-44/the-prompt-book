import { delay, http, HttpResponse } from "msw";
import { comments, promptMocks, promptSummaryMocks } from "../data/mocks";
import type {
  PromptCommentCreateDTO,
  PromptCreateDTO,
} from "@/services/prompts/prompts.dto";
import { getPaginatedPrompts } from "@/tests/utils/getPaginatedPrompts";

export const promptsHandlers = [
  http.get("http://127.0.0.1:8000/prompts/", async ({ request }) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const model = url.searchParams.get("model") ?? undefined;
    let hashtags: string[] | undefined = url.searchParams.getAll("hashtags");
    hashtags = hashtags.length > 0 ? hashtags : undefined;
    const response = getPaginatedPrompts(promptSummaryMocks, {
      page,
      limit,
      model,
      hashtags,
    });
    return HttpResponse.json(response, { status: 200 });
  }),
  http.get<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id",
    ({ params }) => {
      delay(150);
      const { id } = params;
      const prompt = promptMocks.find((prompt) => prompt.id === id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }
      return HttpResponse.json(prompt, { status: 200 });
    },
  ),
  http.post<{}, PromptCreateDTO>(
    "http://127.0.0.1:8000/prompts/",
    async ({ request }) => {
      const prompt = await request.json();

      if (
        !prompt.title ||
        !prompt.description ||
        !prompt.prompt ||
        !prompt.model ||
        !prompt.result_example
      ) {
        return HttpResponse.json(
          { message: "Missing required fields" },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        {
          message: "Prompt created sucessfully",
          id: "mockedid789456",
        },
        { status: 201 },
      );
    },
  ),
  http.patch<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id",
    async ({ request, params }) => {
      const updatedData = await request.json();

      const updatedPrompt = promptMocks.find(
        (prompt) => prompt.id === params.id,
      );
      if (!updatedPrompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }

      Object.assign(updatedPrompt, updatedData);

      return HttpResponse.json({}, { status: 204 });
    },
  ),
  http.delete<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id",
    async ({ params }) => {
      const prompt = promptMocks.find((prompt) => prompt.id === params.id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }
      promptMocks.splice(promptMocks.indexOf(prompt), 1);

      return HttpResponse.json({}, { status: 204 });
    },
  ),
  http.get<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id/comments",
    ({ params }) => {
      const prompt = promptMocks.find((prompt) => prompt.id === params.id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }
      const promptComments = comments.filter(
        (comment) => comment.prompt_id === params.id,
      );
      return HttpResponse.json(promptComments, { status: 200 });
    },
  ),
  http.post<{ id: string }, PromptCommentCreateDTO>(
    "http://127.0.0.1:8000/prompts/:id/comments",
    async ({ params, request }) => {
      const promptExists = promptMocks.some(
        (prompt) => prompt.id === params.id,
      );
      if (!promptExists) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }
      const body = await request.json();
      comments.push({
        id: "jkl-101112",
        prompt_id: params.id,
        content: body.content,
        author_id: "6939872c7f7a423bcb83fe0b",
        author_name: "alex",
        author_handle: "alex",
        pub_date: Date(),
      });
      return HttpResponse.json({}, { status: 201 });
    },
  ),
  http.post<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id/like",
    async ({ params }) => {
      const prompt = promptMocks.find((prompt) => prompt.id === params.id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }
      prompt.likes_count += 1;
      return HttpResponse.json({}, { status: 201 });
    },
  ),
  http.delete<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id/like",
    async ({ params }) => {
      const prompt = promptMocks.find((prompt) => prompt.id === params.id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 },
        );
      }
      prompt.likes_count -= 1;
      return HttpResponse.json({}, { status: 204 });
    },
  ),
];
