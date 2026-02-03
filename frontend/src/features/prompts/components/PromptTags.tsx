import { Tag } from "./Tag";

type PromptTagsProps = {
  hashtags: string[];
};

export function PromptTags({ hashtags }: PromptTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 max-h-6 max-w-52 sm:max-w-full overflow-hidden">
      {hashtags.map((hashtag) => (
        <Tag key={hashtag} hashtag={hashtag} />
      ))}
    </div>
  );
}
