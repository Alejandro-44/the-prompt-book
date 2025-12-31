import { delay, http, HttpResponse } from "msw";
import { comments, promptMocks, promptSummaryMocks } from "../data/mocks";
import type { PromptCommentCreateDTO, PromptCreateDTO } from "@/services/prompts/prompts.dto";

export const promptsHandlers = [
  http.get("http://127.0.0.1:8000/prompts/", async ({ request }) => {
    const url = new URL(request.url);
 
    const page = parseInt(url.searchParams.get('page') || "1");
    const limit = parseInt(url.searchParams.get('limit') || "10");
    const model = url.searchParams.get('model');
    const tags = url.searchParams.get('tags');

    const skip = (page - 1) * limit
    const total = promptSummaryMocks.length;
    const pages = Math.ceil(total / limit)

    const end = skip + limit > 18 ? 18: skip + limit;
    const prompts = promptSummaryMocks.slice(skip, end).filter((prompt) => {
      let isValid = true
      if (model) {
        isValid = prompt.model === model
      }
      if (tags) {
        isValid = prompt.tags.some((promptTags) => tags.includes(promptTags));
      }
      return isValid;
    })
    return HttpResponse.json({
      items: prompts,
      total,
      page,
      limit,
      pages
    });
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
          { status: 404 }
        );
      }
      return HttpResponse.json(prompt);
    }
  ),
  http.post<{}, PromptCreateDTO>(
    "http://127.0.0.1:8000/prompts/",
    async ({ request }) => {
      const prompt = await request.json();

      if (!prompt.title || !prompt.prompt || !prompt.model) {
        return HttpResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      if (prompt.tags && !Array.isArray(prompt.tags)) {
        return HttpResponse.json(
          { message: "Tags must be an array" },
          { status: 400 }
        );
      }

      return HttpResponse.json(
        {
          message: "Prompt created sucessfully",
          id: "mockedid789456",
        },
        { status: 201 }
      );
    }
  ),
  http.patch<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id",
    async ({ request, params }) => {
      const updatedData = await request.json();

      const updatedPrompt = promptMocks.find(
        (prompt) => prompt.id === params.id
      );
      if (!updatedPrompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 }
        );
      }

      Object.assign(updatedPrompt, updatedData);

      return HttpResponse.json({}, { status: 201 });
    }
  ),
  http.delete<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id",
    async ({ params }) => {
      const prompt = promptMocks.find((prompt) => prompt.id === params.id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 }
        );
      }
      promptMocks.splice(promptMocks.indexOf(prompt), 1);

      return HttpResponse.json({}, { status: 204 });
    }
  ),
  http.get<{ id: string }>(
    "http://127.0.0.1:8000/prompts/:id/comments",
    ({ params }) => {
      const prompt = promptMocks.find((prompt) => prompt.id === params.id);
      if (!prompt) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 }
        );
      }
      const promptComments = comments.filter(
        (comment) => comment.prompt_id === params.id
      );
      return HttpResponse.json(promptComments);
    }
  ),
  http.post<{ id: string }, PromptCommentCreateDTO>(
    "http://127.0.0.1:8000/prompts/:id/comments",
    async ({ params, request }) => {
      const promptExists = promptMocks.some(
        (prompt) => prompt.id === params.id
      );
      if (!promptExists) {
        return HttpResponse.json(
          { message: "Prompt not found" },
          { status: 404 }
        );
      }
      const body = await request.json();
      comments.push({
        id: "jkl-101112",
        author: "johndoe",
        prompt_id: params.id,
        content: body.content,
        pub_date: Date()
      });
      return HttpResponse.json({}, { status: 201 });
    }
  ),
];
