interface TagProps {
  hashtag: string;
  onClick?: (tag: string) => void;
}

export const Tag = ({ hashtag, onClick }: TagProps) => {
  return (
    <span
      role="hashtag"
      onClick={() => onClick?.(hashtag)}
      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
    >
      {hashtag}
    </span>
  );
};
