import { useParams } from "react-router"
import { PromptCardDetail } from "../components/PromptCardDetail";
import { PromptComments } from "../components/PromptComments";

export function PromptDetail() {
  const params = useParams<{ promptId: string }>();

  return (
    <div className="grid gap-2">
      <PromptCardDetail promptId={params.promptId || ""} />
      <PromptComments promptId={params.promptId || ""}/>
    </div>
  )
}
