import { Outlet, useParams } from "react-router";
import { useAuth, useRedirectOn } from "../hooks";
import { usePrompt } from "@/features/prompts/hooks/usePrompt";
import { LoadingPage } from "@/pages/LoadingPage";

export function PromptOwnerGuard() {
  const params = useParams();
  const promptId = params.promptId || "";
  const { user } = useAuth();
  const {
    data: prompt,
    isLoading: isLoadingPrompt,
    error: promptError,
  } = usePrompt({ promptId });
  
  useRedirectOn({when: promptError?.status === 404, to: "/404"});
  useRedirectOn({when: prompt! && prompt.authorId !== user!.id, to: "/403"});

  if (isLoadingPrompt) {
    return <LoadingPage />;
  }

  return <Outlet context={{ prompt }} />;
}
