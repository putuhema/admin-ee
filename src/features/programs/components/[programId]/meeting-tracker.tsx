import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dot, Loader2 } from "lucide-react";
import { useGetMeetingByProgramsStudents } from "@/features/meeting/queries/get-meeting-by-program-students";

interface MeetingTrackerProps {
  monthYear: { month: number; year: number };
  programId: number | undefined;
  studentId: number | undefined;
}

export default function MeetingTracker({
  monthYear,
  studentId,
  programId,
}: MeetingTrackerProps) {
  const { data, isLoading } = useGetMeetingByProgramsStudents({
    monthYear,
    programId,
    studentId,
  });

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    );
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <>
      <div className="text-sm inline-flex items-center text-muted-foreground">
        {data.attendance}/{data.count} <Dot /> {data.attendanceRate}% Pertemuan
      </div>
      <div className="flex  items-center ">
        {data.meetings.map((meeting, idx) => (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "w-6 h-6 border",
                    meeting.attendance
                      ? "bg-green-400 border-green-500"
                      : "bg-secondary",
                  )}
                ></button>
              </TooltipTrigger>
              {meeting.attendance && (
                <TooltipContent defaultValue={0}>
                  <p className="text-sm">
                    {format(new Date(meeting.startTime!), "PP")}
                  </p>
                  <p className="capitalize">
                    Mr. {meeting?.tutorName?.split(" ")[0]}
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </>
  );
}
