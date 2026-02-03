import { Tag } from "./Tag";

type PromptTagsProps = {
  hashtags: string[];
};

export function PromptTags({ hashtags }: PromptTagsProps) {
  return (
    <div className="flex gap-2 truncate">
      {hashtags.map((hashtag) => (
        <Tag key={hashtag} hashtag={hashtag} />
      ))}
    </div>
  );
}
