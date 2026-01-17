import { Skeleton } from "@/components/ui/skeleton";

export function PromptsGridSkeleton() {
  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3}, (_, i) => (
        <div key={i} className="relative bg-card group p-4 h-full rounded-2xl">
          <div className="flex h-full items-start gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-full mt-1" />
              <Skeleton className="h-4 w-3/4 mt-2" />
              <div className="mt-auto">
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
