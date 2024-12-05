import React from "react";
import { LoaderPinwheel } from "lucide-react";

export default function MeetingProgramSkeleton() {
  return (
    <section className="w-screen h-screen flex items-center justify-center">
      <LoaderPinwheel className="animate-spin text-muted-foreground" />
    </section>
  );
}
