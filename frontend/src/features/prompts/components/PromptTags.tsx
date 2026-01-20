import { Tag } from "./Tag";

type PromptTagsProps = {
  hashtags: string[];
};

export function PromptTags({ hashtags }: PromptTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((hashtag) => (
        <Tag key={hashtag} hashtag={hashtag} />
      ))}
    </div>
  );
}
