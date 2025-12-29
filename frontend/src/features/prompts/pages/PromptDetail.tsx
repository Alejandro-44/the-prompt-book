import { useParams } from "react-router"
import { PromptCardDetail } from "../components/PromptCardDetail";
import { PromptComments } from "../components/PromptComments";

export function PromptDetail() {
  const params = useParams<{ promptId: string }>();

  return (
    <>
      <PromptCardDetail promptId={params.promptId || ""} />
      <PromptComments promptId={params.promptId || ""}/>
    </>
  )
}
