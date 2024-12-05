import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useGetMeetingByProgramsStudents } from "@/features/meeting/queries/get-meeting-by-program-students";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dot } from "lucide-react";
import TrackerSkeleton from "./tracker-skeleton";

interface MeetingTrackerProps {
  programId: number | undefined;
  studentId: number | undefined;
}

export default function MeetingTracker({
  studentId,
  programId,
}: MeetingTrackerProps) {
  const { data, isLoading } = useGetMeetingByProgramsStudents({
    programId,
    studentId,
  });

  if (isLoading) {
    return <TrackerSkeleton />;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <>
      <div className="text-sm inline-flex items-center">
        {data.attendance}/{data.count} <Dot /> {data.attendanceRate}% Pertemuan
      </div>
      <div className="flex  items-center gap-1">
        {data.meetings.map((meeting, idx) => (
          <Popover key={idx}>
            <PopoverTrigger disabled={!meeting.attendance}>
              <div
                className={cn(
                  "w-8 h-8 rounded-md",
                  meeting.attendance ? "bg-green-400" : "bg-red-300",
                )}
              ></div>
            </PopoverTrigger>
            <PopoverContent className="bg-white/70 w-max backdrop-blur-md">
              <p className="text-sm text-muted-foreground">
                {format(new Date(meeting.startTime!), "PP")}
              </p>
              <p className="capitalize">
                Mr. {meeting?.tutorName?.split(" ")[0]}
              </p>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </>
  );
}
