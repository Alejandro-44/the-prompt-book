import { Skeleton } from "@/components/ui/skeleton";

export function UserCardSkeleton() {
  return (
    <article className="border-b px-4 py-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
