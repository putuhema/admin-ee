import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function DetailsSkeleton() {
  return (
    <section className="w-full space-y-2 p-4 font-mono">
      <div className="border border-b border-dashed" />
      <div className="uppercase flex items-center justify-center gap-4 tracking-widest text-center font-extrabold">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="border border-b border-dashed" />
      <Skeleton className="h-6 w-36 mx-auto" />

      <div className="w-full grid grid-cols-2 gap-y-2 gap-x-8">
        <Skeleton className="h-4 w-24 col-span-2" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="border border-b border-dashed" />
      <div className="border border-b border-dashed" />
      <div className="w-full grid grid-cols-2 gap-y-2 gap-x-8">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-28" />
      </div>
    </section>
  );
}
