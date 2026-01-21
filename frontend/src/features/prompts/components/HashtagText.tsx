import { parseHashtags } from "@/utils"
import { cn } from "@/lib/utils"

interface HashtagTextProps {
  text: string
}

export function HashtagText({ text }: HashtagTextProps) {
  const parts = parseHashtags(text)
  console.log(parts)
  return (
    <p className="text-muted-foreground leading-relaxed">
      {parts.map((part, i) =>
        part.type === "hashtag" ? (
          <span
            key={i}
            className={cn(
              "font-medium text-blue-500 cursor-pointer",
              "hover:underline"
            )}
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
