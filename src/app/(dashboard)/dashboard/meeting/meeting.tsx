import * as React from "react";

import { useGetMeetings } from "@/features/meeting/api/get-meeting";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import MeetingItem from "./meeting-item";

export default function MeetingDisplay() {
  const { data: meetings, isLoading: isMeetingsLoading } = useGetMeetings(
    new Date()
  );

  if (isMeetingsLoading) return <div>Loading...</div>;
  if (!meetings) return <div>No meetings</div>;

  return (
    <div className="w-full relative space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Tutoring Schedule</h1>
        <p>{format(new Date(), "dd MMMM yyy")}</p>
      </div>
      <ul>
        {meetings.map((meeting, index) => (
          <div
            key={index}
            className={cn(
              "border p-2 relative",
              index % 2 === 0 && "bg-blue-50 border-blue-100"
            )}
          >
            <p className={cn("capitalize text-lg font-bold")}>
              {meeting.programName}
            </p>
            <div className="pl-4 space-y-1">
              {meeting.meetings.map((m) => (
                <MeetingItem meetingId={m.id} key={m.id} m={m} index={index} />
              ))}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
