interface TagProps {
  hashtag: string;
  onClick?: (tag: string) => void;
}

export const Tag = ({ hashtag, onClick }: TagProps) => {
  return (
    <span
      role="hashtag"
      onClick={() => onClick?.(hashtag)}
      className="
        inline-flex
        items-center
        max-w-48
        truncate
        rounded-full
        bg-secondary
        px-2.5 py-0.5
        text-sm font-medium"
    >
      {hashtag}
    </span>
  );
};
