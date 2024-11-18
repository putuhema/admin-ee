"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import Table from "./table";

export default function MeetingPage() {
  const { date } = useParams();

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Meeting on</h1>
        <h3 className="text-muted-foreground">
          {format(
            new Date(date!.toString()) ?? new Date(),
            "EEEE, dd MMMM yyy",
          )}
        </h3>
      </div>
      <Table />
    </main>
  );
}
