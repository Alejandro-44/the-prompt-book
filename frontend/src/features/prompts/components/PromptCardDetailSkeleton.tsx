import { Skeleton } from "@/components/ui/skeleton";

export function PromptCardDetailSkeleton() {
  return (
    <article className="py-6 space-y-6">
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
      </header>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </section>
      <section className="space-y-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </section>
    </article>
  );
}
