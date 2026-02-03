import { ExternalLink, FileIcon } from "lucide-react";
import { getMediaType, getYoutubeId } from "@/utils/media";

interface MediaPreviewProps {
  url?: string;
  altText?: string;
}

export function MediaPreview({ url, altText = "Media content" }: MediaPreviewProps) {
  const type = getMediaType(url);

  if (type === 'none' || !url) return null;

  if (type === 'image') {
    return (
      <div className="overflow-hidden rounded-lg border bg-muted">
        <img 
          src={url} 
          alt={altText} 
          className="w-full h-auto object-cover" 
          loading="lazy"
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="overflow-hidden rounded-lg border bg-black">
        <video controls className="w-full max-h-[500px]" playsInline>
          <source src={url} />
          Tu navegador no soporta el tag de video.
        </video>
      </div>
    );
  }

  if (type === 'youtube') {
    const videoId = getYoutubeId(url);
    return (
      <div className="overflow-hidden rounded-lg border bg-muted aspect-video relative">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group"
    >
      <div className="p-2 bg-background rounded-md border group-hover:border-primary/50 transition-colors">
        <FileIcon className="size-6 text-muted-foreground" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-medium truncate text-sm">Link to extenal resource</p>
        <p className="text-xs text-muted-foreground truncate">{url}</p>
      </div>
      <ExternalLink className="size-4 text-muted-foreground" />
    </a>
  );
}
