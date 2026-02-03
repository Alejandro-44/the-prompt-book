import { parseHashtags } from "@/utils"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router"

interface HashtagTextProps {
  text: string
}

export function HashtagText({ text }: HashtagTextProps) {
  const parts = parseHashtags(text)
  const navitage = useNavigate()
  const onClick = (value: string) => {
    navitage(`/explore?search=${value}`)
  }
  return (
    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.type === "hashtag" ? (
          <span
            key={i}
            className={cn(
              "font-medium text-blue-500 cursor-pointer",
              "hover:underline"
            )}
            onClick={() => onClick(part.value.slice(1))}
          >
            {part.value}
          </span>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </p>
  )
}
