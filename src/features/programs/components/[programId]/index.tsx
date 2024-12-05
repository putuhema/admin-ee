"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import MeetingTracker from "./meeting-tracker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetEnrollmentProgram } from "@/features/enrollment/queries/get-enrollment-by-program";
import MeetingProgramSkeleton from "./meeting-program-skeleton";

interface MeetingProgramProps {
  programId: string;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MeetingProgramPage({ programId }: MeetingProgramProps) {
  const { data: programs, isLoading } = useGetEnrollmentProgram(
    Number(programId),
  );

  if (isLoading) {
    return <MeetingProgramSkeleton />;
  }

  if (!programs) {
    return (
      <div className="text-center text-muted-foreground">Program not found</div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="inline-flex justify-between items-center w-full">
        <h1 className="uppercase">{programs[0].program!.name}</h1>
        <div className="inline-flex items-center gap-2">
          <Button variant="outline">
            <ChevronLeft />
          </Button>
          <p>{monthNames[new Date().getMonth()]}</p>
          <Button variant="outline">
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div>
        <div
          role="table"
          className="flex w-full  rounded-md py-2 uppercase font-bold border-b"
        >
          <div className="p-2">#</div>
          <div className="w-52 p-2">Nama Murid</div>
          <div className="p-2 flex-1">Kehadiran</div>
        </div>
        <div className="w-full">
          {programs.map((p, idx) => (
            <div
              key={p.enrollment.id}
              className={cn(
                "flex w-full bg-background rounded-md",
                idx % 2 !== 0 && "bg-secondary",
              )}
            >
              <div className="p-2">{idx + 1}</div>
              <div className="w-52 p-2">{p.student?.name}</div>
              <div className="p-2 flex-1">
                <MeetingTracker
                  programId={p.program?.id}
                  studentId={p.student?.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
