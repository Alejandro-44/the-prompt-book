import { renderHookWithClient } from "@/tests/utils/renderHookWithClient";
import { useLikePrompt } from "../useLikePrompt";
import { act, waitFor } from "@testing-library/react";
import type { Prompt } from "@/services";
import { server } from "@/tests/mocks/server";
import { http, HttpResponse } from "msw";

const mockPrompt = {
  id: "69398c1d5393462cecf974c8",
  title: "Code documentation generator",
  description:
    "Technical prompt for generating code documentation using the JSDoc standard. #JavaScript",
  prompt: "Document the following function in JSDoc format: {{code}}",
  resultExample: "/** Calculates total price... */",
  mediaUrl: "",
  model: "gpt-4o",
  hashtags: ["javascript"],
  pubDate: "2024-02-22T09:12:00",
  likesCount: 10,
  likeByMe: false,
  authorId: "6939876c7f7a423bcb83fe0e",
  authorName: "creative_io",
  authorHandle: "creative_io",
};

const queryKey = ["prompt", mockPrompt.id];

describe("useLikePrompt", () => {
  it("updates cache optimistically immediately after mutation called", async () => {
    const { result, queryClient } = renderHookWithClient(() =>
      useLikePrompt({ promptId: mockPrompt.id }),
    );

    queryClient.setQueryData(queryKey, mockPrompt);

    await act(async () => {
      await result.current.mutateAsync(false);
    });

    await waitFor(() => {
      const optimistic = queryClient.getQueryData<Prompt>(queryKey);
      expect(optimistic?.likesCount).toBe(11);
    });
  });

  it("optimistically unlikes a prompt", async () => {
    const { result, queryClient } = renderHookWithClient(() =>
      useLikePrompt({ promptId: mockPrompt.id }),
    );

    queryClient.setQueryData(queryKey, mockPrompt);

    await act(async () => {
      await result.current.mutateAsync(true);
    });

    await waitFor(() => {
      const optimistic = queryClient.getQueryData<Prompt>(queryKey);
      expect(optimistic?.likesCount).toBe(9);
      expect(optimistic?.likeByMe).toBe(false);
    });
  });

  it("handles rapid toggles correctly", async () => {
    const { result, queryClient } = renderHookWithClient(() =>
      useLikePrompt({ promptId: mockPrompt.id }),
    );

    queryClient.setQueryData(queryKey, mockPrompt);

    await act(async () => {
      await result.current.mutateAsync(false);
      await result.current.mutateAsync(true);
    });

    await waitFor(() => {
      const optimistic = queryClient.getQueryData<Prompt>(queryKey);
      expect(optimistic?.likesCount).toBe(10);
      expect(optimistic?.likeByMe).toBe(false);
    });
  });

  it("rolls back optimistic update on error", async () => {
    server.use(
      http.post("http://127.0.0.1:8000/prompts/:id/like", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const { result, queryClient } = renderHookWithClient(() =>
      useLikePrompt({ promptId: mockPrompt.id }),
    );

    queryClient.setQueryData(queryKey, mockPrompt);

    await act(async () => {
      await expect(result.current.mutateAsync(false)).rejects.toBeDefined();
    });

    await waitFor(() => {
      const optimistic = queryClient.getQueryData<Prompt>(queryKey);
      expect(optimistic?.likesCount).toBe(10);
      expect(optimistic?.likeByMe).toBe(false);
    });
  });
});
