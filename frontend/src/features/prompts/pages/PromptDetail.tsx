import { useParams } from "react-router"
import { PromptCardDetail } from "../components/PromptCardDetail";
import { PromptComments } from "../components/PromptComments";

export function PromptDetail() {
  const { promptId } = useParams();

  return (
    <div className="container max-w-4xl grid gap-2">
      <PromptCardDetail promptId={promptId || ""} />
      <PromptComments promptId={promptId || ""}/>
    </div>
  )
}
