import React from "react";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeScheduleSkeleton() {
  return (
    <section className="max-w-xl mx-auto">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Separator className="my-6" />
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 gap-2 border rounded-md p-2"
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-2 w-24" />
              <Skeleton className="h-2 w-24" />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-8" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
