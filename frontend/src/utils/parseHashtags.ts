type TextPart =
  | { type: "text"; value: string }
  | { type: "hashtag"; value: string }

const HASHTAG_REGEX = /(?<!\w)#([a-zA-Z0-9_]+)/g

export function parseHashtags(text: string): TextPart[] {
  const parts: TextPart[] = []
  let lastIndex = 0

  for (const match of text.matchAll(HASHTAG_REGEX)) {
    const index = match.index!
    const value = match[0]

    if (index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, index),
      })
    }

    parts.push({ type: "hashtag", value })
    lastIndex = index + value.length
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    })
  }

  return parts
}
