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
          <h1 className="text-xl font-bold text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-bold text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-bold text-foreground">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-2 text-foreground">{children}</p>,
        th: ({ children }) => (
          <th className="border px-3 py-2 text-left bg-muted font-medium">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="border px-3 py-2">{children}</td>,
        hr: () => <hr className="my-6 border-foreground" />,
        pre: ({ children }) => (
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-auto">
            <div className="mx-auto max-w-4xl px-4">
              <pre className="rounded-lg bg-muted p-4 text-sm">{children}</pre>
            </div>
          </div>
        ),
        code: ({ children }) => (
          <code className="font-mono text-sm">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
