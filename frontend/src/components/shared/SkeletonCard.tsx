import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="border-3 border-black bg-white rounded-2xl shadow-[4px_4px_0px_0px_#000000] overflow-hidden dark:bg-zinc-900">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-6 w-full mb-2 bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-6 w-4/5 mb-4 bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-4 w-full mb-1 bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-4 w-3/4 mb-4 bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </CardContent>
    </Card>
  );
}
