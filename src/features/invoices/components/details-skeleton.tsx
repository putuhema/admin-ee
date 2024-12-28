import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function DetailsSekeleton() {
  return (
    <div className="border-t border-b py-4  border-dashed">
      <Skeleton className="w-36 h-8" />
      <div className="border-b py-2 space-y-2">
        <Skeleton className="w-28 h-4" />
        <div className="grid grid-cols-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="grid grid-cols-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="grid grid-cols-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="grid grid-cols-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-10 mt-4" />
    </div>
  );
}
