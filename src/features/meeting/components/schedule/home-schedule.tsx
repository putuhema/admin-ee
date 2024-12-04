"use client";

import React from "react";

import { useGetMeetingByDate } from "@/features/meeting/queries/get-meeting-by-date";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import ClaimButton from "./claim-button";
import CurrentTeacher from "./current-teacher";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import HomeScheduleSkeleton from "./home-schedule-skeleton";

export default function Schedule() {
  const [currentId, setCurrentId] = React.useState<number | null>(null);
  const { data: meetings, isLoading } = useGetMeetingByDate(new Date());

  const [payload, setPayload] = React.useState<any>(null);
  const channel = supabase.channel("meeting-claimed");

  channel
    .on(
      REALTIME_LISTEN_TYPES.BROADCAST,
      { event: "meeting-claimed" },
      (payload) => {
        setPayload(payload);
      },
    )
    .subscribe();

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (!payload || !meetings) return;

    queryClient.invalidateQueries({ queryKey: ["meetings"] });
    queryClient.invalidateQueries({
      queryKey: ["meetings", format(new Date(), "yyyy-MM-dd")],
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [payload, meetings]);

  const handleCurrentId = (id: number) => {
    setCurrentId(id);
  };

  if (isLoading) {
    return <HomeScheduleSkeleton />;
  }

  if (!meetings) {
    return <div>No data found</div>;
  }

  return (
    <section className="max-w-xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl tracking-wider">Meeting Schedule</h1>
        <p>{format(new Date(), "dd/MM/yyy")}</p>
      </div>
      <Separator className="my-6" />
      <div className="space-y-2">
        {meetings.map((meeting) => {
          return (
            <div
              key={meeting.id}
              className={cn(
                "grid grid-cols-3 gap-2 p-2 rounded-md border",
                meeting.meetingSessionStatus === "completed" &&
                  "text-muted-foreground",
                meeting.meetingSessionStatus === "inprogress" &&
                  "border-blue-300",
              )}
            >
              <div>
                <span className="text-sm text-muted-foreground inline-flex gap-2 items-center">
                  {meeting.meetingSessionStatus === "completed" && (
                    <BadgeCheck className="w-4 h-4" />
                  )}
                  {meeting.programName}
                </span>
                <p>{meeting.studentName}</p>
              </div>
              <div>
                <p className="self-end">
                  Sesi{" "}
                  {new Date(meeting.endTime).getHours() -
                    new Date(meeting.startTime).getHours()}{" "}
                  Jam
                </p>
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <p>{format(new Date(meeting.startTime), "hh:mm a")}</p>
                  <p>-</p>
                  <p>{format(new Date(meeting.endTime), "hh:mm a")}</p>
                </div>
              </div>
              {!meeting.tutorId && !meeting.tutorName ? (
                <ClaimButton
                  currentId={currentId}
                  meetingId={meeting.id}
                  handleCurrentId={handleCurrentId}
                />
              ) : (
                <CurrentTeacher
                  status={meeting.meetingSessionStatus}
                  tutorName={meeting.tutorName ?? ""}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
