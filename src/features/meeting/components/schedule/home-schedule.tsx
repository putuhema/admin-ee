"use client";

import React from "react";

import { useGetMeetingByDate } from "@/features/meeting/queries/get-meeting-by-date";
import { Separator } from "@/components/ui/separator";
import ClaimButton from "./claim-button";
import { cn } from "@/lib/utils";
import HomeScheduleSkeleton from "./home-schedule-skeleton";
import CurrentTeacher from "./current-teacher";
import { pusherClient } from "@/lib/pusher";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export const PROGRAM_COLOR = {
  abama: {
    box: "border-blue-300",
    text: "text-blue-500",
  },
  calistung: {
    box: "border-lime-300",
    text: "text-lime-500",
  },
  cermat: {
    box: "border-teal-300",
    text: "text-teal-500",
  },
  prisma: {
    box: "border-green-300 ",
    text: "text-green-500",
  },
  ["english basic"]: {
    box: "border-violet-300",
    text: "text-violet-500",
  },
  ["english elementary"]: {
    box: "border-fuchsia-300",
    text: "text-fuchsia-500",
  },
  ["english ski&efc"]: {
    box: "border-pink-300",
    text: "text-pink-500",
  },
  lkom: {
    box: "border-indigo-300 ",
    text: "text-indigo-500",
  },
  mathe: {
    box: "border-emerald-300 ",
    text: "text-emerald-500",
  },
  private: {
    box: "border-amber-300 ",
    text: "text-amber-500",
  },
} as const;

export type PC = keyof typeof PROGRAM_COLOR;

export default function Schedule() {
  const { data: meetings, isLoading } = useGetMeetingByDate(new Date());

  const queryClient = useQueryClient();

  React.useEffect(() => {
    pusherClient.subscribe("meeting");

    pusherClient.bind("claimed-meeting", () => {
      queryClient.invalidateQueries({
        queryKey: ["meetings", format(new Date(), "yyyy-MM-dd"), "all"],
      });
    });

    return () => pusherClient.unsubscribe("meeting");
  }, []);

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
        {meetings.map((meeting, idx) => {
          return (
            <div key={idx} className={cn("flex items-center p-2")}>
              <div className="w-full">
                <span
                  className={cn(
                    "text-sm uppercase  inline-flex gap-2 items-center",
                  )}
                >
                  {meeting.studentNickname}
                </span>
                <span className="text-sm ml-2">({meeting.studentName})</span>
                <div className="space-y-2">
                  {meeting.programGroups.map((mp) => (
                    <div
                      key={mp.programName}
                      className={cn(
                        "text-xs w-full grid grid-cols-3 gap-2 p-2 border rounded-md",
                        PROGRAM_COLOR[mp.programName as PC].box,
                        PROGRAM_COLOR[mp.programName as PC].text,
                        mp.status === "completed" &&
                          "border-border text-muted-foreground",
                      )}
                    >
                      <p className="capitalize">{mp.programName}</p>
                      <div className="flex items-center">
                        <p>{format(new Date(mp.startTime), "hh:mm a")}</p>
                        <p>-</p>
                        <p>{format(new Date(mp.endTime), "hh:mm a")}</p>
                      </div>
                      {!mp.status ? (
                        <div className="inline-flex justify-center items-center">
                          <ClaimButton meetings={mp.details} />
                        </div>
                      ) : (
                        <div>
                          <CurrentTeacher
                            status={mp.status}
                            meetings={mp.details}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
