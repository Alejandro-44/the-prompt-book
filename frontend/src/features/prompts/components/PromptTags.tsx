import { Tag } from "./Tag";

type PromptTagsProps = {
  hashtags: string[];
};

export function PromptTags({ hashtags }: PromptTagsProps) {
  const visible = hashtags.slice(0, 3);
  const remaining = hashtags.length - visible.length;

  return (
    <div className="flex flex-wrap gap-2 max-h-6 sm:max-w-full overflow-hidden">
      {hashtags.map((hashtag) => (
        <Tag key={hashtag} hashtag={hashtag} />
      ))}

      {remaining > 0 && (
        <span className="text-sm text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
}
