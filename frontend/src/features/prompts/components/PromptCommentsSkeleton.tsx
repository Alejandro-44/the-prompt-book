import { Skeleton } from "@/components/ui/skeleton";

export function PromptCommentsSkeleton() {
  return (
    <section className="py-6">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="space-y-4 mb-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </section>
  );
}
