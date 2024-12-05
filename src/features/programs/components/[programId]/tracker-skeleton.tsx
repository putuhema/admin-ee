import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function TrackerSkeleton() {
  return (
    <div className="space-y-1 py-1">
      <Skeleton className="h-3 w-36" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
  );
}
