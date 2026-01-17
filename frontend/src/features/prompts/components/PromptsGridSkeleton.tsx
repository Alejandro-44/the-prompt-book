import { Skeleton } from "@/components/ui/skeleton";

export function PromptsGridSkeleton() {
  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="relative bg-card group p-4 h-full">
          <div className="flex h-full items-start gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="min-w-0  w-full flex flex-col items-stretch">
              <div className="flex items-center gap-2 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 mt-2" />
              <Skeleton className="h-4 mt-2" />
              <div>
                <Skeleton className="h-6 w-16 mt-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
