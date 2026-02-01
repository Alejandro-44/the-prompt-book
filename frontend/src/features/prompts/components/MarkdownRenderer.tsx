import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="font-bold text-foreground">{children}</h1>
        ),
        p: ({ children }) => <p className="mb-2 text-foreground">{children}</p>,
        code: ({ children }) => (
          <code className="bg-background px-1 rounded">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
