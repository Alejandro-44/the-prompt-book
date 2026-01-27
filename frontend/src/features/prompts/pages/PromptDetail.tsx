import { useParams } from "react-router"
import { PromptCardDetail } from "../components/PromptCardDetail";
import { PromptComments } from "../components/PromptComments";

export function PromptDetail() {
  const { promptId } = useParams();

  return (
    <div className="grid max-w-4xl mx-auto gap-2">
      <PromptCardDetail promptId={promptId || ""} />
      <PromptComments promptId={promptId || ""}/>
    </div>
  )
}
